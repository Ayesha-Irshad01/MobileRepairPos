import { connectDB } from "@/lib/mongodb";
import Repair from "@/models/Repair";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import Inventory from "@/models/Inventory";
import Expense from "@/models/Expense";
import Customer from "@/models/Customer";

export async function getDashboardStats() {
  await connectDB();

  const now = new Date();

  // Start of today
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // End of today
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // Start of current month
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );
  const todayExpenses = await Expense.aggregate([
  {
    $match: {
      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$total",
      },
    },
  },
]);

const todaysExpenses = todayExpenses[0]?.total || 0;

  // --------------------------------------------------
  // REPAIRS
  // --------------------------------------------------

  const [
  activeRepairs,
  readyForCollection,
  receivedToday,
  receivedCount,
  diagnosingCount,
  awaitingApprovalCount,
  approvedCount,
  waitingForPartsCount,
  repairingCount,
  testingCount,
  deliveredToday,
  deliveredThisMonth
] = await Promise.all([

  Repair.countDocuments({
    status: {
      $nin: [
        "Delivered",
        "Cancelled",
        "Unable to Repair"
      ]
    }
  }),

  Repair.countDocuments({
    status: "Ready for Collection"
  }),

  Repair.countDocuments({
    receivedAt: {
      $gte: startOfToday,
      $lte: endOfToday
    }
  }),

  Repair.countDocuments({
    status: "Received"
  }),

  Repair.countDocuments({
    status: "Diagnosing"
  }),

  Repair.countDocuments({
    status: "Awaiting Approval"
  }),

  Repair.countDocuments({
    status: "Approved"
  }),

  Repair.countDocuments({
    status: "Waiting for Parts"
  }),

  Repair.countDocuments({
    status: "Repairing"
  }),

  Repair.countDocuments({
    status: "Testing"
  }),

  Repair.countDocuments({
    status: "Delivered",
    completedAt: {
      $gte: startOfToday,
      $lte: endOfToday
    }
  }),

  Repair.countDocuments({
    status: "Delivered",
    completedAt: {
      $gte: startOfMonth,
      $lte: endOfToday
    }
  })
]);
  // --------------------------------------------------
  // INVOICES
  // --------------------------------------------------

  const invoices = await Invoice.find(
    {},
    {
      _id: 1,
      total: 1,
      dueDate: 1,
      invoiceNo: 1,
      customer: 1
    }
  )
    .populate("customer", "name");


  // Get all payments related to invoices
  const invoicePayments = await Payment.aggregate([
    {
      $match: {
        relatedInvoice: {
          $ne: null
        }
      }
    },
    {
      $group: {
        _id: "$relatedInvoice",
        paid: {
          $sum: "$amount"
        }
      }
    }
  ]);


  const paymentMap = new Map();

  invoicePayments.forEach((payment) => {
    paymentMap.set(
      payment._id.toString(),
      payment.paid
    );
  });


  let unpaidInvoices = 0;
  let overdueInvoices = 0;
  let outstandingBalance = 0;
  invoices.forEach((invoice) => {

    const paid =
      paymentMap.get(invoice._id.toString()) || 0;

    const outstanding =
      Math.max(invoice.total - paid, 0);

    if (outstanding > 0) {
      unpaidInvoices++;
      outstandingBalance += outstanding;
    }

    if (
      outstanding > 0 &&
      invoice.dueDate &&
      new Date(invoice.dueDate) < now
    ) {
      overdueInvoices++;
    }
  });


  // --------------------------------------------------
  // PAYMENTS / CASH FLOW
  // --------------------------------------------------

  const todayPayments = await Payment.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      }
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount"
        }
      }
    }
  ]);


  const monthlyPayments = await Payment.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: startOfMonth,
          $lte: endOfToday
        }
      }
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount"
        }
      }
    }
  ]);


  const cashInToday =
    todayPayments[0]?.total || 0;

  const cashInThisMonth =
  monthlyPayments[0]?.total || 0;
  //calculating todays sales
  const todaySales = await Invoice.aggregate([
  {
    $match: {
      invoiceDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$total",
      },
    },
  },
]);

const todaysSales =
  todaySales[0]?.total || 0;
  const estimatedDailyProfit =
  todaysSales - todaysExpenses;
// RECENT ACTIVITY
// --------------------------------------------------

const [recentRepairs, recentInvoices, recentPayments, recentExpenses] =
  await Promise.all([
    Repair.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("repairNo status createdAt"),

    Invoice.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("invoiceNo total createdAt"),

    Payment.find({})
      .sort({ paymentDate: -1 })
      .limit(5)
      .select("amount paymentDate paymentMethod"),

    Expense.find({})
      .sort({ date: -1 })
      .limit(5)
      .select("expenseNo total date"),
  ]);

  // --------------------------------------------------
  const recentActivity = [
  ...recentRepairs.map((item) => ({
    type: "repair",
    title: `Repair ${item.repairNo}`,
    description: `Status: ${item.status}`,
    amount: null,
    date: item.createdAt,
  })),

  ...recentInvoices.map((item) => ({
    type: "invoice",
    title: `Invoice ${item.invoiceNo}`,
    description: "Invoice created",
    amount: item.total,
    date: item.createdAt,
  })),

  ...recentPayments.map((item) => ({
    type: "payment",
    title: "Payment received",
    description: `${item.paymentMethod} payment`,
    amount: item.amount,
    date: item.paymentDate,
  })),

  ...recentExpenses.map((item) => ({
    type: "expense",
    title: `Expense ${item.expenseNo}`,
    description: "Expense recorded",
    amount: item.total,
    date: item.date,
  })),
]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 8);

  // --------------------------------------------------
  // INVENTORY
  // --------------------------------------------------

  const lowStockItems = await Inventory.find({
    isActive: true,
    $expr: {
      $lt: ["$qty", "$minQty"]
    }
  }).select("item sku qty minQty");


  // --------------------------------------------------
  // RETURN DASHBOARD DATA
  // --------------------------------------------------

  return {

    metrics: {
  activeRepairs,
  readyForCollection,
  receivedToday,
  approvedCount,
  waitingForPartsCount,
  deliveredToday,
  outstandingBalance,
  overdueRepairs: null,
  unpaidInvoices,
  cashInToday,
},

    pipeline: {
  received: receivedCount,
  diagnosing: diagnosingCount,
  awaitingApproval: awaitingApprovalCount,
  approved: approvedCount,
  waitingForParts: waitingForPartsCount,
  repairing: repairingCount,
  testing: testingCount,
  readyForCollection,
},

    alerts: {
      overdueRepairs: [],
      overdueInvoices,
      lowStock: lowStockItems.length
    },

    financial: {
  todaysSales,
  cashInToday,
  cashInThisMonth,
  todaysExpenses,
  expensesThisMonth: null,
  estimatedDailyProfit,
},

    lowStockItems,
    deliveredThisMonth,
    recentActivity,
  };
}