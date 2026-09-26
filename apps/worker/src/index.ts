import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '../../apps/web/.env' }); // Adjust if needed

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatrasarthi';
const AVIATION_STACK_KEY = process.env.AVIATION_STACK_KEY;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const POLL_INTERVAL_MS = 60000; // Poll every 60 seconds

let client: MongoClient | null = null;

async function checkFlights() {
  console.log(`[FlightTracker] Running check at ${new Date().toISOString()}`);
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
    }
    const db = client.db();

    // Find all confirmed flight nodes (that have not been completed)
    const activeFlights = await db.collection('nodes').find({
      type: 'flight',
      status: 'confirmed'
    }).toArray();

    console.log(`[FlightTracker] Found ${activeFlights.length} active flights to monitor.`);

    for (const flight of activeFlights) {
      const flightNumber = getFlightNumber(flight);
      if (!flightNumber) continue;

      console.log(`[FlightTracker] Checking status for ${flightNumber} (Trip: ${flight.tripId})`);
      
      const delayMin = await fetchFlightDelay(flightNumber);
      
      if (delayMin > 0) {
        console.log(`[FlightTracker] ALERT: Flight ${flightNumber} is delayed by ${delayMin} mins! Triggering disruption.`);
        await reportDisruption(flight.tripId, flight._id.toString(), delayMin);
      } else {
        console.log(`[FlightTracker] Flight ${flightNumber} is on time.`);
      }
    }
  } catch (error) {
    console.error('[FlightTracker] Error running check:', error);
  }
}

// Helper to extract flight number from node (could be in label, vendor, or rawExtract)
function getFlightNumber(node: any): string | null {
  if (node.rawExtract?.flightNumber) return node.rawExtract.flightNumber;
  if (node.rawExtract?.pnr) return node.rawExtract.pnr; // fallback
  const label = typeof node.label === 'object' ? node.label.value : node.label;
  if (label && typeof label === 'string') return label;
  return null;
}

// Fetches delay from AviationStack, or uses a mock if key is missing
async function fetchFlightDelay(flightNumber: string): Promise<number> {
  // If we have an API key, we make the real call
  if (AVIATION_STACK_KEY) {
    try {
      const res = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${AVIATION_STACK_KEY}&flight_iata=${encodeURIComponent(flightNumber)}`);
      const data = await res.json();
      
      if (data && data.data && data.data.length > 0) {
        const flightInfo = data.data[0];
        if (flightInfo.flight_status === 'delayed' || flightInfo.flight_status === 'cancelled') {
          // Calculate delay in minutes based on scheduled vs estimated
          const scheduled = new Date(flightInfo.departure.scheduled).getTime();
          const estimated = new Date(flightInfo.departure.estimated).getTime();
          const diffMins = Math.floor((estimated - scheduled) / 60000);
          return diffMins > 0 ? diffMins : 60; // default 60 min delay if status is delayed but times match
        }
        return 0; // on time
      }
    } catch (e) {
      console.error(`[FlightTracker] AviationStack API error for ${flightNumber}:`, e);
    }
  }

  // --- MOCK FALLBACK ---
  // If no API key, we simulate a delay randomly or based on a keyword for testing
  if (flightNumber.toUpperCase().includes('DELAY')) {
    return 120; // 2 hour delay
  }
  // 5% chance of a random 45 minute delay in development
  if (Math.random() < 0.05) {
    return 45;
  }
  
  return 0;
}

// Calls the web API to report the disruption and calculate the cascade graph
async function reportDisruption(tripId: string, nodeId: string, delayMin: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/disruptions/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, nodeId, delayMin })
    });
    
    if (!res.ok) {
      console.error(`[FlightTracker] Failed to report disruption: ${res.statusText}`);
    } else {
      const data = await res.json();
      console.log(`[FlightTracker] Successfully reported disruption. Cascade calculation complete. New Health: ${data.healthScore}`);
    }
  } catch (error) {
    console.error(`[FlightTracker] Error calling disruption API:`, error);
  }
}

// Start the worker loop
console.log("✈️ YatraSarthi Live Flight Tracker Worker Started");
console.log(`Polling every ${POLL_INTERVAL_MS / 1000} seconds...`);

checkFlights(); // run immediately once
setInterval(checkFlights, POLL_INTERVAL_MS);
