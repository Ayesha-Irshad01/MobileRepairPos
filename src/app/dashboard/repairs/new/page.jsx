"use client";

import { repairApi } from "@/lib/api/repairs";
import RepairForm from "@/components/repairs/RepairForm.jsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewRepairPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(data) {
  try {
    setSubmitting(true);

    const createdRepair = await repairApi.create(data);

    router.push(`/dashboard/repairs/${createdRepair._id}`);
  } catch (error) {
    console.error("CREATE REPAIR ERROR:", error);

    alert(error.message || "Failed to create repair");
  } finally {
    setSubmitting(false);
  }
}
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Create New Repair
      </h1>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        Create a new repair ticket.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <RepairForm
          onSubmit={handleCreate}
          submitting={submitting}
        />
      </div>
    </main>
  );
}