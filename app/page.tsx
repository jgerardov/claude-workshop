'use client'

import { useState } from 'react'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'
import ConectarFuentes from '@/components/fuentes/ConectarFuentes'
import IntegracionesMock from '@/components/integraciones/IntegracionesMock'
import ResultadosView from '@/components/resultados/ResultadosView'
import ChatAsesor from '@/components/chat/ChatAsesor'
import { analizar } from '@/lib/analysis'
import { Analisis, FuentesConectadas, Perfil } from '@/lib/types'

type Paso = 'onboarding' | 'fuentes' | 'mock' | 'resultados'

export default function Home() {
  const [paso, setPaso] = useState<Paso>('onboarding')
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [fuentes, setFuentes] = useState<FuentesConectadas | null>(null)
  const [analisis, setAnalisis] = useState<Analisis | null>(null)
  const [mostrarChat, setMostrarChat] = useState(false)

  function handlePerfilCompleto(p: Perfil) {
    setPerfil(p)
    setPaso('fuentes')
  }

  function handleFuentesConectadas(f: FuentesConectadas) {
    if (!perfil) return
    setFuentes(f)
    setAnalisis(analizar(perfil))
    setPaso('mock')
  }

  return (
    <main className="px-4 py-10">
      {paso === 'onboarding' && <OnboardingWizard onComplete={handlePerfilCompleto} />}

      {paso === 'fuentes' && perfil && <ConectarFuentes perfil={perfil} onContinuar={handleFuentesConectadas} />}

      {paso === 'mock' && perfil && analisis && fuentes && (
        <IntegracionesMock perfil={perfil} analisis={analisis} fuentes={fuentes} onDone={() => setPaso('resultados')} />
      )}

      {paso === 'resultados' && perfil && analisis && (
        <div className="space-y-6">
          <ResultadosView analisis={analisis} onAbrirChat={() => setMostrarChat(true)} />
          {mostrarChat && <ChatAsesor perfil={perfil} analisis={analisis} />}
        </div>
      )}
    </main>
  )
}
