import type { Food } from '../db/dexie';

const OFF_BASE = 'https://world.openfoodfacts.org';

export interface OFFProduct {
  code: string;
  product?: {
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    serving_size?: string;
    serving_quantity?: number;
    nutriments?: Record<string, number | string | undefined>;
  };
  status: 0 | 1;
  status_verbose?: string;
}

export async function fetchOFFByBarcode(barcode: string): Promise<OFFProduct | null> {
  const res = await fetch(`${OFF_BASE}/api/v2/product/${encodeURIComponent(barcode)}.json`, {
    headers: { 'User-Agent': 'Soma/0.1 (https://github.com/soma)' },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as OFFProduct;
  if (json.status !== 1) return null;
  return json;
}

export async function searchOFF(query: string, pageSize = 20): Promise<Food[]> {
  const url = new URL(`${OFF_BASE}/cgi/search.pl`);
  url.searchParams.set('search_terms', query);
  url.searchParams.set('search_simple', '1');
  url.searchParams.set('action', 'process');
  url.searchParams.set('json', '1');
  url.searchParams.set('page_size', String(pageSize));
  const res = await fetch(url, { headers: { 'User-Agent': 'Soma/0.1' } });
  if (!res.ok) return [];
  const json = (await res.json()) as { products?: any[] };
  return (json.products ?? []).map(offProductToFood).filter((f): f is Food => Boolean(f));
}

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return isNaN(n) ? undefined : n;
}

export function offProductToFood(p: any): Food | null {
  if (!p?.code) return null;
  const n = p.nutriments ?? {};
  const name = p.product_name || p.product_name_en || p.generic_name || `Barcode ${p.code}`;
  return {
    id: `off-${p.code}`,
    source: 'off',
    source_id: String(p.code),
    name,
    brand: p.brands,
    serving_size_g: num(p.serving_quantity),
    serving_label: p.serving_size,
    calories: num(n['energy-kcal_100g']) ?? num(n['energy-kcal']),
    protein_g: num(n['proteins_100g']),
    carbs_g: num(n['carbohydrates_100g']),
    fat_g: num(n['fat_100g']),
    fiber_g: num(n['fiber_100g']),
    sugar_g: num(n['sugars_100g']),
    sodium_mg: num(n['sodium_100g']) != null ? (num(n['sodium_100g'])! * 1000) : undefined,
    micronutrients: extractMicros(n),
    _synced: 1,
    _updated_at: new Date().toISOString(),
  };
}

function extractMicros(n: Record<string, any>): Record<string, number> {
  const map: Record<string, string> = {
    'vitamin-c_100g': 'vitamin_c_mg',
    'vitamin-a_100g': 'vitamin_a_mcg',
    'vitamin-d_100g': 'vitamin_d_mcg',
    'iron_100g': 'iron_mg',
    'calcium_100g': 'calcium_mg',
    'potassium_100g': 'potassium_mg',
    'magnesium_100g': 'magnesium_mg',
    'zinc_100g': 'zinc_mg',
  };
  const out: Record<string, number> = {};
  for (const [src, dst] of Object.entries(map)) {
    const v = num(n[src]);
    if (v != null) out[dst] = v;
  }
  return out;
}
