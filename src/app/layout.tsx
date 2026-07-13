import type { Metadata, Viewport } from 'next';
// Czcionki hostowane lokalnie (bez zależności od Google w czasie działania).
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-ext-300.css';
import '@fontsource/cormorant-garamond/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-ext-500.css';
import '@fontsource/cormorant-garamond/latin-ext-600.css';
import '@fontsource-variable/mulish/wght.css';
import './globals.css';
import { SITE } from '@/lib/constants';
import { buildMetadata, JsonLd, localBusinessJsonLd } from '@/lib/seo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileCTA from '@/components/layout/MobileCTA';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({}),
  icons: {
    icon: [{ url: '/images/brand/favicon-64.png', type: 'image/png' }],
    apple: '/images/brand/logo-badge-navy.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#101A24',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-ivory"
        >
          Przejdź do treści
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCTA />
        <JsonLd data={localBusinessJsonLd()} />
      </body>
    </html>
  );
}
