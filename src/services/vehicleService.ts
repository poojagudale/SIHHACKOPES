import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider } from './demoProvider';
import type { Vehicle } from '@/types';

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    if (DEMO_MODE) return demoProvider.getVehicles();
    const res = await apiClient.get('/fleet');
    return res.data;
  },

  async getVehicle(id: string): Promise<Vehicle | null> {
    if (DEMO_MODE) return demoProvider.getVehicle(id);
    const res = await apiClient.get(`/fleet/${id}`);
    return res.data;
  },

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    if (DEMO_MODE) {
      const v = await demoProvider.getVehicle(id);
      return Promise.resolve({ ...v!, ...data });
    }
    const res = await apiClient.patch(`/fleet/${id}`, data);
    return res.data;
  },

  async getMapVehicles(): Promise<Array<{ vehicleId: string; vehicleNumber: string; lat: number; lng: number; speed: number; status: string; lastUpdated: string }>> {
    if (DEMO_MODE) {
      const vehicles = await demoProvider.getVehicles();
      return vehicles.map((v) => ({
        vehicleId: v.id,
        vehicleNumber: v.registrationNumber,
        lat: v.city === 'Kolhapur' ? 16.7050 + (Math.random() - 0.5) * 0.01 : v.city === 'Pune' ? 18.5018 + (Math.random() - 0.5) * 0.01 : 19.1136 + (Math.random() - 0.5) * 0.01,
        lng: v.city === 'Kolhapur' ? 74.2433 + (Math.random() - 0.5) * 0.01 : v.city === 'Pune' ? 73.9252 + (Math.random() - 0.5) * 0.01 : 72.8697 + (Math.random() - 0.5) * 0.01,
        speed: v.status === 'SESSION_ACTIVE' ? Math.floor(20 + Math.random() * 40) : 0,
        status: v.status,
        lastUpdated: v.lastSeen,
      }));
    }
    const res = await apiClient.get('/map/vehicles');
    return res.data;
  },
};
