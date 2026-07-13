import Link from 'next/link';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import OfferForm from '@/components/admin/OfferForm';

export const dynamic = 'force-dynamic';

export default function NewOfferPage() {
  return (
    <AdminChrome>
      <AdminHeader
        title="Nowa oferta"
        subtitle="Dodaj pozycję oferty"
        action={<Link href="/admin/oferta" className="btn-ghost">← Wróć do listy</Link>}
      />
      <div className="p-6 lg:p-10">
        <OfferForm />
      </div>
    </AdminChrome>
  );
}
