import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { getHorses, getEvents, getAlbums, getRiders, getStallions } from '@/lib/data/queries';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [horses, events, albums, riders, stallions] = await Promise.all([getHorses(), getEvents(), getAlbums(), getRiders(), getStallions()]);

  const staticRoutes = [
    '',
    '/nasza-stajnia',
    '/konie',
    '/galeria',
    '/wydarzenia',
    '/oferta',
    '/jezdcy',
    '/stanowka',
    '/kontakt',
    '/polityka-prywatnosci',
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));

  const horseRoutes = horses.map((h) => ({
    url: `${SITE.url}/konie/${h.slug}`,
    lastModified: h.updated_at ? new Date(h.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const eventRoutes = events.map((e) => ({
    url: `${SITE.url}/wydarzenia/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const albumRoutes = albums.map((a) => ({
    url: `${SITE.url}/galeria/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  const riderRoutes = riders.map((r) => ({ url: `${SITE.url}/jezdcy/${r.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }));
  const stallionRoutes = stallions.map((s) => ({ url: `${SITE.url}/stanowka/${s.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }));
  return [...staticRoutes, ...horseRoutes, ...riderRoutes, ...stallionRoutes, ...eventRoutes, ...albumRoutes];
}
