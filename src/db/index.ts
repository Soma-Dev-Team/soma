import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;
let _initialized = false;

/**
 * Returns a Drizzle/Neon client when DATABASE_URL is configured, otherwise
 * null. Lazy-initialized so the build works without any database env.
 */
export function getDb() {
  if (_initialized) return _db;
  _initialized = true;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    _db = drizzle(sql, { schema });
    return _db;
  } catch (err) {
    console.warn('[soma/db] failed to initialize Neon client:', err);
    _db = null;
    return null;
  }
}

export function hasDb(): boolean {
  return getDb() !== null;
}
