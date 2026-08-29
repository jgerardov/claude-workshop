import { Perfil } from '@/lib/types'
import { Field, inputClass } from '../fields'

const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i

export function rfcValido(rfc: string) {
  return RFC_REGEX.test(rfc.trim())
}

export default function PasoIdentidad({ perfil, set }: { perfil: Perfil; set: <K extends keyof Perfil>(k: K, v: Perfil[K]) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Giro de negocio">
        <select className={inputClass} value={perfil.giro} onChange={(e) => set('giro', e.target.value as Perfil['giro'])}>
          <option value="comercio">Comercio al por menor</option>
          <option value="restaurante">Restaurante / alimentos</option>
          <option value="servicios_profesionales">Servicios profesionales</option>
        </select>
      </Field>

      <Field label="Figura fiscal">
        <select className={inputClass} value={perfil.figura_fiscal} onChange={(e) => set('figura_fiscal', e.target.value as Perfil['figura_fiscal'])}>
          <option value="PFAE">Persona física con actividad empresarial</option>
          <option value="persona_moral">Persona moral</option>
          <option value="informal">Aún no facturo / informal</option>
        </select>
      </Field>

      <Field label="RFC" hint="Lo vamos a usar en el siguiente paso para conectar con el SAT — no se envía a ningún servidor en esta demo.">
        <input
          className={inputClass}
          type="text"
          maxLength={13}
          placeholder="XAXX010101000"
          value={perfil.rfc}
          onChange={(e) => set('rfc', e.target.value.toUpperCase())}
        />
      </Field>

      <Field label="Antigüedad operando (meses)">
        <input className={inputClass} type="number" min={0} value={perfil.antiguedad_meses} onChange={(e) => set('antiguedad_meses', Number(e.target.value))} />
      </Field>
    </div>
  )
}
