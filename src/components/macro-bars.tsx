'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function MacroBars({
  consumed,
  targets,
}: {
  consumed: { protein_g: number; carbs_g: number; fat_g: number; fiber_g: number };
  targets: { protein_g: number; carbs_g: number; fat_g: number; fiber_g?: number };
}) {
  const t = useTranslations('macros');
  const rows = [
    { key: 'protein', value: consumed.protein_g, target: targets.protein_g, color: 'bg-emerald-500' },
    { key: 'carbs', value: consumed.carbs_g, target: targets.carbs_g, color: 'bg-amber-500' },
    { key: 'fat', value: consumed.fat_g, target: targets.fat_g, color: 'bg-rose-500' },
    {
      key: 'fiber',
      value: consumed.fiber_g,
      target: targets.fiber_g ?? 30,
      color: 'bg-sky-500',
    },
  ] as const;
  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const pct = r.target > 0 ? Math.min(1, r.value / r.target) : 0;
        return (
          <div key={r.key}>
            <div className="flex justify-between items-baseline text-sm mb-1">
              <span className="text-foreground">{t(r.key as any)}</span>
              <span className="text-muted-foreground num">
                {Math.round(r.value)} / {r.target} g
              </span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className={cn('h-full', r.color)} style={{ width: `${pct * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
