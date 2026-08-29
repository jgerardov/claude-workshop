import { Opcion } from '@/lib/onboardingConversion'

export default function OpcionesStep<T extends string>({ opciones, valor, onChange }: { opciones: Opcion<T>[]; valor: T; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {opciones.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-md border p-3 text-left text-sm font-medium ${
            valor === o.value ? 'border-green-600 bg-green-50 text-green-800' : 'border-neutral-200 bg-white text-neutral-900 hover:border-green-600'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
