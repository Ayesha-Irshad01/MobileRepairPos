"use client";

import { useEffect, useState } from "react";

const categories = [
  "Rent",
  "Electricity",
  "Salaries",
  "Internet",
  "Spare Parts",
  "Tools",
  "Transport",
  "Marketing",
  "Cleaning",
  "Software",
  "Bank Charges",
  "Miscellaneous Charges",
];

const paymentMethods = [
  "Cash",
  "Card",
  "Bank Transfer",
  "Other",
];

export default function ExpenseForm({
  initialData = null,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    amount: 0,
    vatRate: 0,
    paymentMethod: "",
    receipt: "",
    notes: "",
  });

  useEffect(() => {
    if (!initialData) return;

    setForm({
      date: initialData.date
        ? new Date(initialData.date)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0],

      description: initialData.description || "",
      category: initialData.category || "",
      amount: initialData.amount ?? 0,
      vatRate: initialData.vatRate ?? 0,
      paymentMethod: initialData.paymentMethod || "",
      receipt: initialData.receipt || "",
      notes: initialData.notes || "",
    });
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const amount = Number(form.amount) || 0;
  const vatRate = Number(form.vatRate) || 0;
  const vat = amount * (vatRate / 100);
  const total = amount + vat;

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      ...form,
      amount,
      vatRate,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">
            Expense Information
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. September electricity bill"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
                required
              />
            </div>

            {/* VAT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VAT Rate (%)
              </label>
              <input
                type="number"
                name="vatRate"
                min="0"
                step="0.01"
                value={form.vatRate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
                required
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Receipt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt
              </label>
              <input
                type="text"
                name="receipt"
                value={form.receipt}
                onChange={handleChange}
                placeholder="Receipt reference / filename"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 h-10"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">
            Summary
          </h2>
        </div>
        <div className="p-6">
          <div className="ml-auto max-w-sm space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Amount
              </span>
              <span className="font-medium text-gray-900">
                {amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">
                VAT ({vatRate}%)
              </span>
              <span className="font-medium text-gray-900">
                {vat.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900">
                  Rs. {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : initialData
              ? "Update Expense"
              : "Create Expense"}
        </button>
      </div>

    </form>
  );
}