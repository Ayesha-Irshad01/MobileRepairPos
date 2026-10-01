import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    repairNo: {
      type: String,
      required: true,
      unique: true,
    },
    partsUsed: [
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
],

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    issue: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      default: "Received",
    },
    approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
    },

   approvedAt: {
   type: Date,
   default: null,
   },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },

    priority: {
      type: String,
      default: "Normal",
    },

    deviceCondition: {
      type: String,
      default: "",
    },

    accessoriesReceived: {
      type: String,
      default: "",
    },

    diagnosis: {
      type: String,
      default: "",
    },

    repairDetails: {
      type: String,
      default: "",
    },

    estimatedCost: {
      type: Number,
      default: 0,
    },

    actualCost: {
      type: Number,
      default: 0,
    },

    warrantyDays: {
      type: Number,
      default: 0,
    },

    warrantyUntil: {
      type: Date,
      default: null,
    },

    receivedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Repair =
  mongoose.models.Repair ||
  mongoose.model("Repair", repairSchema);

export default Repair;