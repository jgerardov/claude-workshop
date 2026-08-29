'use client'

import { useState } from 'react'
import { CATALOGO_FUENTES } from '@/lib/fuentesCatalogo'
import { FuenteConectada } from '@/lib/types'
import { inputClass } from '../onboarding/fields'

// Panel de 3 pasos para agregar UNA fuente a la vez: categoría → proveedor →
// campos de esa fuente. Las opciones y campos vienen del catálogo investigado
// (lib/fuentesCatalogo.ts), no se inventan aquí.
export default function AgregarFuentePanel({
  yaConectadas,
  onConectar,
  onCancelar,
}: {
  yaConectadas: FuenteConectada[]
  onConectar: (fuente: FuenteConectada) => void
  onCancelar: () => void
}) {
  const [categoriaId, setCategoriaId] = useState<string | null>(null)
  const [proveedorId, setProveedorId] = useState<string | null>(null)
  const [valores, setValores] = useState<Record<string, string>>({})
  const [conectando, setConectando] = useState(false)

  const categoria = CATALOGO_FUENTES.find((c) => c.id === categoriaId) ?? null
  const proveedor = categoria?.proveedores.find((p) => p.id === proveedorId) ?? null

  const proveedoresDisponibles = categoria
    ? categoria.proveedores.filter((p) => !yaConectadas.some((f) => f.categoriaId === categoria.id && f.proveedorId === p.id))
    : []

  function elegirProveedor(id: string) {
    setProveedorId(id)
    const p = categoria?.proveedores.find((x) => x.id === id)
    const iniciales: Record<string, string> = {}
    p?.campos.forEach((c) => (iniciales[c.key] = c.placeholderDemo))
    setValores(iniciales)
  }

  function conectar() {
    if (!categoria || !proveedor) return
    setConectando(true)
    setTimeout(() => {
      onConectar({ categoriaId: categoria.id, categoriaNombre: categoria.nombre, proveedorId: proveedor.id, proveedorNombre: proveedor.nombre, valores })
      setConectando(false)
      setCategoriaId(null)
      setProveedorId(null)
      setValores({})
    }, 800)
  }

  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4">
      {!categoria && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">¿Qué tipo de fuente quieres conectar?</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CATALOGO_FUENTES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoriaId(c.id)}
                className="rounded-md border border-neutral-200 bg-white p-3 text-left hover:border-green-600"
              >
                <p className="text-sm font-medium text-neutral-900">{c.nombre}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{c.descripcion}</p>
                <p className="mt-1 text-[10px] text-neutral-400">{c.cita}</p>
              </button>
            ))}
          </div>
          <button type="button" onClick={onCancelar} className="mt-3 text-xs text-neutral-400 underline">
            Cancelar
          </button>
        </div>
      )}

      {categoria && !proveedor && (
        <div>
          <button type="button" onClick={() => setCategoriaId(null)} className="mb-2 text-xs text-neutral-500 underline">
            ‹ {categoria.nombre}
          </button>
          <p className="mb-2 text-sm font-medium text-neutral-700">¿Con cuál proveedor?</p>
          {proveedoresDisponibles.length === 0 ? (
            <p className="text-sm text-neutral-500">Ya conectaste todos los proveedores de esta categoría.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {proveedoresDisponibles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => elegirProveedor(p.id)}
                  className="rounded-md border border-neutral-200 bg-white p-3 text-left text-sm font-medium text-neutral-900 hover:border-green-600"
                >
                  {p.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {categoria && proveedor && (
        <div>
          <button type="button" onClick={() => setProveedorId(null)} className="mb-2 text-xs text-neutral-500 underline">
            ‹ {proveedor.nombre}
          </button>
          <div className="space-y-2">
            {proveedor.campos.map((campo) => (
              <div key={campo.key}>
                <label className="mb-1 block text-xs font-medium text-neutral-600">{campo.label}</label>
                <input
                  className={inputClass}
                  type={campo.tipo}
                  value={valores[campo.key] ?? ''}
                  onChange={(e) => setValores((v) => ({ ...v, [campo.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={conectar}
            disabled={conectando || proveedor.campos.some((c) => !valores[c.key]?.trim())}
            className="mt-3 rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {conectando ? 'Conectando…' : `Conectar con ${proveedor.nombre}`}
          </button>
        </div>
      )}
    </div>
  )
}
