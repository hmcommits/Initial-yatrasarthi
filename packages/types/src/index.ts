export interface Trip {
  id: string;
  name: string;
  destination: string;
  dates: { start: Date; end: Date };
  memberIds: string[];
  joinCode: string;
  healthScore: number;
  status: "planning" | "active" | "completed" | "disrupted";
}

export interface Node {
  id: string;
  tripId: string;
  type: "flight" | "train" | "bus" | "cab" | "hotel" | "phantom";
  vendor: string;
  time: Date;
  constraintType: "hard" | "soft";
  status: "scheduled" | "at_risk" | "broken" | "completed";
  rawExtract?: Record<string, any>;
  confidence?: Record<string, number>;
}

export interface Edge {
  id: string;
  tripId: string;
  fromNodeId: string;
  toNodeId: string;
  bufferMin: number;
  paddingMin: number;
  constraint: "hard" | "soft";
}

export interface Event {
  id: string;
  tripId: string;
  seq: number;
  actor: string;
  type: string;
  payload: Record<string, any>;
  ts: Date;
}

export interface Action {
  id: string;
  tripId: string;
  state: "proposed" | "agreed" | "executing" | "completed" | "failed";
  confirmType: "self-reported" | "vendor-verified";
  proofRef?: string;
}

export interface Payment {
  id: string;
  tripId: string;
  actionId: string;
  memberId: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  aggregatorRef?: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  whatsappOptIn: boolean;
}
