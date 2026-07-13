import Link from 'next/link';
import Image from 'next/image';
import type { Horse } from '@/lib/types';
import { SEX_LABEL } from '@/lib/constants';
import { StatusPill } from '@/components/ui/Primitives';

export default function HorseCard({ horse, priority = false }: { horse: Horse; priority?: boolean }) {
  const cover = horse.images.find((i) => i.is_cover) ?? horse.images[0];
  const meta = [
    horse.birth_year ? `ur. ${horse.birth_year}` : null,
    SEX_LABEL[horse.sex],
    horse.breed,
  ].filter(Boolean);

  return (
    <Link href={`/konie/${horse.slug}`} className="group block">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-beige-soft">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt || horse.name}
              fill
              priority={priority}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-navy/30">bez zdjęcia</div>
          )}
          <div className="absolute left-4 top-4">
            <StatusPill status={horse.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[1.7rem] font-normal leading-none text-navy transition-colors group-hover:text-forest">
              {horse.name}
            </h3>
            {horse.height_cm && (
              <span className="shrink-0 text-[0.78rem] tabular-nums text-charcoal/55">{horse.height_cm} cm</span>
            )}
          </div>
          <p className="mt-2 text-[0.82rem] text-charcoal/65">{meta.join(' · ')}</p>
          {horse.discipline && (
            <p className="mt-1 text-[0.82rem] text-brass-deep">{horse.discipline}</p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <span className="text-[0.82rem] font-medium text-navy/80">{horse.price ?? 'Cena na zapytanie'}</span>
            <span className="link-underline text-[0.75rem] font-semibold uppercase tracking-wide2 text-navy">
              Zobacz konia
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
