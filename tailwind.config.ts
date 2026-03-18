import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#437983',
          dark: '#2D545C',
        },
        secondary: {
          DEFAULT: '#437983',
          light: '#6BA4AF',
        },
        background: {
          DEFAULT: '#00353F',
          card: '#FFFFFF',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#437983',
        },
      },
      fontFamily: {
        arabic: ['var(--font-amiri)', 'serif'],
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;







