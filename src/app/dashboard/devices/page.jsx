"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Plus, Search, Cpu } from "lucide-react";

import { deviceApi } from "@/lib/api/devices";
import DeviceForm from "@/components/devices/DeviceForm";

export default function DevicesPage() {
  const router = useRouter();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creatingDevice, setCreatingDevice] = useState(false);

  // ── Load devices ──────────────────────────────────────────────
  useEffect(() => {
    async function loadDevices() {
      try {
        const data = await deviceApi.getAll();
        setDevices(data);
      } catch (error) {
        console.error("LOAD DEVICES ERROR:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDevices();
  }, []);

  // ── Create device ─────────────────────────────────────────────
  async function handleCreateDevice(data) {
    try {
      setCreatingDevice(true);
      const newDevice = await deviceApi.create(data);
      setDevices((prev) => [newDevice, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error("CREATE DEVICE ERROR:", error);
      alert(error.message || "Failed to create device");
    } finally {
      setCreatingDevice(false);
    }
  }

  // ── Delete device ─────────────────────────────────────────────
  async function handleDeleteDevice(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this device?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deviceApi.delete(id);
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("DELETE DEVICE ERROR:", error);
      alert(error.message || "Failed to delete device");
    }
  }

  // ── Filter ────────────────────────────────────────────────────
  const filteredDevices = devices.filter((device) => {
    const s = searchTerm.toLowerCase();
    return (
      device.brand.toLowerCase().includes(s) ||
      device.model.toLowerCase().includes(s) ||
      device.category.toLowerCase().includes(s)
    );
  });

  // Category badge colour map
  const categoryColor = {
    smartphone: "bg-blue-50 text-blue-700 ring-blue-200/60",
    tablet: "bg-violet-50 text-violet-700 ring-violet-200/60",
    laptop: "bg-amber-50 text-amber-700 ring-amber-200/60",
    desktop: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  };
  function catBadge(cat = "") {
    const key = cat.toLowerCase();
    return (
      categoryColor[key] ||
      "bg-gray-100 text-gray-600 ring-gray-200/60"
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-[1400px] mx-auto">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Devices
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Loading…" : `${devices.length} device${devices.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          New Device
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search brand, model or category…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm placeholder-gray-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
        />
      </div>

      {/* ── New Device Modal ─────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                  Add New Device
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-gray-50/40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/[0.15]">
              <DeviceForm
                onSubmit={handleCreateDevice}
                submitting={creatingDevice}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────── */}
      {loading ? (
        /* Skeleton */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 bg-gray-100 rounded" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                <div className="h-8 w-24 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Table header */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {filteredDevices.length} device{filteredDevices.length !== 1 ? "s" : ""}
              {searchTerm && " found"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">No devices found</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {searchTerm ? "Try a different search term" : "Add your first device to get started"}
                          </p>
                        </div>
                        {!searchTerm && (
                          <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Device
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => (
                    <tr
                      key={device._id}
                      className="hover:bg-slate-50/70 transition-colors duration-100"
                    >
                      {/* Brand + icon */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {device.brand}
                          </span>
                        </div>
                      </td>

                      {/* Model */}
                      <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                        {device.model}
                      </td>

                      {/* Category badge */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${catBadge(device.category)}`}
                        >
                          {device.category}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-6 py-3.5 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-2">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => router.push(`/dashboard/devices/${device._id}`)}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            View
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => router.push(`/dashboard/devices/${device._id}?edit=true`)}
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteDevice(device._id)}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
        </section>
      )}
    </main>
  );
}
