import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOffers, getOfferBySlug, getSiteSettings } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/Primitives';
import { OfferCard } from '@/components/site/Cards';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const offers = await getOffers();
  return offers.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const o = await getOfferBySlug(params.slug);
  if (!o) return {};
  return buildMetadata({ title: o.title, description: o.excerpt, path: `/oferta/${o.slug}`, image: o.image.url });
}

export default async function OfferPage({ params }: { params: { slug: string } }) {
  const offer = await getOfferBySlug(params.slug);
  if (!offer || !offer.active) notFound();
  const settings = await getSiteSettings();
  const others = (await getOffers()).filter((o) => o.slug !== offer.slug).slice(0, 3);
  return (
    <>
      <PageHero eyebrow="Oferta" title={offer.title} intro={offer.excerpt}
        image={offer.image.url} imageAlt={offer.image.alt}
        crumbs={[{ name: 'Oferta', path: '/oferta' }, { name: offer.title, path: `/oferta/${offer.slug}` }]} />
      <section className="bg-ivory py-section">
        <div className="shell grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="card-app animate-rise p-5 sm:p-7">
            {offer.body && <p className="prose-lux whitespace-pre-line">{offer.body}</p>}
            {offer.benefits && offer.benefits.length > 0 && (
              <>
                <h2 className="mt-6 font-display text-2xl font-semibold text-navy">Co zawiera</h2>
                <ul className="mt-3 space-y-2">
                  {offer.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-[0.9rem] font-semibold text-navy">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[0.7rem] text-ivory">✓</span>{b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside className="space-y-4">
            <div className="card-app overflow-hidden">
              <div className="bg-navy p-5 text-ivory">
                <div className="text-[0.68rem] font-bold uppercase tracking-eyebrow text-brass-soft">Cena</div>
                <div className="mt-1 font-display text-2xl font-semibold">{offer.price ?? 'Cena na zapytanie'}</div>
              </div>
              <div className="space-y-2 p-4">
                <Link href={`/kontakt?temat=${encodeURIComponent(offer.title)}`} className="btn-primary w-full">Zapytaj o ofertę</Link>
                <a href={`tel:${settings.phone_href}`} className="btn-ghost w-full">Zadzwoń: {settings.phone}</a>
                <Link href="/oferta" className="btn-ghost w-full !border-transparent">← Cała oferta</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
      {others.length > 0 && (
        <section className="bg-cream py-section">
          <div className="shell">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-display text-display-sm font-semibold text-navy">Pozostałe usługi</h2>
              <Link href="/oferta" className="btn-ghost self-start !py-2.5 md:self-auto">Cała oferta</Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {others.map((o) => (<OfferCard key={o.id} offer={o} />))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
