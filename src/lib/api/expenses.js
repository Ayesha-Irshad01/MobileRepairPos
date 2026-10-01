import { apiClient } from "./client";

export const expenseApi = {
  getAll: async () => apiClient.get("/api/expenses"),

  getById: async (id) =>
    apiClient.get(`/api/expenses/${id}`),

  create: async (data) =>
    apiClient.post("/api/expenses", data),

  update: async (id, data) =>
    apiClient.patch(`/api/expenses/${id}`, data),

  delete: async (id) =>
    apiClient.delete(`/api/expenses/${id}`),
};