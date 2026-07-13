import Link from 'next/link';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import AlbumForm from '@/components/admin/AlbumForm';

export const dynamic = 'force-dynamic';

export default function NewAlbumPage() {
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowy album"
        subtitle="Dodaj album do galerii"
        action={<Link href="/admin/galeria" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <AlbumForm />
      </div>
    </AdminChrome>
  );
}
