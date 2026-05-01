'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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

export default function ChartsPage() {
  const profile = useLiveQuery(() => getProfile(), []);
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

  const macroPie = useMemo(() => {
    const out = [
      { name: 'Protein', value: 0, color: 'hsl(var(--soma-ink))' },
      { name: 'Carbs', value: 0, color: 'oklch(0.62 0.04 240)' },
      { name: 'Fat', value: 0, color: 'oklch(0.42 0.05 240)' },
    ];
    if (!recent || !foods) return out;
    for (const m of recent) {
      const f = foods.get(m.food_id);
      if (!f) continue;
      const factor = m.grams != null && f.serving_size_g ? m.grams / f.serving_size_g : m.servings;
      out[0].value += (f.protein_g ?? 0) * factor * 4;
      out[1].value += (f.carbs_g ?? 0) * factor * 4;
      out[2].value += (f.fat_g ?? 0) * factor * 9;
    }
    return out.map((s) => ({ ...s, value: Math.round(s.value) }));
  }, [recent, foods]);

  const weeklyAvg = useMemo(() => {
    const last7 = dailySeries.slice(-7).map((d) => d.kcal).filter((v) => v > 0);
    if (last7.length === 0) return 0;
    return Math.round(last7.reduce((a, b) => a + b, 0) / last7.length);
  }, [dailySeries]);

  const target = profile?.target_calories ?? 2000;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl wordmark">trends</h1>

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
                    <Cell key={i} fill={d.kcal > target ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="label-mono text-muted-foreground mt-3 num">
            7-DAY AVERAGE · {weeklyAvg.toLocaleString()} KCAL
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <h2 className="font-semibold mb-2">Macro split (kcal, 14 days)</h2>
          <div className="h-56 flex items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={macroPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {macroPie.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-2 text-xs">
            {macroPie.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                <span>
                  {s.name} <span className="num text-muted-foreground">{s.value}</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
