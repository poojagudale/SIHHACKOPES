export type UserRole =
  | 'driver' |'partner_rider' |'citizen' |'officer' |'police_liaison' |'super_admin';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventType =
  | 'POTHOLE' |'CRACK' |'WATERLOGGING' |'MISSING_SIGNAGE' |'DAMAGED_MANHOLE' |'WRONG_SIDE_DRIVING' |'NO_HELMET' |'NO_PARKING' |'SIGNAL_VIOLATION' |'NEAR_MISS' |'HIGH_RISK_ZONE' |'HIT_AND_RUN' |'RASH_DRIVING';

export type DetectionModule =
  | 'ROAD_DEFECT' |'TRAFFIC_VIOLATION' |'PEDESTRIAN_SAFETY' |'INCIDENT';

export type VehicleStatus = 'OFFLINE' | 'ONLINE' | 'SESSION_ACTIVE' | 'MAINTENANCE';

export type SessionStatus = 'IDLE' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export type EventStatus = 'DETECTED' | 'VERIFIED' | 'ASSIGNED' | 'RESOLVED' | 'DISMISSED';

export type CaseStatus =
  | 'OPEN' |'INVESTIGATING' |'PENDING_REVIEW' |'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vehicleId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: 'BUS' | 'FLEET' | 'PARTNER' | 'MOBILE';
  driverId: string;
  status: VehicleStatus;
  currentRoute?: string;
  city: string;
  lastSeen: string;
  detectionsToday: number;
  distanceToday: number;
}

export interface Session {
  id: string;
  vehicleId: string;
  driverId: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  route: string;
  detectionsCount: number;
  distanceCovered: number;
  city: string;
}

export interface DetectedEvent {
  id: string;
  sessionId: string;
  vehicleId: string;
  vehicleReg: string;
  type: EventType;
  module: DetectionModule;
  severity: SeverityLevel;
  status: EventStatus;
  location: string;
  lat: number;
  lng: number;
  detectedAt: string;
  description: string;
  confidence: number;
  caseId?: string;
}

export interface Case {
  id: string;
  eventId: string;
  title: string;
  status: CaseStatus;
  severity: SeverityLevel;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'ALERT' | 'INFO' | 'WARNING' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface DemoCredential {
  role: UserRole;
  label: string;
  email: string;
  password: string;
}