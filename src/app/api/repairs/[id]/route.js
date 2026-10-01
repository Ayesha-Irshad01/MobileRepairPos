import { connectDB } from "@/lib/mongodb";
import Repair from "@/models/Repair";
import { requireRole } from "@/middleware/auth";
export async function GET(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist", "Technician");
    
    await connectDB();

    const { id } = await params;

    const repair = await Repair.findById(id)
  .populate("customer")
  .populate("device")
  .populate("partsUsed.inventoryItem");

    if (!repair) {
      return Response.json(
        { error: "Repair not found" },
        { status: 404 }
      );
    }

    return Response.json(repair);

  } catch (error) {
    console.error("GET REPAIR ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(request, { params }) {
  try {
    requireRole(request, "Admin", "Receptionist", "Technician");

    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const repair = await Repair.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("customer")
      .populate("device");

    if (!repair) {
      return Response.json(
        { error: "Repair not found" },
        { status: 404 }
      );
    }

    return Response.json(repair);

  } catch (error) {
    console.error("UPDATE REPAIR ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
     requireRole(request, "Admin", "Receptionist", "Technician");
    
    await connectDB();

    const { id } = await params;

    const repair = await Repair.findByIdAndDelete(id);

    if (!repair) {
      return Response.json(
        { error: "Repair not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Repair deleted successfully"
    });

  } catch (error) {
    console.error("DELETE REPAIR ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}