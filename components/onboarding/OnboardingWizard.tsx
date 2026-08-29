'use client'

import { useState } from 'react'
import { Perfil } from '@/lib/types'
import StepShell from './StepShell'
import PasoIdentidad, { rfcValido } from './steps/PasoIdentidad'
import PasoNumeros from './steps/PasoNumeros'
import PasoVenta from './steps/PasoVenta'
import PasoFinanciamiento from './steps/PasoFinanciamiento'

// Valores de ejemplo precargados para que la demo fluya con un clic por paso.
// Siguen siendo campos visibles y editables en el propio formulario — no es
// un dato que la app finja obtener por su cuenta (eso es lo que se corrigió
// en el mock de integraciones: ver components/integraciones/IntegracionesMock.tsx).
const PERFIL_INICIAL: Perfil = {
  rfc: 'XAXX010101000',
  giro: 'comercio',
  figura_fiscal: 'PFAE',
  antiguedad_meses: 24,
  ingresos_anuales: 1_200_000,
  gastos_deducibles_anuales: 300_000,
  modelo_venta: 'b2c_mostrador',
  dias_credito_otorgado: 30,
  necesidad: 'capital_trabajo',
  monto_requerido: 150_000,
  procesador_pagos: 'mercado_pago',
  buro_estatus: 'limpio',
  opinion_cumplimiento_sat: 'positiva',
}

const TITULOS = [
  { titulo: 'Cuéntanos de tu negocio', subtitulo: 'Giro, figura fiscal y RFC — lo usamos para el siguiente paso.' },
  { titulo: 'Tus números', subtitulo: 'Estimados por ti; los verificamos al conectar tus fuentes.' },
  { titulo: 'Cómo vendes', subtitulo: '' },
  { titulo: 'Qué necesitas', subtitulo: '' },
]

export default function OnboardingWizard({ onComplete }: { onComplete: (perfil: Perfil) => void }) {
  const [paso, setPaso] = useState(0)
  const [perfil, setPerfilState] = useState<Perfil>(PERFIL_INICIAL)

  function set<K extends keyof Perfil>(key: K, value: Perfil[K]) {
    setPerfilState((p) => ({ ...p, [key]: value }))
  }

  const validaciones = [
    rfcValido(perfil.rfc) && perfil.antiguedad_meses >= 0,
    perfil.ingresos_anuales > 0 && perfil.gastos_deducibles_anuales >= 0,
    true,
    perfil.monto_requerido > 0,
  ]

  const pasos = [
    <PasoIdentidad key="1" perfil={perfil} set={set} />,
    <PasoNumeros key="2" perfil={perfil} set={set} />,
    <PasoVenta key="3" perfil={perfil} set={set} />,
    <PasoFinanciamiento key="4" perfil={perfil} set={set} />,
  ]

  return (
    <StepShell
      titulo={TITULOS[paso].titulo}
      subtitulo={TITULOS[paso].subtitulo || undefined}
      paso={paso + 1}
      totalPasos={pasos.length}
      onAtras={paso > 0 ? () => setPaso((p) => p - 1) : undefined}
      onSiguiente={() => (paso < pasos.length - 1 ? setPaso((p) => p + 1) : onComplete(perfil))}
      siguienteDeshabilitado={!validaciones[paso]}
      textoSiguiente={paso < pasos.length - 1 ? 'Siguiente' : 'Continuar'}
    >
      {pasos[paso]}
    </StepShell>
  )
}
