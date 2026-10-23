import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStallions, getStallionBySlug } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Primitives';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const list = await getStallions();
  return list.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = await getStallionBySlug(params.slug);
  if (!s) return {};
  return buildMetadata({ title: `${s.name} — ogier na stanówce`, description: s.description ?? s.breed ?? s.name, path: `/stanowka/${s.slug}` });
}

export default async function StallionPage({ params }: { params: { slug: string } }) {
  const s = await getStallionBySlug(params.slug);
  if (!s || s.publish !== 'opublikowany') notFound();
  return (
    <>
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy pt-[68px]">
        <Image src={s.image.url} alt={s.image.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
        <div className="shell-wide relative z-10 pb-10 pt-8 text-ivory">
          <Breadcrumbs items={[{ name: 'Stanówka', path: '/stanowka' }, { name: s.name, path: `/stanowka/${s.slug}` }]} tone="light" />
          <span className="eyebrow mt-4 text-brass-soft">Ogier na stanówce · {s.breed ?? 'hodowla własna'}</span>
          <h1 className="mt-3 font-display text-display-lg font-semibold text-ivory text-shadow-hero">{s.name}</h1>
        </div>
      </section>
      <section className="bg-ivory py-section">
        <div className="shell grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="card-app animate-rise p-5 sm:p-7">
            <div className="flex flex-wrap gap-2">
              {s.birth_year && <span className="chip">ur. {s.birth_year}</span>}
              {s.color && <span className="chip">{s.color}</span>}
              {s.height_cm && <span className="chip">{s.height_cm} cm</span>}
              {s.semen && <span className="chip !border-brass/40 !text-brass-deep">nasienie: {s.semen}</span>}
            </div>
            {s.description && <p className="prose-lux mt-4">{s.description}</p>}
            {s.pedigree && (
              <div className="mt-6 rounded-2xl bg-ivory p-4">
                <h2 className="font-display text-xl font-semibold text-navy">Rodowód</h2>
                <dl className="mt-2 space-y-1.5 text-[0.9rem] font-medium text-charcoal/80">
                  {s.pedigree.sire && <div className="flex gap-2"><dt className="w-28 shrink-0 text-navy/50">Ojciec</dt><dd>{s.pedigree.sire}</dd></div>}
                  {s.pedigree.dam && <div className="flex gap-2"><dt className="w-28 shrink-0 text-navy/50">Matka</dt><dd>{s.pedigree.dam}</dd></div>}
                  {s.pedigree.notes && <p className="pt-1 text-charcoal/65">{s.pedigree.notes}</p>}
                </dl>
              </div>
            )}
            {s.achievements && <p className="mt-4 rounded-2xl border border-brass/30 bg-brass/8 p-4 text-[0.9rem] font-semibold text-brass-deep">🏆 {s.achievements}</p>}
          </div>
          <aside className="space-y-4">
            <div className="card-app overflow-hidden">
              <div className="bg-navy p-5 text-ivory">
                <div className="text-[0.68rem] font-bold uppercase tracking-eyebrow text-brass-soft">Stanówka 2026</div>
                <div className="mt-1 font-display text-2xl font-semibold">{s.covering_price ?? 'Cena na zapytanie'}</div>
                <div className="mt-1 text-[0.8rem] font-medium text-ivory/70">{s.season ?? 'luty – lipiec'} · {s.station ?? 'Siedlnica'}</div>
              </div>
              <div className="space-y-2 p-4">
                <a href="tel:+48881293333" className="btn-brass w-full">Zadzwoń o krycie</a>
                <Link href="/kontakt" className="btn-ghost w-full">Napisz wiadomość</Link>
                <Link href="/stanowka" className="btn-ghost w-full !border-transparent">← Wszystkie ogiery</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
