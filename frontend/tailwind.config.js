/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0B1120',
        surface: '#1E293B',         // Solid — was glassy rgba
        'surface-solid': '#1E293B',
        subtle: '#334155',            // Solid — was glassy rgba
        line: '#334155',              // Solid border
        'line-strong': '#475569',     // Solid stronger border
        ink: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          faint: '#64748B',
          invert: '#0B1120',
        },
        brand: {
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#082F49',
        },
        signal: {
          50: 'rgba(239, 68, 68, 0.15)',
          200: '#FECACA',
          400: '#F87171',
          600: '#EF4444',
          700: '#B91C1C',
        },
        caution: {
          50: 'rgba(245, 158, 11, 0.15)',
          200: '#FDE68A',
          400: '#FBBF24',
          600: '#F59E0B',
        },
        ok: {
          50: 'rgba(16, 185, 129, 0.15)',
          200: '#A7F3D0',
          400: '#34D399',
          600: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        raised: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        glow: '0 0 15px rgba(14, 165, 233, 0.4)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '14px',
        lg: '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
