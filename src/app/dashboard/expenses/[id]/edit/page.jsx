"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { expenseApi } from "@/lib/api/expenses";

export default function EditExpensePage() {
  const { id } = useParams();
  const router = useRouter();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  async function handleSubmit(data) {
    try {
      setSubmitting(true);
      setError("");

      await expenseApi.update(id, data);

      router.push(`/dashboard/expenses/${id}`);
    } catch (error) {
      console.error("UPDATE EXPENSE ERROR", error);
      setError(error.message || "Failed to update expense");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading expense...
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="space-y-4 ">
        <button
          onClick={() => router.push("/dashboard/expenses")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Expenses
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Expense not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <button
          onClick={() =>
            router.push(`/dashboard/expenses/${id}`)
          }
          className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Expense
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Expense
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update {expense.expenseNo}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <ExpenseForm
        initialData={expense}
        onSubmit={handleSubmit}
        onCancel={() =>
          router.push(`/dashboard/expenses/${id}`)
        }
        submitting={submitting}
      />

    </div>
  );
}