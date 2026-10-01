import { updateRepairStatus } from "@/services/repairService";
import { requireRole } from "@/middleware/auth";

export async function PATCH(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist", "Technician");
    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return Response.json(
        { error: "Status field is required" },
        { status: 400 }
      );
    }

    const updatedRepair = await updateRepairStatus(id, body.status);

    return Response.json(updatedRepair);

  } catch (error) {
    console.error("STATUS UPDATE ERROR", error);

    if (error.message === "Repair not found") {
      return Response.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
