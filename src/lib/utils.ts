import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kgToLbs(kg: number) {
  return kg * 2.2046226218;
}

export function lbsToKg(lbs: number) {
  return lbs / 2.2046226218;
}

export function cmToInches(cm: number) {
  return cm / 2.54;
}

export function inchesToCm(inches: number) {
  return inches * 2.54;
}

export function formatNumber(n: number | null | undefined, digits = 0) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function calorieLabel(units: 'metric' | 'imperial' | undefined): string {
  return units === 'imperial' ? 'cal' : 'kcal';
}

/**
 * Display the weight delta a pace setting represents per week, in the user's
 * preferred units. Pace is named in metric internally; we convert to lb for
 * imperial readers (rounded to nice numbers).
 */
export function paceLabel(
  pace: 'mild' | 'moderate' | 'aggressive',
  units: 'metric' | 'imperial' | undefined,
): string {
  const kg = pace === 'mild' ? 0.25 : pace === 'moderate' ? 0.5 : 0.75;
  if (units === 'imperial') {
    const lb = pace === 'mild' ? 0.5 : pace === 'moderate' ? 1 : 1.5;
    return `${lb} lb/wk`;
  }
  return `${kg} kg/wk`;
}

export function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
