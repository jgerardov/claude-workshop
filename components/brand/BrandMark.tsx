// guia-de-marca.md §2 — símbolo geométrico de barras de crecimiento ascendentes
// en verde de marca; como ícono de app va sobre un contenedor oscuro (Navy) con
// esquinas redondeadas. `boxed=false` se usa cuando el fondo ya es oscuro (la
// barra de navegación), para no meter un cuadro navy sobre otro navy.
export default function BrandMark({ size = 44, boxed = true }: { size?: number; boxed?: boolean }) {
  const bars = (
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="#4ADE80" />
      <rect x="10" y="9" width="4" height="12" rx="1" fill="#22C55E" />
      <rect x="17" y="4" width="4" height="17" rx="1" fill="#22C55E" />
    </svg>
  )

  if (!boxed) return bars

  return (
    <div className="flex items-center justify-center rounded-xl bg-navy" style={{ width: size, height: size }}>
      {bars}
    </div>
  )
}
