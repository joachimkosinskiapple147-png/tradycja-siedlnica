import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import RiderForm from '@/components/admin/RiderForm';
import { requireAdmin } from '@/lib/supabase/admin';
import { getRiderById, getHorses } from '@/lib/data/queries';

export const dynamic = 'force-dynamic';

export default async function EditRiderPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [rider, horses] = await Promise.all([
    getRiderById(params.id),
    getHorses({ includeUnpublished: true }),
  ]);
  if (!rider) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${rider.name}`}
        subtitle="Zmień dane jeźdźca"
        action={<Link href="/admin/jezdcy" className="btn-ghost">← Lista</Link>}
      />
      <div className="p-6 lg:p-10">
        <RiderForm rider={rider} horseOptions={horses.map((h) => ({ slug: h.slug, name: h.name }))} />
      </div>
    </AdminChrome>
  );
}
