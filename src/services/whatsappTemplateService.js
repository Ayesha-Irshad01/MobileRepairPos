import { getSettings } from "@/services/settingsService";

const placeholderMap = {
  customer_name: (data) => data.customer?.name || "",

  shop_name: (data) => data.shop?.name || "",

  job_no: (data) => data.repair?.repairNo || "",

  device: (data) =>
    [data.device?.brand, data.device?.model]
      .filter(Boolean)
      .join(" "),

  brand: (data) => data.device?.brand || "",

  model: (data) => data.device?.model || "",

  issue: (data) => data.repair?.issue || "",

  repair_details: (data) =>
    data.repair?.repairDetails || "",

  amount: (data) => data.amount ?? "",

  paid: (data) => data.paid ?? "",

  balance: (data) => data.balance ?? "",

  delivery_date: (data) =>
    data.repair?.completedAt || "",

  warranty_date: (data) =>
    data.repair?.warrantyUntil || "",

  reason: (data) =>
    data.repair?.notes || "",

  shop_phone: (data) =>
    data.shop?.phone || "",

  shop_address: (data) =>
    data.shop?.address || "",
};

function replacePlaceholders(template, data) {
  return template.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (match, key) => {
      const resolver = placeholderMap[key];

      if (!resolver) {
        return match;
      }

      return resolver(data);
    }
  );
}

export async function generateWhatsAppMessage(
  templateKey,
  data
) {
  const settings = await getSettings();

  const templates =
    settings.whatsapp?.templates || [];

  const template = templates.find(
    (item) => item.key === templateKey
  );

  if (!template) {
    throw new Error("WhatsApp template not found");
  }

  if (!template.active) {
    throw new Error("WhatsApp template is inactive");
  }

  return {
    template,
    message: replacePlaceholders(
      template.message,
      data
    ),
  };
}