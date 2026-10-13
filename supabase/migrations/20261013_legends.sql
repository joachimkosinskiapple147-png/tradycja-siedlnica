create table if not exists legends (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null,
  breed text, birth_year int, color text,
  years_at_stable text, where_now text,
  achievements text, story text,
  image_url text, image_alt text,
  featured boolean default false, position int default 0,
  publish text default 'opublikowany', created_at timestamptz default now()
);
alter table legends enable row level security;
drop policy if exists "public read legends" on legends;
create policy "public read legends" on legends for select using (publish = 'opublikowany');
