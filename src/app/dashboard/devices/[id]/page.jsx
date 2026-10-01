"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Smartphone,
  ArrowLeft,
  Pencil,
  Trash2,
  Tag,
  Cpu,
  CheckCircle2,
} from "lucide-react";

import { deviceApi } from "@/lib/api/devices";
import DeviceForm from "@/components/devices/DeviceForm";

// ── Helper: category colour ───────────────────────────────────────
const CATEGORY_COLORS = {
  smartphone: "bg-blue-50 text-blue-700 ring-blue-200/60",
  tablet: "bg-violet-50 text-violet-700 ring-violet-200/60",
  laptop: "bg-amber-50 text-amber-700 ring-amber-200/60",
  desktop: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
};
function catBadge(cat = "") {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? "bg-gray-100 text-gray-600 ring-gray-200/60";
}

// ── Detail row ────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function DeviceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceId = params.id;

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Start in edit mode if ?edit=true came from the list page
  const [editing, setEditing] = useState(searchParams.get("edit") === "true");
  const [updatingDevice, setUpdatingDevice] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Load ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!deviceId) return;
    async function load() {
      try {
        const data = await deviceApi.getById(deviceId);
        setDevice(data);
      } catch (err) {
        console.error("LOAD DEVICE ERROR:", err);
        setError(err.message || "Failed to load device");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deviceId]);

  // ── Update ───────────────────────────────────────────────────
  async function handleDeviceUpdate(data) {
    try {
      setUpdatingDevice(true);
      const updated = await deviceApi.update(device._id, data);
      setDevice(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("UPDATE DEVICE ERROR:", err);
      alert(err.message || "Failed to update device");
    } finally {
      setUpdatingDevice(false);
    }
  }

  // ── Delete ───────────────────────────────────────────────────
  async function handleDeleteDevice() {
    try {
      setDeleting(true);
      await deviceApi.delete(device._id);
      router.push("/dashboard/devices");
    } catch (err) {
      console.error("DELETE DEVICE ERROR:", err);
      alert(err.message || "Failed to delete device");
      setDeleting(false);
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-100" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-16 bg-gray-100 rounded" />
                <div className="h-3.5 w-28 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-semibold text-sm">Could not load device</p>
            <p className="text-xs mt-0.5 text-red-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Not found ─────────────────────────────────────────────────
  if (!device) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center space-y-3">
          <Cpu className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-medium text-gray-600">Device not found</p>
          <button
            onClick={() => router.push("/dashboard/devices")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Back to Devices
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Back */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/devices")}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Back to Devices"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Icon + title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                {device.brand} {device.model}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ${catBadge(device.category)}`}>
                  {device.category}
                </span>
                {saved && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons — hidden while in edit mode */}
        {!editing && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-gray-900">Delete this device?</h3>
              <p className="text-sm text-gray-500">
                <strong className="text-gray-700">{device.brand} {device.model}</strong> will be permanently removed. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDevice}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Mode ───────────────────────────────────────────── */}
      {editing ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
              Edit Device
            </h2>
          </div>
          <div className="p-6">
            <DeviceForm
              initialData={device}
              onSubmit={handleDeviceUpdate}
              submitting={updatingDevice}
              onCancel={() => setEditing(false)}
            />
          </div>
        </div>
      ) : (

        /* ── View Mode ──────────────────────────────────────────── */
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 tracking-tight uppercase tracking-wide">
              Device Information
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">
              ID: {device._id?.slice(-8)}
            </span>
          </div>

          <div className="px-6 divide-y-0">
            <DetailRow icon={Smartphone} label="Brand" value={device.brand} />
            <DetailRow icon={Cpu} label="Model" value={device.model} />
            <DetailRow icon={Tag} label="Category" value={device.category} />
          </div>
        </div>
      )}
    </main>
  );
}
