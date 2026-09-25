"use client";

import { useState, useCallback, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { Hero } from '../components/Hero';
import { TripControlCenter } from '../components/TripControlCenter';
import { MyTrips } from '../components/MyTrips';
import { CreateTrip } from '../components/CreateTrip';
import { GroupJourney } from '../components/GroupJourney';
import { SurakshaPanel } from '../components/SurakshaPanel';
import { UserDashboard } from '../components/UserDashboard';
import { Footer } from '../components/Footer';
import type { TripData } from '../types';

type Page = 'home' | 'dashboard' | 'trips' | 'recovery' | 'group' | 'suraksha' | 'new-trip';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeTrip, setActiveTrip] = useState<TripData | null>(null);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trips')
      .then(r => r.json())
      .then(data => {
        if (data.data?.trips) {
          setTrips(data.data.trips);
        } else if (Array.isArray(data.trips)) {
          setTrips(data.trips);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const navigate = useCallback((p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectTrip = (id: string) => {
    const trip = trips.find(t => t.id === id);
    if (trip) {
      setActiveTrip(trip);
      navigate('recovery');
    }
  };

  const handleTripCreated = useCallback(() => {
    // Refresh trips
    fetch('/api/trips')
      .then(r => r.json())
      .then(data => {
        if (data.data?.trips) {
          setTrips(data.data.trips);
          if (data.data.trips.length > 0) setActiveTrip(data.data.trips[0]);
        }
      });
  }, []);

  const handleDisrupt = useCallback((scenarioId: string) => {
    if (!activeTrip) return;
    
    // Fire real endpoint
    const affectedNodeId = activeTrip.nodes?.[0]?.id || 'unknown';
    fetch('/api/disruptions/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: activeTrip.id,
        nodeId: affectedNodeId,
        delayMin: 120,
        source: 'user_reported'
      })
    }).then(() => {
      // Trigger a re-fetch of the active trip
      fetch(`/api/trips/${activeTrip.id}/graph`)
        .then(r => r.json())
        .then(data => {
          if (data.status) {
            setActiveTrip(prev => prev ? { ...prev, ...data } : prev);
          }
        });
    });
  }, [activeTrip]);

  const showFooter = page === 'home' || page === 'dashboard';

  return (
    <div style={{ background: '#F7F5EC', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh' }}>
      <Navbar activePage={page} onNavigate={navigate} />

      <main>
        {page === 'home' && <Hero onNavigate={navigate} />}

        {page === 'dashboard' && (
          <UserDashboard 
            trips={trips} 
            activeTrip={activeTrip || trips[0]} 
            onSelectTrip={handleSelectTrip} 
            onNavigate={navigate} 
          />
        )}

        {page === 'trips' && (
          <MyTrips trips={trips} onSelectTrip={handleSelectTrip} onNavigate={navigate} />
        )}

        {page === 'recovery' && activeTrip && (
          <TripControlCenter trip={activeTrip} onDisrupt={handleDisrupt} />
        )}

        {page === 'group' && activeTrip && <GroupJourney tripId={activeTrip.id} />}

        {page === 'suraksha' && <SurakshaPanel trip={activeTrip} />}

        {page === 'new-trip' && (
          <CreateTrip onNavigate={navigate} onTripCreated={handleTripCreated} />
        )}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}

      <BottomNav activePage={page} onNavigate={navigate} />
    </div>
  );
}
