import Image from 'next/image';
import Link from 'next/link';
import { getAboutContent, getTimeline } from '@/lib/data/queries';
import { buildMetadata } from '@/lib/seo';
import { PageHero, SectionHeader, Ornament } from '@/components/ui/Primitives';
import { Timeline } from '@/components/site/Cards';
import Reveal from '@/components/ui/Reveal';

export const metadata = buildMetadata({
  title: 'Nasza stajnia',
  description:
    'Historia stajni Tradycja Siedlnica od 1989 roku, filozofia hodowli, trening i codzienne życie stajni.',
  path: '/nasza-stajnia',
});

export const dynamic = 'force-dynamic';

export default async function StablePage() {
  const [timeline, about] = await Promise.all([getTimeline(), getAboutContent()]);
  const aboutParagraphs = about.intro_text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const values = [
    { t: 'Indywidualne podejście', d: 'Każdy koń pracuje we własnym tempie. Obserwujemy, słuchamy i dobieramy metody do charakteru zwierzęcia.' },
    { t: 'Wiedza przekazywana przez lata', d: 'Doświadczenie budowane od 1989 roku pozwala odpowiedzialnie planować hodowlę i trening.' },
    { t: 'Uczciwość i wiarygodność', d: 'Konie opisujemy zgodnie z prawdą. Zależy nam na dobrych dopasowaniach jeźdźca i konia.' },
    { t: 'Szacunek do konia', d: 'Spokojna praca, dobre warunki i troska o zdrowie to fundament wszystkiego, co robimy.' },
  ];

  return (
    <>
      <PageHero
        eyebrow={`Od 1989 roku`}
        title="Nasza stajnia"
        intro="Rodzinna hodowla koni sportowych budowana konsekwentnie od ponad trzech dekad."
        image="/images/full/lord-pastwisko.webp"
        imageAlt="Pastwiska stajni Tradycja Siedlnica"
        crumbs={[{ name: 'Nasza stajnia', path: '/nasza-stajnia' }]}
      />

      {/* Wstęp */}
      <section className="bg-ivory py-section">
        <div className="shell-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <SectionHeader eyebrow="Kim jesteśmy" title="Hodowla z charakterem i historią" />
              <div className="prose-lux mt-6 space-y-4">
                {aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <Ornament className="mt-8" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/full/wega-okragla-ujezdzalnia.webp" alt="Ujeżdżalnia i padoki stajni" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Wartości */}
      <section className="bg-forest py-section text-ivory">
        <div className="shell">
          <Reveal>
            <SectionHeader eyebrow="Filozofia" title="Jak pracujemy z końmi" tone="light" align="center" />
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={(i % 2) * 90}>
                <div className="border-t border-ivory/20 pt-6">
                  <h3 className="font-display text-2xl text-ivory">{v.t}</h3>
                  <p className="prose-lux mt-3 text-ivory/70">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Obiekty — pasek zdjęć */}
      <section className="bg-ivory py-section">
        <div className="shell">
          <Reveal><SectionHeader eyebrow="Obiekty i otoczenie" title="Miejsce, w którym żyją nasze konie" /></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { src: 'stajnia-korytarz', alt: 'Korytarz stajni' },
              { src: 'wega-padok', alt: 'Padoki' },
              { src: 'konie-nad-woda', alt: 'Wodopój i pastwiska' },
              { src: 'stajnia-pielegnacja', alt: 'Codzienna pielęgnacja koni' },
              { src: 'cyprian-stado', alt: 'Konie na pastwisku' },
              { src: 'wega-okragla-ujezdzalnia', alt: 'Okrągła ujeżdżalnia' },
            ].map((im, i) => (
              <Reveal key={im.src} delay={(i % 3) * 80}>
                <div className="relative aspect-[4/3] overflow-hidden bg-beige-soft">
                  <Image src={`/images/full/${im.src}.webp`} alt={im.alt} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-[900ms] ease-editorial hover:scale-105" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Oś czasu */}
      <section className="bg-cream py-section">
        <div className="shell">
          <Reveal><SectionHeader eyebrow="Historia" title="Nasza droga od 1989 roku" /></Reveal>
          <div className="mt-14">
            <Timeline entries={timeline} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-section text-ivory">
        <div className="shell text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-display-md font-light">Odwiedź nas i poznaj nasze konie</h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/konie" className="btn-brass">Zobacz konie na sprzedaż</Link>
              <Link href="/kontakt" className="btn-ghost-light">Umów wizytę</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
