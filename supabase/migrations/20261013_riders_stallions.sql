-- Jeźdźcy + Stanówka (ogiery kryjące)
create table if not exists riders (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, role text not null,
  specialty text, experience text, achievements text, description text,
  image_url text, image_alt text,
  horse_slugs text[] default '{}',
  featured boolean default false, position int default 0,
  publish text default 'opublikowany', created_at timestamptz default now()
);
create table if not exists stallions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, full_name text,
  breed text, birth_year int, color text, height_cm int,
  sire text, dam text, pedigree_notes text,
  description text, achievements text,
  covering_price text, semen text, season text, station text,
  image_url text, image_alt text,
  featured boolean default false, position int default 0,
  publish text default 'opublikowany', created_at timestamptz default now()
);
alter table riders enable row level security;
alter table stallions enable row level security;
drop policy if exists "public read riders" on riders;
create policy "public read riders" on riders for select using (publish = 'opublikowany');
drop policy if exists "public read stallions" on stallions;
create policy "public read stallions" on stallions for select using (publish = 'opublikowany');
