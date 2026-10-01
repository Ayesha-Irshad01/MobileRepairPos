import { apiClient } from "./client";

export const staffApi = {
  getAll: async () => apiClient.get("/api/staff"),

  getById: async (id) =>
    apiClient.get(`/api/staff/${id}`),

  create: async (data) =>
    apiClient.post("/api/staff", data),

  update: async (id, data) =>
    apiClient.patch(`/api/staff/${id}`, data),

  delete: async (id) =>
    apiClient.delete(`/api/staff/${id}`),
};