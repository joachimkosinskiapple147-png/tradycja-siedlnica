import Link from 'next/link';
import Image from 'next/image';
import {
  getAlbums,
  getFeaturedHorses,
  getHomeContent,
  getHorseBySlug,
  getHorses,
  getOffers,
  getSiteSettings,
  getUpcomingEvents,
  getPastEvents,
} from '@/lib/data/queries';
import Reveal from '@/components/ui/Reveal';
import { SectionHeader, Ornament } from '@/components/ui/Primitives';
import HorseCard from '@/components/site/HorseCard';
import { EventCard, OfferCard, GalleryAlbumCard } from '@/components/site/Cards';
import VideoEmbed from '@/components/site/VideoEmbed';
import type { EventItem, Album } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [content, settings, offers, upcoming, past, albums, allHorses] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
    getOffers(),
    getUpcomingEvents(),
    getPastEvents(),
    getAlbums(),
    getHorses(),
  ]);

  const featured = await getFeaturedHorses(3, content.featured_horse_ids);

  const allEvents: EventItem[] = [...upcoming, ...past];
  const events = content.featured_event_ids.length
    ? content.featured_event_ids.map((id) => allEvents.find((e) => e.id === id)).filter((e): e is EventItem => Boolean(e))
    : allEvents.slice(0, 3);

  const galleryAlbums: Album[] = content.featured_album_ids.length
    ? content.featured_album_ids.map((id) => albums.find((a) => a.id === id)).filter((a): a is Album => Boolean(a))
    : albums.slice(0, 3);

  const videoHorse = content.video_horse_slug
    ? await getHorseBySlug(content.video_horse_slug)
    : allHorses.find((h) => h.videos.some((v) => v.publish));
  const demoVideo = videoHorse?.videos.find((v) => v.publish);

  const visible = (key: string) => content.sections.find((s) => s.key === key)?.visible ?? true;
  const order = content.sections.filter((s) => s.key !== 'hero' && s.visible).map((s) => s.key);

  const sectionRenderers: Record<string, React.ReactNode> = {
    intro: (
      <section key="intro" className="bg-ivory py-section">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow eyebrow--center justify-center text-brass-deep">{content.intro_eyebrow}</span>
              <p className="mt-6 font-display text-display-sm font-light leading-snug text-navy">{content.intro_text}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-14 grid grid-cols-2 gap-y-10 border-y border-navy/10 py-10 md:grid-cols-4">
              {content.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-5xl font-light text-navy md:text-6xl">{s.number}</div>
                  <div className="mx-auto mt-2 max-w-[14ch] text-[0.72rem] uppercase tracking-wide2 text-charcoal/55">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    ),
    horses: featured.length > 0 && (
      <section key="horses" className="bg-cream py-section">
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
    ),
    about: (
      <section key="about" className="bg-navy py-section text-ivory">
        <div className="shell-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={content.about_image_url} alt={content.about_image_alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <span className="eyebrow text-brass-soft">{content.about_eyebrow}</span>
              <h2 className="mt-4 text-display-md font-light text-ivory">{content.about_heading}</h2>
              <div className="prose-lux mt-6 space-y-4 text-ivory/75">
                {content.about_text.split(/\n{2,}/).map((p, i) => <p key={i}>{p.trim()}</p>)}
              </div>
              <Ornament className="mt-8 text-brass-soft" />
              <Link href="/nasza-stajnia" className="btn-ghost-light mt-8">Poznaj naszą historię</Link>
            </div>
          </Reveal>
        </div>
      </section>
    ),
    offers: (
      <section key="offers" className="bg-ivory py-section">
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
    ),
    events: events.length > 0 && (
      <section key="events" className="bg-cream py-section">
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
    ),
    gallery: galleryAlbums.length > 0 && (
      <section key="gallery" className="bg-ivory py-section">
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
    ),
    video: demoVideo && (
      <section key="video" className="bg-forest py-section text-ivory">
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
    ),
    contact_cta: (
      <section key="contact_cta" className="relative overflow-hidden bg-navy py-section text-ivory">
        <Image src="/images/full/konie-nad-woda.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="shell relative z-10 text-center">
          <Reveal>
            <span className="eyebrow eyebrow--center justify-center text-brass-soft">Kontakt</span>
            <h2 className="mx-auto mt-6 max-w-2xl text-display-lg font-light text-shadow-hero">{content.cta_heading}</h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${settings.phone_href}`} className="btn-brass">Zadzwoń: {settings.phone}</a>
              <Link href="/kontakt" className="btn-ghost-light">Napisz wiadomość</Link>
              <Link href="/konie" className="btn-ghost-light">Zobacz konie</Link>
            </div>
          </Reveal>
        </div>
      </section>
    ),
  };

  return (
    <>
      {visible('hero') && (
        <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy">
          <Image
            src={content.hero_image_url}
            alt={content.hero_image_alt}
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
          <div className="shell-wide relative z-10 w-full pt-[76px] text-ivory">
            <div className="max-w-3xl animate-fade-in">
              <span className="eyebrow text-brass-soft">{content.hero_eyebrow}</span>
              <h1 className="mt-6 text-display-xl font-light text-shadow-hero">{content.hero_heading}</h1>
              <p className="prose-lux mt-6 max-w-xl text-ivory/85 text-shadow-hero">{content.hero_description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href={content.hero_button1_href} className="btn-brass">{content.hero_button1_label}</Link>
                <Link href={content.hero_button2_href} className="btn-ghost-light">{content.hero_button2_label}</Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/60 md:flex">
            <span className="text-[0.62rem] uppercase tracking-eyebrow">Przewiń</span>
            <span className="h-10 w-px bg-ivory/40" />
          </div>
        </section>
      )}

      {order.map((key) => sectionRenderers[key] ?? null)}
    </>
  );
}
