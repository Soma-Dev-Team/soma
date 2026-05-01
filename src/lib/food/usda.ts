import type { Food } from '../db/dexie';

const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

function key() {
  const k = process.env.NEXT_PUBLIC_USDA_API_KEY || process.env.USDA_API_KEY;
  if (!k) return 'DEMO_KEY';
  return k;
}

export async function searchUSDA(query: string, pageSize = 20): Promise<Food[]> {
  const url = new URL(`${USDA_BASE}/foods/search`);
  url.searchParams.set('api_key', key());
  url.searchParams.set('query', query);
  url.searchParams.set('pageSize', String(pageSize));
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = (await res.json()) as { foods?: any[] };
  return (json.foods ?? []).map(usdaToFood).filter((f): f is Food => Boolean(f));
}

export async function fetchUSDAByGTIN(gtin: string): Promise<Food | null> {
  const url = new URL(`${USDA_BASE}/foods/search`);
  url.searchParams.set('api_key', key());
  url.searchParams.set('query', gtin);
  url.searchParams.set('pageSize', '5');
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as { foods?: any[] };
  const match = (json.foods ?? []).find((f) => f.gtinUpc === gtin || f.gtinUpc === gtin.replace(/^0/, ''));
  return match ? usdaToFood(match) : null;
}

export async function fetchUSDAById(fdcId: number | string): Promise<Food | null> {
  const url = new URL(`${USDA_BASE}/food/${fdcId}`);
  url.searchParams.set('api_key', key());
  const res = await fetch(url);
  if (!res.ok) return null;
  const j = await res.json();
  return usdaToFood(j);
}

function nutrientByNumber(nutrients: any[], num: string): number | undefined {
  const n = nutrients?.find((x) => String(x.nutrientNumber ?? x.nutrient?.number) === num);
  return n?.value ?? n?.amount;
}

export function usdaToFood(f: any): Food | null {
  if (!f) return null;
  const nuts = f.foodNutrients ?? [];
  return {
    id: `usda-${f.fdcId}`,
    source: 'usda',
    source_id: String(f.fdcId),
    name: f.description ?? 'USDA food',
    brand: f.brandOwner ?? f.brandName,
    serving_size_g: f.servingSize ?? undefined,
    serving_label: f.householdServingFullText ?? undefined,
    calories: nutrientByNumber(nuts, '208'),
    protein_g: nutrientByNumber(nuts, '203'),
    carbs_g: nutrientByNumber(nuts, '205'),
    fat_g: nutrientByNumber(nuts, '204'),
    fiber_g: nutrientByNumber(nuts, '291'),
    sugar_g: nutrientByNumber(nuts, '269'),
    sodium_mg: nutrientByNumber(nuts, '307'),
    micronutrients: {
      vitamin_c_mg: nutrientByNumber(nuts, '401') ?? 0,
      iron_mg: nutrientByNumber(nuts, '303') ?? 0,
      calcium_mg: nutrientByNumber(nuts, '301') ?? 0,
      potassium_mg: nutrientByNumber(nuts, '306') ?? 0,
    },
    _synced: 1,
    _updated_at: new Date().toISOString(),
  };
}
