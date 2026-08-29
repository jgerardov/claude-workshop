export default function StepShell({
  titulo,
  subtitulo,
  paso,
  totalPasos,
  onAtras,
  onSiguiente,
  siguienteDeshabilitado,
  textoSiguiente = 'Siguiente',
  children,
}: {
  titulo: string
  subtitulo?: string
  paso: number
  totalPasos: number
  onAtras?: () => void
  onSiguiente: () => void
  siguienteDeshabilitado?: boolean
  textoSiguiente?: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex gap-1">
          {Array.from({ length: totalPasos }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < paso ? 'bg-emerald-700' : 'bg-neutral-200'}`} />
          ))}
        </div>
        <p className="text-xs font-medium text-neutral-400">Paso {paso} de {totalPasos}</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-neutral-500">{subtitulo}</p>}
      </div>

      {children}

      <div className="flex gap-3">
        {onAtras && (
          <button onClick={onAtras} type="button" className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
            Atrás
          </button>
        )}
        <button
          onClick={onSiguiente}
          disabled={siguienteDeshabilitado}
          type="button"
          className="flex-1 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {textoSiguiente}
        </button>
      </div>
    </div>
  )
}
