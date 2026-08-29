import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

// guia-de-marca.md §4 — Poppins en Regular/Medium/SemiBold
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: 'Finanzza — Asesor financiero para tu PyME',
  description: 'Tu dinero. Tus decisiones. Entiende tu negocio, tu régimen fiscal y tu mejor opción de financiamiento.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  )
}
