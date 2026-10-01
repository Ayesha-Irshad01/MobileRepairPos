import { connectDB } from "@/lib/mongodb";
import Staff from "@/models/Staff";
import { requireRole } from "@/middleware/auth";

export async function GET(request, { params }) {
  try {
    requireRole(request, "Admin");
    await connectDB();

    const { id } = await params;

    const staff = await Staff.findById(id);

    if (!staff) {
      return Response.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    return Response.json(staff);

  } catch (error) {
    console.error("GET STAFF ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(request, { params }) {
  try {
    requireRole(request, "Admin");
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const staff = await Staff.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!staff) {
      return Response.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    return Response.json(staff);

  } catch (error) {
    console.error("UPDATE STAFF ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    requireRole(request, "Admin");
    await connectDB();

    const { id } = await params;

    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return Response.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Staff member deleted successfully"
    });

  } catch (error) {
    console.error("DELETE STAFF ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}