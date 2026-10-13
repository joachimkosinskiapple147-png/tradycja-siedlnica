/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  } catch {
    return null;
  }
})();

const nextConfig = {
  images: {
    // Cloudflare Workers nie ma optymalizatora _next/image — bezpośrednie URL-e.
    unoptimized: true,
    // Nowoczesne formaty — Next generuje AVIF/WebP i responsywne rozmiary automatycznie.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Zdjęcia przesłane do Supabase Storage (publiczny bucket).
      ...(supabaseHost
        ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
        : []),
      // Miniatury YouTube.
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  // Ostrzeżenia dostępności i bezpieczeństwa nagłówków.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
