import Link from 'next/link';
import { getHorses, getHorseFilterOptions } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero, EmptyState } from '@/components/ui/Primitives';
import HorseFilters from '@/components/site/HorseFilters';
import HorseCard from '@/components/site/HorseCard';
import Reveal from '@/components/ui/Reveal';
import type { Horse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Konie',
  description:
    'Katalog koni z hodowli Tradycja Siedlnica. Filtruj po statusie, płci, rasie i przeznaczeniu.',
  path: '/konie',
});

const PER_PAGE = 9;

function sortHorses(list: Horse[], sort?: string): Horse[] {
  const copy = [...list];
  switch (sort) {
    case 'new':
      return copy.sort((a, b) => (b.birth_year ?? 0) - (a.birth_year ?? 0));
    case 'old':
      return copy.sort((a, b) => (a.birth_year ?? 9999) - (b.birth_year ?? 9999));
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || a.position - b.position);
  }
}

export default async function HorsesPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const allPublished = await getHorses();
  const { breeds, disciplines } = getHorseFilterOptions(allPublished);

  const filtered = await getHorses({
    status: searchParams.status,
    sex: searchParams.sex,
    breed: searchParams.breed,
    discipline: searchParams.discipline,
    search: searchParams.search,
  });
  const sorted = sortHorses(filtered, searchParams.sort);

  const page = Math.max(1, Number(searchParams.strona ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageItems = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const buildPageHref = (p: number) => {
    const next = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v) as [string, string][]
    );
    next.set('strona', String(p));
    return `/konie?${next.toString()}`;
  };

  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Konie"
        intro="Konie z własnej hodowli — sportowe, rekreacyjne i materiał hodowlany. Zapraszamy na prezentację na miejscu."
        image="/images/full/cyprian-sylwetka.webp"
        imageAlt="Koń na sprzedaż w stajni Tradycja Siedlnica"
        crumbs={[{ name: 'Konie', path: '/konie' }]}
      />

      <HorseFilters breeds={breeds} disciplines={disciplines} total={sorted.length} />

      <section className="bg-ivory py-section">
        <div className="shell">
          {pageItems.length === 0 ? (
            <EmptyState
              title="Brak koni spełniających kryteria"
              message="Zmień lub wyczyść filtry, albo skontaktuj się z nami — chętnie pomożemy dobrać konia."
              action={{ label: 'Wyczyść filtry', href: '/konie' }}
            />
          ) : (
            <>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((h, i) => (
                  <Reveal key={h.id} delay={(i % 3) * 80}>
                    <HorseCard horse={h} priority={i < 3} />
                  </Reveal>
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Paginacja" className="mt-16 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={buildPageHref(p)}
                      aria-current={p === page ? 'page' : undefined}
                      className={
                        p === page
                          ? 'inline-flex h-11 w-11 items-center justify-center bg-navy text-ivory'
                          : 'inline-flex h-11 w-11 items-center justify-center border border-navy/20 text-navy hover:bg-navy hover:text-ivory'
                      }
                    >
                      {p}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
