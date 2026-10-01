import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Customer from "@/models/Customer";
import Repair from "@/models/Repair";
import Invoice from "@/models/Invoice";
import { requireRole } from "@/middleware/auth";
import { updatePayment } from "@/services/paymentService";

export async function GET(request, { params }) {
  try {
   requireRole(request,"Admin","Receptionist");
    
    await connectDB();

    const { id } = await params;

    const payment = await Payment.findById(id)
      .populate("customer")
      .populate("relatedRepair")
      .populate("relatedInvoice");

    if (!payment) {
      return Response.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return Response.json(payment);

  } catch (error) {
    console.error("GET PAYMENT ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist");

    const { id } = await params;
    const body = await request.json();

    const payment = await updatePayment(id, body);

    return Response.json(payment);
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR", error);

    if (error.message === "Payment not found") {
      return Response.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    requireRole(request,"Admin","Receptionist");
    
    await connectDB();

    const { id } = await params;

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return Response.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Payment deleted successfully",
    });

  } catch (error) {
    console.error("DELETE PAYMENT ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}