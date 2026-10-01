import { apiClient } from './client';

export const customerApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = `/api/customers${queryString ? `?${queryString}` : ''}`;
    return apiClient.get(url);
  },
  
  getById: async (id) => {
    return apiClient.get(`/api/customers/${id}`);
  },
  
  create: async (data) => {
    return apiClient.post('/api/customers', data);
  },
  delete: async (id) =>
  apiClient.delete(`/api/customers/${id}`),
  
  update: async (id, data) => {
    return apiClient.patch(`/api/customers/${id}`, data);
  }
  
};
