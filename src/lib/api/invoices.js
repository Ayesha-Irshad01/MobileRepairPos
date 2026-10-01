import { apiClient } from "./client";

export const invoiceApi = {
  getAll: async () => {
    return apiClient.get("/api/invoices");
  },

  getById: async (id) => {
    return apiClient.get(`/api/invoices/${id}`);
  },

  create: async (data) => {
    return apiClient.post("/api/invoices", data);
  },

  update: async (id, data) => {
    return apiClient.patch(`/api/invoices/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`/api/invoices/${id}`);
  },
};