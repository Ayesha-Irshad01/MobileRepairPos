import Repair from "@/models/Repair";
import Invoice from "@/models/Invoice";
import { connectDB } from "@/lib/mongodb";
import { getSettings } from "@/services/settingsService";
import { getInvoicePaymentStatus } from "@/services/paymentService";

export async function buildWhatsAppData(repairId) {
  await connectDB();

  const repair = await Repair.findById(repairId)
    .populate("customer")
    .populate("device");

  if (!repair) {
    throw new Error("Repair not found");
  }

  const settings = await getSettings();

  const invoice = await Invoice.findOne({
    relatedRepair: repair._id,
  });

  let amount = 0;
  let paid = 0;
  let balance = 0;

  if (invoice) {
    const paymentStatus = await getInvoicePaymentStatus(
      invoice._id
    );

    amount = paymentStatus.invoiceTotal;
    paid = paymentStatus.totalPaid;
    balance = paymentStatus.remainingBalance;
  }

  return {
    customer: repair.customer,
    device: repair.device,
    repair,

    shop: {
      name: settings.business?.shopName || "",
      phone: settings.business?.phone || "",
      address: settings.business?.address || "",
    },

    amount,
    paid,
    balance,
  };
}