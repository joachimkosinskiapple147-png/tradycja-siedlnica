# Supabase — konfiguracja krok po kroku

Ten katalog zawiera wszystko, czego potrzebujesz, aby uruchomić bazę danych,
logowanie i przechowywanie zdjęć dla strony Tradycja Siedlnica.

## Pliki

- `schema.sql` — pełna struktura bazy (tabele, zabezpieczenia RLS, indeksy, bucket na pliki). **Uruchom najpierw.**
- `seed.sql` — opcjonalne dane przykładowe (konie), aby strona i panel miały treść na start.

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
3. Tym e-mailem i hasłem zalogujesz się w `/admin/login`.

> Rejestracja publiczna jest wyłączona — użytkowników dodaje wyłącznie właściciel
> w panelu Supabase. To celowe (panel jest tylko dla obsługi stajni).

## Krok 4 — Klucze w aplikacji

Skopiuj `.env.example` do `.env.local` i uzupełnij:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Zrestartuj aplikację. Od tej chwili strona czyta konie z bazy, a panel jest aktywny.

## Zdjęcia (Storage)

Schemat tworzy publiczny bucket **`media`**. Zdjęcia możesz:

- wgrać w panelu Supabase (Storage → media) i wkleić publiczny URL w edytorze konia, **lub**
- używać plików z katalogu `/public/images/...` (tak działają dane przykładowe).

Bezpośrednie wgrywanie plików z poziomu panelu strony (przeciągnij i upuść do Storage)
to element kolejnego etapu — bucket i uprawnienia są już na to gotowe.

## Bezpieczeństwo (RLS)

- Publiczni odwiedzający widzą **tylko opublikowane** treści.
- Zapis i podgląd szkiców — wyłącznie po zalogowaniu.
- Formularze mogą **dodać** wiadomość, ale nikt niezalogowany jej nie odczyta.
