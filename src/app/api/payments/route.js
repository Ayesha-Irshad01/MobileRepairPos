import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Customer from "@/models/Customer";
import Repair from "@/models/Repair";
import Invoice from "@/models/Invoice";
import { createPayment } from "@/services/paymentService";
import { requireRole } from "@/middleware/auth";

export async function POST(request) {
  try {
    requireRole(request,"Admin","Receptionist");
    await connectDB();

    const body = await request.json();

    const payment = await createPayment(body);

    return Response.json(payment, { status: 201 });

  } catch (error) {
    console.error("CREATE PAYMENT ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    requireRole(request,"Admin","Receptionist");

    await connectDB();

    const payments = await Payment.find()
      .populate("customer")
      .populate("relatedRepair")
      .populate("relatedInvoice");

    return Response.json(payments);

  } catch (error) {
    console.error("GET PAYMENTS ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}