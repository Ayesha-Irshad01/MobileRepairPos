'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { settingsApi } from '@/lib/api/settings';

const DEFAULTS = {
  theme:            'Light',
  accentColor:      'Blue',
  tableDensity:     'Comfortable',
  sidebarCollapsed: false,
};

const STORAGE_KEY = 'app_appearance';

const ACCENT_CLASS = {
  Blue:   '',
  Green:  'accent-green',
  Purple: 'accent-purple',
  Orange: 'accent-orange',
};

const AppearanceContext = createContext({ ...DEFAULTS, refresh: () => {} });

// ── Apply classes to <html> immediately (safe to call anywhere) ───
function applyToDOM({ theme, accentColor }) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (theme === 'Dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  html.classList.remove('accent-green', 'accent-purple', 'accent-orange');
  const cls = ACCENT_CLASS[accentColor];
  if (cls) html.classList.add(cls);
}

// ── Read localStorage and apply synchronously (no flash) ─────────
function readAndApplyCached() {
  try {
    const raw = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const cached = { ...DEFAULTS, ...JSON.parse(raw) };
      applyToDOM(cached);          // apply right now, before first paint
      return cached;
    }
  } catch { /* ignore */ }
  return DEFAULTS;
}

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(readAndApplyCached);

  // Keep DOM in sync with state (covers API-fetched updates)
  useEffect(() => {
    applyToDOM(appearance);
  }, [appearance]);

  const refresh = useCallback(async () => {
    try {
      const settings = await settingsApi.get();
      const a = settings?.appearance;
      if (!a) return;
      const next = {
        theme:            a.theme            ?? DEFAULTS.theme,
        accentColor:      a.accentColor      ?? DEFAULTS.accentColor,
        tableDensity:     a.tableDensity     ?? DEFAULTS.tableDensity,
        sidebarCollapsed: a.sidebarCollapsed ?? DEFAULTS.sidebarCollapsed,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setAppearance(next);
    } catch (err) {
      console.warn('AppearanceContext: could not fetch settings', err);
    }
  }, []);

  // Fetch from DB on first mount to pick up any server-side changes
  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AppearanceContext.Provider value={{ ...appearance, refresh }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}
