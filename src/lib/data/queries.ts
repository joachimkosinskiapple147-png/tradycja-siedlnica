import { seedRiders } from './riders';
import { seedStallions } from './stallions';
import { seedLegends } from './legends';
import type { Rider, Stallion, Legend } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Album, AboutContent, EventItem, HomeContent, Horse, Offer, SiteSettings, TimelineEntry } from '@/lib/types';
import {
  seedAlbums,
  seedEvents,
  seedHorses,
  seedOffers,
  seedTimeline,
} from './seed';
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HOME_CONTENT,
  DEFAULT_SITE_SETTINGS,
  mergeAboutContent,
  mergeHomeContent,
  mergeSiteSettings,
} from './defaults';
import { isUpcoming } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
//  Warstwa dostępu do danych.
//
//  Wszystkie moduły czytają z Supabase, gdy baza jest skonfigurowana — w
//  przeciwnym razie (lub przy błędzie połączenia) korzystają z danych
//  przykładowych z seed.ts, dzięki czemu strona zawsze się renderuje.
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

type HorseFilters = {
  status?: string;
  sex?: string;
  breed?: string;
  discipline?: string;
  minHeight?: number;
  maxHeight?: number;
  search?: string;
  includeUnpublished?: boolean;
};

const HORSE_SELECT =
  '*, horse_images(*), horse_videos(*), horse_pedigree(*)';

function mapHorseRow(row: any): Horse {
  const images = (row.horse_images ?? [])
    .map((i: any) => ({
      id: i.id,
      url: i.url,
      thumb: i.thumb ?? undefined,
      alt: i.alt ?? '',
      caption: i.caption ?? undefined,
      position: i.position ?? 0,
      is_cover: i.is_cover ?? false,
    }))
    .sort((a: any, b: any) => a.position - b.position);

  const videos = (row.horse_videos ?? [])
    .map((v: any) => ({
      id: v.id,
      youtube_id: v.youtube_id,
      title: v.title ?? '',
      description: v.description ?? undefined,
      category: v.category ?? undefined,
      publish: v.publish ?? true,
      position: v.position ?? 0,
    }))
    .sort((a: any, b: any) => a.position - b.position);

  const ped = Array.isArray(row.horse_pedigree)
    ? row.horse_pedigree[0]
    : row.horse_pedigree;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    full_name: row.full_name ?? undefined,
    status: row.status,
    publish: row.publish,
    featured: row.featured ?? false,
    position: row.position ?? 0,
    birth_year: row.birth_year ?? undefined,
    birth_date: row.birth_date ?? undefined,
    sex: row.sex,
    breed: row.breed ?? undefined,
    color: row.color ?? undefined,
    height_cm: row.height_cm ?? undefined,
    origin: row.origin ?? undefined,
    discipline: row.discipline ?? undefined,
    training_level: row.training_level ?? undefined,
    temperament: row.temperament ?? undefined,
    training_state: row.training_state ?? undefined,
    achievements: row.achievements ?? undefined,
    description: row.description ?? undefined,
    price: row.price ?? undefined,
    pedigree: ped
      ? {
          sire: ped.sire ?? undefined,
          dam: ped.dam ?? undefined,
          damsire: ped.damsire ?? undefined,
          sire_line: ped.sire_line ?? undefined,
          dam_line: ped.dam_line ?? undefined,
          notes: ped.notes ?? undefined,
        }
      : undefined,
    images,
    videos,
    seo_title: row.seo_title ?? undefined,
    seo_description: row.seo_description ?? undefined,
    updated_at: row.updated_at ?? undefined,
  };
}

function applyHorseFilters(list: Horse[], f: HorseFilters): Horse[] {
  let out = list;
  if (!f.includeUnpublished) out = out.filter((h) => h.publish === 'opublikowany');
  if (f.status) out = out.filter((h) => h.status === f.status);
  if (f.sex) out = out.filter((h) => h.sex === f.sex);
  if (f.breed) out = out.filter((h) => (h.breed ?? '').toLowerCase().includes(f.breed!.toLowerCase()));
  if (f.discipline)
    out = out.filter((h) => (h.discipline ?? '').toLowerCase().includes(f.discipline!.toLowerCase()));
  if (f.minHeight) out = out.filter((h) => (h.height_cm ?? 0) >= f.minHeight!);
  if (f.maxHeight) out = out.filter((h) => (h.height_cm ?? 999) <= f.maxHeight!);
  if (f.search) {
    const q = f.search.toLowerCase();
    out = out.filter((h) =>
      [h.name, h.full_name, h.breed, h.discipline, h.color, h.description]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }
  return out.sort((a, b) => a.position - b.position);
}

export async function getHorses(filters: HorseFilters = {}): Promise<Horse[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('horses').select(HORSE_SELECT);
      if (!filters.includeUnpublished) query = query.eq('publish', 'opublikowany');
      const { data, error } = await query.order('position', { ascending: true });
      if (error) throw error;
      const mapped = (data ?? []).map(mapHorseRow);
      // filtry stosujemy po stronie aplikacji dla spójności z trybem seed
      return applyHorseFilters(mapped, { ...filters, includeUnpublished: true }).filter((h) =>
        filters.includeUnpublished ? true : h.publish === 'opublikowany'
      );
    } catch (e) {
      console.error('[queries.getHorses] fallback na dane przykładowe:', e);
    }
  }
  return applyHorseFilters(seedHorses, filters);
}

export async function getFeaturedHorses(limit = 6, ids?: string[]): Promise<Horse[]> {
  const all = await getHorses();
  if (ids && ids.length) {
    const bySlugOrId = new Map(all.map((h) => [h.id, h] as const));
    const chosen = ids.map((id) => bySlugOrId.get(id)).filter((h): h is Horse => Boolean(h));
    if (chosen.length) return chosen.slice(0, limit);
  }
  const featured = all.filter((h) => h.featured && h.status !== 'sprzedany');
  const base = featured.length ? featured : all.filter((h) => h.status === 'na_sprzedaz');
  return base.slice(0, limit);
}

export async function getHorseBySlug(slug: string): Promise<Horse | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('horses')
        .select(HORSE_SELECT)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      if (data) return mapHorseRow(data);
      return null;
    } catch (e) {
      console.error('[queries.getHorseBySlug] fallback:', e);
    }
  }
  return seedHorses.find((h) => h.slug === slug) ?? null;
}

export async function getSimilarHorses(horse: Horse, limit = 3): Promise<Horse[]> {
  const all = await getHorses();
  return all
    .filter((h) => h.slug !== horse.slug)
    .map((h) => {
      let score = 0;
      if (h.discipline && horse.discipline && h.discipline === horse.discipline) score += 3;
      if (h.status === horse.status) score += 2;
      if (h.breed && horse.breed && h.breed === horse.breed) score += 1;
      return { h, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.h);
}

export function getHorseFilterOptions(list: Horse[]) {
  const breeds = Array.from(new Set(list.map((h) => h.breed).filter(Boolean))) as string[];
  const disciplines = Array.from(new Set(list.map((h) => h.discipline).filter(Boolean))) as string[];
  return { breeds, disciplines };
}

// ── Panel: koń po ID (z szkicami) ─────────────────────────────────────────────
export async function getHorseById(id: string): Promise<Horse | null> {
  if (!isSupabaseConfigured) {
    return seedHorses.find((h) => h.id === id) ?? null;
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('horses').select(HORSE_SELECT).eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapHorseRow(data) : null;
  } catch (e) {
    console.error('[queries.getHorseById]', e);
    return null;
  }
}

// ============================================================================
//  WYDARZENIA
// ============================================================================
const EVENT_SELECT = '*, event_images(*), event_videos(*), event_horses(horse_id)';

function mapEventRow(row: any): EventItem {
  const images = (row.event_images ?? [])
    .map((i: any) => ({ id: i.id, url: i.url, thumb: i.thumb ?? undefined, alt: i.alt ?? '', position: i.position ?? 0 }))
    .sort((a: any, b: any) => a.position - b.position);
  const videos = (row.event_videos ?? [])
    .map((v: any) => ({
      id: v.id,
      youtube_id: v.youtube_id,
      title: v.title ?? '',
      publish: true,
      position: v.position ?? 0,
    }))
    .sort((a: any, b: any) => a.position - b.position);
  const cover = row.cover_url
    ? { id: `${row.id}-cover`, url: row.cover_url, alt: row.cover_alt ?? row.title, position: 0 }
    : images[0] ?? { id: `${row.id}-cover`, url: '/images/full/hero.webp', alt: row.title, position: 0 };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? '',
    date: row.date,
    location: row.location ?? undefined,
    cover,
    excerpt: row.excerpt ?? '',
    body: row.body ?? undefined,
    results: row.results ?? undefined,
    gallery: images,
    videos,
    horse_slugs: (row.event_horses ?? []).map((h: any) => h.horse_id),
    publish: row.publish,
    position: row.position ?? 0,
  };
}

export async function getEvents(opts: { includeUnpublished?: boolean } = {}): Promise<EventItem[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('events').select(EVENT_SELECT);
      if (!opts.includeUnpublished) query = query.eq('publish', 'opublikowany');
      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      const mapped = (data ?? []).map(mapEventRow);
      // event_horses.horse_id trzeba zamienić na slug
      const allHorses = await getHorses({ includeUnpublished: true });
      const byId = new Map(allHorses.map((h) => [h.id, h.slug]));
      return mapped.map((e) => ({ ...e, horse_slugs: e.horse_slugs.map((id) => byId.get(id) ?? id).filter(Boolean) }));
    } catch (e) {
      console.error('[queries.getEvents] fallback:', e);
    }
  }
  return opts.includeUnpublished ? seedEvents : seedEvents.filter((e) => e.publish === 'opublikowany');
}
export async function getUpcomingEvents(): Promise<EventItem[]> {
  return (await getEvents()).filter((e) => isUpcoming(e.date)).sort((a, b) => a.date.localeCompare(b.date));
}
export async function getPastEvents(): Promise<EventItem[]> {
  return (await getEvents()).filter((e) => !isUpcoming(e.date)).sort((a, b) => b.date.localeCompare(a.date));
}
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const all = await getEvents({ includeUnpublished: true });
  return all.find((e) => e.slug === slug) ?? null;
}
export async function getEventById(id: string): Promise<EventItem | null> {
  if (!isSupabaseConfigured) return seedEvents.find((e) => e.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('events').select(EVENT_SELECT).eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const mapped = mapEventRow(data);
    const allHorses = await getHorses({ includeUnpublished: true });
    const byId = new Map(allHorses.map((h) => [h.id, h.slug]));
    return { ...mapped, horse_slugs: mapped.horse_slugs.map((id) => byId.get(id) ?? id).filter(Boolean) };
  } catch (e) {
    console.error('[queries.getEventById]', e);
    return null;
  }
}

// ============================================================================
//  GALERIA
// ============================================================================
const ALBUM_SELECT = '*, album_images(*)';

function mapAlbumRow(row: any): Album {
  const images = (row.album_images ?? [])
    .map((i: any) => ({ id: i.id, url: i.url, thumb: i.thumb ?? undefined, alt: i.alt ?? '', position: i.position ?? 0 }))
    .sort((a: any, b: any) => a.position - b.position);
  const cover = row.cover_url
    ? { id: `${row.id}-cover`, url: row.cover_url, alt: row.cover_alt ?? row.title, position: 0 }
    : images[0] ?? { id: `${row.id}-cover`, url: '/images/full/hero.webp', alt: row.title, position: 0 };
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date ?? undefined,
    cover,
    images,
    publish: row.publish,
    position: row.position ?? 0,
  };
}

export async function getAlbums(opts: { includeUnpublished?: boolean } = {}): Promise<Album[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('albums').select(ALBUM_SELECT);
      if (!opts.includeUnpublished) query = query.eq('publish', 'opublikowany');
      const { data, error } = await query.order('position', { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapAlbumRow);
    } catch (e) {
      console.error('[queries.getAlbums] fallback:', e);
    }
  }
  const list = opts.includeUnpublished ? seedAlbums : seedAlbums.filter((a) => a.publish === 'opublikowany');
  return [...list].sort((a, b) => a.position - b.position);
}
export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const all = await getAlbums({ includeUnpublished: true });
  return all.find((a) => a.slug === slug) ?? null;
}
export async function getAlbumById(id: string): Promise<Album | null> {
  if (!isSupabaseConfigured) return seedAlbums.find((a) => a.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('albums').select(ALBUM_SELECT).eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapAlbumRow(data) : null;
  } catch (e) {
    console.error('[queries.getAlbumById]', e);
    return null;
  }
}

// ============================================================================
//  OFERTA
// ============================================================================
function mapOfferRow(row: any): Offer {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    body: row.body ?? undefined,
    image: row.image_url
      ? { id: `${row.id}-img`, url: row.image_url, alt: row.image_alt ?? row.title, position: 0 }
      : { id: `${row.id}-img`, url: '/images/full/hero.webp', alt: row.title, position: 0 },
    price: row.price ?? undefined,
    benefits: row.benefits ?? undefined,
    active: row.active,
    position: row.position ?? 0,
  };
}

export async function getOffers(opts: { includeInactive?: boolean } = {}): Promise<Offer[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('offers').select('*');
      if (!opts.includeInactive) query = query.eq('active', true);
      const { data, error } = await query.order('position', { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapOfferRow);
    } catch (e) {
      console.error('[queries.getOffers] fallback:', e);
    }
  }
  const list = opts.includeInactive ? seedOffers : seedOffers.filter((o) => o.active);
  return [...list].sort((a, b) => a.position - b.position);
}
export async function getOfferBySlug(slug: string): Promise<Offer | null> {
  const all = await getOffers({ includeInactive: true });
  return all.find((o) => o.slug === slug) ?? null;
}
export async function getOfferById(id: string): Promise<Offer | null> {
  if (!isSupabaseConfigured) return seedOffers.find((o) => o.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapOfferRow(data) : null;
  } catch (e) {
    console.error('[queries.getOfferById]', e);
    return null;
  }
}

// ============================================================================
//  OŚ CZASU
// ============================================================================
function mapTimelineRow(row: any): TimelineEntry {
  return {
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description ?? '',
    image: row.image_url ? { id: `${row.id}-img`, url: row.image_url, alt: row.image_alt ?? row.title, position: 0 } : undefined,
    position: row.position ?? 0,
  };
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('timeline_entries').select('*').order('position', { ascending: true });
      if (error) throw error;
      if (data && data.length) return data.map(mapTimelineRow);
      return [];
    } catch (e) {
      console.error('[queries.getTimeline] fallback:', e);
    }
  }
  return seedTimeline;
}
export async function getTimelineEntryById(id: string): Promise<TimelineEntry | null> {
  if (!isSupabaseConfigured) return seedTimeline.find((t) => t.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('timeline_entries').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapTimelineRow(data) : null;
  } catch (e) {
    console.error('[queries.getTimelineEntryById]', e);
    return null;
  }
}

// ============================================================================
//  TREŚCI STRONY GŁÓWNEJ + USTAWIENIA
// ============================================================================
export async function getHomeContent(): Promise<HomeContent> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('page_content').select('value').eq('key', 'home').maybeSingle();
      if (error) throw error;
      return mergeHomeContent(data?.value ?? null);
    } catch (e) {
      console.error('[queries.getHomeContent] fallback:', e);
    }
  }
  return DEFAULT_HOME_CONTENT;
}

export async function getAboutContent(): Promise<AboutContent> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('page_content').select('value').eq('key', 'about').maybeSingle();
      if (error) throw error;
      return mergeAboutContent(data?.value ?? null);
    } catch (e) {
      console.error('[queries.getAboutContent] fallback:', e);
    }
  }
  return DEFAULT_ABOUT_CONTENT;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'general').maybeSingle();
      if (error) throw error;
      return mergeSiteSettings(data?.value ?? null);
    } catch (e) {
      console.error('[queries.getSiteSettings] fallback:', e);
    }
  }
  return DEFAULT_SITE_SETTINGS;
}

// ── Statystyki panelu ─────────────────────────────────────────────────────────
export async function getExtendedDashboardStats() {
  const [riders, stallions, legends] = await Promise.all([getRiders({ includeUnpublished: true }), getStallions({ includeUnpublished: true }), getLegends({ includeUnpublished: true })]);
  return { riders: riders.length, stallions: stallions.length, legends: legends.length };
}

export async function getDashboardStats() {
  const [horses, events, albums, offers] = await Promise.all([
    getHorses({ includeUnpublished: true }),
    getEvents({ includeUnpublished: true }),
    getAlbums({ includeUnpublished: true }),
    getOffers({ includeInactive: true }),
  ]);
  return {
    horsesTotal: horses.length,
    horsesForSale: horses.filter((h) => h.status === 'na_sprzedaz').length,
    horsesSold: horses.filter((h) => h.status === 'sprzedany').length,
    events: events.length,
    albums: albums.length,
    offers: offers.length,
  };
}

// ── Panel: wiadomości kontaktowe ──────────────────────────────────────────────
export type AdminMessage = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  subject: string | null;
  message: string;
  horse_slug: string | null;
  horse_name: string | null;
  status: string;
  note: string | null;
};

export async function getMessages(): Promise<AdminMessage[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as AdminMessage[];
  } catch (e) {
    console.error('[queries.getMessages]', e);
    return [];
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'nowa');
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// ── JEŹDŹCY ──
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRiderRow(row: any): Rider {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role ?? '',
    specialty: row.specialty ?? undefined,
    experience: row.experience ?? undefined,
    achievements: row.achievements ?? undefined,
    description: row.description ?? undefined,
    phone: row.phone ?? undefined,
    image: row.image_url
      ? { id: `${row.id}-img`, url: row.image_url, alt: row.image_alt ?? row.name, position: 0 }
      : { id: `${row.id}-img`, url: '/images/full/hero.webp', alt: row.name, position: 0 },
    horse_slugs: row.horse_slugs ?? [],
    featured: row.featured ?? false,
    position: row.position ?? 0,
    publish: row.publish ?? 'szkic',
  };
}
export async function getRiders(opts: { includeUnpublished?: boolean } = {}): Promise<Rider[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('riders').select('*');
      if (!opts.includeUnpublished) query = query.eq('publish', 'opublikowany');
      const { data, error } = await query.order('position', { ascending: true });
      if (error) throw error;
      if (data && data.length) return data.map(mapRiderRow);
    } catch (e) { console.error('[queries.getRiders] fallback:', e); }
  }
  const list = opts.includeUnpublished ? seedRiders : seedRiders.filter((r) => r.publish === 'opublikowany');
  return [...list].sort((a, b) => a.position - b.position);
}
export async function getRiderBySlug(slug: string): Promise<Rider | null> {
  const all = await getRiders({ includeUnpublished: true });
  return all.find((r) => r.slug === slug) ?? null;
}
export async function getRiderById(id: string): Promise<Rider | null> {
  if (!isSupabaseConfigured) return seedRiders.find((r) => r.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('riders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapRiderRow(data) : null;
  } catch (e) {
    console.error('[queries.getRiderById]', e);
    return null;
  }
}
export async function getFeaturedRiders(limit = 4): Promise<Rider[]> {
  const all = await getRiders();
  return (all.filter((r) => r.featured).length ? all.filter((r) => r.featured) : all).slice(0, limit);
}

// ── STANÓWKA (ogiery kryjące) ──
function mapStallionRow(row: any): Stallion {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    full_name: row.full_name ?? undefined,
    breed: row.breed ?? undefined,
    birth_year: row.birth_year ?? undefined,
    color: row.color ?? undefined,
    height_cm: row.height_cm ?? undefined,
    pedigree:
      row.sire || row.dam || row.pedigree_notes
        ? { sire: row.sire ?? undefined, dam: row.dam ?? undefined, notes: row.pedigree_notes ?? undefined }
        : undefined,
    description: row.description ?? undefined,
    achievements: row.achievements ?? undefined,
    covering_price: row.covering_price ?? undefined,
    semen: row.semen ?? undefined,
    season: row.season ?? undefined,
    station: row.station ?? undefined,
    image: row.image_url
      ? { id: `${row.id}-img`, url: row.image_url, alt: row.image_alt ?? row.name, position: 0 }
      : { id: `${row.id}-img`, url: '/images/full/hero.webp', alt: row.name, position: 0 },
    gallery: [],
    videos: [],
    featured: row.featured ?? false,
    position: row.position ?? 0,
    publish: row.publish ?? 'szkic',
  };
}
export async function getStallions(opts: { includeUnpublished?: boolean } = {}): Promise<Stallion[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('stallions').select('*');
      if (!opts.includeUnpublished) query = query.eq('publish', 'opublikowany');
      const { data, error } = await query.order('position', { ascending: true });
      if (error) throw error;
      if (data && data.length) return data.map(mapStallionRow);
    } catch (e) { console.error('[queries.getStallions] fallback:', e); }
  }
  const list = opts.includeUnpublished ? seedStallions : seedStallions.filter((s) => s.publish === 'opublikowany');
  return [...list].sort((a, b) => a.position - b.position);
}
export async function getStallionBySlug(slug: string): Promise<Stallion | null> {
  const all = await getStallions({ includeUnpublished: true });
  return all.find((s) => s.slug === slug) ?? null;
}
export async function getStallionById(id: string): Promise<Stallion | null> {
  if (!isSupabaseConfigured) return seedStallions.find((s) => s.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('stallions').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapStallionRow(data) : null;
  } catch (e) {
    console.error('[queries.getStallionById]', e);
    return null;
  }
}

function mapLegendRow(row: any): Legend {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    breed: row.breed ?? undefined,
    birth_year: row.birth_year ?? undefined,
    color: row.color ?? undefined,
    years_at_stable: row.years_at_stable ?? undefined,
    where_now: row.where_now ?? undefined,
    achievements: row.achievements ?? undefined,
    story: row.story ?? undefined,
    image: row.image_url
      ? { id: `${row.id}-img`, url: row.image_url, alt: row.image_alt ?? row.name, position: 0 }
      : { id: `${row.id}-img`, url: '/images/full/hero.webp', alt: row.name, position: 0 },
    gallery: [],
    featured: row.featured ?? false,
    position: row.position ?? 0,
    publish: row.publish ?? 'opublikowany',
  };
}
export async function getLegends(opts: { includeUnpublished?: boolean } = {}): Promise<Legend[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase.from('legends').select('*');
      if (!opts.includeUnpublished) query = query.eq('publish', 'opublikowany');
      const { data, error } = await query.order('position', { ascending: true });
      if (error) throw error;
      if (data && data.length) return data.map(mapLegendRow);
    } catch (e) { console.error('[queries.getLegends] fallback:', e); }
  }
  const list = opts.includeUnpublished ? seedLegends : seedLegends.filter((l) => l.publish === 'opublikowany');
  return [...list].sort((a, b) => a.position - b.position);
}
export async function getLegendBySlug(slug: string): Promise<Legend | null> {
  const all = await getLegends({ includeUnpublished: true });
  return all.find((l) => l.slug === slug) ?? null;
}
export async function getLegendById(id: string): Promise<Legend | null> {
  if (!isSupabaseConfigured) return seedLegends.find((l) => l.id === id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('legends').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapLegendRow(data) : null;
  } catch (e) {
    console.error('[queries.getLegendById]', e);
    return null;
  }
}
