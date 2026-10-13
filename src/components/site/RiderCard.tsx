import Link from 'next/link';
import Image from 'next/image';
import type { Rider } from '@/lib/types';

export default function RiderCard({ rider }: { rider: Rider }) {
  return (
    <Link href={`/jezdcy/${rider.slug}`} className="group block animate-pop">
      <article className="card-app card-lift flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={rider.image.url} alt={rider.image.alt || rider.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.05]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/60 to-transparent" aria-hidden="true" />
          <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-wide2 text-navy backdrop-blur">
            {rider.role}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Image src={rider.image.url} alt="" width={44} height={44} className="avatar-ring h-11 w-11 object-cover" />
            <div className="min-w-0">
              <h3 className="truncate font-display text-[1.45rem] font-semibold leading-tight text-navy group-hover:text-forest">{rider.name}</h3>
              {rider.specialty && <p className="truncate text-[0.76rem] font-semibold text-brass-deep">{rider.specialty}</p>}
            </div>
          </div>
          {rider.description && <p className="mt-3 line-clamp-2 text-[0.86rem] font-medium leading-snug text-charcoal/75">{rider.description}</p>}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-[0.72rem] font-bold uppercase tracking-wide2 text-navy/60">{rider.experience ?? 'Zespół stajni'}</span>
            <span className="link-underline text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Profil →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
