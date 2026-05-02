'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { deleteWeight, getProfile, listWeights, logWeight } from '@/lib/db/repo';
import { kgToLbs, lbsToKg } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { StatRing } from '@/components/stat-ring';

type Range = '7' | '30' | 'all';

export default function WeightPage() {
  const t = useTranslations('weight');
  const profile = useLiveQuery(() => getProfile(), []);
  const weights = useLiveQuery(() => listWeights(), []);
  const isImperial = profile?.units === 'imperial';
  const [input, setInput] = useState('');
  const [range, setRange] = useState<Range>('30');

  const summary = useMemo(() => {
    if (!weights || weights.length === 0) return null;
    const sorted = [...weights].sort(
      (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime(),
    );
    const latest = sorted[sorted.length - 1];
    const sevenAgo = subDays(new Date(), 7).getTime();
    const last7 = sorted.filter((w) => new Date(w.logged_at).getTime() >= sevenAgo);
    const avg7 =
      last7.length > 0 ? last7.reduce((s, w) => s + w.weight_kg, 0) / last7.length : latest.weight_kg;
    const earliest = sorted[0];
    const totalDelta = latest.weight_kg - earliest.weight_kg;
    return {
      latestKg: latest.weight_kg,
      avg7Kg: avg7,
      totalDeltaKg: totalDelta,
      count: sorted.length,
    };
  }, [weights]);

  const chartData = useMemo(() => {
    if (!weights) return [];
    const sorted = [...weights].sort(
      (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime(),
    );
    const cutoff =
      range === 'all'
        ? 0
        : Date.now() - (range === '7' ? 7 : 30) * 24 * 60 * 60 * 1000;
    return sorted
      .filter((w) => new Date(w.logged_at).getTime() >= cutoff)
      .map((w) => ({
        date: format(new Date(w.logged_at), 'MMM d'),
        value: isImperial ? +kgToLbs(w.weight_kg).toFixed(1) : +w.weight_kg.toFixed(1),
      }));
  }, [weights, range, isImperial]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(input);
    if (!n || n <= 0) return;
    const kg = isImperial ? lbsToKg(n) : n;
    await logWeight(kg);
    setInput('');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl wordmark">{t('title').toLowerCase()}</h1>

      {summary && (
        <Card>
          <CardContent className="pt-6 pb-5">
            <div className="grid grid-cols-3 gap-2 place-items-center">
              <StatRing
                label="Latest"
                value={isImperial ? +kgToLbs(summary.latestKg).toFixed(1) : +summary.latestKg.toFixed(1)}
                sub={isImperial ? 'lb' : 'kg'}
                size={104}
              />
              <StatRing
                label="7-day avg"
                value={isImperial ? +kgToLbs(summary.avg7Kg).toFixed(1) : +summary.avg7Kg.toFixed(1)}
                sub={isImperial ? 'lb' : 'kg'}
                size={104}
              />
              <StatRing
                label="Since start"
                value={
                  (summary.totalDeltaKg > 0 ? '+' : '') +
                  (isImperial
                    ? kgToLbs(summary.totalDeltaKg).toFixed(1)
                    : summary.totalDeltaKg.toFixed(1))
                }
                sub={isImperial ? 'lb' : 'kg'}
                size={104}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={add} className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder={isImperial ? 'Weight (lb)' : 'Weight (kg)'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit">{t('log')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <div className="flex gap-1 mb-4">
            {(['7', '30', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`label-mono px-3 py-1.5 rounded-md transition-colors ${
                  range === r
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`trend_${r === 'all' ? 'all' : r === '7' ? '7' : '30'}` as any)}
              </button>
            ))}
          </div>
          <div className="h-56">
            {chartData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'hsl(var(--foreground))' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">
                Log a weight to see your trend.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {weights && weights.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {[...weights]
                .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
                .slice(0, 20)
                .map((w) => (
                  <li key={w.id} className="flex items-center justify-between px-5 py-3">
                    <div className="text-sm">
                      <div className="num">
                        {isImperial
                          ? `${kgToLbs(w.weight_kg).toFixed(1)} lb`
                          : `${w.weight_kg.toFixed(1)} kg`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(w.logged_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => deleteWeight(w.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
