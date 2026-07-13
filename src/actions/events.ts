'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { slugify } from '@/lib/utils';
import { extractYouTubeId } from '@/lib/youtube';

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');
  return supabase;
}

type ActionResult = { ok: boolean; message: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}
function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function saveEvent(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const title = str(fd, 'title');
  if (title.length < 2) return { ok: false, message: 'Podaj tytuł wydarzenia.' };
  const slug = str(fd, 'slug') || slugify(title);
  const date = str(fd, 'date');
  if (!date) return { ok: false, message: 'Podaj datę wydarzenia.' };

  const eventRow = {
    title,
    slug,
    category: str(fd, 'category') || null,
    date,
    location: str(fd, 'location') || null,
    cover_url: str(fd, 'cover_url') || null,
    cover_alt: str(fd, 'cover_alt') || null,
    excerpt: str(fd, 'excerpt') || null,
    body: str(fd, 'body') || null,
    results: str(fd, 'results') || null,
    publish: str(fd, 'publish') || 'szkic',
    position: numOrNull(fd, 'position') ?? 0,
  };

  let eventId = id;
  try {
    if (id) {
      const { error } = await supabase.from('events').update(eventRow).eq('id', id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('events').insert(eventRow).select('id').single();
      if (error) throw error;
      eventId = data.id;
    }

    const urls = fd.getAll('image_url').map(String).map((s) => s.trim()).filter(Boolean);
    const alts = fd.getAll('image_alt').map(String);
    await supabase.from('event_images').delete().eq('event_id', eventId);
    if (urls.length) {
      const rows = urls.map((url, i) => ({ event_id: eventId, url, alt: alts[i]?.trim() || title, position: i }));
      const { error } = await supabase.from('event_images').insert(rows);
      if (error) throw error;
    }

    const vids = fd.getAll('video_id').map(String).map((s) => s.trim()).filter(Boolean);
    const vtitles = fd.getAll('video_title').map(String);
    await supabase.from('event_videos').delete().eq('event_id', eventId);
    if (vids.length) {
      const rows = vids.map((raw, i) => ({
        event_id: eventId,
        youtube_id: extractYouTubeId(raw) ?? raw,
        title: vtitles[i]?.trim() || null,
        position: i,
      }));
      const { error } = await supabase.from('event_videos').insert(rows);
      if (error) throw error;
    }

    const horseIds = fd.getAll('horse_id').map(String).filter(Boolean);
    await supabase.from('event_horses').delete().eq('event_id', eventId);
    if (horseIds.length) {
      const rows = horseIds.map((horse_id) => ({ event_id: eventId, horse_id }));
      const { error } = await supabase.from('event_horses').insert(rows);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveEvent]', e);
    return { ok: false, message: 'Nie udało się zapisać wydarzenia. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/wydarzenia');
  revalidatePath('/wydarzenia');
  revalidatePath(`/wydarzenia/${slug}`);
  revalidatePath('/');
  redirect('/admin/wydarzenia?zapisano=1');
}

export async function deleteEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('events').delete().eq('id', id);
  revalidatePath('/admin/wydarzenia');
  revalidatePath('/wydarzenia');
  revalidatePath('/');
}

export async function quickSetEvent(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('events').update(patch).eq('id', id);
  revalidatePath('/admin/wydarzenia');
  revalidatePath('/wydarzenia');
  revalidatePath('/');
}
