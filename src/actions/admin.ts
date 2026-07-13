'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { slugify } from '@/lib/utils';

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');
  return supabase;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
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

/**
 * Zapis konia (utworzenie lub edycja). Obsługuje pola tekstowe, status, cenę,
 * SEO, rodowód, listę zdjęć (URL + pozycja) oraz linki do filmów YouTube.
 */
export async function saveHorse(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane (patrz README).' };
  }
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const name = str(fd, 'name');
  if (name.length < 2) return { ok: false, message: 'Podaj imię konia.' };

  const slug = str(fd, 'slug') || slugify(name);

  const horseRow = {
    name,
    slug,
    full_name: str(fd, 'full_name') || null,
    status: str(fd, 'status') || 'na_sprzedaz',
    publish: str(fd, 'publish') || 'szkic',
    featured: fd.get('featured') === 'on',
    position: numOrNull(fd, 'position') ?? 0,
    birth_year: numOrNull(fd, 'birth_year'),
    birth_date: str(fd, 'birth_date') || null,
    sex: str(fd, 'sex') || 'walach',
    breed: str(fd, 'breed') || null,
    color: str(fd, 'color') || null,
    height_cm: numOrNull(fd, 'height_cm'),
    origin: str(fd, 'origin') || null,
    discipline: str(fd, 'discipline') || null,
    training_level: str(fd, 'training_level') || null,
    temperament: str(fd, 'temperament') || null,
    training_state: str(fd, 'training_state') || null,
    achievements: str(fd, 'achievements') || null,
    description: str(fd, 'description') || null,
    price: str(fd, 'price') || 'Cena na zapytanie',
    seo_title: str(fd, 'seo_title') || null,
    seo_description: str(fd, 'seo_description') || null,
    updated_at: new Date().toISOString(),
  };

  let horseId = id;
  try {
    if (id) {
      const { error } = await supabase.from('horses').update(horseRow).eq('id', id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('horses').insert(horseRow).select('id').single();
      if (error) throw error;
      horseId = data.id;
    }

    // Rodowód (upsert 1:1)
    const pedigree = {
      horse_id: horseId,
      sire: str(fd, 'ped_sire') || null,
      dam: str(fd, 'ped_dam') || null,
      damsire: str(fd, 'ped_damsire') || null,
      sire_line: str(fd, 'ped_sire_line') || null,
      dam_line: str(fd, 'ped_dam_line') || null,
      notes: str(fd, 'ped_notes') || null,
    };
    await supabase.from('horse_pedigree').upsert(pedigree, { onConflict: 'horse_id' });

    // Zdjęcia (zastąpienie listy). Pola: image_url[], image_alt[], image_caption[]
    const urls = fd.getAll('image_url').map(String).map((s) => s.trim()).filter(Boolean);
    const alts = fd.getAll('image_alt').map(String);
    const caps = fd.getAll('image_caption').map(String);
    const thumbs = fd.getAll('image_thumb').map(String);
    await supabase.from('horse_images').delete().eq('horse_id', horseId);
    if (urls.length) {
      const imgRows = urls.map((url, i) => ({
        horse_id: horseId,
        url,
        thumb: thumbs[i]?.trim() || null,
        alt: alts[i]?.trim() || name,
        caption: caps[i]?.trim() || null,
        position: i,
        is_cover: i === 0,
      }));
      const { error } = await supabase.from('horse_images').insert(imgRows);
      if (error) throw error;
    }

    // Filmy YouTube
    const vids = fd.getAll('video_id').map(String).map((s) => s.trim()).filter(Boolean);
    const vtitles = fd.getAll('video_title').map(String);
    await supabase.from('horse_videos').delete().eq('horse_id', horseId);
    if (vids.length) {
      const vidRows = vids.map((youtube_id, i) => ({
        horse_id: horseId,
        youtube_id: extractYouTubeId(youtube_id),
        title: vtitles[i]?.trim() || 'Film',
        position: i,
      }));
      await supabase.from('horse_videos').insert(vidRows);
    }
  } catch (e) {
    console.error('[saveHorse]', e);
    return { ok: false, message: 'Nie udało się zapisać konia. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/konie');
  revalidatePath('/konie');
  revalidatePath(`/konie/${slug}`);
  redirect('/admin/konie?zapisano=1');
}

export async function deleteHorse(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('horses').delete().eq('id', id);
  revalidatePath('/admin/konie');
  revalidatePath('/konie');
}

export async function quickSetHorse(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('horses').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/admin/konie');
  revalidatePath('/konie');
}

// ── Wiadomości ────────────────────────────────────────────────────────────────
export async function setMessageStatus(id: string, status: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('contact_messages').update({ status }).eq('id', id);
  revalidatePath('/admin/wiadomosci');
}

export async function saveMessageNote(id: string, note: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('contact_messages').update({ note }).eq('id', id);
  revalidatePath('/admin/wiadomosci');
}

export async function deleteMessage(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('contact_messages').delete().eq('id', id);
  revalidatePath('/admin/wiadomosci');
}

function extractYouTubeId(input: string): string {
  const m = input.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : input;
}
