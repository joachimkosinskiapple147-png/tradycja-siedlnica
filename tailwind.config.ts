import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#101A24',
          soft: '#16232F',
          deep: '#0B131B',
        },
        forest: {
          DEFAULT: '#24382F',
          soft: '#2E4539',
        },
        ivory: '#F6F1E8',
        cream: '#FBF8F2',
        beige: {
          DEFAULT: '#D8CCBA',
          soft: '#E7DFD1',
        },
        charcoal: '#292C2D',
        brass: {
          DEFAULT: '#A68A5B',
          soft: '#BBA278',
          deep: '#8A7145',
        },
      },
      fontFamily: {
        // Zmienne CSS ustawiane przez next/font w layout.tsx
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Skala nagłówków — magazynowa, z dużymi krokami
        'display-xl': ['clamp(2.75rem, 7vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.9rem, 3.6vw, 2.85rem)', { lineHeight: '1.1' }],
        'display-sm': ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.15' }],
      },
      letterSpacing: {
        eyebrow: '0.28em',
        wide2: '0.16em',
      },
      maxWidth: {
        prose2: '68ch',
        shell: '1240px',
        wide: '1440px',
      },
      spacing: {
        section: 'clamp(4.5rem, 9vw, 8.5rem)',
      },
      boxShadow: {
        plate: '0 1px 0 0 rgba(16,26,36,0.06), 0 24px 60px -32px rgba(16,26,36,0.30)',
        lift: '0 30px 70px -40px rgba(16,26,36,0.45)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1.12)' },
        },
      },
      animation: {
        'reveal-up': 'reveal-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 1.2s ease both',
        'ken-burns': 'ken-burns 18s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
