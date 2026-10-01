"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

export default function DevicesSettingsPage() {
  const [form, setForm] = useState({
    brands: "",
    models: "",
    categories: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await settingsApi.get();

      setForm({
        brands: (settings.devices?.brands || []).join("\n"),
        models: (settings.devices?.models || []).join("\n"),
        categories: (settings.devices?.categories || []).join("\n"),
      });
    } catch (error) {
      console.error("Failed to load device settings:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function convertToArray(value) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await settingsApi.update({
        devices: {
          brands: convertToArray(form.brands),
          models: convertToArray(form.models),
          categories: convertToArray(form.categories),
        },
      });

      setMessage("Device settings saved successfully.");
    } catch (error) {
      console.error("Failed to save device settings:", error);
      setMessage("Failed to save device settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Devices
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage predefined device brands, models, and categories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brands */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Device Brands
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add one brand per line.
          </p>

          <textarea
            name="brands"
            value={form.brands}
            onChange={handleChange}
            rows={8}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={"Apple\nSamsung\nXiaomi"}
          />
        </section>

        {/* Models */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Device Models
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add one model per line.
          </p>

          <textarea
            name="models"
            value={form.models}
            onChange={handleChange}
            rows={10}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={"iPhone 15\nGalaxy S24\nRedmi Note 13"}
          />
        </section>

        {/* Categories */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Device Categories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add one category per line.
          </p>

          <textarea
            name="categories"
            value={form.categories}
            onChange={handleChange}
            rows={6}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={"Smartphone\nTablet\nSmartwatch\nLaptop\nOther"}
          />
        </section>

        {/* Actions */}
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