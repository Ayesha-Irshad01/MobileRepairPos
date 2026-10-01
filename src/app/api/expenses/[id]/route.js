import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return Response.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return Response.json(expense);

  } catch (error) {
    console.error("GET EXPENSE ERROR", error);

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

    const calculatedTotals = calculateExpenseTotals(
      body.amount,
      body.vatRate
    );

    const expense = await Expense.findByIdAndUpdate(
      id,
      {
        ...body,
        ...calculatedTotals,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return Response.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return Response.json(expense);
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR", error);

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

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return Response.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Expense deleted successfully",
    });

  } catch (error) {
    console.error("DELETE EXPENSE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}