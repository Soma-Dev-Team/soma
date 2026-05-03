import NextAuth, { type NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from './db';

const providers: NextAuthConfig['providers'] = [];

const hasGoogle = Boolean(process.env.830966186655-9i064bm0ba5nn844v886c5njohfphlv4.apps.googleusercontent.com && process.env.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);
if (hasGoogle) {
  providers.push(
    Google({
      clientId: process.env.830966186655-9i064bm0ba5nn844v886c5njohfphlv4.apps.googleusercontent.com!,
      clientSecret: process.env.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!,
    }),
  );
}

const db = getDb();
const adapter = db ? DrizzleAdapter(db) : undefined;

const hasResend = Boolean(adapter && process.env.AUTH_RESEND_KEY && process.env.EMAIL_FROM);
if (hasResend) {
  providers.push(
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.EMAIL_FROM!,
    }),
  );
}

const config: NextAuthConfig = {
  adapter,
  providers,
  // database sessions when Neon is wired up; JWT otherwise (no DB needed)
  session: { strategy: adapter ? 'database' : 'jwt' },
  pages: {
    signIn: '/login',
    verifyRequest: '/login/check-email',
  },
  trustHost: true,
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = (user?.id ?? token?.sub) as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export const { GET, POST } = handlers;

export const isAuthConfigured = providers.length > 0;
export const hasMagicLink = hasResend;
export const hasGoogleOAuth = hasGoogle;
