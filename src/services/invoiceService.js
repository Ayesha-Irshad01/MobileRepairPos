import Repair from "@/models/Repair";
import Invoice from "@/models/Invoice";
import { connectDB } from "@/lib/mongodb";
import { getSettings } from "@/services/settingsService";
export function calculateInvoiceTotals(
  items = [],
  discount = 0,
  vatRate = 0
) {
  items.forEach((item) => {
    item.total = item.quantity * item.unitPrice;
  });

  let subtotal = 0;

  items.forEach((item) => {
    subtotal += item.total;
  });

  let vat = 0;

  items.forEach((item) => {
    vat += item.total * (item.vatRate / 100);
  });

  if (discount < 0) {
    throw new Error("Discount cannot be negative");
  }

  if (discount > subtotal + vat) {
    throw new Error("Discount cannot exceed invoice amount");
  }

  const total = subtotal + vat - discount;

  return {
    items,
    subtotal,
    vat,
    discount,
    total,
  };
}

async function generateInvoiceNumber() {
  const settings = await getSettings();

  const year = new Date().getFullYear();

  const invoicePrefix =
    settings?.invoices?.invoicePrefix || "INV-";

  const startingNumber =
    Number(settings?.invoices?.startingNumber) || 1;

  const prefix = `${invoicePrefix}${year}-`;

  const lastInvoice = await Invoice.findOne({
    invoiceNo: { $regex: `^${prefix}` },
  }).sort({ invoiceNo: -1 });

  let nextNumber = startingNumber;

  if (lastInvoice) {
    const lastNumber = parseInt(
      lastInvoice.invoiceNo.replace(prefix, ""),
      10
    );

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

export async function createInvoice(data) {
  await connectDB();

  if (!data.items || data.items.length === 0) {
    throw new Error("Invoice must contain at least one item");
  }

  if (data.relatedRepair) {
    const repair = await Repair.findById(data.relatedRepair);

    if (!repair) {
      throw new Error("Repair not found");
    }

    if (repair.customer.toString() !== data.customer.toString()) {
      throw new Error(
        "Invoice customer does not match repair customer"
      );
    }
  }

  const invoiceNo = await generateInvoiceNumber();

  const calculatedInvoice = calculateInvoiceTotals(
    data.items,
    data.discount
  );

  const invoice = await Invoice.create({
    ...data,
    invoiceNo,
    ...calculatedInvoice,
  });

  return invoice;
}