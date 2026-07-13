import { getUpcomingEvents, getPastEvents } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero, SectionHeader, EmptyState } from '@/components/ui/Primitives';
import { EventCard } from '@/components/site/Cards';
import Reveal from '@/components/ui/Reveal';

export const metadata = buildMetadata({
  title: 'Wydarzenia',
  description: 'Zawody, dni otwarte, prezentacje i aktualności ze stajni Tradycja Siedlnica.',
  path: '/wydarzenia',
});

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <>
      <PageHero
        eyebrow="Z życia stajni"
        title="Wydarzenia i aktualności"
        intro="Zawody, dni otwarte i prezentacje koni. Zapraszamy do śledzenia życia naszej stajni."
        image="/images/full/skok-przez-przeszkode.webp"
        imageAlt="Koń w skoku podczas wydarzenia"
        crumbs={[{ name: 'Wydarzenia', path: '/wydarzenia' }]}
      />

      <section className="bg-ivory py-section">
        <div className="shell">
          <SectionHeader eyebrow="Nadchodzące" title="Przed nami" />
          {upcoming.length === 0 ? (
            <p className="mt-8 text-charcoal/60">Obecnie nie mamy zaplanowanych wydarzeń. Zapraszamy wkrótce.</p>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 80}><EventCard event={e} /></Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream py-section">
        <div className="shell">
          <SectionHeader eyebrow="Archiwum" title="Zakończone wydarzenia" />
          {past.length === 0 ? (
            <div className="mt-8"><EmptyState title="Archiwum jest puste" message="Zakończone wydarzenia pojawią się tutaj." /></div>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 80}><EventCard event={e} /></Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
