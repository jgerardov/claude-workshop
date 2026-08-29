import { Perfil } from '@/lib/types'
import { Field, inputClass } from '../fields'

export default function PasoNumeros({ perfil, set }: { perfil: Perfil; set: <K extends keyof Perfil>(k: K, v: Perfil[K]) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Ingresos anuales (MXN)" hint="Lo que tú calculas o declaras — todavía no lo verificamos contra ninguna fuente externa.">
        <input className={inputClass} type="number" min={0} value={perfil.ingresos_anuales} onChange={(e) => set('ingresos_anuales', Number(e.target.value))} />
      </Field>

      <Field label="Gastos deducibles anuales (MXN)" hint="También estimado por ti.">
        <input className={inputClass} type="number" min={0} value={perfil.gastos_deducibles_anuales} onChange={(e) => set('gastos_deducibles_anuales', Number(e.target.value))} />
      </Field>
    </div>
  )
}
