import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    business: {
      shopName: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },
    },

    regional: {
      currencyCode: {
        type: String,
        default: "PKR",
        trim: true,
      },

      currencySymbol: {
        type: String,
        default: "Rs",
        trim: true,
      },

      numberFormat: {
        type: String,
        default: "1,234.56",
      },

      dateFormat: {
        type: String,
        default: "DD/MM/YYYY",
      },

      timeFormat: {
        type: String,
        default: "24h",
      },

      timeZone: {
        type: String,
        default: "Asia/Karachi",
      },

      primaryLanguage: {
        type: String,
        default: "English",
      },

      secondaryLanguage: {
        type: String,
        default: "",
      },
    },

    tax: {
      vatEnabled: {
        type: Boolean,
        default: false,
      },

      defaultVatRate: {
        type: Number,
        default: 0,
        min: 0,
      },

      pricesIncludeVat: {
        type: Boolean,
        default: false,
      },

      showVatOnInvoices: {
        type: Boolean,
        default: true,
      },
    },

    repairs: {
      jobPrefix: {
        type: String,
        default: "REP-",
        trim: true,
      },

      startingNumber: {
        type: Number,
        default: 1,
        min: 1,
      },

      defaultStatus: {
        type: String,
        default: "Received",
        enum: [
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
        ],
      },

      defaultTechnician: {
        type: String,
        default: "",
        trim: true,
      },

      defaultWarrantyDays: {
        type: Number,
        default: 0,
        min: 0,
      },

      priorities: {
        type: [String],
        default: ["Low", "Normal", "High", "Urgent"],
      },

      deviceCategories: {
        type: [String],
        default: [
          "Smartphone",
          "Tablet",
          "Smartwatch",
          "Laptop",
          "Other",
        ],
      },

      commonFaults: {
        type: [String],
        default: [],
      },

      deviceConditions: {
        type: [String],
        default: [],
      },

      accessoriesReceived: {
        type: [String],
        default: [],
      },
    },
    devices: {
  brands: {
    type: [String],
    default: [
      "Apple",
      "Google",
      "Huawei",
      "Nokia",
      "OnePlus",
      "Samsung",
      "Xiaomi",
    ],
  },

  models: {
    type: [String],
    default: [],
  },

  categories: {
    type: [String],
    default: [
      "Smartphone",
      "Tablet",
      "Smartwatch",
      "Laptop",
      "Other",
    ],
  },
},
invoices: {
  invoicePrefix: {
    type: String,
    default: "INV-",
    trim: true,
  },

  startingNumber: {
    type: Number,
    default: 1,
    min: 1,
  },

  receiptPrefix: {
    type: String,
    default: "REC-",
    trim: true,
  },

  paymentTerms: {
    type: String,
    default: "Due on receipt",
    trim: true,
  },

  footer: {
    type: String,
    default: "",
    trim: true,
  },

  notes: {
    type: String,
    default: "",
    trim: true,
  },

  showVatNumber: {
    type: Boolean,
    default: false,
  },

  showRegistrationNumber: {
    type: Boolean,
    default: false,
  },
},
expenses: {
  expensePrefix: {
    type: String,
    default: "EXP-",
    trim: true,
  },

  startingNumber: {
    type: Number,
    default: 1,
    min: 1,
  },

  paymentMethod: {
    type: String,
    default: "Cash",
    enum: ["Cash", "Card", "Bank Transfer", "Other"],
  },

  defaultVatRate: {
    type: Number,
    default: 0,
    min: 0,
  },

  categories: {
    type: [String],
    default: [
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

  requireReceipt: {
    type: Boolean,
    default: false,
  },
},
paymentMethods: {
  enabled: {
    type: [String],
    default: [
      "Cash",
      "Card",
      "Bank Transfer",
      "Other",
    ],
  },
},
whatsapp: {
  templates: {
    type: [
      {
        key: {
          type: String,
          required: true,
          trim: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        status: {
          type: String,
          default: "",
          trim: true,
        },

        message: {
          type: String,
          default: "",
          trim: true,
        },

        active: {
          type: Boolean,
          default: false,
        },
      },
    ],

    default: [
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
    ],
  },
},
appearance: {
  theme: {
    type: String,
    enum: ["Light", "Dark"],
    default: "Light",
  },

  tableDensity: {
    type: String,
    enum: ["Comfortable", "Compact"],
    default: "Comfortable",
  },

  accentColor: {
    type: String,
    default: "Blue",
    trim: true,
  },

  sidebarCollapsed: {
    type: Boolean,
    default: false,
  },

  dashboardCards: {
    receivedToday: {
      type: Boolean,
      default: true,
    },

    inProgress: {
      type: Boolean,
      default: true,
    },

    waitingForParts: {
      type: Boolean,
      default: true,
    },

    awaitingApproval: {
      type: Boolean,
      default: true,
    },

    readyForCollection: {
      type: Boolean,
      default: true,
    },

    deliveredToday: {
      type: Boolean,
      default: true,
    },

    outstandingBalances: {
      type: Boolean,
      default: true,
    },

    todaysSales: {
      type: Boolean,
      default: true,
    },

    todaysExpenses: {
      type: Boolean,
      default: true,
    },

    estimatedDailyProfit: {
      type: Boolean,
      default: true,
    },

    lowStockItems: {
      type: Boolean,
      default: true,
    },

    overdueRepairs: {
      type: Boolean,
      default: true,
    },
  },
},
dataPrivacy: {
  customerConsentText: {
    type: String,
    default: "",
    trim: true,
  },

  privacyNotice: {
    type: String,
    default: "",
    trim: true,
  },

  photoRetentionDays: {
    type: Number,
    default: 365,
    min: 0,
  },

  allowOverpayments: {
    type: Boolean,
    default: false,
  },

  activityLogEnabled: {
    type: Boolean,
    default: true,
  },
},
  },
  {
    timestamps: true,
  }
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);

export default Settings;