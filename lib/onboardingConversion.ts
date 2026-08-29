// Guion y conversión del onboarding — investigacion/propuesta-guion-onboarding.md.
// Las preguntas se hacen en el vocabulario del usuario (rangos, botones, "no sé"
// como respuesta válida); esta capa convierte esas respuestas a los valores
// numéricos/enum que el motor de lib/analysis.ts ya espera. Ningún dato que el
// motor use se pregunta dos veces ni se inventa: donde no hay respuesta exacta,
// se estima y se lo decimos al usuario (ver VentaStep y MultiOpcionesStep para
// las notas en pantalla).

import { BuroEstatus, FiguraFiscal, Giro, ModeloVenta, Necesidad, Perfil, PlataformaDigital, ProcesadorPagos } from './types'
import { fmtMXN } from './format'

export type Opcion<T extends string> = { value: T; label: string }

// Pregunta 1 · ¿A qué se dedica tu negocio?
export const OPCIONES_GIRO: Opcion<'productos' | 'comida' | 'servicio' | 'otra'>[] = [
  { value: 'productos', label: 'Vendo productos' },
  { value: 'comida', label: 'Vendo comida o bebida' },
  { value: 'servicio', label: 'Doy un servicio' },
  { value: 'otra', label: 'Otra cosa' },
]

// Pregunta 2 · ¿Desde cuándo lo tienes?
export const OPCIONES_ANTIGUEDAD: Opcion<'menos_6m' | '6m_1a' | '1a_3a' | 'mas_3a'>[] = [
  { value: 'menos_6m', label: 'Menos de 6 meses' },
  { value: '6m_1a', label: 'Entre 6 meses y un año' },
  { value: '1a_3a', label: 'Entre 1 y 3 años' },
  { value: 'mas_3a', label: 'Más de 3 años' },
]

// Pregunta 3 · ¿Ya facturas?
export const OPCIONES_FACTURACION: Opcion<'factura' | 'dado_de_alta' | 'no_dado_de_alta' | 'no_seguro'>[] = [
  { value: 'factura', label: 'Sí, doy factura cuando me la piden' },
  { value: 'dado_de_alta', label: 'Todavía no, pero estoy dado de alta' },
  { value: 'no_dado_de_alta', label: 'No estoy dado de alta' },
  { value: 'no_seguro', label: 'No estoy seguro' },
]

// Pregunta 4 · ¿Quién te compra?
export const OPCIONES_CLIENTES: Opcion<'local' | 'b2b_inmediato' | 'b2b_semanas' | 'internet_apps'>[] = [
  { value: 'local', label: 'Gente que llega a mi local' },
  { value: 'b2b_inmediato', label: 'Otros negocios, y me pagan de inmediato' },
  { value: 'b2b_semanas', label: 'Otros negocios, y me pagan semanas después' },
  { value: 'internet_apps', label: 'Por internet o por apps' },
]

// Pregunta 5 · ¿Cómo te pagan? (varias)
export const OPCIONES_METODOS_PAGO: Opcion<'efectivo' | 'tarjeta' | 'transferencia' | 'app_reparto'>[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Terminal de tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'app_reparto', label: 'Por app de reparto' },
]

// Pregunta 7 · ¿Cuáles son tus gastos fijos del mes? (varias, sin montos)
export const OPCIONES_GASTOS_FIJOS: Opcion<'renta' | 'sueldos' | 'mercancia' | 'servicios' | 'creditos'>[] = [
  { value: 'renta', label: 'Renta' },
  { value: 'sueldos', label: 'Sueldos' },
  { value: 'mercancia', label: 'Mercancía o material' },
  { value: 'servicios', label: 'Luz, agua, internet' },
  { value: 'creditos', label: 'Créditos que ya estoy pagando' },
]

// Pregunta 8 · ¿Para qué necesitas dinero?
export const OPCIONES_NECESIDAD: Opcion<'mercancia' | 'gastos_mes' | 'equipo' | 'deficit' | 'entender'>[] = [
  { value: 'mercancia', label: 'Para comprar más mercancía o material' },
  { value: 'gastos_mes', label: 'Para pagar los gastos del mes' },
  { value: 'equipo', label: 'Para una máquina, equipo o local' },
  { value: 'deficit', label: 'Porque no me alcanza para cerrar el mes' },
  { value: 'entender', label: 'No necesito dinero, solo quiero entender mi negocio' },
]

// Pregunta 9 · ¿Has tenido problemas para pagar un crédito?
export const OPCIONES_BURO: Opcion<'nunca' | 'atraso' | 'vencido' | 'no_se'>[] = [
  { value: 'nunca', label: 'Nunca' },
  { value: 'atraso', label: 'Me atrasé alguna vez' },
  { value: 'vencido', label: 'Tengo algo vencido ahorita' },
  { value: 'no_se', label: 'No sé' },
]

export type RespuestasOnboarding = {
  giro: (typeof OPCIONES_GIRO)[number]['value']
  antiguedad: (typeof OPCIONES_ANTIGUEDAD)[number]['value']
  facturacion: (typeof OPCIONES_FACTURACION)[number]['value']
  clientes: (typeof OPCIONES_CLIENTES)[number]['value']
  metodosPago: (typeof OPCIONES_METODOS_PAGO)[number]['value'][]
  ventaModo: 'diario' | 'semanal'
  ventaMonto: number
  gastosFijos: (typeof OPCIONES_GASTOS_FIJOS)[number]['value'][]
  necesidad: (typeof OPCIONES_NECESIDAD)[number]['value']
  montoRequerido: number
  buro: (typeof OPCIONES_BURO)[number]['value']
}

export const RESPUESTAS_INICIALES: RespuestasOnboarding = {
  giro: 'productos',
  antiguedad: '1a_3a',
  facturacion: 'factura',
  clientes: 'local',
  metodosPago: ['tarjeta'],
  ventaModo: 'diario',
  ventaMonto: 4000,
  gastosFijos: ['renta', 'mercancia'],
  necesidad: 'mercancia',
  montoRequerido: 150_000,
  buro: 'nunca',
}

// ponytail: piso del rango en vez de un promedio — así el descalificador de
// "antiguedad_meses >= 12" (fintech.md §8) sigue funcionando exactamente igual
// que antes, sin tener que tocar lib/analysis.ts.
const ANTIGUEDAD_MESES: Record<RespuestasOnboarding['antiguedad'], number> = {
  menos_6m: 0,
  '6m_1a': 6,
  '1a_3a': 12,
  mas_3a: 36,
}

const GIRO_MAP: Record<RespuestasOnboarding['giro'], Giro> = {
  productos: 'comercio',
  comida: 'restaurante',
  servicio: 'servicios_profesionales',
  otra: 'otro',
}

// El régimen exacto se lee de la Constancia al conectar el SAT (propuesta,
// pregunta 3) — esto es solo la estimación provisional para poder mostrar un
// análisis antes de esa conexión. "No estoy seguro" se trata igual que "no
// dado de alta": el motor no debe asumir que sí califica para financiamiento
// cuando el propio usuario no sabe si factura.
const FIGURA_FISCAL_MAP: Record<RespuestasOnboarding['facturacion'], FiguraFiscal> = {
  factura: 'PFAE',
  dado_de_alta: 'PFAE',
  no_dado_de_alta: 'informal',
  no_seguro: 'informal',
}

const MODELO_VENTA_MAP: Record<RespuestasOnboarding['clientes'], ModeloVenta> = {
  local: 'b2c_mostrador',
  b2b_inmediato: 'b2b_contado',
  b2b_semanas: 'b2b_credito',
  internet_apps: 'ecommerce',
}

const NECESIDAD_MAP: Record<RespuestasOnboarding['necesidad'], Necesidad> = {
  mercancia: 'capital_trabajo',
  gastos_mes: 'gasto_operativo',
  equipo: 'activo_fijo',
  deficit: 'deficit_recurrente',
  entender: 'solo_entender',
}

const BURO_MAP: Record<RespuestasOnboarding['buro'], BuroEstatus> = {
  nunca: 'limpio',
  atraso: 'atrasos_menores',
  vencido: 'moroso',
  no_se: 'desconocido',
}

// Pesos de gasto fijo como % de ingresos mensuales — estimación deliberada,
// no viene de ningún documento de investigación. ponytail: es una heurística
// simple con techo (85% de ingresos) para no calcular un gasto absurdo; se
// reemplaza por el dato real en cuanto se lee el CFDI (propuesta, regla 1).
const PESO_GASTO_FIJO: Record<RespuestasOnboarding['gastosFijos'][number], number> = {
  renta: 0.1,
  sueldos: 0.2,
  mercancia: 0.25,
  servicios: 0.04,
  creditos: 0.06,
}

export function estimarIngresosAnuales(modo: 'diario' | 'semanal', monto: number): number {
  // 300 días hábiles/año (≈6 días/semana) para el modo diario, 50 semanas/año
  // para el modo semanal (dos de descanso). Estimación declarada al usuario
  // en pantalla, no un dato verificado — ver VentaStep.
  return modo === 'diario' ? monto * 300 : monto * 50
}

export function estimarGastosAnuales(gastosFijos: RespuestasOnboarding['gastosFijos'], ingresosAnuales: number): number {
  const peso = gastosFijos.reduce((acc, g) => acc + PESO_GASTO_FIJO[g], 0)
  return Math.round(ingresosAnuales * Math.min(peso, 0.85))
}

export function notaEstimacionVenta(modo: 'diario' | 'semanal', monto: number): string {
  const anual = estimarIngresosAnuales(modo, monto)
  return `Con eso calculo unos ${fmtMXN(anual)} al año. Es una estimación tuya; cuando conectemos el SAT la ajusto a lo que realmente facturaste.`
}

export function notaEstimacionGastos(gastosFijos: RespuestasOnboarding['gastosFijos'], ingresosAnuales: number): string | null {
  if (gastosFijos.length === 0) return null
  const anual = estimarGastosAnuales(gastosFijos, ingresosAnuales)
  return `Con eso estimo unos ${fmtMXN(Math.round(anual / 12))} al mes en gastos fijos. Es aproximado — cuáles son deducibles lo vemos con tu CFDI, no hace falta que lo sepas ahorita.`
}

function procesadorPagos(metodos: RespuestasOnboarding['metodosPago']): ProcesadorPagos {
  if (metodos.includes('tarjeta') || metodos.includes('transferencia')) return 'otro'
  return 'ninguno'
}

function plataformaDigital(metodos: RespuestasOnboarding['metodosPago']): PlataformaDigital | undefined {
  return metodos.includes('app_reparto') ? 'rappi_didi_ubereats' : undefined
}

export function soloEfectivo(metodos: RespuestasOnboarding['metodosPago']): boolean {
  return metodos.length === 1 && metodos[0] === 'efectivo'
}

export function construirPerfil(r: RespuestasOnboarding): Perfil {
  const ingresos_anuales = estimarIngresosAnuales(r.ventaModo, r.ventaMonto)
  const necesidad = NECESIDAD_MAP[r.necesidad]

  return {
    giro: GIRO_MAP[r.giro],
    figura_fiscal: FIGURA_FISCAL_MAP[r.facturacion],
    antiguedad_meses: ANTIGUEDAD_MESES[r.antiguedad],
    ingresos_anuales,
    gastos_deducibles_anuales: estimarGastosAnuales(r.gastosFijos, ingresos_anuales),
    modelo_venta: MODELO_VENTA_MAP[r.clientes],
    necesidad,
    // Sin "para qué necesitas dinero" no tiene caso preguntar el monto.
    monto_requerido: necesidad === 'solo_entender' ? 0 : r.montoRequerido,
    procesador_pagos: procesadorPagos(r.metodosPago),
    dias_credito_otorgado: r.clientes === 'b2b_semanas' ? 45 : undefined,
    vende_por_plataforma_digital: plataformaDigital(r.metodosPago),
    // No se pregunta si el RFC está registrado en la app de reparto — ver el
    // manejo "no lo sabemos" en lib/analysis.ts para no afirmar una retención
    // específica sin ese dato.
    rfc_registrado_en_plataforma: undefined,
    buro_estatus: BURO_MAP[r.buro],
    opinion_cumplimiento_sat: 'desconocida',
  }
}

// "Cómo se enlaza con las fuentes" de la propuesta: cada "no sé" se convierte
// en el motivo para conectar una fuente, no en un hueco silencioso.
export function construirPuentesFuentes(r: RespuestasOnboarding): string[] {
  const puentes: string[] = []
  if (r.facturacion === 'no_seguro') {
    puentes.push('No estabas seguro de si facturas — lo confirmamos con tu RFC al conectar el SAT.')
  }
  if (r.ventaModo === 'semanal') {
    puentes.push('Tu venta varía mucho — mejor la sacamos de tus facturas, que no fallan, al conectar el SAT.')
  }
  if (r.buro === 'no_se') {
    puentes.push('No sabías tu historial de crédito — lo podemos consultar por ti si conectas el buró (próximamente en este catálogo).')
  }
  if (soloEfectivo(r.metodosPago)) {
    puentes.push('Solo cobras en efectivo — tus facturas no van a contar toda la historia. Te proponemos registrar tus ventas de mostrador en la fuente de "Registro de ventas y gastos".')
  }
  return puentes
}
