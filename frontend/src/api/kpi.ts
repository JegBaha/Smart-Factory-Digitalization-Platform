import apiClient from './client';
import type { KPISummary, KPISnapshot } from '../types';

export const kpiApi = {
  getSummary: async (): Promise<KPISummary> => {
    const { data } = await apiClient.get<KPISummary>('/kpi/summary');
    return data;
  },

  getSnapshots: async (days = 30): Promise<KPISnapshot[]> => {
    const { data } = await apiClient.get<KPISnapshot[]>('/kpi/snapshots', {
      params: { days },
    });
    return data;
  },

  refresh: async (): Promise<void> => {
    await apiClient.post('/kpi/refresh');
  },
};
