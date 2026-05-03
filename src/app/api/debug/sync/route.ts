import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDb } from '@/db';

/**
 * Reports what mode the auth + sync stack is actually running in. Hit
 * /api/debug/sync after signing in to confirm whether you're getting
 * database sessions (DB writes happen) or JWT sessions (DB writes don't).
 */
export async function GET() {
  const db = getDb();
  let session: any = null;
  let sessionError: string | null = null;
  try {
    session = await auth();
  } catch (err: any) {
    sessionError = err?.message ?? String(err);
  }

  return NextResponse.json({
    db: {
      configured: Boolean(db),
      databaseUrlPresent: Boolean(process.env.DATABASE_URL),
      databaseUrlLooksRight: /^postgres(ql)?:\/\//.test(
        (process.env.DATABASE_URL ?? '').trim(),
      ),
    },
    auth: {
      googleConfigured: Boolean(process.env.AUTH_GOOGLE_ID),
      authSecretPresent: Boolean(process.env.AUTH_SECRET),
      // 'database' if adapter is registered, 'jwt' otherwise
      sessionStrategy: db ? 'database' : 'jwt',
      sessionError,
      signedIn: Boolean(session?.user),
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
    },
  });
}
