"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function DataPrivacySettingsPage() {
  const [form, setForm] = useState({
    customerConsentText: "",
    privacyNotice: "",
    photoRetentionDays: 365,
    allowOverpayments: false,
    activityLogEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const settings = await settingsApi.get();

        setForm({
          customerConsentText:
            settings.dataPrivacy?.customerConsentText || "",
          privacyNotice:
            settings.dataPrivacy?.privacyNotice || "",
          photoRetentionDays:
            settings.dataPrivacy?.photoRetentionDays ?? 365,
          allowOverpayments:
            settings.dataPrivacy?.allowOverpayments ?? false,
          activityLogEnabled:
            settings.dataPrivacy?.activityLogEnabled ?? true,
        });
      } catch (error) {
        console.error("LOAD DATA PRIVACY SETTINGS ERROR", error);
        setError(
          error.message ||
            "Failed to load data and privacy settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "photoRetentionDays"
          ? Number(value)
          : value,
    }));
  }

  function handleToggle(name) {
    setForm((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  }

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await settingsApi.update({
        dataPrivacy: form,
      });

      setMessage(
        "Data and privacy settings saved successfully."
      );
    } catch (error) {
      console.error(
        "SAVE DATA PRIVACY SETTINGS ERROR",
        error
      );

      setError(
        error.message ||
          "Failed to save data and privacy settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Loading data and privacy settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Data & Privacy
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer privacy, data retention and system
          data preferences.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Privacy */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Privacy
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure the privacy information shown to
              customers.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Customer Consent Text
              </label>

              <textarea
                name="customerConsentText"
                value={form.customerConsentText}
                onChange={handleChange}
                rows={4}
                placeholder="Example: I consent to the collection and processing of my information for repair services."
                className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1.5 text-xs text-gray-500">
                Text that can be shown when collecting customer
                information.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Privacy Notice
              </label>

              <textarea
                name="privacyNotice"
                value={form.privacyNotice}
                onChange={handleChange}
                rows={5}
                placeholder="Enter your business privacy notice..."
                className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Photo Retention
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="photoRetentionDays"
                  min="0"
                  value={form.photoRetentionDays}
                  onChange={handleChange}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="text-sm text-gray-500">
                  days
                </span>
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Use 0 if photos should not have an automatic
                retention period.
              </p>
            </div>
          </div>
        </section>

        {/* Data behavior */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Data & System Behavior
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure how the system handles certain data
              operations.
            </p>
          </div>

          <div className="space-y-5">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Allow overpayments
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Allow payments that are greater than the
                  remaining invoice balance.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleToggle("allowOverpayments")
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  form.allowOverpayments
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
                aria-label="Toggle overpayments"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    form.allowOverpayments
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Activity log
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Enable recording of important system actions.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleToggle("activityLogEnabled")
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  form.activityLogEnabled
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
                aria-label="Toggle activity log"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    form.activityLogEnabled
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </section>

        {/* Data management */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Backup and restore functionality can be added
              here.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-700">
              Backup & Restore
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Export and import functionality will be connected
              during the final data-management integration.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400"
              >
                Export Backup
              </button>

              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400"
              >
                Import Backup
              </button>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-red-700">
              Danger Zone
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Destructive data operations should only be
              implemented with proper confirmation and
              authorization.
            </p>
          </div>

          <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              Delete all application data
            </p>

            <p className="mt-1 text-sm text-red-600">
              This operation is intentionally disabled for now.
            </p>

            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-300"
            >
              Delete All Data
            </button>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}