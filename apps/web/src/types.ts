export type NodeStatus = 'confirmed' | 'pending' | 'disrupted' | 'safe';
export type TrustLevel = 'high' | 'medium' | 'low';
export type ConstraintType = 'hard' | 'soft';
export type ActionStatus = 'proposed' | 'awaiting_payment' | 'executing' | 'pending_vendor' | 'confirmed' | 'failed' | 'expired';

export interface TravelNode {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'cab' | 'hotel' | 'activity' | 'restaurant' | 'phantom' | 'meetup';
  label: string;
  vendor: string;
  status: NodeStatus;
  scheduledTime: string;
  actualTime?: string;
  location: string;
  bookingRef?: string;
  trustLevel: TrustLevel;
  source: string;
  buffer: number;
  padding: number;
  constraint: ConstraintType;
  delay?: number;
  note?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  buffer: number;
  status: NodeStatus;
  label?: string;
}

export interface Traveller {
  id: string;
  name: string;
  avatar: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  tripStatus: 'confirmed' | 'pending';
  amount: number;
}

export interface RecoveryPlan {
  id: string;
  label: string;
  tagline: string;
  icon: string;
  additionalCost: number;
  bookingsPreserved: number;
  totalBookings: number;
  timeSaved?: number;
  droppedBookings: string[];
  confidence: number;
  feasible: boolean;
  reason?: string;
  arrivalTime: string;
  actions: string[];
  ranking?: { costScore: number; timeScore: number; bookingScore: number };
  explanation?: string;
  groupImpact?: string;
}

export interface DisruptionEvent {
  id: string;
  type: string;
  affectedNodeId: string;
  description: string;
  delay?: number;
  timestamp: string;
  simulated: boolean;
}

export interface TripAction {
  id: string;
  label: string;
  status: ActionStatus;
  vendor: string;
  createdAt: string;
  confirmationProof?: string;
}

export interface EventLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface TripData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: Traveller[];
  nodes: TravelNode[];
  edges: GraphEdge[];
  health: number;
  status: 'healthy' | 'at_risk' | 'disrupted' | 'recovering' | 'recovered';
  disruption?: DisruptionEvent;
  recoveryPlans?: RecoveryPlan[];
  actions: TripAction[];
  eventLog: EventLog[];
}

export interface UserPreferences {
  cost: number;
  time: number;
  bookings: number;
}
