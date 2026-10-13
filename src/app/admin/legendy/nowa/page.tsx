import Link from 'next/link';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import LegendForm from '@/components/admin/LegendForm';

export const dynamic = 'force-dynamic';

export default function NewLegendPage() {
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowa legenda"
        subtitle="Dodaj legendę stajni"
        action={<Link href="/admin/legendy" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <LegendForm />
      </div>
    </AdminChrome>
  );
}
