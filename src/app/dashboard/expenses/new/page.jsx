"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { expenseApi } from "@/lib/api/expenses";

export default function NewExpensePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data) {
    try {
      setSubmitting(true);
      setError("");

      await expenseApi.create(data);

      router.push("/dashboard/expenses");
    } catch (error) {
      console.error("CREATE EXPENSE ERROR", error);
      setError(error.message || "Failed to create expense");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          New Expense
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Record a new business expense.
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
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/expenses")}
        submitting={submitting}
      />

    </div>
  );
}