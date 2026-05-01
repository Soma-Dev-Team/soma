'use client';

import { getDB } from './dexie';
import { getSupabaseBrowserClient } from '../supabase/client';

const TABLES = ['profiles', 'weight_logs', 'foods', 'meal_logs', 'activity_logs'] as const;

export async function pushPending(): Promise<{ pushed: number }> {
  const supabase = getSupabaseBrowserClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { pushed: 0 };

  const db = getDB();
  let pushed = 0;
  for (const t of TABLES) {
    const table = (db as any)[t];
    const rows = await table.where('_synced').equals(0).toArray();
    if (rows.length === 0) continue;
    const cleaned = rows.map((r: any) => {
      const { _synced, _updated_at, _deleted, ...rest } = r;
      return { ...rest, user_id: rest.user_id ?? (t === 'profiles' ? user.id : user.id) };
    });
    const { error } = await supabase.from(t).upsert(cleaned, { onConflict: t === 'profiles' ? 'id' : 'id' });
    if (error) {
      console.warn(`[sync] ${t} upsert failed`, error.message);
      continue;
    }
    await Promise.all(rows.map((r: any) => table.update(r.id ?? r.barcode, { _synced: 1 })));
    pushed += rows.length;
  }
  return { pushed };
}

export function startBackgroundSync(intervalMs = 30_000) {
  if (typeof window === 'undefined') return () => {};
  const tick = () => {
    pushPending().catch((e) => console.warn('[sync] tick failed', e));
  };
  tick();
  const id = window.setInterval(tick, intervalMs);
  const onOnline = () => tick();
  window.addEventListener('online', onOnline);
  return () => {
    window.clearInterval(id);
    window.removeEventListener('online', onOnline);
  };
}
