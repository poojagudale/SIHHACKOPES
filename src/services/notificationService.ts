import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider } from './demoProvider';
import type { Notification } from '@/types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    if (DEMO_MODE) return demoProvider.getNotifications() as Promise<Notification[]>;
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  async markRead(id: string): Promise<void> {
    if (DEMO_MODE) return Promise.resolve();
    await apiClient.patch(`/notifications/${id}`, { isRead: true });
  },

  async markAllRead(): Promise<void> {
    if (DEMO_MODE) return Promise.resolve();
    await apiClient.patch('/notifications/mark-all-read');
  },
};
