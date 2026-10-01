import { apiClient } from "./client";

export const inventoryApi = {
  // Get all inventory items
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();

    const url = `/api/inventory${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get(url);
  },

  // Get one inventory item
  getById: async (id) => {
    return apiClient.get(`/api/inventory/${id}`);
  },

  // Create inventory item
  create: async (data) => {
    return apiClient.post("/api/inventory", data);
  },

  // Update inventory item
  update: async (id, data) => {
    return apiClient.patch(`/api/inventory/${id}`, data);
  },

  // Delete inventory item
  delete: async (id) => {
    return apiClient.delete(`/api/inventory/${id}`);
  },

  // Add or remove stock
  updateStock: async (id, operation, quantity) => {
    return apiClient.patch(`/api/inventory/${id}/stock`, {
      operation,
      quantity,
    });
  },

  // Get low-stock items
  getLowStock: async () => {
    return apiClient.get("/api/inventory/low-stock");
  },
};