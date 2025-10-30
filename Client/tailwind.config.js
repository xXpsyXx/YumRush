/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        'dark-2': '#1e293b',
        'dark-6': '#94a3b8',
      },
    },
  },
  plugins: [],
}