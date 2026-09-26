import { Node, Edge } from '@yatrasarthi/types';
import { TripGraph } from '@yatrasarthi/graph';

/**
 * Real recovery option ranker.
 *
 * Strategy:
 * 1. Find the broken node and all downstream nodes it affects via TripGraph.
 * 2. Generate candidate recovery strategies (skip broken, reschedule downstream, add phantom leg).
 * 3. Score each candidate on 3 axes: cost, time penalty, bookings preserved.
 * 4. Normalise scores 0-100, compute a weighted total, sort descending.
 * 5. Return top 3 options.
 */

interface RawNode extends Node {
  _id?: any;
  delay?: number;
}

interface RecoveryCandidate {
  id: string;
  label: string;
  tagline: string;
  icon: string;
  additionalCost: number;
  bookingsPreserved: number;
  totalBookings: number;
  timePenaltyMin: number;   // extra minutes added to arrival
  droppedBookings: string[];
  feasible: boolean;
  reason: string;
  arrivalTime: string;
  actions: string[];
  ranking: { costScore: number; timeScore: number; bookingScore: number; total: number };
  explanation: string;
}

function estimateArrivalTime(baseTime: string | undefined, extraMin: number): string {
  if (!baseTime) return 'Unknown';
  try {
    const d = new Date(baseTime);
    d.setMinutes(d.getMinutes() + extraMin);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return 'Unknown';
  }
}

export function generateRecoveryOptions(
  tripId: string,
  rawNodes: RawNode[],
  rawEdges: Edge[],
  brokenNodeId: string
): RecoveryCandidate[] {
  const nodes = rawNodes.map(n => ({ ...n, id: n.id ?? (n as any)._id?.toString() }));
  const edges = rawEdges.map(e => ({ ...e, id: e.id ?? (e as any)._id?.toString() }));

  const brokenNode = nodes.find(n => n.id === brokenNodeId);
  if (!brokenNode) {
    // Fallback: no broken node found, return a safe "wait and see" option
    return [{
      id: 'opt_wait',
      label: 'Wait & Monitor',
      tagline: 'No confirmed disruptions yet',
      icon: '⏳',
      additionalCost: 0,
      bookingsPreserved: nodes.length,
      totalBookings: nodes.length,
      timePenaltyMin: 0,
      droppedBookings: [],
      feasible: true,
      reason: 'No broken node identified — continue as planned and monitor.',
      arrivalTime: estimateArrivalTime(nodes[nodes.length - 1]?.time, 0),
      actions: ['Continue monitoring'],
      ranking: { costScore: 100, timeScore: 100, bookingScore: 100, total: 100 },
      explanation: 'Current plan is intact.',
    }];
  }

  // Build the graph to find downstream impact
  const graph = new TripGraph();
  nodes.forEach(n => graph.addNode(n.id));
  edges.forEach(e =>
    graph.addEdge({
      from: e.fromNodeId,
      to: e.toNodeId,
      bufferMin: e.bufferMin ?? 0,
      paddingMin: e.paddingMin ?? 0,
      constraint: e.constraint ?? 'soft',
    })
  );

  const delayMin = (brokenNode as any).delay ?? 120;
  const { broken: cascadeBroken, atRisk } = graph.propagateDelay(brokenNodeId, delayMin);

  const affectedIds = new Set([brokenNodeId, ...cascadeBroken, ...atRisk]);
  const unaffectedNodes = nodes.filter(n => !affectedIds.has(n.id));
  const affectedNodes = nodes.filter(n => affectedIds.has(n.id) && n.id !== brokenNodeId);
  const totalBookings = nodes.length;

  // Last node's time as the baseline "planned arrival"
  const lastNode = nodes[nodes.length - 1];

  const candidates: RecoveryCandidate[] = [];

  // --- Option 1: Skip the broken node, push all soft-constraint downstream nodes ---
  {
    const softDropped = affectedNodes.filter(n => n.constraintType === 'soft');
    const hardBlocked = affectedNodes.filter(n => n.constraintType === 'hard');
    const feasible = hardBlocked.length === 0;
    const preserved = totalBookings - softDropped.length - 1; // -1 for the broken node itself
    const timePenalty = delayMin; // arrival pushed by the full delay
    const additionalCost = softDropped.reduce((sum, n) => sum + (n.refundPolicy ? 0 : 500), 0); // cancellation fees

    candidates.push({
      id: 'opt_skip',
      label: 'Skip & Reschedule Soft Legs',
      tagline: `Drop ${softDropped.length} flexible booking${softDropped.length !== 1 ? 's' : ''}, keep the rest`,
      icon: '✂️',
      additionalCost,
      bookingsPreserved: preserved,
      totalBookings,
      timePenaltyMin: timePenalty,
      droppedBookings: softDropped.map(n => n.label),
      feasible,
      reason: feasible
        ? 'No hard-constraint bookings are broken — safe to drop flexible ones.'
        : `${hardBlocked.length} hard-constraint booking(s) also broken — not fully feasible.`,
      arrivalTime: estimateArrivalTime(lastNode?.time, timePenalty),
      actions: [
        ...softDropped.map(n => `Cancel: ${n.label}`),
        'Continue with remaining itinerary',
      ],
      ranking: { costScore: 0, timeScore: 0, bookingScore: 0, total: 0 }, // filled below
      explanation: feasible
        ? 'Preserves mandatory bookings at the cost of flexible ones.'
        : 'Hard-constraint bookings are still at risk — escalate to rebook.',
    });
  }

  // --- Option 2: Rebook the broken node with an estimated replacement cost ---
  {
    const rebookCost = brokenNode.type === 'flight' ? 6500 : brokenNode.type === 'train' ? 1200 : 800;
    const preserved = unaffectedNodes.length + affectedNodes.length; // all others preserved if rebook succeeds
    const timePenalty = Math.max(0, delayMin - 60); // rebook shaves ~1 hour off delay

    candidates.push({
      id: 'opt_rebook',
      label: `Rebook ${brokenNode.label || brokenNode.type}`,
      tagline: 'Fastest recovery, higher cost',
      icon: brokenNode.type === 'flight' ? '✈️' : brokenNode.type === 'train' ? '🚆' : '🚕',
      additionalCost: rebookCost,
      bookingsPreserved: preserved,
      totalBookings,
      timePenaltyMin: timePenalty,
      droppedBookings: [],
      feasible: true,
      reason: `Replace ${brokenNode.label ?? brokenNode.type} with next available option.`,
      arrivalTime: estimateArrivalTime(lastNode?.time, timePenalty),
      actions: [`Book replacement ${brokenNode.type} for ${brokenNode.vendor ?? 'next available'}`],
      ranking: { costScore: 0, timeScore: 0, bookingScore: 0, total: 0 },
      explanation: 'Preserves all downstream plans but costs more.',
    });
  }

  // --- Option 3: Add a phantom leg (cab/alternate transit) to bridge the gap ---
  {
    const phantomCost = 1500;
    const timePenalty = delayMin + 30; // phantom adds extra transit time
    const softDropped = affectedNodes.filter(n => n.constraintType === 'soft' && n.type !== 'hotel');
    const preserved = totalBookings - softDropped.length - 1;

    candidates.push({
      id: 'opt_phantom',
      label: 'Add Alternate Transit Leg',
      tagline: 'Cheapest workaround, latest arrival',
      icon: '🛺',
      additionalCost: phantomCost,
      bookingsPreserved: preserved,
      totalBookings,
      timePenaltyMin: timePenalty,
      droppedBookings: softDropped.map(n => n.label),
      feasible: true,
      reason: 'Use alternate road/local transit to bridge to next hard node.',
      arrivalTime: estimateArrivalTime(lastNode?.time, timePenalty),
      actions: [
        'Book cab/auto to nearest interchange',
        ...softDropped.map(n => `Reschedule: ${n.label}`),
      ],
      ranking: { costScore: 0, timeScore: 0, bookingScore: 0, total: 0 },
      explanation: 'Cheapest option but adds travel time and drops some flexible bookings.',
    });
  }

  // --- Normalise and score (Pareto multi-objective) ---
  const maxCost = Math.max(...candidates.map(c => c.additionalCost), 1);
  const maxTime = Math.max(...candidates.map(c => c.timePenaltyMin), 1);
  const maxBooks = totalBookings;

  candidates.forEach(c => {
    const costScore = Math.round((1 - c.additionalCost / maxCost) * 100);
    const timeScore = Math.round((1 - c.timePenaltyMin / maxTime) * 100);
    const bookingScore = Math.round((c.bookingsPreserved / maxBooks) * 100);
    // Weighted: 35% cost, 35% time, 30% bookings
    const total = Math.round(costScore * 0.35 + timeScore * 0.35 + bookingScore * 0.30);
    c.ranking = { costScore, timeScore, bookingScore, total };
  });

  // Sort by total score descending, mark the top one as recommended
  candidates.sort((a, b) => b.ranking.total - a.ranking.total);

  return candidates.slice(0, 3).map((c, i) => ({ ...c, recommended: i === 0 }));
}
