"use client";

import { useState, useCallback } from 'react';
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
import { defaultTrip, disrupted_priya_rahul } from '../data/mockData';
import type { TripData } from '../types';

type Page = 'home' | 'dashboard' | 'trips' | 'recovery' | 'group' | 'suraksha' | 'new-trip';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeTrip, setActiveTrip] = useState<TripData>(defaultTrip);
  const [trips, setTrips] = useState<TripData[]>([defaultTrip, disrupted_priya_rahul]);
  const [tripCreated, setTripCreated] = useState(false);

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
    setTripCreated(true);
    // Add the demo trip as if it was newly created
    setActiveTrip(defaultTrip);
  }, []);

  const handleDisrupt = useCallback((scenarioId: string) => {
    if (scenarioId === 'train_delay') {
      setActiveTrip(disrupted_priya_rahul);
      setTrips(prev => prev.map(t => t.id === disrupted_priya_rahul.id ? disrupted_priya_rahul : t));
      return;
    }

    setActiveTrip(prev => {
      if (prev.status === 'disrupted' || prev.status === 'recovering') return prev;

      const updatedNodes = prev.nodes.map((n, i) => {
        if (i === 0) return { ...n, status: 'disrupted' as const, delay: 135, actualTime: (() => {
          const [h, m] = n.scheduledTime.split(':').map(Number);
          return `${String(h + 2).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        })() };
        if (i === 1) return { ...n, status: 'disrupted' as const };
        if (i === 2) return { ...n, status: 'pending' as const };
        return n;
      });
      const updatedEdges = prev.edges.map((e, i) => {
        if (i === 0) return { ...e, status: 'disrupted' as const };
        if (i === 1) return { ...e, status: 'pending' as const };
        return e;
      });

      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      return {
        ...prev,
        status: 'disrupted' as const,
        health: 54,
        nodes: updatedNodes,
        edges: updatedEdges,
        disruption: {
          id: 'dis-sim',
          type: scenarioId,
          affectedNodeId: prev.nodes[0].id,
          description: `Simulated disruption — ${scenarioId.replace(/_/g, ' ')}. 3 downstream components affected.`,
          delay: 135,
          timestamp: now,
          simulated: true,
        },
        recoveryPlans: disrupted_priya_rahul.recoveryPlans,
        eventLog: [
          { id: 'e1', time: now, message: `Disruption simulated: ${scenarioId.replace(/_/g, ' ')}.`, type: 'error' as const },
          { id: 'e2', time: now, message: 'Cascade analysis complete. 3 downstream components evaluated.', type: 'warning' as const },
          { id: 'e3', time: now, message: '3 feasible recovery options generated and ranked.', type: 'success' as const },
        ],
      };
    });
  }, []);

  const showFooter = page === 'home' || page === 'dashboard';

  return (
    <div style={{ background: '#F7F5EC', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh' }}>
      <Navbar activePage={page} onNavigate={navigate} />

      <main>
        {page === 'home' && <Hero onNavigate={navigate} />}

        {page === 'dashboard' && (
          <UserDashboard 
            trips={trips} 
            activeTrip={activeTrip} 
            onSelectTrip={handleSelectTrip} 
            onNavigate={navigate} 
          />
        )}

        {page === 'trips' && (
          <MyTrips trips={trips} onSelectTrip={handleSelectTrip} onNavigate={navigate} />
        )}

        {page === 'recovery' && (
          <TripControlCenter trip={activeTrip} onDisrupt={handleDisrupt} />
        )}

        {page === 'group' && <GroupJourney />}

        {page === 'suraksha' && <SurakshaPanel />}

        {page === 'new-trip' && (
          <CreateTrip onNavigate={navigate} onTripCreated={handleTripCreated} />
        )}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}

      <BottomNav activePage={page} onNavigate={navigate} />
    </div>
  );
}
