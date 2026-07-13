'use client';

import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import Image from 'next/image';
import { uploadFileWithProgress, deleteFromMediaByUrl } from '@/lib/supabase/upload';

export type ImageRow = { url: string; alt: string; caption?: string };

type Pending = { key: string; name: string; progress: number; error?: string };

const inputCls =
  'w-full border border-navy/20 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brass';

/**
 * Menedżer wielu zdjęć z bezpośrednim wgrywaniem do Supabase Storage.
 * Pierwsza pozycja na liście jest zdjęciem głównym (okładką).
 */
export default function ImageUploader({
  images,
  onChange,
  folder,
  captions = false,
  coverHint = true,
  addLabel = '+ Dodaj zdjęcia',
}: {
  images: ImageRow[];
  onChange: Dispatch<SetStateAction<ImageRow[]>>;
  folder: string;
  captions?: boolean;
  coverHint?: boolean;
  addLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    Array.from(files).forEach((file) => {
      const key = `${file.name}-${Date.now()}-${Math.random()}`;
      setPending((p) => [...p, { key, name: file.name, progress: 0 }]);
      uploadFileWithProgress(file, folder, (pct) =>
        setPending((p) => p.map((x) => (x.key === key ? { ...x, progress: pct } : x)))
      )
        .then((url) => {
          onChange((prev) => [...prev, { url, alt: '', caption: '' }]);
        })
        .catch(() => {
          setPending((p) => p.map((x) => (x.key === key ? { ...x, error: 'Błąd wgrywania' } : x)));
          return;
        })
        .finally(() => {
          setPending((p) => p.filter((x) => x.key !== key));
        });
    });
  }

  function update(i: number, patch: Partial<ImageRow>) {
    onChange((prev) => prev.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  }

  function move(i: number, dir: number) {
    onChange((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function makeCover(i: number) {
    onChange((prev) => {
      const next = [...prev];
      const [row] = next.splice(i, 1);
      next.unshift(row);
      return next;
    });
  }

  function remove(i: number) {
    const row = images[i];
    onChange((prev) => prev.filter((_, k) => k !== i));
    void deleteFromMediaByUrl(row.url);
  }

  function replace(i: number, file: File) {
    const key = `replace-${i}-${Date.now()}`;
    setPending((p) => [...p, { key, name: file.name, progress: 0 }]);
    const oldUrl = images[i]?.url;
    uploadFileWithProgress(file, folder, (pct) =>
      setPending((p) => p.map((x) => (x.key === key ? { ...x, progress: pct } : x)))
    )
      .then((url) => {
        update(i, { url });
        if (oldUrl) void deleteFromMediaByUrl(oldUrl);
      })
      .catch(() => setPending((p) => p.map((x) => (x.key === key ? { ...x, error: 'Błąd wgrywania' } : x))))
      .finally(() => setPending((p) => p.filter((x) => x.key !== key)));
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {images.map((img, i) => (
          <div key={img.url + i} className="border border-navy/12 bg-cream p-3">
            <div className="flex items-start gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-navy/10 bg-beige-soft">
                {img.url && <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />}
              </div>
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <input
                  value={img.alt}
                  onChange={(e) => update(i, { alt: e.target.value })}
                  placeholder="Opis alternatywny (alt) *"
                  className={inputCls}
                />
                {captions ? (
                  <input
                    value={img.caption ?? ''}
                    onChange={(e) => update(i, { caption: e.target.value })}
                    placeholder="Podpis (opcjonalnie)"
                    className={inputCls}
                  />
                ) : (
                  <label className="flex items-center text-[0.72rem] text-charcoal/50">
                    <span className="truncate">{img.url.split('/').pop()}</span>
                  </label>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="W górę" className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↑</button>
                <button type="button" onClick={() => move(i, 1)} aria-label="W dół" className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↓</button>
                <button type="button" onClick={() => remove(i)} aria-label="Usuń" className="rounded-sm border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50">×</button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {coverHint && (
                i === 0 ? (
                  <span className="inline-block text-[0.68rem] uppercase tracking-wide2 text-brass-deep">Zdjęcie główne</span>
                ) : (
                  <button type="button" onClick={() => makeCover(i)} className="text-[0.68rem] uppercase tracking-wide2 text-navy/60 hover:text-navy">
                    Ustaw jako główne
                  </button>
                )
              )}
              <label className="cursor-pointer text-[0.68rem] uppercase tracking-wide2 text-navy/60 hover:text-navy">
                Zamień plik
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) replace(i, file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          </div>
        ))}

        {pending.map((p) => (
          <div key={p.key} className="border border-brass/40 bg-brass/5 p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-charcoal/70">{p.name}</span>
              <span className="shrink-0 text-[0.72rem] text-charcoal/55">
                {p.error ? p.error : `${p.progress}%`}
              </span>
            </div>
            {!p.error && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
                <div className="h-full bg-brass transition-all" style={{ width: `${p.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost">
        {addLabel}
      </button>
    </div>
  );
}
