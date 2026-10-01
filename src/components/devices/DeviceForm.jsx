"use client";

import { useEffect, useState } from "react";

export default function DeviceForm({
  initialData = null,
  onSubmit,
  submitting = false,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "",
  });

  // Populate form when editing an existing device
  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || "",
        model: initialData.model || "",
        category: initialData.category || "",
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit(formData);
  }

  const isEditing = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>

        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          placeholder="e.g. Apple"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>

        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          placeholder="e.g. iPhone 15"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          placeholder="e.g. Smartphone"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Device"
              : "Create Device"}
        </button>

      </div>
    </form>
  );
}