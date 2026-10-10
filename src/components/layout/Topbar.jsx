'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  repairs:   'Repairs',
  customers: 'Customers',
  devices:   'Devices',
  payments:  'Payments',
  expenses:  'Expenses',
  invoices:  'Invoices',
  inventory: 'Inventory',
  settings:  'Settings',
};

function usePageTitle() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const section  = segments[1] ?? 'dashboard';
  return PAGE_TITLES[section] ?? 'Dashboard';
}

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue,   setSearchValue]   = useState('');
  const inputRef = useRef(null);
  const title    = usePageTitle();

  useEffect(() => {
    function onKeyDown(e) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setSearchValue('');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="
      h-16 flex items-center justify-between px-6 gap-4 flex-shrink-0
      sticky top-0 z-30
      bg-white/80 dark:bg-[#161b22]/90
      backdrop-blur-md
      border-b border-gray-200/70 dark:border-white/[0.06]
      shadow-sm shadow-gray-100/50 dark:shadow-none
    ">

      {/* ── Left: page title ──────────────────────────────────── */}
      <div className="flex-shrink-0 hidden sm:block">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white/70 tracking-tight">
          {title}
        </h2>
      </div>

      {/* ── Centre: search ────────────────────────────────────── */}
      <div className="flex-1 flex justify-center max-w-md mx-auto">
        <div className={`relative w-full transition-all duration-200 ${searchFocused ? 'ring-4 ring-[var(--accent-500)]/10 rounded-xl' : ''}`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-150 ${searchFocused ? 'text-[var(--accent-500)]' : 'text-gray-400 dark:text-white/30'}`} />
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={()  => setSearchFocused(false)}
            placeholder="Search repairs, customers, devices…"
            className="
              w-full pl-9 pr-9 py-2 rounded-xl text-sm transition-all duration-200
              border border-gray-200 dark:border-white/[0.08]
              bg-gray-50/80 dark:bg-white/[0.04]
              text-gray-800 dark:text-white/80
              placeholder-gray-400 dark:placeholder-white/25
              focus:outline-none focus:border-[var(--accent-400)] focus:bg-white dark:focus:bg-white/[0.07]
              hover:border-gray-300 dark:hover:border-white/[0.12]
            "
          />
          {searchValue ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setSearchValue(''); inputRef.current?.focus(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            !searchFocused && (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-[10px] font-medium text-gray-400 dark:text-white/25 pointer-events-none select-none">
                /
              </kbd>
            )
          )}
        </div>
      </div>

      {/* ── Right: actions ────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        <Link
          href="/dashboard/repairs/new"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold text-white bg-[var(--accent-600)] hover:bg-[var(--accent-700)] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[var(--accent-600)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:ring-offset-2 dark:focus:ring-offset-[#161b22]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Ticket</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>
    </header>
  );
}
