import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getDashboardStats, getUnreadMessagesCount } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';

export const dynamic = 'force-dynamic';

function SetupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6 py-16 text-ivory">
      <div className="w-full max-w-2xl">
        <span className="eyebrow text-brass-soft">Panel administracyjny</span>
        <h1 className="mt-5 font-display text-display-md font-light">Najpierw skonfiguruj Supabase</h1>
        <p className="prose-lux mt-5 text-ivory/75">
          Panel wymaga połączenia z bazą danych i systemem logowania (Supabase). Strona publiczna działa
          już teraz na danych przykładowych — panel włączy się po dodaniu kluczy.
        </p>
        <ol className="mt-8 space-y-4">
          {[
            'Załóż projekt na supabase.com i skopiuj URL oraz klucz „anon”.',
            'Utwórz plik .env.local na podstawie .env.example i wklej klucze.',
            'Uruchom migracje z supabase/schema.sql oraz (opcjonalnie) supabase/seed.sql.',
            'Dodaj pierwszego użytkownika-administratora w panelu Supabase (Authentication → Users).',
            'Zrestartuj aplikację — panel będzie dostępny pod /admin/login.',
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/50 font-display text-brass-soft">
                {i + 1}
              </span>
              <span className="pt-1 text-ivory/80">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-ivory/50">
          Pełna instrukcja krok po kroku znajduje się w pliku <code className="text-brass-soft">README.md</code> oraz{' '}
          <code className="text-brass-soft">supabase/README.md</code>.
        </p>
        <Link href="/" className="btn-ghost-light mt-8">← Wróć na stronę</Link>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  if (!isSupabaseConfigured) return <SetupScreen />;

  const [stats, unread] = await Promise.all([getDashboardStats(), getUnreadMessagesCount()]);

  const cards = [
    { label: 'Konie łącznie', value: stats.horsesTotal, href: '/admin/konie' },
    { label: 'Na sprzedaż', value: stats.horsesForSale, href: '/admin/konie?status=na_sprzedaz' },
    { label: 'Sprzedane', value: stats.horsesSold, href: '/admin/konie?status=sprzedany' },
    { label: 'Nowe wiadomości', value: unread, href: '/admin/wiadomosci' },
  ];

  return (
    <AdminChrome>
      <AdminHeader title="Pulpit" subtitle="Przegląd zawartości serwisu" />
      <div className="p-6 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="group border border-navy/12 bg-ivory p-6 transition-colors hover:border-navy/30">
              <div className="font-display text-5xl font-light text-navy">{c.value}</div>
              <div className="mt-2 text-[0.72rem] uppercase tracking-wide2 text-charcoal/55 group-hover:text-brass-deep">
                {c.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="border border-navy/12 bg-ivory p-6">
            <h2 className="font-display text-xl text-navy">Szybkie akcje</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/admin/konie/nowy" className="btn-primary">Dodaj konia</Link>
              <Link href="/admin/konie" className="btn-ghost">Zarządzaj końmi</Link>
              <Link href="/admin/wiadomosci" className="btn-ghost">Skrzynka wiadomości</Link>
            </div>
          </div>
          <div className="border border-brass/40 bg-brass/5 p-6">
            <h2 className="font-display text-xl text-navy">Moduły w przygotowaniu</h2>
            <p className="prose-lux mt-3 text-sm text-charcoal/75">
              Wydarzenia, Galerie, Oferta, treści Strony głównej i Ustawienia działają obecnie na danych
              przykładowych. Ich edycja w panelu powstaje w kolejnym etapie — według tego samego wzorca,
              co moduł Konie (baza + formularz + lista).
            </p>
          </div>
        </div>
      </div>
    </AdminChrome>
  );
}
