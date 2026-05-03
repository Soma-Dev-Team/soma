'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Scale, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function AppNav() {
  const path = usePathname();
  const t = useTranslations('nav');
  const items = [
    { href: '/app', label: t('today'), icon: Home, exact: true },
    { href: '/app/add-food', label: t('add'), icon: Plus },
    { href: '/app/weight', label: t('weight'), icon: Scale },
    { href: '/app/charts', label: t('charts'), icon: BarChart3 },
    { href: '/app/settings', label: t('settings'), icon: Settings },
  ];
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:sticky md:top-0 md:self-start md:bottom-auto md:inset-x-auto md:border-t-0 md:border-r md:h-screen md:w-56 md:flex-shrink-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex md:flex-col md:p-4 md:gap-1 max-w-md md:max-w-none">
        {items.map((it) => {
          const active = it.exact ? path === it.href : path.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'flex-1 md:flex-none flex md:flex-row flex-col items-center md:items-center gap-1 md:gap-3 px-3 py-3 md:rounded-lg text-xs md:text-sm transition-colors',
                active
                  ? 'text-accent md:bg-muted/10 md:text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon size={20} className={cn(active && 'text-accent')} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
