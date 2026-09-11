import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider } from './demoProvider';
import type { Session } from '@/types';

export const sessionService = {
  async startSession(data: { vehicleId: string; cameraSource: string; lat: number; lng: number }): Promise<Session> {
    if (DEMO_MODE) {
      return Promise.resolve({
        id: `ses-${Date.now()}`,
        vehicleId: data.vehicleId,
        driverId: 'usr-011',
        status: 'ACTIVE',
        startedAt: new Date().toISOString(),
        route: 'Demo Route',
        detectionsCount: 0,
        distanceCovered: 0,
        city: 'Kolhapur',
      });
    }
    const res = await apiClient.post('/sessions/start', data);
    return res.data;
  },

  async endSession(sessionId: string): Promise<Session> {
    if (DEMO_MODE) {
      return Promise.resolve({
        id: sessionId,
        vehicleId: 'veh-001',
        driverId: 'usr-011',
        status: 'ENDED',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        endedAt: new Date().toISOString(),
        route: 'Demo Route',
        detectionsCount: Math.floor(5 + Math.random() * 20),
        distanceCovered: Math.floor(10 + Math.random() * 40),
        city: 'Kolhapur',
      });
    }
    const res = await apiClient.post(`/sessions/end/${sessionId}`);
    return res.data;
  },

  async updateLocation(sessionId: string, lat: number, lng: number): Promise<void> {
    if (DEMO_MODE) return Promise.resolve();
    await apiClient.post('/sessions/location', { sessionId, lat, lng });
  },

  async getHistory(): Promise<Session[]> {
    if (DEMO_MODE) return demoProvider.getSessions();
    const res = await apiClient.get('/sessions/history');
    return res.data;
  },
};
