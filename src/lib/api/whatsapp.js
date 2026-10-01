import { apiClient } from "./client";

export const whatsappApi = {
  generateMessage: async (repairId, templateKey) =>
    apiClient.post("/api/whatsapp/message", {
      repairId,
      templateKey,
    }),
  sendMessage: async (repairId, templateKey, phoneNumber) =>
    apiClient.post("/api/whatsapp/send", {
      repairId,
      templateKey,
      phoneNumber,
    }),
};