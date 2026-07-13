'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { HorseImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import Lightbox from '@/components/ui/Lightbox';

export default function HorseGallery({ images, name }: { images: HorseImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [box, setBox] = useState<number | null>(null);

  if (!images.length) return null;
  const main = images[active];

  return (
    <div>
      <button
        type="button"
        onClick={() => setBox(active)}
        className="group relative block aspect-[3/2] w-full overflow-hidden bg-beige-soft"
        aria-label="Powiększ zdjęcie"
      >
        <Image
          src={main.url}
          alt={main.alt || name}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center bg-ivory/90 text-navy opacity-0 transition-opacity group-hover:opacity-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden bg-beige-soft transition-opacity',
                i === active ? 'ring-2 ring-brass ring-offset-2 ring-offset-ivory' : 'opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={img.thumb || img.url}
                alt={img.alt || `${name} ${i + 1}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        images={images.map((i) => ({ url: i.url, alt: i.alt || name, caption: i.caption }))}
        index={box}
        onClose={() => setBox(null)}
      />
    </div>
  );
}
