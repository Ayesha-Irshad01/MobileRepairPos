"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { repairApi } from "@/lib/api/repairs";
import RepairForm from "@/components/repairs/RepairForm";
import { inventoryApi } from "@/lib/api/inventory";
import { whatsappApi } from "@/lib/api/whatsapp";
import { settingsApi } from "@/lib/api/settings";
import { Button } from "@/components/ui/Button";

export default function RepairDetailsPage() {
  const params = useParams();
  const repairId = params.id;

const [repair, setRepair] = useState(null);
const [loading, setLoading] = useState(true);
const [updatingStatus, setUpdatingStatus] = useState(false);
const [updatingRepair, setUpdatingRepair] = useState(false);
const [editing, setEditing] = useState(false);
const [error, setError] = useState("");
const [inventoryItems, setInventoryItems] = useState([]);
const [selectedInventoryItem, setSelectedInventoryItem] = useState("");
const [partQuantity, setPartQuantity] = useState(1);
const [addingPart, setAddingPart] = useState(false);
const [removingPart, setRemovingPart] = useState(false);
const [whatsappTemplates, setWhatsappTemplates] = useState([]);
const [selectedWhatsappTemplate, setSelectedWhatsappTemplate] = useState("");
const [whatsappMessage, setWhatsappMessage] = useState("");
const [generatingWhatsapp, setGeneratingWhatsapp] = useState(false);
const [whatsappError, setWhatsappError] = useState("");

  useEffect(() => {
    async function loadRepair() {
      try {
        const data = await repairApi.getById(repairId);
        setRepair(data);
      } catch (error) {
        console.error("LOAD REPAIR ERROR:", error);
        setError(error.message || "Failed to load repair");
      } finally {
        setLoading(false);
      }
    }

    if (repairId) {
      loadRepair();
    }
  }, [repairId]);
  const statusFlow = {
  Received: ["Diagnosing", "Cancelled"],

  Diagnosing: [
    "Awaiting Approval",
    "Unable to Repair",
    "Cancelled",
  ],

  "Awaiting Approval": [
    "Approved",
    "Cancelled",
  ],

  Approved: [
    "Waiting for Parts",
    "Repairing",
    "Cancelled",
  ],

  "Waiting for Parts": [
    "Repairing",
    "Cancelled",
  ],

  Repairing: [
    "Testing",
    "Cancelled",
  ],

  Testing: [
    "Ready for Collection",
    "Repairing",
    "Unable to Repair",
    "Cancelled",
  ],

  "Ready for Collection": [
    "Delivered",
    "Cancelled",
  ],

  Delivered: [],
  Cancelled: [],
  "Unable to Repair": [],
};
useEffect(() => {
  async function loadInventory() {
    try {
      const data = await inventoryApi.getAll();
      setInventoryItems(data);
    } catch (error) {
      console.error("LOAD INVENTORY ERROR:", error);
    }
  }

  loadInventory();
}, []);
useEffect(() => {
  async function loadWhatsappTemplates() {
    try {
      const settings = await settingsApi.get();

      const templates = settings.whatsapp?.templates || [];

      setWhatsappTemplates(
        templates.filter((template) => template.active)
      );
    } catch (error) {
      console.error("LOAD WHATSAPP TEMPLATES ERROR:", error);
    }
  }

  loadWhatsappTemplates();
}, []);
  async function handleStatusUpdate(newStatus) {
  try {
    setUpdatingStatus(true);

    const updatedRepair = await repairApi.updateStatus(
      repairId,
      newStatus
    );

    setRepair(updatedRepair);
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    alert(error.message || "Failed to update status");
  } finally {
    setUpdatingStatus(false);
  }
}
async function handleRepairUpdate(data) {
  try {
    setUpdatingRepair(true);

    const updatedRepair = await repairApi.update(
      repairId,
      data
    );

    setRepair(updatedRepair);
    setEditing(false);
  } catch (error) {
    console.error("UPDATE REPAIR ERROR:", error);
    alert(error.message || "Failed to update repair");
  } finally {
    setUpdatingRepair(false);
  }
}
async function handleAddPart() {
  if (!selectedInventoryItem) {
    alert("Please select an inventory item");
    return;
  }

  if (partQuantity <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }

  try {
    setAddingPart(true);

    const updatedRepair = await repairApi.usePart(
      repairId,
      selectedInventoryItem,
      Number(partQuantity)
    );

    setRepair(updatedRepair);

    setSelectedInventoryItem("");
    setPartQuantity(1);
  } catch (error) {
    console.error("ADD REPAIR PART ERROR:", error);
    alert(error.message || "Failed to add part");
  } finally {
    setAddingPart(false);
  }
}

async function handleRemovePart(inventoryItemId) {
  const confirmed = window.confirm(
    "Remove this part from the repair?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setRemovingPart(true);

    const updatedRepair = await repairApi.removePart(
      repairId,
      inventoryItemId
    );

    setRepair(updatedRepair);
  } catch (error) {
    console.error("REMOVE REPAIR PART ERROR:", error);
    alert(error.message || "Failed to remove part");
  } finally {
    setRemovingPart(false);
  }
}
async function handleGenerateWhatsappMessage() {
  if (!selectedWhatsappTemplate) {
    setWhatsappError("Please select a WhatsApp template");
    return;
  }

  try {
    setGeneratingWhatsapp(true);
    setWhatsappError("");
    setWhatsappMessage("");

    const result = await whatsappApi.generateMessage(
      repairId,
      selectedWhatsappTemplate
    );

    setWhatsappMessage(result.message);
  } catch (error) {
    console.error(
      "GENERATE WHATSAPP MESSAGE ERROR:",
      error
    );

    setWhatsappError(
      error.message || "Failed to generate WhatsApp message"
    );
} finally {
    setGeneratingWhatsapp(false);
  }
}

async function handleSendWhatsapp() {
  if (!selectedWhatsappTemplate || !whatsappMessage) {
    setWhatsappError("Please generate a message first");
    return;
  }

  const phone = repair.customer?.phone;
  if (!phone) {
    setWhatsappError("Customer phone number not available");
    return;
  }

  try {
    setGeneratingWhatsapp(true);
    setWhatsappError("");

    const result = await whatsappApi.sendMessage(
      repairId,
      selectedWhatsappTemplate,
      phone
    );

    window.open(result.whatsappUrl, "_blank");
  } catch (error) {
    console.error("SEND WHATSAPP MESSAGE ERROR:", error);
    setWhatsappError(error.message || "Failed to send WhatsApp message");
  } finally {
    setGeneratingWhatsapp(false);
  }
}

if (loading) {
    return (
      <main className="p-6">
        <p>Loading repair...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (!repair) {
    return (
      <main className="p-6">
        <p>Repair not found.</p>
      </main>
    );
  }
  async function handleDelete() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this repair?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await repairApi.delete(repairId);

    alert("Repair deleted successfully.");

    window.location.href = "/dashboard/repairs";
  } catch (error) {
    console.error("DELETE REPAIR ERROR:", error);
    alert(error.message || "Failed to delete repair");
  }
}

  return (
    <main className="p-6 space-y-6">
      
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/dashboard/repairs")}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-3"
        >
          ← Back to Repairs
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Repair {repair.repairNo}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Repair ticket details and updates
            </p>
          </div>

<div className="flex items-center gap-3">
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="md"
            >
              Print
            </Button>
            {!editing && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  disabled={updatingRepair}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Edit Repair
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </>
            )}
</div>
        </div>
      </div>

      {editing && (
        <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Edit Repair</h2>
          </div>
          <div className="p-6">
            <RepairForm
              initialData={repair}
              onSubmit={handleRepairUpdate}
              submitting={updatingRepair}
            />
            <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={updatingRepair}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel Edit
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Repair Information */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Repair Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Repair No</p>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">{repair.repairNo}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Status</p>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">
                    <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {repair.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Priority</p>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">{repair.priority}</p>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Issue</p>
                  <p className="mt-1.5 text-sm font-medium text-gray-900 whitespace-pre-wrap">{repair.issue}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer & Device */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-semibold text-gray-900">Customer</h2>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-gray-900">{repair.customer?.name || "—"}</p>
                <p className="text-sm text-gray-500 mt-1">{repair.customer?.phone || "—"}</p>
              </div>
            </section>
            
            <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-semibold text-gray-900">Device</h2>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-gray-900">
                  {repair.device ? `${repair.device.brand} ${repair.device.model}` : "—"}
                </p>
                <p className="text-sm text-gray-500 mt-1">{repair.device?.category || "—"}</p>
              </div>
            </section>
          </div>

          {/* Cost */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Cost Summary</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Estimated Cost</p>
                  <p className="mt-1.5 text-lg font-medium text-gray-900">Rs. {Number(repair.estimatedCost || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Actual Cost</p>
                  <p className="mt-1.5 text-lg font-bold text-gray-900">Rs. {Number(repair.actualCost || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Status Update */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Update Status</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <select
                    defaultValue=""
                    disabled={updatingStatus}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleStatusUpdate(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
                  >
                    <option value="">Change status...</option>
                    {(statusFlow[repair.status] || []).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                {updatingStatus && <span className="text-sm font-medium text-blue-600">Updating...</span>}
              </div>
            </div>
          </section>

          {/* Parts Used */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Parts Used</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedInventoryItem}
                  onChange={(e) => setSelectedInventoryItem(e.target.value)}
                  disabled={addingPart}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
                >
                  <option value="">Select part</option>
                  {inventoryItems.filter(i => i.isActive && i.qty > 0).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.item} — Stock: {item.qty}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={partQuantity}
                  onChange={(e) => setPartQuantity(e.target.value)}
                  disabled={addingPart}
                  className="w-24 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleAddPart}
                  disabled={addingPart}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shrink-0"
                >
                  {addingPart ? "Adding..." : "Add Part"}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {(!repair.partsUsed || repair.partsUsed.length === 0) ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                    <p className="text-sm text-gray-500">No parts used yet.</p>
                  </div>
                ) : (
                  repair.partsUsed.map((part, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{part.inventoryItem?.item || "Part"}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {part.quantity} × Rs. {Number(part.unitPrice).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePart(part.inventoryItem?._id || part.inventoryItem)}
                        disabled={removingPart}
                        className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* WhatsApp Message */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">WhatsApp Notification</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Generate a personalized message to update the customer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedWhatsappTemplate}
                  onChange={(e) => {
                    setSelectedWhatsappTemplate(e.target.value);
                    setWhatsappMessage("");
                    setWhatsappError("");
                  }}
                  disabled={generatingWhatsapp}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm h-10 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 hover:border-gray-300"
                >
                  <option value="">Select template</option>
                  {whatsappTemplates.map((template) => (
                    <option key={template.key} value={template.key}>{template.name}</option>
                  ))}
                </select>
                <Button
                  onClick={handleGenerateWhatsappMessage}
                  disabled={generatingWhatsapp || !selectedWhatsappTemplate}
                  variant="success"
                >
                  {generatingWhatsapp ? "Generating..." : "Generate Message"}
                </Button>
              </div>

              {whatsappError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {whatsappError}
                </div>
              )}

              {whatsappMessage && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Preview</p>
                    <Button
                      onClick={handleSendWhatsapp}
                      disabled={generatingWhatsapp}
                      variant="success"
                      size="sm"
                    >
                      {generatingWhatsapp ? "Sending..." : "Send via WhatsApp"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{whatsappMessage}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}