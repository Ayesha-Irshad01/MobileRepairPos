"use client";

import { useEffect, useState } from "react";

export default function InventoryForm({
  initialData = null,
  onSubmit,
  submitting = false,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    item: "",
    sku: "",
    barcode: "",
    category: "",
    supplier: "",
    compatibleBrands: "",
    compatibleModels: "",
    cost: "",
    price: "",
    qty: "",
    minQty: "",
    vatRate: "",
    location: "",
    notes: "",
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        item: initialData.item || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        category: initialData.category || "",
        supplier: initialData.supplier || "",
        compatibleBrands:
          initialData.compatibleBrands?.join(", ") || "",
        compatibleModels:
          initialData.compatibleModels?.join(", ") || "",
        cost: initialData.cost ?? "",
        price: initialData.price ?? "",
        qty: initialData.qty ?? "",
        minQty: initialData.minQty ?? "",
        vatRate: initialData.vatRate ?? "",
        location: initialData.location || "",
        notes: initialData.notes || "",
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      ...formData,

      compatibleBrands: formData.compatibleBrands
        .split(",")
        .map((brand) => brand.trim())
        .filter(Boolean),

      compatibleModels: formData.compatibleModels
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean),

      cost: Number(formData.cost) || 0,
      price: Number(formData.price) || 0,
      qty: Number(formData.qty) || 0,
      minQty: Number(formData.minQty) || 0,
      vatRate: Number(formData.vatRate) || 0,
    };

    await onSubmit(data);
  }

  const isEditing = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">
            Basic Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Item <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
                placeholder="e.g. iPhone 15 Display"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="e.g. IPH15-DISPLAY"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Barcode
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Optional barcode"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g. Screen"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Supplier name"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">
            Compatibility
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Separate multiple brands or models with commas.
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Compatible Brands
              </label>
              <input
                type="text"
                name="compatibleBrands"
                value={formData.compatibleBrands}
                onChange={handleChange}
                placeholder="Apple, Samsung, Xiaomi"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Compatible Models
              </label>
              <input
                type="text"
                name="compatibleModels"
                value={formData.compatibleModels}
                onChange={handleChange}
                placeholder="iPhone 15, iPhone 15 Pro"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock & Pricing */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-900">
            Stock & Pricing
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Min Quantity
              </label>
              <input
                type="number"
                name="minQty"
                value={formData.minQty}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VAT %
              </label>
              <input
                type="number"
                name="vatRate"
                value={formData.vatRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-right transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-5">
          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Storage Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Shelf A-12"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 h-10"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Item is active
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Inventory Item"
              : "Create Inventory Item"}
        </button>
      </div>

    </form>
  );
}