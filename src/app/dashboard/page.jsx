"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { settingsApi } from "@/lib/api/settings";
import { formatCurrency, formatDate } from "@/lib/formatters";

// ── Status pipeline config ────────────────────────────────────────
const PIPELINE = [
  { key: "received",           label: "Received",             color: "blue"   },
  { key: "diagnosing",         label: "Diagnosing",           color: "violet" },
  { key: "awaitingApproval",   label: "Awaiting Approval",    color: "amber"  },
  { key: "approved",           label: "Approved",             color: "indigo" },
  { key: "waitingForParts",    label: "Waiting for Parts",    color: "orange" },
  { key: "repairing",          label: "Repairing",            color: "cyan"   },
  { key: "testing",            label: "Testing",              color: "teal"   },
  { key: "readyForCollection", label: "Ready for Collection", color: "green"  },
];

const PIPE_STYLES = {
  blue:   { pill: "bg-blue-500/10 text-blue-400 ring-blue-500/20",   dot: "bg-blue-500",   num: "text-blue-300"   },
  violet: { pill: "bg-violet-500/10 text-violet-400 ring-violet-500/20", dot: "bg-violet-500", num: "text-violet-300" },
  amber:  { pill: "bg-amber-500/10 text-amber-400 ring-amber-500/20",  dot: "bg-amber-500",  num: "text-amber-300"  },
  indigo: { pill: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20", dot: "bg-indigo-500", num: "text-indigo-300" },
  orange: { pill: "bg-orange-500/10 text-orange-400 ring-orange-500/20", dot: "bg-orange-500", num: "text-orange-300" },
  cyan:   { pill: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",    dot: "bg-cyan-500",   num: "text-cyan-300"   },
  teal:   { pill: "bg-teal-500/10 text-teal-400 ring-teal-500/20",    dot: "bg-teal-500",   num: "text-teal-300"   },
  green:  { pill: "bg-green-500/10 text-green-400 ring-green-500/20",  dot: "bg-green-500",  num: "text-green-300"  },
};

// ── KPI card accent config ────────────────────────────────────────
const KPI_STYLES = {
  blue:   { card: "border-blue-500/20",   icon: "bg-blue-500/10 text-blue-400",   val: "text-blue-50"   },
  indigo: { card: "border-indigo-500/20", icon: "bg-indigo-500/10 text-indigo-400", val: "text-indigo-50" },
  green:  { card: "border-green-500/20",  icon: "bg-green-500/10 text-green-400",  val: "text-green-50"  },
  orange: { card: "border-orange-500/20", icon: "bg-orange-500/10 text-orange-400", val: "text-orange-50" },
  teal:   { card: "border-teal-500/20",   icon: "bg-teal-500/10 text-teal-400",    val: "text-teal-50"   },
  cyan:   { card: "border-cyan-500/20",   icon: "bg-cyan-500/10 text-cyan-400",    val: "text-cyan-50"   },
  rose:   { card: "border-rose-500/20",   icon: "bg-rose-500/10 text-rose-400",    val: "text-rose-50"   },
  purple: { card: "border-purple-500/20", icon: "bg-purple-500/10 text-purple-400", val: "text-purple-50" },
};

// ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [settings,  setSettings]  = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const [dashRes, settingsData] = await Promise.all([
          fetch("/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          settingsApi.get().catch(() => null),
        ]);
        const data = await dashRes.json();
        if (!dashRes.ok) throw new Error(data.error || "Failed to load dashboard");
        setDashboard(data);
        setSettings(settingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <main className="p-6 space-y-6 bg-gray-50 min-h-full">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-52 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-4 w-72 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-5 animate-pulse h-32" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 bg-gray-50 min-h-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      </main>
    );
  }

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const shopName = settings?.business?.shopName || "your shop";

  return (
    <main className="p-6 space-y-6 bg-gray-50/60 min-h-full">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {greeting} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
            Here&apos;s what&apos;s happening at&nbsp;
            <span className="font-medium text-gray-700 dark:text-white/60">{shopName}</span> today.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/repairs/new")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Repair
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <section>
        {/* Row 1: Operational metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <KPICard
            title="Received Today"
            value={dashboard.metrics.receivedToday}
            subtitle="New devices checked in"
            color="blue"
            icon={<BoxIcon />}
          />
          <KPICard
            title="Active Repairs"
            value={dashboard.metrics.activeRepairs}
            subtitle="Currently being worked on"
            color="indigo"
            icon={<WrenchIcon />}
          />
          <KPICard
            title="Ready for Collection"
            value={dashboard.metrics.readyForCollection}
            subtitle="Waiting for customer pickup"
            color="green"
            icon={<CheckIcon />}
          />
          <KPICard
            title="Outstanding Balance"
            value={formatCurrency(dashboard.metrics.outstandingBalance, settings)}
            subtitle="Unpaid invoices"
            color="orange"
            icon={<ClockIcon />}
          />
        </div>

        {/* Row 2: Financial metrics — slightly muted style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Today's Sales"
            value={formatCurrency(dashboard.financial.todaysSales, settings)}
            subtitle="Revenue generated today"
            color="teal"
            icon={<TrendingIcon />}
            muted
          />
          <KPICard
            title="Cash In Today"
            value={formatCurrency(dashboard.financial.cashInToday, settings)}
            subtitle="Payments received today"
            color="cyan"
            icon={<CashIcon />}
            muted
          />
          <KPICard
            title="Today's Expenses"
            value={formatCurrency(dashboard.financial.todaysExpenses, settings)}
            subtitle="Costs recorded today"
            color="rose"
            icon={<MinusIcon />}
            muted
          />
          <KPICard
            title="Est. Daily Profit"
            value={formatCurrency(dashboard.financial.estimatedDailyProfit, settings)}
            subtitle="Sales minus expenses"
            color="purple"
            icon={<StarIcon />}
            muted
          />
        </div>
      </section>

      {/* ── Active Pipeline ─────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white/90 tracking-tight">Active Pipeline</h2>
            <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Live repair count by stage — click any to view</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/repairs")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            View all repairs →
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PIPELINE.map(({ key, label, color }) => {
            const s     = PIPE_STYLES[color];
            const count = dashboard.pipeline[key] ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => router.push(`/dashboard/repairs?status=${encodeURIComponent(label)}`)}
                className={`
                  group flex flex-col items-start gap-2.5 p-3 rounded-xl
                  ring-1 ${s.pill} hover:ring-2 hover:scale-[1.02]
                  active:scale-[0.98] transition-all duration-150 text-left w-full
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <p className={`text-2xl font-black tracking-tight ${s.num} leading-none`}>{count}</p>
                <p className="text-[10px] font-semibold leading-tight text-gray-500 dark:text-white/40 group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors">
                  {label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Alerts + Low Stock ──────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Alerts */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white/90 tracking-tight">Alerts</h2>
            <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Items that need your attention</p>
          </div>
          <div className="p-4 space-y-2.5">
            {/* Overdue invoices */}
            <AlertRow
              onClick={() => router.push("/dashboard/invoices")}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              }
              iconClass="bg-amber-100 text-amber-600"
              borderClass="border-amber-200 bg-gradient-to-r from-amber-50 to-white"
              label="Overdue Invoices"
              sub="Require immediate attention"
              count={dashboard.alerts.overdueInvoices}
              countClass="text-amber-700"
            />
            {/* Low stock */}
            <AlertRow
              onClick={() => router.push("/dashboard/inventory")}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              }
              iconClass="bg-red-100 text-red-600"
              borderClass="border-red-200 bg-gradient-to-r from-red-50 to-white"
              label="Low Stock Items"
              sub="Parts running low"
              count={dashboard.alerts.lowStock}
              countClass="text-red-700"
            />
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white/90 tracking-tight">Low Stock Items</h2>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Parts that need restocking</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/inventory")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              View all →
            </button>
          </div>

          {dashboard.lowStockItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">All items well-stocked</p>
                <p className="text-xs text-gray-400 mt-0.5">No low-stock items at this time.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
              {dashboard.lowStockItems.slice(0, 5).map((item) => (
                <div key={item._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white/80 truncate">{item.item}</p>
                      <p className="text-xs text-gray-400 dark:text-white/30">{item.sku || "No SKU"}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <span className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                      {item.qty} left
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">min {item.minQty}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* ── Recent Activity ─────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white/90 tracking-tight">Recent Activity</h2>
            <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Latest activity across your repair shop</p>
          </div>
        </div>

        {dashboard.recentActivity.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-400">No recent activity yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
            {dashboard.recentActivity.map((activity, i) => {
              const typeStyles = {
                payment: { bg: "bg-green-100",  icon: "text-green-600",  svg: <PaymentSVG /> },
                repair:  { bg: "bg-blue-100",   icon: "text-blue-600",   svg: <RepairSVG  /> },
                invoice: { bg: "bg-purple-100", icon: "text-purple-600", svg: <InvoiceSVG /> },
              };
              const t = typeStyles[activity.type] || { bg: "bg-gray-100", icon: "text-gray-600", svg: <InvoiceSVG /> };
              return (
                <div
                  key={`${activity.type}-${activity.date}-${i}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl ${t.bg} ${t.icon} flex items-center justify-center flex-shrink-0`}>
                    {t.svg}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white/80 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-400 dark:text-white/30 truncate mt-0.5">{activity.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {activity.amount !== null && (
                      <p className="text-sm font-bold text-gray-900 dark:text-white/80">
                        {formatCurrency(activity.amount, settings)}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">
                      {formatDate(activity.date, settings)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function KPICard({ title, value, subtitle, color, icon, muted = false }) {
  const s = KPI_STYLES[color] || KPI_STYLES.blue;
  return (
    <div className={`
      relative bg-white dark:bg-[#161b22] rounded-2xl border ${s.card} p-5
      hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
      overflow-hidden
    `}>
      {/* subtle background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.07]
        ${color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' :
          color === 'green' ? 'bg-green-500' : color === 'orange' ? 'bg-orange-500' :
          color === 'teal' ? 'bg-teal-500' : color === 'cyan' ? 'bg-cyan-500' :
          color === 'rose' ? 'bg-rose-500' : 'bg-purple-500'}
        blur-2xl
      `} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className={`text-2xl font-black mt-2 tracking-tight truncate ${muted ? 'text-gray-800 dark:text-white/70' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-1 truncate">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${s.icon} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function AlertRow({ onClick, icon, iconClass, borderClass, label, sub, count, countClass }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3.5 rounded-xl border ${borderClass} cursor-pointer hover:shadow-sm transition-all duration-150 group`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</p>
          <p className="text-xs text-gray-400 dark:text-white/30">{sub}</p>
        </div>
      </div>
      <span className={`text-2xl font-black ${countClass}`}>{count}</span>
    </div>
  );
}

// ── Inline SVG icons (keep bundle tiny) ──────────────────────────
function BoxIcon()      { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>; }
function WrenchIcon()   { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function CheckIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ClockIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function TrendingIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>; }
function CashIcon()     { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>; }
function MinusIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function StarIcon()     { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>; }

function PaymentSVG() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function RepairSVG()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function InvoiceSVG() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
