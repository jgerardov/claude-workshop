'use client'

import { useState } from 'react'
import { Usuario } from '@/lib/types'
import { inputClass } from '../onboarding/fields'
import BrandMark from '../brand/BrandMark'
import GoogleButton from './GoogleButton'
import GoogleAccountPicker from './GoogleAccountPicker'

type Modo = 'login' | 'signup'

function Marca() {
  return (
    <div className="flex flex-col items-center text-center">
      <BrandMark size={44} />
      <h1 className="mt-3 text-xl font-semibold text-neutral-900">Finanzza</h1>
      <p className="mt-1 text-sm text-neutral-500">Tu dinero. Tus decisiones. Entiende tu negocio, tu régimen fiscal y tu mejor opción de financiamiento.</p>
    </div>
  )
}

export default function AuthScreen({ onAutenticado }: { onAutenticado: (usuario: Usuario) => void }) {
  const [modo, setModo] = useState<Modo>('login')
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const [nombre, setNombre] = useState('María Torres')
  const [email, setEmail] = useState('maria@minegocio.mx')
  const [password, setPassword] = useState('••••••••')
  const [cargando, setCargando] = useState(false)

  function enviarFormulario() {
    setCargando(true)
    setTimeout(() => {
      onAutenticado({ nombre: modo === 'signup' ? nombre : nombre || 'María Torres', email, metodo: 'correo' })
      setCargando(false)
    }, 700)
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <Marca />

        <div className="mt-6 flex rounded-md bg-neutral-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setModo('login')}
            className={`flex-1 rounded py-1.5 ${modo === 'login' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setModo('signup')}
            className={`flex-1 rounded py-1.5 ${modo === 'signup' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
          >
            Crear cuenta
          </button>
        </div>

        <div className="mt-5">
          <GoogleButton onClick={() => setMostrarPicker(true)} texto={modo === 'signup' ? 'Crear cuenta con Google' : 'Continuar con Google'} />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-neutral-400">
          <div className="h-px flex-1 bg-neutral-200" />
          o con tu correo
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            enviarFormulario()
          }}
        >
          {modo === 'signup' && (
            <input className={inputClass} type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          )}
          <input className={inputClass} type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className={inputClass} type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {cargando ? 'Entrando…' : modo === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-neutral-400">Demo — cualquier correo y contraseña funcionan, no se guarda nada.</p>
      </div>

      {mostrarPicker && (
        <GoogleAccountPicker
          onCerrar={() => setMostrarPicker(false)}
          onElegir={(nombreGoogle, emailGoogle) => {
            setMostrarPicker(false)
            onAutenticado({ nombre: nombreGoogle, email: emailGoogle, metodo: 'google' })
          }}
        />
      )}
    </div>
  )
}
