'use client'

import { useState } from 'react'
import { FuenteConectada, FuentesConectadas } from '@/lib/types'
import AgregarFuentePanel from './AgregarFuentePanel'

const CATEGORIAS_MINIMAS = ['fiscal', 'registro']

// `puentes` — investigacion/propuesta-guion-onboarding.md, "Cómo se enlaza con
// las fuentes": cada "no sé" del onboarding se convierte aquí en el motivo
// concreto para conectar una fuente, no en un catálogo presentado en frío.
export default function ConectarFuentes({ puentes, onContinuar }: { puentes: string[]; onContinuar: (fuentes: FuentesConectadas) => void }) {
  const [conectadas, setConectadas] = useState<FuentesConectadas>([])
  const [agregando, setAgregando] = useState(false)

  function quitar(i: number) {
    setConectadas((c) => c.filter((_, idx) => idx !== i))
  }

  const faltantes = CATEGORIAS_MINIMAS.filter((cat) => !conectadas.some((f) => f.categoriaId === cat))
  const listo = faltantes.length === 0

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Conecta tus fuentes de datos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Agrega una fuente a la vez. Nada se sincroniza hasta que tú lo conectas aquí — en esta demo la conexión está simulada, no se envía ninguna credencial a un servidor.
        </p>
      </div>

      {puentes.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">Por lo que nos dijiste, esto te conviene conectar:</p>
          <ul className="mt-2 space-y-1 text-sm text-green-800">
            {puentes.map((p, i) => (
              <li key={i}>· {p}</li>
            ))}
          </ul>
        </div>
      )}

      {conectadas.length > 0 && (
        <div className="space-y-2">
          {conectadas.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-neutral-900">{f.proveedorNombre}</p>
                <p className="text-xs text-neutral-500">{f.categoriaNombre}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">✓ Conectado</span>
                <button type="button" onClick={() => quitar(i)} className="text-xs text-neutral-400 underline">
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {agregando ? (
        <AgregarFuentePanel
          yaConectadas={conectadas}
          onCancelar={() => setAgregando(false)}
          onConectar={(f) => {
            setConectadas((c) => [...c, f])
            setAgregando(false)
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAgregando(true)}
          className="w-full rounded-md border border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-600 hover:border-green-600 hover:text-green-700"
        >
          + Agregar fuente de datos
        </button>
      )}

      <button
        type="button"
        disabled={!listo}
        onClick={() => onContinuar(conectadas)}
        className="w-full rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
      {!listo && <p className="text-center text-xs text-neutral-400">Conecta al menos una fuente fiscal y una de registro de ventas/gastos para continuar. Las demás son opcionales.</p>}
    </div>
  )
}
