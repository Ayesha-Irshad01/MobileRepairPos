"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { inventoryApi } from "@/lib/api/inventory";
import InventoryForm from "@/components/inventory/InventoryForm";

export default function InventoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const editMode = searchParams.get("edit") === "true";
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(editMode);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);
  useEffect(() => {
  setEditing(editMode);
}, [editMode]);

  async function loadItem() {
    try {
      setLoading(true);
      setError("");

      const data = await inventoryApi.getById(id);
      setItem(data);
    } catch (error) {
      console.error("LOAD INVENTORY ITEM ERROR:", error);
      setError(error.message || "Failed to load inventory item");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(data) {
    try {
      setUpdating(true);
      setError("");

      const updatedItem = await inventoryApi.update(id, data);

      setItem(updatedItem);
      setEditing(false);
    } catch (error) {
      console.error("UPDATE INVENTORY ITEM ERROR:", error);
      setError(error.message || "Failed to update inventory item");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await inventoryApi.delete(id);

      alert("Inventory item deleted successfully.");

      router.push("/dashboard/inventory");
    } catch (error) {
      console.error("DELETE INVENTORY ITEM ERROR:", error);
      setError(error.message || "Failed to delete inventory item");
      setDeleting(false);
    }
  }

  function isLowStock() {
    if (!item) return false;
    return item.qty <= item.minQty;
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Loading inventory item...
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="space-y-4 p-6">
        <button
          onClick={() => router.push("/dashboard/inventory")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Inventory
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <button
            onClick={() => router.push("/dashboard/inventory")}
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Inventory
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">
            {item.item}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            SKU: {item.sku}
          </p>
        </div>

        {!editing && (
          <div className="flex gap-3">

            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit Item
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Item"}
            </button>

          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {editing ? (
        /* Edit Form */
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Inventory Item
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the inventory item's information.
            </p>
          </div>

          <InventoryForm
            initialData={item}
            onSubmit={handleUpdate}
            submitting={updating}
            onCancel={() => setEditing(false)}
          />

        </div>
      ) : (
        <>
          {/* Status + Stock */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Stock */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Current Stock
              </p>

              <p
                className={`mt-2 text-3xl font-semibold ${
                  isLowStock()
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {item.qty}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Minimum required: {item.minQty}
              </p>
            </div>

            {/* Price */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Selling Price
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {Number(item.price || 0).toLocaleString()}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Status
              </p>

              <div className="mt-3">
                {!item.isActive ? (
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                    Inactive
                  </span>
                ) : isLowStock() ? (
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700">
                    Low Stock
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                    In Stock
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Item Information */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                Item Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

              <Info label="Item" value={item.item} />

              <Info label="SKU" value={item.sku} />

              <Info
                label="Barcode"
                value={item.barcode || "—"}
              />

              <Info
                label="Category"
                value={item.category}
              />

              <Info
                label="Supplier"
                value={item.supplier || "—"}
              />

              <Info
                label="Storage Location"
                value={item.location || "—"}
              />

              <Info
                label="Cost"
                value={Number(item.cost || 0).toLocaleString()}
              />

              <Info
                label="Selling Price"
                value={Number(item.price || 0).toLocaleString()}
              />

              <Info
                label="VAT Rate"
                value={`${item.vatRate || 0}%`}
              />

            </div>
          </div>

          {/* Compatibility */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                Compatibility
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Compatible Brands
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {item.compatibleBrands?.length
                    ? item.compatibleBrands.join(", ")
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Compatible Models
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {item.compatibleModels?.length
                    ? item.compatibleModels.join(", ")
                    : "—"}
                </p>
              </div>

            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-semibold text-gray-900">
                  Notes
                </h2>
              </div>

              <div className="p-6">
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {item.notes}
                </p>
              </div>

            </div>
          )}

        </>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}