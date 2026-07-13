# Tradycja Siedlnica — strona internetowa

Wielostronicowa, premium strona hodowli koni **Tradycja Siedlnica – Sylwester Kosiński**
zbudowana na Next.js + TypeScript + Tailwind CSS + Supabase, z panelem administracyjnym
(bez potrzeby programowania).

> **Najważniejsze:** strona **działa od razu, bez żadnej konfiguracji** — korzysta wtedy z
> danych przykładowych. Bazę Supabase (edycja treści, logowanie, zdjęcia) podłączasz, gdy
> zechcesz zarządzać treścią samodzielnie. Instrukcja niżej.

---

## Szybki start (lokalnie)

Wymagany **Node.js 18.17+** (zalecany 20+).

```bash
npm install
npm run dev
```

Otwórz **http://localhost:3000**. Strona zadziała na danych przykładowych.
Panel administracyjny (`/admin`) pokaże instrukcję konfiguracji, dopóki nie podłączysz Supabase.

Inne polecenia: `npm run build` (produkcja), `npm run start` (serwer produkcyjny), `npm run typecheck`, `npm run lint`.

---

## Co jest gotowe (ten etap)

**Strona publiczna — w pełni ukończona:**

- Strona główna (hero, statystyki, wyróżnione konie, o stajni, oferta, wydarzenia, galeria, film, kontakt)
- Nasza stajnia (historia, filozofia, obiekty, oś czasu)
- **Konie** — katalog z filtrowaniem (status, płeć, rasa, przeznaczenie), sortowaniem, wyszukiwaniem, paginacją
- **Karta konia** — galeria z powiększeniem, pełne dane, rodowód, filmy YouTube, formularz zapytania, podobne konie
- Galeria (albumy + widok albumu z powiększaniem)
- Wydarzenia (nadchodzące + archiwum + strona wydarzenia)
- Oferta, Kontakt (formularz + mapa + godziny), Polityka prywatności, strona 404
- SEO (metadane, Open Graph, dane strukturalne JSON-LD), `sitemap.xml`, `robots.txt`
- Dostępność (nawigacja klawiaturą, kontrast, „pomiń do treści”, `prefers-reduced-motion`)
- Optymalizacja obrazów (WebP/AVIF), responsywność, płynne animacje

**Panel administracyjny (`/admin`) — pełny CMS:**

- Logowanie / wylogowanie (Supabase Auth), ochrona tras `/admin` — wyłącznie dla kont wpisanych
  do tabeli `public.admins` (patrz sekcja „Administratorzy” niżej)
- Pulpit ze statystykami
- **Konie — pełne zarządzanie (CRUD):** dane szczegółowe, rodowód, zdjęcia (wgrywanie bezpośrednio
  z komputera, kolejność, zdjęcie główne, alt), **filmy YouTube** (dowolna liczba, link
  youtube.com/youtu.be/Shorts, kategoria, tytuł, opis, widoczność, kolejność, podgląd), pola SEO
- **Wydarzenia** — CRUD, okładka, galeria, filmy, powiązane konie, publikacja
- **Galeria** — albumy i zdjęcia w albumach (CRUD, wgrywanie, kolejność)
- **Oferta** — pozycje oferty, zdjęcie, punkty/zalety, aktywność
- **Nasza stajnia** — opis stajni oraz oś czasu (historia)
- **Strona główna** — nagłówek hero, wstęp, statystyki, sekcja „o stajni”, wybór wyróżnionych
  koni/wydarzeń/albumów, sekcja filmu, kolejność i widoczność sekcji
- **Ustawienia** — telefon, e-mail, adres, mapa Google, godziny otwarcia, social media, SEO domyślne, stopka
- **Skrzynka wiadomości:** odczyt zgłoszeń z formularzy, zmiana statusu, notatki, odpowiedź, usuwanie

Każdy zapis odświeża natychmiast odpowiednie strony publiczne (rewalidacja cache).

**Baza danych:** kompletny schemat wszystkich sekcji (konie, wydarzenia, galerie, oferta,
oś czasu, ustawienia, treści stron, wiadomości, administratorzy) z zabezpieczeniami RLS i
bucketem na pliki.

## Administratorzy

Dostęp do panelu (odczyt i zapis szkiców) mają wyłącznie konta wpisane do tabeli
`public.admins` — zwykłe zalogowanie do Supabase Auth **nie** wystarcza. Zobacz
**[`supabase/migrations/0001_admin_cms.sql`](./supabase/migrations/0001_admin_cms.sql)**
oraz sekcję „Dodawanie administratora” w [`supabase/README.md`](./supabase/README.md).

---

## Podłączenie Supabase (edycja treści)

Pełna instrukcja: **[`supabase/README.md`](./supabase/README.md)**. W skrócie:

1. Załóż projekt na [supabase.com](https://supabase.com), skopiuj **URL** i klucz **anon**.
2. W SQL Editor uruchom **`supabase/schema.sql`**, a potem (opcjonalnie) **`supabase/seed.sql`**.
3. Dodaj administratora: Authentication → Users → Add user (z „Auto Confirm”).
4. Skopiuj `.env.example` → `.env.local` i wpisz klucze:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=https://twoja-domena.pl
   ```
5. Uruchom ponownie. Zaloguj się w **`/admin/login`**.

---

## Wdrożenie (Vercel)

1. Wgraj projekt do repozytorium GitHub.
2. Na [vercel.com](https://vercel.com) → **New Project** → wybierz repozytorium (Next.js wykryje się sam).
3. W **Environment Variables** dodaj te same zmienne, co w `.env.local`.
4. **Deploy.** Po wdrożeniu podłącz domenę w Vercel → Settings → Domains i ustaw rekordy DNS
   u rejestratora domeny.

Aplikację można wdrożyć na dowolnym hostingu wspierającym Next.js 14.

---

## Zdjęcia

- Zdjęcia przykładowe leżą w `public/images/full` (duże) i `public/images/thumbs` (miniatury), format **WebP**.
- Nowe zdjęcia: wgraj bezpośrednio w panelu (`/admin`) — każdy edytor (koń, wydarzenie, album,
  oferta, strona główna) ma przycisk „Dodaj zdjęcia” / „Wgraj zdjęcie”, który zapisuje plik od
  razu w Supabase Storage (bucket `media`) i pokazuje pasek postępu. Wklejanie URL-i nie jest
  już potrzebne.
- **Prywatność:** jedno z dostarczonych zdjęć (z wyraźnie widoczną osobą — dzieckiem) **nie zostało
  użyte**. Zanim opublikujesz zdjęcia z rozpoznawalnymi osobami, zadbaj o ich zgodę (a w przypadku
  dzieci — zgodę opiekunów). To ważne ze względów prawnych (RODO/wizerunek).

---

## Powiadomienia e-mail (opcjonalne)

Zgłoszenia z formularzy zapisują się do bazy i są widoczne w panelu (Wiadomości). Aby dodatkowo
otrzymywać e-mail o każdym nowym zgłoszeniu:

1. Załóż konto w [resend.com](https://resend.com) i wygeneruj klucz API.
2. Dodaj `RESEND_API_KEY` oraz `CONTACT_NOTIFICATION_EMAIL` do zmiennych środowiskowych.
3. Włącz wysyłkę w `src/actions/inquiries.ts` (funkcja `notifyAdminEmail` — gotowy „hak”, z komentarzem).

---

## Kopie zapasowe

- **Baza:** Supabase → Database → Backups (automatyczne). Można też eksportować dane ręcznie.
- **Zdjęcia:** kopiuj bucket `media` (Storage) oraz katalog `public/images`.
- **Kod:** repozytorium Git jest kopią całej aplikacji.

---

## Stos technologiczny

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL, Auth, Storage) ·
czcionki self-hosted (Cormorant Garamond + Mulish) · walidacja Zod.

## Struktura projektu

```
src/
  app/            Strony (public + /admin), sitemap, robots
  actions/        Server Actions (formularze, CRUD koni, wiadomości)
  components/     layout · ui · site · admin
  lib/            constants · types · utils · seo · supabase · data (seed + queries)
public/images/    Zdjęcia (full + thumbs) i logo
supabase/         schema.sql · seed.sql · README.md
```
