import { apiClient } from './client';

export const repairApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = `/api/repairs${queryString ? `?${queryString}` : ''}`;
    return apiClient.get(url);
  },
  
  getById: async (id) => {
    return apiClient.get(`/api/repairs/${id}`);
  },
  
  create: async (data) => {
    return apiClient.post('/api/repairs', data);
  },
  
  update: async (id, data) => {
    return apiClient.patch(`/api/repairs/${id}`, data);
  },
  
  updateStatus: async (id, status) =>
  apiClient.patch(`/api/repairs/${id}/status`, { status }),
  
  usePart: async (id, inventoryItemId, quantity) =>
  apiClient.patch(`/api/repairs/${id}/parts`, {
    inventoryItemId,
    quantity,
  }),

removePart: async (id, inventoryItemId) =>
  apiClient.delete(`/api/repairs/${id}/parts`, {
    inventoryItemId,
  }),
  delete: async (id) =>
  apiClient.delete(`/api/repairs/${id}`),
};
