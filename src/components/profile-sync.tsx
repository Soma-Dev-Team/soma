'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLiveQuery } from 'dexie-react-hooks';
import { getProfile, saveProfile } from '@/lib/db/repo';
import type { Profile } from '@/lib/db/dexie';

const PROFILE_FIELDS: (keyof Profile)[] = [
  'sex',
  'birth_date',
  'height_cm',
  'activity_level',
  'goal',
  'goal_pace',
  'target_calories',
  'target_protein_g',
  'target_carbs_g',
  'target_fat_g',
  'start_weight_kg',
  'target_weight_kg',
  'units',
  'locale',
  'display_name',
  'onboarded',
];

function pickFields(p: Partial<Profile>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of PROFILE_FIELDS) {
    const v = (p as any)[k];
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/**
 * Two-way sync between Dexie's local profile and the user's row in Postgres.
 *
 * - On mount, if signed in, GET /api/profile. If the server has any state we
 *   don't, merge it into Dexie. Theme is restored to next-themes.
 * - When local Dexie profile or theme changes (and we're signed in), POST
 *   the merged blob back to /api/profile (debounced).
 */
export function ProfileSync() {
  const { theme, setTheme } = useTheme();
  const profile = useLiveQuery(() => getProfile(), []);
  const isSignedInRef = useRef<boolean | null>(null);
  const initialPullDone = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect session once, then pull
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sessionRes = await fetch('/api/auth/session', { cache: 'no-store' });
        if (!sessionRes.ok) return;
        const session = await sessionRes.json();
        const signedIn = Boolean(session?.user?.email);
        if (cancelled) return;
        isSignedInRef.current = signedIn;
        if (!signedIn) return;

        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (!res.ok) {
          // 501 = sync disabled (no DB adapter). 401 = not signed in. Either
          // way, log so it's visible during debugging without scraping logs.
          const body = await res.text().catch(() => '');
          console.warn(`[soma/sync] profile pull failed (${res.status}): ${body}`);
          return;
        }
        const data = (await res.json()) as {
          profile: Record<string, any> | null;
          updated_at: string | null;
        };
        if (cancelled) return;
        if (data.profile) {
          // Apply server theme into next-themes
          if (data.profile.theme && data.profile.theme !== theme) {
            setTheme(data.profile.theme);
          }
          // Merge into Dexie. Local fields without a server counterpart win;
          // server fields fill in missing ones.
          const local = await getProfile();
          const merged = { ...data.profile, ...pickFields(local ?? {}) };
          // If local has nothing yet, the merged blob IS the server blob.
          await saveProfile(merged);
        }
      } catch (err) {
        console.warn('[soma/sync] profile pull error:', err);
      } finally {
        initialPullDone.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
    // intentionally only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced push on local change
  useEffect(() => {
    if (!initialPullDone.current) return;
    if (!isSignedInRef.current) return;
    if (!profile) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const body = {
        profile: {
          ...pickFields(profile),
          theme: theme ?? 'system',
        },
      };
      fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.warn(`[soma/sync] profile push failed (${res.status}): ${body}`);
          }
        })
        .catch((err) => console.warn('[soma/sync] profile push error:', err));
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [profile, theme]);

  return null;
}
