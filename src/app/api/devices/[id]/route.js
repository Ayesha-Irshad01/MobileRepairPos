import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const device = await Device.findById(id);

    if (!device) {
      return Response.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    return Response.json(device);

  } catch (error) {
    console.error("GET DEVICE ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const device = await Device.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!device) {
      return Response.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    return Response.json(device);

  } catch (error) {
    console.error("UPDATE DEVICE ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return Response.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Device deleted successfully"
    });

  } catch (error) {
    console.error("DELETE DEVICE ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}