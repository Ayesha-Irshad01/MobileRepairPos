"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inventoryApi } from "@/lib/api/inventory";

export default function InventoryPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      const data = await inventoryApi.getAll();
      setItems(data);
    } catch (error) {
      console.error("LOAD INVENTORY ERROR:", error);
      setError(error.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteItem(itemId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this inventory item?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await inventoryApi.delete(itemId);

    setItems((prev) =>
      prev.filter((item) => item._id !== itemId)
    );
  } catch (error) {
    console.error("DELETE INVENTORY ERROR:", error);
    alert(error.message || "Failed to delete inventory item");
  }
}

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.item?.toLowerCase().includes(search) ||
      item.sku?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search)
    );
  });

  function isLowStock(item) {
    return item.qty <= item.minQty;
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage spare parts and stock levels.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/inventory/new")}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + New Inventory Item
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by item, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Loading inventory...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-gray-900">
              No inventory items found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try a different search term."
                : "Create your first inventory item."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Item
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
                    Price
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() =>
                      router.push(`/dashboard/inventory/${item._id}`)
                    }
                    className="cursor-pointer hover:bg-gray-50"
                  >

                    {/* Item */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.item}
                      </div>

                      {item.supplier && (
                        <div className="mt-1 text-xs text-gray-500">
                          Supplier: {item.supplier}
                        </div>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4 text-gray-600">
                      {item.sku}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-600">
                      {item.category}
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className={
                          isLowStock(item)
                            ? "font-semibold text-red-600"
                            : "font-medium text-gray-900"
                        }
                      >
                        {item.qty}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">
                        / min {item.minQty}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-medium text-gray-900 text-right">
                      {Number(item.price || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {!item.isActive ? (
                        <span className="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                          Inactive
                        </span>
                      ) : isLowStock(item) ? (
                        <span className="inline-flex rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/inventory/${item._id}`)
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/inventory/${item._id}?edit=true`)
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item._id)}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && items.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {filteredItems.length} of {items.length} inventory items
        </div>
      )}

    </div>
  );
}