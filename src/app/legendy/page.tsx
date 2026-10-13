import { getLegends } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/Primitives';
import LegendCard from '@/components/site/LegendCard';
import Reveal from '@/components/ui/Reveal';

export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Legendy — wyhodowane u nas', description: 'Konie wyhodowane i wyszkolone w Siedlnicy, dziś w sporcie i hodowli. Nasze legendy.', path: '/legendy' });

export default async function LegendsPage() {
  const list = await getLegends();
  return (
    <>
      <PageHero eyebrow="Wyhodowane u nas" title="Legendy" intro="Konie, które urodziły się lub wychowały w naszej stajni, a dziś piszą historię gdzie indziej. Nasza duma."
        image="/images/full/konie-nad-woda.webp" imageAlt="Legendy stajni Tradycja Siedlnica"
        crumbs={[{ name: 'Legendy', path: '/legendy' }]} />
      <section className="bg-ivory py-section">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {list.map((l, i) => (<Reveal key={l.id} delay={(i % 3) * 70}><LegendCard legend={l} /></Reveal>))}
          </div>
        </div>
      </section>
    </>
  );
}
