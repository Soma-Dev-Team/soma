'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Food, MealLog } from '@/lib/db/dexie';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

type Meal = MealLog['meal'];

function computeFor(m: MealLog, food: Food | undefined) {
  if (!food) return { kcal: 0, p: 0, c: 0, f: 0 };
  const factor = m.grams != null && food.serving_size_g
    ? m.grams / food.serving_size_g
    : m.servings;
  return {
    kcal: (food.calories ?? 0) * factor,
    p: (food.protein_g ?? 0) * factor,
    c: (food.carbs_g ?? 0) * factor,
    f: (food.fat_g ?? 0) * factor,
  };
}

export function MealList({
  meals,
  foods,
  onDelete,
}: {
  meals: MealLog[];
  foods: Map<string, Food>;
  onDelete?: (id: string) => void;
}) {
  const t = useTranslations('today');
  const groups: Record<Meal, MealLog[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };
  for (const m of meals) groups[m.meal].push(m);

  return (
    <div className="space-y-4">
      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => {
        const items = groups[meal];
        const total = items.reduce((acc, m) => acc + computeFor(m, foods.get(m.food_id)).kcal, 0);
        return (
          <div key={meal} className="rounded-2xl border border-border bg-surface">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="font-medium">{t(meal)}</div>
              <div className="text-sm text-muted-foreground num">{Math.round(total)} kcal</div>
            </div>
            {items.length === 0 ? (
              <div className="px-5 py-4 text-sm text-muted-foreground flex items-center justify-between">
                <span>{t('empty_meal')}</span>
                <Link href={`/app/add-food?meal=${meal}`} className="text-accent hover:underline">
                  {t('add_food')}
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((m) => {
                  const food = foods.get(m.food_id);
                  const v = computeFor(m, food);
                  return (
                    <li key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{food?.name ?? '…'}</div>
                        <div className="text-xs text-muted-foreground num">
                          {m.grams != null ? `${Math.round(m.grams)} g` : `${m.servings} × serving`} ·{' '}
                          {Math.round(v.p)}p / {Math.round(v.c)}c / {Math.round(v.f)}f
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm num">{Math.round(v.kcal)}</span>
                        {onDelete && (
                          <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => onDelete(m.id)}>
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
