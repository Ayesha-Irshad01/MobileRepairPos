"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { settingsApi } from "@/lib/api/settings";
export default function PaymentForm({
  payment = null,
  onSuccess,
  onCancel,
}) {
  const [customers, setCustomers] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    paymentMethod: "Cash",
    paymentDate: "",
    relatedRepair: "",
    relatedInvoice: "",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    loadFormData();
  }, []);
  useEffect(() => {
  async function loadSettings() {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error) {
      console.error("LOAD SETTINGS ERROR:", error);
    }
  }

  loadSettings();
}, []);
  useEffect(() => {
    if (payment) {
      setFormData({
        customer:
          payment.customer?._id ||
          payment.customer ||
          "",

        amount: payment.amount || "",

        paymentMethod:
          payment.paymentMethod || "Cash",

        paymentDate: payment.paymentDate
          ? new Date(payment.paymentDate)
              .toISOString()
              .split("T")[0]
          : "",

        relatedRepair:
          payment.relatedRepair?._id ||
          payment.relatedRepair ||
          "",

        relatedInvoice:
          payment.relatedInvoice?._id ||
          payment.relatedInvoice ||
          "",

        reference: payment.reference || "",

        notes: payment.notes || "",
      });
    }
  }, [payment]);

  async function loadFormData() {
    try {
      const [
        customersData,
        repairsData,
        invoicesData,
      ] = await Promise.all([
        apiClient.get("/api/customers"),
        apiClient.get("/api/repairs"),
        apiClient.get("/api/invoices"),
      ]);

      setCustomers(customersData);
      setRepairs(repairsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error(
        "Failed to load payment form data:",
        error
      );

      setError(error.message);
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Customer validation
    if (!formData.customer) {
      setError("Please select a customer.");
      return;
    }

    // Amount validation
    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      setError("Please enter a valid payment amount.");
      return;
    }

    try {
      setSaving(true);

      const paymentData = {
        customer: formData.customer,

        amount: Number(formData.amount),

        paymentMethod: formData.paymentMethod,

        // Only send paymentDate if selected
        ...(formData.paymentDate && {
          paymentDate: formData.paymentDate,
        }),

        // Empty values become null
        relatedRepair:
          formData.relatedRepair || null,

        relatedInvoice:
          formData.relatedInvoice || null,

        reference: formData.reference.trim(),

        notes: formData.notes.trim(),
      };

      const savedPayment = payment
        ? await apiClient.patch(
            `/api/payments/${payment._id}`,
            paymentData
          )
        : await apiClient.post(
            "/api/payments",
            paymentData
          );

      if (onSuccess) {
        onSuccess(savedPayment);
      }
    } catch (error) {
      console.error(
        "Failed to save payment:",
        error
      );

      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900">
        {payment ? "Edit Payment" : "New Payment"}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {payment
          ? "Update payment information."
          : "Record a customer payment."}
      </p>

      {/* Customer */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer
        </label>

        <select
          value={formData.customer}
          onChange={(e) =>
            setFormData({
              ...formData,
              customer: e.target.value,
            })
          }
          disabled={loadingCustomers}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {loadingCustomers
              ? "Loading customers..."
              : "Select customer"}
          </option>

          {customers.map((customer) => (
            <option
              key={customer._id}
              value={customer._id}
            >
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>

        <input
          type="number"
          min="1"
          value={formData.amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: e.target.value,
            })
          }
          placeholder="Enter payment amount"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payment Method */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>

        <select
  value={formData.paymentMethod}
  onChange={(e) =>
    setFormData({
      ...formData,
      paymentMethod: e.target.value,
    })
  }
  required
  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select payment method</option>

  {settings?.paymentMethods?.enabled?.map((method) => (
    <option key={method} value={method}>
      {method}
    </option>
  ))}
</select>
      </div>

      {/* Payment Date */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Date
        </label>

        <input
          type="date"
          value={formData.paymentDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentDate: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Related Repair */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Repair
        </label>

        <select
          value={formData.relatedRepair}
          onChange={(e) =>
            setFormData({
              ...formData,
              relatedRepair: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            No related repair
          </option>

          {repairs.map((repair) => (
            <option
              key={repair._id}
              value={repair._id}
            >
              {repair.repairNo} -{" "}
              {repair.customer?.name ||
                "Unknown Customer"}
            </option>
          ))}
        </select>
      </div>

      {/* Related Invoice */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Invoice
        </label>

        <select
          value={formData.relatedInvoice}
          onChange={(e) =>
            setFormData({
              ...formData,
              relatedInvoice: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            No related invoice
          </option>

          {invoices.map((invoice) => (
            <option
              key={invoice._id}
              value={invoice._id}
            >
              {invoice.invoiceNo} - Rs.{" "}
              {invoice.total}
            </option>
          ))}
        </select>
      </div>

      {/* Reference */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference
        </label>

        <input
          type="text"
          value={formData.reference}
          onChange={(e) =>
            setFormData({
              ...formData,
              reference: e.target.value,
            })
          }
          placeholder="Transaction ID, receipt number, etc."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>

        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData({
              ...formData,
              notes: e.target.value,
            })
          }
          rows="4"
          placeholder="Add any notes about this payment..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : payment
              ? "Update Payment"
              : "Save Payment"}
        </button>
      </div>

    </form>
  );
}