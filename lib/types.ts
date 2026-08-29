// Sesión mockeada — no hay backend de auth real en este MVP. Nada se persiste
// más allá de la pestaña del navegador. Ver components/auth/AuthScreen.tsx.
export type Usuario = {
  nombre: string
  email: string
  metodo: 'google' | 'correo'
}

export type Giro = 'comercio' | 'restaurante' | 'servicios_profesionales'
export type FiguraFiscal = 'PFAE' | 'persona_moral' | 'informal'
export type ModeloVenta = 'b2b_credito' | 'b2b_contado' | 'b2c_mostrador' | 'ecommerce'
export type Necesidad = 'capital_trabajo' | 'liquidez_cartera' | 'gasto_operativo' | 'activo_fijo'
export type ProcesadorPagos = 'mercado_pago' | 'clip' | 'otro' | 'ninguno'
export type PlataformaDigital = 'rappi_didi_ubereats' | 'marketplace' | 'ninguno'
export type BuroEstatus = 'limpio' | 'atrasos_menores' | 'moroso' | 'desconocido'
export type OpinionCumplimiento = 'positiva' | 'negativa' | 'desconocida'

export type Perfil = {
  rfc: string
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
