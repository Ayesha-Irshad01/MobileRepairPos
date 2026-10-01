"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { paymentApi } from "@/lib/api/payments";
import { Button } from "@/components/ui/Button";

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayment();
  }, []);

  async function loadPayment() {
    try {
      setLoading(true);
      setError("");

      const data = await paymentApi.getById(params.id);

      setPayment(data);
    } catch (error) {
      console.error("Failed to load payment:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading payment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push("/dashboard/payments")}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Payments
        </button>

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-10 text-center text-gray-500">
        Payment not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/dashboard/payments")}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-3"
          >
            ← Back to Payments
          </button>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Payment Details
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View payment information and related records.
          </p>
        </div>

        <Button
          onClick={() => window.print()}
          variant="outline"
          size="md"
        >
          Print
        </Button>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">Payment Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">
                {payment.customer?.name || payment.customerName || "Deleted Customer"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</p>
              <p className="mt-1.5 text-xl font-bold text-gray-900">
                Rs. {Number(payment.amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Method</p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">{payment.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Date</p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">
                {new Date(payment.paymentDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Reference</p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">{payment.reference || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Related Repair</p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">{payment.relatedRepair?.repairNo || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Related Invoice</p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">{payment.relatedInvoice?.invoiceNo || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">Notes</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700">{payment.notes || "No notes added."}</p>
        </div>
      </div>

      {/* Record Information */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">Record Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Created</p>
              <p className="mt-1.5 text-sm text-gray-900">
                {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Last Updated</p>
              <p className="mt-1.5 text-sm text-gray-900">
                {payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
