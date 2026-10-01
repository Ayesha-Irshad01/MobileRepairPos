'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Smartphone,
  CreditCard,
  FileText,
  Package,
  ReceiptText,
  Settings,
  LogOut,
} from 'lucide-react';
import { settingsApi } from '@/lib/api/settings';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repairs',   href: '/dashboard/repairs',   icon: Wrench },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Devices',   href: '/dashboard/devices',   icon: Smartphone },
  { name: 'Payments',  href: '/dashboard/payments',  icon: CreditCard },
  { name: 'Expenses',  href: '/dashboard/expenses',  icon: ReceiptText },
  { name: 'Invoices',  href: '/dashboard/invoices',  icon: FileText },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Settings',  href: '/dashboard/settings',  icon: Settings },
];

function isActive(href, pathname) {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [shopName,        setShopName]        = useState('');
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    settingsApi.get()
      .then((s) => setShopName(s?.business?.shopName || ''))
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  const displayName = loadingSettings ? '' : (shopName || 'My Repair Shop');

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RS';

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <aside data-main-sidebar className="w-60 flex-shrink-0 h-screen flex flex-col bg-[#0d1117] border-r border-white/[0.06]">
      {/* ── Brand / Logo ─────────────────────────────────────── */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
            <Wrench className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
          </div>
          <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md -z-10" />
        </div>
        <div className="flex flex-col min-w-0">
          {loadingSettings ? (
            <div className="h-3.5 w-24 rounded bg-white/10 animate-pulse" />
          ) : (
            <span className="text-[13px] font-bold text-white leading-tight tracking-tight truncate">
              {displayName}
            </span>
          )}
          <span className="text-[10px] font-semibold tracking-[0.18em] text-blue-400/80 uppercase mt-0.5">
            Repair&nbsp;POS
          </span>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, pathname);
          const Icon   = item.icon;
          if (active) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative bg-blue-600/20 text-white"
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-500" />
                <Icon className="w-4 h-4 flex-shrink-0 text-blue-400" strokeWidth={2.2} />
                {item.name}
              </Link>
            );
          }
          return (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Icon className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.8} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ── User footer ──────────────────────────────────────── */}
      <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group hover:bg-white/[0.05] transition-colors cursor-default">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-md shadow-blue-500/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            {loadingSettings ? (
              <div className="h-2.5 w-20 rounded bg-white/10 animate-pulse" />
            ) : (
              <p className="text-[12px] font-semibold text-white/80 truncate leading-tight">
                {displayName}
              </p>
            )}
            <p className="text-[10px] text-white/25 mt-0.5">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 opacity-0 group-hover:opacity-100 flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}