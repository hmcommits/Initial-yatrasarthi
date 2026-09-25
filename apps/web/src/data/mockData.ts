import type { TripData, RecoveryPlan, UserPreferences } from '../types';

/* ─────────────────────────────────────────────────────────────
   GROUP TRAVELER DATA
───────────────────────────────────────────────────────────── */
export interface TravelerJourney {
  id: string;
  name: string;
  avatar: string;
  origin: string;
  mode: 'flight' | 'train' | 'bus' | 'cab';
  modeLabel: string;
  departureTime: string;
  arrivalTime: string;
  booking: string;
  status: 'on_track' | 'delayed' | 'disrupted';
  delay?: number;
  color: string;
  preferences: { cost: number; time: number; comfort: number; flexibility: number };
}

export const groupTravelers: TravelerJourney[] = [
  {
    id: 'tanvi',
    name: 'Tanvi',
    avatar: 'T',
    origin: 'Mumbai',
    mode: 'flight',
    modeLabel: 'IndiGo 6E-781',
    departureTime: '07:30',
    arrivalTime: '08:45',
    booking: '6E781MUM',
    status: 'on_track',
    color: '#F28A28',
    preferences: { cost: 70, time: 20, comfort: 5, flexibility: 5 },
  },
  {
    id: 'rahul',
    name: 'Rahul',
    avatar: 'R',
    origin: 'Pune',
    mode: 'train',
    modeLabel: 'Rajdhani 12223',
    departureTime: '06:00',
    arrivalTime: '10:00',
    booking: 'PNR-2247881',
    status: 'delayed',
    delay: 240,
    color: '#6D9EEB',
    preferences: { cost: 20, time: 70, comfort: 5, flexibility: 5 },
  },
  {
    id: 'priya',
    name: 'Priya',
    avatar: 'P',
    origin: 'Nashik',
    mode: 'bus',
    modeLabel: 'Neeta Travels',
    departureTime: '05:00',
    arrivalTime: '09:30',
    booking: 'NT-GOA-881',
    status: 'on_track',
    color: '#A8C39A',
    preferences: { cost: 10, time: 10, comfort: 70, flexibility: 10 },
  },
  {
    id: 'aarav',
    name: 'Aarav',
    avatar: 'A',
    origin: 'Bangalore',
    mode: 'flight',
    modeLabel: 'Air India AI-983',
    departureTime: '06:45',
    arrivalTime: '08:00',
    booking: 'AI983BLR',
    status: 'on_track',
    color: '#E5A43F',
    preferences: { cost: 5, time: 5, comfort: 20, flexibility: 70 },
  },
];

export const meetupPoint = {
  id: 'meetup-goa',
  label: 'Goa Meetup',
  location: 'Dabolim Airport, Goa',
  scheduledTime: '14:30',
  etas: {
    tanvi: '08:45',
    rahul: '14:00',   // delayed from 10:00 → 14:00
    priya: '09:30',
    aarav: '08:00',
  },
  groupReadyTime: '14:05',
  buffer: '25 min',
};

/* ─────────────────────────────────────────────────────────────
   DEFAULT (HEALTHY) TRIP
───────────────────────────────────────────────────────────── */
export const defaultTrip: TripData = {
  id: 'YS-MUM-GOA-240924',
  name: 'Goa Escape',
  origin: 'Mumbai',
  destination: 'Goa',
  startDate: '24 Sept',
  endDate: '27 Sept',
  status: 'healthy',
  health: 88,
  travellers: [
    { id: 'tanvi', name: 'Tanvi', avatar: 'T', paymentStatus: 'paid', tripStatus: 'confirmed', amount: 600 },
    { id: 'rahul', name: 'Rahul', avatar: 'R', paymentStatus: 'pending', tripStatus: 'confirmed', amount: 600 },
    { id: 'priya', name: 'Priya', avatar: 'P', paymentStatus: 'paid', tripStatus: 'confirmed', amount: 600 },
    { id: 'aarav', name: 'Aarav', avatar: 'A', paymentStatus: 'paid', tripStatus: 'confirmed', amount: 600 },
  ],
  nodes: [
    { id: 'flight', type: 'flight', label: 'IndiGo 6E-781', vendor: 'IndiGo', status: 'confirmed', scheduledTime: '07:30', location: 'Mumbai → Goa', bookingRef: '6E781MUM', trustLevel: 'high', source: 'Live flight provider', buffer: 0, padding: 0, constraint: 'hard' },
    { id: 'cab', type: 'cab', label: 'Airport Cab', vendor: 'Ola Prime', status: 'confirmed', scheduledTime: '10:15', location: 'Goa Airport', bookingRef: 'OLA-88123', trustLevel: 'medium', source: 'Vendor contact', buffer: 180, padding: 30, constraint: 'hard', note: 'Hard pickup — driver cannot wait' },
    { id: 'hotel', type: 'hotel', label: 'Grand Goa Resort', vendor: 'Grand Goa Resort', status: 'confirmed', scheduledTime: '11:00', location: 'Calangute, Goa', bookingRef: 'GGR-2024-09', trustLevel: 'high', source: 'Booking constraints', buffer: 240, padding: 60, constraint: 'soft' },
    { id: 'activity', type: 'activity', label: 'Dudhsagar Trek', vendor: 'GoaAdventures', status: 'confirmed', scheduledTime: '16:00', location: 'Dudhsagar Falls', bookingRef: 'GA-TREK-221', trustLevel: 'medium', source: 'Vendor confirmation', buffer: 60, padding: 30, constraint: 'soft' },
    { id: 'dinner', type: 'restaurant', label: 'Thalassa Sunset Dinner', vendor: 'Thalassa', status: 'confirmed', scheduledTime: '19:30', location: 'Vagator, Goa', bookingRef: 'THA-VIP-6', trustLevel: 'high', source: 'Direct booking', buffer: 120, padding: 30, constraint: 'soft' },
  ],
  edges: [
    { from: 'flight', to: 'cab', buffer: 180, status: 'confirmed', label: '3h buffer' },
    { from: 'cab', to: 'hotel', buffer: 60, status: 'confirmed' },
    { from: 'hotel', to: 'activity', buffer: 300, status: 'confirmed' },
    { from: 'activity', to: 'dinner', buffer: 120, status: 'confirmed' },
  ],
  actions: [],
  eventLog: [
    { id: 'e0', time: '08:30', message: 'Trip YS-MUM-GOA-240924 created and saved.', type: 'info' },
    { id: 'e1', time: '08:31', message: 'IndiGo 6E-781 confirmed via provider API.', type: 'success' },
    { id: 'e2', time: '08:31', message: 'Grand Goa Resort booking confirmed.', type: 'success' },
    { id: 'e3', time: '08:32', message: 'Dependency graph built. 4 connections mapped.', type: 'info' },
  ],
};

/* ─────────────────────────────────────────────────────────────
   DISRUPTED TRIP (Rahul's train delay scenario)
───────────────────────────────────────────────────────────── */
export const disrupted_priya_rahul: TripData = {
  id: 'YS-GRP-GOA-240924',
  name: 'Goa Group — 4 Travelers',
  origin: 'Multiple origins',
  destination: 'Goa',
  startDate: '24 Sept',
  endDate: '27 Sept',
  status: 'disrupted',
  health: 52,
  travellers: [
    { id: 'tanvi', name: 'Tanvi', avatar: 'T', paymentStatus: 'paid', tripStatus: 'confirmed', amount: 1200 },
    { id: 'rahul', name: 'Rahul', avatar: 'R', paymentStatus: 'pending', tripStatus: 'confirmed', amount: 1200 },
    { id: 'priya', name: 'Priya', avatar: 'P', paymentStatus: 'paid', tripStatus: 'confirmed', amount: 1200 },
    { id: 'aarav', name: 'Aarav', avatar: 'A', paymentStatus: 'paid', tripStatus: 'confirmed', amount: 1200 },
  ],
  nodes: [
    { id: 'train', type: 'train', label: "Rahul's Rajdhani 12223", vendor: 'Indian Railways', status: 'disrupted', scheduledTime: '06:00', actualTime: '10:00', location: 'Pune → Madgaon', bookingRef: 'PNR-2247881', trustLevel: 'medium', source: 'NTES (unofficial)', buffer: 0, padding: 0, constraint: 'hard', delay: 240, note: 'Best effort — NTES data' },
    { id: 'shared_cab', type: 'cab', label: 'Shared Group Cab', vendor: 'Sai Tours', status: 'disrupted', scheduledTime: '10:30', location: 'Madgaon Station', bookingRef: 'SAI-GRP-404', trustLevel: 'medium', source: 'Vendor contact', buffer: 30, padding: 15, constraint: 'hard', note: 'Hard pickup — cannot wait >30 min' },
    { id: 'hotel2', type: 'hotel', label: 'Novotel Goa Candolim', vendor: 'Novotel', status: 'pending', scheduledTime: '14:00', location: 'Candolim, Goa', bookingRef: 'NVT-22419', trustLevel: 'high', source: 'Booking constraints', buffer: 300, padding: 60, constraint: 'soft' },
    { id: 'dinner2', type: 'restaurant', label: 'Shore Bar Dinner', vendor: 'Shore Bar', status: 'confirmed', scheduledTime: '20:00', location: 'Candolim Beach', bookingRef: 'SHB-T8', trustLevel: 'medium', source: 'Reservation', buffer: 360, padding: 60, constraint: 'soft' },
  ],
  edges: [
    { from: 'train', to: 'shared_cab', buffer: 30, status: 'disrupted', label: 'Buffer EXCEEDED' },
    { from: 'shared_cab', to: 'hotel2', buffer: 300, status: 'pending', label: 'AT RISK' },
    { from: 'hotel2', to: 'dinner2', status: 'confirmed', buffer: 360 },
  ],
  disruption: {
    id: 'dis-001',
    type: 'train_delay',
    affectedNodeId: 'train',
    description: "Rahul's Rajdhani 12223 delayed by 4 hours due to signal failure near Pune.",
    delay: 240,
    timestamp: '09:42',
    simulated: true,
  },
  recoveryPlans: [
    {
      id: 'plan-a',
      label: 'Plan A',
      tagline: 'Wait for Rahul',
      icon: '⏳',
      additionalCost: 0,
      bookingsPreserved: 3,
      totalBookings: 3,
      confidence: 91,
      feasible: true,
      arrivalTime: '14:20',
      droppedBookings: [],
      timeSaved: 0,
      actions: ['Group waits at meetup — 3h 45m wait', 'No additional cost', 'All bookings preserved'],
      ranking: { costScore: 100, timeScore: 20, bookingScore: 100 },
      explanation: 'Ranked for itinerary preservation. Zero extra cost but adds significant wait time for the group.',
      groupImpact: 'Tanvi, Priya, Aarav wait ~3h 45m at airport',
    },
    {
      id: 'plan-b',
      label: 'Plan B',
      tagline: 'Push the cab — move everyone',
      icon: '🚕',
      additionalCost: 350,
      bookingsPreserved: 3,
      totalBookings: 3,
      confidence: 88,
      feasible: true,
      arrivalTime: '14:10',
      droppedBookings: [],
      timeSaved: 60,
      actions: ['Move cab pickup from 10:30 → 14:00', 'Hotel informed of late arrival', 'Dinner preserved with 6h buffer'],
      ranking: { costScore: 90, timeScore: 75, bookingScore: 100 },
      explanation: 'Best balance. Preserves all bookings, minimal cost, and reduces group wait by coordinating around Rahul.',
      groupImpact: 'Minor delay. All travelers reunite by 14:30',
    },
    {
      id: 'plan-c',
      label: 'Plan C',
      tagline: "Rebook Rahul's transport",
      icon: '✈️',
      additionalCost: 4800,
      bookingsPreserved: 3,
      totalBookings: 3,
      confidence: 79,
      feasible: true,
      arrivalTime: '12:15',
      droppedBookings: [],
      timeSaved: 130,
      actions: ['Book Rahul on GoAir SG-117 Pune→Goa at 10:45', 'Cab proceeds on original schedule', 'Group reunites at hotel by noon'],
      ranking: { costScore: 20, timeScore: 100, bookingScore: 95 },
      explanation: 'Fastest reunion but highest cost. Only recommended if time sensitivity outweighs ₹4,800 additional spend.',
      groupImpact: 'Rahul travels separately. Reunites at hotel by 12:30.',
    },
  ],
  actions: [
    { id: 'act-1', label: 'Push cab pickup by 3.5h', status: 'pending_vendor', vendor: 'Sai Tours', createdAt: '09:46' },
  ],
  eventLog: [
    { id: 'e1', time: '09:42', message: "Rahul's Rajdhani 12223 delayed 4h — signal failure near Pune.", type: 'error' },
    { id: 'e2', time: '09:43', message: 'Cascade analysis: shared cab dependency BROKEN (30m buffer exceeded).', type: 'error' },
    { id: 'e3', time: '09:43', message: 'Hotel check-in marked AT RISK — arrival buffer reduced.', type: 'warning' },
    { id: 'e4', time: '09:44', message: 'Shore Bar dinner: buffer sufficient (6h). Marked SAFE.', type: 'success' },
    { id: 'e5', time: '09:44', message: 'Slack check: Tanvi, Priya, Aarav unaffected individually.', type: 'info' },
    { id: 'e6', time: '09:45', message: '3 recovery options generated. Ranked by group preferences.', type: 'info' },
  ],
};

export const recoveryPlans: RecoveryPlan[] = disrupted_priya_rahul.recoveryPlans!;

export const defaultPreferences: UserPreferences = {
  cost: 60,
  time: 20,
  bookings: 20,
};

export const disruptionScenarios = [
  { id: 'flight_delay', label: 'Flight delayed 2h', icon: 'clock', type: 'flight', delay: 120 },
  { id: 'flight_cancel', label: 'Flight cancelled', icon: 'ban', type: 'flight', delay: null },
  { id: 'train_delay', label: "Rahul's train delayed 4h", icon: 'train', type: 'train', delay: 240 },
  { id: 'cab_unavail', label: 'Cab unavailable', icon: 'car-off', type: 'cab', delay: null },
  { id: 'road_delay', label: 'Road delay (traffic)', icon: 'traffic-cone', type: 'road', delay: 60 },
  { id: 'user_late', label: "Running late", icon: 'user-clock', type: 'user', delay: 45 },
];

export const mockFlights = [
  { id: 'f1', airline: 'IndiGo', number: '6E-781', from: 'Mumbai', to: 'Goa', dep: '07:30', arr: '08:45', duration: '1h 15m', price: 4200, cancellation: 'Flexible', baggage: '15kg', recommended: true, reason: 'Arrives 5h 45m before meetup. Flexible cancellation. Within budget.', compatScore: 96 },
  { id: 'f2', airline: 'Air India', number: 'AI-681', from: 'Mumbai', to: 'Goa', dep: '09:10', arr: '10:25', duration: '1h 15m', price: 5100, cancellation: 'Non-refundable', baggage: '20kg', recommended: false, reason: 'Arrives later. Non-refundable reduces flexibility.', compatScore: 74 },
  { id: 'f3', airline: 'SpiceJet', number: 'SG-211', from: 'Mumbai', to: 'Goa', dep: '06:15', arr: '07:30', duration: '1h 15m', price: 3800, cancellation: 'Flexible', baggage: '15kg', recommended: false, reason: 'Cheapest option. Arrives very early — long wait before meetup.', compatScore: 81 },
];

export const mockHotels = [
  { id: 'h1', name: 'Novotel Goa Candolim', area: 'Candolim', price: 5800, dist: '1.2 km from meetup', cancellation: 'Free till 18:00', groupFit: 'Excellent', rating: 4.4, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&auto=format', recommended: true, reason: 'Best group fit. 1.2 km from meetup. Free cancellation till check-in day.' },
  { id: 'h2', name: 'Grand Hyatt Goa', area: 'Bambolim', price: 9200, dist: '3.4 km from meetup', cancellation: 'Non-refundable', groupFit: 'Good', rating: 4.7, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=240&fit=crop&auto=format', recommended: false, reason: 'Premium quality. Further from meetup. No free cancellation.' },
  { id: 'h3', name: 'Lemon Tree Goa', area: 'Calangute', price: 3400, dist: '2.1 km from meetup', cancellation: 'Flexible', groupFit: 'Good', rating: 4.1, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=240&fit=crop&auto=format', recommended: false, reason: 'Budget-friendly. Good location. Suits cost-priority travelers.' },
];

export const policyData = [
  { id: 'DGCA-2023-01', situation: 'Denied Boarding', description: 'Possible compensation up to ₹20,000 depending on delay and fare class.', source: 'DGCA CAR Section 3, Series M Part I', effectiveDate: 'Jan 2023', guaranteed: false },
  { id: 'DGCA-2023-02', situation: 'Flight Delay > 4h', description: 'Meals and refreshments. Hotel for overnight delays on airline fault.', source: 'DGCA CAR Section 3, Series M Part II', effectiveDate: 'Jan 2023', guaranteed: false },
  { id: 'DGCA-2023-03', situation: 'Cancellation by Airline', description: 'Full refund or rerouting at no extra charge. Possible compensation ₹5,000–₹10,000.', source: 'DGCA Passenger Charter', effectiveDate: 'Mar 2023', guaranteed: false },
];
