import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const item = await Inventory.findById(id);

    if (!item) {
      return Response.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return Response.json(item);

  } catch (error) {
    console.error("GET INVENTORY ITEM ERROR", error);

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

    const item = await Inventory.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      return Response.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return Response.json(item);

  } catch (error) {
    console.error("UPDATE INVENTORY ERROR", error);

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

    const item = await Inventory.findByIdAndDelete(id);

    if (!item) {
      return Response.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Inventory item deleted successfully"
    });

  } catch (error) {
    console.error("DELETE INVENTORY ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}