import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-navy text-ivory">
      <Image src="/images/full/konie-nad-woda.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <div className="relative z-10 px-6 text-center">
        <span className="eyebrow eyebrow--center justify-center text-brass-soft">Błąd 404</span>
        <h1 className="mt-6 font-display text-display-xl font-light text-shadow-hero">Zabłądziłeś w polu</h1>
        <p className="prose-lux mx-auto mt-5 text-ivory/80">
          Nie znaleźliśmy strony, której szukasz. Wróćmy na właściwą drogę.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-brass">Strona główna</Link>
          <Link href="/konie" className="btn-ghost-light">Zobacz konie</Link>
        </div>
      </div>
    </section>
  );
}
