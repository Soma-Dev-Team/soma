'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GraphiteRing } from './soma-mark';
import { cn } from '@/lib/utils';

export function LoadingRing({
  size = 22,
  label = 'Loading',
  className,
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center align-middle', className)}
      style={{ width: size, height: size }}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
    >
      <GraphiteRing size={size} pct={0.3} weight="thin" animate={false} />
    </motion.span>
  );
}

export function LoadingRow({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 text-sm text-muted-foreground">
      <LoadingRing size={18} label={label} />
      {label && <span>{label}</span>}
    </div>
  );
}
