'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { cn } from '@/lib/utils';

type RingWeight = 'thin' | 'regular' | 'heavy';

function ringDimsFor(size: number, weight: RingWeight) {
  const swPct = weight === 'thin' ? 0.075 : weight === 'heavy' ? 0.155 : 0.118;
  const sw = Math.max(2, Math.round(size * swPct));
  const r = Math.round(size / 2 - sw / 2 - size * 0.018);
  return { sw, r };
}

export interface GraphiteRingProps {
  size?: number;
  pct?: number;
  weight?: RingWeight;
  fromC?: string;
  toC?: string;
  trackC?: string;
  /** When true, animates the dash from 0 to target on mount + on pct change. */
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function GraphiteRing({
  size = 220,
  pct = 0.72,
  weight = 'regular',
  fromC = 'var(--ring-from, var(--soma-slate-deep))',
  toC = 'var(--ring-to, hsl(var(--soma-ink)))',
  trackC = 'var(--ring-track, hsl(var(--soma-ink) / 0.08))',
  animate = true,
  className,
  ariaLabel,
}: GraphiteRingProps) {
  const reduce = useReducedMotion();
  const gid = useId();
  const { sw, r } = ringDimsFor(size, weight);
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const dash = `${C * Math.max(0, Math.min(1, pct))} ${C}`;
  const shouldAnimate = animate && !reduce;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fromC} />
          <stop offset="100%" stopColor={toC} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackC} strokeWidth={sw} />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth={sw}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        initial={shouldAnimate ? { strokeDasharray: `0 ${C}` } : false}
        animate={{ strokeDasharray: dash }}
        transition={{ duration: shouldAnimate ? 1.0 : 0, ease: [0.16, 1, 0.3, 1], delay: shouldAnimate ? 0.08 : 0 }}
      />
    </svg>
  );
}

export function SomaMark({
  size = 32,
  showWordmark = true,
  pct = 0.75,
  className,
}: {
  size?: number;
  showWordmark?: boolean;
  pct?: number;
  className?: string;
}) {
  const wordSize = Math.round(size * 0.85);
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: Math.max(6, size * 0.18) }}>
      <GraphiteRing size={size} pct={pct} weight="regular" ariaLabel="Soma" animate={false} />
      {showWordmark && (
        <span className="wordmark" style={{ fontSize: wordSize, color: 'hsl(var(--foreground))' }}>
          soma
        </span>
      )}
    </span>
  );
}
