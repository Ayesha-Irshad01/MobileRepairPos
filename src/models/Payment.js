import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: {
  type: String,
  required: true,
  trim: true,
},
    paymentDate: {
      type: Date,
      default: Date.now,
    },

    relatedRepair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repair",
      default: null,
    },

    relatedInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Other"],
      required: true,
    },

    reference: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

export default Payment;