import Link from 'next/link';
import Image from 'next/image';
import { NAV, SITE } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-navy text-ivory/80">
      <div className="shell-wide grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/brand/logo-mark-cream.png"
              alt=""
              width={52}
              height={52}
              className="h-12 w-12 rounded-full"
            />
            <div className="leading-none text-ivory">
              <div className="font-display text-xl">Tradycja Siedlnica</div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-eyebrow text-brass-soft">
                Sylwester Kosiński · od {SITE.foundedYear}
              </div>
            </div>
          </div>
          <p className="prose-lux mt-6 max-w-sm text-ivory/70">
            Hodowla, trening i sprzedaż koni sportowych. Ponad 35 lat doświadczenia i szacunku do
            każdego konia.
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-[0.68rem] uppercase tracking-eyebrow text-brass-soft">Nawigacja</h2>
          <ul className="mt-5 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline text-ivory/80 hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-[0.68rem] uppercase tracking-eyebrow text-brass-soft">Kontakt</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <a href={`tel:${SITE.phoneHref}`} className="link-underline font-display text-2xl text-ivory">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="link-underline break-all text-ivory/80 hover:text-ivory">
                {SITE.email}
              </a>
            </li>
            <li className="text-ivory/70">{SITE.address.label}</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-[0.68rem] uppercase tracking-eyebrow text-brass-soft">Social</h2>
          <ul className="mt-5 space-y-2.5 text-ivory/80">
            <li><span className="opacity-60">Facebook — wkrótce</span></li>
            <li><span className="opacity-60">Instagram — wkrótce</span></li>
          </ul>
          <p className="mt-4 text-[0.7rem] leading-relaxed text-ivory/45">
            Linki do mediów społecznościowych ustawisz w panelu (Ustawienia).
          </p>
        </div>
      </div>

      <div className="border-t border-ivory/12">
        <div className="shell-wide flex flex-col items-center justify-between gap-3 py-6 text-[0.72rem] text-ivory/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName}. Wszelkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-5">
            <Link href="/polityka-prywatnosci" className="hover:text-ivory/80">Polityka prywatności</Link>
            <Link href="/kontakt" className="hover:text-ivory/80">Kontakt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
