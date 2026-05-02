'use client';

import { useTranslations } from 'next-intl';
import { GraphiteRing } from './soma-mark';

export type GoalMode = 'lose' | 'maintain' | 'gain';

export function CalorieRing({
  consumed,
  burned = 0,
  goal,
  mode = 'maintain',
  unitLabel = 'kcal',
  size = 260,
}: {
  consumed: number;
  burned?: number;
  goal: number;
  mode?: GoalMode;
  unitLabel?: string;
  size?: number;
}) {
  const t = useTranslations('today');
  const net = Math.max(0, consumed - burned);
  const pct = goal > 0 ? Math.min(1, net / goal) : 0;
  const remaining = Math.max(0, goal - net);
  const overshoot = net > goal;

  // In gain mode, exceeding target is the *point* — surface it as neutral, not red.
  const flagRed = overshoot && mode !== 'gain';
  const overLabel = mode === 'gain' ? 'Surplus' : 'Over';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <GraphiteRing
        size={size}
        pct={pct}
        weight="regular"
        fromC={flagRed ? 'hsl(var(--destructive))' : 'var(--soma-slate-deep)'}
        toC={flagRed ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))'}
        ariaLabel={`${Math.round(net)} of ${goal} ${unitLabel}`}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="label-mono text-muted-foreground">
          {overshoot ? overLabel : t('remaining')}
        </div>
        <div className="text-5xl wordmark num mt-2 text-foreground">
          {Math.round(overshoot ? net - goal : remaining).toLocaleString()}
        </div>
        <div className="label-mono mt-3 text-muted-foreground num">
          {Math.round(net).toLocaleString()} / {goal.toLocaleString()} {unitLabel}
        </div>
      </div>
    </div>
  );
}
