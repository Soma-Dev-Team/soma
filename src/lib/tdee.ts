export type Sex = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Pace = 'mild' | 'moderate' | 'aggressive';

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const PACE_KG_PER_WEEK: Record<Pace, number> = {
  mild: 0.25,
  moderate: 0.5,
  aggressive: 0.75,
};

const KCAL_PER_KG_FAT = 7700;

export function ageFromBirthDate(birthDate: string | Date): number {
  const bd = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const m = now.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
  return age;
}

export function mifflinStJeor({
  sex,
  weightKg,
  heightCm,
  age,
}: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
}): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') return base + 5;
  if (sex === 'female') return base - 161;
  return base - 78;
}

export function tdee({
  bmr,
  activity,
}: {
  bmr: number;
  activity: ActivityLevel;
}): number {
  return bmr * ACTIVITY_FACTOR[activity];
}

export function targetCalories({
  tdee,
  goal,
  pace,
}: {
  tdee: number;
  goal: Goal;
  pace?: Pace;
}): number {
  if (goal === 'maintain' || !pace) return Math.round(tdee);
  const dailyDelta = (PACE_KG_PER_WEEK[pace] * KCAL_PER_KG_FAT) / 7;
  return Math.round(goal === 'lose' ? tdee - dailyDelta : tdee + dailyDelta);
}

export function defaultMacros(targetKcal: number) {
  const proteinKcal = targetKcal * 0.3;
  const carbsKcal = targetKcal * 0.4;
  const fatKcal = targetKcal * 0.3;
  return {
    protein_g: Math.round(proteinKcal / 4),
    carbs_g: Math.round(carbsKcal / 4),
    fat_g: Math.round(fatKcal / 9),
  };
}

export function macrosFromSplit(targetKcal: number, splitPct: { p: number; c: number; f: number }) {
  return {
    protein_g: Math.round((targetKcal * splitPct.p) / 100 / 4),
    carbs_g: Math.round((targetKcal * splitPct.c) / 100 / 4),
    fat_g: Math.round((targetKcal * splitPct.f) / 100 / 9),
  };
}
