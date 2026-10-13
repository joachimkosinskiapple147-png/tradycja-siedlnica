import Image from 'next/image';
import { SITE } from '@/lib/constants';

export default function Logo({ variant = 'light' }: { variant?: 'dark' | 'light' }) {
  const src = variant === 'light' ? '/images/brand/logo-badge-navy.png' : '/images/brand/logo-mark-cream.png';
  const textColor = variant === 'light' ? 'text-navy' : 'text-ivory';
  return (
    <span className="flex items-center gap-2.5">
      <Image src={src} alt="" width={44} height={44} className="h-10 w-10 rounded-full object-cover ring-1 ring-brass/30" priority />
      <span className={`flex flex-col leading-none ${textColor}`}>
        <span className="font-display text-[1.2rem] font-semibold tracking-tight">Tradycja Siedlnica</span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-eyebrow opacity-70">od {SITE.foundedYear}</span>
      </span>
    </span>
  );
}
