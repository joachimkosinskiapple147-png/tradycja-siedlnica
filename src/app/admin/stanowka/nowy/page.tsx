import Link from 'next/link';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import StallionForm from '@/components/admin/StallionForm';

export const dynamic = 'force-dynamic';

export default function NewStallionPage() {
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowy ogier"
        subtitle="Dodaj ogiera na stanówkę"
        action={<Link href="/admin/stanowka" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <StallionForm />
      </div>
    </AdminChrome>
  );
}
