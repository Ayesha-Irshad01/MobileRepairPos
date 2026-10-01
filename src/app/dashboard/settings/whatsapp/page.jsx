"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api/settings";

const DEFAULT_TEMPLATES = [
  {
    key: "deviceReceived",
    name: "Device Received",
    status: "Received",
    message:
      "Hello {customer_name},\nWe have received your {device} for inspection or repair.\nJob Number: {job_no}\nReported Issue: {issue}\nWe will contact you after the diagnosis.\nThank you,\n{shop_name}",
    active: true,
  },
  {
    key: "repairEstimate",
    name: "Repair Estimate",
    status: "Awaiting Approval",
    message:
      "Hello {customer_name},\nYour repair estimate for {device} is ready.\nAmount: {amount}\nPlease let us know if you approve the repair.\nThank you,\n{shop_name}",
    active: true,
  },
  {
    key: "waitingForParts",
    name: "Waiting for Parts",
    status: "Waiting for Parts",
    message:
      "Hello {customer_name},\nYour {device} is currently waiting for the required spare parts.\nWe will update you once the repair continues.\nThank you,\n{shop_name}",
    active: true,
  },
  {
    key: "repairReady",
    name: "Repair Ready",
    status: "Ready for Collection",
    message:
      "Hello {customer_name},\nYour {brand} {model} is ready for collection.\nAmount: {amount}\nPaid: {paid}\nBalance: {balance}\nThank you,\n{shop_name}\n{shop_phone}",
    active: true,
  },
  {
    key: "paymentReminder",
    name: "Payment Reminder",
    status: "",
    message:
      "Hello {customer_name},\nThis is a reminder that your outstanding balance is {balance}.\nPlease contact us if you have any questions.\nThank you,\n{shop_name}",
    active: true,
  },
  {
    key: "unableToRepair",
    name: "Unable to Repair",
    status: "Unable to Repair",
    message:
      "Hello {customer_name},\nUnfortunately, we were unable to repair your {device}.\nReason: {reason}\nPlease contact us for further information.\nThank you,\n{shop_name}",
    active: true,
  },
  {
    key: "warrantyInfo",
    name: "Warranty Info",
    status: "Delivered",
    message:
      "Hello {customer_name},\nYour {device} was delivered with a warranty until {warranty_date}.\nPlease contact us if you experience any issue covered by the warranty.\nThank you,\n{shop_name}\n{shop_phone}",
    active: true,
  },
];

const INSERT_FIELDS = [
  { label: "Customer Name", value: "{customer_name}" },
  { label: "Shop Name", value: "{shop_name}" },
  { label: "Job Number", value: "{job_no}" },
  { label: "Device", value: "{device}" },
  { label: "Brand", value: "{brand}" },
  { label: "Model", value: "{model}" },
  { label: "Issue", value: "{issue}" },
  { label: "Repair Details", value: "{repair_details}" },
  { label: "Amount", value: "{amount}" },
  { label: "Paid", value: "{paid}" },
  { label: "Balance", value: "{balance}" },
  { label: "Delivery Date", value: "{delivery_date}" },
  { label: "Warranty Date", value: "{warranty_date}" },
  { label: "Reason", value: "{reason}" },
  { label: "Shop Phone", value: "{shop_phone}" },
  { label: "Shop Address", value: "{shop_address}" },
];

const STATUS_OPTIONS = [
  "Received",
  "Diagnosing",
  "Awaiting Approval",
  "Approved",
  "Waiting for Parts",
  "Repairing",
  "Testing",
  "Ready for Collection",
  "Delivered",
  "Cancelled",
  "Unable to Repair",
];

const PREVIEW_VALUES = {
  "{customer_name}": "Ayesha Khan",
  "{shop_name}": "Mobile Care",
  "{job_no}": "REP-2026-0042",
  "{device}": "iPhone 15",
  "{brand}": "Apple",
  "{model}": "iPhone 15",
  "{issue}": "Broken screen",
  "{repair_details}": "Screen replacement",
  "{amount}": "Rs 15,000",
  "{paid}": "Rs 10,000",
  "{balance}": "Rs 5,000",
  "{delivery_date}": "20 September 2026",
  "{warranty_date}": "20 December 2026",
  "{reason}": "Water damage to the main board",
  "{shop_phone}": "0300-1234567",
  "{shop_address}": "Main Market, Faisalabad",
};

function cloneDefaults() {
  return DEFAULT_TEMPLATES.map((template) => ({
    ...template,
  }));
}

function createKey() {
  return `custom_${Date.now()}`;
}

function replacePlaceholders(message) {
  let result = message;

  Object.entries(PREVIEW_VALUES).forEach(
    ([placeholder, value]) => {
      result = result.replaceAll(placeholder, value);
    }
  );

  return result;
}

export default function WhatsAppSettingsPage() {
  const [templates, setTemplates] = useState([]);
  const [openKey, setOpenKey] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await settingsApi.get();

      const savedTemplates =
        settings.whatsapp?.templates;

      if (Array.isArray(savedTemplates)) {
        setTemplates(savedTemplates);
      } else {
        setTemplates(cloneDefaults());
      }
    } catch (error) {
      console.error(
        "Failed to load WhatsApp settings:",
        error
      );

      setTemplates(cloneDefaults());
    } finally {
      setLoading(false);
    }
  }

  function updateTemplate(key, field, value) {
    setTemplates((prev) =>
      prev.map((template) =>
        template.key === key
          ? {
              ...template,
              [field]: value,
            }
          : template
      )
    );
  }

  function toggleTemplate(key) {
    setTemplates((prev) =>
      prev.map((template) =>
        template.key === key
          ? {
              ...template,
              active: !template.active,
            }
          : template
      )
    );
  }

  function addTemplate() {
    const newTemplate = {
      key: createKey(),
      name: "New Template",
      status: "",
      message: "",
      active: false,
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setOpenKey(newTemplate.key);
  }

  function restoreAllDefaults() {
    setTemplates(cloneDefaults());
    setOpenKey(null);
    setMessage("");
  }

  function restoreTemplate(key) {
    const defaultTemplate = DEFAULT_TEMPLATES.find(
      (template) => template.key === key
    );

    if (!defaultTemplate) {
      return;
    }

    setTemplates((prev) =>
      prev.map((template) =>
        template.key === key
          ? { ...defaultTemplate }
          : template
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await settingsApi.update({
        whatsapp: {
          templates,
        },
      });

      setMessage(
        "WhatsApp templates saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save WhatsApp templates:",
        error
      );

      setMessage(
        "Failed to save WhatsApp templates."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          WhatsApp Templates
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure reusable WhatsApp messages for common repair events.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Template List */}
          <div className="divide-y divide-gray-200">
            {templates.map((template) => {
              const isOpen = openKey === template.key;

              return (
                <div key={template.key}>
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenKey(
                        isOpen ? null : template.key
                      )
                    }
                    className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                      isOpen
                        ? "bg-orange-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {template.name || "Untitled Template"}
                      </span>

                      {template.active && (
                        <span className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
                          Active
                        </span>
                      )}

                      {template.status && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          {template.status}
                        </span>
                      )}
                    </div>

                    <span className="ml-4 text-xl text-gray-700">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="border-t border-gray-200 p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Name
                          </label>

                          <input
                            type="text"
                            value={template.name}
                            onChange={(e) =>
                              updateTemplate(
                                template.key,
                                "name",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status (Auto-suggest)
                          </label>

                          <input
                            type="text"
                            list={`status-options-${template.key}`}
                            value={template.status}
                            onChange={(e) =>
                              updateTemplate(
                                template.key,
                                "status",
                                e.target.value
                              )
                            }
                            placeholder="Select or enter a repair status"
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />

                          <datalist
                            id={`status-options-${template.key}`}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option
                                key={status}
                                value={status}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Active Toggle */}
                      <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Template status
                          </p>

                          <p className="text-xs text-gray-500">
                            Active templates can be used by the repair workflow.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleTemplate(template.key)
                          }
                          className={`relative h-6 w-11 rounded-full transition ${
                            template.active
                              ? "bg-emerald-500"
                              : "bg-gray-300"
                          }`}
                          aria-label="Toggle template"
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                              template.active
                                ? "left-6"
                                : "left-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Message */}
                      <div className="mt-5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Message
                        </label>

                        <textarea
                          value={template.message}
                          onChange={(e) =>
                            updateTemplate(
                              template.key,
                              "message",
                              e.target.value
                            )
                          }
                          rows={8}
                          placeholder="Write your message here..."
                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Friendly Field Buttons */}
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Insert information
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {INSERT_FIELDS.map((field) => (
                            <button
                              key={field.value}
                              type="button"
                              onClick={() => {
                                const textarea =
                                  document.querySelector(
                                    `textarea[data-template-key="${template.key}"]`
                                  );

                                if (!textarea) {
                                  return;
                                }

                                const start =
                                  textarea.selectionStart;
                                const end =
                                  textarea.selectionEnd;

                                const current =
                                  template.message || "";

                                const updated =
                                  current.slice(0, start) +
                                  field.value +
                                  current.slice(end);

                                updateTemplate(
                                  template.key,
                                  "message",
                                  updated
                                );

                                requestAnimationFrame(() => {
                                  textarea.focus();

                                  const cursor =
                                    start +
                                    field.value.length;

                                  textarea.setSelectionRange(
                                    cursor,
                                    cursor
                                  );
                                });
                              }}
                              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                            >
                              {field.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTemplate(template)
                          }
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Preview
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            restoreTemplate(template.key)
                          }
                          className="rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
                        >
                          Restore defaults
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addTemplate}
                className="rounded-lg border border-orange-300 bg-white px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
              >
                + Add
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "✓ Save"}
              </button>

              {message && (
                <p className="text-sm text-gray-600">
                  {message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={restoreAllDefaults}
              className="rounded-lg border border-orange-300 bg-white px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
            >
              ↩ Restore defaults
            </button>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Message Preview
                </h2>

                <p className="text-xs text-gray-500">
                  {previewTemplate.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewTemplate(null)
                }
                className="text-xl text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-gray-100 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                  {replacePlaceholders(
                    previewTemplate.message
                  )}
                </p>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Preview uses sample customer and repair information.
              </p>
            </div>

            <div className="flex justify-end border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setPreviewTemplate(null)
                }
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}