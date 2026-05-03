import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SomaMark } from '@/components/soma-mark';
import { Lock } from 'lucide-react';
import { auth, signIn, isAuthConfigured, hasGoogleOAuth, hasMagicLink } from '@/auth';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const session = isAuthConfigured ? await auth() : null;
  if (session?.user) redirect(next ?? '/app');

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" aria-label="Soma">
            <SomaMark size={24} />
          </Link>
          <CardTitle className="mt-4 text-2xl wordmark">
            {isAuthConfigured ? 'sign in' : 'no account needed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {isAuthConfigured ? (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in to back up your data across devices. Your local logs stay on this device
                until you sign in.
              </p>

              {hasGoogleOAuth && (
                <form
                  action={async () => {
                    'use server';
                    await signIn('google', { redirectTo: next ?? '/app' });
                  }}
                >
                  <Button type="submit" variant="secondary" className="w-full gap-2">
                    <GoogleIcon /> Continue with Google
                  </Button>
                </form>
              )}

              {hasMagicLink && hasGoogleOAuth && (
                <div className="flex items-center gap-3 label-mono text-muted-foreground">
                  <div className="flex-1 h-px bg-border" />
                  or
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}

              {hasMagicLink && (
                <form
                  action={async (formData: FormData) => {
                    'use server';
                    try {
                      await signIn('nodemailer', {
                        email: formData.get('email') as string,
                        redirectTo: next ?? '/app',
                      });
                    } catch (err: any) {
                      // Auth.js v5 throws a redirect on success; only
                      // surface real errors.
                      if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err;
                      const message = encodeURIComponent(
                        err?.message ?? 'Could not send magic link',
                      );
                      const { redirect } = await import('next/navigation');
                      redirect(`/login?error=${message}`);
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="submit" className="w-full">
                    Email me a magic link
                  </Button>
                </form>
              )}

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  Sign-in failed: {error}. Try again, or continue without an account.
                </p>
              )}

              <div className="pt-2 border-t border-border">
                <Link href="/app" className="text-xs text-muted-foreground hover:text-foreground">
                  Continue without an account →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Soma runs entirely in your browser. There's no signup, no password, and nothing to
                verify. Open the app and your data stays on this device.
              </p>
              <div className="rounded-lg border border-border p-3 flex gap-3 items-start text-xs text-muted-foreground">
                <Lock size={14} className="mt-0.5 shrink-0" />
                <span>
                  Use <strong>Settings → Export JSON</strong> to back up before clearing site data
                  or switching devices.
                </span>
              </div>
              <Link href="/app" className="block">
                <Button className="w-full">Open app</Button>
              </Link>
            </>
          )}

          <p className="label-mono text-muted-foreground text-center pt-2">
            <Link href="/" className="hover:text-foreground">
              ← BACK
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
