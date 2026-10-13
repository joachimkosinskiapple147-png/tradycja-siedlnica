import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getHorseBySlug, getSimilarHorses, getSiteSettings } from '@/lib/data/queries';
import { SEX_LABEL } from '@/lib/constants';
import { buildMetadata, JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { ageFromYear, formatDatePl } from '@/lib/utils';
import { Breadcrumbs, StatusPill } from '@/components/ui/Primitives';
import HorseGallery from '@/components/site/HorseGallery';
import PedigreeDisplay from '@/components/site/PedigreeDisplay';
import VideoEmbed from '@/components/site/VideoEmbed';
import InquiryForm from '@/components/site/InquiryForm';
import HorseCard from '@/components/site/HorseCard';
import Reveal from '@/components/ui/Reveal';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const horse = await getHorseBySlug(params.slug);
  if (!horse) return buildMetadata({ title: 'Nie znaleziono konia', noIndex: true });
  const cover = horse.images.find((i) => i.is_cover) ?? horse.images[0];
  return buildMetadata({
    title: horse.seo_title ?? horse.name,
    description:
      horse.seo_description ??
      `${horse.name} — ${[SEX_LABEL[horse.sex], horse.breed, horse.birth_year ? `ur. ${horse.birth_year}` : null].filter(Boolean).join(', ')}. ${horse.price ?? ''}`.trim(),
    path: `/konie/${horse.slug}`,
    image: cover?.url,
  });
}

function Spec({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-4 border-b border-navy/10 py-2">
      <dt className="text-[0.72rem] font-bold uppercase tracking-wide2 text-charcoal/55">{label}</dt>
      <dd className="text-right text-[0.9rem] font-semibold text-navy">{value}</dd>
    </div>
  );
}

export default async function HorsePage({ params }: { params: { slug: string } }) {
  const horse = await getHorseBySlug(params.slug);
  if (!horse || horse.publish !== 'opublikowany') notFound();

  const similar = await getSimilarHorses(horse, 3);
  const settings = await getSiteSettings();
  const visibleVideos = horse.videos.filter((v) => v.publish);
  const cover = horse.images.find((i) => i.is_cover) ?? horse.images[0];
  const crumbs = [
    { name: 'Konie', path: '/konie' },
    { name: horse.name, path: `/konie/${horse.slug}` },
  ];

  const specs = [
    { label: 'Nazwa rodowodowa', value: horse.full_name },
    { label: 'Rok urodzenia', value: horse.birth_year },
    { label: 'Data urodzenia', value: horse.birth_date ? formatDatePl(horse.birth_date) : undefined },
    { label: 'Wiek', value: ageFromYear(horse.birth_year) ?? undefined },
    { label: 'Płeć', value: SEX_LABEL[horse.sex] },
    { label: 'Rasa', value: horse.breed },
    { label: 'Maść', value: horse.color },
    { label: 'Wzrost', value: horse.height_cm ? `${horse.height_cm} cm` : undefined },
    { label: 'Pochodzenie', value: horse.origin },
    { label: 'Przeznaczenie', value: horse.discipline },
    { label: 'Poziom', value: horse.training_level },
    { label: 'Charakter', value: horse.temperament },
    { label: 'Trening', value: horse.training_state },
  ];

  return (
    <>
      {/* HERO profilu */}
      <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-navy pt-[68px]">
        {cover && <Image src={cover.url} alt={cover.alt || horse.name} fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
        <div className="shell-wide relative z-10 w-full pb-8 pt-8 text-ivory">
          <Breadcrumbs items={crumbs} tone="light" />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusPill status={horse.status} />
            {horse.featured && <span className="rounded-full bg-brass/25 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-wide2 text-brass-soft backdrop-blur">Wyróżniony</span>}
          </div>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-display-lg font-semibold text-ivory text-shadow-hero">{horse.name}</h1>
              <p className="mt-2 font-medium text-ivory/85">
                {[SEX_LABEL[horse.sex], horse.breed, horse.birth_year ? `ur. ${horse.birth_year}` : null].filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="card-app !border-ivory/20 !bg-ivory/10 shrink-0 !p-4 backdrop-blur-md">
              <div className="text-[0.66rem] font-bold uppercase tracking-eyebrow text-brass-soft">Cena</div>
              <div className="font-display text-2xl font-semibold text-ivory">{horse.price ?? 'Cena na zapytanie'}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#zapytanie" className="btn-brass !py-2 text-[0.7rem]">Zapytaj →</a>
                <a href={`tel:${settings.phone_href}`} className="btn-ghost-light !py-2 text-[0.7rem]">Zadzwoń</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFIL */}
      <section className="bg-ivory py-section">
        <div className="shell grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="card-app animate-rise overflow-hidden">
              <HorseGallery images={horse.images} name={horse.name} />
            </div>
            {horse.description && (
              <div className="card-app animate-rise p-5 sm:p-6">
                <span className="eyebrow">O koniu</span>
                <p className="prose-lux mt-3 whitespace-pre-line">{horse.description}</p>
                {horse.achievements && (
                  <p className="mt-4 rounded-2xl border border-brass/30 bg-brass/8 p-4 text-[0.9rem] font-semibold text-brass-deep">🏆 {horse.achievements}</p>
                )}
              </div>
            )}
            {horse.pedigree && (horse.pedigree.sire || horse.pedigree.dam || horse.pedigree.notes) && (
              <div className="card-app animate-rise p-5 sm:p-6">
                <span className="eyebrow">Rodzice · hodowla</span>
                <h2 className="mt-2 font-display text-2xl font-semibold text-navy">Rodowód</h2>
                <div className="mt-3"><PedigreeDisplay pedigree={horse.pedigree} /></div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card-app animate-rise p-5 lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-semibold text-navy">Profil</h2>
              <dl className="mt-3">
                {specs.map((s) => (<Spec key={s.label} label={s.label} value={s.value} />))}
              </dl>
              <div className="mt-4 space-y-2">
                <a href="#zapytanie" className="btn-primary w-full">Zapytaj o tego konia</a>
                <Link href="/konie" className="btn-ghost w-full">← Wszystkie konie</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {visibleVideos.length > 0 && (
        <section className="bg-cream py-section">
          <div className="shell">
            <span className="eyebrow text-brass-deep">Zobacz w ruchu</span>
            <h2 className="mt-3 font-display text-display-sm font-semibold text-navy">Filmy</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {visibleVideos.map((v) => (<VideoEmbed key={v.id} video={v} />))}
            </div>
          </div>
        </section>
      )}

      <section id="zapytanie" className="scroll-mt-24 bg-navy py-section text-ivory">
        <div className="shell grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div>
              <span className="eyebrow text-brass-soft">Zapytanie</span>
              <h2 className="mt-3 font-display text-display-md font-semibold !text-ivory">Zapytaj o {horse.name}</h2>
              <p className="prose-lux mt-3 !text-ivory/80">Odpowiemy z dodatkowymi informacjami i umówimy prezentację. Możesz też zadzwonić.</p>
              <a href={`tel:${settings.phone_href}`} className="mt-4 inline-block font-display text-3xl font-semibold text-ivory">{settings.phone}</a>
            </div>
          </Reveal>
          <div className="card-app !p-5 sm:!p-6"><InquiryForm horseSlug={horse.slug} horseName={horse.name} /></div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-cream py-section">
          <div className="shell">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-display text-display-sm font-semibold text-navy">Podobne konie</h2>
              <Link href="/konie" className="btn-ghost self-start !py-2.5 md:self-auto">Wszystkie</Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {similar.map((h, i) => (<Reveal key={h.id} delay={i * 70}><HorseCard horse={h} /></Reveal>))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
