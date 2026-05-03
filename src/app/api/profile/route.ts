import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { getDb } from '@/db';
import { users, type SyncedProfile } from '@/db/schema';

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'sync-disabled' }, { status: 501 });

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ profile: null }, { status: 200 });

  const rows = await db
    .select({ profile: users.profile, profileUpdatedAt: users.profileUpdatedAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const row = rows[0];
  return NextResponse.json({
    profile: row?.profile ?? null,
    updated_at: row?.profileUpdatedAt?.toISOString() ?? null,
  });
}

export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'sync-disabled' }, { status: 501 });

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { profile?: SyncedProfile } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 });
  }

  const profile = body.profile ?? {};
  await db
    .update(users)
    .set({ profile, profileUpdatedAt: new Date() })
    .where(eq(users.id, userId));

  return NextResponse.json({ ok: true });
}
