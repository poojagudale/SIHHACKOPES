import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider, DEMO_USERS } from './demoProvider';

export const userService = {
  async getMe() {
    if (DEMO_MODE) return demoProvider.getUser('usr-011');
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  async updateMe(data: Record<string, unknown>) {
    if (DEMO_MODE) return Promise.resolve({ ...DEMO_USERS[0], ...data });
    const res = await apiClient.put('/users/me', data);
    return res.data;
  },

  async getUsers() {
    if (DEMO_MODE) return demoProvider.getUsers();
    const res = await apiClient.get('/admin/users');
    return res.data;
  },

  async createUser(data: Record<string, unknown>) {
    if (DEMO_MODE) return Promise.resolve({ id: `usr-${Date.now()}`, ...data });
    const res = await apiClient.post('/admin/users', data);
    return res.data;
  },

  async updateUser(id: string, data: Record<string, unknown>) {
    if (DEMO_MODE) return Promise.resolve({ id, ...data });
    const res = await apiClient.put(`/admin/users/${id}`, data);
    return res.data;
  },

  async getAuditLogs() {
    if (DEMO_MODE) return demoProvider.getAuditLogs();
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  },
};
