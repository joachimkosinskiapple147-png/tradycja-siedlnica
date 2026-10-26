import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getRiders, getRiderBySlug, getHorses } from '@/lib/data/queries';
import { isAdmin } from '@/lib/supabase/admin';
import PreviewBanner from '@/components/admin/PreviewBanner';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Primitives';
import HorseCard from '@/components/site/HorseCard';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const riders = await getRiders();
  return riders.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = await getRiderBySlug(params.slug);
  if (!r) return {};
  return buildMetadata({ title: `${r.name} — ${r.role}`, description: r.description ?? r.specialty ?? r.name, path: `/jezdcy/${r.slug}` });
}

export default async function RiderPage({ params }: { params: { slug: string } }) {
  let rider = await getRiderBySlug(params.slug);
  let preview = false;
  if ((!rider || rider.publish !== 'opublikowany') && (await isAdmin())) {
    const p = await getRiderBySlug(params.slug, { preview: true });
    if (p) {
      rider = p;
      preview = true;
    }
  }
  if (!rider || (!preview && rider.publish !== 'opublikowany')) notFound();
  const all = await getHorses();
  const mine = all.filter((h) => rider.horse_slugs.includes(h.slug));
  return (
    <>
      {preview && <PreviewBanner editHref={`/admin/jezdcy/${rider.id}`} label={`Szkic „${rider.name}”`} />}
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy pt-[68px]">
        <Image src={rider.image.url} alt={rider.image.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
        <div className="shell-wide relative z-10 pb-10 pt-8 text-ivory">
          <Breadcrumbs items={[{ name: 'Jeźdźcy', path: '/jezdcy' }, { name: rider.name, path: `/jezdcy/${rider.slug}` }]} tone="light" />
          <span className="eyebrow mt-4 text-brass-soft">{rider.role}</span>
          <h1 className="mt-3 max-w-2xl font-display text-display-lg font-semibold text-ivory text-shadow-hero">{rider.name}</h1>
          {rider.specialty && <p className="mt-2 max-w-xl font-medium text-ivory/85">{rider.specialty}</p>}
        </div>
      </section>
      <section className="bg-ivory py-section">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="card-app animate-rise p-5 sm:p-7">
            <div className="flex flex-wrap gap-2">
              {rider.experience && <span className="chip">{rider.experience}</span>}
              {rider.achievements && <span className="chip !border-brass/40 !text-brass-deep">{rider.achievements}</span>}
            </div>
            {rider.description && <p className="prose-lux mt-4">{rider.description}</p>}
            {mine.length > 0 && (
              <>
                <h2 className="mt-8 font-display text-2xl font-semibold text-navy">Konie jeźdźca</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {mine.map((h) => (<HorseCard key={h.id} horse={h} />))}
                </div>
              </>
            )}
          </div>
          <aside className="space-y-4">
            <div className="card-app p-5">
              <h2 className="font-display text-xl font-semibold text-navy">Kontakt</h2>
              <p className="mt-2 text-sm font-medium text-charcoal/70">Lekcje, treningi i prezentacje koni — umów się telefonicznie.</p>
              <a href="tel:+48881293333" className="btn-primary mt-4 w-full">881 293 333</a>
              <Link href="/jezdcy" className="btn-ghost mt-2 w-full">Wszyscy jeźdźcy</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
