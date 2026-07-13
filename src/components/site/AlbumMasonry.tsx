'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';
import Lightbox from '@/components/ui/Lightbox';

export default function AlbumMasonry({ images }: { images: GalleryImage[] }) {
  const [box, setBox] = useState<number | null>(null);
  const sorted = [...images].sort((a, b) => a.position - b.position);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {sorted.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setBox(i)}
            aria-label={`Powiększ: ${img.alt}`}
            className="group relative block w-full overflow-hidden break-inside-avoid bg-beige-soft"
          >
            <Image
              src={img.thumb || img.url}
              alt={img.alt}
              width={760}
              height={1000}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="h-auto w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/10" />
          </button>
        ))}
      </div>
      <Lightbox
        images={sorted.map((i) => ({ url: i.url, alt: i.alt }))}
        index={box}
        onClose={() => setBox(null)}
      />
    </>
  );
}
