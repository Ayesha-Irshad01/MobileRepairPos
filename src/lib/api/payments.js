import { apiClient } from "./client";

export const paymentApi = {
  getAll: async () => {
    return apiClient.get("/api/payments");
  },

  getById: async (id) => {
    return apiClient.get(`/api/payments/${id}`);
  },

  create: async (data) => {
    return apiClient.post("/api/payments", data);
  },

  update: async (id, data) => {
    return apiClient.patch(`/api/payments/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`/api/payments/${id}`);
  },

  getInvoiceStatus: async (invoiceId) => {
    return apiClient.get(
      `/api/payments/invoice/${invoiceId}/status`
    );
  },
};