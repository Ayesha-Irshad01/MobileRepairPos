import Payment from "@/models/Payment";
import Invoice from "@/models/Invoice";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function createPayment(data) {
  await connectDB();

  // 1. Validate amount
  if (data.amount <= 0) {
    throw new Error("Payment amount must be greater than 0");
  }

  // 2. Validate customer
  const customer = await Customer.findById(data.customer);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // 3. If payment is linked to an invoice,
  // validate the invoice and payment balance
  if (data.relatedInvoice) {
    const invoice = await Invoice.findById(data.relatedInvoice);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Payment customer must match invoice customer
    if (invoice.customer.toString() !== data.customer.toString()) {
      throw new Error(
        "Payment customer does not match invoice customer"
      );
    }

    // Get existing payments for this invoice
    const existingPayments = await Payment.find({
      relatedInvoice: data.relatedInvoice,
    });

    const totalPaid = existingPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const remainingBalance = invoice.total - totalPaid;

    if (data.amount > remainingBalance) {
      throw new Error(
        "Payment exceeds remaining invoice balance"
      );
    }
  }

  // 4. Save payment + customer's name snapshot
  const payment = await Payment.create({
    ...data,
    customerName: customer.name,
  });

  return payment;
}
export async function updatePayment(paymentId, data) {
  await connectDB();

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (data.amount <= 0) {
    throw new Error("Payment amount must be greater than 0");
  }

  const customer = await Customer.findById(data.customer);

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (data.relatedInvoice) {
    const invoice = await Invoice.findById(data.relatedInvoice);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (
      invoice.customer.toString() !==
      data.customer.toString()
    ) {
      throw new Error(
        "Payment customer does not match invoice customer"
      );
    }

    const existingPayments = await Payment.find({
      relatedInvoice: data.relatedInvoice,
      _id: { $ne: paymentId },
    });

    const totalPaid = existingPayments.reduce(
      (sum, existingPayment) =>
        sum + existingPayment.amount,
      0
    );

    const remainingBalance =
      invoice.total - totalPaid;

    if (data.amount > remainingBalance) {
      throw new Error(
        "Payment exceeds remaining invoice balance"
      );
    }
  }

  payment.customer = data.customer;
  payment.customerName = customer.name;
  payment.amount = data.amount;
  payment.paymentMethod = data.paymentMethod;
  payment.paymentDate = data.paymentDate;
  payment.relatedRepair = data.relatedRepair || null;
  payment.relatedInvoice = data.relatedInvoice || null;
  payment.reference = data.reference || "";
  payment.notes = data.notes || "";

  await payment.save();

  return payment;
}

export async function getInvoicePaymentStatus(invoiceId) {
  await connectDB();

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const payments = await Payment.find({
    relatedInvoice: invoiceId,
  });

  const totalPaid = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const remainingBalance = invoice.total - totalPaid;

  let paymentStatus;

  if (totalPaid === 0) {
    paymentStatus = "Unpaid";
  } else if (totalPaid < invoice.total) {
    paymentStatus = "Partially Paid";
  } else {
    paymentStatus = "Paid";
  }

  return {
    invoiceTotal: invoice.total,
    totalPaid,
    remainingBalance,
    paymentStatus,
  };
}