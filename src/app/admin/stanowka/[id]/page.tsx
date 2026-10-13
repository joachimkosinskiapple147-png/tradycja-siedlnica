import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import StallionForm from '@/components/admin/StallionForm';
import { getStallionById } from '@/lib/data/queries';

export const dynamic = 'force-dynamic';

export default async function EditStallionPage({ params }: { params: { id: string } }) {
  const stallion = await getStallionById(params.id);
  if (!stallion) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${stallion.name}`}
        subtitle="Zmień dane ogiera"
        action={<Link href="/admin/stanowka" className="btn-ghost">← Lista</Link>}
      />
      <div className="p-6 lg:p-10">
        <StallionForm stallion={stallion} />
      </div>
    </AdminChrome>
  );
}
