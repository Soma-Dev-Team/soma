'use client';

import { GraphiteRing } from './soma-mark';
import { cn } from '@/lib/utils';

export interface StatRingProps {
  /** What this stat is — "Protein", "TDEE" etc. */
  label: string;
  /** Primary value to render at center (e.g. 84, 1850). */
  value: number | string;
  /** Optional unit shown beside the value ("g", "kcal"). */
  unit?: string;
  /**
   * Target the value is striving for. Triggers progress mode (ring fills 0..value/target).
   * Omit for static/decorative rings — those render at 100% as a framing badge.
   */
  target?: number;
  /** Extra context line under the ring (e.g. "of 150 g"). */
  sub?: string;
  /** Override the colors used for over-target visualization. */
  overshoot?: boolean;
  size?: number;
  weight?: 'thin' | 'regular' | 'heavy';
  className?: string;
}

export function StatRing({
  label,
  value,
  unit,
  target,
  sub,
  overshoot,
  size = 96,
  weight = 'regular',
  className,
}: StatRingProps) {
  const isProgress = typeof target === 'number' && target > 0 && typeof value === 'number';
  const numericValue = typeof value === 'number' ? value : NaN;
  const pct = isProgress ? Math.min(1, numericValue / target!) : 1;
  const isOver = overshoot ?? (isProgress ? numericValue > target! : false);

  const valueDisplay =
    typeof value === 'number'
      ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
      : value;

  const subDisplay =
    sub ??
    (isProgress
      ? `of ${target!.toLocaleString()}${unit ? ` ${unit}` : ''}`
      : unit ?? '');

  const fontSize = Math.round(size * 0.22);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <GraphiteRing
          size={size}
          pct={pct}
          weight={weight}
          fromC={isOver ? 'hsl(var(--destructive))' : undefined}
          toC={isOver ? 'hsl(var(--destructive))' : undefined}
          ariaLabel={`${label}: ${valueDisplay}${unit ? ` ${unit}` : ''}${
            isProgress ? ` of ${target}` : ''
          }`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
          <span className="wordmark num leading-none" style={{ fontSize }}>
            {valueDisplay}
          </span>
          {subDisplay && (
            <span
              className="num text-muted-foreground mt-1"
              style={{ fontSize: Math.max(9, Math.round(size * 0.085)) }}
            >
              {subDisplay}
            </span>
          )}
        </div>
      </div>
      <span className="label-mono text-muted-foreground">{label}</span>
    </div>
  );
}
