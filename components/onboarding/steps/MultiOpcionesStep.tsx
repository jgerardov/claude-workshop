import { Opcion } from '@/lib/onboardingConversion'

export default function MultiOpcionesStep<T extends string>({
  opciones,
  valores,
  onChange,
  nota,
}: {
  opciones: Opcion<T>[]
  valores: T[]
  onChange: (v: T[]) => void
  nota?: string | null
}) {
  function toggle(v: T) {
    onChange(valores.includes(v) ? valores.filter((x) => x !== v) : [...valores, v])
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opciones.map((o) => {
          const activo = valores.includes(o.value)
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={`rounded-md border p-3 text-left text-sm font-medium ${
                activo ? 'border-green-600 bg-green-50 text-green-800' : 'border-neutral-200 bg-white text-neutral-900 hover:border-green-600'
              }`}
            >
              {activo ? '✓ ' : ''}
              {o.label}
            </button>
          )
        })}
      </div>
      {nota && <p className="mt-3 text-sm text-neutral-500">{nota}</p>}
    </div>
  )
}
