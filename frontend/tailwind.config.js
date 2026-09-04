/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx,html}',
],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f6f8',
        surface: '#ffffff',
        subtle: '#f8fafb',
        line: '#e2e7ec',
        'line-strong': '#cbd3db',
        ink: {
          DEFAULT: '#101b26',
          muted: '#5b6b7a',
          faint: '#8a99a7',
          invert: '#ffffff',
        },
        brand: {
          50: '#eef6fb',
          100: '#d7e9f4',
          200: '#aed3e9',
          400: '#3d87b3',
          600: '#0d5b88',
          700: '#0b4a6f',
          900: '#072a3f',
        },
        signal: {
          50: '#fdeceb',
          200: '#f6c4c0',
          600: '#b42318',
          700: '#8f1a12',
        },
        caution: {
          50: '#fdf3e7',
          200: '#f5d6ab',
          600: '#b54708',
        },
        ok: {
          50: '#e8f5ee',
          200: '#b3ddc6',
          600: '#067647',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(16, 27, 38, 0.06)',
        raised: '0 12px 32px -12px rgba(16, 27, 38, 0.28)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}
