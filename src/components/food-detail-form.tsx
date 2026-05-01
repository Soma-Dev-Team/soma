'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Food, MealLog } from '@/lib/db/dexie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { logMeal, upsertFood } from '@/lib/db/repo';

function pickDefaultMeal(): MealLog['meal'] {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

export function FoodDetailForm({
  food,
  defaultMeal,
  onSaved,
  onCancel,
}: {
  food: Food;
  defaultMeal?: MealLog['meal'];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations('add_food');
  const [meal, setMeal] = useState<MealLog['meal']>(defaultMeal ?? pickDefaultMeal());
  const [mode, setMode] = useState<'servings' | 'grams'>(food.serving_size_g ? 'servings' : 'grams');
  const [servings, setServings] = useState(1);
  const [grams, setGrams] = useState(food.serving_size_g ?? 100);

  const factor = mode === 'grams' && food.serving_size_g
    ? grams / food.serving_size_g
    : mode === 'grams'
      ? grams / 100
      : servings;
  const kcal = (food.calories ?? 0) * factor;
  const p = (food.protein_g ?? 0) * factor;
  const c = (food.carbs_g ?? 0) * factor;
  const f = (food.fat_g ?? 0) * factor;

  async function save() {
    await upsertFood({
      id: food.id,
      source: food.source,
      source_id: food.source_id,
      name: food.name,
      brand: food.brand,
      serving_size_g: food.serving_size_g,
      serving_label: food.serving_label,
      calories: food.calories,
      protein_g: food.protein_g,
      carbs_g: food.carbs_g,
      fat_g: food.fat_g,
      fiber_g: food.fiber_g,
      sugar_g: food.sugar_g,
      sodium_mg: food.sodium_mg,
      micronutrients: food.micronutrients,
    });
    await logMeal({
      food_id: food.id,
      meal,
      servings: mode === 'servings' ? servings : 1,
      grams: mode === 'grams' ? grams : undefined,
      logged_at: new Date().toISOString(),
    });
    onSaved();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{food.name}</h2>
        {food.brand && <p className="text-sm text-muted-foreground">{food.brand}</p>}
      </div>

      <div className="rounded-2xl border border-border p-4 grid grid-cols-4 gap-2 text-center">
        <Stat label="kcal" value={Math.round(kcal)} />
        <Stat label="P" value={Math.round(p)} />
        <Stat label="C" value={Math.round(c)} />
        <Stat label="F" value={Math.round(f)} />
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>{t('meal')}</Label>
          <Select value={meal} onChange={(e) => setMeal(e.target.value as MealLog['meal'])}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('servings')}
            className={`rounded-lg border px-3 py-2 text-sm ${
              mode === 'servings' ? 'border-accent bg-accent/10' : 'border-border'
            }`}
            disabled={!food.serving_size_g}
          >
            {t('servings')}
          </button>
          <button
            type="button"
            onClick={() => setMode('grams')}
            className={`rounded-lg border px-3 py-2 text-sm ${
              mode === 'grams' ? 'border-accent bg-accent/10' : 'border-border'
            }`}
          >
            {t('grams')}
          </button>
        </div>
        {mode === 'servings' ? (
          <Input
            type="number"
            step="0.25"
            min={0}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Input type="number" step="1" min={0} value={grams} onChange={(e) => setGrams(Number(e.target.value))} />
            <span className="text-muted-foreground">g</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={save} className="flex-1">
          {t('save')}
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold num">{value.toLocaleString()}</div>
    </div>
  );
}
