-- ============================================================================
--  Tradycja Siedlnica — panel zarządza CAŁĄ stroną (2026-10-13)
--  Uruchom w Supabase → SQL Editor PO schema.sql.
--  Bezpieczny do wielokrotnego uruchomienia (IF NOT EXISTS / DROP IF EXISTS).
--
--  Po co: działy Jeźdźcy / Stanówka / Legendy miały tylko odczyt publiczny —
--  administrator nie widział szkiców i nie mógł nic zapisać (brak polityk
--  zapisu). Ta migracja daje administratorom pełny CRUD tych tabel
--  (wzorzec jak w 0001_admin_cms.sql: zapis/odczyt szkiców -> is_admin()).
-- ============================================================================

-- Telefon jeźdźca (opcjonalny, do profilu kontaktowego)
alter table public.riders add column if not exists phone text;

-- ── RLS: zapis + odczyt szkiców tylko dla administratorów ───────────────────
do $$
declare t text;
begin
  foreach t in array array['riders', 'stallions', 'legends'] loop
    execute format('drop policy if exists %I_auth_all on public.%I;', t, t);
    execute format(
      'create policy %I_auth_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());',
      t, t
    );
  end loop;
end $$;
