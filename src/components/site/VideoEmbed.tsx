'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { HorseVideo } from '@/lib/types';
import { VIDEO_CATEGORY_LABEL } from '@/lib/constants';

export default function VideoEmbed({ video }: { video: HorseVideo }) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`;

  return (
    <figure className="group">
      <div className="relative aspect-video overflow-hidden bg-navy">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title || 'Film'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Odtwórz film: ${video.title || 'film'}`}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-navy/30 transition-colors group-hover:bg-navy/20" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/95 text-navy shadow-lift transition-transform group-hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {video.category && (
              <span className="absolute left-3 top-3 status-pill border-ivory/40 bg-navy/60 text-ivory">
                {VIDEO_CATEGORY_LABEL[video.category] ?? video.category}
              </span>
            )}
          </button>
        )}
      </div>
      {(video.title || video.description) && (
        <figcaption className="mt-3">
          {video.title && <p className="font-display text-lg text-navy">{video.title}</p>}
          {video.description && <p className="mt-1 text-sm text-charcoal/70">{video.description}</p>}
        </figcaption>
      )}
    </figure>
  );
}
