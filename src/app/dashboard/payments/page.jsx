"use client";

import { useEffect, useState } from "react";
import { paymentApi } from "@/lib/api/payments";
import { settingsApi } from "@/lib/api/settings";
import { formatDate } from "@/lib/formatters";
import PaymentForm from "@/components/payments/PaymentForm";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Payment currently being edited
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    loadPayments();
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

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const data = await paymentApi.getAll();
      setPayments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePaymentSuccess() {
    setShowForm(false);
    setEditingPayment(null);
    loadPayments();
  }

  async function handleDelete(paymentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    try {
      await paymentApi.delete(paymentId);

      setPayments((currentPayments) =>
        currentPayments.filter(
          (payment) => payment._id !== paymentId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track customer payments.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPayment(null);
            setShowForm(true);
          }}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + New Payment
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Method
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Invoice
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  onClick={() =>
                    (window.location.href =
                      `/dashboard/payments/${payment._id}`)
                  }
                  className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                >
                  {/* Customer */}
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {payment.customer?.name || payment.customerName || "Deleted Customer"}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-semibold text-gray-900 text-right whitespace-nowrap">
                    Rs. {Number(payment.amount).toLocaleString()}
                  </td>

                  {/* Method */}
                  <td className="px-4 py-3 text-gray-600">
                    {payment.paymentMethod}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(payment.paymentDate, settings)}
                  </td>

                  {/* Invoice */}
                  <td className="px-4 py-3 text-gray-600">
                    {payment.relatedInvoice?.invoiceNo || "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-left whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/dashboard/payments/${payment._id}`;
                        }}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPayment(payment);
                          setShowForm(true);
                        }}
                        className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(payment._id);
                        }}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 shadow-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Payment Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl ring-1 ring-gray-200/50 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                {editingPayment ? "Edit Payment" : "New Payment"}
              </h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingPayment(null); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-gray-50/30 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/[0.15]">
              <PaymentForm
                payment={editingPayment}
                onSuccess={handlePaymentSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}