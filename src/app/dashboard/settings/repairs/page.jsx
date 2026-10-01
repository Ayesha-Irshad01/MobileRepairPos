"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

const repairStatuses = [
  "Received",
  "Diagnosing",
  "Awaiting Approval",
  "Approved",
  "Waiting for Parts",
  "Repairing",
  "Testing",
  "Ready for Collection",
  "Delivered",
  "Cancelled",
  "Unable to Repair",
];

export default function RepairsSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const data = await settingsApi.get();
        setSettings(data);
      } catch (error) {
        console.error("GET SETTINGS ERROR", error);
        setError(error.message || "Failed to load repair settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      repairs: {
        ...prev.repairs,
        [name]:
          name === "startingNumber" || name === "defaultWarrantyDays"
            ? Number(value)
            : value,
      },
    }));
  }

  function handleListChange(name, value) {
    setSettings((prev) => ({
      ...prev,
      repairs: {
        ...prev.repairs,
        [name]: value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await settingsApi.update({
        repairs: settings.repairs,
      });

      setSettings(updated);
      setSuccess("Repair settings saved successfully.");
    } catch (error) {
      console.error("UPDATE REPAIR SETTINGS ERROR", error);
      setError(error.message || "Failed to save repair settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading repair settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 text-sm text-red-600">
        Unable to load repair settings.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Repair Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure repair ticket defaults and commonly used repair options.
        </p>
      </div>

      {/* Repair Defaults */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Repair Defaults
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure default values for new repair tickets.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Prefix */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Repair Job Prefix
            </label>

            <input
              type="text"
              name="jobPrefix"
              value={settings.repairs?.jobPrefix || ""}
              onChange={handleChange}
              placeholder="REP-"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Starting Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Starting Number
            </label>

            <input
              type="number"
              name="startingNumber"
              min="1"
              value={settings.repairs?.startingNumber ?? 1}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Default Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Status
            </label>

            <select
              name="defaultStatus"
              value={settings.repairs?.defaultStatus || "Received"}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {repairStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Technician */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Technician
            </label>

            <input
              type="text"
              name="defaultTechnician"
              value={settings.repairs?.defaultTechnician || ""}
              onChange={handleChange}
              placeholder="Technician name or ID"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Warranty */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Warranty Days
            </label>

            <input
              type="number"
              name="defaultWarrantyDays"
              min="0"
              value={settings.repairs?.defaultWarrantyDays ?? 0}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Repair Options
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter one option per line. These values can be used throughout the repair workflow.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Priorities */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priorities
            </label>

            <textarea
              value={(settings.repairs?.priorities || []).join("\n")}
              onChange={(e) =>
                handleListChange("priorities", e.target.value)
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              One priority per line.
            </p>
          </div>

          {/* Device Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Device Categories
            </label>

            <textarea
              value={(settings.repairs?.deviceCategories || []).join("\n")}
              onChange={(e) =>
                handleListChange("deviceCategories", e.target.value)
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              One category per line.
            </p>
          </div>

          {/* Common Faults */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Common Faults
            </label>

            <textarea
              value={(settings.repairs?.commonFaults || []).join("\n")}
              onChange={(e) =>
                handleListChange("commonFaults", e.target.value)
              }
              rows={5}
              placeholder={"Broken Screen\nBattery Issue\nCharging Problem"}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              One fault per line.
            </p>
          </div>

          {/* Device Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Device Conditions
            </label>

            <textarea
              value={(settings.repairs?.deviceConditions || []).join("\n")}
              onChange={(e) =>
                handleListChange("deviceConditions", e.target.value)
              }
              rows={5}
              placeholder={"Good\nScratched\nCracked\nDamaged"}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              One condition per line.
            </p>
          </div>

          {/* Accessories */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Accessories Received
            </label>

            <textarea
              value={(settings.repairs?.accessoriesReceived || []).join("\n")}
              onChange={(e) =>
                handleListChange("accessoriesReceived", e.target.value)
              }
              rows={5}
              placeholder={"Charger\nUSB Cable\nSIM Tray"}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              One accessory per line.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}