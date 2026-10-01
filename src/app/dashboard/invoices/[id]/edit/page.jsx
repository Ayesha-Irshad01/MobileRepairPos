"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { invoiceApi } from "@/lib/api/invoices";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoice() {
      try {
        const data = await invoiceApi.getById(params.id);
        setInvoice(data);
      } catch (error) {
        console.error("LOAD INVOICE ERROR:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadInvoice();
    }
  }, [params.id]);

  async function handleSubmit(formData) {
    try {
      setSubmitting(true);
      setError("");

      await invoiceApi.update(params.id, formData);

      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("UPDATE INVOICE ERROR:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/dashboard/invoices");
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Invoice
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update invoice details and items.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <InvoiceForm
        initialData={invoice}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </div>
  );
}