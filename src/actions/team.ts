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

// ── JEŹDŹCY ─────────────────────────────────────────────────────────────────
export async function saveRider(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const name = str(fd, 'name');
  if (name.length < 2) return { ok: false, message: 'Podaj imię i nazwisko jeźdźca.' };
  const role = str(fd, 'role');
  if (role.length < 2) return { ok: false, message: 'Podaj rolę (np. Trener główny · skoki).' };
  const slug = str(fd, 'slug') || slugify(name);
  const horseSlugs = fd.getAll('horse_slug').map(String).map((s) => s.trim()).filter(Boolean);

  const row = {
    name,
    slug,
    role,
    specialty: str(fd, 'specialty') || null,
    experience: str(fd, 'experience') || null,
    achievements: str(fd, 'achievements') || null,
    description: str(fd, 'description') || null,
    phone: str(fd, 'phone') || null,
    image_url: str(fd, 'image_url') || null,
    image_alt: str(fd, 'image_alt') || null,
    horse_slugs: horseSlugs,
    featured: fd.get('featured') === 'on',
    position: numOrNull(fd, 'position') ?? 0,
    publish: str(fd, 'publish') || 'szkic',
  };

  try {
    if (id) {
      const { error } = await supabase.from('riders').update(row).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('riders').insert(row);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveRider]', e);
    return { ok: false, message: 'Nie udało się zapisać jeźdźca. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/jezdcy');
  revalidatePath('/jezdcy');
  revalidatePath(`/jezdcy/${slug}`);
  revalidatePath('/');
  redirect('/admin/jezdcy?zapisano=1');
}

export async function deleteRider(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('riders').delete().eq('id', id);
  revalidatePath('/admin/jezdcy');
  revalidatePath('/jezdcy');
  revalidatePath('/');
}

export async function quickSetRider(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('riders').update(patch).eq('id', id);
  revalidatePath('/admin/jezdcy');
  revalidatePath('/jezdcy');
  revalidatePath('/');
}

// ── STANÓWKA (ogiery kryjące) ────────────────────────────────────────────────
export async function saveStallion(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const name = str(fd, 'name');
  if (name.length < 2) return { ok: false, message: 'Podaj imię ogiera.' };
  const slug = str(fd, 'slug') || slugify(name);

  const row = {
    name,
    slug,
    full_name: str(fd, 'full_name') || null,
    breed: str(fd, 'breed') || null,
    birth_year: numOrNull(fd, 'birth_year'),
    color: str(fd, 'color') || null,
    height_cm: numOrNull(fd, 'height_cm'),
    sire: str(fd, 'sire') || null,
    dam: str(fd, 'dam') || null,
    pedigree_notes: str(fd, 'pedigree_notes') || null,
    description: str(fd, 'description') || null,
    achievements: str(fd, 'achievements') || null,
    covering_price: str(fd, 'covering_price') || null,
    semen: str(fd, 'semen') || null,
    season: str(fd, 'season') || null,
    station: str(fd, 'station') || null,
    image_url: str(fd, 'image_url') || null,
    image_alt: str(fd, 'image_alt') || null,
    featured: fd.get('featured') === 'on',
    position: numOrNull(fd, 'position') ?? 0,
    publish: str(fd, 'publish') || 'szkic',
  };

  try {
    if (id) {
      const { error } = await supabase.from('stallions').update(row).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('stallions').insert(row);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveStallion]', e);
    return { ok: false, message: 'Nie udało się zapisać ogiera. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/stanowka');
  revalidatePath('/stanowka');
  revalidatePath(`/stanowka/${slug}`);
  revalidatePath('/');
  redirect('/admin/stanowka?zapisano=1');
}

export async function deleteStallion(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('stallions').delete().eq('id', id);
  revalidatePath('/admin/stanowka');
  revalidatePath('/stanowka');
  revalidatePath('/');
}

export async function quickSetStallion(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('stallions').update(patch).eq('id', id);
  revalidatePath('/admin/stanowka');
  revalidatePath('/stanowka');
  revalidatePath('/');
}

// ── LEGENDY ──────────────────────────────────────────────────────────────────
export async function saveLegend(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const name = str(fd, 'name');
  if (name.length < 2) return { ok: false, message: 'Podaj imię legendy.' };
  const slug = str(fd, 'slug') || slugify(name);

  const row = {
    name,
    slug,
    breed: str(fd, 'breed') || null,
    birth_year: numOrNull(fd, 'birth_year'),
    color: str(fd, 'color') || null,
    years_at_stable: str(fd, 'years_at_stable') || null,
    where_now: str(fd, 'where_now') || null,
    achievements: str(fd, 'achievements') || null,
    story: str(fd, 'story') || null,
    image_url: str(fd, 'image_url') || null,
    image_alt: str(fd, 'image_alt') || null,
    featured: fd.get('featured') === 'on',
    position: numOrNull(fd, 'position') ?? 0,
    publish: str(fd, 'publish') || 'opublikowany',
  };

  try {
    if (id) {
      const { error } = await supabase.from('legends').update(row).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('legends').insert(row);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveLegend]', e);
    return { ok: false, message: 'Nie udało się zapisać legendy. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/legendy');
  revalidatePath('/legendy');
  revalidatePath(`/legendy/${slug}`);
  revalidatePath('/');
  redirect('/admin/legendy?zapisano=1');
}

export async function deleteLegend(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('legends').delete().eq('id', id);
  revalidatePath('/admin/legendy');
  revalidatePath('/legendy');
  revalidatePath('/');
}

export async function quickSetLegend(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('legends').update(patch).eq('id', id);
  revalidatePath('/admin/legendy');
  revalidatePath('/legendy');
  revalidatePath('/');
}
