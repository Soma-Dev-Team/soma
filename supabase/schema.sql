-- Soma — Supabase schema
-- Run this in the SQL editor of a fresh Supabase project (EU region).

create extension if not exists pgcrypto;

-- profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  sex text check (sex in ('male','female','other')),
  birth_date date,
  height_cm numeric,
  activity_level text,
  goal text,
  goal_pace text,
  target_calories int,
  target_protein_g int,
  target_carbs_g int,
  target_fat_g int,
  units text default 'metric',
  locale text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- weight_logs
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  logged_at timestamptz not null,
  note text,
  created_at timestamptz default now()
);
create index if not exists weight_logs_user_date_idx on weight_logs(user_id, logged_at);

-- foods
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  source text,
  source_id text,
  name text not null,
  brand text,
  serving_size_g numeric,
  serving_label text,
  calories numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  sugar_g numeric,
  sodium_mg numeric,
  micronutrients jsonb,
  created_at timestamptz default now()
);
create index if not exists foods_user_idx on foods(user_id);
create index if not exists foods_source_idx on foods(source, source_id);
create index if not exists foods_name_idx on foods using gin (to_tsvector('simple', coalesce(name,'')));

-- meal_logs
create table if not exists meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_id uuid references foods(id) on delete set null,
  meal text check (meal in ('breakfast','lunch','dinner','snack')),
  servings numeric not null,
  grams numeric,
  logged_at timestamptz not null,
  created_at timestamptz default now()
);
create index if not exists meal_logs_user_date_idx on meal_logs(user_id, logged_at);

-- integrations (encrypt tokens at rest via Supabase Vault if desired)
create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text check (provider in ('strava','garmin','withings')),
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  unique (user_id, provider)
);

-- activity_logs
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text,
  source_id text,
  activity_type text,
  duration_min int,
  calories_burned int,
  started_at timestamptz,
  raw jsonb,
  created_at timestamptz default now(),
  unique (source, source_id)
);
create index if not exists activity_logs_user_date_idx on activity_logs(user_id, started_at);

-- updated_at trigger for profiles
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_touch on profiles;
create trigger profiles_touch before update on profiles
  for each row execute function public.touch_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────
alter table profiles enable row level security;
alter table weight_logs enable row level security;
alter table foods enable row level security;
alter table meal_logs enable row level security;
alter table integrations enable row level security;
alter table activity_logs enable row level security;

drop policy if exists "profiles_self" on profiles;
create policy "profiles_self" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "weight_logs_self" on weight_logs;
create policy "weight_logs_self" on weight_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- foods: user can read their own + global rows; mutate only their own
drop policy if exists "foods_read" on foods;
create policy "foods_read" on foods
  for select using (user_id is null or auth.uid() = user_id);

drop policy if exists "foods_insert_self" on foods;
create policy "foods_insert_self" on foods
  for insert with check (auth.uid() = user_id);

drop policy if exists "foods_update_self" on foods;
create policy "foods_update_self" on foods
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "foods_delete_self" on foods;
create policy "foods_delete_self" on foods
  for delete using (auth.uid() = user_id);

drop policy if exists "meal_logs_self" on meal_logs;
create policy "meal_logs_self" on meal_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "integrations_self" on integrations;
create policy "integrations_self" on integrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "activity_logs_self" on activity_logs;
create policy "activity_logs_self" on activity_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
