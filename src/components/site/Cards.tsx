import Link from 'next/link';
import Image from 'next/image';
import type { Album, EventItem, Offer, TimelineEntry } from '@/lib/types';
import { formatDatePl, isUpcoming } from '@/lib/utils';

export function EventCard({ event }: { event: EventItem }) {
  const upcoming = isUpcoming(event.date);
  return (
    <Link href={`/wydarzenia/${event.slug}`} className="group block">
      <article>
        <div className="relative aspect-[3/2] overflow-hidden bg-beige-soft">
          <Image
            src={event.cover.url}
            alt={event.cover.alt}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 status-pill bg-ivory/85 border-navy/15 text-navy">
            {upcoming ? 'Nadchodzące' : 'Zakończone'}
          </span>
        </div>
        <div className="pt-5">
          <div className="flex items-center gap-3 text-[0.72rem] uppercase tracking-wide2 text-brass-deep">
            <span>{event.category}</span>
            <span className="text-navy/25">·</span>
            <span className="text-charcoal/60">{formatDatePl(event.date)}</span>
          </div>
          <h3 className="mt-2 font-display text-[1.6rem] leading-tight text-navy transition-colors group-hover:text-forest">
            {event.title}
          </h3>
          <p className="prose-lux mt-2 text-[0.95rem] text-charcoal/70">{event.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="group flex flex-col border border-navy/10 bg-cream transition-colors hover:border-navy/25">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={offer.image.url}
          alt={offer.image.alt}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl text-navy">{offer.title}</h3>
        <p className="prose-lux mt-2 text-[0.95rem] text-charcoal/75">{offer.excerpt}</p>
        {offer.price && <p className="mt-3 text-sm font-medium text-brass-deep">{offer.price}</p>}
        <div className="mt-auto pt-5">
          <Link href={`/kontakt?temat=${encodeURIComponent(offer.title)}`} className="link-underline text-[0.75rem] font-semibold uppercase tracking-wide2 text-navy">
            Zapytaj o ofertę
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GalleryAlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/galeria/${album.slug}`} className="group block">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden bg-beige-soft">
          <Image
            src={album.cover.url}
            alt={album.cover.alt}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]"
          />
          <span className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/15" />
        </div>
        <div className="pt-4">
          <h3 className="font-display text-xl text-navy transition-colors group-hover:text-forest">{album.title}</h3>
          <p className="mt-1 text-[0.8rem] text-charcoal/60">
            {album.images.length} zdjęć{album.date ? ` · ${formatDatePl(album.date)}` : ''}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative">
      {entries.map((e) => (
        <li key={e.id} className="relative grid gap-6 pb-12 last:pb-0 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <div className="font-display text-4xl text-brass-deep">{e.year}</div>
            <h3 className="mt-1 font-display text-2xl text-navy">{e.title}</h3>
          </div>
          <div className="relative md:col-span-9 md:border-l md:border-navy/12 md:pl-10">
            <span className="absolute left-[-5px] top-2 hidden h-2.5 w-2.5 rounded-full bg-brass md:block" />
            <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
              <p className="prose-lux text-charcoal/80">{e.description}</p>
              {e.image && (
                <div className="relative aspect-[4/3] overflow-hidden bg-beige-soft">
                  <Image src={e.image.url} alt={e.image.alt} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
