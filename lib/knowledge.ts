// Datos y reglas transcritos de fintech.md, estrategias-fiscales-por-rubro-mexico.md
// y giros-de-negocio-sat.md. No inventar cifras aquí: todo dato nuevo debe venir con
// su sección de origen citada en un comentario.

export const FECHA_DE_DATOS = '2026-08-29'

export const GIRO_LABELS: Record<string, string> = {
  comercio: 'Comercio al por menor',
  restaurante: 'Restaurante / alimentos',
  servicios_profesionales: 'Servicios profesionales',
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
`.trim()
