'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LoadingRing } from './loading-ring';
import { logMeal, upsertFood } from '@/lib/db/repo';
import { uuid } from '@/lib/utils';
import type { MealLog } from '@/lib/db/dexie';
import { useEnergyLabel } from '@/lib/hooks';
import type { FoodScanItem } from '@/lib/openrouter';

const FIELDS: Array<{ key: keyof FoodScanItem; label: string; unit: string }> = [
  { key: 'grams', label: 'Grams', unit: 'g' },
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'protein_g', label: 'Protein', unit: 'g' },
  { key: 'carbs_g', label: 'Carbs', unit: 'g' },
  { key: 'fat_g', label: 'Fat', unit: 'g' },
  { key: 'fiber_g', label: 'Fiber', unit: 'g' },
];

export function PhotoScan({ defaultMeal, onLogged }: { defaultMeal?: MealLog['meal']; onLogged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<FoodScanItem[] | null>(null);
  const [meal, setMeal] = useState<MealLog['meal']>(defaultMeal ?? 'snack');
  const [context, setContext] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const energyLabel = useEnergyLabel();

  async function runScan(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      if (context.trim()) fd.append('context', context.trim());
      const res = await fetch('/api/scan', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Scan failed (${res.status})`);
      }
      const scan = (await res.json()) as { items: FoodScanItem[]; notes?: string };
      setItems(scan.items ?? []);
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
        source: 'gemini', // legacy enum: AI-generated
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

  if (items) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">Review</h3>
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="rounded-lg border border-border p-3 space-y-2">
              <div className="space-y-1">
                <Label className="label-mono text-muted-foreground">Name</Label>
                <Input
                  value={it.name}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], name: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FIELDS.map(({ key, label, unit }) => (
                  <div key={key} className="space-y-1">
                    <Label className="label-mono text-muted-foreground text-[10px]">
                      {label} ({key === 'calories' ? energyLabel : unit})
                    </Label>
                    <Input
                      type="number"
                      value={(it as any)[key] ?? 0}
                      onChange={(e) => {
                        const next = [...items];
                        (next[i] as any)[key] = Number(e.target.value);
                        setItems(next);
                      }}
                    />
                  </div>
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

      <div className="space-y-1.5">
        <Label>Context (optional)</Label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Anything to know? e.g. cooked in 1 tbsp butter, 200 ml glass, large portion"
          rows={2}
          maxLength={500}
          className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Helps the model nail portion sizes and hidden ingredients.
        </p>
      </div>

      <label className="block">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPendingFile(f);
              runScan(f);
            }
          }}
          disabled={busy}
        />
        <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted/5">
          {busy ? (
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <LoadingRing size={20} /> <span>Analyzing…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera />
              <span className="text-sm">Tap to take or choose a photo</span>
              <span className="text-xs">
                Image is sent once for analysis and not stored on the server.
              </span>
            </div>
          )}
        </div>
      </label>

      {error && (
        <div className="space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          {pendingFile && (
            <Button variant="secondary" size="sm" onClick={() => runScan(pendingFile)}>
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
