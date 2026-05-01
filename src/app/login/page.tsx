'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SomaMark } from '@/components/soma-mark';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      setErrorMsg('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setStatus('sent');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message ?? 'Failed to send magic link');
    }
  }

  async function handleGoogle() {
    if (!configured) {
      setErrorMsg('Supabase is not configured.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" aria-label="Soma">
            <SomaMark size={24} />
          </Link>
          <CardTitle className="mt-4 text-2xl wordmark">{t('sign_in')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogle} variant="secondary" className="w-full" disabled={!configured}>
            {t('google')}
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            {t('or')}
            <div className="flex-1 h-px bg-border" />
          </div>
          <form onSubmit={handleMagic} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" disabled={status === 'sending' || !configured} className="w-full">
              {status === 'sending' ? '…' : t('send_magic_link')}
            </Button>
            {status === 'sent' && <p className="text-sm text-accent">{t('magic_sent')}</p>}
            {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}
            {!configured && (
              <p className="text-xs text-muted-foreground">
                Without Supabase configured, you can still use Soma fully offline.{' '}
                <Link href="/app" className="underline">
                  Continue without account
                </Link>
                .
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
