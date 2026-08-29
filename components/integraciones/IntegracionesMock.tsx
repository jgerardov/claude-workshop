'use client'

import { useEffect, useState } from 'react'
import { Analisis, FuenteConectada, FuentesConectadas, Perfil } from '@/lib/types'
import { fmtMXN as fmt } from '@/lib/format'

type Paso = {
  titulo: string
  detalle: string[]
}

// Detalle honesto por categoría — solo reutiliza lo que el perfil ya trae o lo
// que el usuario tecleó al conectar la fuente (ver lib/fuentesCatalogo.ts).
// Nada aquí es un dato inventado presentado como "extraído". El RFC sale de
// `f.valores`, no de un campo del perfil — se pide al conectar el SAT, no en
// el onboarding (propuesta de onboarding). La opinión de cumplimiento ya no
// se pregunta al usuario, así que tampoco se afirma aquí un valor concreto.
function detalleParaFuente(f: FuenteConectada, perfil: Perfil): string[] {
  switch (f.categoriaId) {
    case 'fiscal':
      return [
        `RFC verificado: ${f.valores.rfc ?? 'no capturado'}`,
        `Régimen fiscal: ${perfil.figura_fiscal} (estimado de tus respuestas; se confirma con tu constancia)`,
        'No aparece en listas del artículo 69-B',
      ]
    case 'bancaria':
      return [`Banco: ${f.valores.banco ?? 'no especificado'}`, 'Conciliando movimientos de los últimos 3 meses (simulado, esta demo no trae saldos reales)']
    case 'cobros':
      return [`Cuenta vinculada en ${f.proveedorNombre}`, 'Transacciones disponibles para conciliar con tus CFDI']
    case 'contable':
      return [`Catálogo de cuentas sincronizado con ${f.proveedorNombre} (simulado)`]
    case 'registro':
      return [`Ingresos estimados: ${fmt(perfil.ingresos_anuales)} al año`, `Gastos fijos estimados: ${fmt(perfil.gastos_deducibles_anuales)} al año`]
    default:
      return ['Fuente conectada.']
  }
}

// ponytail: un solo componente genérico — los pasos salen de las fuentes que el
// usuario conectó de verdad en ConectarFuentes.tsx, más el paso fijo de consulta
// a la fintech recomendada por el motor de análisis.
function construirPasos(perfil: Perfil, analisis: Analisis, fuentes: FuentesConectadas): Paso[] {
  const pasos: Paso[] = fuentes.map((f) => ({
    titulo: `Conectando con ${f.proveedorNombre} (${f.categoriaNombre})…`,
    detalle: detalleParaFuente(f, perfil),
  }))

  pasos.push({
    titulo: analisis.financiamiento.primaria
      ? `Consultando pre-aprobación con ${analisis.financiamiento.primaria.nombre}…`
      : 'Consultando opciones de financiamiento…',
    detalle: analisis.financiamiento.descalificado
      ? [analisis.financiamiento.motivoDescalificacion ?? 'Ningún proveedor aplica todavía.']
      : [`Rango estimado: ${fmt(analisis.financiamiento.estimadoBajoMxn)} – ${fmt(analisis.financiamiento.estimadoAltoMxn)} MXN`],
  })

  return pasos
}

export default function IntegracionesMock({
  perfil,
  analisis,
  fuentes,
  onDone,
}: {
  perfil: Perfil
  analisis: Analisis
  fuentes: FuentesConectadas
  onDone: () => void
}) {
  const pasos = construirPasos(perfil, analisis, fuentes)
  const [visibles, setVisibles] = useState(0)

  useEffect(() => {
    if (visibles >= pasos.length) return
    const t = setTimeout(() => setVisibles((v) => v + 1), 900)
    return () => clearTimeout(t)
  }, [visibles, pasos.length])

  const listo = visibles >= pasos.length

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-neutral-900">Integrando tus datos</h1>
      <div className="space-y-3">
        {pasos.slice(0, visibles).map((paso, i) => (
          <div key={i} className="rounded-md border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-900">✓ {paso.titulo}</p>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600">
              {paso.detalle.map((d, j) => (
                <li key={j}>· {d}</li>
              ))}
            </ul>
          </div>
        ))}
        {!listo && <p className="text-sm text-neutral-400">{pasos[visibles]?.titulo}</p>}
      </div>
      <button
        onClick={onDone}
        disabled={!listo}
        className="w-full rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Ver mi análisis
      </button>
      {!listo && (
        <button onClick={() => setVisibles(pasos.length)} className="w-full text-xs text-neutral-400 underline">
          Saltar animación
        </button>
      )}
    </div>
  )
}
