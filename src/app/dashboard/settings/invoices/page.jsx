"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function InvoicesSettingsPage() {
  const [form, setForm] = useState({
    invoicePrefix: "",
    startingNumber: 1,
    receiptPrefix: "",
    paymentTerms: "",
    footer: "",
    notes: "",
    showVatNumber: false,
    showRegistrationNumber: false,
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
        invoicePrefix: settings.invoices?.invoicePrefix || "",
        startingNumber: settings.invoices?.startingNumber ?? 1,
        receiptPrefix: settings.invoices?.receiptPrefix || "",
        paymentTerms: settings.invoices?.paymentTerms || "",
        footer: settings.invoices?.footer || "",
        notes: settings.invoices?.notes || "",
        showVatNumber: settings.invoices?.showVatNumber ?? false,
        showRegistrationNumber:
          settings.invoices?.showRegistrationNumber ?? false,
      });
    } catch (error) {
      console.error("Failed to load invoice settings:", error);
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

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await settingsApi.update({
        invoices: {
          invoicePrefix: form.invoicePrefix,
          startingNumber: Number(form.startingNumber),
          receiptPrefix: form.receiptPrefix,
          paymentTerms: form.paymentTerms,
          footer: form.footer,
          notes: form.notes,
          showVatNumber: form.showVatNumber,
          showRegistrationNumber: form.showRegistrationNumber,
        },
      });

      setMessage("Invoice settings saved successfully.");
    } catch (error) {
      console.error("Failed to save invoice settings:", error);
      setMessage("Failed to save invoice settings.");
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
          Invoices
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure invoice numbering, payment terms, and invoice display options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Numbering */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Numbering
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Prefix
              </label>

              <input
                type="text"
                name="invoicePrefix"
                value={form.invoicePrefix}
                onChange={handleChange}
                placeholder="INV-"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Receipt Prefix
              </label>

              <input
                type="text"
                name="receiptPrefix"
                value={form.receiptPrefix}
                onChange={handleChange}
                placeholder="REC-"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Terms
          </h2>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Payment Terms
            </label>

            <input
              type="text"
              name="paymentTerms"
              value={form.paymentTerms}
              onChange={handleChange}
              placeholder="Due on receipt"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Invoice Text */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Invoice Text
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Footer
              </label>

              <textarea
                name="footer"
                value={form.footer}
                onChange={handleChange}
                rows={3}
                placeholder="Thank you for your business."
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Additional notes shown on invoices."
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Display Options */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Display Options
          </h2>

          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="showVatNumber"
                checked={form.showVatNumber}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">
                Show VAT Number on invoices
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="showRegistrationNumber"
                checked={form.showRegistrationNumber}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">
                Show Registration Number on invoices
              </span>
            </label>
          </div>
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