create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age int,
  height_cm int,
  weight_kg numeric,
  sex text check (sex in ('male','female')),
  goal text,
  tdee numeric,
  lang text default 'zh-Hant'
);

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_at timestamptz default now(),
  items jsonb not null,
  image_url text
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text,
  intensity text,
  duration_min numeric,
  met numeric,
  avg_hr numeric,
  calories numeric,
  logged_at timestamptz default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  youtube_url text,
  title text,
  tags text[],
  created_at timestamptz default now()
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text,
  title text,
  tags text[],
  per_serving_calories numeric,
  created_at timestamptz default now()
);