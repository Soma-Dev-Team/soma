'use client';

import { useTranslations } from 'next-intl';
import { StatRing } from './stat-ring';

export function MacroRings({
  consumed,
  targets,
  size = 92,
  showFiber = true,
}: {
  consumed: { protein_g: number; carbs_g: number; fat_g: number; fiber_g: number };
  targets: { protein_g: number; carbs_g: number; fat_g: number; fiber_g?: number };
  size?: number;
  showFiber?: boolean;
}) {
  const t = useTranslations('macros');
  const items = [
    { label: t('protein'), v: consumed.protein_g, target: targets.protein_g },
    { label: t('carbs'), v: consumed.carbs_g, target: targets.carbs_g },
    { label: t('fat'), v: consumed.fat_g, target: targets.fat_g },
  ];
  if (showFiber) items.push({ label: t('fiber'), v: consumed.fiber_g, target: targets.fiber_g ?? 30 });

  const cols = items.length === 4 ? 'grid-cols-4' : 'grid-cols-3';
  return (
    <div className={`grid ${cols} gap-2 sm:gap-4`}>
      {items.map((m) => (
        <StatRing
          key={m.label}
          label={m.label}
          value={Math.round(m.v)}
          target={m.target}
          unit="g"
          size={size}
          weight="thin"
        />
      ))}
    </div>
  );
}
