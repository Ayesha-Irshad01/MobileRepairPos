import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { createExpense } from "@/services/expenseService";

export async function POST(request) {
  try {
    const body = await request.json();

    const expense = await createExpense(body);

    return Response.json(expense, { status: 201 });
  } catch (error) {
    console.error("CREATE EXPENSE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const expenses = await Expense.find().sort({ date: -1 });

    return Response.json(expenses);
  } catch (error) {
    console.error("GET EXPENSES ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}