# Supabase — konfiguracja krok po kroku

Ten katalog zawiera wszystko, czego potrzebujesz, aby uruchomić bazę danych,
logowanie i przechowywanie zdjęć dla strony Tradycja Siedlnica.

## Pliki

- `schema.sql` — pełna struktura bazy (tabele, zabezpieczenia RLS, indeksy, bucket na pliki).
  Zawiera już system administratorów. **Do nowej instalacji od zera — uruchom najpierw.**
- `seed.sql` — opcjonalne dane przykładowe (konie), aby strona i panel miały treść na start.
- `migrations/0001_admin_cms.sql` — migracja dla **istniejącej** bazy (produkcyjnej), która już
  zawiera dane. Dodaje tabelę `public.admins` i przełącza reguły dostępu w panelu z „każdy
  zalogowany” na „tylko administrator”, dodaje kategorię/widoczność filmów koni. Jest addytywna
  i bezpieczna do wielokrotnego uruchomienia — **nie usuwa żadnych tabel ani wierszy**.

## Krok 1 — Załóż projekt

1. Wejdź na [supabase.com](https://supabase.com) i utwórz nowy projekt (darmowy plan wystarczy).
2. Zapisz **Project URL** oraz klucz **anon public** (Project Settings → API).

## Krok 2 — Uruchom schemat

1. W panelu Supabase otwórz **SQL Editor**.
2. Wklej całą zawartość `schema.sql` i kliknij **Run**.
3. (Opcjonalnie) Wklej i uruchom `seed.sql`, aby dodać przykładowe konie.

Skrypt można uruchamiać wielokrotnie — jest bezpieczny (nie duplikuje struktur).

## Krok 3 — Dodaj administratora

1. Authentication → **Users** → **Add user** → podaj e-mail i hasło.
2. Zaznacz „Auto Confirm User”, aby konto było od razu aktywne.
3. W **SQL Editor** uruchom (podmieniając e-mail na właściwy):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'tradycja.siedlnica@gmail.com'
   on conflict (user_id) do nothing;
   ```

4. Tym e-mailem i hasłem zalogujesz się w `/admin/login`.

> Rejestracja publiczna jest wyłączona — użytkowników dodaje wyłącznie właściciel
> w panelu Supabase. Samo utworzenie konta logowania **nie wystarcza** — dopiero wpis
> w tabeli `public.admins` daje dostęp do odczytu/zapisu treści w panelu. Bez tego wpisu
> zalogowanie się powiedzie, ale panel natychmiast wyloguje takie konto (brak uprawnień).

## Aktualizacja istniejącej (produkcyjnej) bazy

Jeśli baza już istnieje i zawiera dane koni/wiadomości, **nie uruchamiaj `schema.sql` ponownie
od zera** — zamiast tego uruchom tylko migrację:

1. Otwórz **SQL Editor** w Supabase.
2. Wklej całą zawartość [`migrations/0001_admin_cms.sql`](./migrations/0001_admin_cms.sql) i kliknij **Run**.
3. Wykonaj krok 3 powyżej (dodanie administratora), jeśli jeszcze nie ma wpisu w `public.admins`.

Migracja jest bezpieczna do wielokrotnego uruchomienia i nie usuwa żadnych danych.

## Krok 4 — Klucze w aplikacji

Skopiuj `.env.example` do `.env.local` i uzupełnij:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Zrestartuj aplikację. Od tej chwili strona czyta konie z bazy, a panel jest aktywny.

## Zdjęcia (Storage)

Schemat tworzy publiczny bucket **`media`**. W panelu (`/admin`) każdy edytor treści
(koń, wydarzenie, album, oferta, strona główna) wgrywa zdjęcia bezpośrednio do tego bucketu —
z paskiem postępu, podglądem, wyborem zdjęcia głównego i możliwością podmiany/usunięcia.
Ręczne wklejanie adresu URL nie jest potrzebne. Zapis do bucketu wymaga zalogowanego konta
wpisanego w `public.admins` (patrz reguły RLS niżej).

## Bezpieczeństwo (RLS)

- Publiczni odwiedzający widzą **tylko opublikowane** (i widoczne) treści — w tym filmy koni
  oznaczone jako ukryte nigdy nie trafiają do publicznego zapytania.
- Zapis i podgląd szkiców — wyłącznie dla kont wpisanych w `public.admins` (nie dla każdego
  zalogowanego użytkownika Supabase Auth).
- Formularze mogą **dodać** wiadomość (anonimowo), ale odczytać/edytować/usunąć ją może
  wyłącznie administrator.
- Zapis do Storage (bucket `media`) — wyłącznie dla administratorów.
