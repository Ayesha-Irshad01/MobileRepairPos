
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { invoiceApi } from "@/lib/api/invoices";
import { Button } from "@/components/ui/Button";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoice() {
      try {
        setLoading(true);
        setError("");

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

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  function formatCurrency(amount) {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard/invoices")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Invoices
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Invoice not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 print:p-0 print:space-y-4">
      {/* Page actions: hidden when printing */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <button
          type="button"
          onClick={() => router.push("/dashboard/invoices")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Invoices
        </button>

        <div className="flex gap-2">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="md"
          >
            Print
          </Button>

          <Button
            type="button"
            onClick={() =>
              router.push(`/dashboard/invoices/${invoice._id}/edit`)
            }
            variant="primary"
            size="md"
          >
            Edit Invoice
          </Button>
        </div>
      </div>

      {/* Printable bill starts */}
      <div id="invoice-print-area" className="space-y-6 print:space-y-4">
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {invoice.invoiceNo}
          </p>
        </header>

        {/* Invoice information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 print:border-0 print:p-0">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Invoice Number
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {invoice.invoiceNo}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Customer
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {invoice.customer?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Invoice Date
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(invoice.invoiceDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Due Date
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          {invoice.relatedRepair && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Related Repair
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {invoice.relatedRepair.repairNo ||
                  invoice.relatedRepair._id}
              </p>
            </div>
          )}
        </section>

        {/* Invoice items */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white print:overflow-visible print:rounded-none">
          <h2 className="border-b border-gray-200 px-6 py-4 text-lg font-semibold text-gray-900 print:px-0">
            Invoice Items
          </h2>

          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Description
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Qty
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Unit Price
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  VAT
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {invoice.items?.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="break-words px-3 py-3 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-gray-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-gray-600">
                    {item.vatRate}%
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}

              {(!invoice.items || invoice.items.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-gray-500"
                  >
                    No invoice items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Totals */}
        <section className="flex justify-end">
          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 sm:max-w-md print:max-w-sm print:border-0 print:p-0">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Invoice Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">VAT</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.vat)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.discount)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Optional notes */}
        {invoice.notes && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 print:border-0 print:px-0">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Notes
            </h2>
            <p className="whitespace-pre-wrap text-sm text-gray-600">
              {invoice.notes}
            </p>
          </section>
        )}
      </div>
      {/* Printable bill ends */}
    </div>
  );
}