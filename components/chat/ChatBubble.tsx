'use client'

import { useState } from 'react'
import { Analisis, Perfil } from '@/lib/types'
import ChatAsesor from './ChatAsesor'

// Chat emergente por burbuja en la vista de resultados: no ocupa espacio en la
// página hasta que el usuario lo abre. Mismo ChatAsesor de siempre, solo
// cambia el empaque (popup flotante en vez de panel inline).
export default function ChatBubble({ perfil, analisis }: { perfil: Perfil; analisis: Analisis }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      {abierto && (
        <div className="fixed bottom-24 right-4 z-40 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center justify-between bg-navy px-4 py-3">
            <span className="text-sm font-semibold text-white">Tu asesor</span>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar chat" className="text-white/70 hover:text-white">
              ✕
            </button>
          </div>
          <ChatAsesor perfil={perfil} analisis={analisis} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-label={abierto ? 'Cerrar chat con tu asesor' : 'Hablar con tu asesor'}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 sm:right-6"
      >
        {abierto ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v10a1.5 1.5 0 0 1-1.5 1.5H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 15.5v-10z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </>
  )
}
