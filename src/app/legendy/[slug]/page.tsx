import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getLegends, getLegendBySlug } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Primitives';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const list = await getLegends({ includeUnpublished: true });
  return list.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const l = await getLegendBySlug(params.slug);
  if (!l) return {};
  return buildMetadata({ title: `${l.name} — legenda stajni`, description: l.story ?? l.achievements ?? l.name, path: `/legendy/${l.slug}` });
}

export default async function LegendPage({ params }: { params: { slug: string } }) {
  const l = await getLegendBySlug(params.slug);
  if (!l || l.publish !== 'opublikowany') notFound();
  return (
    <>
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy pt-[68px]">
        <Image src={l.image.url} alt={l.image.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
        <div className="shell-wide relative z-10 pb-10 pt-8 text-ivory">
          <Breadcrumbs items={[{ name: 'Legendy', path: '/legendy' }, { name: l.name, path: `/legendy/${l.slug}` }]} tone="light" />
          <span className="eyebrow mt-4 text-brass-soft">★ Wyhodowana u nas legenda</span>
          <h1 className="mt-3 font-display text-display-lg font-semibold text-ivory text-shadow-hero">{l.name}</h1>
          {l.years_at_stable && <p className="mt-2 font-medium text-ivory/85">W stajni: {l.years_at_stable}</p>}
        </div>
      </section>
      <section className="bg-ivory py-section">
        <div className="shell grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="card-app animate-rise p-5 sm:p-7">
            <div className="flex flex-wrap gap-2">
              {l.breed && <span className="chip">{l.breed}</span>}
              {l.birth_year && <span className="chip">ur. {l.birth_year}</span>}
              {l.color && <span className="chip">{l.color}</span>}
            </div>
            {l.story && <p className="prose-lux mt-4 whitespace-pre-line">{l.story}</p>}
            {l.achievements && <p className="mt-4 rounded-2xl border border-brass/30 bg-brass/8 p-4 text-[0.9rem] font-semibold text-brass-deep">🏆 {l.achievements}</p>}
          </div>
          <aside className="space-y-4">
            <div className="card-app overflow-hidden">
              <div className="bg-navy p-5 text-ivory">
                <div className="text-[0.68rem] font-bold uppercase tracking-eyebrow text-brass-soft">Dziś</div>
                <div className="mt-1 font-display text-xl font-semibold">{l.where_now ?? 'W dobrych rękach'}</div>
              </div>
              <div className="space-y-2 p-4">
                <Link href="/konie" className="btn-primary w-full">Zobacz obecne konie</Link>
                <Link href="/legendy" className="btn-ghost w-full">← Wszystkie legendy</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
