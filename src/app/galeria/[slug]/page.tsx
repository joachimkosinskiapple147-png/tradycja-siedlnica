import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumBySlug } from '@/lib/data/queries';
import { isAdmin } from '@/lib/supabase/admin';
import PreviewBanner from '@/components/admin/PreviewBanner';
import { buildMetadata } from '@/lib/seo';
import { formatDatePl } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Primitives';
import AlbumMasonry from '@/components/site/AlbumMasonry';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const album = await getAlbumBySlug(params.slug);
  if (!album) return buildMetadata({ title: 'Album nieznaleziony', noIndex: true });
  return buildMetadata({
    title: album.title,
    description: album.description ?? `Galeria: ${album.title}`,
    path: `/galeria/${album.slug}`,
    image: album.cover.url,
  });
}

export default async function AlbumPage({ params }: { params: { slug: string } }) {
  let album = await getAlbumBySlug(params.slug);
  let preview = false;
  if ((!album || album.publish !== 'opublikowany') && (await isAdmin())) {
    const p = await getAlbumBySlug(params.slug, { preview: true });
    if (p) {
      album = p;
      preview = true;
    }
  }
  if (!album || (!preview && album.publish !== 'opublikowany')) notFound();

  return (
    <article className="bg-ivory pt-[76px]">
      {preview && <PreviewBanner editHref={`/admin/galeria/${album.id}`} label={`Szkic „${album.title}”`} />}
      <div className="border-b border-navy/10 bg-cream">
        <div className="shell py-8">
          <Breadcrumbs items={[{ name: 'Galeria', path: '/galeria' }, { name: album.title, path: `/galeria/${album.slug}` }]} />
          <h1 className="mt-6 text-display-lg font-light text-navy">{album.title}</h1>
          <p className="mt-2 text-charcoal/60">
            {album.images.length} zdjęć{album.date ? ` · ${formatDatePl(album.date)}` : ''}
          </p>
          {album.description && <p className="prose-lux mt-4">{album.description}</p>}
        </div>
      </div>
      <div className="shell py-section">
        <AlbumMasonry images={album.images} />
      </div>
    </article>
  );
}
