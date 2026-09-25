import { Node, Edge } from '@yatrasarthi/types';

export function generateRecoveryOptions(tripId: string, nodes: Node[], edges: Edge[], brokenNodeId: string) {
  // A simplistic mock ranker for the demo
  // 1. Feasibility filter: e.g. drop options that miss hard constraints
  // 2. Scoring: Pareto front across cost, time, and bookings preserved

  const options = [
    {
      id: 'opt1',
      label: 'Plan A: Rebook Flight',
      tagline: 'Fastest recovery, highest cost',
      icon: '✈️',
      additionalCost: 8500,
      bookingsPreserved: 5,
      totalBookings: 5,
      timeSaved: 120,
      droppedBookings: [],
      confidence: 0.95,
      feasible: true,
      reason: 'Direct replacement for the delayed flight.',
      arrivalTime: '19:30',
      actions: ['Book 6i-808 (IndiGo)'],
      ranking: { costScore: 40, timeScore: 90, bookingScore: 100 },
      explanation: 'Preserves all downstream plans but costs more.'
    },
    {
      id: 'opt2',
      label: 'Plan B: Push Cab & Dinner',
      tagline: 'Cheapest, delays arrival',
      icon: '🚕',
      additionalCost: 1500,
      bookingsPreserved: 4,
      totalBookings: 5,
      timeSaved: 0,
      droppedBookings: ['Dinner at Sea Lounge'],
      confidence: 0.85,
      feasible: true,
      reason: 'Wait for delayed flight, reschedule cab.',
      arrivalTime: '21:45',
      actions: ['Reschedule cab to 21:00', 'Cancel Dinner reservation'],
      ranking: { costScore: 90, timeScore: 40, bookingScore: 80 },
      explanation: 'Saves money but misses the dinner reservation.'
    }
  ];

  return options;
}
