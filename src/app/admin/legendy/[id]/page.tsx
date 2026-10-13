import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import LegendForm from '@/components/admin/LegendForm';
import { getLegendById } from '@/lib/data/queries';

export const dynamic = 'force-dynamic';

export default async function EditLegendPage({ params }: { params: { id: string } }) {
  const legend = await getLegendById(params.id);
  if (!legend) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${legend.name}`}
        subtitle="Zmień dane legendy"
        action={<Link href="/admin/legendy" className="btn-ghost">← Lista</Link>}
      />
      <div className="p-6 lg:p-10">
        <LegendForm legend={legend} />
      </div>
    </AdminChrome>
  );
}
