"use client";

import { useEffect, useState } from "react";
import { staffApi } from "@/lib/api/staff";

export default function StaffSettingsPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadStaff() {
    try {
      setLoading(true);
      setError("");

      const data = await staffApi.getAll();
      setStaff(data);
    } catch (error) {
      console.error("LOAD STAFF ERROR", error);
      setError(error.message || "Failed to load staff.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  function openAddForm() {
    setEditingStaff(null);

    setForm({
      name: "",
      role: "",
      isActive: true,
    });

    setError("");
    setShowForm(true);
  }

  function openEditForm(member) {
    setEditingStaff(member);

    setForm({
      name: member.name || "",
      role: member.role || "",
      isActive: member.isActive ?? true,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingStaff(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Staff name is required.");
      return;
    }

    if (!form.role.trim()) {
      setError("Staff role is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingStaff) {
        await staffApi.update(editingStaff._id, form);
      } else {
        await staffApi.create(form);
      }

      await loadStaff();
      closeForm();
    } catch (error) {
      console.error("SAVE STAFF ERROR", error);
      setError(error.message || "Failed to save staff member.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(member) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await staffApi.delete(member._id);
      await loadStaff();
    } catch (error) {
      console.error("DELETE STAFF ERROR", error);
      setError(error.message || "Failed to delete staff member.");
    }
  }

  async function handleToggleStatus(member) {
    try {
      setError("");

      await staffApi.update(member._id, {
        isActive: !member.isActive,
      });

      await loadStaff();
    } catch (error) {
      console.error("UPDATE STAFF STATUS ERROR", error);
      setError(error.message || "Failed to update staff status.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Staff
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage technicians and staff members.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Staff
        </button>
      </div>

      {/* Error */}
      {error && !showForm && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Staff Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Loading staff...
          </div>
        ) : staff.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              No staff members found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first staff member to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {staff.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {member.name}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {member.role}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(member)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          member.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(member)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(member)}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
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

      {/* Add / Edit Form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingStaff ? "Edit Staff" : "Add Staff"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingStaff
                  ? "Update this staff member's information."
                  : "Add a new staff member."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ali Raza"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Role
              </label>

              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Technician"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />

              <span className="text-sm text-gray-700">
                Staff member is active
              </span>
            </label>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingStaff
                    ? "Update Staff"
                    : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}