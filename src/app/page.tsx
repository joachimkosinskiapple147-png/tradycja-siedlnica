import Link from 'next/link';
import Image from 'next/image';
import {
  getAlbums, getFeaturedHorses, getHomeContent, getHorseBySlug, getHorses,
  getOffers, getSiteSettings, getUpcomingEvents, getPastEvents,
  getFeaturedRiders, getStallions,
} from '@/lib/data/queries';
import { STANOWKA_INFO } from '@/lib/data/stallions';
import Reveal from '@/components/ui/Reveal';
import { SectionHeader, Ornament } from '@/components/ui/Primitives';
import HorseCard from '@/components/site/HorseCard';
import RiderCard from '@/components/site/RiderCard';
import StallionCard from '@/components/site/StallionCard';
import { EventCard, OfferCard, GalleryAlbumCard } from '@/components/site/Cards';
import VideoEmbed from '@/components/site/VideoEmbed';
import type { EventItem, Album } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [content, settings, offers, upcoming, past, albums, allHorses, riders, stallions] = await Promise.all([
    getHomeContent(), getSiteSettings(), getOffers(), getUpcomingEvents(), getPastEvents(), getAlbums(), getHorses(),
    getFeaturedRiders(4), getStallions(),
  ]);

  const featured = await getFeaturedHorses(3, content.featured_horse_ids);
  const allEvents: EventItem[] = [...upcoming, ...past];
  const events = content.featured_event_ids.length
    ? content.featured_event_ids.map((id) => allEvents.find((e) => e.id === id)).filter((e): e is EventItem => Boolean(e))
    : allEvents.slice(0, 3);
  const galleryAlbums: Album[] = content.featured_album_ids.length
    ? content.featured_album_ids.map((id) => albums.find((a) => a.id === id)).filter((a): a is Album => Boolean(a))
    : albums.slice(0, 3);
  const videoHorse = content.video_horse_slug ? await getHorseBySlug(content.video_horse_slug) : allHorses.find((h) => h.videos.some((v) => v.publish));
  const demoVideo = videoHorse?.videos.find((v) => v.publish);
  const heroBtn1 = (content.hero_button1_label || 'Zobacz konie').replace(/ na sprzedaż/gi, '');
  const visible = (key: string) => content.sections.find((s) => s.key === key)?.visible ?? true;
  const order = content.sections.filter((s) => s.key !== 'hero' && s.visible).map((s) => s.key);

  const sectionRenderers: Record<string, React.ReactNode> = {
    intro: (
      <section key="intro" className="bg-ivory py-section">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow eyebrow--center justify-center text-brass-deep">{content.intro_eyebrow}</span>
              <p className="mt-4 font-display text-display-sm font-semibold leading-tight text-navy">{content.intro_text}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 grid grid-cols-2 gap-3 border-y border-navy/10 py-6 md:grid-cols-4">
              {content.stats.map((s) => (
                <div key={s.label} className="chip-stat card-lift">
                  <div className="font-display text-4xl font-semibold tabular-nums text-navy md:text-5xl">{s.number}</div>
                  <div className="mx-auto mt-1 max-w-[14ch] text-[0.68rem] font-bold uppercase tracking-wide2 text-charcoal/60">{s.label}</div>
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
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeader eyebrow="Wybrane konie" title="Konie" index="01" />
              <div className="flex flex-wrap gap-2">
                <Link href="/konie" className="btn-ghost !py-2.5">Wszystkie</Link>
                <Link href="/stanowka" className="btn-brass !py-2.5">Stanówka →</Link>
              </div>
            </div>
          </Reveal>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {featured.map((h, i) => (<Reveal key={h.id} delay={i * 70}><HorseCard horse={h} priority={i === 0} /></Reveal>))}
          </div>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="bg-navy py-section text-ivory">
        <div className="shell-wide grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/5]">
              <Image src={content.about_image_url} alt={content.about_image_alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <span className="eyebrow text-brass-soft">{content.about_eyebrow}</span>
              <h2 className="mt-3 font-display text-display-md font-semibold !text-ivory">{content.about_heading}</h2>
              <div className="prose-lux mt-4 space-y-3 !text-ivory/80">
                {content.about_text.split(/\n{2,}/).map((p, i) => <p key={i}>{p.trim()}</p>)}
              </div>
              <Ornament className="mt-5 text-brass-soft" />
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/nasza-stajnia" className="btn-ghost-light">Nasza historia</Link>
                <Link href="/jezdcy" className="btn-brass">Jeźdźcy →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    ),
    offers: (
      <section key="offers" className="bg-ivory py-section">
        <div className="shell">
          <Reveal><SectionHeader eyebrow="Czym się zajmujemy" title="Oferta" align="center" index="02" /></Reveal>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {offers.slice(0, 6).map((o, i) => (<Reveal key={o.id} delay={(i % 3) * 70}><OfferCard offer={o} /></Reveal>))}
          </div>
        </div>
      </section>
    ),
    events: events.length > 0 && (
      <section key="events" className="bg-cream py-section">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeader eyebrow="Z życia stajni" title="Wydarzenia" />
              <Link href="/wydarzenia" className="btn-ghost self-start !py-2.5 md:self-auto">Wszystkie</Link>
            </div>
          </Reveal>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {events.map((e, i) => (<Reveal key={e.id} delay={i * 70}><EventCard event={e} /></Reveal>))}
          </div>
        </div>
      </section>
    ),
    gallery: galleryAlbums.length > 0 && (
      <section key="gallery" className="bg-ivory py-section">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeader eyebrow="Fotografie" title="Galeria" index="03" />
              <Link href="/galeria" className="btn-ghost self-start !py-2.5 md:self-auto">Galeria</Link>
            </div>
          </Reveal>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {galleryAlbums.map((a, i) => (<Reveal key={a.id} delay={i * 70}><GalleryAlbumCard album={a} /></Reveal>))}
          </div>
        </div>
      </section>
    ),
    video: demoVideo && (
      <section key="video" className="bg-forest py-section text-ivory">
        <div className="shell grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div>
              <span className="eyebrow text-brass-soft">Zobacz w ruchu</span>
              <h2 className="mt-3 font-display text-display-md font-semibold !text-ivory">Konie w pracy</h2>
              <p className="prose-lux mt-3 !text-ivory/80">Krótkie filmy pokazują ruch, charakter i przygotowanie konia. Filmy znajdziesz w profilach koni.</p>
              <Link href="/konie" className="btn-ghost-light mt-5">Przejdź do koni</Link>
            </div>
          </Reveal>
          <Reveal delay={100}><VideoEmbed video={demoVideo} /></Reveal>
        </div>
      </section>
    ),
    contact_cta: (
      <section key="contact_cta" className="relative overflow-hidden bg-navy py-section text-ivory">
        <Image src="/images/full/konie-nad-woda.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="shell relative z-10 text-center">
          <Reveal>
            <span className="eyebrow eyebrow--center justify-center text-brass-soft">Kontakt</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-display-md font-semibold !text-ivory text-shadow-hero">{content.cta_heading}</h2>
            <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <a href={`tel:${settings.phone_href}`} className="btn-brass">Zadzwoń: {settings.phone}</a>
              <Link href="/kontakt" className="btn-ghost-light">Napisz</Link>
              <Link href="/konie" className="btn-ghost-light">Konie</Link>
            </div>
          </Reveal>
        </div>
      </section>
    ),
  };

  return (
    <>
      {visible('hero') && (
        <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-navy md:min-h-[92svh]">
          <Image src={content.hero_image_url} alt={content.hero_image_alt} fill priority sizes="100vw" className="animate-ken-burns object-cover" />
          <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
          <div className="shell-wide relative z-10 w-full pb-16 pt-[100px] text-ivory">
            <div className="max-w-2xl animate-fade-in">
              <span className="hero-badge"><span className="dot" />Hodowla koni sportowych · od 1989</span>
              <span className="eyebrow mt-4 !text-brass-soft">{content.hero_eyebrow}</span>
              <h1 className="mt-4 text-balance font-display text-display-xl font-semibold !text-ivory text-shadow-hero">{content.hero_heading}</h1>
              <p className="prose-lux mt-4 max-w-xl !text-ivory/90 text-shadow-hero">{content.hero_description}</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Link href={content.hero_button1_href} className="btn-brass">{heroBtn1} →</Link>
                <Link href={content.hero_button2_href} className="btn-ghost-light">{content.hero_button2_label}</Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/jezdcy" className="chip !border-ivory/30 !bg-ivory/10 !text-ivory">Jeźdźcy →</Link>
                <Link href="/stanowka" className="chip !border-brass/50 !bg-brass/20 !text-brass-soft">Stanówka: {stallions.length} ogiery →</Link>
              </div>
              <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.7rem] font-bold uppercase tracking-wide2 text-ivory/70">
                <div className="flex items-center gap-2"><span className="inline-block h-1 w-1 rounded-full bg-brass-soft" />35+ lat hodowli</div>
                <div className="flex items-center gap-2"><span className="inline-block h-1 w-1 rounded-full bg-brass-soft" />Trening i sprzedaż</div>
                <div className="flex items-center gap-2"><span className="inline-block h-1 w-1 rounded-full bg-brass-soft" />Siedlnica · lubuskie</div>
              </dl>
            </div>
          </div>
        </section>
      )}

      {order.map((key) => sectionRenderers[key] ?? null)}

      {/* JEŹDŹCY teaser */}
      <section className="bg-ivory py-section">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeader eyebrow="Ludzie stajni" title="Jeźdźcy" index="04" intro="Trenerzy i zawodnicy, którzy przygotowują nasze konie." />
              <Link href="/jezdcy" className="btn-ghost self-start !py-2.5 md:self-auto">Wszyscy jeźdźcy</Link>
            </div>
          </Reveal>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {riders.map((r, i) => (<Reveal key={r.id} delay={(i % 4) * 70}><RiderCard rider={r} /></Reveal>))}
          </div>
        </div>
      </section>

      {/* STANÓWKA teaser */}
      <section className="bg-navy py-section text-ivory">
        <div className="shell">
          <Reveal>
            <div className="card-app !border-ivory/15 !bg-ivory/5 flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="eyebrow !text-brass-soft">Hodowla · krycie</span>
                <h2 className="mt-2 font-display text-display-sm font-semibold !text-ivory">{STANOWKA_INFO.title} — {stallions.length} ogiery</h2>
                <p className="mt-2 max-w-xl text-[0.92rem] font-medium text-ivory/75">{STANOWKA_INFO.intro}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href="/stanowka" className="btn-brass">Ogiery →</Link>
                <a href="tel:+48881293333" className="btn-ghost-light">Zadzwoń</a>
              </div>
            </div>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {stallions.slice(0, 3).map((s, i) => (<Reveal key={s.id} delay={(i % 3) * 70}><StallionCard stallion={s} /></Reveal>))}
          </div>
        </div>
      </section>
    </>
  );
}
