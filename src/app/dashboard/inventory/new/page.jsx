"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InventoryForm from "@/components/inventory/InventoryForm";
import { inventoryApi } from "@/lib/api/inventory";

export default function NewInventoryPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(data) {
    try {
      setSubmitting(true);
      setError("");

      const createdItem = await inventoryApi.create(data);

      router.push(`/dashboard/inventory/${createdItem._id}`);
    } catch (error) {
      console.error("CREATE INVENTORY ERROR:", error);
      setError(error.message || "Failed to create inventory item");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/dashboard/inventory");
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          New Inventory Item
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new spare part or inventory item.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <InventoryForm
          onSubmit={handleCreate}
          submitting={submitting}
          onCancel={handleCancel}
        />
      </div>

    </div>
  );
}