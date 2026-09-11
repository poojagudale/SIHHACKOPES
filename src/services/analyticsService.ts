import { DEMO_MODE } from './api';
import apiClient from './api';
import { demoProvider } from './demoProvider';

export const analyticsService = {
  async getDashboard() {
    if (DEMO_MODE) {
      const data = await demoProvider?.getAnalytics();
      return data?.dashboard;
    }
    const res = await apiClient?.get('/analytics/dashboard');
    return res?.data;
  },

  async getHotspots() {
    if (DEMO_MODE) {
      const data = await demoProvider?.getAnalytics();
      return data?.hotspots;
    }
    const res = await apiClient?.get('/analytics/hotspots');
    return res?.data;
  },

  async getTrendData() {
    if (DEMO_MODE) {
      const data = await demoProvider?.getAnalytics();
      return data?.trendData;
    }
    const res = await apiClient?.get('/analytics/events');
    return res?.data;
  },

  async getModuleBreakdown() {
    if (DEMO_MODE) {
      const data = await demoProvider?.getAnalytics();
      return data?.moduleBreakdown;
    }
    const res = await apiClient?.get('/analytics/events?group=module');
    return res?.data;
  },
};
