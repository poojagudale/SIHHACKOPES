import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider } from './demoProvider';
import type { DetectedEvent } from '@/types';

export const eventService = {
  async getEvents(): Promise<DetectedEvent[]> {
    if (DEMO_MODE) return demoProvider.getEvents();
    const res = await apiClient.get('/events');
    return res.data;
  },

  async getEvent(id: string): Promise<DetectedEvent | null> {
    if (DEMO_MODE) return demoProvider.getEvent(id);
    const res = await apiClient.get(`/events/${id}`);
    return res.data;
  },

  async createEvent(data: Partial<DetectedEvent>): Promise<DetectedEvent> {
    if (DEMO_MODE) {
      const newEvent: DetectedEvent = {
        id: `evt-${Date.now()}`,
        sessionId: 'ses-demo',
        vehicleId: 'veh-001',
        vehicleReg: 'MH09AB1234',
        type: data.type || 'POTHOLE',
        module: data.module || 'ROAD_DEFECT',
        severity: data.severity || 'MEDIUM',
        status: 'DETECTED',
        location: data.location || 'Kolhapur',
        lat: data.lat || 16.7050,
        lng: data.lng || 74.2433,
        detectedAt: new Date().toISOString(),
        description: data.description || '',
        confidence: 85,
      };
      return Promise.resolve(newEvent);
    }
    const res = await apiClient.post('/events', data);
    return res.data;
  },

  async acknowledgeEvent(id: string): Promise<void> {
    if (DEMO_MODE) return Promise.resolve();
    await apiClient.post(`/events/${id}/acknowledge`);
  },

  async disputeEvent(id: string, reason: string, description: string): Promise<void> {
    if (DEMO_MODE) return Promise.resolve();
    await apiClient.post(`/events/${id}/dispute`, { reason, description });
  },

  async updateEventStatus(id: string, status: string): Promise<void> {
    if (DEMO_MODE) return Promise.resolve();
    await apiClient.patch(`/events/${id}`, { status });
  },
};
