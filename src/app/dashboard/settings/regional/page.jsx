"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function RegionalSettingsPage() {
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

  function handleRegionalChange(e) {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      regional: {
        ...prev.regional,
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
        regional: settings.regional,
      });

      setSettings(updated);
      setSuccess("Regional settings saved successfully.");
    } catch (error) {
      console.error("UPDATE REGIONAL SETTINGS ERROR", error);
      setError(error.message || "Failed to save regional settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading regional settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 text-sm text-red-600">
        Unable to load regional settings.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Regional Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure currency, date, time, language, and regional preferences.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Regional Preferences
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            These settings control how information is displayed throughout the system.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Currency Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Currency Code
            </label>

            <input
              type="text"
              name="currencyCode"
              value={settings.regional?.currencyCode || ""}
              onChange={handleRegionalChange}
              placeholder="PKR"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Currency Symbol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Currency Symbol
            </label>

            <input
              type="text"
              name="currencySymbol"
              value={settings.regional?.currencySymbol || ""}
              onChange={handleRegionalChange}
              placeholder="Rs"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Number Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number Format
            </label>

            <select
              name="numberFormat"
              value={settings.regional?.numberFormat || "1,234.56"}
              onChange={handleRegionalChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="1,234.56">1,234.56</option>
              <option value="1.234,56">1.234,56</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Format
            </label>

            <select
              name="dateFormat"
              value={settings.regional?.dateFormat || "DD/MM/YYYY"}
              onChange={handleRegionalChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Time Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Format
            </label>

            <select
              name="timeFormat"
              value={settings.regional?.timeFormat || "24h"}
              onChange={handleRegionalChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="24h">24-hour</option>
              <option value="12h">12-hour</option>
            </select>
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Zone
            </label>

            <input
              type="text"
              name="timeZone"
              value={settings.regional?.timeZone || ""}
              onChange={handleRegionalChange}
              placeholder="Asia/Karachi"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Primary Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Language
            </label>

            <select
              name="primaryLanguage"
              value={settings.regional?.primaryLanguage || "English"}
              onChange={handleRegionalChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          {/* Secondary Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secondary Language
            </label>

            <select
              name="secondaryLanguage"
              value={settings.regional?.secondaryLanguage || ""}
              onChange={handleRegionalChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">None</option>
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>
        </div>

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