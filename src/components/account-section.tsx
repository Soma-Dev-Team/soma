'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { LoadingRing } from './loading-ring';
import { signOutAction } from '@/app/actions';

interface SessionPayload {
  user?: { name?: string; email?: string; image?: string };
  expires?: string;
}

export function AccountSection() {
  const [state, setState] = useState<'loading' | 'unconfigured' | 'signed-in' | 'signed-out'>(
    'loading',
  );
  const [user, setUser] = useState<SessionPayload['user']>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        if (cancelled) return;
        if (!res.ok) {
          setState('unconfigured');
          return;
        }
        const data = (await res.json()) as SessionPayload;
        if (data?.user?.email) {
          setUser(data.user);
          setState('signed-in');
        } else {
          setState('signed-out');
        }
      } catch {
        if (!cancelled) setState('unconfigured');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoadingRing size={14} /> <span>Checking…</span>
      </div>
    );
  }

  if (state === 'signed-in' && user) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm truncate">{user.name ?? user.email}</div>
          {user.name && (
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          )}
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  if (state === 'signed-out') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Not signed in</span>
        <Link href="/login">
          <Button size="sm" variant="secondary">
            Sign in
          </Button>
        </Link>
      </div>
    );
  }

  // Unconfigured: server has no Auth.js endpoints / env vars.
  return (
    <p className="text-sm text-muted-foreground">
      No sign-in needed. Your data lives only in this browser. Use Export JSON below to move it
      between devices.
    </p>
  );
}
