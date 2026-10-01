"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { expenseApi } from "@/lib/api/expenses";

export default function ExpensesPage() {
  const router = useRouter();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      setLoading(true);
      setError("");

      const data = await expenseApi.getAll();

      setExpenses(data);
    } catch (error) {
      console.error("GET EXPENSES ERROR", error);
      setError(error.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await expenseApi.delete(id);

      setExpenses((prev) =>
        prev.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      console.error("DELETE EXPENSE ERROR", error);

      setError(
        error.message || "Failed to delete expense"
      );
    }
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Expenses
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track and manage your business expenses.
          </p>
        </div>

        <button
          onClick={() =>
            router.push("/dashboard/expenses/new")
          }
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + New Expense
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {expenses.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Amount
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {expenses
              .reduce(
                (sum, expense) =>
                  sum + Number(expense.total ?? expense.amount ?? 0),
                0
              )
              .toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            This Month
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {expenses
              .filter((expense) => {
                const date = new Date(expense.date);
                const now = new Date();

                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              })
              .reduce(
                (sum, expense) =>
                  sum + Number(expense.total ?? expense.amount ?? 0),
                0
              )
              .toFixed(2)}
          </p>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Expense Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Expense Records
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-500">
              No expenses found.
            </p>

            <button
              onClick={() =>
                router.push("/dashboard/expenses/new")
              }
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Create your first expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Expense No
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">

                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    onClick={() =>
                      router.push(
                        `/dashboard/expenses/${expense._id}`
                      )
                    }
                    className="cursor-pointer hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {expense.expenseNo}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        expense.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {expense.description || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {expense.category}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {expense.paymentMethod}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 text-right">
                      {Number(
                        expense.total ?? expense.amount ?? 0
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/expenses/${expense._id}`
                            );
                          }}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/expenses/${expense._id}/edit`
                            );
                          }}
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(expense._id);
                          }}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}