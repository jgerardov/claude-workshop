'use client'

import { useState } from 'react'

// Simula el selector de cuenta que abre Google al autenticarse — mockeado por
// completo: no hay OAuth real ni salida de la pestaña. Solo existe para que el
// flujo de demo se sienta parecido al real.
export default function GoogleAccountPicker({ onElegir, onCerrar }: { onElegir: (nombre: string, email: string) => void; onCerrar: () => void }) {
  const [cargando, setCargando] = useState(false)

  function elegir() {
    setCargando(true)
    setTimeout(() => onElegir('Equipo Demo', 'equipo.demo@gmail.com'), 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <svg width="40" height="40" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
          </svg>
          <h2 className="mt-3 text-lg font-medium text-neutral-900">Elige una cuenta</h2>
          <p className="mt-1 text-sm text-neutral-500">para continuar a Asesor Financiero PyME</p>
        </div>

        <button
          type="button"
          onClick={elegir}
          disabled={cargando}
          className="mt-5 flex w-full items-center gap-3 rounded-md border border-neutral-200 p-3 text-left hover:bg-neutral-50 disabled:opacity-60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">D</span>
          <span>
            <span className="block text-sm font-medium text-neutral-900">Equipo Demo</span>
            <span className="block text-xs text-neutral-500">equipo.demo@gmail.com</span>
          </span>
          {cargando && <span className="ml-auto text-xs text-neutral-400">Conectando…</span>}
        </button>

        <button type="button" onClick={onCerrar} className="mt-3 w-full rounded-md p-2 text-center text-sm text-neutral-500 hover:bg-neutral-50">
          Cancelar
        </button>

        <p className="mt-4 text-center text-[11px] text-neutral-400">
          Simulación para esta demo — no se conecta con tu cuenta real de Google.
        </p>
      </div>
    </div>
  )
}
