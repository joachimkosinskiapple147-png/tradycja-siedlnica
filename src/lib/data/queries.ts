import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Album, EventItem, Horse, Offer, TimelineEntry } from '@/lib/types';
import {
  seedAlbums,
  seedEvents,
  seedHorses,
  seedOffers,
  seedTimeline,
} from './seed';
import { isUpcoming } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
//  Warstwa dostępu do danych.
//
//  KONIE są odczytywane z bazy Supabase, gdy jest skonfigurowana (patrz README
//  → sekcja konfiguracji + supabase/seed.sql). W przeciwnym razie — i przy każdym
//  błędzie połączenia — używane są dane przykładowe z seed.ts, dzięki czemu strona
//  zawsze się renderuje.
//
//  WYDARZENIA / GALERIE / OFERTA / OŚ CZASU w tej wersji korzystają z danych
//  przykładowych. Ich moduły w panelu administratora oraz odczyt z bazy powstają
//  w kolejnym etapie i wykorzystują dokładnie ten sam wzorzec, co konie
//  (patrz komentarze poniżej i README → „Co dalej”).
// ─────────────────────────────────────────────────────────────────────────────

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

/* eslint-disable @typescript-eslint/no-explicit-any */
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
/* eslint-enable @typescript-eslint/no-explicit-any */

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

export async function getFeaturedHorses(limit = 6): Promise<Horse[]> {
  const all = await getHorses();
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

// ── Wydarzenia (dane przykładowe — moduł DB w kolejnym etapie) ────────────────
export async function getEvents(): Promise<EventItem[]> {
  return seedEvents.filter((e) => e.publish === 'opublikowany');
}
export async function getUpcomingEvents(): Promise<EventItem[]> {
  return (await getEvents()).filter((e) => isUpcoming(e.date)).sort((a, b) => a.date.localeCompare(b.date));
}
export async function getPastEvents(): Promise<EventItem[]> {
  return (await getEvents()).filter((e) => !isUpcoming(e.date)).sort((a, b) => b.date.localeCompare(a.date));
}
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return seedEvents.find((e) => e.slug === slug) ?? null;
}

// ── Galeria ───────────────────────────────────────────────────────────────────
export async function getAlbums(): Promise<Album[]> {
  return seedAlbums
    .filter((a) => a.publish === 'opublikowany')
    .sort((a, b) => a.position - b.position);
}
export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  return seedAlbums.find((a) => a.slug === slug) ?? null;
}

// ── Oferta ────────────────────────────────────────────────────────────────────
export async function getOffers(): Promise<Offer[]> {
  return seedOffers.filter((o) => o.active).sort((a, b) => a.position - b.position);
}
export async function getOfferBySlug(slug: string): Promise<Offer | null> {
  return seedOffers.find((o) => o.slug === slug) ?? null;
}

// ── Oś czasu ──────────────────────────────────────────────────────────────────
export async function getTimeline(): Promise<TimelineEntry[]> {
  return seedTimeline;
}

// ── Statystyki panelu ─────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const horses = await getHorses({ includeUnpublished: true });
  const events = seedEvents;
  const albums = seedAlbums;
  return {
    horsesTotal: horses.length,
    horsesForSale: horses.filter((h) => h.status === 'na_sprzedaz').length,
    horsesSold: horses.filter((h) => h.status === 'sprzedany').length,
    events: events.length,
    albums: albums.length,
  };
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
