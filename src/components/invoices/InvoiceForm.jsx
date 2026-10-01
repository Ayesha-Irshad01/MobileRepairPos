"use client";

import { useEffect, useState } from "react";
import { customerApi } from "@/lib/api/customers";
import { inventoryApi } from "@/lib/api/inventory";
import { settingsApi } from "@/lib/api/settings";

function calculateDueDate(invoiceDate, paymentTerms) {
  if (!invoiceDate || !paymentTerms) {
    return "";
  }

  const date = new Date(invoiceDate);

  if (paymentTerms.toLowerCase() === "due on receipt") {
    return invoiceDate;
  }

  const match = paymentTerms.match(/(\d+)\s*days?/i);

  if (!match) {
    return "";
  }

  const days = Number(match[1]);

  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}
export default function InvoiceForm({
  initialData = null,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    customer: "",
    relatedRepair: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    items: [],
    discount: 0,
    notes: "",
  });

  useEffect(() => {
  if (!initialData) return;

  setForm({
    customer: initialData.customer?._id || initialData.customer || "",

    relatedRepair:
      initialData.relatedRepair?._id ||
      initialData.relatedRepair ||
      "",

    invoiceDate: initialData.invoiceDate
      ? new Date(initialData.invoiceDate)
          .toISOString()
          .split("T")[0]
      : new Date().toISOString().split("T")[0],

    dueDate: initialData.dueDate
      ? new Date(initialData.dueDate)
          .toISOString()
          .split("T")[0]
      : "",

    items:
      initialData.items?.map((item) => ({
        inventoryItem:
          item.inventoryItem?._id ||
          item.inventoryItem ||
          "",

        description: item.description || "",
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice ?? 0,
        vatRate: item.vatRate ?? 0,
        total: item.total ?? 0,
      })) || [],

    discount: initialData.discount ?? 0,
    notes: initialData.notes || "",
  });
}, [initialData]);
  useEffect(() => {
  async function loadSettings() {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error) {
      console.error("LOAD SETTINGS ERROR:", error);
    }
  }

  loadSettings();
}, []);
  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await customerApi.getAll();
        setCustomers(data);
      } catch (error) {
        console.error("LOAD CUSTOMERS ERROR:", error);
      } finally {
        setLoadingCustomers(false);
      }
    }

    loadCustomers();
  }, []);

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await inventoryApi.getAll();
        setInventory(data);
      } catch (error) {
        console.error("LOAD INVENTORY ERROR:", error);
      } finally {
        setLoadingInventory(false);
      }
    }

    loadInventory();
  }, []);

  function handleChange(e) {
  const { name, value } = e.target;

  setForm((prev) => {
    const updatedForm = {
      ...prev,
      [name]: value,
    };

    if (!initialData && name === "invoiceDate") {
      updatedForm.dueDate = calculateDueDate(
        value,
        settings?.invoices?.paymentTerms
      );
    }

    return updatedForm;
  });
}

  function handleNumberChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          inventoryItem: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          vatRate: 0,
          total: 0,
        },
      ],
    }));
  }

  function removeItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleItemChange(index, field, value) {
    setForm((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        items,
      };
    });
  }

  function handleInventoryChange(index, inventoryId) {
    const selectedItem = inventory.find(
      (item) => item._id === inventoryId
    );

    setForm((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        inventoryItem: inventoryId,
        description: selectedItem?.item || "",
        unitPrice: selectedItem?.price ?? 0,
        vatRate: selectedItem?.vatRate ?? 0,
      };

      return {
        ...prev,
        items,
      };
    });
  }

  function calculateSubtotal() {
    return form.items.reduce((sum, item) => {
      return (
        sum +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0)
      );
    }, 0);
  }

  function calculateVat() {
  if (!settings?.tax?.vatEnabled) {
    return 0;
  }

  return form.items.reduce((sum, item) => {
    const itemTotal =
      Number(item.quantity || 0) *
      Number(item.unitPrice || 0);

    return (
      sum +
      itemTotal *
        (Number(item.vatRate || 0) / 100)
    );
  }, 0);
}
  const subtotal = calculateSubtotal();
  const vat = calculateVat();
  const discount = Number(form.discount || 0);
  const total = subtotal + vat - discount;

  async function handleSubmit(e) { 
  e.preventDefault(); 

  await onSubmit({ 
    ...form, 
    relatedRepair: form.relatedRepair || null, 
    discount: Number(form.discount), 

    items: form.items.map((item) => ({ 
      ...item, 
      inventoryItem: item.inventoryItem || null,
      quantity: Number(item.quantity), 
      unitPrice: Number(item.unitPrice), 
      vatRate: Number(item.vatRate), 
      total: 
        Number(item.quantity) * 
        Number(item.unitPrice), 
    })), 
  }); 
}
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Invoice Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Customer */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Customer *
            </label>

            <select
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
              disabled={loadingCustomers}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {loadingCustomers
                  ? "Loading customers..."
                  : "Select customer"}
              </option>

              {customers.map((customer) => (
                <option
                  key={customer._id}
                  value={customer._id}
                >
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Related Repair */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Related Repair
            </label>

            <input
              type="text"
              name="relatedRepair"
              value={form.relatedRepair}
              onChange={handleChange}
              placeholder="Repair ID (optional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              Optional. We can replace this with a repair selector later.
            </p>
          </div>

          {/* Invoice Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Invoice Date
            </label>

            <input
              type="date"
              name="invoiceDate"
              value={form.invoiceDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>
      </div>

      {/* Invoice Items */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Invoice Items
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add the parts or services being billed.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            + Add Item
          </button>
        </div>

        {form.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
              No invoice items added yet.
            </p>

            <button
              type="button"
              onClick={addItem}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            {form.items.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-4 lg:grid-cols-12">

                  {/* Inventory */}
                  <div className="lg:col-span-4">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Inventory Item
                    </label>

                    <select
                      value={item.inventoryItem}
                      onChange={(e) =>
                        handleInventoryChange(
                          index,
                          e.target.value
                        )
                      }
                      disabled={loadingInventory}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">
                        {loadingInventory
                          ? "Loading..."
                          : "Select item"}
                      </option>

                      {inventory.map((inventoryItem) => (
                        <option
                          key={inventoryItem._id}
                          value={inventoryItem._id}
                        >
                          {inventoryItem.item} — Rs.{" "}
                          {inventoryItem.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-4">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Description
                    </label>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="lg:col-span-1">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Qty
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="lg:col-span-1">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "unitPrice",
                          Number(e.target.value)
                        )
                      }
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
                    />
                  </div>

                  {/* VAT */}
                  <div className="lg:col-span-1">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      VAT %
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={item.vatRate}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "vatRate",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Remove */}
                  <div className="flex items-end justify-end lg:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Totals + Notes */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Notes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Notes
          </h2>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={6}
            placeholder="Additional notes..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Totals */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Invoice Summary
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-medium text-gray-900">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                VAT
              </span>

              <span className="font-medium text-gray-900">
                Rs. {vat.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label
                htmlFor="discount"
                className="text-gray-500"
              >
                Discount
              </label>

              <input
                id="discount"
                name="discount"
                type="number"
                min="0"
                value={form.discount}
                onChange={handleNumberChange}
                className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Actions */}
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
    ? "Saving..."
    : initialData
      ? "Update Invoice"
      : "Create Invoice"}
        </button>

      </div>

    </form>
  );
}