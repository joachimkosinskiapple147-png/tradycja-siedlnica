import { buildMetadata } from '@/lib/seo';
import { getSiteSettings } from '@/lib/data/queries';
import { PageHero } from '@/components/ui/Primitives';
import ContactForm from '@/components/site/ContactForm';

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: 'Kontakt',
    description: `Skontaktuj się ze stajnią Tradycja Siedlnica. Telefon: ${settings.phone}, e-mail: ${settings.email}.`,
    path: '/kontakt',
  });
}

export const dynamic = 'force-dynamic';

export default async function ContactPage({ searchParams }: { searchParams: { temat?: string } }) {
  const settings = await getSiteSettings();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(settings.map_query)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address_full)}`;

  return (
    <>
      <PageHero
        eyebrow="Zapraszamy"
        title="Kontakt"
        intro="Zadzwoń lub napisz — chętnie odpowiemy na pytania i umówimy wizytę w stajni."
        image="/images/full/stajnia-pielegnacja.webp"
        imageAlt="Pielęgnacja konia w stajni"
        crumbs={[{ name: 'Kontakt', path: '/kontakt' }]}
      />

      <section className="bg-ivory py-section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Dane kontaktowe */}
          <div className="lg:col-span-5">
            <h2 className="text-display-sm font-light text-navy">Dane kontaktowe</h2>
            <div className="rule-double mt-3 w-16" />

            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-[0.7rem] uppercase tracking-eyebrow text-brass-deep">Telefon</dt>
                <dd className="mt-1">
                  <a href={`tel:${settings.phone_href}`} className="link-underline font-display text-3xl text-navy">{settings.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-eyebrow text-brass-deep">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${settings.email}`} className="link-underline break-all text-lg text-navy">{settings.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-eyebrow text-brass-deep">Adres</dt>
                <dd className="mt-1 text-lg text-navy">{settings.address_full}</dd>
                <dd className="mt-2">
                  <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-brass-deep">
                    Wyznacz trasę →
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <h3 className="text-[0.7rem] uppercase tracking-eyebrow text-brass-deep">Godziny otwarcia</h3>
              <ul className="mt-4 space-y-2">
                {settings.hours.map((r) => (
                  <li key={r.day} className="flex justify-between gap-4 border-b border-navy/10 py-2 text-[0.95rem]">
                    <span className="text-charcoal/75">{r.day}</span>
                    <span className="font-medium text-navy">{r.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-charcoal/55">{settings.hours_note}</p>
            </div>
          </div>

          {/* Formularz */}
          <div className="lg:col-span-7">
            <div className="border border-navy/12 bg-cream p-6 sm:p-8">
              <h2 className="font-display text-2xl text-navy">Napisz do nas</h2>
              <p className="mt-2 text-sm text-charcoal/65">Odpowiadamy zwykle w ciągu jednego–dwóch dni roboczych.</p>
              <div className="mt-6">
                <ContactForm defaultSubject={searchParams.temat} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section aria-label="Mapa dojazdu" className="bg-cream">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          <iframe
            title="Mapa — Tradycja Siedlnica"
            src={mapSrc}
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.2]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
