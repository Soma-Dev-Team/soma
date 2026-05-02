import { NextResponse } from 'next/server';

interface ProviderConfig {
  authUrl: string;
  scope: string;
  clientIdEnv: string;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  strava: {
    authUrl: 'https://www.strava.com/oauth/authorize',
    scope: 'read,activity:read_all',
    clientIdEnv: 'STRAVA_CLIENT_ID',
  },
  withings: {
    authUrl: 'https://account.withings.com/oauth2_user/authorize2',
    scope: 'user.metrics,user.activity',
    clientIdEnv: 'WITHINGS_CLIENT_ID',
  },
  garmin: {
    authUrl: 'https://connect.garmin.com/oauthConfirm',
    scope: '',
    clientIdEnv: 'GARMIN_CLIENT_ID',
  },
};

export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(req.url);
  const cfg = PROVIDERS[provider];
  if (!cfg) {
    return NextResponse.redirect(
      new URL(`/app/settings#oauth=${provider}&status=unknown-provider`, url.origin),
    );
  }
  const clientId = process.env[cfg.clientIdEnv];
  if (!clientId) {
    return NextResponse.redirect(
      new URL(`/app/settings#oauth=${provider}&status=missing-keys`, url.origin),
    );
  }
  const redirect = `${url.origin}/api/oauth/${provider}/callback`;
  const auth = new URL(cfg.authUrl);
  auth.searchParams.set('client_id', clientId);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('redirect_uri', redirect);
  if (cfg.scope) auth.searchParams.set('scope', cfg.scope);
  return NextResponse.redirect(auth);
}
