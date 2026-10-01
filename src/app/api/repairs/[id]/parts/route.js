import { useRepairPart as addRepairPart, removeRepairPart } from "@/services/repairService";
import { requireRole } from "@/middleware/auth";


export async function PATCH(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist", "Technician");
    
    const { id } = await params;

    const body = await request.json();
    
    const repair = await addRepairPart(
      id,
      body.inventoryItemId,
      body.quantity
    );

    return Response.json(repair);

  } catch (error) {
    console.error("USE REPAIR PART ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist", "Technician");
    
    const { id } = await params;

    const body = await request.json();

    const repair = await removeRepairPart(
      id,
      body.inventoryItemId
    );

    return Response.json(repair);

  } catch (error) {
    console.error("REMOVE REPAIR PART ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}