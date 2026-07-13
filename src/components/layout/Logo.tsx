import Image from 'next/image';
import { SITE } from '@/lib/constants';

export default function Logo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  // variant "light" = na jasnym tle (granatowy medalion), "dark" = na zdjęciu/ciemnym tle (kremowy)
  const src = variant === 'light' ? '/images/brand/logo-badge-navy.png' : '/images/brand/logo-mark-cream.png';
  const textColor = variant === 'light' ? 'text-navy' : 'text-ivory';
  return (
    <span className="flex items-center gap-3">
      <Image
        src={src}
        alt=""
        width={48}
        height={48}
        className="h-11 w-11 rounded-full object-cover"
        priority
      />
      <span className={`flex flex-col leading-none ${textColor}`}>
        <span className="font-display text-[1.28rem] tracking-wide">Tradycja Siedlnica</span>
        <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-eyebrow opacity-70">
          od {SITE.foundedYear}
        </span>
      </span>
    </span>
  );
}
