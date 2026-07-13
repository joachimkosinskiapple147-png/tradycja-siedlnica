import { getAlbums } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero, EmptyState } from '@/components/ui/Primitives';
import { GalleryAlbumCard } from '@/components/site/Cards';
import Reveal from '@/components/ui/Reveal';

export const metadata = buildMetadata({
  title: 'Galeria',
  description: 'Fotografie koni, stajni i codziennego życia hodowli Tradycja Siedlnica.',
  path: '/galeria',
});

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const albums = await getAlbums();
  return (
    <>
      <PageHero
        eyebrow="Fotografie"
        title="Galeria"
        intro="Konie, pastwiska i codzienność stajni — w naszych zdjęciach."
        image="/images/full/konie-nad-woda.webp"
        imageAlt="Konie nad wodą o zmierzchu"
        crumbs={[{ name: 'Galeria', path: '/galeria' }]}
      />
      <section className="bg-ivory py-section">
        <div className="shell">
          {albums.length === 0 ? (
            <EmptyState title="Brak albumów" message="Albumy pojawią się wkrótce." />
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 80}>
                  <GalleryAlbumCard album={a} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
