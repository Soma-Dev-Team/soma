'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uuid } from '@/lib/utils';
import { useEnergyLabel } from '@/lib/hooks';
import type { Food } from '@/lib/db/dexie';

export function CustomFoodForm({ onCreated }: { onCreated: (food: Food) => void }) {
  const energyLabel = useEnergyLabel();
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    serving_size_g: 100,
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: typeof form[k] === 'number' ? Number(e.target.value) : e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const food: Food = {
      id: uuid(),
      source: 'custom',
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      description: form.description.trim() || undefined,
      serving_size_g: form.serving_size_g,
      calories: form.calories,
      protein_g: form.protein_g,
      carbs_g: form.carbs_g,
      fat_g: form.fat_g,
      fiber_g: form.fiber_g,
      _synced: 0,
      _updated_at: new Date().toISOString(),
    };
    onCreated(food);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input value={form.name} onChange={set('name')} required placeholder="Homemade pasta" />
      </div>
      <div className="space-y-1.5">
        <Label>Brand (optional)</Label>
        <Input value={form.brand} onChange={set('brand')} />
      </div>
      <div className="space-y-1.5">
        <Label>Description (optional)</Label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={2}
          maxLength={500}
          placeholder="Mom's recipe, one slice, includes ricotta + meat sauce"
          className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Serving size (g)</Label>
        <Input type="number" value={form.serving_size_g} onChange={set('serving_size_g')} />
      </div>
      <p className="text-xs text-muted-foreground pt-1">Per serving:</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Calories (${energyLabel})`} v={form.calories} on={set('calories')} />
        <Field label="Protein (g)" v={form.protein_g} on={set('protein_g')} />
        <Field label="Carbs (g)" v={form.carbs_g} on={set('carbs_g')} />
        <Field label="Fat (g)" v={form.fat_g} on={set('fat_g')} />
        <Field label="Fiber (g)" v={form.fiber_g} on={set('fiber_g')} />
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}

function Field({
  label,
  v,
  on,
}: {
  label: string;
  v: number;
  on: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type="number" step="0.1" value={v} onChange={on} />
    </div>
  );
}
