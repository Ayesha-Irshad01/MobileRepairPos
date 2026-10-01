import { apiClient } from "./client";

export const settingsApi = {
  get: async () => apiClient.get("/api/settings"),

  update: async (data) =>
    apiClient.patch("/api/settings", data),
};