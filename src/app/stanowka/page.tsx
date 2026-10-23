import { getStallions } from '@/lib/data/queries';
import { STANOWKA_INFO } from '@/lib/data/stallions';
import { buildMetadata } from '@/lib/seo';
import { PageHero, EmptyState } from '@/components/ui/Primitives';
import StallionCard from '@/components/site/StallionCard';
import Reveal from '@/components/ui/Reveal';

export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Stanówka ogierów', description: 'Ogiery na stanówce w Siedlnicy — krycie i nasienie. Cennik, rodowody, kontakt.', path: '/stanowka' });

export default async function StanowkaPage() {
  const list = await getStallions();
  return (
    <>
      <PageHero eyebrow="Hodowla · krycie" title={STANOWKA_INFO.title} intro={STANOWKA_INFO.intro}
        image="/images/full/cyprian-stado.webp" imageAlt="Ogiery na stanówce"
        crumbs={[{ name: 'Stanówka', path: '/stanowka' }]} />
      <section className="bg-ivory py-section">
        <div className="shell">
          <div className="card-app mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex flex-wrap gap-2">
              <span className="chip">🐴 {list.length === 0 ? 'zapytaj o ogiery' : `${list.length} ogiery`}</span>
              <span className="chip">{STANOWKA_INFO.season}</span>
            </div>
            <a href="tel:+48881293333" className="btn-brass !py-2.5">Zapytaj o krycie →</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {list.map((s, i) => (<Reveal key={s.id} delay={(i % 3) * 70}><StallionCard stallion={s} /></Reveal>))}
          </div>
          {list.length === 0 && (
            <EmptyState
              title="Stanówka już wkrótce"
              message="Informacje o ogierach na stanówce są w przygotowaniu. Zadzwoń — doradzimy krycie dla Twojej klaczy."
              action={{ label: 'Zadzwoń: 508 318 339', href: 'tel:+48508318339' }}
            />
          )}
          <p className="mt-6 rounded-2xl border border-navy/10 bg-cream p-4 text-center text-[0.86rem] font-medium text-charcoal/70">
            {STANOWKA_INFO.contact} · {STANOWKA_INFO.season} · dokumentacja PZHK i opieka weterynaryjna na miejscu.
          </p>
        </div>
      </section>
    </>
  );
}
