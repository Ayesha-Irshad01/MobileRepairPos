"use client";

import { useEffect, useState } from "react";
import { customerApi } from "@/lib/api/customers";
import CustomerForm from "@/components/customers/CustomerForm";
import { deviceApi } from "@/lib/api/devices";
import DeviceForm from "@/components/devices/DeviceForm";

export default function RepairForm({
  initialData = null,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [form, setForm] = useState({
    customer: "",
    device: "",
    issue: "",
    priority: "Normal",
    deviceCondition: "",
    accessoriesReceived: "",
    diagnosis: "",
    repairDetails: "",
    estimatedCost: 0,
    actualCost: 0,
    warrantyDays: 0,
    notes: "",
  });
   

  const [customers, setCustomers] = useState([]);
  const [devices, setDevices] = useState([]);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showDeviceForm, setShowDeviceForm] = useState(false);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(true);
 
  useEffect(() => {
    if (!initialData) return;

    setForm({
      customer: initialData.customer?._id || initialData.customer || "",
      device: initialData.device?._id || initialData.device || "",
      issue: initialData.issue || "",
      priority: initialData.priority || "Normal",
      deviceCondition: initialData.deviceCondition || "",
      accessoriesReceived: initialData.accessoriesReceived || "",
      diagnosis: initialData.diagnosis || "",
      repairDetails: initialData.repairDetails || "",
      estimatedCost: initialData.estimatedCost ?? 0,
      actualCost: initialData.actualCost ?? 0,
      warrantyDays: initialData.warrantyDays ?? 0,
      notes: initialData.notes || "",
    });
  }, [initialData]);

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
    async function loadDevices() {
      try {
        const data = await deviceApi.getAll();
        setDevices(data);
      } catch (error) {
        console.error("LOAD DEVICES ERROR:", error);
      } finally {
        setLoadingDevices(false);
      }
    }

    loadDevices();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleNumberChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      ...form,
      estimatedCost: Number(form.estimatedCost),
      actualCost: Number(form.actualCost),
      warrantyDays: Number(form.warrantyDays),
    });
  }

  async function handleCustomerCreated(newCustomer) {
    setCustomers((prev) => [...prev, newCustomer]);

    setForm((prev) => ({
      ...prev,
      customer: newCustomer._id,
    }));

    setShowCustomerForm(false);
  }

  async function handleDeviceCreated(newDevice) {
    setDevices((prev) => [...prev, newDevice]);

    setForm((prev) => ({
      ...prev,
      device: newDevice._id,
    }));

    setShowDeviceForm(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Customer Information</h3>
            <p className="text-sm text-gray-500 mt-1">Select an existing customer or create a new one.</p>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="customer"
                value={form.customer}
                onChange={handleChange}
                required
                disabled={loadingCustomers || submitting}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10"
              >
                <option value="">{loadingCustomers ? "Loading customers..." : "Select customer"}</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} — {customer.phone}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCustomerForm(true)}
                disabled={submitting}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shrink-0"
              >
                + New
              </button>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Device Information</h3>
            <p className="text-sm text-gray-500 mt-1">Select the device and list any accessories received.</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="device"
                    value={form.device}
                    onChange={handleChange}
                    required
                    disabled={loadingDevices || submitting}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10"
                  >
                    <option value="">{loadingDevices ? "Loading devices..." : "Select device"}</option>
                    {devices.map((device) => (
                      <option key={device._id} value={device._id}>
                        {device.brand} {device.model} — {device.category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowDeviceForm(true)}
                    disabled={submitting}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shrink-0"
                  >
                    + New
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accessories Received</label>
                <input
                  type="text"
                  name="accessoriesReceived"
                  value={form.accessoriesReceived}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Charger, case, SIM, etc."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Condition</label>
              <textarea
                name="deviceCondition"
                value={form.deviceCondition}
                onChange={handleChange}
                rows={2}
                disabled={submitting}
                placeholder="Physical condition when received (scratches, dents, etc.)..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Repair Information */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Repair Information</h3>
            <p className="text-sm text-gray-500 mt-1">Details about the issue and the repair work.</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reported Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="issue"
                  value={form.issue}
                  onChange={handleChange}
                  required
                  rows={2}
                  disabled={submitting}
                  placeholder="Describe the customer's reported issue..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                rows={2}
                disabled={submitting}
                placeholder="Technician diagnosis..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repair Details</label>
              <textarea
                name="repairDetails"
                value={form.repairDetails}
                onChange={handleChange}
                rows={2}
                disabled={submitting}
                placeholder="Describe the repair work performed..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Financial Information</h3>
            <p className="text-sm text-gray-500 mt-1">Cost estimates and warranty details.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="estimatedCost"
                    min="0"
                    value={form.estimatedCost}
                    onChange={handleNumberChange}
                    disabled={submitting}
                    className="w-full rounded-lg border border-gray-200 bg-white pl-7 pr-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10 text-right"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actual Cost</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="actualCost"
                    min="0"
                    value={form.actualCost}
                    onChange={handleNumberChange}
                    disabled={submitting}
                    className="w-full rounded-lg border border-gray-200 bg-white pl-7 pr-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10 text-right"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty (Days)</label>
                <input
                  type="number"
                  name="warrantyDays"
                  min="0"
                  value={form.warrantyDays}
                  onChange={handleNumberChange}
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50 h-10 text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-base font-semibold text-gray-900">Additional Notes</h3>
          </div>
          <div className="p-6">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              disabled={submitting}
              placeholder="Any other internal notes..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
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
            {submitting ? "Saving..." : "Save Repair"}
          </button>
        </div>
      </form>

      {/* New Customer Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Customer
              </h2>

              <button
                type="button"
                onClick={() => setShowCustomerForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <CustomerForm
              onSuccess={handleCustomerCreated}
              onCancel={() => setShowCustomerForm(false)}
            />
          </div>
        </div>
      )}

      {/* New Device Modal */}
      {showDeviceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Device
              </h2>

              <button
                type="button"
                onClick={() => setShowDeviceForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <DeviceForm
              onSuccess={handleDeviceCreated}
              onCancel={() => setShowDeviceForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}