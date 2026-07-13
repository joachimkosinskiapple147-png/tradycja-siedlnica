import { SITE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import { getSiteSettings } from '@/lib/data/queries';
import { Breadcrumbs } from '@/components/ui/Primitives';

export const metadata = buildMetadata({
  title: 'Polityka prywatności',
  description: 'Informacje o przetwarzaniu danych osobowych w serwisie Tradycja Siedlnica.',
  path: '/polityka-prywatnosci',
});

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <article className="bg-ivory pt-[76px]">
      <div className="border-b border-navy/10 bg-cream">
        <div className="shell py-8">
          <Breadcrumbs items={[{ name: 'Polityka prywatności', path: '/polityka-prywatnosci' }]} />
          <h1 className="mt-6 text-display-lg font-light text-navy">Polityka prywatności</h1>
        </div>
      </div>

      <div className="shell py-section">
        <div className="mx-auto max-w-prose2">
          <div className="mb-8 border border-brass/40 bg-brass/5 px-5 py-4 text-sm text-charcoal/80">
            <strong>Treść robocza.</strong> Poniższy dokument to szkielet przygotowany do uzupełnienia
            i sprawdzenia przez właściciela (najlepiej z pomocą prawnika). Nie stanowi porady prawnej.
          </div>

          <div className="prose-lux space-y-6">
            <section>
              <h2 className="font-display text-2xl text-navy">1. Administrator danych</h2>
              <p>Administratorem danych jest {SITE.legalName}. Kontakt: {settings.email}, tel. {settings.phone}.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-navy">2. Zakres i cel przetwarzania</h2>
              <p>
                Dane podane w formularzu kontaktowym i formularzu zapytania o konia (imię i nazwisko,
                adres e-mail, numer telefonu, treść wiadomości) przetwarzamy wyłącznie w celu udzielenia
                odpowiedzi na zapytanie oraz obsługi ewentualnej sprzedaży. Zbieramy tylko dane niezbędne.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-navy">3. Podstawa prawna</h2>
              <p>
                Podstawą przetwarzania jest zgoda osoby oraz prawnie uzasadniony interes administratora
                (kontakt i obsługa zapytań). Podanie danych jest dobrowolne, ale niezbędne do udzielenia
                odpowiedzi.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-navy">4. Okres przechowywania</h2>
              <p>Dane przechowujemy przez czas niezbędny do obsługi zapytania oraz przez okres wynikający z przepisów.</p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-navy">5. Prawa osób</h2>
              <p>
                Masz prawo dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania,
                a także prawo wniesienia sprzeciwu oraz skargi do organu nadzorczego (PUODO).
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-navy">6. Pliki cookies</h2>
              <p>
                Serwis może wykorzystywać niezbędne pliki cookies zapewniające jego działanie. Narzędzia
                analityczne (np. Google Analytics) zostaną włączone dopiero po uzyskaniu odpowiedniej zgody.
              </p>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
