import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asesor financiero PyME — MVP',
  description: 'Entiende tu negocio, tu régimen fiscal y tu mejor opción de financiamiento.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  )
}
