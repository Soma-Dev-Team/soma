'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { getProfile } from './db/repo';
import { calorieLabel } from './utils';

/** Returns "cal" for imperial users, "kcal" otherwise. */
export function useEnergyLabel(): string {
  const profile = useLiveQuery(() => getProfile(), []);
  return calorieLabel(profile?.units);
}

/** Returns the user's preferred units, defaulting to 'metric' until profile loads. */
export function useUnits(): 'metric' | 'imperial' {
  const profile = useLiveQuery(() => getProfile(), []);
  return profile?.units ?? 'metric';
}
