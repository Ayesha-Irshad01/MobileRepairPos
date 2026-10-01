"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function TaxSettingsPage() {
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
        setError(error.message || "Failed to load tax settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleTaxChange(e) {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      tax: {
        ...prev.tax,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await settingsApi.update({
        tax: {
          ...settings.tax,
          defaultVatRate: Number(settings.tax.defaultVatRate),
        },
      });

      setSettings(updated);
      setSuccess("Tax settings saved successfully.");
    } catch (error) {
      console.error("UPDATE TAX SETTINGS ERROR", error);
      setError(error.message || "Failed to save tax settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading tax settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 text-sm text-red-600">
        Unable to load tax settings.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Tax Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure VAT and how tax is handled throughout the system.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            VAT Configuration
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configure your default VAT behavior.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* VAT Enabled */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="vatEnabled"
              checked={settings.tax?.vatEnabled || false}
              onChange={handleTaxChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <div>
              <p className="text-sm font-medium text-gray-700">
                VAT Enabled
              </p>

              <p className="text-xs text-gray-500">
                Enable VAT calculations throughout the system.
              </p>
            </div>
          </label>

          {/* Default VAT Rate */}
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700">
              Default VAT Rate (%)
            </label>

            <input
              type="number"
              name="defaultVatRate"
              min="0"
              step="0.01"
              value={settings.tax?.defaultVatRate ?? 0}
              onChange={handleTaxChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Prices Include VAT */}
          <div>
            <p className="text-sm font-medium text-gray-700">
              Product Prices
            </p>

            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="pricesIncludeVat"
                  value="false"
                  checked={settings.tax?.pricesIncludeVat === false}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      tax: {
                        ...prev.tax,
                        pricesIncludeVat: false,
                      },
                    }))
                  }
                />

                <div>
                  <p className="text-sm text-gray-700">
                    VAT-exclusive
                  </p>

                  <p className="text-xs text-gray-500">
                    VAT is added to the displayed price.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="pricesIncludeVat"
                  value="true"
                  checked={settings.tax?.pricesIncludeVat === true}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      tax: {
                        ...prev.tax,
                        pricesIncludeVat: true,
                      },
                    }))
                  }
                />

                <div>
                  <p className="text-sm text-gray-700">
                    VAT-inclusive
                  </p>

                  <p className="text-xs text-gray-500">
                    VAT is already included in the displayed price.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Show VAT on Invoices */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="showVatOnInvoices"
              checked={settings.tax?.showVatOnInvoices ?? true}
              onChange={handleTaxChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <div>
              <p className="text-sm font-medium text-gray-700">
                Show VAT on Invoices
              </p>

              <p className="text-xs text-gray-500">
                Display VAT information on generated invoices.
              </p>
            </div>
          </label>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
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