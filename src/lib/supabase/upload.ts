'use client';

import { createClient } from '@/lib/supabase/client';

const BUCKET = 'media';

function extensionOf(file: File): string {
  const fromName = file.name.split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const fromType = file.type.split('/').pop();
  return (fromType || 'bin').toLowerCase();
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Wgrywa plik bezpośrednio do bucketu Storage `media` przez podpisany URL,
 * z realnym postępem (XHR upload progress — fetch tego nie udostępnia).
 */
export function uploadFileWithProgress(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const supabase = createClient();
  const path = `${folder}/${randomId()}.${extensionOf(file)}`;

  return new Promise((resolve, reject) => {
    supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path)
      .then(({ data, error }) => {
        if (error || !data) {
          reject(error ?? new Error('Nie udało się rozpocząć wgrywania.'));
          return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.signedUrl);
        xhr.setRequestHeader('content-type', file.type || 'application/octet-stream');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
            resolve(pub.publicUrl);
          } else {
            reject(new Error('Wgrywanie nie powiodło się.'));
          }
        };
        xhr.onerror = () => reject(new Error('Wgrywanie nie powiodło się (błąd sieci).'));
        xhr.send(file);
      })
      .catch(reject);
  });
}

/** Najlepszej próby usunięcie pliku z bucketu na podstawie publicznego URL. */
export async function deleteFromMediaByUrl(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  try {
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // najlepsza próba — brak pliku w buckecie (np. ścieżka z /public/images) nie jest błędem
  }
}
