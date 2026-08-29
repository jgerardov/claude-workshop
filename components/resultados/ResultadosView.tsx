import { Analisis } from '@/lib/types'

const fmt = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      <div className="mt-2 text-sm text-neutral-800">{children}</div>
    </section>
  )
}

export default function ResultadosView({ analisis, onAbrirChat }: { analisis: Analisis; onAbrirChat: () => void }) {
  const { financiamiento } = analisis

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-lg bg-emerald-700 p-5 text-white">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-100">Diagnóstico</p>
        <p className="mt-1 text-lg">{analisis.diagnostico}</p>
      </div>

      <Card title="Régimen fiscal recomendado">
        <p className="font-medium">{analisis.regimenFiscal.recomendado}</p>
        <p className="mt-1 text-neutral-600">{analisis.regimenFiscal.razon}</p>
        {analisis.alertasFiscales.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-neutral-700">
            {analisis.alertasFiscales.map((a, i) => (
              <li key={i}>⚠️ {a}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Financiamiento">
        {financiamiento.descalificado ? (
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

            <p className="border-t border-neutral-100 pt-3">
              Rango estimado de monto autorizable: <strong>{fmt(financiamiento.estimadoBajoMxn)} – {fmt(financiamiento.estimadoAltoMxn)}</strong> MXN. Es una estimación, no una oferta.
            </p>

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

        <p className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500">{financiamiento.verificacionSipres}</p>
      </Card>

      <p className="text-xs text-neutral-400">{analisis.disclaimer}</p>

      <button onClick={onAbrirChat} className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
        Hablar con tu asesor
      </button>
    </div>
  )
}
