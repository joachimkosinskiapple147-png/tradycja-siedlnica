import Link from 'next/link';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import RiderForm from '@/components/admin/RiderForm';
import { getHorses } from '@/lib/data/queries';

export const dynamic = 'force-dynamic';

export default async function NewRiderPage() {
  const horses = await getHorses({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowy jeździec"
        subtitle="Dodaj profil zespołu"
        action={<Link href="/admin/jezdcy" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <RiderForm horseOptions={horses.map((h) => ({ slug: h.slug, name: h.name }))} />
      </div>
    </AdminChrome>
  );
}
