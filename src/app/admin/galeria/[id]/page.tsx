import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAlbumById } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import AlbumForm from '@/components/admin/AlbumForm';

export const dynamic = 'force-dynamic';

export default async function EditAlbumPage({ params }: { params: { id: string } }) {
  const album = await getAlbumById(params.id);
  if (!album) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${album.title}`}
        subtitle="Zmień dane albumu"
        action={
          <div className="flex gap-2">
            <Link href={`/galeria/${album.slug}`} target="_blank" className="btn-ghost">Podgląd</Link>
            <Link href="/admin/galeria" className="btn-ghost">← Lista</Link>
          </div>
        }
      />
      <div className="p-6 lg:p-10">
        <AlbumForm album={album} />
      </div>
    </AdminChrome>
  );
}
