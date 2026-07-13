import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/lib/constants';
import {
  getAlbums,
  getFeaturedHorses,
  getOffers,
  getUpcomingEvents,
  getPastEvents,
} from '@/lib/data/queries';
import { HERO_IMAGE, seedHorses } from '@/lib/data/seed';
import Reveal from '@/components/ui/Reveal';
import { SectionHeader, Ornament } from '@/components/ui/Primitives';
import HorseCard from '@/components/site/HorseCard';
import { EventCard, OfferCard, GalleryAlbumCard } from '@/components/site/Cards';
import VideoEmbed from '@/components/site/VideoEmbed';

export default async function HomePage() {
  const [featured, offers, upcoming, past, albums] = await Promise.all([
    getFeaturedHorses(3),
    getOffers(),
    getUpcomingEvents(),
    getPastEvents(),
    getAlbums(),
  ]);
  const events = [...upcoming, ...past].slice(0, 3);
  const galleryAlbums = albums.slice(0, 3);
  const demoVideo = seedHorses.find((h) => h.videos.length)?.videos[0];

  return (
    <>
      {/* 1 · HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy">
        <Image
          src={HERO_IMAGE.url}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
        <div className="shell-wide relative z-10 w-full pt-[76px] text-ivory">
          <div className="max-w-3xl animate-fade-in">
            <span className="eyebrow text-brass-soft">Hodowla koni sportowych · od {SITE.foundedYear}</span>
            <h1 className="mt-6 text-display-xl font-light text-shadow-hero">
              Tradycja, doświadczenie i pasja do koni
            </h1>
            <p className="prose-lux mt-6 max-w-xl text-ivory/85 text-shadow-hero">
              {SITE.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/konie" className="btn-brass">Zobacz konie na sprzedaż</Link>
              <Link href="/nasza-stajnia" className="btn-ghost-light">Poznaj naszą stajnię</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/60 md:flex">
          <span className="text-[0.62rem] uppercase tracking-eyebrow">Przewiń</span>
          <span className="h-10 w-px bg-ivory/40" />
        </div>
      </section>

      {/* 2 · INTRO + STATYSTYKI */}
      <section className="bg-ivory py-section">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow eyebrow--center justify-center text-brass-deep">Nasza stajnia</span>
              <p className="mt-6 font-display text-display-sm font-light leading-snug text-navy">
                Od 1989 roku prowadzimy hodowlę, trening i sprzedaż koni sportowych — z doświadczeniem
                przekazywanym przez lata i szacunkiem do każdego konia.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-14 grid grid-cols-2 gap-y-10 border-y border-navy/10 py-10 md:grid-cols-4">
              {[
                { n: '1989', l: 'Rok założenia' },
                { n: '35+', l: 'Lat doświadczenia' },
                { n: '~100', l: 'Koni w stajni' },
                { n: '3', l: 'Filary: hodowla · trening · sprzedaż' },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-display text-5xl font-light text-navy md:text-6xl">{s.n}</div>
                  <div className="mx-auto mt-2 max-w-[14ch] text-[0.72rem] uppercase tracking-wide2 text-charcoal/55">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · KONIE NA SPRZEDAŻ */}
      {featured.length > 0 && (
        <section className="bg-cream py-section">
          <div className="shell">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <SectionHeader eyebrow="Wybrane konie" title="Konie na sprzedaż" />
                <Link href="/konie" className="btn-ghost self-start md:self-auto">Zobacz wszystkie</Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((h, i) => (
                <Reveal key={h.id} delay={i * 90}>
                  <HorseCard horse={h} priority={i === 0} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4 · O STAJNI */}
      <section className="bg-navy py-section text-ivory">
        <div className="shell-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/full/stajnia-korytarz.webp"
                alt="Korytarz stajni Tradycja Siedlnica"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <span className="eyebrow text-brass-soft">Rodzinny charakter</span>
              <h2 className="mt-4 text-display-md font-light text-ivory">Miejsce tworzone przez pokolenia</h2>
              <div className="prose-lux mt-6 space-y-4 text-ivory/75">
                <p>
                  Tradycja Siedlnica to stajnia budowana konsekwentnie od 1989 roku. Przez ponad trzy
                  dekady zdobywaliśmy wiedzę, którą dziś wykorzystujemy w hodowli, treningu i przygotowaniu
                  koni do sprzedaży.
                </p>
                <p>
                  Do każdego konia podchodzimy indywidualnie — z cierpliwością i szacunkiem. Wierzymy, że
                  spokojna, uczciwa praca daje konie zrównoważone, zdrowe i chętne do współpracy.
                </p>
              </div>
              <Ornament className="mt-8 text-brass-soft" />
              <Link href="/nasza-stajnia" className="btn-ghost-light mt-8">Poznaj naszą historię</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 · OFERTA */}
      <section className="bg-ivory py-section">
        <div className="shell">
          <Reveal>
            <SectionHeader eyebrow="Czym się zajmujemy" title="Oferta" align="center" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, 6).map((o, i) => (
              <Reveal key={o.id} delay={(i % 3) * 90}>
                <OfferCard offer={o} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · WYDARZENIA */}
      {events.length > 0 && (
        <section className="bg-cream py-section">
          <div className="shell">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <SectionHeader eyebrow="Z życia stajni" title="Najnowsze wydarzenia" />
                <Link href="/wydarzenia" className="btn-ghost self-start md:self-auto">Wszystkie wydarzenia</Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <Reveal key={e.id} delay={i * 90}>
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7 · GALERIA */}
      {galleryAlbums.length > 0 && (
        <section className="bg-ivory py-section">
          <div className="shell">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <SectionHeader eyebrow="Fotografie" title="Galeria" />
                <Link href="/galeria" className="btn-ghost self-start md:self-auto">Zobacz galerię</Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryAlbums.map((a, i) => (
                <Reveal key={a.id} delay={i * 90}>
                  <GalleryAlbumCard album={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8 · FILM */}
      {demoVideo && (
        <section className="bg-forest py-section text-ivory">
          <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div>
                <span className="eyebrow text-brass-soft">Zobacz w ruchu</span>
                <h2 className="mt-4 text-display-md font-light text-ivory">Nasze konie w pracy</h2>
                <p className="prose-lux mt-5 text-ivory/75">
                  Krótkie materiały wideo pozwalają lepiej ocenić ruch, charakter i przygotowanie konia.
                  Filmy dodajemy do profili poszczególnych koni.
                </p>
                <Link href="/konie" className="btn-ghost-light mt-8">Przejdź do koni</Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <VideoEmbed video={demoVideo} />
            </Reveal>
          </div>
        </section>
      )}

      {/* 10 · KONTAKT CTA */}
      <section className="relative overflow-hidden bg-navy py-section text-ivory">
        <Image
          src="/images/full/konie-nad-woda.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="shell relative z-10 text-center">
          <Reveal>
            <span className="eyebrow eyebrow--center justify-center text-brass-soft">Kontakt</span>
            <h2 className="mx-auto mt-6 max-w-2xl text-display-lg font-light text-shadow-hero">
              Szukasz odpowiedniego konia? Porozmawiajmy.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${SITE.phoneHref}`} className="btn-brass">Zadzwoń: {SITE.phone}</a>
              <Link href="/kontakt" className="btn-ghost-light">Napisz wiadomość</Link>
              <Link href="/konie" className="btn-ghost-light">Zobacz konie</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
