"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { invoiceApi } from "@/lib/api/invoices";

export default function NewInvoicePage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    try {
      setSubmitting(true);
      setError("");

      const invoice = await invoiceApi.create(formData);

      console.log("NEW INVOICE:", invoice);

      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("CREATE INVOICE ERROR:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/dashboard/invoices");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          New Invoice
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new customer invoice.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <InvoiceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </div>
  );
}