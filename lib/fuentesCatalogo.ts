// Catálogo de fuentes de datos conectables, transcrito de
// investigacion/03-fuentes-de-datos-mexico.md §5 (las 8 capas del catálogo).
// Cada categoría cita la sección exacta; los proveedores son los que el
// documento verificó, no una lista inventada. Todos los campos son simulados
// para el MVP — ninguno se envía a un servidor externo real.

export type CampoFuente = {
  key: string
  label: string
  tipo: 'text' | 'password'
  placeholderDemo: string // valor de ejemplo, no un dato real precargado en el perfil
}

export type ProveedorFuente = {
  id: string
  nombre: string
  campos: CampoFuente[]
}

export type CategoriaFuente = {
  id: string
  nombre: string
  descripcion: string
  cita: string
  proveedores: ProveedorFuente[]
}

export const CATALOGO_FUENTES: CategoriaFuente[] = [
  {
    id: 'fiscal',
    nombre: 'Fiscal (SAT)',
    descripcion: 'La fuente ancla: universal, obligatoria y ya viene clasificada. Confirma tu régimen y tu opinión de cumplimiento.',
    cita: 'investigacion/03-fuentes-de-datos-mexico.md §5.1',
    proveedores: [
      {
        id: 'sat_constancia',
        nombre: 'SAT — Constancia y Opinión de Cumplimiento',
        campos: [{ key: 'ciec', label: 'Contraseña CIEC del SAT', tipo: 'password', placeholderDemo: 'DEMO1234' }],
      },
    ],
  },
  {
    id: 'bancaria',
    nombre: 'Bancaria (agregador)',
    descripcion: 'Sin open banking operativo en México, el flujo de caja real se lee vía un agregador privado con tus credenciales bancarias.',
    cita: 'investigacion/03-fuentes-de-datos-mexico.md §5.2',
    proveedores: [
      { id: 'belvo', nombre: 'Belvo', campos: bancoCampos() },
      { id: 'syncfy', nombre: 'Syncfy (Paybook)', campos: bancoCampos() },
      { id: 'finerio', nombre: 'Finerio Connect', campos: bancoCampos() },
      { id: 'prometeo', nombre: 'Prometeo', campos: bancoCampos() },
    ],
  },
  {
    id: 'cobros',
    nombre: 'Cobros / punto de venta',
    descripcion: 'Ve la venta en el momento en que ocurre, no cuando se factura — la capa con mejor documentación pública del catálogo.',
    cita: 'investigacion/03-fuentes-de-datos-mexico.md §5.3',
    proveedores: [
      { id: 'clip', nombre: 'Clip', campos: apiKeyCampos() },
      { id: 'mercado_pago', nombre: 'Mercado Pago', campos: apiKeyCampos() },
      { id: 'conekta', nombre: 'Conekta', campos: apiKeyCampos() },
      { id: 'stripe_mx', nombre: 'Stripe MX', campos: apiKeyCampos() },
    ],
  },
  {
    id: 'contable',
    nombre: 'Contable / ERP',
    descripcion: 'El estado financiero ya estructurado, si el negocio lleva contabilidad en sistema.',
    cita: 'investigacion/03-fuentes-de-datos-mexico.md §5.4',
    proveedores: [
      { id: 'alegra', nombre: 'Alegra', campos: apiKeyCampos() },
      { id: 'bind_erp', nombre: 'Bind ERP', campos: apiKeyCampos() },
      { id: 'facturama', nombre: 'Facturama', campos: apiKeyCampos() },
      { id: 'contpaqi', nombre: 'CONTPAQi / Aspel', campos: apiKeyCampos() },
      {
        id: 'otro_erp',
        nombre: 'Otro sistema (escribe cuál)',
        campos: [
          { key: 'nombre_sistema', label: 'Nombre del sistema', tipo: 'text', placeholderDemo: 'SAP' },
          { key: 'usuario', label: 'Usuario / API key', tipo: 'password', placeholderDemo: 'DEMO-KEY' },
        ],
      },
    ],
  },
  {
    id: 'registro',
    nombre: 'Registro de ventas y gastos',
    descripcion: 'El registro más común del micronegocio — declarado por el dueño, no verificado, pero es la única forma de ver al 75.4% que cobra en efectivo.',
    cita: 'investigacion/03-fuentes-de-datos-mexico.md §5.8',
    proveedores: [
      {
        id: 'google_sheets',
        nombre: 'Google Sheets',
        campos: [{ key: 'nombre_hoja', label: 'Nombre de tu hoja de cálculo', tipo: 'text', placeholderDemo: 'Finanzas del negocio' }],
      },
      {
        id: 'treinta',
        nombre: 'Treinta',
        campos: [{ key: 'usuario', label: 'Correo o teléfono de tu cuenta', tipo: 'text', placeholderDemo: 'demo@treinta.co' }],
      },
      {
        id: 'kyte',
        nombre: 'Kyte',
        campos: [{ key: 'usuario', label: 'Correo de tu cuenta', tipo: 'text', placeholderDemo: 'demo@kyteapp.com' }],
      },
      {
        id: 'captura_manual',
        nombre: 'Captura manual (cuaderno / tickets)',
        campos: [{ key: 'nota', label: '¿Qué vas a capturar primero?', tipo: 'text', placeholderDemo: 'Tickets de la última semana' }],
      },
    ],
  },
]

function bancoCampos(): CampoFuente[] {
  return [
    { key: 'banco', label: 'Banco', tipo: 'text', placeholderDemo: 'BBVA' },
    { key: 'usuario', label: 'Usuario de banca en línea', tipo: 'text', placeholderDemo: 'demo_usuario' },
    { key: 'password', label: 'Contraseña', tipo: 'password', placeholderDemo: 'DEMO1234' },
  ]
}

function apiKeyCampos(): CampoFuente[] {
  return [{ key: 'api_key', label: 'Usuario / API key de tu cuenta', tipo: 'password', placeholderDemo: 'DEMO-KEY' }]
}
