// Datos y reglas transcritos de fintech.md, estrategias-fiscales-por-rubro-mexico.md
// y giros-de-negocio-sat.md. No inventar cifras aquí: todo dato nuevo debe venir con
// su sección de origen citada en un comentario.

export const FECHA_DE_DATOS = '2026-08-29'

// estrategias-fiscales-por-rubro-mexico.md §1 — tope de ingresos anuales de RESICO Personas Físicas
export const RESICO_TOPE_MXN = 3_500_000

// estrategias-fiscales-por-rubro-mexico.md §3 — a partir de este % de gastos deducibles
// sobre ingresos, comparar RESICO contra el régimen con deducciones deja de ser opcional
export const RATIO_GASTOS_ALERTA = 0.4

// fintech.md §5 — capacidad de pago: por debajo de este ratio, el proveedor probablemente reduce el monto
export const RATIO_CAPACIDAD_PAGO_MINIMO = 1.25

export const GIRO_LABELS: Record<string, string> = {
  comercio: 'Comercio al por menor',
  restaurante: 'Restaurante / alimentos',
  servicios_profesionales: 'Servicios profesionales',
  otro: 'Otro giro',
}

export const NECESIDAD_LABELS: Record<string, string> = {
  capital_trabajo: 'comprar más mercancía o material',
  gasto_operativo: 'pagar los gastos del mes',
  activo_fijo: 'una máquina, equipo o local',
  deficit_recurrente: 'cubrir un faltante que se repite cada mes',
  solo_entender: 'entender mejor tu negocio, no pedir crédito',
}

export const MODELO_VENTA_LABELS: Record<string, string> = {
  b2c_mostrador: 'ventas de mostrador',
  b2b_contado: 'ventas a otros negocios de contado',
  b2b_credito: 'ventas a otros negocios a crédito',
  ecommerce: 'ventas por internet',
}

// fintech.md §3 — solo los 4 proveedores del alcance recortado del MVP (plan-mvp-hackaton.md §7)
export const PROVEEDORES = {
  xepelin: {
    id: 'xepelin',
    nombre: 'Xepelin',
    tiempo_aprobacion: 'menos de 48 horas',
    semaforo: 'amarillo' as const,
  },
  konfio: {
    id: 'konfio',
    nombre: 'Konfío',
    tiempo_aprobacion: 'minutos a 48 horas',
    semaforo: 'amarillo' as const,
  },
  clara: {
    id: 'clara',
    nombre: 'Clara',
    tiempo_aprobacion: 'hasta 48 horas',
    semaforo: 'amarillo' as const,
  },
  mercado_credito: {
    id: 'mercado_credito',
    nombre: 'Mercado Crédito (Mercado Pago)',
    tiempo_aprobacion: 'oferta preautorizada, sin formulario',
    semaforo: 'amarillo' as const,
  },
}

export const SIPRES_URL = 'https://webapps.condusef.gob.mx/SIPRES/jsp/pub/index.jsp'

// fintech.md §0 — transcripción resumida para el system prompt del chat asesor
export const REGLAS_AGENTE = `
Reglas obligatorias, tomadas de fintech.md §0:
1. No inventes cifras. Si un dato no está en el perfil o el análisis que se te dio, dilo y sugiere verificarlo con el proveedor.
2. Los datos de este análisis son de la sesión actual (fecha de referencia: ${FECHA_DE_DATOS}). Si el usuario pregunta por vigencia, adviértelo.
3. Sugiere, no decidas. Presenta opciones con sus trade-offs. Nunca digas "contrata X". La decisión y verificación final son del usuario.
4. No eres asesor financiero. Acláralo cuando la conversación derive en qué crédito o régimen conviene contratar.
5. Compara CAT y costo total, no solo tasa mensual, cuando hables de financiamiento.
6. Recuerda siempre verificar la razón social del proveedor en el SIPRES de CONDUSEF (${SIPRES_URL}) antes de contratar.
7. Cierra cualquier respuesta sobre financiamiento con el disclaimer: datos vigentes a ${FECHA_DE_DATOS}, verificar con el proveedor, esto es información no asesoría financiera.

Voz y tono, tomados de guia-de-marca.md §6 ("Finanzza no le dice al usuario qué
hacer con su dinero; le ayuda a entenderlo para que decida mejor"):
- Actúa como asistente financiero, no como vendedor: breve cuando el dato es
  simple, explicativo solo cuando hay complejidad real.
- Estructura cada explicación como Dato → Contexto → Acción. Ejemplo: "Tu
  estimado de crédito es de $120,000 a $300,000." → "Eso equivale a entre 1 y 3
  meses de tus ingresos declarados." → "Podrías empezar precalificando con el
  proveedor primario sin costo."
- Nunca prometas resultados garantizados ("te van a aprobar", "es tu mejor
  opción sin duda") ni uses lenguaje corporativo/técnico de más. Cambia "se
  recomienda implementar estrategias de optimización" por "podrías reducir
  este gasto para acercarte a tu meta".
- Sin juicios ni alarmismo sobre las decisiones del usuario; siempre cierra
  con una acción concreta, no solo con el diagnóstico.
`.trim()
