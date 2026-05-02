'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Food } from '@/lib/db/dexie';
import { Input } from '@/components/ui/input';
import { recentFoods } from '@/lib/db/repo';
import { useEnergyLabel } from '@/lib/hooks';
import { LoadingRow } from './loading-ring';

export function FoodSearch({ onPick }: { onPick: (food: Food) => void }) {
  const t = useTranslations('add_food');
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [recent, setRecent] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const energyLabel = useEnergyLabel();

  useEffect(() => {
    recentFoods().then(setRecent);
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const fetchAll = async () => {
      try {
        const [off, usda] = await Promise.all([
          fetch(`/api/off/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
            .then((r) => r.json())
            .catch(() => ({ foods: [] })),
          fetch(`/api/usda/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
            .then((r) => r.json())
            .catch(() => ({ foods: [] })),
        ]);
        const merged = [...(off.foods ?? []), ...(usda.foods ?? [])];
        setResults(merged);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchAll, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q]);

  const list = q.trim() ? results : recent;
  return (
    <div className="space-y-3">
      <Input
        placeholder={t('search_placeholder')}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      {!q.trim() && recent.length > 0 && (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t('recent')}</p>
      )}
      {loading && <LoadingRow label="Searching…" />}
      {!loading && list.length === 0 && q.trim() && (
        <p className="text-sm text-muted-foreground">{t('no_results')}</p>
      )}
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface overflow-hidden">
        {list.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => onPick(f)}
              className="w-full text-left px-4 py-3 hover:bg-muted/10"
            >
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground num">
                {f.brand ? `${f.brand} · ` : ''}
                {f.calories != null ? `${Math.round(f.calories)} ${energyLabel}` : ''}
                {f.serving_size_g ? ` per ${f.serving_size_g} g` : ' / 100g'}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
