import Image from 'next/image';
import Link from 'next/link';
import { getOffers } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/Primitives';
import Reveal from '@/components/ui/Reveal';
import { SITE } from '@/lib/constants';

export const metadata = buildMetadata({
  title: 'Oferta',
  description:
    'Sprzedaż i hodowla koni, trening, jazdy konne, rekreacja oraz pensjonat dla koni w stajni Tradycja Siedlnica.',
  path: '/oferta',
});

export default async function OfferPage() {
  const offers = await getOffers();

  return (
    <>
      <PageHero
        eyebrow="Czym się zajmujemy"
        title="Oferta"
        intro="Kompleksowa opieka nad końmi — od hodowli i treningu po sprzedaż, rekreację i pensjonat."
        image="/images/full/nokaut-klus.webp"
        imageAlt="Trening konia na ujeżdżalni"
        crumbs={[{ name: 'Oferta', path: '/oferta' }]}
      />

      <section className="bg-ivory py-section">
        <div className="shell space-y-16 lg:space-y-24">
          {offers.map((offer, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={offer.id}>
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className={`relative aspect-[4/3] overflow-hidden bg-beige-soft ${flip ? 'lg:order-2' : ''}`}>
                    <Image src={offer.image.url} alt={offer.image.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className={flip ? 'lg:order-1' : ''}>
                    <span className="eyebrow text-brass-deep">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="mt-4 text-display-sm font-light text-navy">{offer.title}</h2>
                    {offer.body && <p className="prose-lux mt-4">{offer.body}</p>}
                    {offer.benefits && offer.benefits.length > 0 && (
                      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                        {offer.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-[0.95rem] text-charcoal/80">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      {offer.price && <span className="text-sm font-medium text-brass-deep">{offer.price}</span>}
                      <Link href={`/kontakt?temat=${encodeURIComponent(offer.title)}`} className="btn-primary">Zapytaj o ofertę</Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-navy py-section text-ivory">
        <div className="shell text-center">
          <h2 className="mx-auto max-w-2xl text-display-md font-light">Masz pytania o którąś z usług?</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`tel:${SITE.phoneHref}`} className="btn-brass">Zadzwoń: {SITE.phone}</a>
            <Link href="/kontakt" className="btn-ghost-light">Napisz do nas</Link>
          </div>
        </div>
      </section>
    </>
  );
}
