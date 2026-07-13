import { SITE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/Primitives';
import ContactForm from '@/components/site/ContactForm';

export const metadata = buildMetadata({
  title: 'Kontakt',
  description: `Skontaktuj się ze stajnią Tradycja Siedlnica. Telefon: ${SITE.phone}, e-mail: ${SITE.email}.`,
  path: '/kontakt',
});

const HOURS = [
  { d: 'Poniedziałek – Piątek', h: '9:00 – 18:00' },
  { d: 'Sobota', h: '9:00 – 16:00' },
  { d: 'Niedziela', h: 'po wcześniejszym umówieniu' },
];

export default function ContactPage({ searchParams }: { searchParams: { temat?: string } }) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapEmbedQuery)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address.full)}`;

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
                  <a href={`tel:${SITE.phoneHref}`} className="link-underline font-display text-3xl text-navy">{SITE.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-eyebrow text-brass-deep">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SITE.email}`} className="link-underline break-all text-lg text-navy">{SITE.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-eyebrow text-brass-deep">Adres</dt>
                <dd className="mt-1 text-lg text-navy">{SITE.address.full}</dd>
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
                {HOURS.map((r) => (
                  <li key={r.d} className="flex justify-between gap-4 border-b border-navy/10 py-2 text-[0.95rem]">
                    <span className="text-charcoal/75">{r.d}</span>
                    <span className="font-medium text-navy">{r.h}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-charcoal/55">Wizyty najlepiej umawiać telefonicznie z wyprzedzeniem.</p>
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
        <p className="shell py-4 text-sm text-charcoal/55">
          Dokładną lokalizację i osadzenie mapy skonfigurujesz w panelu administratora (Ustawienia → Mapa).
        </p>
      </section>
    </>
  );
}
