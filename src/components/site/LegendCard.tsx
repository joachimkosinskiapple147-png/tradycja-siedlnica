import Link from 'next/link';
import Image from 'next/image';
import type { Legend } from '@/lib/types';

export default function LegendCard({ legend }: { legend: Legend }) {
  return (
    <Link href={`/legendy/${legend.slug}`} className="group block animate-pop">
      <article className="card-app card-lift flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={legend.image.url} alt={legend.image.alt || legend.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.05]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/65 to-transparent" aria-hidden="true" />
          <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-wide2 text-brass-soft backdrop-blur">
            ★ Legenda
          </span>
          {legend.where_now && (
            <span className="absolute bottom-3 left-3 right-3 truncate rounded-xl bg-ivory/90 px-3 py-1.5 text-[0.72rem] font-bold text-navy backdrop-blur">
              Dziś: {legend.where_now}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-display text-[1.7rem] font-semibold leading-none text-navy group-hover:text-forest">{legend.name}</h3>
          <p className="mt-1.5 text-[0.78rem] font-semibold text-charcoal/60">
            {[legend.breed, legend.birth_year ? `ur. ${legend.birth_year}` : null].filter(Boolean).join(' · ')}
          </p>
          {legend.achievements && <p className="mt-2 line-clamp-2 text-[0.84rem] font-semibold text-brass-deep">🏆 {legend.achievements}</p>}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-[0.72rem] font-bold uppercase tracking-wide2 text-navy/60">{legend.years_at_stable ?? 'U nas hodowany'}</span>
            <span className="link-underline text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Historia →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
