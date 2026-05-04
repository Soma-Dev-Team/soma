import Dexie, { type Table } from 'dexie';

export interface SyncMeta {
  _synced: 0 | 1;
  _updated_at: string;
  _deleted?: 0 | 1;
}

export interface Profile extends SyncMeta {
  id: string;
  display_name?: string;
  sex?: 'male' | 'female' | 'other';
  birth_date?: string;
  height_cm?: number;
  activity_level?: string;
  goal?: string;
  goal_pace?: string;
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  /** Weight at the start of the current goal (kg). Set on onboarding. */
  start_weight_kg?: number;
  /** Where the user is heading (kg). Set when goal is lose/gain. */
  target_weight_kg?: number;
  units?: 'metric' | 'imperial';
  locale?: string;
  onboarded?: boolean;
}

export interface WeightLog extends SyncMeta {
  id: string;
  user_id?: string;
  weight_kg: number;
  logged_at: string;
  note?: string;
}

export interface Food extends SyncMeta {
  id: string;
  user_id?: string;
  source: 'off' | 'usda' | 'custom' | 'gemini';
  source_id?: string;
  name: string;
  brand?: string;
  description?: string;
  serving_size_g?: number;
  serving_label?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  micronutrients?: Record<string, number>;
}

export interface MealLog extends SyncMeta {
  id: string;
  user_id?: string;
  food_id: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  grams?: number;
  logged_at: string;
}

export interface ActivityLog extends SyncMeta {
  id: string;
  user_id?: string;
  source: 'strava' | 'manual';
  source_id?: string;
  activity_type?: string;
  duration_min?: number;
  calories_burned?: number;
  started_at?: string;
  raw?: Record<string, unknown>;
}

export interface Integration extends SyncMeta {
  provider: 'strava';
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  scope?: string;
  connected_at: string;
}

export interface BarcodeCacheEntry {
  barcode: string;
  food: Food;
  cached_at: string;
}

class SomaDB extends Dexie {
  profiles!: Table<Profile, string>;
  weight_logs!: Table<WeightLog, string>;
  foods!: Table<Food, string>;
  meal_logs!: Table<MealLog, string>;
  activity_logs!: Table<ActivityLog, string>;
  integrations!: Table<Integration, string>;
  barcode_cache!: Table<BarcodeCacheEntry, string>;

  constructor() {
    super('soma');
    this.version(1).stores({
      profiles: 'id, _synced, _updated_at',
      weight_logs: 'id, logged_at, _synced, _updated_at',
      foods: 'id, name, source, source_id, _synced, _updated_at',
      meal_logs: 'id, logged_at, food_id, meal, _synced, _updated_at',
      activity_logs: 'id, started_at, source, _synced, _updated_at',
      integrations: 'provider, _synced, _updated_at',
      barcode_cache: 'barcode, cached_at',
    });
  }
}

let _db: SomaDB | null = null;
export function getDB(): SomaDB {
  if (typeof window === 'undefined') {
    throw new Error('Dexie is browser-only');
  }
  if (!_db) _db = new SomaDB();
  return _db;
}

export const PROFILE_ID = 'me';
