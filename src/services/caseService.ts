import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider } from './demoProvider';
import type { Case } from '@/types';

export const caseService = {
  async getCases(): Promise<Case[]> {
    if (DEMO_MODE) return demoProvider.getCases() as Promise<Case[]>;
    const res = await apiClient.get('/cases');
    return res.data;
  },

  async getCase(id: string): Promise<Case | null> {
    if (DEMO_MODE) return demoProvider.getCase(id) as Promise<Case | null>;
    const res = await apiClient.get(`/cases/${id}`);
    return res.data;
  },

  async updateCase(id: string, data: Partial<Case>): Promise<Case> {
    if (DEMO_MODE) {
      const c = await demoProvider.getCase(id);
      return Promise.resolve({ ...c!, ...data });
    }
    const res = await apiClient.patch(`/cases/${id}`, data);
    return res.data;
  },

  async createCase(data: Partial<Case>): Promise<Case> {
    if (DEMO_MODE) {
      return Promise.resolve({
        id: `case-${Date.now()}`,
        eventId: data.eventId || '',
        title: data.title || 'New Case',
        status: 'OPEN',
        severity: data.severity || 'MEDIUM',
        assignedTo: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: '',
      });
    }
    const res = await apiClient.post('/cases', data);
    return res.data;
  },
};
