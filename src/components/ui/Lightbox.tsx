'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type LightboxImage = { url: string; alt: string; caption?: string };

export default function Lightbox({
  images,
  index,
  onClose,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index ?? 0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (index !== null) setCurrent(index);
  }, [index]);

  const go = useCallback(
    (dir: number) => setCurrent((c) => (c + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, go, onClose]);

  if (index === null) return null;
  const img = images[current];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Podgląd zdjęcia"
      className="fixed inset-0 z-[80] flex flex-col bg-navy-deep/97"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-ivory/70">
        <span className="text-[0.75rem] tracking-wide2 tabular-nums">
          {current + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij podgląd"
          className="inline-flex h-11 w-11 items-center justify-center text-ivory/80 hover:text-ivory"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-3 pb-3">
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Poprzednie"
            className="absolute left-3 z-10 inline-flex h-12 w-12 items-center justify-center text-ivory/70 hover:text-ivory"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="relative h-full w-full max-w-5xl">
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Następne"
            className="absolute right-3 z-10 inline-flex h-12 w-12 items-center justify-center text-ivory/70 hover:text-ivory"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {img.caption && (
        <p className={cn('px-6 pb-6 text-center text-[0.85rem] text-ivory/60')}>{img.caption}</p>
      )}
    </div>
  );
}
