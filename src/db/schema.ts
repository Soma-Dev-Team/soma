import { pgTable, text, timestamp, primaryKey, integer, jsonb } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

/*
 * Auth.js v5 tables only. Soma's nutrition/weight data continues to live in
 * IndexedDB on each device — these tables exist solely so Auth.js can persist
 * users, OAuth accounts, sessions, and email verification tokens.
 */

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  /**
   * Synced Soma profile. Holds theme/palette + onboarding values + macro
   * targets so they follow you between devices when signed in. Mutable from
   * the client via /api/profile.
   */
  profile: jsonb('profile').$type<SyncedProfile | null>().default(null),
  profileUpdatedAt: timestamp('profileUpdatedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export interface SyncedProfile {
  theme?: string;
  units?: 'metric' | 'imperial';
  locale?: string;
  sex?: 'male' | 'female' | 'other';
  birth_date?: string;
  height_cm?: number;
  activity_level?: string;
  goal?: string;
  goal_pace?: string;
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  start_weight_kg?: number;
  target_weight_kg?: number;
  display_name?: string;
  onboarded?: boolean;
}

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (a) => ({ pk: primaryKey({ columns: [a.provider, a.providerAccountId] }) }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({ pk: primaryKey({ columns: [vt.identifier, vt.token] }) }),
);
