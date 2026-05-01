import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const TOKEN_URLS: Record<string, string> = {
  strava: 'https://www.strava.com/api/v3/oauth/token',
  withings: 'https://wbsapi.withings.net/v2/oauth2',
  garmin: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
};

const ENV_KEYS: Record<string, [string, string]> = {
  strava: ['STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET'],
  withings: ['WITHINGS_CLIENT_ID', 'WITHINGS_CLIENT_SECRET'],
  garmin: ['GARMIN_CLIENT_ID', 'GARMIN_CLIENT_SECRET'],
};

export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const tokenUrl = TOKEN_URLS[provider];
  const keys = ENV_KEYS[provider];
  if (!code || !tokenUrl || !keys) {
    return NextResponse.redirect(new URL('/app/settings?oauth=error', url.origin));
  }
  const [idEnv, secretEnv] = keys;
  const clientId = process.env[idEnv];
  const clientSecret = process.env[secretEnv];
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/app/settings?oauth=missing-keys', url.origin));
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
    return NextResponse.redirect(new URL('/app/settings?oauth=token-failed', url.origin));
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from('integrations').upsert(
        {
          user_id: u.user.id,
          provider,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          expires_at: token.expires_at
            ? new Date(token.expires_at * 1000).toISOString()
            : null,
          scope: token.scope ?? null,
        },
        { onConflict: 'user_id,provider' },
      );
    }
  } catch {
    // user not signed in or supabase not configured — silently skip persistence
  }

  return NextResponse.redirect(new URL(`/app/settings?oauth=${provider}`, url.origin));
}
