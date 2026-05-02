'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CalorieRing, type GoalMode } from '@/components/calorie-ring';
import { MacroRings } from '@/components/macro-rings';
import { MealList } from '@/components/meal-list';
import { calorieLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getDB } from '@/lib/db/dexie';
import { deleteMeal, getProfile, listMealsForDay } from '@/lib/db/repo';

export default function TodayPage() {
  const router = useRouter();
  const [today] = useState(() => new Date());

  const profile = useLiveQuery(() => getProfile(), []);
  const meals = useLiveQuery(() => listMealsForDay(today), [today]);
  const foods = useLiveQuery(async () => {
    const all = await getDB().foods.toArray();
    return new Map(all.map((f) => [f.id, f]));
  }, [meals]);

  // useLiveQuery returns `undefined` both while loading and when no row exists,
  // so the redirect needs a separate one-shot check at mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await getProfile();
      if (cancelled) return;
      if (!p?.onboarded) router.replace('/app/onboarding');
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const totals = useMemo(() => {
    const t = { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 };
    if (!meals || !foods) return t;
    for (const m of meals) {
      const f = foods.get(m.food_id);
      if (!f) continue;
      const factor = m.grams != null && f.serving_size_g ? m.grams / f.serving_size_g : m.servings;
      t.kcal += (f.calories ?? 0) * factor;
      t.protein_g += (f.protein_g ?? 0) * factor;
      t.carbs_g += (f.carbs_g ?? 0) * factor;
      t.fat_g += (f.fat_g ?? 0) * factor;
      t.fiber_g += (f.fiber_g ?? 0) * factor;
    }
    return t;
  }, [meals, foods]);

  const goal = profile?.target_calories ?? 2000;

  // Pulse the calorie ring whenever the meal count grows.
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const lastMealCount = useRef<number | null>(null);
  useEffect(() => {
    if (!meals) return;
    const prev = lastMealCount.current;
    lastMealCount.current = meals.length;
    if (prev == null) return; // first observation, don't pulse on mount
    if (meals.length > prev && !reduce) {
      controls.start({
        scale: [1, 1.04, 1],
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      });
    }
  }, [meals?.length, controls, reduce]);
  const targets = {
    protein_g: profile?.target_protein_g ?? 150,
    carbs_g: profile?.target_carbs_g ?? 200,
    fat_g: profile?.target_fat_g ?? 67,
    fiber_g: 30,
  };

  return (
    <div className="space-y-6">
      <motion.div animate={controls} className="flex items-center justify-center pt-2">
        <CalorieRing
          consumed={totals.kcal}
          goal={goal}
          mode={(profile?.goal as GoalMode | undefined) ?? 'maintain'}
          unitLabel={calorieLabel(profile?.units)}
        />
      </motion.div>

      <Card>
        <CardContent className="pt-6 pb-5">
          <MacroRings consumed={totals} targets={targets} />
        </CardContent>
      </Card>

      <MealList
        meals={meals ?? []}
        foods={foods ?? new Map()}
        onDelete={async (id) => {
          if (confirm('Delete this entry?')) await deleteMeal(id);
        }}
      />

      <Link href="/app/add-food" className="fixed bottom-24 right-5 md:bottom-8">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg p-0" aria-label="Add food">
          <Plus size={24} />
        </Button>
      </Link>
    </div>
  );
}
