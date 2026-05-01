'use client';

import { useTranslations } from 'next-intl';
import { GraphiteRing } from './soma-mark';

export function CalorieRing({
  consumed,
  burned = 0,
  goal,
  size = 260,
}: {
  consumed: number;
  burned?: number;
  goal: number;
  size?: number;
}) {
  const t = useTranslations('today');
  const net = Math.max(0, consumed - burned);
  const pct = goal > 0 ? Math.min(1, net / goal) : 0;
  const remaining = Math.max(0, goal - net);
  const overshoot = net > goal;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <GraphiteRing
        size={size}
        pct={pct}
        weight="regular"
        fromC={overshoot ? 'hsl(var(--destructive))' : 'var(--soma-slate-deep)'}
        toC={overshoot ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))'}
        ariaLabel={`${Math.round(net)} of ${goal} kilocalories`}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="label-mono text-muted-foreground">
          {overshoot ? 'Over' : t('remaining')}
        </div>
        <div className="text-5xl wordmark num mt-2 text-foreground">
          {Math.round(overshoot ? net - goal : remaining).toLocaleString()}
        </div>
        <div className="label-mono mt-3 text-muted-foreground num">
          {Math.round(net).toLocaleString()} / {goal.toLocaleString()} kcal
        </div>
      </div>
    </div>
  );
}
