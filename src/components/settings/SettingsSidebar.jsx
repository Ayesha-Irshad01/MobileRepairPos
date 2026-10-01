'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsSections = [
  { name: "Business Profile",   href: "/dashboard/settings/business" },
  { name: "Regional",           href: "/dashboard/settings/regional" },
  { name: "Tax",                href: "/dashboard/settings/tax" },
  { name: "Repairs",            href: "/dashboard/settings/repairs" },
  { name: "Devices",            href: "/dashboard/settings/devices" },
  { name: "Invoices",           href: "/dashboard/settings/invoices" },
  { name: "Expenses",           href: "/dashboard/settings/expenses" },
  { name: "Payment Methods",    href: "/dashboard/settings/payment-methods" },
  { name: "WhatsApp Templates", href: "/dashboard/settings/whatsapp" },
  { name: "Staff",              href: "/dashboard/settings/staff" },
  { name: "Appearance",         href: "/dashboard/settings/appearance" },
  { name: "Data & Privacy",     href: "/dashboard/settings/data-privacy" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white/60 p-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:border-white/[0.06] dark:bg-[#161b22]/60 dark:scrollbar-thumb-white/[0.15]">
      <p className="mb-3 px-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-white/30">
        Settings
      </p>
      <nav className="space-y-0.5">
        {settingsSections.map((section) => {
          const active =
            pathname === section.href ||
            pathname.startsWith(section.href + "/");
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/[0.05] dark:hover:text-white/90"
              }`}
            >
              {section.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
