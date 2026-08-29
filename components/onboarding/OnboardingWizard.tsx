'use client'

import { useState } from 'react'
import { Perfil } from '@/lib/types'
import {
  OPCIONES_ANTIGUEDAD,
  OPCIONES_BURO,
  OPCIONES_CLIENTES,
  OPCIONES_FACTURACION,
  OPCIONES_GASTOS_FIJOS,
  OPCIONES_GIRO,
  OPCIONES_METODOS_PAGO,
  OPCIONES_NECESIDAD,
  RESPUESTAS_INICIALES,
  RespuestasOnboarding,
  construirPerfil,
  construirPuentesFuentes,
  notaEstimacionGastos,
  estimarIngresosAnuales,
  soloEfectivo,
} from '@/lib/onboardingConversion'
import StepShell from './StepShell'
import { inputClass } from './fields'
import OpcionesStep from './steps/OpcionesStep'
import MultiOpcionesStep from './steps/MultiOpcionesStep'
import VentaStep from './steps/VentaStep'

// Guion de investigacion/propuesta-guion-onboarding.md: 9 preguntas en el
// vocabulario del usuario, más un décimo paso ("¿cuánto necesitas?") que la
// propuesta no listó pero que el motor de lib/analysis.ts sí requiere — se
// omite solo cuando la pregunta 8 responde "no necesito dinero".
type PasoId = 'giro' | 'antiguedad' | 'facturacion' | 'clientes' | 'metodosPago' | 'venta' | 'gastosFijos' | 'necesidad' | 'monto' | 'buro'

const TITULOS: Record<PasoId, { titulo: string; subtitulo?: string }> = {
  giro: { titulo: '¿A qué se dedica tu negocio?' },
  antiguedad: { titulo: '¿Desde cuándo lo tienes?' },
  facturacion: { titulo: '¿Ya facturas?', subtitulo: 'Si no estás seguro, lo confirmamos después con tu RFC.' },
  clientes: { titulo: '¿Quién te compra?' },
  metodosPago: { titulo: '¿Cómo te pagan?', subtitulo: 'Puedes marcar varias.' },
  venta: { titulo: '¿Más o menos cuánto vendes en un día normal?' },
  gastosFijos: { titulo: '¿Cuáles son tus gastos fijos del mes?', subtitulo: 'Marca los que apliquen — no hace falta el monto exacto.' },
  necesidad: { titulo: '¿Para qué necesitas dinero?' },
  monto: { titulo: '¿Más o menos cuánto necesitas?' },
  buro: { titulo: '¿Has tenido problemas para pagar un crédito?' },
}

export default function OnboardingWizard({ onComplete }: { onComplete: (perfil: Perfil, puentes: string[]) => void }) {
  const [respuestas, setRespuestas] = useState<RespuestasOnboarding>(RESPUESTAS_INICIALES)
  const [indice, setIndice] = useState(0)

  function set<K extends keyof RespuestasOnboarding>(key: K, value: RespuestasOnboarding[K]) {
    setRespuestas((r) => ({ ...r, [key]: value }))
  }

  const pasos: PasoId[] = [
    'giro',
    'antiguedad',
    'facturacion',
    'clientes',
    'metodosPago',
    'venta',
    'gastosFijos',
    'necesidad',
    ...(respuestas.necesidad === 'entender' ? [] : (['monto'] as PasoId[])),
    'buro',
  ]
  const pasoActual = pasos[indice]

  const validaciones: Record<PasoId, boolean> = {
    giro: true,
    antiguedad: true,
    facturacion: true,
    clientes: true,
    metodosPago: respuestas.metodosPago.length > 0,
    venta: respuestas.ventaMonto > 0,
    gastosFijos: true,
    necesidad: true,
    monto: respuestas.montoRequerido > 0,
    buro: true,
  }

  const ingresosEstimados = estimarIngresosAnuales(respuestas.ventaModo, respuestas.ventaMonto)

  function siguiente() {
    if (indice < pasos.length - 1) {
      setIndice((i) => i + 1)
    } else {
      onComplete(construirPerfil(respuestas), construirPuentesFuentes(respuestas))
    }
  }

  function renderPaso() {
    switch (pasoActual) {
      case 'giro':
        return <OpcionesStep opciones={OPCIONES_GIRO} valor={respuestas.giro} onChange={(v) => set('giro', v)} />
      case 'antiguedad':
        return <OpcionesStep opciones={OPCIONES_ANTIGUEDAD} valor={respuestas.antiguedad} onChange={(v) => set('antiguedad', v)} />
      case 'facturacion':
        return <OpcionesStep opciones={OPCIONES_FACTURACION} valor={respuestas.facturacion} onChange={(v) => set('facturacion', v)} />
      case 'clientes':
        return <OpcionesStep opciones={OPCIONES_CLIENTES} valor={respuestas.clientes} onChange={(v) => set('clientes', v)} />
      case 'metodosPago':
        return (
          <MultiOpcionesStep
            opciones={OPCIONES_METODOS_PAGO}
            valores={respuestas.metodosPago}
            onChange={(v) => set('metodosPago', v)}
            nota={soloEfectivo(respuestas.metodosPago) ? 'Vas a ver poco en tus fuentes digitales si solo cobras en efectivo — te propondremos registrar tus ventas de mostrador cuando conectemos tus fuentes.' : null}
          />
        )
      case 'venta':
        return <VentaStep modo={respuestas.ventaModo} monto={respuestas.ventaMonto} onModo={(m) => set('ventaModo', m)} onMonto={(n) => set('ventaMonto', n)} />
      case 'gastosFijos':
        return (
          <MultiOpcionesStep
            opciones={OPCIONES_GASTOS_FIJOS}
            valores={respuestas.gastosFijos}
            onChange={(v) => set('gastosFijos', v)}
            nota={notaEstimacionGastos(respuestas.gastosFijos, ingresosEstimados)}
          />
        )
      case 'necesidad':
        return <OpcionesStep opciones={OPCIONES_NECESIDAD} valor={respuestas.necesidad} onChange={(v) => set('necesidad', v)} />
      case 'monto':
        return (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Monto aproximado (MXN)</label>
            <input className={inputClass} type="number" min={0} value={respuestas.montoRequerido} onChange={(e) => set('montoRequerido', Number(e.target.value))} />
            <p className="mt-3 text-sm text-neutral-500">No tiene que ser exacto — con esto calculamos si un proveedor te queda cómodo o ajustado.</p>
          </div>
        )
      case 'buro':
        return <OpcionesStep opciones={OPCIONES_BURO} valor={respuestas.buro} onChange={(v) => set('buro', v)} />
    }
  }

  return (
    <StepShell
      titulo={TITULOS[pasoActual].titulo}
      subtitulo={TITULOS[pasoActual].subtitulo}
      paso={indice + 1}
      totalPasos={pasos.length}
      onAtras={indice > 0 ? () => setIndice((i) => i - 1) : undefined}
      onSiguiente={siguiente}
      siguienteDeshabilitado={!validaciones[pasoActual]}
      textoSiguiente={indice < pasos.length - 1 ? 'Siguiente' : 'Continuar'}
    >
      {renderPaso()}
    </StepShell>
  )
}
