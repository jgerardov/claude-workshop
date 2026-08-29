import BrandMark from '@/components/brand/BrandMark'

// guia-de-marca.md §3/§5 — Midnight Navy para headers y navegación.
// Placeholder por ahora: cuando se defina qué va en la navegación del
// onboarding (pasos, salir, ayuda), esto deja de ser estático.
export default function NavBar() {
  return (
    <header className="bg-navy">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <BrandMark size={24} boxed={false} />
          <span className="text-sm font-semibold text-white">Finanzza</span>
        </div>
        <span className="text-xs text-white/50">Navegación — próximamente</span>
      </div>
    </header>
  )
}
