'use client';

import { getDB, PROFILE_ID, type Food, type MealLog, type Profile, type WeightLog } from './dexie';
import { uuid } from '../utils';

const now = () => new Date().toISOString();

export async function getProfile(): Promise<Profile | undefined> {
  return getDB().profiles.get(PROFILE_ID);
}

export async function saveProfile(p: Partial<Profile>): Promise<Profile> {
  const db = getDB();
  const existing = await db.profiles.get(PROFILE_ID);
  const merged: Profile = {
    id: PROFILE_ID,
    ...existing,
    ...p,
    _synced: 0,
    _updated_at: now(),
  } as Profile;
  await db.profiles.put(merged);
  return merged;
}

export async function logWeight(weight_kg: number, note?: string, when?: Date): Promise<WeightLog> {
  const entry: WeightLog = {
    id: uuid(),
    weight_kg,
    note,
    logged_at: (when ?? new Date()).toISOString(),
    _synced: 0,
    _updated_at: now(),
  };
  await getDB().weight_logs.put(entry);
  return entry;
}

export async function listWeights(): Promise<WeightLog[]> {
  return getDB().weight_logs.orderBy('logged_at').toArray();
}

export async function deleteWeight(id: string) {
  await getDB().weight_logs.delete(id);
}

export async function upsertFood(input: Omit<Food, '_synced' | '_updated_at'>): Promise<Food> {
  const food: Food = { ...input, _synced: 0, _updated_at: now() } as Food;
  await getDB().foods.put(food);
  return food;
}

export async function findFoodBySource(source: Food['source'], source_id: string) {
  return getDB().foods.where({ source, source_id }).first();
}

export async function searchFoods(query: string, limit = 30): Promise<Food[]> {
  const q = query.trim().toLowerCase();
  if (!q) return getDB().foods.limit(limit).toArray();
  return getDB()
    .foods.filter((f) => (f.name ?? '').toLowerCase().includes(q) || (f.brand ?? '').toLowerCase().includes(q))
    .limit(limit)
    .toArray();
}

export async function getFood(id: string) {
  return getDB().foods.get(id);
}

export async function logMeal(meal: Omit<MealLog, 'id' | '_synced' | '_updated_at'>): Promise<MealLog> {
  const entry: MealLog = {
    ...meal,
    id: uuid(),
    _synced: 0,
    _updated_at: now(),
  };
  await getDB().meal_logs.put(entry);
  return entry;
}

export async function deleteMeal(id: string) {
  await getDB().meal_logs.delete(id);
}

export async function listMealsForDay(date: Date): Promise<MealLog[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return getDB()
    .meal_logs.where('logged_at')
    .between(start.toISOString(), end.toISOString(), true, true)
    .toArray();
}

export async function listMealsBetween(start: Date, end: Date): Promise<MealLog[]> {
  return getDB()
    .meal_logs.where('logged_at')
    .between(start.toISOString(), end.toISOString(), true, true)
    .toArray();
}

export async function recentFoods(limit = 10): Promise<Food[]> {
  const meals = await getDB().meal_logs.orderBy('logged_at').reverse().limit(50).toArray();
  const seen = new Set<string>();
  const out: Food[] = [];
  for (const m of meals) {
    if (seen.has(m.food_id)) continue;
    seen.add(m.food_id);
    const f = await getDB().foods.get(m.food_id);
    if (f) out.push(f);
    if (out.length >= limit) break;
  }
  return out;
}

export async function exportAll() {
  const db = getDB();
  const [profiles, weight_logs, foods, meal_logs, activity_logs] = await Promise.all([
    db.profiles.toArray(),
    db.weight_logs.toArray(),
    db.foods.toArray(),
    db.meal_logs.toArray(),
    db.activity_logs.toArray(),
  ]);
  return {
    exported_at: now(),
    schema: 1,
    profiles,
    weight_logs,
    foods,
    meal_logs,
    activity_logs,
  };
}

export async function wipeAll() {
  const db = getDB();
  await Promise.all([
    db.profiles.clear(),
    db.weight_logs.clear(),
    db.foods.clear(),
    db.meal_logs.clear(),
    db.activity_logs.clear(),
    db.barcode_cache.clear(),
  ]);
}
