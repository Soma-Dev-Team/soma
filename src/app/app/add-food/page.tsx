'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodSearch } from '@/components/food-search';
import { CustomFoodForm } from '@/components/custom-food-form';
import { BarcodeScanner } from '@/components/barcode-scanner';
import { FoodDetailForm } from '@/components/food-detail-form';
import { PhotoScan } from '@/components/photo-scan';
import { Button } from '@/components/ui/button';
import { upsertFood } from '@/lib/db/repo';
import type { Food, MealLog } from '@/lib/db/dexie';
import { getDB } from '@/lib/db/dexie';

export default function AddFoodPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const t = useTranslations('add_food');
  const router = useRouter();
  const params = useSearchParams();
  const meal = (params.get('meal') as MealLog['meal'] | null) ?? undefined;

  const [tab, setTab] = useState<'search' | 'barcode' | 'photo' | 'custom'>('search');
  const [picked, setPicked] = useState<Food | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  if (picked) {
    return (
      <FoodDetailForm
        food={picked}
        defaultMeal={meal}
        onSaved={() => router.push('/app')}
        onCancel={() => setPicked(null)}
      />
    );
  }

  async function handleBarcode(code: string) {
    setScanError(null);
    try {
      const db = getDB();
      const cached = await db.barcode_cache.get(code);
      if (cached) {
        await upsertFood(cached.food);
        setPicked(cached.food);
        return;
      }
      let food: Food | null = null;
      const offRes = await fetch(`/api/off/barcode/${encodeURIComponent(code)}`);
      if (offRes.ok) food = (await offRes.json()).food;
      if (!food && /^[0-9]{12,13}$/.test(code)) {
        const usdaRes = await fetch(`/api/usda/barcode/${encodeURIComponent(code)}`);
        if (usdaRes.ok) food = (await usdaRes.json()).food;
      }
      if (!food) {
        setScanError(`No match for ${code}. Add as a custom food?`);
        setTab('custom');
        return;
      }
      await db.barcode_cache.put({ barcode: code, food, cached_at: new Date().toISOString() });
      await upsertFood(food);
      setPicked(food);
    } catch (e: any) {
      setScanError(e.message ?? 'Lookup failed');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl wordmark">{t('title').toLowerCase()}</h1>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="w-full">
          <TabsTrigger value="search">{t('tab_search')}</TabsTrigger>
          <TabsTrigger value="barcode">{t('tab_barcode')}</TabsTrigger>
          <TabsTrigger value="photo">{t('tab_photo')}</TabsTrigger>
          <TabsTrigger value="custom">{t('tab_custom')}</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <FoodSearch
            onPick={async (food) => {
              await upsertFood(food);
              setPicked(food);
            }}
          />
        </TabsContent>

        <TabsContent value="barcode">
          <div className="space-y-3">
            <BarcodeScanner onDetect={handleBarcode} onError={(e) => setScanError(e.message)} />
            {scanError && <p className="text-sm text-destructive">{scanError}</p>}
            <p className="text-xs text-muted-foreground text-center">{t('scanning')}</p>
          </div>
        </TabsContent>

        <TabsContent value="photo">
          <PhotoScan defaultMeal={meal} onLogged={() => router.push('/app')} />
        </TabsContent>

        <TabsContent value="custom">
          <CustomFoodForm
            onCreated={async (food) => {
              await upsertFood(food);
              setPicked(food);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
