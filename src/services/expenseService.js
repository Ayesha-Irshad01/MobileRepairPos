import Expense from "@/models/Expense";
import { connectDB } from "@/lib/mongodb";

export function calculateExpenseTotals(amount, vatRate = 0) {
  const expenseAmount = Number(amount) || 0;
  const rate = Number(vatRate) || 0;

  if (expenseAmount < 0) {
    throw new Error("Expense amount cannot be negative");
  }

  if (rate < 0) {
    throw new Error("VAT rate cannot be negative");
  }

  const vat = expenseAmount * (rate / 100);
  const total = expenseAmount + vat;

  return {
    amount: expenseAmount,
    vatRate: rate,
    vat,
    total,
  };
}

async function generateExpenseNumber() {
  const year = new Date().getFullYear();
  const prefix = `EXP-${year}-`;

  const lastExpense = await Expense.findOne({
    expenseNo: { $regex: `^${prefix}` },
  }).sort({ expenseNo: -1 });

  let nextNumber = 1;

  if (lastExpense) {
    const lastNumber = parseInt(
      lastExpense.expenseNo.replace(prefix, ""),
      10
    );

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

export async function createExpense(data) {
  await connectDB();


  if (!data.category) {
    throw new Error("Expense category is required");
  }

  if (!data.paymentMethod) {
    throw new Error("Payment method is required");
  }

  const expenseNo = await generateExpenseNumber();

  const calculatedTotals = calculateExpenseTotals(
    data.amount,
    data.vatRate
  );

  const expense = await Expense.create({
    ...data,
    expenseNo,
    ...calculatedTotals,
  });

  return expense;
}