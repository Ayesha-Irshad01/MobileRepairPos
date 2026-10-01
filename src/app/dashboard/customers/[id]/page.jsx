"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { customerApi } from "@/lib/api/customers";
import CustomerForm from "@/components/customers/CustomerForm";

function CustomerDetailsPageInner() {
  const params = useParams();
  const customerId = params.id;
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const [editing, setEditing] = useState(editMode);
  const [updatingCustomer, setUpdatingCustomer] = useState(false);

  // Load customer
  useEffect(() => {
    async function loadCustomer() {
      try {
        const data = await customerApi.getById(customerId);

        setCustomer(data);
      } catch (error) {
        console.error("LOAD CUSTOMER ERROR:", error);
        setError(error.message || "Failed to load customer");
      } finally {
        setLoading(false);
      }
    }

    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);
  useEffect(() => {
  setEditing(editMode);
}, [editMode]);

  // Update customer
  async function handleCustomerUpdate(data) {
    try {
      setUpdatingCustomer(true);

      const updatedCustomer = await customerApi.update(
        customer._id,
        data
      );

      setCustomer(updatedCustomer);
      setEditing(false);
    } catch (error) {
      console.error("UPDATE CUSTOMER ERROR:", error);
      alert(error.message || "Failed to update customer");
    } finally {
      setUpdatingCustomer(false);
    }
  }
  async function handleDeleteCustomer() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await customerApi.delete(customer._id);

    alert("Customer deleted successfully.");

    window.location.href = "/dashboard/customers";
  } catch (error) {
    console.error("DELETE CUSTOMER ERROR:", error);
    alert(error.message || "Failed to delete customer");
  }
}

  // Loading state
  if (loading) {
    return (
      <main className="p-6">
        <p>Loading customer...</p>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  // Customer not found
  if (!customer) {
    return (
      <main className="p-6">
        <p>Customer not found.</p>
      </main>
    );
  }
  

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/dashboard/customers")}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-3"
        >
          ← Back to Customers
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Customer Details
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View and manage customer information.
            </p>
          </div>

          {!editing && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit Customer
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {editing ? (
        <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Edit Customer</h2>
          </div>
          <div className="p-6">
            <CustomerForm
              initialData={customer}
              onSubmit={handleCustomerUpdate}
              submitting={updatingCustomer}
              onCancel={() => setEditing(false)}
            />
          </div>
        </section>
      ) : (
        /* View Mode */
        <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Customer Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Name</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{customer.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{customer.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Address</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">{customer.address || "—"}</p>
              </div>
              <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900 whitespace-pre-wrap">
                  {customer.notes || "—"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default function CustomerDetailsPage() {
  return (
    <Suspense fallback={<main className="p-6"><p className="text-sm text-gray-500">Loading customer...</p></main>}>
      <CustomerDetailsPageInner />
    </Suspense>
  );
}
