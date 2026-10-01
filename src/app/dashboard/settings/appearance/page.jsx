"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";
import { useAppearance } from "@/context/AppearanceContext";

const dashboardCardOptions = [
  {
    key: "receivedToday",
    label: "Received Today",
  },
  {
    key: "inProgress",
    label: "In Progress",
  },
  {
    key: "waitingForParts",
    label: "Waiting for Parts",
  },
  {
    key: "awaitingApproval",
    label: "Awaiting Approval",
  },
  {
    key: "readyForCollection",
    label: "Ready for Collection",
  },
  {
    key: "deliveredToday",
    label: "Delivered Today",
  },
  {
    key: "outstandingBalances",
    label: "Outstanding Balances",
  },
  {
    key: "todaysSales",
    label: "Today's Sales",
  },
  {
    key: "todaysExpenses",
    label: "Today's Expenses",
  },
  {
    key: "estimatedDailyProfit",
    label: "Estimated Daily Profit",
  },
  {
    key: "lowStockItems",
    label: "Low-Stock Items",
  },
  {
    key: "overdueRepairs",
    label: "Overdue Repairs",
  },
];

const defaultDashboardCards = {
  receivedToday: true,
  inProgress: true,
  waitingForParts: true,
  awaitingApproval: true,
  readyForCollection: true,
  deliveredToday: true,
  outstandingBalances: true,
  todaysSales: true,
  todaysExpenses: true,
  estimatedDailyProfit: true,
  lowStockItems: true,
  overdueRepairs: true,
};

export default function AppearanceSettingsPage() {
  const { refresh: refreshAppearance } = useAppearance();
  const [form, setForm] = useState({
    theme: "Light",
    tableDensity: "Comfortable",
    accentColor: "Blue",
    sidebarCollapsed: false,
    dashboardCards: defaultDashboardCards,
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
          theme: settings.appearance?.theme || "Light",
          tableDensity:
            settings.appearance?.tableDensity || "Comfortable",
          accentColor:
            settings.appearance?.accentColor || "Blue",
          sidebarCollapsed:
            settings.appearance?.sidebarCollapsed ?? false,
          dashboardCards: {
            ...defaultDashboardCards,
            ...(settings.appearance?.dashboardCards || {}),
          },
        });
      } catch (error) {
        console.error("LOAD APPEARANCE SETTINGS ERROR", error);
        setError(
          error.message || "Failed to load appearance settings."
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
      [name]: value,
    }));
  }

  function handleToggle(name) {
    setForm((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  }

  function handleDashboardCardToggle(key) {
    setForm((previous) => ({
      ...previous,
      dashboardCards: {
        ...previous.dashboardCards,
        [key]: !previous.dashboardCards[key],
      },
    }));
  }

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await settingsApi.update({
        appearance: form,
      });

      // Push changes to the global context so theme/accent apply immediately
      await refreshAppearance();

      setMessage("Appearance settings saved successfully.");
    } catch (error) {
      console.error("SAVE APPEARANCE SETTINGS ERROR", error);
      setError(
        error.message || "Failed to save appearance settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Loading appearance settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Appearance
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Customize the look and layout of your repair management
          system.
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
        {/* General appearance */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              General Appearance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure the basic appearance of the application.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Theme */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Theme
              </label>

              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            {/* Table density */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Table Density
              </label>

              <select
                name="tableDensity"
                value={form.tableDensity}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Comfortable">Comfortable</option>
                <option value="Compact">Compact</option>
              </select>
            </div>

            {/* Accent color */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Accent Color
              </label>

              <select
                name="accentColor"
                value={form.accentColor}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
                <option value="Orange">Orange</option>
              </select>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Collapse sidebar by default
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Start the application with a compact sidebar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle("sidebarCollapsed")}
                className={`relative h-6 w-11 rounded-full transition ${
                  form.sidebarCollapsed
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
                aria-label="Toggle sidebar"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    form.sidebarCollapsed
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </section>

        {/* Dashboard cards */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Dashboard Cards
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose which dashboard metrics should be visible.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCardOptions.map((card) => (
              <label
                key={card.key}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-700">
                  {card.label}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleDashboardCardToggle(card.key)
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    form.dashboardCards[card.key]
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Toggle ${card.label}`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      form.dashboardCards[card.key]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </label>
            ))}
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