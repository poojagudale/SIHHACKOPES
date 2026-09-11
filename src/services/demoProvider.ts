import {
  MOCK_EVENTS,
  MOCK_VEHICLES,
  MOCK_SESSIONS,
  DETECTION_TREND_DATA,
  MODULE_BREAKDOWN_DATA,
} from '@/data/mockData';
import type { Vehicle, Session } from '@/types';

// Extended demo data
export const DEMO_CASES = [
  { id: 'case-001', eventId: 'evt-001', title: 'Hit & Run — Hadapsar Junction', status: 'OPEN' as const, severity: 'CRITICAL' as const, assignedTo: 'Insp. Patil', createdAt: '2026-09-10T14:31:22+05:30', updatedAt: '2026-09-10T14:35:00+05:30', notes: 'Vehicle MH12XY9900 identified. CCTV footage requested.' },
  { id: 'case-002', eventId: 'evt-002', title: 'Large Pothole — Shivaji Chowk', status: 'INVESTIGATING' as const, severity: 'HIGH' as const, assignedTo: 'PWD Team A', createdAt: '2026-09-10T14:28:05+05:30', updatedAt: '2026-09-10T14:40:00+05:30', notes: 'Repair crew dispatched. ETA 2 hours.' },
  { id: 'case-003', eventId: 'evt-004', title: 'Wrong Side Driving — WEH Mumbai', status: 'PENDING_REVIEW' as const, severity: 'HIGH' as const, assignedTo: 'Traffic Dept.', createdAt: '2026-09-10T14:22:10+05:30', updatedAt: '2026-09-10T14:30:00+05:30', notes: 'Challan draft prepared.' },
  { id: 'case-004', eventId: 'evt-003', title: 'Pedestrian Near Miss — Wakad Bridge', status: 'OPEN' as const, severity: 'HIGH' as const, assignedTo: undefined, createdAt: '2026-09-10T14:25:44+05:30', updatedAt: '2026-09-10T14:25:44+05:30', notes: '' },
  { id: 'case-005', eventId: 'evt-007', title: 'Damaged Manhole — Andheri East', status: 'INVESTIGATING' as const, severity: 'HIGH' as const, assignedTo: 'BMC Team', createdAt: '2026-09-10T14:08:17+05:30', updatedAt: '2026-09-10T14:20:00+05:30', notes: 'Barricading done. Repair scheduled.' },
];

export const DEMO_USERS = [
  { id: 'usr-011', name: 'Rajan Shinde', email: 'driver@urbaneye.ai', role: 'driver' as const, organization: 'Kolhapur City Bus', status: 'ACTIVE', lastActive: '2026-09-10T14:35:00+05:30', vehicleId: 'veh-001', driverId: 'DRV-2024-001', badgeNumber: 'KCB-0011', phone: '+91 98765 43210' },
  { id: 'usr-012', name: 'Priya Kulkarni', email: 'driver2@urbaneye.ai', role: 'driver' as const, organization: 'Pune PMPML', status: 'ACTIVE', lastActive: '2026-09-10T14:36:10+05:30', vehicleId: 'veh-002', driverId: 'DRV-2024-002', badgeNumber: 'PMP-0012', phone: '+91 98765 43211' },
  { id: 'usr-013', name: 'Amit Desai', email: 'driver3@urbaneye.ai', role: 'partner_rider' as const, organization: 'Mumbai Fleet Co.', status: 'ACTIVE', lastActive: '2026-09-10T14:30:00+05:30', vehicleId: 'veh-003', driverId: 'DRV-2024-003', badgeNumber: 'MFC-0013', phone: '+91 98765 43212' },
  { id: 'usr-020', name: 'Arjun Patil', email: 'officer@urbaneye.ai', role: 'officer' as const, organization: 'Kolhapur Municipal Corp.', status: 'ACTIVE', lastActive: '2026-09-10T14:59:00+05:30', vehicleId: undefined, driverId: undefined, badgeNumber: 'KMC-OFF-001', phone: '+91 98765 43220' },
  { id: 'usr-021', name: 'Suresh Jadhav', email: 'police@urbaneye.ai', role: 'police_liaison' as const, organization: 'Kolhapur Police', status: 'ACTIVE', lastActive: '2026-09-10T14:50:00+05:30', vehicleId: undefined, driverId: undefined, badgeNumber: 'KP-LIA-001', phone: '+91 98765 43221' },
  { id: 'usr-030', name: 'Meera Nair', email: 'citizen@urbaneye.ai', role: 'citizen' as const, organization: 'Public', status: 'ACTIVE', lastActive: '2026-09-10T12:00:00+05:30', vehicleId: undefined, driverId: undefined, badgeNumber: undefined, phone: '+91 98765 43230' },
  { id: 'usr-001', name: 'Admin User', email: 'admin@urbaneye.ai', role: 'super_admin' as const, organization: 'UrbanEYE AI', status: 'ACTIVE', lastActive: '2026-09-10T14:59:36+05:30', vehicleId: undefined, driverId: undefined, badgeNumber: 'SYS-ADMIN-001', phone: '+91 98765 43200' },
];

export const DEMO_NOTIFICATIONS = [
  { id: 'notif-001', userId: 'usr-020', title: 'Critical Incident Detected', body: 'Hit & Run at Hadapsar Junction, Pune. Immediate action required.', type: 'ALERT' as const, isRead: false, createdAt: '2026-09-10T14:31:22+05:30' },
  { id: 'notif-002', userId: 'usr-020', title: 'New Road Defect Reported', body: 'Large pothole detected at Shivaji Chowk, Kolhapur. Severity: HIGH.', type: 'WARNING' as const, isRead: false, createdAt: '2026-09-10T14:28:05+05:30' },
  { id: 'notif-003', userId: 'usr-020', title: 'Case Assigned', body: 'Case case-003 has been assigned to Traffic Dept.', type: 'INFO' as const, isRead: true, createdAt: '2026-09-10T14:22:10+05:30' },
  { id: 'notif-004', userId: 'usr-020', title: 'Vehicle Offline', body: 'Vehicle MH04KL2345 went offline at 11:20 IST.', type: 'WARNING' as const, isRead: true, createdAt: '2026-09-10T11:20:00+05:30' },
  { id: 'notif-005', userId: 'usr-020', title: 'System Health OK', body: 'All services operational. WebSocket connected.', type: 'SUCCESS' as const, isRead: true, createdAt: '2026-09-10T09:00:00+05:30' },
];

export const DEMO_AUDIT_LOGS = [
  { id: 'log-001', userId: 'usr-020', userName: 'Arjun Patil', action: 'ACKNOWLEDGED', resource: 'Event evt-001', resourceType: 'EVENT', status: 'SUCCESS', ipAddress: '192.168.1.10', timestamp: '2026-09-10T14:35:00+05:30' },
  { id: 'log-002', userId: 'usr-020', userName: 'Arjun Patil', action: 'ASSIGNED', resource: 'Case case-002', resourceType: 'CASE', status: 'SUCCESS', ipAddress: '192.168.1.10', timestamp: '2026-09-10T14:40:00+05:30' },
  { id: 'log-003', userId: 'usr-021', userName: 'Suresh Jadhav', action: 'ESCALATED', resource: 'Incident evt-001', resourceType: 'INCIDENT', status: 'SUCCESS', ipAddress: '192.168.1.22', timestamp: '2026-09-10T14:33:00+05:30' },
  { id: 'log-004', userId: 'usr-001', userName: 'Admin User', action: 'USER_CREATED', resource: 'User usr-030', resourceType: 'USER', status: 'SUCCESS', ipAddress: '192.168.1.1', timestamp: '2026-09-09T10:00:00+05:30' },
  { id: 'log-005', userId: 'usr-011', userName: 'Rajan Shinde', action: 'SESSION_STARTED', resource: 'Session ses-001', resourceType: 'SESSION', status: 'SUCCESS', ipAddress: '10.0.0.5', timestamp: '2026-09-10T09:15:00+05:30' },
  { id: 'log-006', userId: 'usr-020', userName: 'Arjun Patil', action: 'STATUS_UPDATED', resource: 'Case case-003', resourceType: 'CASE', status: 'SUCCESS', ipAddress: '192.168.1.10', timestamp: '2026-09-10T14:30:00+05:30' },
];

export const DEMO_ANALYTICS = {
  dashboard: {
    activeVehicles: 4,
    openIncidents: 2,
    todayDefects: 27,
    avgResponseTime: 4.2,
    resolvedCases: 120,
    estimatedRepairCost: 245000,
    totalReports: 638,
    trafficViolations: 320,
    pedestrianRisks: 98,
    openCases: 8,
  },
  hotspots: [
    { rank: 1, location: 'Hadapsar Junction, Pune', eventCount: 47, riskScore: 94, category: 'INCIDENT' },
    { rank: 2, location: 'Shivaji Chowk, Kolhapur', eventCount: 38, riskScore: 87, category: 'ROAD_DEFECT' },
    { rank: 3, location: 'Western Express Hwy, Mumbai', eventCount: 35, riskScore: 82, category: 'TRAFFIC_VIOLATION' },
    { rank: 4, location: 'Wakad Bridge, Pune', eventCount: 29, riskScore: 78, category: 'PEDESTRIAN_SAFETY' },
    { rank: 5, location: 'Andheri East, Mumbai', eventCount: 24, riskScore: 71, category: 'ROAD_DEFECT' },
  ],
  trendData: DETECTION_TREND_DATA,
  moduleBreakdown: MODULE_BREAKDOWN_DATA,
};

export const DEMO_PEDESTRIAN = [
  { id: 'ped-001', location: 'Wakad Bridge, Pune', lat: 18.5979, lng: 73.7897, riskScore: 87, incidentCount: 12, recommendation: 'Install Zebra Crossing', status: 'PENDING', severity: 'HIGH' as const },
  { id: 'ped-002', location: 'Rankala Lake Road, Kolhapur', lat: 16.6975, lng: 74.2280, riskScore: 74, incidentCount: 8, recommendation: 'Add Traffic Signal', status: 'IN_REVIEW', severity: 'HIGH' as const },
  { id: 'ped-003', location: 'Baner Road, Pune', lat: 18.5590, lng: 73.7868, riskScore: 61, incidentCount: 6, recommendation: 'Install Warning Signage', status: 'PENDING', severity: 'MEDIUM' as const },
  { id: 'ped-004', location: 'Andheri Station, Mumbai', lat: 19.1136, lng: 72.8697, riskScore: 55, incidentCount: 5, recommendation: 'Improve Street Lighting', status: 'COMPLETED', severity: 'MEDIUM' as const },
];

// Simulate async delay for realistic demo
export function demoDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const demoProvider = {
  getEvents: () => demoDelay([...MOCK_EVENTS]),
  getEvent: (id: string) => demoDelay(MOCK_EVENTS.find((e) => e.id === id) || null),
  getVehicles: () => demoDelay([...MOCK_VEHICLES]),
  getVehicle: (id: string) => demoDelay(MOCK_VEHICLES.find((v) => v.id === id) || null),
  getSessions: () => demoDelay([...MOCK_SESSIONS]),
  getCases: () => demoDelay([...DEMO_CASES]),
  getCase: (id: string) => demoDelay(DEMO_CASES.find((c) => c.id === id) || null),
  getUsers: () => demoDelay([...DEMO_USERS]),
  getUser: (id: string) => demoDelay(DEMO_USERS.find((u) => u.id === id) || null),
  getNotifications: () => demoDelay([...DEMO_NOTIFICATIONS]),
  getAuditLogs: () => demoDelay([...DEMO_AUDIT_LOGS]),
  getAnalytics: () => demoDelay({ ...DEMO_ANALYTICS }),
  getPedestrianData: () => demoDelay([...DEMO_PEDESTRIAN]),
};
