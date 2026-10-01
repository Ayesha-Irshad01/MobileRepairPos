"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { repairApi } from "@/lib/api/repairs";
import RepairForm from "@/components/repairs/RepairForm";

function RepairsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  // Pre-populate status filter from ?status= query param (e.g. coming from dashboard pipeline)
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || "All Statuses"
  );

  const [showForm, setShowForm] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --------------------------------------------------
  // LOAD REPAIRS
  // --------------------------------------------------

  async function loadRepairs() {
    try {
      setLoading(true);
      setError("");

      const data = await repairApi.getAll();

      console.log("REPAIRS FROM API:", data);

      setRepairs(data);
    } catch (error) {
      console.error("LOAD REPAIRS ERROR:", error);

      setError(error.message || "Failed to load repairs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepairs();
  }, []);

  // Keep the status filter in sync if the URL param changes
  // (e.g. user clicks a different status on the dashboard while already on this page)
  useEffect(() => {
    const param = searchParams.get("status");
    if (param) setStatusFilter(param);
  }, [searchParams]);

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredRepairs = repairs.filter((repair) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      repair.repairNo?.toLowerCase().includes(searchText) ||
      repair.customer?.name?.toLowerCase().includes(searchText) ||
      repair.device?.brand?.toLowerCase().includes(searchText) ||
      repair.device?.model?.toLowerCase().includes(searchText) ||
      repair.issue?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All Statuses" ||
      repair.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --------------------------------------------------
  // OPEN NEW REPAIR FORM
  // --------------------------------------------------

  function handleNewRepair() {
  router.push("/dashboard/repairs/new");
}
  // --------------------------------------------------
  // OPEN EDIT FORM
  // --------------------------------------------------

  function handleEdit(repair, e) {
    e.stopPropagation();
    setEditingRepair(repair);
    setShowForm(true);
    setError("");
  }

  // --------------------------------------------------
  // CANCEL FORM
  // --------------------------------------------------

  function handleCancelForm() {
    setShowForm(false);
    setEditingRepair(null);
    setError("");
  }

  // --------------------------------------------------
  // CREATE + UPDATE
  // --------------------------------------------------

  async function handleRepairSubmit(formData) {
    try {
      setSubmitting(true);
      setError("");

      // ----------------------------------------------
      // EDIT EXISTING REPAIR
      // ----------------------------------------------

      if (editingRepair) {
        const updatedRepair = await repairApi.update(
          editingRepair._id,
          formData
        );

        console.log("UPDATED REPAIR:", updatedRepair);

        setRepairs((prev) =>
          prev.map((repair) =>
            repair._id === updatedRepair._id
              ? updatedRepair
              : repair
          )
        );
      }

      // ----------------------------------------------
      // CREATE NEW REPAIR
      // ----------------------------------------------

      else {
        const newRepair = await repairApi.create(formData);

        console.log("NEW REPAIR:", newRepair);

        setRepairs((prev) => [newRepair, ...prev]);
      }

      // Close form after successful save
      setShowForm(false);
      setEditingRepair(null);
    } catch (error) {
      console.error("SAVE REPAIR ERROR:", error);

      setError(error.message || "Failed to save repair");
    } finally {
      setSubmitting(false);
    }
  }

  // --------------------------------------------------
  // DELETE REPAIR
  // --------------------------------------------------

  async function handleDelete(repair, e) {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete ${repair.repairNo}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await repairApi.delete(repair._id);

      setRepairs((prev) =>
        prev.filter((item) => item._id !== repair._id)
      );
    } catch (error) {
      console.error("DELETE REPAIR ERROR:", error);

      setError(error.message || "Failed to delete repair");
    }
  }

  // --------------------------------------------------
  // STATUS COLORS
  // --------------------------------------------------

  function getStatusClass(status) {
    const classes = {
      Received: "bg-gray-100 text-gray-700",

      Diagnosing: "bg-yellow-100 text-yellow-700",

      "Awaiting Approval":
        "bg-orange-100 text-orange-700",

      Approved: "bg-blue-100 text-blue-700",

      "Waiting for Parts":
        "bg-purple-100 text-purple-700",

      Repairing: "bg-indigo-100 text-indigo-700",

      Testing: "bg-cyan-100 text-cyan-700",

      "Ready for Collection":
        "bg-green-100 text-green-700",

      Delivered:
        "bg-emerald-100 text-emerald-700",

      Cancelled:
        "bg-red-100 text-red-700",

      "Unable to Repair":
        "bg-red-100 text-red-700",
    };

    return (
      classes[status] ||
      "bg-gray-100 text-gray-700"
    );
  }

  // ==================================================
  // FORM VIEW
  // ==================================================

  if (showForm) {
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto">

          {/* Form Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleCancelForm}
              className="text-sm text-gray-500 hover:text-gray-700 mb-3"
            >
              ← Back to Repairs
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">
              {editingRepair
                ? "Edit Repair"
                : "New Repair"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {editingRepair
                ? `Update repair ${editingRepair.repairNo}`
                : "Create a new repair ticket"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <RepairForm
              initialData={editingRepair || {}}
              onSubmit={handleRepairSubmit}
              onCancel={handleCancelForm}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    );
  }

  // ==================================================
  // REPAIRS LIST VIEW
  // ==================================================

  return (
    <main className="p-6 space-y-6">

      {/* ------------------------------------------------
          HEADER
      ------------------------------------------------ */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Repairs
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage repair tickets and track their progress.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewRepair}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + New Repair
        </button>
      </div>

      {/* ------------------------------------------------
          ERROR
      ------------------------------------------------ */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ------------------------------------------------
          SEARCH + FILTER
      ------------------------------------------------ */}

      <div className="flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Search repairs, customers, devices..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
        >
          <option>All Statuses</option>
          <option>Received</option>
          <option>Diagnosing</option>
          <option>Awaiting Approval</option>
          <option>Approved</option>
          <option>Waiting for Parts</option>
          <option>Repairing</option>
          <option>Testing</option>
          <option>Ready for Collection</option>
          <option>Delivered</option>
          <option>Cancelled</option>
          <option>Unable to Repair</option>
        </select>
      </div>

      {/* ------------------------------------------------
          REPAIRS TABLE
      ------------------------------------------------ */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading repairs...
          </div>
        ) : filteredRepairs.length === 0 ? (
          <div className="p-10 text-center">

            <p className="text-gray-600 font-medium">
              No repairs found
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {statusFilter !== "All Statuses"
                ? `There are no repairs with status "${statusFilter}".`
                : "Try changing your search or status filter."}
            </p>

            {statusFilter !== "All Statuses" && (
              <button
                type="button"
                onClick={() => setStatusFilter("All Statuses")}
                className="mt-4 inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
              >
                ← Clear filter
              </button>
            )}

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* TABLE HEADER */}

              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Repair
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Device
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody className="divide-y divide-gray-100">

                {filteredRepairs.map((repair) => (

                  <tr
                    key={repair._id}
                    onClick={() =>
                      router.push(
                        `/dashboard/repairs/${repair._id}`
                      )
                    }
                    className="cursor-pointer hover:bg-gray-50 transition"
                  >

                    {/* REPAIR */}

                    <td className="px-6 py-4">

                      <div className="font-medium text-gray-900">
                        {repair.repairNo}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {repair.issue ||
                          "No issue description"}
                      </div>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-4">

                      <div className="font-medium text-gray-800">
                        {repair.customer?.name ||
                          "Unknown"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {repair.customer?.phone || ""}
                      </div>

                    </td>

                    {/* DEVICE */}

                    <td className="px-6 py-4">

                      <div className="font-medium text-gray-800">
                        {repair.device
                          ? `${repair.device.brand} ${repair.device.model}`
                          : "Unknown"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {repair.device?.category || ""}
                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          repair.status
                        )}`}
                      >
                        {repair.status}
                      </span>

                    </td>

                    {/* PRIORITY */}

                    <td className="px-6 py-4">

                      <span className="text-gray-700">
                        {repair.priority || "Normal"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div
                        className="flex justify-end items-center gap-2"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >

                        {/* VIEW */}

                        <Link
                          href={`/dashboard/repairs/${repair._id}`}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleEdit(repair, e)
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleDelete(repair, e)
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 shadow-sm transition-colors"
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

      </div>
    </main>
  );
}

export default function RepairsPage() {
  return (
    <Suspense fallback={
      <main className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading repairs...
        </div>
      </main>
    }>
      <RepairsPageInner />
    </Suspense>
  );
}
