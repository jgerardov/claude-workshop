import { Analisis } from '@/lib/types'
import { RATIO_CAPACIDAD_PAGO_MINIMO, RATIO_GASTOS_ALERTA } from '@/lib/knowledge'
import { GaugeCapacidadPago, GaugeGastosSobreIngresos, RangoMonto, ResumenFinanciero } from './Graficas'

function IconoResumen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="4" width="4" height="17" rx="1" />
    </svg>
  )
}

function IconoDocumento() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  )
}

function IconoFinanciamiento() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
      <path d="M3 21h18" />
    </svg>
  )
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-navy/5 text-navy">{icon}</div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
    </div>
  )
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col rounded-lg border border-neutral-200 bg-white p-5">
      <CardHeader icon={icon} title={title} />
      <div className="text-sm text-neutral-800">{children}</div>
    </section>
  )
}

export default function ResultadosView({ analisis, onAbrirChat }: { analisis: Analisis; onAbrirChat: () => void }) {
  const { financiamiento } = analisis

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Tu diagnóstico</p>
        <h1 className="mt-0.5 text-xl font-semibold text-neutral-900">Resumen financiero y fiscal</h1>
      </div>

      <div className="rounded-lg bg-navy p-5 text-white">
        <p className="text-sm font-medium uppercase tracking-wide text-green-300">Diagnóstico</p>
        <p className="mt-1 text-lg font-medium">{analisis.diagnostico}</p>
      </div>

      <Card icon={<IconoResumen />} title="Resumen financiero">
        <ResumenFinanciero
          ingresos={analisis.metricas.ingresosAnuales}
          gastos={analisis.metricas.gastosAnuales}
          margen={analisis.metricas.margenAnual}
          margenPct={analisis.metricas.margenPct}
        />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
        <Card icon={<IconoDocumento />} title="Régimen fiscal recomendado">
          <p className="font-medium">{analisis.regimenFiscal.recomendado}</p>
          <p className="mt-1 text-neutral-600">{analisis.regimenFiscal.razon}</p>

          <div className="mt-3 border-t border-neutral-100 pt-3">
            <p className="mb-1.5 text-xs font-medium text-neutral-500">Gastos deducibles como % de tus ingresos</p>
            <GaugeGastosSobreIngresos ratioPct={analisis.metricas.ratioGastosIngresosPct} umbralPct={RATIO_GASTOS_ALERTA * 100} />
          </div>

          {analisis.alertasFiscales.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-neutral-700">
              {analisis.alertasFiscales.map((a, i) => (
                <li key={i}>⚠️ {a}</li>
              ))}
            </ul>
          )}
        </Card>

        <Card icon={<IconoFinanciamiento />} title="Financiamiento">
          {financiamiento.sinNecesidadCredito ? (
            <div>
              <p className="font-medium text-neutral-900">No calculamos una recomendación de financiamiento porque nos dijiste que no lo necesitas ahorita.</p>
              <p className="mt-1 text-neutral-600">
                Tu diagnóstico (arriba) sigue siendo útil aunque no busques crédito — la mitad de los negocios en México nunca ha pedido financiamiento (ENAFIN 2024). Si eso cambia, vuelve a esta pantalla.
              </p>
            </div>
          ) : financiamiento.descalificado ? (
            <div>
              <p className="font-medium text-amber-700">{financiamiento.motivoDescalificacion}</p>
              <p className="mt-1 text-neutral-600">{financiamiento.redireccion}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {financiamiento.primaria ? (
                <div>
                  <p className="font-medium">Recomendación primaria: {financiamiento.primaria.nombre}</p>
                  <p className="text-neutral-600">{financiamiento.primaria.razon}</p>
                  <p className="mt-1 text-xs text-neutral-500">Tiempo de aprobación: {financiamiento.primaria.tiempo_aprobacion} · Semáforo regulatorio: {financiamiento.primaria.semaforo}</p>
                </div>
              ) : (
                <p className="text-neutral-600">Ninguna regla de este catálogo aplica todavía a tu perfil. Revisa banca tradicional o programas de gobierno.</p>
              )}

              {financiamiento.alternativas.length > 0 && (
                <div className="border-t border-neutral-100 pt-3">
                  <p className="text-xs font-medium text-neutral-500">Alternativas</p>
                  <ul className="mt-1 space-y-1">
                    {financiamiento.alternativas.map((a) => (
                      <li key={a.id}>
                        <span className="font-medium">{a.nombre}:</span> {a.razon}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-neutral-100 pt-3">
                <p className="mb-1.5 text-xs font-medium text-neutral-500">Rango estimado de monto autorizable</p>
                <RangoMonto bajo={financiamiento.estimadoBajoMxn} alto={financiamiento.estimadoAltoMxn} />
                <p className="mt-1.5 text-xs text-neutral-400">Es una estimación, no una oferta.</p>
              </div>

              {financiamiento.ratioCapacidadPago !== undefined && (
                <div className="border-t border-neutral-100 pt-3">
                  <p className="mb-1.5 text-xs font-medium text-neutral-500">Capacidad de pago estimada (flujo libre ÷ pago mensual)</p>
                  <GaugeCapacidadPago ratio={financiamiento.ratioCapacidadPago} minimo={RATIO_CAPACIDAD_PAGO_MINIMO} />
                </div>
              )}

              {financiamiento.advertenciaMercadoCredito && (
                <p className="rounded bg-amber-50 p-2 text-amber-800">⚠️ Mercado Crédito es de las opciones más caras del catálogo: tasa anual promedio publicada de 82.1%.</p>
              )}
              {financiamiento.advertenciaBuroMoroso && (
                <p className="rounded bg-amber-50 p-2 text-amber-800">⚠️ Buró moroso: la aprobación es improbable en la mayoría del catálogo. Excepción parcial: Xepelin, porque el análisis pesa sobre tu pagador. Considera regularizar antes de aplicar.</p>
              )}
              {financiamiento.advertenciaCumplimientoNegativo && (
                <p className="rounded bg-amber-50 p-2 text-amber-800">⚠️ Nos dijiste que tu opinión de cumplimiento ante el SAT no está en positivo — es una de las variables que más pesa en la aprobación (fintech.md §6). Resolverlo antes de aplicar mejora tus probabilidades.</p>
              )}
              {financiamiento.advertenciaCapacidadPago && financiamiento.ratioCapacidadPago !== undefined && (
                <p className="rounded bg-amber-50 p-2 text-amber-800">⚠️ Tu capacidad de pago estimada es ajustada (ratio {financiamiento.ratioCapacidadPago.toFixed(2)}) — es probable que el proveedor reduzca el monto solicitado.</p>
              )}
            </div>
          )}

          {!financiamiento.sinNecesidadCredito && (
            <p className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500">{financiamiento.verificacionSipres}</p>
          )}
        </Card>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center">
        <p className="text-xs text-neutral-400">{analisis.disclaimer}</p>
        <button onClick={onAbrirChat} className="w-full shrink-0 rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 sm:w-auto">
          Hablar con tu asesor
        </button>
      </div>
    </div>
  )
}
