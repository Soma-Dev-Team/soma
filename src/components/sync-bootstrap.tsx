'use client';

import { useEffect } from 'react';
import { startBackgroundSync } from '@/lib/db/sync';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function SyncBootstrap() {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const stop = startBackgroundSync();
    return stop;
  }, []);
  return null;
}
