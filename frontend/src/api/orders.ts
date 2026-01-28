import apiClient from './client';
import type { UnifiedOrder, PagedResult } from '../types';

export interface OrdersFilter {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  minFulfillment?: number;
  maxFulfillment?: number;
}

export const ordersApi = {
  getAll: async (filter: OrdersFilter = {}): Promise<PagedResult<UnifiedOrder>> => {
    const { data } = await apiClient.get<PagedResult<UnifiedOrder>>('/orders', {
      params: filter,
    });
    return data;
  },

  getById: async (id: number): Promise<UnifiedOrder> => {
    const { data } = await apiClient.get<UnifiedOrder>(`/orders/${id}`);
    return data;
  },

  importCsv: async (file: File, type: 'mes' | 'erp'): Promise<{ importedCount: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const { data } = await apiClient.post<{ importedCount: number }>('/orders/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
