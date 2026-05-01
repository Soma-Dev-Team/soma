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
  const cfg = PROVIDERS[provider];
  if (!cfg) return NextResponse.json({ error: 'Unknown provider' }, { status: 404 });
  const clientId = process.env[cfg.clientIdEnv];
  if (!clientId) {
    return NextResponse.json(
      { error: `Set ${cfg.clientIdEnv} in environment to enable ${provider}.` },
      { status: 501 },
    );
  }
  const url = new URL(req.url);
  const redirect = `${url.origin}/api/oauth/${provider}/callback`;
  const auth = new URL(cfg.authUrl);
  auth.searchParams.set('client_id', clientId);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('redirect_uri', redirect);
  if (cfg.scope) auth.searchParams.set('scope', cfg.scope);
  return NextResponse.redirect(auth);
}
