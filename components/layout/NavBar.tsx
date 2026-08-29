import BrandMark from '@/components/brand/BrandMark'
import { Perfil, Usuario } from '@/lib/types'

const GIRO_LABELS: Record<Perfil['giro'], string> = {
  comercio: 'Comercio al por menor',
  restaurante: 'Restaurante / alimentos',
  servicios_profesionales: 'Servicios profesionales',
}

// guia-de-marca.md §3/§5 — Midnight Navy para headers y navegación.
// Visible en todo el flujo salvo la pantalla de auth (que ya trae su propia
// marca centrada). Una vez que hay perfil, muestra el giro y RFC — refuerza
// que la app "ya sabe quién eres" en vez de reiniciar el contexto en cada paso.
export default function NavBar({
  usuario,
  perfil,
  onCerrarSesion,
}: {
  usuario?: Usuario | null
  perfil?: Perfil | null
  onCerrarSesion?: () => void
}) {
  return (
    <header className="bg-navy">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <BrandMark size={24} boxed={false} />
          <span className="text-sm font-semibold text-white">Finanzza</span>
        </div>

        <div className="flex items-center gap-3">
          {perfil && (
            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1 sm:flex">
              <span className="text-xs font-medium text-white/90">{GIRO_LABELS[perfil.giro]}</span>
              <span className="text-white/30">·</span>
              <span className="text-xs text-white/60">{perfil.rfc}</span>
            </div>
          )}
          {usuario && (
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="hidden sm:inline">Hola, {usuario.nombre}</span>
              {onCerrarSesion && (
                <button type="button" onClick={onCerrarSesion} className="text-white/60 underline hover:text-white">
                  Cerrar sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
