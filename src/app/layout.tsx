import type { Metadata, Viewport } from 'next';
// Czcionki hostowane lokalnie (bez zależności od Google w czasie działania).
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-ext-700.css';
import '@fontsource/cormorant-garamond/latin-ext-500.css';
import '@fontsource/cormorant-garamond/latin-ext-600.css';
import '@fontsource-variable/mulish/wght.css';
import './globals.css';
import { SITE } from '@/lib/constants';
import { JsonLd, localBusinessJsonLd } from '@/lib/seo';
import { getSiteSettings } from '@/lib/data/queries';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileCTA from '@/components/layout/MobileCTA';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo_title || SITE.name;
  const description = settings.seo_description || SITE.description;
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s | ${SITE.name}` },
    description,
    alternates: { canonical: SITE.url },
    openGraph: {
      title,
      description,
      url: SITE.url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: 'website',
      images: [{ url: '/images/full/hero.webp', width: 1200, height: 800, alt: SITE.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/full/hero.webp'] },
    icons: {
      icon: [{ url: '/images/brand/favicon-64.png', type: 'image/png' }],
      apple: '/images/brand/logo-badge-navy.png',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#101A24',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="pl">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-ivory"
        >
          Przejdź do treści
        </a>
        <Header phone={settings.phone} phoneHref={settings.phone_href} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
        <MobileCTA phoneHref={settings.phone_href} />
        <JsonLd data={localBusinessJsonLd({ phoneHref: settings.phone_href, email: settings.email })} />
      </body>
    </html>
  );
}
