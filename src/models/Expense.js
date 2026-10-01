import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    expenseNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    description: {
  type: String,
  default: "",
  trim: true,
},

    category: {
      type: String,
      required: true,
      enum: [
        "Rent",
        "Electricity",
        "Salaries",
        "Internet",
        "Spare Parts",
        "Tools",
        "Transport",
        "Marketing",
        "Cleaning",
        "Software",
        "Bank Charges",
        "Miscellaneous Charges",
      ],
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Card", "Bank Transfer", "Other"],
    },

    vatRate: {
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

    receipt: {
      type: String,
      default: "",
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

const Expense =
  mongoose.models.Expense ||
  mongoose.model("Expense", expenseSchema);

export default Expense;