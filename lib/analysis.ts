import { Analisis, Financiamiento, Metricas, Perfil, ProveedorRecomendado, RegimenFiscal } from './types'
import { FECHA_DE_DATOS, GIRO_LABELS, PROVEEDORES, RATIO_CAPACIDAD_PAGO_MINIMO, RATIO_GASTOS_ALERTA, RESICO_TOPE_MXN, SIPRES_URL } from './knowledge'

// Única fuente de verdad para los números derivados del perfil — tanto
// regimenFiscal() como la vista de resultados (gráficas) parten de aquí,
// para no calcular el mismo ratio dos veces con la posibilidad de divergir.
function calcularMetricas(perfil: Perfil): Metricas {
  const { ingresos_anuales: ingresosAnuales, gastos_deducibles_anuales: gastosAnuales } = perfil
  const margenAnual = ingresosAnuales - gastosAnuales
  const margenPct = ingresosAnuales > 0 ? (margenAnual / ingresosAnuales) * 100 : 0
  const ratioGastosIngresosPct = ingresosAnuales > 0 ? (gastosAnuales / ingresosAnuales) * 100 : 0
  const pctDelTopeResico = (ingresosAnuales / RESICO_TOPE_MXN) * 100

  return { ingresosAnuales, gastosAnuales, margenAnual, margenPct, ratioGastosIngresosPct, topeResicoMxn: RESICO_TOPE_MXN, pctDelTopeResico }
}

// estrategias-fiscales-por-rubro-mexico.md §1: RESICO PF hasta $3.5M anuales.
// §3: si los gastos deducibles reales son altos frente a los ingresos, comparar
// contra el régimen con deducciones aunque no se rebase el tope de RESICO.
function regimenFiscal(perfil: Perfil, metricas: Metricas): RegimenFiscal {
  const { ingresosAnuales, ratioGastosIngresosPct } = metricas

  if (ingresosAnuales > RESICO_TOPE_MXN) {
    return {
      recomendado: 'Régimen de Actividades Empresariales y Profesionales (o Régimen General si es persona moral)',
      razon: `Ingresos anuales por encima del tope de RESICO PF de ${RESICO_TOPE_MXN.toLocaleString('es-MX')} MXN (estrategias-fiscales-por-rubro-mexico.md §1).`,
    }
  }

  if (ratioGastosIngresosPct > RATIO_GASTOS_ALERTA * 100) {
    return {
      recomendado: 'Comparar RESICO PF vs. Régimen de Actividades Empresariales y Profesionales',
      razon: `Tus gastos deducibles equivalen a ${Math.round(ratioGastosIngresosPct)}% de tus ingresos — con deducciones reales tan altas, el régimen con deducciones puede convenir más que la tasa reducida de RESICO (estrategias-fiscales-por-rubro-mexico.md §3).`,
    }
  }

  return {
    recomendado: 'RESICO Personas Físicas',
    razon: `Ingresos dentro del tope de ${RESICO_TOPE_MXN.toLocaleString('es-MX')} MXN anuales y gastos deducibles bajos frente al ingreso: la tasa simplificada de 1%-2.5% sobre flujo de efectivo cobrado conviene más que llevar deducciones (estrategias-fiscales-por-rubro-mexico.md §1).`,
  }
}

// estrategias-fiscales-por-rubro-mexico.md §2 — tabla fija de 3 giros
function alertasFiscalesGiro(perfil: Perfil): string[] {
  const alertas: string[] = []
  const porPlataforma = perfil.vende_por_plataforma_digital && perfil.vende_por_plataforma_digital !== 'ninguno'

  if (perfil.giro === 'comercio') {
    alertas.push('El inventario comprado no se deduce al comprarlo: se deduce hasta que se vende, vía costo de lo vendido (no costo de compras).')
    if (porPlataforma) {
      alertas.push('Vender por plataforma digital implica una retención del 2.5% de ISR sobre el ingreso bruto de cada venta desde 2026.')
    }
  }

  if (perfil.giro === 'restaurante') {
    alertas.push('El alimento preparado lleva 16% de IVA siempre — no existe la tasa 0% "para llevar", ni en mostrador, domicilio o autoservicio.')
    if (perfil.vende_por_plataforma_digital === 'rappi_didi_ubereats') {
      alertas.push(
        perfil.rfc_registrado_en_plataforma
          ? 'Con RFC registrado en la app de entrega, la retención es de 2.1% ISR + 8% IVA sobre cada venta.'
          : 'Sin RFC registrado en la app de entrega, la retención sube a 20% ISR + 16% IVA — registrar el RFC en la plataforma es la primera optimización disponible.'
      )
    }
  }

  if (perfil.giro === 'servicios_profesionales') {
    alertas.push('RESICO tributa sobre flujo de efectivo: el mes en que cobras (no en que facturas) determina cuándo pagas el ISR correspondiente.')
    if (porPlataforma) {
      alertas.push('Prestar el servicio a través de una plataforma digital implica una retención del 2.5% de ISR sobre el bruto desde 2026.')
    }
  }

  return alertas
}

// fintech.md §5 — estimación de monto de crédito simple / línea de capital de trabajo
function estimarMonto(perfil: Perfil) {
  return {
    bajo: Math.round(perfil.ingresos_anuales * 0.1),
    alto: Math.round(perfil.ingresos_anuales * 0.25),
  }
}

// fintech.md §5 — capacidad de pago, aproximada: sin plazo declarado en el perfil
// del MVP, se asume un plazo de 12 meses para el pago mensual estimado.
// ponytail: aproximación deliberada — el perfil del MVP no captura plazo_deseado_meses,
// añadirlo si el ratio real importa más que la señal de alerta.
function capacidadDePago(perfil: Perfil) {
  const flujoLibreMensual = (perfil.ingresos_anuales - perfil.gastos_deducibles_anuales) / 12
  const pagoMensualEstimado = perfil.monto_requerido / 12
  if (pagoMensualEstimado <= 0) return { ratio: undefined, advertencia: false }
  const ratio = flujoLibreMensual / pagoMensualEstimado
  return { ratio, advertencia: ratio < RATIO_CAPACIDAD_PAGO_MINIMO }
}

function proveedor(id: keyof typeof PROVEEDORES, razon: string): ProveedorRecomendado {
  const ficha = PROVEEDORES[id]
  return { id: ficha.id, nombre: ficha.nombre, razon, tiempo_aprobacion: ficha.tiempo_aprobacion, semaforo: ficha.semaforo }
}

// fintech.md §2 (Reglas 1-4) y §8 (descalificadores duros), recortado al alcance
// de 4 proveedores de plan-mvp-hackaton.md §7.
function financiamiento(perfil: Perfil): Financiamiento {
  const { bajo, alto } = estimarMonto(perfil)
  const { ratio, advertencia: advertenciaCapacidadPago } = capacidadDePago(perfil)
  const verificacionSipres = `Verifica la razón social exacta del proveedor en el SIPRES de CONDUSEF (${SIPRES_URL}) antes de firmar.`

  // Descalificadores duros — fintech.md §8, se evalúan antes que cualquier regla.
  if (perfil.antiguedad_meses < 12 || perfil.figura_fiscal === 'informal') {
    return {
      descalificado: true,
      motivoDescalificacion: perfil.figura_fiscal === 'informal'
        ? 'Negocio informal: ninguna fintech de este catálogo aplica.'
        : `Antigüedad de ${perfil.antiguedad_meses} meses, por debajo del mínimo de 12 requerido por todo el catálogo.`,
      redireccion: 'Redirigir a programas de gobierno (NAFIN, FOJAL u otro fondo estatal) o a regularización fiscal como PFAE ante el SAT como primer paso.',
      primaria: null,
      alternativas: [],
      advertenciaMercadoCredito: false,
      advertenciaBuroMoroso: false,
      advertenciaCumplimientoNegativo: perfil.opinion_cumplimiento_sat === 'negativa',
      estimadoBajoMxn: bajo,
      estimadoAltoMxn: alto,
      ratioCapacidadPago: ratio,
      advertenciaCapacidadPago,
      verificacionSipres,
    }
  }

  const candidatos: ProveedorRecomendado[] = []

  // Regla 1 — Xepelin (factoraje)
  if (
    perfil.modelo_venta === 'b2b_credito' &&
    (perfil.dias_credito_otorgado ?? 0) >= 30 &&
    perfil.figura_fiscal === 'persona_moral' &&
    perfil.antiguedad_meses >= 12
  ) {
    candidatos.push(proveedor('xepelin', 'Adelanta el cobro de tus facturas a clientes B2B sin generar deuda nueva; el análisis pesa sobre tu pagador, no sobre ti.'))
  }

  // Regla 2 — Konfío (capital de trabajo)
  if (perfil.necesidad === 'capital_trabajo' && perfil.antiguedad_meses >= 12 && perfil.monto_requerido >= 50_000 && perfil.monto_requerido <= 6_000_000) {
    candidatos.push(proveedor('konfio', 'Capital de trabajo sin garantía, acepta PFAE, aprobación en minutos a 48 horas.'))
  }

  // Regla 3 — Clara (gasto operativo)
  if (perfil.necesidad === 'gasto_operativo') {
    candidatos.push(proveedor('clara', 'Línea de gasto con tarjeta corporativa para viáticos, insumos o suscripciones — no es efectivo.'))
  }

  // Regla 4 — Mercado Crédito (ecosistema Mercado Pago), siempre con advertencia de costo
  const aplicaMercadoCredito = perfil.procesador_pagos === 'mercado_pago'
  if (aplicaMercadoCredito) {
    candidatos.push(proveedor('mercado_credito', 'Oferta preautorizada sin papeleo dentro de tu cuenta de Mercado Pago — es de las opciones más caras del catálogo.'))
  }

  const primaria = candidatos[0] ?? null
  const alternativas = candidatos.slice(1, 3)

  return {
    descalificado: false,
    primaria,
    alternativas,
    advertenciaMercadoCredito: aplicaMercadoCredito,
    advertenciaBuroMoroso: perfil.buro_estatus === 'moroso',
    advertenciaCumplimientoNegativo: perfil.opinion_cumplimiento_sat === 'negativa',
    estimadoBajoMxn: bajo,
    estimadoAltoMxn: alto,
    ratioCapacidadPago: ratio,
    advertenciaCapacidadPago,
    verificacionSipres,
  }
}

// fintech.md §9 [1] — plantilla de diagnóstico en una frase
function diagnostico(perfil: Perfil): string {
  return `Por tu perfil — ${perfil.figura_fiscal}, ${perfil.antiguedad_meses} meses operando en ${GIRO_LABELS[perfil.giro]}, ${perfil.modelo_venta} — tu necesidad se parece más a ${perfil.necesidad.replace('_', ' ')}.`
}

export function analizar(perfil: Perfil): Analisis {
  const metricas = calcularMetricas(perfil)
  return {
    diagnostico: diagnostico(perfil),
    regimenFiscal: regimenFiscal(perfil, metricas),
    alertasFiscales: alertasFiscalesGiro(perfil),
    financiamiento: financiamiento(perfil),
    metricas,
    disclaimer: `Datos vigentes a ${FECHA_DE_DATOS}; verifícalos con el proveedor. Esto es información, no asesoría financiera.`,
  }
}
