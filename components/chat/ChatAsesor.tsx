'use client'

import { useState } from 'react'
import { Analisis, Perfil } from '@/lib/types'

type Mensaje = { role: 'user' | 'assistant'; content: string }

export default function ChatAsesor({ perfil, analisis }: { perfil: Perfil; analisis: Analisis }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { role: 'assistant', content: 'Hola, ya revisé tu perfil y tu análisis. ¿Qué quieres que te explique — el régimen fiscal, el financiamiento o algo del diagnóstico?' },
  ])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar() {
    if (!input.trim() || cargando) return
    const nuevos: Mensaje[] = [...mensajes, { role: 'user', content: input.trim() }]
    setMensajes(nuevos)
    setInput('')
    setCargando(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfil, analisis, mensajes: nuevos }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido')
      setMensajes((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo contactar al asesor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white">
      <div className="max-h-96 space-y-3 overflow-y-auto p-4">
        {mensajes.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={
                'inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ' +
                (m.role === 'user' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800')
              }
            >
              {m.content}
            </span>
          </div>
        ))}
        {cargando && <p className="text-xs text-neutral-400">Escribiendo…</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex gap-2 border-t border-neutral-200 p-3">
        <input
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          placeholder="Pregúntale a tu asesor…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
        />
        <button onClick={enviar} disabled={cargando} className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-40">
          Enviar
        </button>
      </div>
    </div>
  )
}
