import Link from 'next/link';
import { getOffers } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import OfferAdminTable from '@/components/admin/OfferAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: { zapisano?: string };
}) {
  const offers = await getOffers({ includeInactive: true });

  return (
    <AdminChrome>
      <AdminHeader
        title="Oferta"
        subtitle={`${offers.length} ${offers.length === 1 ? 'pozycja' : 'pozycji'} oferty`}
        action={<Link href="/admin/oferta/nowa" className="btn-primary">Dodaj ofertę</Link>}
      />
      <div className="p-6 lg:p-10">
        {searchParams.zapisano && (
          <p className="mb-6 border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">Zmiany zostały zapisane.</p>
        )}
        <OfferAdminTable offers={offers} />
      </div>
    </AdminChrome>
  );
}
