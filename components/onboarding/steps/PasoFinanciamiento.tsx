import { Perfil } from '@/lib/types'
import { Field, inputClass } from '../fields'

export default function PasoFinanciamiento({ perfil, set }: { perfil: Perfil; set: <K extends keyof Perfil>(k: K, v: Perfil[K]) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="¿Qué necesitas?">
        <select className={inputClass} value={perfil.necesidad} onChange={(e) => set('necesidad', e.target.value as Perfil['necesidad'])}>
          <option value="capital_trabajo">Capital de trabajo</option>
          <option value="liquidez_cartera">Adelantar cobranza (facturas por cobrar)</option>
          <option value="gasto_operativo">Gasto operativo (viáticos, insumos, suscripciones)</option>
          <option value="activo_fijo">Activo fijo / expansión</option>
        </select>
      </Field>

      <Field label="Monto requerido (MXN)">
        <input className={inputClass} type="number" min={0} value={perfil.monto_requerido} onChange={(e) => set('monto_requerido', Number(e.target.value))} />
      </Field>

      <Field label="Estatus en buró de crédito">
        <select className={inputClass} value={perfil.buro_estatus} onChange={(e) => set('buro_estatus', e.target.value as Perfil['buro_estatus'])}>
          <option value="limpio">Limpio</option>
          <option value="atrasos_menores">Atrasos menores</option>
          <option value="moroso">Moroso</option>
          <option value="desconocido">No lo sé</option>
        </select>
      </Field>

      <Field label="¿Tu opinión de cumplimiento ante el SAT es positiva?" hint="Si no lo sabes, elige 'No lo sé' — lo confirmaremos en el siguiente paso al conectar con el SAT, no lo asumimos por ti.">
        <select className={inputClass} value={perfil.opinion_cumplimiento_sat} onChange={(e) => set('opinion_cumplimiento_sat', e.target.value as Perfil['opinion_cumplimiento_sat'])}>
          <option value="desconocida">No lo sé</option>
          <option value="positiva">Sí, es positiva</option>
          <option value="negativa">No, tengo algo pendiente</option>
        </select>
      </Field>
    </div>
  )
}
