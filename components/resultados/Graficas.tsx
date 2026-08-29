// Todas las cifras que se grafican aquí vienen de analisis.metricas / analisis.financiamiento,
// calculadas en lib/analysis.ts a partir de lo que el usuario declaró — nada se inventa ni
// se proyecta para "verse mejor". Ver Metricas en lib/types.ts.

const fmt = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
const fmtCompacto = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', notation: 'compact', maximumFractionDigits: 1 })

export function ResumenFinanciero({ ingresos, gastos, margen, margenPct }: { ingresos: number; gastos: number; margen: number; margenPct: number }) {
  const total = ingresos > 0 ? ingresos : 1
  const gastosPct = Math.min(100, (gastos / total) * 100)
  const margenBarraPct = Math.max(0, 100 - gastosPct)

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Ingresos anuales</p>
          <p className="mt-0.5 text-lg font-semibold text-green-600">{fmtCompacto(ingresos)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Gastos deducibles</p>
          <p className="mt-0.5 text-lg font-semibold text-rose-500">{fmtCompacto(gastos)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Margen anual</p>
          <p className="mt-0.5 text-lg font-semibold text-navy">{fmtCompacto(margen)}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full bg-rose-400" style={{ width: `${gastosPct}%` }} />
          <div className="h-full bg-green-500" style={{ width: `${margenBarraPct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-neutral-500">
          Te queda <span className="font-medium text-neutral-700">{margenPct.toFixed(0)}%</span> de margen sobre lo que declaraste como ingreso anual.
        </p>
      </div>
    </div>
  )
}

type Zona = { hasta: number; color: string; etiqueta?: string }

// Gauge de una sola aguja sobre un tramo de zonas de color — se usa tanto para
// "% de gastos sobre ingresos" (mejor abajo) como para "capacidad de pago"
// (mejor arriba), según el orden en que se pasen las zonas.
function Gauge({ valor, max, zonas, formato = (v: number) => `${v.toFixed(0)}%` }: { valor: number; max: number; zonas: Zona[]; formato?: (v: number) => string }) {
  const clamped = Math.max(0, Math.min(valor, max))
  const posicionPct = (clamped / max) * 100

  return (
    <div>
      <div className="relative">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {zonas.map((z, i) => {
            const prevHasta = i === 0 ? 0 : zonas[i - 1].hasta
            const ancho = ((Math.min(z.hasta, max) - prevHasta) / max) * 100
            return <div key={i} className={z.color} style={{ width: `${ancho}%` }} />
          })}
        </div>
        <div
          className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 rounded-full bg-neutral-900"
          style={{ left: `${posicionPct}%` }}
          title={formato(valor)}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
        <span>0</span>
        <span className="font-medium text-neutral-600">{formato(valor)}</span>
        <span>{formato(max)}</span>
      </div>
    </div>
  )
}

export function GaugeGastosSobreIngresos({ ratioPct, umbralPct }: { ratioPct: number; umbralPct: number }) {
  const max = Math.max(umbralPct * 1.75, ratioPct * 1.2, umbralPct + 20)
  return (
    <Gauge
      valor={ratioPct}
      max={max}
      zonas={[
        { hasta: umbralPct, color: 'bg-green-400' },
        { hasta: max, color: 'bg-amber-400' },
      ]}
    />
  )
}

export function GaugeCapacidadPago({ ratio, minimo }: { ratio: number; minimo: number }) {
  const max = Math.max(minimo * 2.2, ratio * 1.2, minimo + 1)
  return (
    <Gauge
      valor={ratio}
      max={max}
      formato={(v) => v.toFixed(2)}
      zonas={[
        { hasta: minimo, color: 'bg-amber-400' },
        { hasta: max, color: 'bg-green-400' },
      ]}
    />
  )
}

export function RangoMonto({ bajo, alto }: { bajo: number; alto: number }) {
  const max = alto * 1.15
  const inicioPct = (bajo / max) * 100
  const finPct = (alto / max) * 100

  return (
    <div>
      <div className="relative h-2.5 w-full rounded-full bg-neutral-100">
        <div className="absolute h-full rounded-full bg-navy" style={{ left: `${inicioPct}%`, width: `${finPct - inicioPct}%` }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-navy">{fmt(bajo)}</span>
        <span className="text-neutral-400">a</span>
        <span className="font-semibold text-navy">{fmt(alto)}</span>
      </div>
    </div>
  )
}
