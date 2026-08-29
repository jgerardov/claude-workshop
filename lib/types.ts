// Sesión mockeada — no hay backend de auth real en este MVP. Nada se persiste
// más allá de la pestaña del navegador. Ver components/auth/AuthScreen.tsx.
export type Usuario = {
  nombre: string
  email: string
  metodo: 'google' | 'correo'
}

// 'otro' — investigacion/propuesta-guion-onboarding.md pregunta 1: el MVP solo
// tiene reglas fiscales para los 3 giros de siempre, pero la pregunta ofrece
// "otra cosa" en vez de forzar una respuesta que no aplica.
export type Giro = 'comercio' | 'restaurante' | 'servicios_profesionales' | 'otro'
export type FiguraFiscal = 'PFAE' | 'persona_moral' | 'informal'
export type ModeloVenta = 'b2b_credito' | 'b2b_contado' | 'b2c_mostrador' | 'ecommerce'
// 'deficit_recurrente' y 'solo_entender' — propuesta pregunta 8, las dos
// opciones que no existían antes y son las más importantes del guion.
export type Necesidad = 'capital_trabajo' | 'gasto_operativo' | 'activo_fijo' | 'deficit_recurrente' | 'solo_entender'
export type ProcesadorPagos = 'mercado_pago' | 'clip' | 'otro' | 'ninguno'
export type PlataformaDigital = 'rappi_didi_ubereats' | 'marketplace' | 'ninguno'
export type BuroEstatus = 'limpio' | 'atrasos_menores' | 'moroso' | 'desconocido'
export type OpinionCumplimiento = 'positiva' | 'negativa' | 'desconocida'

export type Perfil = {
  // Sin `rfc` aquí: la propuesta lo elimina del onboarding — se pide junto con
  // la contraseña CIEC al conectar el SAT (lib/fuentesCatalogo.ts), no en frío.
  giro: Giro
  figura_fiscal: FiguraFiscal
  antiguedad_meses: number
  ingresos_anuales: number
  gastos_deducibles_anuales: number
  modelo_venta: ModeloVenta
  necesidad: Necesidad
  monto_requerido: number
  procesador_pagos: ProcesadorPagos
  dias_credito_otorgado?: number
  vende_por_plataforma_digital?: PlataformaDigital
  rfc_registrado_en_plataforma?: boolean
  buro_estatus: BuroEstatus
  // Siempre 'desconocida': la propuesta elimina esta pregunta del onboarding
  // (se lee de la Constancia al conectar el SAT, no se pregunta — ver
  // "Pregunta eliminada" en la propuesta). El campo se conserva para cuando
  // exista una conexión real al SAT que sí pueda resolverlo.
  opinion_cumplimiento_sat: OpinionCumplimiento
}

// Nada se conecta hasta que el usuario lo hace explícito en la pantalla
// "Conecta tus fuentes de datos" — ver components/fuentes/ConectarFuentes.tsx y
// lib/fuentesCatalogo.ts. `valores` guarda solo lo que el usuario tecleó en los
// campos de esa fuente, nunca un valor inventado por la app.
export type FuenteConectada = {
  categoriaId: string
  categoriaNombre: string
  proveedorId: string
  proveedorNombre: string
  valores: Record<string, string>
}

export type FuentesConectadas = FuenteConectada[]

export type ProveedorRecomendado = {
  id: string
  nombre: string
  razon: string
  tiempo_aprobacion: string
  semaforo: 'verde' | 'verde-amarillo' | 'amarillo' | 'rojo'
}

export type Financiamiento = {
  descalificado: boolean
  motivoDescalificacion?: string
  redireccion?: string
  // Propuesta pregunta 8, opción "no necesito dinero" — no es un rechazo, es
  // una elección del usuario. Se renderiza distinto a `descalificado` (sin
  // tono de advertencia) en ResultadosView.
  sinNecesidadCredito: boolean
  primaria: ProveedorRecomendado | null
  alternativas: ProveedorRecomendado[]
  advertenciaMercadoCredito: boolean
  advertenciaBuroMoroso: boolean
  advertenciaCumplimientoNegativo: boolean
  estimadoBajoMxn: number
  estimadoAltoMxn: number
  ratioCapacidadPago?: number
  advertenciaCapacidadPago: boolean
  verificacionSipres: string
}

export type RegimenFiscal = {
  recomendado: string
  razon: string
}

export type Analisis = {
  diagnostico: string
  regimenFiscal: RegimenFiscal
  alertasFiscales: string[]
  financiamiento: Financiamiento
  disclaimer: string
}
