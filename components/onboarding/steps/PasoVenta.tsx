import { Perfil } from '@/lib/types'
import { Field, inputClass } from '../fields'

export default function PasoVenta({ perfil, set }: { perfil: Perfil; set: <K extends keyof Perfil>(k: K, v: Perfil[K]) => void }) {
  const mostrarDiasCredito = perfil.modelo_venta === 'b2b_credito'
  const mostrarRfcPlataforma = !!perfil.vende_por_plataforma_digital && perfil.vende_por_plataforma_digital !== 'ninguno'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Modelo de venta">
        <select className={inputClass} value={perfil.modelo_venta} onChange={(e) => set('modelo_venta', e.target.value as Perfil['modelo_venta'])}>
          <option value="b2c_mostrador">B2C mostrador</option>
          <option value="b2b_credito">B2B a crédito</option>
          <option value="b2b_contado">B2B de contado</option>
          <option value="ecommerce">E-commerce</option>
        </select>
      </Field>

      {mostrarDiasCredito && (
        <Field label="Días de crédito que otorgas a tus clientes">
          <input className={inputClass} type="number" min={0} value={perfil.dias_credito_otorgado ?? 0} onChange={(e) => set('dias_credito_otorgado', Number(e.target.value))} />
        </Field>
      )}

      <Field label="Procesador de pagos">
        <select className={inputClass} value={perfil.procesador_pagos} onChange={(e) => set('procesador_pagos', e.target.value as Perfil['procesador_pagos'])}>
          <option value="mercado_pago">Mercado Pago</option>
          <option value="clip">Clip</option>
          <option value="otro">Otro</option>
          <option value="ninguno">Ninguno</option>
        </select>
      </Field>

      <Field label="¿Vendes por plataforma digital?">
        <select
          className={inputClass}
          value={perfil.vende_por_plataforma_digital ?? 'ninguno'}
          onChange={(e) => set('vende_por_plataforma_digital', e.target.value as Perfil['vende_por_plataforma_digital'])}
        >
          <option value="ninguno">Ninguna</option>
          <option value="rappi_didi_ubereats">Rappi / DiDi Food / Uber Eats</option>
          <option value="marketplace">Marketplace (Amazon, Mercado Libre)</option>
        </select>
      </Field>

      {mostrarRfcPlataforma && (
        <div className="flex items-center gap-2 pt-6">
          <input
            id="rfc-plataforma"
            type="checkbox"
            checked={!!perfil.rfc_registrado_en_plataforma}
            onChange={(e) => set('rfc_registrado_en_plataforma', e.target.checked)}
          />
          <label htmlFor="rfc-plataforma" className="text-sm text-neutral-700">Mi RFC está registrado en esa plataforma</label>
        </div>
      )}
    </div>
  )
}
