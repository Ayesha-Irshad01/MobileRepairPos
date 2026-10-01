import { getInvoicePaymentStatus } from "@/services/paymentService";
import { requireRole } from "@/middleware/auth";
export async function GET(request, { params }) {
  try {
    requireRole(request,"Admin","Receptionist");
    
    const { invoiceId } = await params;

    const result = await getInvoicePaymentStatus(invoiceId);

    return Response.json(result);

  } catch (error) {
    console.error("PAYMENT STATUS ERROR", error);

    if (error.message === "Invoice not found") {
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