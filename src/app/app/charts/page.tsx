'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { getDB } from '@/lib/db/dexie';
import { getProfile, listMealsBetween } from '@/lib/db/repo';
import { format, startOfDay, subDays } from 'date-fns';
import { StatRing } from '@/components/stat-ring';
import { useEnergyLabel } from '@/lib/hooks';

export default function ChartsPage() {
  const profile = useLiveQuery(() => getProfile(), []);
  const energyLabel = useEnergyLabel();
  const recent = useLiveQuery(async () => {
    const end = new Date();
    const start = subDays(startOfDay(end), 13);
    return listMealsBetween(start, end);
  }, []);
  const foods = useLiveQuery(async () => {
    const all = await getDB().foods.toArray();
    return new Map(all.map((f) => [f.id, f]));
  }, [recent]);

  const dailySeries = useMemo(() => {
    const days: { day: string; kcal: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = subDays(startOfDay(new Date()), i);
      days.push({ day: format(d, 'MMM d'), kcal: 0 });
    }
    if (!recent || !foods) return days;
    for (const m of recent) {
      const f = foods.get(m.food_id);
      if (!f) continue;
      const factor = m.grams != null && f.serving_size_g ? m.grams / f.serving_size_g : m.servings;
      const kcal = (f.calories ?? 0) * factor;
      const key = format(startOfDay(new Date(m.logged_at)), 'MMM d');
      const slot = days.find((x) => x.day === key);
      if (slot) slot.kcal += kcal;
    }
    return days.map((d) => ({ ...d, kcal: Math.round(d.kcal) }));
  }, [recent, foods]);

  const macroSplit = useMemo(() => {
    const out = { proteinKcal: 0, carbsKcal: 0, fatKcal: 0 };
    if (!recent || !foods) return { ...out, total: 0 };
    for (const m of recent) {
      const f = foods.get(m.food_id);
      if (!f) continue;
      const factor = m.grams != null && f.serving_size_g ? m.grams / f.serving_size_g : m.servings;
      out.proteinKcal += (f.protein_g ?? 0) * factor * 4;
      out.carbsKcal += (f.carbs_g ?? 0) * factor * 4;
      out.fatKcal += (f.fat_g ?? 0) * factor * 9;
    }
    const total = out.proteinKcal + out.carbsKcal + out.fatKcal;
    return { ...out, total };
  }, [recent, foods]);

  const weeklyAvg = useMemo(() => {
    const last7 = dailySeries.slice(-7).map((d) => d.kcal).filter((v) => v > 0);
    if (last7.length === 0) return 0;
    return Math.round(last7.reduce((a, b) => a + b, 0) / last7.length);
  }, [dailySeries]);

  const target = profile?.target_calories ?? 2000;
  const isGain = profile?.goal === 'gain';

  // Adherence: how many of the last 7 days were within ±10% of target
  const adherence = useMemo(() => {
    const last7 = dailySeries.slice(-7);
    const tol = target * 0.1;
    const onTarget = last7.filter((d) => d.kcal > 0 && Math.abs(d.kcal - target) <= tol).length;
    return { onTarget, days: 7 };
  }, [dailySeries, target]);

  const proteinPctOfTotal = macroSplit.total > 0 ? Math.round((macroSplit.proteinKcal / macroSplit.total) * 100) : 0;
  const carbsPctOfTotal = macroSplit.total > 0 ? Math.round((macroSplit.carbsKcal / macroSplit.total) * 100) : 0;
  const fatPctOfTotal = macroSplit.total > 0 ? Math.round((macroSplit.fatKcal / macroSplit.total) * 100) : 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl wordmark">trends</h1>

      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="grid grid-cols-2 gap-3 place-items-center">
            <StatRing
              label="7-day average"
              value={weeklyAvg}
              unit={energyLabel}
              target={target}
              sub={`of ${target.toLocaleString()}`}
              size={130}
            />
            <StatRing
              label="On target"
              value={adherence.onTarget}
              target={adherence.days}
              sub={`/ ${adherence.days} days`}
              size={130}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-semibold">Calories vs target</h2>
            <span className="label-mono text-muted-foreground">14 DAYS</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={dailySeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <ReferenceLine y={target} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
                <Bar dataKey="kcal" radius={[4, 4, 0, 0]}>
                  {dailySeries.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.kcal > target && !isGain
                          ? 'hsl(var(--destructive))'
                          : 'hsl(var(--foreground))'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-semibold">Macro split</h2>
            <span className="label-mono text-muted-foreground">14 DAYS · KCAL %</span>
          </div>
          <div className="grid grid-cols-3 gap-3 place-items-center">
            <StatRing label="Protein" value={proteinPctOfTotal} unit="%" target={100} sub="%" size={104} />
            <StatRing label="Carbs" value={carbsPctOfTotal} unit="%" target={100} sub="%" size={104} />
            <StatRing label="Fat" value={fatPctOfTotal} unit="%" target={100} sub="%" size={104} />
          </div>
          <p className="label-mono text-muted-foreground text-center mt-4 num">
            {Math.round(macroSplit.total).toLocaleString()} {energyLabel.toUpperCase()} TOTAL
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
