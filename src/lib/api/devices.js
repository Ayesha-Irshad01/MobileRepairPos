import { apiClient } from "./client";

export const deviceApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();

    const url = `/api/devices${queryString ? `?${queryString}` : ""}`;

    return apiClient.get(url);
  },

  getById: async (id) => {
    return apiClient.get(`/api/devices/${id}`);
  },

  create: async (data) => {
    return apiClient.post("/api/devices", data);
  },

  update: async (id, data) => {
    return apiClient.patch(`/api/devices/${id}`, data);
  },
  delete: async (id) => {
    return apiClient.delete(`/api/devices/${id}`);
  },
};