/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // guia-de-marca.md §3 — verde de marca y mint ya coinciden exactamente
      // con green-500/green-400 de Tailwind, no hace falta redefinirlos.
      colors: {
        navy: '#0D1B2A',
        'deep-blue': '#1B263B',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
