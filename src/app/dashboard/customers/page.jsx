"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { customerApi } from "@/lib/api/customers";
import CustomerForm from "@/components/customers/CustomerForm";
import { Button } from "@/components/ui/Button";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  

  const router = useRouter();

  // Load customers
  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await customerApi.getAll();

        setCustomers(data);
      } catch (error) {
        console.error("LOAD CUSTOMERS ERROR:", error);
        setError(error.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);
  // Delete customer
async function handleDeleteCustomer(customerId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await customerApi.delete(customerId);

    setCustomers((prev) =>
      prev.filter((customer) => customer._id !== customerId)
    );
  } catch (error) {
    console.error("DELETE CUSTOMER ERROR:", error);
    alert(error.message || "Failed to delete customer");
  }
}

  // Create customer
  async function handleCreateCustomer(data) {
    try {
      setCreatingCustomer(true);

      const newCustomer = await customerApi.create(data);

      setCustomers((prev) => [...prev, newCustomer]);

      setShowCustomerModal(false);
    } catch (error) {
      console.error("CREATE CUSTOMER ERROR:", error);
      alert(error.message || "Failed to create customer");
    } finally {
      setCreatingCustomer(false);
    }
  }

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search)
    );
  });

  // Loading state
  if (loading) {
    return (
      <main className="p-6">
        <p>Loading customers...</p>
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

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your customers and their repair history.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowCustomerModal(true)}
          variant="primary"
          size="md"
        >
          + New Customer
        </Button>
      </div>

      {/* Customer List */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Section Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">
            All Customers
          </h2>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
          />
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No customers found.
          </div>
        ) : (
          /* Customer Table */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table Header */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Address
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    onClick={() =>
                      router.push(
                        `/dashboard/customers/${customer._id}`
                      )
                    }
                    className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {customer.name}
                    </td>

                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {customer.phone}
                    </td>

                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {customer.email || "—"}
                    </td>

                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {customer.address || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-left"
                    onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-start gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/customers/${customer._id}`)
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/customers/${customer._id}?edit=true`)
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCustomer(customer._id)}
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
        )}
      </section>

      {/* Create Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl ring-1 ring-gray-200/50 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Create New Customer
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add a new customer to the system.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Customer Form */}
            <div className="p-6 overflow-y-auto bg-gray-50/30 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/[0.15]">
              <CustomerForm
                onSubmit={handleCreateCustomer}
                submitting={creatingCustomer}
                onCancel={() => setShowCustomerModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}