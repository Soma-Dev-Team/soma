'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DARK_PALETTES, LIGHT_PALETTES } from './theme-provider';

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;
type Mode = keyof typeof ICONS;

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-[88px] rounded-full bg-muted/30" aria-hidden />;
  }

  const isLight = theme && LIGHT_PALETTES.includes(theme as any);
  const isDark = theme && DARK_PALETTES.includes(theme as any);
  const current: Mode = theme === 'system' ? 'system' : isLight ? 'light' : isDark ? 'dark' : 'system';

  function pickLight() {
    const last = typeof window !== 'undefined' && localStorage.getItem('soma:lastLight');
    setTheme(last && LIGHT_PALETTES.includes(last as any) ? last : 'light');
  }
  function pickDark() {
    const last = typeof window !== 'undefined' && localStorage.getItem('soma:lastDark');
    setTheme(last && DARK_PALETTES.includes(last as any) ? last : 'dark');
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5">
      {(['light', 'system', 'dark'] as Mode[]).map((m) => {
        const Icon = ICONS[m];
        const active = current === m;
        const onClick =
          m === 'system' ? () => setTheme('system') : m === 'light' ? pickLight : pickDark;
        return (
          <button
            key={m}
            onClick={onClick}
            aria-label={`${m} theme`}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center justify-center rounded-full h-7 w-7 transition-colors',
              active ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
