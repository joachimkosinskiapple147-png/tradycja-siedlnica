import Link from 'next/link';
import { getHorses } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import EventForm from '@/components/admin/EventForm';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  const horses = await getHorses({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowe wydarzenie"
        subtitle="Dodaj wydarzenie do serwisu"
        action={<Link href="/admin/wydarzenia" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <EventForm horses={horses} />
      </div>
    </AdminChrome>
  );
}
