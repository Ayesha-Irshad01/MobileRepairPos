"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { expenseApi } from "@/lib/api/expenses";

export default function ExpenseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExpense() {
      try {
        setLoading(true);
        setError("");

        const data = await expenseApi.getById(id);

        setExpense(data);
      } catch (error) {
        console.error("GET EXPENSE ERROR", error);
        setError(error.message || "Failed to load expense");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadExpense();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading expense...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push("/dashboard/expenses")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Expenses
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Expense not found.
      </div>
    );
  }

  const amount = Number(expense.amount || 0);
  const vatRate = Number(expense.vatRate || 0);
  const vat = amount * (vatRate / 100);
  const total = amount + vat;

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/dashboard/expenses")}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-3"
        >
          ← Back to Expenses
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {expense.expenseNo}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Expense details
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/expenses/${id}/edit`)}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expense Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Expense Information</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Expense No</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{expense.expenseNo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Date</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Description</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{expense.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Category</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{expense.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Method</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{expense.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Financial Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Amount</span>
                  <span className="text-sm font-medium text-gray-900">{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">VAT ({vatRate}%)</span>
                  <span className="text-sm font-medium text-gray-900">{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes / Receipt */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Receipt</p>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">{expense.receipt || "No receipt attached"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">{expense.notes || "No notes"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}