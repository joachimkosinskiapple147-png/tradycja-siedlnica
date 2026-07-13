-- ============================================================================
--  Tradycja Siedlnica — schemat bazy danych (Supabase / PostgreSQL)
--  Uruchom w Supabase → SQL Editor (lub przez migracje).
--  Bezpieczny do wielokrotnego uruchomienia (IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Funkcja pomocnicza: automatyczne updated_at ─────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================================
--  KONIE
-- ============================================================================
create table if not exists public.horses (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  full_name      text,
  status         text not null default 'na_sprzedaz'
                 check (status in ('na_sprzedaz','zarezerwowany','sprzedany','niedostepny')),
  publish        text not null default 'szkic'
                 check (publish in ('szkic','opublikowany','ukryty')),
  featured       boolean not null default false,
  position       integer not null default 0,
  birth_year     integer,
  birth_date     date,
  sex            text not null default 'walach'
                 check (sex in ('ogier','klacz','walach','zrebak')),
  breed          text,
  color          text,
  height_cm      integer,
  origin         text,
  discipline     text,
  training_level text,
  temperament    text,
  training_state text,
  achievements   text,
  description    text,
  price          text default 'Cena na zapytanie',
  seo_title      text,
  seo_description text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists horses_publish_idx  on public.horses (publish);
create index if not exists horses_status_idx   on public.horses (status);
create index if not exists horses_position_idx on public.horses (position);
drop trigger if exists horses_updated_at on public.horses;
create trigger horses_updated_at before update on public.horses
  for each row execute function public.set_updated_at();

create table if not exists public.horse_images (
  id         uuid primary key default gen_random_uuid(),
  horse_id   uuid not null references public.horses(id) on delete cascade,
  url        text not null,
  thumb      text,
  alt        text,
  caption    text,
  position   integer not null default 0,
  is_cover   boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists horse_images_horse_idx on public.horse_images (horse_id, position);

create table if not exists public.horse_videos (
  id          uuid primary key default gen_random_uuid(),
  horse_id    uuid not null references public.horses(id) on delete cascade,
  youtube_id  text not null,
  title       text,
  description text,
  position    integer not null default 0
);
create index if not exists horse_videos_horse_idx on public.horse_videos (horse_id, position);

create table if not exists public.horse_pedigree (
  horse_id   uuid primary key references public.horses(id) on delete cascade,
  sire       text,
  dam        text,
  damsire    text,
  sire_line  text,
  dam_line   text,
  notes      text
);

-- ============================================================================
--  WYDARZENIA  (moduł panelu: etap 2 — tabele gotowe do użycia)
-- ============================================================================
create table if not exists public.events (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  category   text,
  date       date not null,
  location   text,
  cover_url  text,
  cover_alt  text,
  excerpt    text,
  body       text,
  results    text,
  publish    text not null default 'szkic'
             check (publish in ('szkic','opublikowany','ukryty')),
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

create table if not exists public.event_images (
  id       uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  url text not null, thumb text, alt text, position integer not null default 0
);
create table if not exists public.event_videos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  youtube_id text not null, title text, position integer not null default 0
);
create table if not exists public.event_horses (
  event_id uuid not null references public.events(id) on delete cascade,
  horse_id uuid not null references public.horses(id) on delete cascade,
  primary key (event_id, horse_id)
);

-- ============================================================================
--  GALERIE
-- ============================================================================
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  date date,
  cover_url text, cover_alt text,
  publish text not null default 'szkic'
          check (publish in ('szkic','opublikowany','ukryty')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists albums_updated_at on public.albums;
create trigger albums_updated_at before update on public.albums
  for each row execute function public.set_updated_at();

create table if not exists public.album_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  url text not null, thumb text, alt text, position integer not null default 0
);
create index if not exists album_images_album_idx on public.album_images (album_id, position);

-- ============================================================================
--  OFERTA
-- ============================================================================
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  image_url text, image_alt text,
  price text,
  benefits text[],
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists offers_updated_at on public.offers;
create trigger offers_updated_at before update on public.offers
  for each row execute function public.set_updated_at();

-- ============================================================================
--  OŚ CZASU
-- ============================================================================
create table if not exists public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  image_url text, image_alt text,
  position integer not null default 0
);

-- ============================================================================
--  USTAWIENIA + TREŚCI STRONY (klucz-wartość JSON)
-- ============================================================================
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.page_content (
  key text primary key,          -- np. 'home', 'about'
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================================
--  WIADOMOŚCI KONTAKTOWE
-- ============================================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  country text,
  subject text,
  message text not null,
  horse_slug text,
  horse_name text,
  status text not null default 'nowa'
         check (status in ('nowa','w_toku','zamknieta')),
  note text
);
create index if not exists contact_messages_status_idx on public.contact_messages (status, created_at desc);

-- ============================================================================
--  RLS — Row Level Security
--  Zasada: publiczny (anon) odczyt treści OPUBLIKOWANYCH; pełny dostęp tylko
--  dla zalogowanych (authenticated). Wiadomości: anon może tylko dodać.
-- ============================================================================
alter table public.horses            enable row level security;
alter table public.horse_images      enable row level security;
alter table public.horse_videos      enable row level security;
alter table public.horse_pedigree    enable row level security;
alter table public.events            enable row level security;
alter table public.event_images      enable row level security;
alter table public.event_videos      enable row level security;
alter table public.event_horses      enable row level security;
alter table public.albums            enable row level security;
alter table public.album_images      enable row level security;
alter table public.offers            enable row level security;
alter table public.timeline_entries  enable row level security;
alter table public.site_settings     enable row level security;
alter table public.page_content      enable row level security;
alter table public.contact_messages  enable row level security;

-- Konie: publiczny odczyt opublikowanych
drop policy if exists horses_public_read on public.horses;
create policy horses_public_read on public.horses
  for select using (publish = 'opublikowany');
drop policy if exists horses_auth_all on public.horses;
create policy horses_auth_all on public.horses
  for all to authenticated using (true) with check (true);

-- Powiązane z koniem (zdjęcia/wideo/rodowód): odczyt, gdy koń opublikowany
drop policy if exists horse_images_public_read on public.horse_images;
create policy horse_images_public_read on public.horse_images for select using (
  exists (select 1 from public.horses h where h.id = horse_id and h.publish = 'opublikowany'));
drop policy if exists horse_images_auth_all on public.horse_images;
create policy horse_images_auth_all on public.horse_images for all to authenticated using (true) with check (true);

drop policy if exists horse_videos_public_read on public.horse_videos;
create policy horse_videos_public_read on public.horse_videos for select using (
  exists (select 1 from public.horses h where h.id = horse_id and h.publish = 'opublikowany'));
drop policy if exists horse_videos_auth_all on public.horse_videos;
create policy horse_videos_auth_all on public.horse_videos for all to authenticated using (true) with check (true);

drop policy if exists horse_pedigree_public_read on public.horse_pedigree;
create policy horse_pedigree_public_read on public.horse_pedigree for select using (
  exists (select 1 from public.horses h where h.id = horse_id and h.publish = 'opublikowany'));
drop policy if exists horse_pedigree_auth_all on public.horse_pedigree;
create policy horse_pedigree_auth_all on public.horse_pedigree for all to authenticated using (true) with check (true);

-- Wydarzenia / galerie / oferta / oś czasu / ustawienia — analogiczny wzorzec
do $$
declare t text;
begin
  foreach t in array array['events','albums'] loop
    execute format('drop policy if exists %I_public_read on public.%I;', t, t);
    execute format('create policy %I_public_read on public.%I for select using (publish = ''opublikowany'');', t, t);
    execute format('drop policy if exists %I_auth_all on public.%I;', t, t);
    execute format('create policy %I_auth_all on public.%I for all to authenticated using (true) with check (true);', t, t);
  end loop;
  foreach t in array array['event_images','event_videos','event_horses','album_images','timeline_entries','site_settings','page_content'] loop
    execute format('drop policy if exists %I_public_read on public.%I;', t, t);
    execute format('create policy %I_public_read on public.%I for select using (true);', t, t);
    execute format('drop policy if exists %I_auth_all on public.%I;', t, t);
    execute format('create policy %I_auth_all on public.%I for all to authenticated using (true) with check (true);', t, t);
  end loop;
end $$;

-- Oferta: publiczny odczyt tylko aktywnych ofert
drop policy if exists offers_public_read on public.offers;
create policy offers_public_read on public.offers
  for select using (active = true);

drop policy if exists offers_auth_all on public.offers;
create policy offers_auth_all on public.offers
  for all to authenticated using (true) with check (true);

-- Wiadomości: anon może dodać (formularz), tylko zalogowani czytają/edytują
drop policy if exists messages_public_insert on public.contact_messages;
create policy messages_public_insert on public.contact_messages
  for insert to anon, authenticated with check (true);
drop policy if exists messages_auth_read on public.contact_messages;
create policy messages_auth_read on public.contact_messages
  for select to authenticated using (true);
drop policy if exists messages_auth_modify on public.contact_messages;
create policy messages_auth_modify on public.contact_messages
  for update to authenticated using (true) with check (true);
drop policy if exists messages_auth_delete on public.contact_messages;
create policy messages_auth_delete on public.contact_messages
  for delete to authenticated using (true);

-- ============================================================================
--  STORAGE — bucket na zdjęcia koni/galerii (publiczny odczyt)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists media_auth_write on storage.objects;
create policy media_auth_write on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
drop policy if exists media_auth_update on storage.objects;
create policy media_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'media');
drop policy if exists media_auth_delete on storage.objects;
create policy media_auth_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- Koniec schematu.
