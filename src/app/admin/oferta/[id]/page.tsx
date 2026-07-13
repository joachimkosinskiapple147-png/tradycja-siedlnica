import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOfferById } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import OfferForm from '@/components/admin/OfferForm';

export const dynamic = 'force-dynamic';

export default async function EditOfferPage({ params }: { params: { id: string } }) {
  const offer = await getOfferById(params.id);
  if (!offer) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${offer.title}`}
        subtitle="Zmień dane oferty"
        action={<Link href="/admin/oferta" className="btn-ghost">← Lista</Link>}
      />
      <div className="p-6 lg:p-10">
        <OfferForm offer={offer} />
      </div>
    </AdminChrome>
  );
}
