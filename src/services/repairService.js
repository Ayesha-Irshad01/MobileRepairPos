import Repair from "@/models/Repair";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { removeStock,addStock } from "@/services/inventoryService";

const allowedTransitions = {
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

export function canChangeRepairStatus(currentStatus, newStatus) {
  const allowedStatuses = allowedTransitions[currentStatus];

  if (!allowedStatuses) {
    return false;
  }

  return allowedStatuses.includes(newStatus);
}
export async function updateRepairStatus(repairId, newStatus) {
  await connectDB();
  const repair = await Repair.findById(repairId);

  if (!repair) {
    throw new Error("Repair not found");
  }

  const currentStatus = repair.status;

  const allowedNextStatuses = allowedTransitions[currentStatus];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new Error(
      `Cannot change repair status from ${currentStatus} to ${newStatus}`
    );
  }

  repair.status = newStatus;

  if (newStatus === "Delivered") {
    repair.completedAt = new Date();
  }

  await repair.save();

  return repair;
}

export async function processRepairApproval(repairId, decision) {
  await connectDB();

  const repair = await Repair.findById(repairId);

  if (!repair) {
    throw new Error("Repair not found");
  }

  if (repair.status !== "Awaiting Approval") {
    throw new Error("Repair is not awaiting approval");
  }

  if (decision === "Approved") {
    repair.approvalStatus = "Approved";
    repair.approvedAt = new Date();
    repair.status = "Approved";
  } else if (decision === "Rejected") {
    repair.approvalStatus = "Rejected";
    repair.approvedAt = new Date();
    repair.status = "Cancelled";
  } else {
    throw new Error("Invalid approval decision");
  }

  await repair.save();

  return repair;
}
export async function useRepairPart(repairId, inventoryItemId, quantity) {
  await connectDB();

  const repair = await Repair.findById(repairId);

  if (!repair) {
    throw new Error("Repair not found");
  }

  const allowedStatuses = [
    "Approved",
    "Waiting for Parts",
    "Repairing",
    "Testing",
  ];

  if (!allowedStatuses.includes(repair.status)) {
    throw new Error(
      `Cannot use parts when repair status is ${repair.status}`
    );
  }

  const inventoryItem = await Inventory.findById(inventoryItemId);

  if (!inventoryItem) {
    throw new Error("Inventory item not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  await removeStock(inventoryItemId, quantity);

  repair.partsUsed.push({
    inventoryItem: inventoryItem._id,
    quantity: quantity,
    unitPrice: inventoryItem.price,
  });

   await repair.save();

   return await Repair.findById(repair._id)
  .populate("customer")
  .populate("device")
  .populate("partsUsed.inventoryItem");
}
export async function removeRepairPart(repairId, inventoryItemId) {
  await connectDB();

  const repair = await Repair.findById(repairId);

  if (!repair) {
    throw new Error("Repair not found");
  }

  const partIndex = repair.partsUsed.findIndex(
    (part) => part.inventoryItem.toString() === inventoryItemId
  );

  if (partIndex === -1) {
    throw new Error("Part is not used in this repair");
  }

  const part = repair.partsUsed[partIndex];

  await addStock(inventoryItemId, part.quantity);

  repair.partsUsed.splice(partIndex, 1);

  await repair.save();

  return await Repair.findById(repair._id)
  .populate("customer")
  .populate("device")
  .populate("partsUsed.inventoryItem");
}