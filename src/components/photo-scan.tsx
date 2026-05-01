'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { fileToBase64, geminiScan, getStoredGeminiKey, type GeminiFoodItem } from '@/lib/gemini';
import { logMeal, upsertFood } from '@/lib/db/repo';
import { uuid } from '@/lib/utils';
import type { MealLog } from '@/lib/db/dexie';

export function PhotoScan({ defaultMeal, onLogged }: { defaultMeal?: MealLog['meal']; onLogged: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<GeminiFoodItem[] | null>(null);
  const [meal, setMeal] = useState<MealLog['meal']>(defaultMeal ?? 'snack');

  useEffect(() => {
    setApiKey(getStoredGeminiKey());
  }, []);

  async function handleFile(file: File) {
    if (!apiKey) {
      setError('Add your Gemini API key in Settings → AI scan first.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { data, mimeType } = await fileToBase64(file);
      const res = await geminiScan({ apiKey, imageBase64: data, mimeType });
      setItems(res.items);
    } catch (e: any) {
      setError(e.message ?? 'Scan failed');
    } finally {
      setBusy(false);
    }
  }

  async function commit() {
    if (!items) return;
    for (const it of items) {
      const id = uuid();
      await upsertFood({
        id,
        source: 'gemini',
        name: it.name,
        serving_size_g: it.grams,
        calories: it.calories,
        protein_g: it.protein_g,
        carbs_g: it.carbs_g,
        fat_g: it.fat_g,
        fiber_g: it.fiber_g,
        sugar_g: it.sugar_g,
        sodium_mg: it.sodium_mg,
      });
      await logMeal({
        food_id: id,
        meal,
        servings: 1,
        grams: it.grams,
        logged_at: new Date().toISOString(),
      });
    }
    onLogged();
  }

  if (!apiKey) {
    return (
      <div className="space-y-3 rounded-2xl border border-border p-5">
        <p className="text-sm text-muted-foreground">
          AI photo scan uses your own Gemini API key. Add one in{' '}
          <Link href="/app/settings" className="underline">
            Settings → AI scan
          </Link>{' '}
          to continue.
        </p>
      </div>
    );
  }

  if (items) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">Review</h3>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="rounded-lg border border-border p-3">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{it.name}</span>
                <span className="text-xs num text-muted-foreground">
                  {it.grams ?? '?'} g · {Math.round(it.calories ?? 0)} kcal
                </span>
              </div>
              <Input
                className="mt-2"
                value={it.name}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], name: e.target.value };
                  setItems(next);
                }}
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(['grams', 'calories', 'protein_g', 'carbs_g'] as const).map((k) => (
                  <Input
                    key={k}
                    type="number"
                    value={(it as any)[k] ?? 0}
                    onChange={(e) => {
                      const next = [...items];
                      (next[i] as any)[k] = Number(e.target.value);
                      setItems(next);
                    }}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setItems(null)}>
            Rescan
          </Button>
          <Button className="flex-1" onClick={commit}>
            Log {items.length} item{items.length === 1 ? '' : 's'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Meal</Label>
        <select
          value={meal}
          onChange={(e) => setMeal(e.target.value as MealLog['meal'])}
          className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      <label className="block">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          disabled={busy}
        />
        <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted/5">
          {busy ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin" size={20} /> Analyzing…
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera />
              <span className="text-sm">Tap to take or choose a photo</span>
              <span className="text-xs">Image is sent to Gemini once, never persisted.</span>
            </div>
          )}
        </div>
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
