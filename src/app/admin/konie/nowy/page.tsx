import Link from 'next/link';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import HorseForm from '@/components/admin/HorseForm';

export const dynamic = 'force-dynamic';

export default function NewHorsePage() {
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowy koń"
        subtitle="Dodaj konia do katalogu"
        action={<Link href="/admin/konie" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <HorseForm />
      </div>
    </AdminChrome>
  );
}
