import Link from 'next/link';
import { getAlbums } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import AlbumAdminTable from '@/components/admin/AlbumAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: { zapisano?: string };
}) {
  const albums = await getAlbums({ includeUnpublished: true });

  return (
    <AdminChrome>
      <AdminHeader
        title="Galeria"
        subtitle={`${albums.length} ${albums.length === 1 ? 'album' : 'albumów'} w bazie`}
        action={<Link href="/admin/galeria/nowy" className="btn-primary">Dodaj album</Link>}
      />
      <div className="p-6 lg:p-10">
        {searchParams.zapisano && (
          <p className="mb-6 border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">Zmiany zostały zapisane.</p>
        )}
        <AlbumAdminTable albums={albums} />
      </div>
    </AdminChrome>
  );
}
