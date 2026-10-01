import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return Response.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return Response.json(customer);

  } catch (error) {
    console.error("GET CUSTOMER ERROR:", error);

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

    const customer = await Customer.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return Response.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return Response.json(customer);

  } catch (error) {
    console.error("UPDATE CUSTOMER ERROR:", error);

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

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return Response.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Customer deleted successfully"
    });

  } catch (error) {
    console.error("DELETE CUSTOMER ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}