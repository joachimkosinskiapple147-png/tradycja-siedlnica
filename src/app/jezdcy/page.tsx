import { getRiders } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero, EmptyState } from '@/components/ui/Primitives';
import RiderCard from '@/components/site/RiderCard';
import Reveal from '@/components/ui/Reveal';

export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Jeźdźcy', description: 'Zespół jeźdźców stajni Tradycja Siedlnica — trenerzy, zawodnicy i instruktorzy.', path: '/jezdcy' });

export default async function RidersPage() {
  const riders = await getRiders();
  return (
    <>
      <PageHero eyebrow="Zespół" title="Jeźdźcy" intro="Ludzie, którzy codziennie pracują z naszymi końmi — od hodowli po sport. Kliknij profil, by poznać historię jeźdźca."
        image="/images/full/lonzowanie-lekcja.webp" imageAlt="Jeźdźcy stajni Tradycja Siedlnica"
        crumbs={[{ name: 'Jeźdźcy', path: '/jezdcy' }]} />
      <section className="bg-ivory py-section">
        <div className="shell">
          <div className="segment mb-6 w-fit">
            <span className="on px-4 py-2">Wszyscy{riders.length > 0 ? ` · ${riders.length}` : ''}</span>
            <a href="/konie">Konie</a>
            <a href="/stanowka">Stanówka</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {riders.map((r, i) => (<Reveal key={r.id} delay={(i % 4) * 70}><RiderCard rider={r} /></Reveal>))}
          </div>
          {riders.length === 0 && (
            <EmptyState
              title="Zespół już wkrótce"
              message="Profile jeźdźców są w przygotowaniu. Zadzwoń lub napisz — chętnie opowiemy o naszym zespole."
              action={{ label: 'Kontakt', href: '/kontakt' }}
            />
          )}
        </div>
      </section>
    </>
  );
}
