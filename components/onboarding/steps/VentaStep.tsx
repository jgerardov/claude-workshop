import { inputClass } from '../fields'
import { notaEstimacionVenta } from '@/lib/onboardingConversion'

export default function VentaStep({
  modo,
  monto,
  onModo,
  onMonto,
}: {
  modo: 'diario' | 'semanal'
  monto: number
  onModo: (m: 'diario' | 'semanal') => void
  onMonto: (n: number) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{modo === 'diario' ? 'Venta de un día normal (MXN)' : 'Venta de una semana normal (MXN)'}</label>
      <input className={inputClass} type="number" min={0} value={monto} onChange={(e) => onMonto(Number(e.target.value))} />
      <button type="button" onClick={() => onModo(modo === 'diario' ? 'semanal' : 'diario')} className="mt-2 text-xs text-neutral-500 underline">
        {modo === 'diario' ? 'Varía mucho, mejor pregúntame por semana' : 'Prefiero contarte por día'}
      </button>
      <p className="mt-3 text-sm text-neutral-500">{notaEstimacionVenta(modo, monto)}</p>
    </div>
  )
}
