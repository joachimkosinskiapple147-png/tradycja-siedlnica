-- ============================================================================
--  Tradycja Siedlnica — migracja 0001: system administratorów + pełny CMS
--  Uruchom w Supabase → SQL Editor (zaznacz cały plik i kliknij Run).
--
--  BEZPIECZEŃSTWO:
--  - Skrypt jest addytywny i idempotentny (bezpieczny do wielokrotnego
--    uruchomienia). NIE usuwa tabel ani wierszy.
--  - Jedyna zmiana danych: dodanie kolumn (z wartościami domyślnymi) do
--    istniejących tabel. Istniejące dane koni/wydarzeń/wiadomości itd. nie są
--    ruszane.
--  - Zmienia reguły RLS tak, aby zapis/odczyt szkiców w panelu wymagał wpisu
--    w tabeli public.admins (a nie — jak dotychczas — dowolnego zalogowanego
--    użytkownika). Publiczny odczyt treści opublikowanych bez zmian.
-- ============================================================================

-- ── 1) Tabela administratorów ────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Funkcja pomocnicza — SECURITY DEFINER, aby uniknąć rekurencji RLS przy
-- sprawdzaniu uprawnień z poziomu innych polityk.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Tylko administratorzy mogą odczytać listę administratorów. Zapis do tej
-- tabeli odbywa się wyłącznie ręcznie (SQL Editor / service role) — brak
-- polityk insert/update/delete dla ról anon/authenticated (domyślna odmowa).
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select to authenticated using (public.is_admin());

-- ── 2) Filmy koni — kategoria i widoczność ──────────────────────────────────
alter table public.horse_videos add column if not exists category text;
alter table public.horse_videos add column if not exists publish boolean not null default true;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'horse_videos_category_check'
  ) then
    alter table public.horse_videos
      add constraint horse_videos_category_check
      check (category is null or category in
        ('przejazd','trening','skoki','ujezdzenie','zawody','prezentacja','inne'));
  end if;
end $$;

-- ── 3) RLS: przełączenie z „każdy zalogowany” na „tylko administrator” ─────
--  Wzorzec: publiczny odczyt bez zmian; zapis/odczyt szkiców -> is_admin().
do $$
declare t text;
begin
  foreach t in array array[
    'horses','horse_images','horse_videos','horse_pedigree',
    'events','event_images','event_videos','event_horses',
    'albums','album_images',
    'offers',
    'timeline_entries','site_settings','page_content'
  ] loop
    execute format('drop policy if exists %I_auth_all on public.%I;', t, t);
    execute format(
      'create policy %I_auth_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());',
      t, t
    );
  end loop;
end $$;

-- Wiadomości kontaktowe: formularz publiczny nadal może dodać zgłoszenie;
-- odczyt/edycja/usuwanie — tylko administrator.
drop policy if exists messages_auth_read on public.contact_messages;
create policy messages_auth_read on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists messages_auth_modify on public.contact_messages;
create policy messages_auth_modify on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists messages_auth_delete on public.contact_messages;
create policy messages_auth_delete on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- Storage (bucket media): odczyt publiczny bez zmian; zapis tylko dla admina.
drop policy if exists media_auth_write on storage.objects;
create policy media_auth_write on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_auth_update on storage.objects;
create policy media_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists media_auth_delete on storage.objects;
create policy media_auth_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- Koniec migracji 0001.
-- ============================================================================
--  PO URUCHOMIENIU: dodaj pierwszego administratora.
--  1. Authentication → Users → Add user (podaj e-mail, hasło, zaznacz
--     „Auto Confirm User”) — jeśli konto jeszcze nie istnieje.
--  2. W SQL Editor uruchom (podmieniając e-mail, jeśli inny):
--
--     insert into public.admins (user_id)
--     select id from auth.users where email = 'tradycja.siedlnica@gmail.com'
--     on conflict (user_id) do nothing;
--
--  Bez wpisu w public.admins zalogowany użytkownik NIE będzie mógł zapisywać
--  ani czytać treści w panelu (poza własnym loginem) — to celowe zabezpieczenie.
-- ============================================================================
