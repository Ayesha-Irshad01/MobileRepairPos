"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function ExpensesSettingsPage() {
  const [form, setForm] = useState({
    expensePrefix: "",
    startingNumber: 1,
    paymentMethod: "Cash",
    defaultVatRate: 0,
    categories: "",
    requireReceipt: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await settingsApi.get();

      setForm({
        expensePrefix: settings.expenses?.expensePrefix || "",
        startingNumber: settings.expenses?.startingNumber ?? 1,
        paymentMethod: settings.expenses?.paymentMethod || "Cash",
        defaultVatRate: settings.expenses?.defaultVatRate ?? 0,
        categories: (settings.expenses?.categories || []).join("\n"),
        requireReceipt: settings.expenses?.requireReceipt ?? false,
      });
    } catch (error) {
      console.error("Failed to load expense settings:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function convertToArray(value) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await settingsApi.update({
        expenses: {
          expensePrefix: form.expensePrefix,
          startingNumber: Number(form.startingNumber),
          paymentMethod: form.paymentMethod,
          defaultVatRate: Number(form.defaultVatRate),
          categories: convertToArray(form.categories),
          requireReceipt: form.requireReceipt,
        },
      });

      setMessage("Expense settings saved successfully.");
    } catch (error) {
      console.error("Failed to save expense settings:", error);
      setMessage("Failed to save expense settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure expense numbering, defaults, categories, and receipt requirements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Numbering */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Numbering
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expense Prefix
              </label>

              <input
                type="text"
                name="expensePrefix"
                value={form.expensePrefix}
                onChange={handleChange}
                placeholder="EXP-"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting Number
              </label>

              <input
                type="number"
                name="startingNumber"
                min="1"
                value={form.startingNumber}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Defaults */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Defaults
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Payment Method
              </label>

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default VAT Rate (%)
              </label>

              <input
                type="number"
                name="defaultVatRate"
                min="0"
                step="0.01"
                value={form.defaultVatRate}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Expense Categories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add one category per line.
          </p>

          <textarea
            name="categories"
            value={form.categories}
            onChange={handleChange}
            rows={12}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={"Rent\nElectricity\nSalaries\nInternet"}
          />
        </section>

        {/* Receipt */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Receipt
          </h2>

          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              name="requireReceipt"
              checked={form.requireReceipt}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="text-sm text-gray-700">
              Require a receipt for expenses
            </span>
          </label>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}