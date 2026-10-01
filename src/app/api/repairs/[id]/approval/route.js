import { processRepairApproval } from "@/services/repairService";
import { requireRole } from "@/middleware/auth";
export async function PATCH(request, { params }) {
  try {
   requireRole(request, "Admin", "Receptionist", "Technician");
    
    const { id } = await params;
    const body = await request.json();

    if (!body.decision) {
      return Response.json(
        { error: "Approval decision is required" },
        { status: 400 }
      );
    }

    const updatedRepair = await processRepairApproval(
      id,
      body.decision
    );

    return Response.json(updatedRepair);

  } catch (error) {
    console.error("APPROVAL ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}