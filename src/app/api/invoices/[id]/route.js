import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Customer from "@/models/Customer";
import Repair from "@/models/Repair";
import Inventory from "@/models/Inventory";
import { calculateInvoiceTotals } from "@/services/invoiceService";
import { requireRole } from "@/middleware/auth";
export async function GET(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist");
    await connectDB();

    const { id } = await params;

    const invoice = await Invoice.findById(id)
      .populate("customer")
      .populate("relatedRepair")
      .populate("items.inventoryItem");

    if (!invoice) {
      return Response.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return Response.json(invoice);

  } catch (error) {
    console.error("GET INVOICE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist");
    await connectDB();

    const { id } = await params;

    const body = await request.json();
    const existingInvoice = await Invoice.findById(id);
    if(!existingInvoice){
      return Response.json(
        {error: "Invoice not found"},
        {status:404}
      );
    }
    const updatedData = {
      ...existingInvoice.toObject(),
      ...body,
    };
    const calculatedInvoice = calculateInvoiceTotals(
  updatedData.items,
  updatedData.discount
);
    const invoice = await Invoice.findByIdAndUpdate(
  id,
  {
    ...updatedData,
    ...calculatedInvoice,
  },
  {
    new: true,
    runValidators: true,
  }
);

    if (!invoice) {
      return Response.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return Response.json(invoice);

  } catch (error) {
    console.error("UPDATE INVOICE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist");
    await connectDB();

    const { id } = await params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return Response.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Invoice deleted successfully",
    });

  } catch (error) {
    console.error("DELETE INVOICE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}