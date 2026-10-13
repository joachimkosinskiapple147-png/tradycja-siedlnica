import Link from 'next/link';
import Image from 'next/image';
import type { Stallion } from '@/lib/types';

export default function StallionCard({ stallion }: { stallion: Stallion }) {
  return (
    <Link href={`/stanowka/${stallion.slug}`} className="group block animate-pop">
      <article className="card-app card-lift flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={stallion.image.url} alt={stallion.image.alt || stallion.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.05]" />
          <span className="absolute left-3 top-3 rounded-full bg-brass px-3 py-1 text-[0.64rem] font-bold uppercase tracking-wide2 text-navy">
            Stanówka
          </span>
          {stallion.birth_year && (
            <span className="absolute bottom-3 right-3 rounded-full bg-navy/80 px-3 py-1 text-[0.68rem] font-bold text-ivory backdrop-blur">
              ur. {stallion.birth_year}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-[1.6rem] font-semibold leading-none text-navy group-hover:text-forest">{stallion.name}</h3>
            {stallion.height_cm && <span className="shrink-0 text-[0.76rem] font-semibold tabular-nums text-charcoal/55">{stallion.height_cm} cm</span>}
          </div>
          <p className="mt-1.5 text-[0.78rem] font-semibold text-charcoal/60">{[stallion.breed, stallion.color].filter(Boolean).join(' · ')}</p>
          {stallion.covering_price && <p className="mt-2 rounded-xl bg-brass/12 px-3 py-2 text-[0.8rem] font-bold text-brass-deep">{stallion.covering_price}</p>}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-[0.72rem] font-bold uppercase tracking-wide2 text-navy/60">{stallion.semen ?? 'Krycie na miejscu'}</span>
            <span className="link-underline text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Ogier →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
