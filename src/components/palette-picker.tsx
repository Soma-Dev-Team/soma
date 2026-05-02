'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { GraphiteRing } from './soma-mark';
import { cn } from '@/lib/utils';
import { DARK_PALETTES, LIGHT_PALETTES, PALETTES, type Palette } from './theme-provider';

interface Swatch {
  id: Palette;
  name: string;
  /** Resolved background CSS color for the preview tile */
  bg: string;
  /** Foreground color used inside the preview */
  fg: string;
  /** Ring gradient stops for the preview */
  fromC: string;
  toC: string;
  /** Track color for the preview */
  trackC: string;
}

const SWATCHES: Swatch[] = [
  {
    id: 'light',
    name: 'Light',
    bg: '#F4F0EA',
    fg: '#18201C',
    fromC: 'oklch(0.42 0.05 240)',
    toC: '#18201C',
    trackC: 'rgba(24,32,28,0.08)',
  },
  {
    id: 'sand',
    name: 'Sand',
    bg: '#E4DCCD',
    fg: '#18201C',
    fromC: 'oklch(0.42 0.05 240)',
    toC: '#18201C',
    trackC: 'rgba(24,32,28,0.1)',
  },
  {
    id: 'dark',
    name: 'Dark',
    bg: '#171A1F',
    fg: '#F4F0EA',
    fromC: 'oklch(0.62 0.04 240)',
    toC: '#F4F0EA',
    trackC: 'rgba(244,240,234,0.1)',
  },
  {
    id: 'mid',
    name: 'Midnight',
    bg: '#0E1722',
    fg: '#F4F0EA',
    fromC: 'oklch(0.62 0.04 240)',
    toC: '#F4F0EA',
    trackC: 'rgba(244,240,234,0.1)',
  },
  {
    id: 'deep',
    name: 'Deep slate',
    bg: 'oklch(0.42 0.05 240)',
    fg: '#F4F0EA',
    fromC: '#F4F0EA',
    toC: 'oklch(0.62 0.04 240)',
    trackC: 'rgba(244,240,234,0.15)',
  },
  {
    id: 'slate',
    name: 'Slate',
    bg: 'oklch(0.62 0.04 240)',
    fg: '#F4F0EA',
    fromC: '#F4F0EA',
    toC: '#18201C',
    trackC: 'rgba(244,240,234,0.2)',
  },
];

export function PalettePicker() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted ? (theme === 'system' ? resolvedTheme : theme) : null;

  function pick(id: Palette) {
    setTheme(id);
    if (typeof window !== 'undefined') {
      if (LIGHT_PALETTES.includes(id)) localStorage.setItem('soma:lastLight', id);
      if (DARK_PALETTES.includes(id)) localStorage.setItem('soma:lastDark', id);
    }
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {SWATCHES.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => pick(s.id)}
            className={cn(
              'group flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all',
              isActive ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'hover:opacity-100',
            )}
          >
            <span
              className="w-full aspect-square rounded-lg flex items-center justify-center shadow-sm border border-border"
              style={{ background: s.bg }}
            >
              <GraphiteRing
                size={44}
                pct={0.75}
                weight="regular"
                fromC={s.fromC}
                toC={s.toC}
                trackC={s.trackC}
              />
            </span>
            <span className="label-mono text-muted-foreground text-[10px]">{s.name}</span>
          </button>
        );
      })}
    </div>
  );
}
