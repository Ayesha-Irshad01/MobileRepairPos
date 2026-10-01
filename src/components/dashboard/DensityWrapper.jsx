'use client';
import { useAppearance } from '@/context/AppearanceContext';

/**
 * Wraps dashboard content and applies the .density-compact class
 * to the subtree when Table Density is set to "Compact" in settings.
 */
export default function DensityWrapper({ children }) {
  const { tableDensity } = useAppearance();
  return (
    <div className={tableDensity === 'Compact' ? 'density-compact' : ''}>
      {children}
    </div>
  );
}
