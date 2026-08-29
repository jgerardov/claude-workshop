'use client'

import { useState } from 'react'
import AuthScreen from '@/components/auth/AuthScreen'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'
import ConectarFuentes from '@/components/fuentes/ConectarFuentes'
import IntegracionesMock from '@/components/integraciones/IntegracionesMock'
import ResultadosView from '@/components/resultados/ResultadosView'
import ChatAsesor from '@/components/chat/ChatAsesor'
import { analizar } from '@/lib/analysis'
import { Analisis, FuentesConectadas, Perfil, Usuario } from '@/lib/types'

type Paso = 'auth' | 'onboarding' | 'fuentes' | 'mock' | 'resultados'

export default function Home() {
  const [paso, setPaso] = useState<Paso>('auth')
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [fuentes, setFuentes] = useState<FuentesConectadas | null>(null)
  const [analisis, setAnalisis] = useState<Analisis | null>(null)
  const [mostrarChat, setMostrarChat] = useState(false)

  function handleAutenticado(u: Usuario) {
    setUsuario(u)
    setPaso('onboarding')
  }

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

  function cerrarSesion() {
    setUsuario(null)
    setPerfil(null)
    setFuentes(null)
    setAnalisis(null)
    setMostrarChat(false)
    setPaso('auth')
  }

  return (
    <main className="px-4 py-10">
      {usuario && paso !== 'auth' && (
        <div className="mx-auto mb-6 flex max-w-2xl items-center justify-between text-sm text-neutral-500">
          <span>Hola, {usuario.nombre}</span>
          <button onClick={cerrarSesion} className="text-neutral-400 underline hover:text-neutral-600">
            Cerrar sesión
          </button>
        </div>
      )}

      {paso === 'auth' && <AuthScreen onAutenticado={handleAutenticado} />}

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
