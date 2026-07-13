'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { uploadFileWithProgress, deleteFromMediaByUrl } from '@/lib/supabase/upload';

const inputCls =
  'w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brass';

export default function SingleImageField({
  label,
  url,
  alt,
  onUrlChange,
  onAltChange,
  folder,
}: {
  label: string;
  url: string;
  alt: string;
  onUrlChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  function handleFile(file: File) {
    setError('');
    setProgress(0);
    const oldUrl = url;
    uploadFileWithProgress(file, folder, setProgress)
      .then((next) => {
        onUrlChange(next);
        if (oldUrl) void deleteFromMediaByUrl(oldUrl);
      })
      .catch(() => setError('Nie udało się wgrać zdjęcia.'))
      .finally(() => setProgress(null));
  }

  return (
    <div className="space-y-2">
      <span className="block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">{label}</span>
      <div className="flex items-start gap-3">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden border border-navy/10 bg-beige-soft">
          {url && <Image src={url} alt="" fill sizes="128px" className="object-cover" />}
        </div>
        <div className="flex-1 space-y-2">
          {onAltChange && (
            <input
              value={alt}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Opis alternatywny (alt)"
              className={inputCls}
            />
          )}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost px-4 py-2 text-xs">
              {url ? 'Zamień zdjęcie' : 'Wgraj zdjęcie'}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => {
                  void deleteFromMediaByUrl(url);
                  onUrlChange('');
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Usuń
              </button>
            )}
          </div>
          {progress !== null && (
            <div className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-navy/10">
              <div className="h-full bg-brass transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
