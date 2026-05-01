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
import {
  disconnectIntegration,
  exportAll,
  getProfile,
  listIntegrations,
  saveIntegration,
  saveProfile,
  wipeAll,
} from '@/lib/db/repo';
import { getStoredGeminiKey, setStoredGeminiKey } from '@/lib/gemini';
import { ExternalLink } from 'lucide-react';
import type { Integration } from '@/lib/db/dexie';

type ProviderId = Integration['provider'];

export default function SettingsPage() {
  const t = useTranslations('settings');
  const profile = useLiveQuery(() => getProfile(), []);
  const integrations = useLiveQuery(() => listIntegrations(), []);
  const [geminiKey, setGeminiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);
  const [oauthMsg, setOauthMsg] = useState<string | null>(null);

  useEffect(() => {
    setGeminiKey(getStoredGeminiKey());
  }, []);

  // Capture OAuth callback fragments and persist locally.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !hash.includes('oauth=')) return;
    const p = new URLSearchParams(hash.slice(1));
    const provider = p.get('oauth') as ProviderId | null;
    const status = p.get('status');
    if (!provider) return;

    if (status === 'ok' && p.get('access_token')) {
      saveIntegration({
        provider,
        access_token: p.get('access_token') ?? '',
        refresh_token: p.get('refresh_token') || undefined,
        expires_at: p.get('expires_at') || undefined,
        scope: p.get('scope') || undefined,
      }).then(() => setOauthMsg(`Connected ${provider}.`));
    } else if (status === 'missing-keys') {
      setOauthMsg(`${provider} is not configured on this deployment.`);
    } else {
      setOauthMsg(`Could not connect ${provider}.`);
    }
    history.replaceState(null, '', '/app/settings');
  }, []);

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

  const connected = new Map((integrations ?? []).map((i) => [i.provider, i]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl wordmark">settings</h1>

      {oauthMsg && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">{oauthMsg}</div>
      )}

      <Card>
        <CardContent className="pt-5 space-y-3">
          <h2 className="label-mono text-muted-foreground">ACCOUNT</h2>
          <p className="text-sm text-muted-foreground">
            No sign-in needed. Your data lives only in this browser. Use Export JSON below to move
            it between devices.
          </p>
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
            Connect a service to pull activity and body data. Tokens are stored only on this device.
          </p>
          <div className="space-y-2">
            <IntegrationRow
              provider="strava"
              label={t('connect_strava')}
              connected={connected.get('strava')}
            />
            <IntegrationRow
              provider="withings"
              label={t('connect_withings')}
              connected={connected.get('withings')}
            />
            <IntegrationRow
              provider="garmin"
              label={t('connect_garmin')}
              connected={connected.get('garmin')}
            />
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

function IntegrationRow({
  provider,
  label,
  connected,
}: {
  provider: ProviderId;
  label: string;
  connected: Integration | undefined;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
      <div>
        <div className="text-sm">{label}</div>
        {connected && (
          <div className="label-mono text-muted-foreground mt-0.5">
            CONNECTED {connected.connected_at.slice(0, 10)}
          </div>
        )}
      </div>
      {connected ? (
        <Button size="sm" variant="ghost" onClick={() => disconnectIntegration(provider)}>
          Disconnect
        </Button>
      ) : (
        <Link href={`/api/oauth/${provider}/start`}>
          <Button size="sm" variant="ghost">
            Connect
          </Button>
        </Link>
      )}
    </div>
  );
}
