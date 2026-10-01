import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import { createInvoice } from "@/services/invoiceService";
import { requireRole } from "@/middleware/auth";
import Inventory from "@/models/Inventory";
import Customer from "@/models/Customer";
export async function POST(request) {
  try {
    requireRole(request, "Admin", "Receptionist");
    const body = await request.json();

    const invoice = await createInvoice(body);

    return Response.json(invoice, { status: 201 });

  } catch (error) {
    console.error("CREATE INVOICE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    requireRole(request, "Admin", "Receptionist");
    await connectDB();

    const invoices = await Invoice.find()
      .populate("customer")
      .populate("relatedRepair")
      .populate("items.inventoryItem");

    return Response.json(invoices);

  } catch (error) {
    console.error("GET INVOICES ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
