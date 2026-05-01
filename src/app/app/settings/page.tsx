'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { exportAll, getProfile, saveProfile, wipeAll } from '@/lib/db/repo';
import { getStoredGeminiKey, setStoredGeminiKey } from '@/lib/gemini';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const profile = useLiveQuery(() => getProfile(), []);
  const [geminiKey, setGeminiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    setGeminiKey(getStoredGeminiKey());
    if (isSupabaseConfigured()) {
      getSupabaseBrowserClient()
        .auth.getUser()
        .then(({ data }) => setUser(data.user ? { email: data.user.email ?? undefined } : null));
    }
  }, []);

  async function signOut() {
    if (!isSupabaseConfigured()) return;
    await getSupabaseBrowserClient().auth.signOut();
    setUser(null);
  }

  async function handleExport() {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soma-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleWipe() {
    if (!confirm('This permanently clears all locally stored data on this device. Continue?')) return;
    await wipeAll();
    location.href = '/app/onboarding';
  }

  function saveKey() {
    setStoredGeminiKey(geminiKey.trim());
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 1500);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl wordmark">settings</h1>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h2 className="label-mono text-muted-foreground">ACCOUNT</h2>
          {user?.email ? (
            <div className="flex items-center justify-between">
              <span className="text-sm">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Local-only mode</span>
              <Link href="/login">
                <Button size="sm" variant="secondary">
                  Sign in
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-4">
          <h2 className="label-mono text-muted-foreground">{t('profile')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('units')}</Label>
              <Select
                value={profile?.units ?? 'metric'}
                onChange={(e) => saveProfile({ units: e.target.value as 'metric' | 'imperial' })}
              >
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('language')}</Label>
              <Select value="en" disabled>
                <option value="en">English</option>
              </Select>
            </div>
          </div>
          <div>
            <Link href="/app/onboarding">
              <Button variant="secondary" size="sm">
                {t('goals')} →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h2 className="label-mono text-muted-foreground">{t('ai').toUpperCase()}</h2>
          <Label>{t('gemini_key_label')}</Label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="AIza..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <Button onClick={saveKey}>{savedKey ? 'Saved ✓' : 'Save'}</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('gemini_key_help')}{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline inline-flex items-center gap-0.5"
            >
              Get a key <ExternalLink size={11} />
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h2 className="label-mono text-muted-foreground">{t('integrations').toUpperCase()}</h2>
          <p className="text-xs text-muted-foreground">
            Connect a service to auto-pull activity and body data.
          </p>
          <div className="space-y-2">
            <IntegrationRow name={t('connect_strava')} provider="strava" />
            <IntegrationRow name={t('connect_withings')} provider="withings" />
            <IntegrationRow name={t('connect_garmin')} provider="garmin" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h2 className="label-mono text-muted-foreground">{t('data').toUpperCase()}</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleExport}>
              {t('export')}
            </Button>
            <Button variant="destructive" onClick={handleWipe}>
              {t('wipe_local')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="label-mono text-muted-foreground text-center pt-4">
        SOMA · AGPL-3.0 · v0.1
      </p>
    </div>
  );
}

function IntegrationRow({ name, provider }: { name: string; provider: 'strava' | 'withings' | 'garmin' }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
      <span className="text-sm">{name}</span>
      <Link href={`/api/oauth/${provider}/start`}>
        <Button size="sm" variant="ghost">
          Connect
        </Button>
      </Link>
    </div>
  );
}
