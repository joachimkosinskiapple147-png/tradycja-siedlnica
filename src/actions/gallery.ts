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

export async function saveAlbum(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const title = str(fd, 'title');
  if (title.length < 2) return { ok: false, message: 'Podaj tytuł albumu.' };
  const slug = str(fd, 'slug') || slugify(title);

  const albumRow = {
    title,
    slug,
    description: str(fd, 'description') || null,
    date: str(fd, 'date') || null,
    cover_url: str(fd, 'cover_url') || null,
    cover_alt: str(fd, 'cover_alt') || null,
    publish: str(fd, 'publish') || 'szkic',
    position: numOrNull(fd, 'position') ?? 0,
  };

  let albumId = id;
  try {
    if (id) {
      const { error } = await supabase.from('albums').update(albumRow).eq('id', id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('albums').insert(albumRow).select('id').single();
      if (error) throw error;
      albumId = data.id;
    }

    const urls = fd.getAll('image_url').map(String).map((s) => s.trim()).filter(Boolean);
    const alts = fd.getAll('image_alt').map(String);
    await supabase.from('album_images').delete().eq('album_id', albumId);
    if (urls.length) {
      const rows = urls.map((url, i) => ({ album_id: albumId, url, alt: alts[i]?.trim() || title, position: i }));
      const { error } = await supabase.from('album_images').insert(rows);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveAlbum]', e);
    return { ok: false, message: 'Nie udało się zapisać albumu. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  revalidatePath(`/galeria/${slug}`);
  revalidatePath('/');
  redirect('/admin/galeria?zapisano=1');
}

export async function deleteAlbum(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('albums').delete().eq('id', id);
  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  revalidatePath('/');
}

export async function quickSetAlbum(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('albums').update(patch).eq('id', id);
  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  revalidatePath('/');
}
