import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getHorseBySlug, getSimilarHorses } from '@/lib/data/queries';
import { SITE, SEX_LABEL } from '@/lib/constants';
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
    <div className="flex justify-between gap-4 border-b border-navy/10 py-2.5">
      <dt className="text-[0.78rem] uppercase tracking-wide2 text-charcoal/55">{label}</dt>
      <dd className="text-right text-[0.95rem] font-medium text-navy">{value}</dd>
    </div>
  );
}

export default async function HorsePage({ params }: { params: { slug: string } }) {
  const horse = await getHorseBySlug(params.slug);
  if (!horse || horse.publish !== 'opublikowany') notFound();

  const similar = await getSimilarHorses(horse, 3);
  const crumbs = [
    { name: 'Konie', path: '/konie' },
    { name: horse.name, path: `/konie/${horse.slug}` },
  ];

  const specs = [
    { label: 'Imię', value: horse.name },
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
    { label: 'Poziom wyszkolenia', value: horse.training_level },
    { label: 'Charakter', value: horse.temperament },
    { label: 'Stan treningu', value: horse.training_state },
    { label: 'Osiągnięcia', value: horse.achievements },
  ];

  return (
    <>
      <article className="bg-ivory pt-[76px]">
        {/* Nagłówek */}
        <div className="border-b border-navy/10 bg-cream">
          <div className="shell py-8">
            <Breadcrumbs items={crumbs} />
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-4">
                  <StatusPill status={horse.status} />
                  {horse.featured && (
                    <span className="text-[0.7rem] uppercase tracking-wide2 text-brass-deep">Wyróżniony</span>
                  )}
                </div>
                <h1 className="mt-4 text-display-lg font-light text-navy">{horse.name}</h1>
                <p className="mt-2 text-charcoal/65">
                  {[SEX_LABEL[horse.sex], horse.breed, horse.birth_year ? `ur. ${horse.birth_year}` : null]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[0.72rem] uppercase tracking-wide2 text-charcoal/55">Cena</div>
                <div className="mt-1 font-display text-3xl text-navy">{horse.price ?? 'Cena na zapytanie'}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="#zapytanie" className="btn-primary">Zapytaj o tego konia</a>
                  <a href={`tel:${SITE.phoneHref}`} className="btn-ghost">Zadzwoń</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treść */}
        <div className="shell grid gap-12 py-section lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <HorseGallery images={horse.images} name={horse.name} />

            {horse.description && (
              <div className="mt-12">
                <h2 className="font-display text-2xl text-navy">O koniu</h2>
                <div className="rule-double mt-3 w-16" />
                <p className="prose-lux mt-5 whitespace-pre-line">{horse.description}</p>
              </div>
            )}

            {horse.videos.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl text-navy">Filmy</h2>
                <div className="rule-double mt-3 w-16" />
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {horse.videos.map((v) => (
                    <VideoEmbed key={v.id} video={v} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-display text-2xl text-navy">Informacje</h2>
              <div className="rule-double mt-3 w-16" />
              <dl className="mt-5">
                {specs.map((s) => (
                  <Spec key={s.label} label={s.label} value={s.value} />
                ))}
              </dl>

              {horse.pedigree && (horse.pedigree.sire || horse.pedigree.dam) && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl text-navy">Rodowód</h2>
                  <div className="rule-double mt-3 w-16" />
                  <div className="mt-5">
                    <PedigreeDisplay pedigree={horse.pedigree} />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Formularz zapytania */}
        <section id="zapytanie" className="scroll-mt-24 bg-navy py-section text-ivory">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <span className="eyebrow text-brass-soft">Zapytanie</span>
              <h2 className="mt-4 text-display-md font-light text-ivory">Zapytaj o {horse.name}</h2>
              <p className="prose-lux mt-5 text-ivory/75">
                Zostaw wiadomość — odpowiemy z dodatkowymi informacjami, zdjęciami i możliwością umówienia
                prezentacji. Możesz też zadzwonić bezpośrednio.
              </p>
              <a href={`tel:${SITE.phoneHref}`} className="mt-6 inline-block font-display text-3xl text-ivory">
                {SITE.phone}
              </a>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-ivory p-6 sm:p-8">
                <InquiryForm horseSlug={horse.slug} horseName={horse.name} />
              </div>
            </div>
          </div>
        </section>

        {/* Podobne konie */}
        {similar.length > 0 && (
          <section className="bg-cream py-section">
            <div className="shell">
              <div className="flex items-end justify-between gap-6">
                <h2 className="text-display-sm font-light text-navy">Podobne konie</h2>
                <Link href="/konie" className="btn-ghost">Wszystkie konie</Link>
              </div>
              <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((h, i) => (
                  <Reveal key={h.id} delay={i * 90}>
                    <HorseCard horse={h} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <JsonLd data={breadcrumbJsonLd([{ name: 'Strona główna', path: '/' }, ...crumbs])} />
    </>
  );
}
