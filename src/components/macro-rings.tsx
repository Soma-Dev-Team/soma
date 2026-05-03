'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
  const reduce = useReducedMotion();

  const items = [
    { label: t('protein'), v: consumed.protein_g, target: targets.protein_g },
    { label: t('carbs'), v: consumed.carbs_g, target: targets.carbs_g },
    { label: t('fat'), v: consumed.fat_g, target: targets.fat_g },
  ];
  if (showFiber) items.push({ label: t('fiber'), v: consumed.fiber_g, target: targets.fiber_g ?? 30 });

  // 4 macros: 2×2 on mobile, 1×4 on sm+. Avoids 4-ring horizontal overflow on
  // narrow screens (320–360px viewports).
  const cols = items.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`grid ${cols} gap-3 sm:gap-4 place-items-center`}
    >
      {items.map((m) => (
        <motion.div key={m.label} variants={item}>
          <StatRing
            label={m.label}
            value={Math.round(m.v)}
            target={m.target}
            unit="g"
            size={size}
            weight="thin"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
