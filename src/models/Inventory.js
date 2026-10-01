import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    barcode: {
      type: String,
      default: "",
      trim: true,
    },

    qty: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    supplier: {
      type: String,
      default: "",
      trim: true,
    },

    compatibleBrands: {
      type: [String],
      default: [],
    },

    compatibleModels: {
      type: [String],
      default: [],
    },

    cost: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    minQty: {
      type: Number,
      default: 0,
      min: 0,
    },

    vatRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory =
  mongoose.models.Inventory ||
  mongoose.model("Inventory", inventorySchema);

export default Inventory;