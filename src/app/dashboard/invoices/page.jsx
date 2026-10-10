"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { invoiceApi } from "@/lib/api/invoices";

export default function InvoicesPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  async function loadInvoices() {
    try {
      setLoading(true);
      setError("");

      const data = await invoiceApi.getAll();

      setInvoices(data);
    } catch (error) {
      console.error("LOAD INVOICES ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await invoiceApi.delete(id);

      setInvoices((prev) =>
        prev.filter((invoice) => invoice._id !== id)
      );
    } catch (error) {
      console.error("DELETE INVOICE ERROR:", error);
      setError(error.message);
    }
  }

  function handleView(id) {
    router.push(`/dashboard/invoices/${id}`);
  }

  function handleEdit(id) {
    router.push(`/dashboard/invoices/${id}/edit`);
  }

  function handleNewInvoice() {
    router.push("/dashboard/invoices/new");
  }

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const customerName =
        invoice.customer?.name?.toLowerCase() || "";

      const invoiceNo =
        invoice.invoiceNo?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        invoiceNo.includes(search) ||
        customerName.includes(search);

      let matchesDate = true;

      if (dateFilter !== "all" && invoice.invoiceDate) {
        const invoiceDate = new Date(invoice.invoiceDate);
        const now = new Date();

        if (dateFilter === "today") {
          matchesDate =
            invoiceDate.toDateString() === now.toDateString();
        }

        if (dateFilter === "thisMonth") {
          matchesDate =
            invoiceDate.getMonth() === now.getMonth() &&
            invoiceDate.getFullYear() === now.getFullYear();
        }

        if (dateFilter === "thisYear") {
          matchesDate =
            invoiceDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [invoices, searchTerm, dateFilter]);

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
        <p className="text-gray-500">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer invoices and billing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewInvoice}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + New Invoice
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredInvoices.length} of {invoices.length} invoices
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-medium text-gray-900">
            No invoices found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">

              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Invoice
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Invoice Date
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >

                    {/* Invoice number */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleView(invoice._id)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {invoice.invoiceNo}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {invoice.customer?.name || "Unknown"}
                    </td>

                    {/* Invoice date */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(invoice.invoiceDate)}
                    </td>

                    {/* Due date */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(invoice.dueDate)}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      {formatCurrency(invoice.total)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-left">
                      <div className="flex items-center justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(invoice._id)}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(invoice._id)}
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(invoice._id)}
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
        </div>
      )}

    </div>
  );
}