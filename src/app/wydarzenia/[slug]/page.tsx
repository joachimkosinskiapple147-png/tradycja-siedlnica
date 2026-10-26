import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getEventBySlug, getHorseBySlug } from '@/lib/data/queries';
import { isAdmin } from '@/lib/supabase/admin';
import PreviewBanner from '@/components/admin/PreviewBanner';
import { buildMetadata, JsonLd, eventJsonLd } from '@/lib/seo';
import { formatDatePl, isUpcoming } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Primitives';
import AlbumMasonry from '@/components/site/AlbumMasonry';
import VideoEmbed from '@/components/site/VideoEmbed';
import HorseCard from '@/components/site/HorseCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const e = await getEventBySlug(params.slug);
  if (!e) return buildMetadata({ title: 'Wydarzenie nieznalezione', noIndex: true });
  return buildMetadata({
    title: e.title,
    description: e.excerpt,
    path: `/wydarzenia/${e.slug}`,
    image: e.cover.url,
  });
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  let event = await getEventBySlug(params.slug);
  let preview = false;
  if ((!event || event.publish !== 'opublikowany') && (await isAdmin())) {
    const p = await getEventBySlug(params.slug, { preview: true });
    if (p) {
      event = p;
      preview = true;
    }
  }
  if (!event || (!preview && event.publish !== 'opublikowany')) notFound();

  const horses = (
    await Promise.all(event.horse_slugs.map((s) => getHorseBySlug(s)))
  ).filter((h): h is NonNullable<typeof h> => Boolean(h));

  return (
    <article className="bg-ivory pt-[76px]">
      {preview && <PreviewBanner editHref={`/admin/wydarzenia/${event.id}`} label={`Szkic „${event.title}”`} />}
      <div className="border-b border-navy/10 bg-cream">
        <div className="shell py-8">
          <Breadcrumbs items={[{ name: 'Wydarzenia', path: '/wydarzenia' }, { name: event.title, path: `/wydarzenia/${event.slug}` }]} />
          <div className="mt-6 flex items-center gap-3 text-[0.72rem] uppercase tracking-wide2 text-brass-deep">
            <span>{event.category}</span>
            <span className="text-navy/25">·</span>
            <span className="text-charcoal/60">{formatDatePl(event.date)}</span>
            <span className="text-navy/25">·</span>
            <span className="text-charcoal/60">{isUpcoming(event.date) ? 'Nadchodzące' : 'Zakończone'}</span>
          </div>
          <h1 className="mt-3 max-w-3xl text-display-lg font-light text-navy">{event.title}</h1>
          {event.location && <p className="mt-2 text-charcoal/60">{event.location}</p>}
        </div>
      </div>

      <div className="shell py-section">
        <div className="mx-auto max-w-prose2">
          <p className="prose-lux text-lg">{event.excerpt}</p>
          {event.body && <div className="prose-lux mt-6 whitespace-pre-line">{event.body}</div>}
          {event.results && (
            <div className="mt-8 border border-navy/12 bg-cream p-6">
              <h2 className="font-display text-xl text-navy">Wyniki</h2>
              <p className="prose-lux mt-3 whitespace-pre-line">{event.results}</p>
            </div>
          )}
        </div>

        {event.gallery.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl text-navy">Zdjęcia</h2>
            <div className="rule-double mt-3 w-16" />
            <div className="mt-6">
              <AlbumMasonry images={event.gallery.map((g, i) => ({ id: g.id, url: g.url, thumb: g.thumb, alt: g.alt, position: i }))} />
            </div>
          </div>
        )}

        {event.videos.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl text-navy">Filmy</h2>
            <div className="rule-double mt-3 w-16" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {event.videos.map((v) => <VideoEmbed key={v.id} video={v} />)}
            </div>
          </div>
        )}

        {horses.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl text-navy">Konie biorące udział</h2>
            <div className="rule-double mt-3 w-16" />
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {horses.map((h) => <HorseCard key={h.id} horse={h} />)}
            </div>
          </div>
        )}

        <div className="mt-14">
          <Link href="/wydarzenia" className="btn-ghost">← Wszystkie wydarzenia</Link>
        </div>
      </div>

      <JsonLd
        data={eventJsonLd({
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.excerpt,
          image: event.cover.url,
          path: `/wydarzenia/${event.slug}`,
        })}
      />
    </article>
  );
}
