import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getDashboardStats, getUnreadMessagesCount, getExtendedDashboardStats } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';

export const dynamic = 'force-dynamic';

function SetupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6 py-16 text-ivory">
      <div className="w-full max-w-2xl">
        <span className="eyebrow !text-brass-soft">Panel administracyjny</span>
        <h1 className="mt-4 font-display text-display-md font-semibold !text-ivory">Najpierw skonfiguruj Supabase</h1>
        <p className="prose-lux mt-4 !text-ivory/75">Panel wymaga bazy i logowania. Strona działa na danych przykładowych — panel włączy się po kluczach.</p>
        <Link href="/" className="btn-ghost-light mt-8">← Wróć na stronę</Link>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  if (!isSupabaseConfigured) return <SetupScreen />;
  const [stats, unread, ext] = await Promise.all([getDashboardStats(), getUnreadMessagesCount(), getExtendedDashboardStats()]);

  const cards = [
    { label: 'Konie łącznie', value: stats.horsesTotal, href: '/admin/konie', hint: 'sprzedaż + hodowla' },
    { label: 'Na sprzedaż', value: stats.horsesForSale, href: '/admin/konie?status=na_sprzedaz', hint: 'aktywne oferty' },
    { label: 'Sprzedane', value: stats.horsesSold, href: '/admin/konie?status=sprzedany', hint: 'archiwum' },
    { label: 'Jeźdźcy', value: ext.riders, href: '/admin/jezdcy', hint: 'profile zespołu' },
    { label: 'Stanówka', value: ext.stallions, href: '/admin/stanowka', hint: 'ogiery kryjące' },
    { label: 'Legendy', value: ext.legends, href: '/admin/legendy', hint: 'hall of fame' },
    { label: 'Nowe wiadomości', value: unread, href: '/admin/wiadomosci', hint: 'skrzynka' },
    { label: 'Wydarzenia', value: stats.events, href: '/admin/wydarzenia', hint: 'kalendarz' },
    { label: 'Albumy', value: stats.albums, href: '/admin/galeria', hint: 'zdjęcia' },
  ];

  const sections = [
    { t: 'Konie', d: 'Dodawaj, edytuj statusy i ceny', href: '/admin/konie', cta: 'Konie' },
    { t: 'Jeźdźcy', d: 'Profile zespołu: zdjęcia, opisy, konie', href: '/admin/jezdcy', cta: 'Jeźdźcy' },
    { t: 'Stanówka', d: 'Ogiery, cennik krycia, nasienie', href: '/admin/stanowka', cta: 'Stanówka' },
    { t: 'Legendy', d: 'Wyhodowane u nas, dziś w świecie', href: '/admin/legendy', cta: 'Legendy' },
    { t: 'Wydarzenia', d: 'Dni otwarte, zawody, relacje', href: '/admin/wydarzenia', cta: 'Wydarzenia' },
    { t: 'Galeria', d: 'Albumy i zdjęcia', href: '/admin/galeria', cta: 'Galeria' },
    { t: 'Oferta', d: 'Usługi: trening, pensjonat, jazdy', href: '/admin/oferta', cta: 'Oferta' },
    { t: 'Strona główna', d: 'Hero, statystyki, wyróżnione', href: '/admin/strona-glowna', cta: 'Edytuj' },
    { t: 'Nasza stajnia', d: 'Historia i oś czasu', href: '/admin/nasza-stajnia', cta: 'Edytuj' },
    { t: 'Wiadomości', d: unread ? unread + ' nieprzeczytanych' : 'Skrzynka pusta', href: '/admin/wiadomosci', cta: 'Skrzynka' },
    { t: 'Ustawienia', d: 'Telefon, adres, SEO, social', href: '/admin/ustawienia', cta: 'Ustawienia' },
  ];

  return (
    <AdminChrome>
      <AdminHeader title="Pulpit" subtitle="Sterowanie stroną — konie, jeźdźcy, stanówka, treści" />
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="card-app card-lift !rounded-2xl p-4">
              <div className="font-display text-4xl font-semibold text-navy">{c.value}</div>
              <div className="mt-1 text-[0.7rem] font-bold uppercase tracking-wide2 text-navy">{c.label}</div>
              <div className="text-[0.74rem] font-medium text-charcoal/55">{c.hint}</div>
            </Link>
          ))}
        </div>

        <div className="card-app !rounded-2xl p-4 sm:p-5">
          <h2 className="font-display text-xl font-semibold text-navy">Szybkie akcje</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/admin/konie/nowy" className="btn-primary !py-2.5">+ Koń</Link>
            <Link href="/admin/jezdcy" className="btn-brass !py-2.5">+ Jeździec</Link>
            <Link href="/admin/stanowka" className="btn-brass !py-2.5">+ Ogier</Link>
            <Link href="/admin/legendy" className="btn-brass !py-2.5">★ Legenda</Link>
            <Link href="/admin/wydarzenia/nowe" className="btn-ghost !py-2.5">+ Wydarzenie</Link>
            <Link href="/admin/galeria/nowy" className="btn-ghost !py-2.5">+ Album</Link>
            <Link href="/admin/oferta/nowa" className="btn-ghost !py-2.5">+ Oferta</Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((s) => (
            <div key={s.t} className="card-app card-lift !rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">{s.t}</h3>
                  <p className="mt-0.5 text-[0.8rem] font-medium text-charcoal/60">{s.d}</p>
                </div>
                <Link href={s.href} className="btn-ghost shrink-0 !px-3.5 !py-2 text-[0.7rem]">{s.cta} →</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="card-app !rounded-2xl border-brass/30 !bg-brass/8 p-4">
          <h3 className="text-[0.72rem] font-bold uppercase tracking-wide2 text-brass-deep">Konto administratora</h3>
          <p className="mt-1 text-[0.84rem] font-medium text-charcoal/75">
            Administratorów dodajesz w Supabase → Authentication → Users. Każdy admin loguje się mailem i hasłem pod /admin/login.
            Nowe działy Jeźdźcy i Stanówka korzystają z tabel <code>riders</code> i <code>stallions</code> — migracja w supabase/migrations/20261013_riders_stallions.sql.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/admin/ustawienia" className="btn-ghost !py-2">Ustawienia</Link>
            <Link href="/admin/wiadomosci" className="btn-ghost !py-2">Wiadomości{unread ? ' (' + unread + ')' : ''}</Link>
            <Link href="/" className="btn-ghost !py-2">Podgląd strony →</Link>
          </div>
        </div>
      </div>
    </AdminChrome>
  );
}
