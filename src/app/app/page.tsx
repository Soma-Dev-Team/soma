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
import { PageStagger, stackItem } from '@/components/page-shell';
import { TodayHeader } from '@/components/today-header';
import { calorieLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getDB } from '@/lib/db/dexie';
import { deleteMeal, getProfile, listMealsForDay, listMealsBetween } from '@/lib/db/repo';
import { startOfDay, subDays } from 'date-fns';

export default function TodayPage() {
  const router = useRouter();
  const [today] = useState(() => new Date());

  const profile = useLiveQuery(() => getProfile(), []);
  const meals = useLiveQuery(() => listMealsForDay(today), [today]);

  // Streak: count back from today through any consecutive days that have at
  // least one logged meal.
  const recentMeals = useLiveQuery(async () => {
    const end = new Date();
    const start = subDays(startOfDay(end), 60);
    return listMealsBetween(start, end);
  }, []);
  const streak = useMemo(() => {
    if (!recentMeals || recentMeals.length === 0) return 0;
    const days = new Set<string>();
    for (const m of recentMeals) {
      const d = startOfDay(new Date(m.logged_at));
      days.add(d.toDateString());
    }
    let count = 0;
    let cursor = startOfDay(new Date());
    while (days.has(cursor.toDateString())) {
      count += 1;
      cursor = subDays(cursor, 1);
    }
    return count;
  }, [recentMeals]);
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

  // Glow tint = the macro furthest along toward its target. Subtle visual cue
  // for what's been driving the day. Defaults to protein when nothing logged.
  const glowVar = useMemo(() => {
    const ratios: Array<[string, number]> = [
      ['var(--macro-protein)', totals.protein_g / Math.max(1, targets.protein_g)],
      ['var(--macro-carbs)', totals.carbs_g / Math.max(1, targets.carbs_g)],
      ['var(--macro-fat)', totals.fat_g / Math.max(1, targets.fat_g)],
      ['var(--macro-fiber)', totals.fiber_g / Math.max(1, targets.fiber_g)],
    ];
    ratios.sort((a, b) => b[1] - a[1]);
    return ratios[0][1] > 0 ? ratios[0][0] : 'var(--macro-protein)';
  }, [totals, targets]);

  return (
    <PageStagger className="space-y-6">
      <motion.div variants={stackItem}>
        <TodayHeader streak={streak} />
      </motion.div>

      <motion.div variants={stackItem} animate={controls} className="relative flex items-center justify-center pt-2">
        {/* Soft radial glow behind the ring, tinted by the leading macro */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-[260px] w-[260px] rounded-full opacity-50"
            style={{
              background: `radial-gradient(circle, ${glowVar} 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
        </div>
        <CalorieRing
          consumed={totals.kcal}
          goal={goal}
          mode={(profile?.goal as GoalMode | undefined) ?? 'maintain'}
          unitLabel={calorieLabel(profile?.units)}
        />
      </motion.div>

      <motion.div variants={stackItem}>
        <Card>
          <CardContent className="pt-6 pb-5">
            <MacroRings consumed={totals} targets={targets} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={stackItem}>
        <MealList
          meals={meals ?? []}
          foods={foods ?? new Map()}
          onDelete={async (id) => {
            if (confirm('Delete this entry?')) await deleteMeal(id);
          }}
        />
      </motion.div>

      <Link
        href="/app/add-food"
        className="fixed right-5 z-40 md:bottom-8"
        style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
      >
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg p-0" aria-label="Add food">
          <Plus size={24} />
        </Button>
      </Link>
    </PageStagger>
  );
}
