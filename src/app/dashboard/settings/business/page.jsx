"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function SettingsPage() {
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
        setError(error.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleBusinessChange(e) {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        [name]: value,
      },
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await settingsApi.update({
        business: settings.business,
      });

      setSettings(updated);
      setSuccess("Business profile saved successfully.");
    } catch (error) {
      console.error("UPDATE SETTINGS ERROR", error);
      setError(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 text-sm text-red-600">
        Unable to load settings.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your repair shop configuration.
        </p>
      </div>

      {/* Business Profile */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Business Profile
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Basic information about your repair shop.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shop Name
            </label>

            <input
              type="text"
              name="shopName"
              value={settings.business?.shopName || ""}
              onChange={handleBusinessChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Enter shop name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={settings.business?.phone || ""}
              onChange={handleBusinessChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={settings.business?.email || ""}
              onChange={handleBusinessChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={settings.business?.address || ""}
              onChange={handleBusinessChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Enter shop address"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Save */}
        <div className="mt-6 flex justify-end">
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
    </div>
  );
}