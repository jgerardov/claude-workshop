import { Analisis, Financiamiento, Perfil, ProveedorRecomendado, RegimenFiscal } from './types'
import { FECHA_DE_DATOS, GIRO_LABELS, MODELO_VENTA_LABELS, NECESIDAD_LABELS, PROVEEDORES, SIPRES_URL } from './knowledge'

// estrategias-fiscales-por-rubro-mexico.md §1: RESICO PF hasta $3.5M anuales.
// §3: si los gastos deducibles reales son altos frente a los ingresos, comparar
// contra el régimen con deducciones aunque no se rebase el tope de RESICO.
function regimenFiscal(perfil: Perfil): RegimenFiscal {
  const { ingresos_anuales, gastos_deducibles_anuales } = perfil
  const ratioGastos = ingresos_anuales > 0 ? gastos_deducibles_anuales / ingresos_anuales : 0

  if (ingresos_anuales > 3_500_000) {
    return {
      recomendado: 'Régimen de Actividades Empresariales y Profesionales (o Régimen General si es persona moral)',
      razon: 'Ingresos anuales por encima del tope de RESICO PF de $3,500,000 MXN (estrategias-fiscales-por-rubro-mexico.md §1).',
    }
  }

  if (ratioGastos > 0.4) {
    return {
      recomendado: 'Comparar RESICO PF vs. Régimen de Actividades Empresariales y Profesionales',
      razon: `Tus gastos deducibles equivalen a ${Math.round(ratioGastos * 100)}% de tus ingresos — con deducciones reales tan altas, el régimen con deducciones puede convenir más que la tasa reducida de RESICO (estrategias-fiscales-por-rubro-mexico.md §3).`,
    }
  }

  return {
    recomendado: 'RESICO Personas Físicas',
    razon: 'Ingresos dentro del tope de $3,500,000 MXN anuales y gastos deducibles bajos frente al ingreso: la tasa simplificada de 1%-2.5% sobre flujo de efectivo cobrado conviene más que llevar deducciones (estrategias-fiscales-por-rubro-mexico.md §1).',
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
      // No se pregunta si el RFC está registrado en la app (propuesta de
      // onboarding) — sin ese dato no afirmamos una retención específica,
      // mostramos las dos y cuál depende de qué.
      alertas.push(
        perfil.rfc_registrado_en_plataforma === undefined
          ? 'Vendes por app de reparto: si tu RFC está registrado en la app, la retención es 2.1% ISR + 8% IVA; si no, sube a 20% ISR + 16% IVA. Vale la pena confirmar cuál te aplica.'
          : perfil.rfc_registrado_en_plataforma
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

  if (perfil.giro === 'otro') {
    alertas.push('Para tu giro específico todavía no tenemos alertas fiscales especializadas — te recomendamos revisar las particularidades de tu actividad con un contador.')
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
  return { ratio, advertencia: ratio < 1.25 }
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

  // fintech.md §8 — "NO recomendar deuda en absoluto si el usuario describe el
  // crédito para cubrir un déficit operativo recurrente". Esta regla faltaba
  // en el motor (propuesta de onboarding, sección "La regla que falta").
  // Redactada en voz de marca: Dato → Contexto → Acción, sin decidir por el
  // usuario. Va antes que los descalificadores duros: no recomendar deuda
  // aquí no depende de si calificarías para ella.
  if (perfil.necesidad === 'deficit_recurrente') {
    return {
      descalificado: true,
      motivoDescalificacion: 'Un crédito para cubrir los gastos del mes se paga con el dinero del mes siguiente.',
      redireccion:
        'Cuando el hueco es del mes, suele repetirse — y entonces el crédito se vuelve parte del gasto fijo. El 25.6% de las empresas que se financiaron usó el dinero para pagar otros créditos (ENAPROCE 2018). Antes de endeudarte, hay tres cosas que podrías revisar primero: renegociar plazos con tus proveedores, adelantar el cobro de las facturas que ya emitiste, o mirar dónde se está yendo el gasto.',
      sinNecesidadCredito: false,
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

  // Propuesta de onboarding, pregunta 8 — "no necesito dinero, solo quiero
  // entender mi negocio". No es un rechazo: es la mitad del mercado que nunca
  // ha pedido financiamiento (ENAFIN 2024, 50%). Se renderiza sin tono de
  // advertencia en ResultadosView.
  if (perfil.necesidad === 'solo_entender') {
    return {
      descalificado: false,
      sinNecesidadCredito: true,
      primaria: null,
      alternativas: [],
      advertenciaMercadoCredito: false,
      advertenciaBuroMoroso: false,
      advertenciaCumplimientoNegativo: false,
      estimadoBajoMxn: bajo,
      estimadoAltoMxn: alto,
      ratioCapacidadPago: undefined,
      advertenciaCapacidadPago: false,
      verificacionSipres,
    }
  }

  // Descalificadores duros — fintech.md §8, se evalúan antes que cualquier regla.
  if (perfil.antiguedad_meses < 12 || perfil.figura_fiscal === 'informal') {
    return {
      descalificado: true,
      motivoDescalificacion: perfil.figura_fiscal === 'informal'
        ? 'Negocio informal, o todavía no confirmado si factura: ninguna fintech de este catálogo aplica.'
        : `Antigüedad de ${perfil.antiguedad_meses} meses, por debajo del mínimo de 12 requerido por todo el catálogo.`,
      redireccion: 'Redirigir a programas de gobierno (NAFIN, FOJAL u otro fondo estatal) o a regularización fiscal como PFAE ante el SAT como primer paso.',
      sinNecesidadCredito: false,
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
    sinNecesidadCredito: false,
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

// fintech.md §9 [1] — plantilla de diagnóstico en una frase, en el vocabulario
// del usuario (propuesta de onboarding), no en el de los enums internos.
function diagnostico(perfil: Perfil): string {
  return `Tienes un negocio de ${GIRO_LABELS[perfil.giro].toLowerCase()} con ${MODELO_VENTA_LABELS[perfil.modelo_venta]}. Por lo que nos contaste, esto se trata de ${NECESIDAD_LABELS[perfil.necesidad]}.`
}

export function analizar(perfil: Perfil): Analisis {
  return {
    diagnostico: diagnostico(perfil),
    regimenFiscal: regimenFiscal(perfil),
    alertasFiscales: alertasFiscalesGiro(perfil),
    financiamiento: financiamiento(perfil),
    disclaimer: `Datos vigentes a ${FECHA_DE_DATOS}; verifícalos con el proveedor. Esto es información, no asesoría financiera.`,
  }
}
