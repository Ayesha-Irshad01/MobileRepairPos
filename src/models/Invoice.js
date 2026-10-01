import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      default: null,
    },

    description: {
      type: String,
      required: true,
      trim: true,
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

    vatRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);


const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    relatedRepair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repair",
      default: null,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    items: {
      type: [invoiceItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    vat: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
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


const Invoice =
  mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);

export default Invoice;