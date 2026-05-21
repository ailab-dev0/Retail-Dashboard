/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', light: '#3B82F6' },
        danger: { DEFAULT: '#EF4444', bg: '#FEF2F2' },
        warning: { DEFAULT: '#F97316', bg: '#FFF7ED' },
        success: { DEFAULT: '#10B981', bg: '#F0FDF4' },
        sidebar: '#0F172A',
      },
      fontFamily: {
        sans: ['Fira Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}