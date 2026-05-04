import { NextResponse } from 'next/server';

const TOKEN_URLS: Record<string, string> = {
  strava: 'https://www.strava.com/api/v3/oauth/token',
};

const ENV_KEYS: Record<string, [string, string]> = {
  strava: ['STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET'],
};

function bounce(origin: string, fragment: Record<string, string>) {
  const hash = new URLSearchParams(fragment).toString();
  return NextResponse.redirect(new URL(`/app/settings#${hash}`, origin));
}

export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const tokenUrl = TOKEN_URLS[provider];
  const keys = ENV_KEYS[provider];

  if (!code || !tokenUrl || !keys) {
    return bounce(url.origin, { oauth: provider, status: 'error' });
  }
  const [idEnv, secretEnv] = keys;
  const clientId = process.env[idEnv];
  const clientSecret = process.env[secretEnv];
  if (!clientId || !clientSecret) {
    return bounce(url.origin, { oauth: provider, status: 'missing-keys' });
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${url.origin}/api/oauth/${provider}/callback`,
  });

  let token: any = null;
  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    token = await res.json();
  } catch {
    return bounce(url.origin, { oauth: provider, status: 'token-failed' });
  }

  if (!token?.access_token) {
    return bounce(url.origin, { oauth: provider, status: 'no-token' });
  }

  // Tokens are returned in the URL fragment (never sent to the server) so the
  // settings page can persist them to IndexedDB on this device only.
  return bounce(url.origin, {
    oauth: provider,
    status: 'ok',
    access_token: token.access_token,
    refresh_token: token.refresh_token ?? '',
    expires_at: token.expires_at
      ? new Date(token.expires_at * 1000).toISOString()
      : '',
    scope: token.scope ?? '',
  });
}
