"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function PaymentMethodsSettingsPage() {
  const [methods, setMethods] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await settingsApi.get();

      setMethods(
        (settings.paymentMethods?.enabled || []).join("\n")
      );
    } catch (error) {
      console.error(
        "Failed to load payment method settings:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setMethods(e.target.value);
  }

  function convertToArray(value) {
    return value
      .split("\n")
      .map((method) => method.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const enabledMethods = convertToArray(methods);

      if (enabledMethods.length === 0) {
        setMessage("At least one payment method is required.");
        return;
      }

      await settingsApi.update({
        paymentMethods: {
          enabled: enabledMethods,
        },
      });

      setMessage(
        "Payment methods saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save payment methods:",
        error
      );

      setMessage("Failed to save payment methods.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Methods
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the payment methods available throughout the system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Enabled Payment Methods
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add one payment method per line.
          </p>

          <textarea
            value={methods}
            onChange={handleChange}
            rows={8}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={
              "Cash\nCard\nBank Transfer\nOther"
            }
          />

          <p className="mt-2 text-xs text-gray-500">
            These methods will be available when recording payments
            and other transactions.
          </p>
        </section>

        <div className="flex items-center justify-end gap-4">
          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}