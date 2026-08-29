---
titulo: "Base de conocimiento — Financiamiento para negocios en México"
version: "1.0"
fecha_de_datos: "2026-08-29"
vigencia_recomendada: "90 días — revalidar montos, tasas y CAT contra las fuentes oficiales"
mercado: "México (MXN)"
proposito: >
  Documento de referencia para que un agente sugiera opciones de crédito
  a un usuario según el perfil de negocio que tenga registrado en la app.
alcance: "Crédito y financiamiento para PyME, PFAE y personas morales. No cubre crédito al consumo ni hipotecario."
---

# Base de conocimiento: Financiamiento para negocios (México)

## 0. Instrucciones de uso para el agente

Reglas obligatorias al usar este documento:

1. **No inventes cifras.** Si un dato no está en este archivo, di que no lo tienes y sugiere verificarlo con el proveedor. Nunca estimes una tasa, un CAT o un monto máximo que no aparezca aquí.
2. **Siempre marca la fecha de los datos.** Los montos, tasas y CAT son de `fecha_de_datos`. Si han pasado más de 90 días, adviértelo explícitamente.
3. **Sugiere, no decidas.** Presenta 2 o 3 opciones con sus trade-offs. Nunca digas "contrata X". Cierra siempre recordando que la decisión y la verificación final son del usuario.
4. **No eres asesor financiero.** Incluye esa aclaración cuando la conversación derive en qué crédito conviene contratar.
5. **Compara CAT, no tasas.** Si el usuario compara opciones, el CAT y el costo total en pesos son la métrica; la tasa mensual sola es engañosa.
6. **Verificación previa obligatoria.** En toda recomendación incluye el paso de verificar la razón social en el SIPRES de CONDUSEF.
7. **Filtra por descalificadores antes de sugerir** (sección 8). Es peor sugerir una opción para la que el usuario no califica que no sugerir nada.
8. **Si faltan datos del perfil**, pregunta solo los campos marcados como `requerido` en la sección 1. No pidas todo el formulario de golpe.

---

## 1. Modelo de datos de entrada (perfil del negocio)

Campos que el agente debe leer del registro del negocio o preguntar al usuario.

| Campo | Tipo | Requerido | Valores |
|---|---|---|---|
| `figura_fiscal` | enum | sí | `PFAE`, `persona_moral`, `informal` |
| `antiguedad_meses` | int | sí | meses desde inicio de operaciones facturando |
| `facturacion_anual` | number | sí | MXN, últimos 12 meses de CFDI emitidos |
| `modelo_venta` | enum | sí | `b2b_credito`, `b2b_contado`, `b2c_mostrador`, `ecommerce`, `marketplace` |
| `necesidad` | enum | sí | `capital_trabajo`, `liquidez_cartera`, `gasto_operativo`, `activo_fijo`, `expansion` |
| `monto_requerido` | number | sí | MXN |
| `plazo_deseado_meses` | int | no | |
| `concentracion_clientes` | enum | no | `alta` (>50% en 1 cliente), `media`, `baja` |
| `calidad_pagadores` | enum | no | `corporativos`, `pyme`, `consumidor_final` |
| `dias_credito_otorgado` | int | no | días que tarda en cobrar (0 si vende de contado) |
| `procesador_pagos` | enum | no | `mercado_pago`, `clip`, `otro`, `ninguno` |
| `buro_estatus` | enum | no | `limpio`, `atrasos_menores`, `moroso`, `desconocido` |
| `edad_solicitante` | int | no | relevante para Konfío |
| `urgencia` | enum | no | `inmediata` (<72h), `semanas`, `flexible` |
| `opinion_cumplimiento_sat` | enum | no | `positiva`, `negativa`, `desconocida` |

---

## 2. Árbol de decisión (lógica de ruteo)

Evalúa en este orden. La primera regla que se cumpla determina la recomendación primaria; las siguientes en cumplirse son alternativas.

```
REGLA 1 — Liquidez de cartera
SI modelo_venta = b2b_credito
   Y dias_credito_otorgado >= 30
   Y figura_fiscal = persona_moral
   Y antiguedad_meses >= 12
ENTONCES primaria = XEPELIN (factoraje)
   RAZON: adelanta cobranza propia sin generar deuda nueva
   BONUS: si calidad_pagadores = corporativos, la probabilidad de aprobación sube
          porque el análisis pesa sobre el pagador, no sobre el solicitante

REGLA 2 — Capital de trabajo general
SI necesidad = capital_trabajo
   Y antiguedad_meses >= 12
   Y monto_requerido ENTRE 50000 Y 6000000
ENTONCES primaria = KONFIO
   ALTERNATIVA = KAPITAL (si el usuario prioriza respaldo bancario sobre costo)

REGLA 3 — Gasto operativo recurrente
SI necesidad = gasto_operativo
   O el usuario describe viáticos, suscripciones, compras de insumos, gasto de equipo
ENTONCES primaria = CLARA
   ALTERNATIVA = KLAR_EMPRESARIAL (si busca algo más simple, sin plataforma de gestión)
   NOTA: no es dinero en efectivo, es línea de gasto con tarjeta

REGLA 4 — Ecosistema de pagos
SI procesador_pagos = mercado_pago
ENTONCES agregar MERCADO_CREDITO como opción de conveniencia
   ADVERTENCIA obligatoria: es de las opciones más caras del catálogo (ver ficha)

REGLA 5 — Monto alto / activo fijo
SI monto_requerido > 5000000
   O necesidad EN (activo_fijo, expansion)
ENTONCES primaria = COVALTO
   ALTERNATIVA = banca tradicional (ver sección 7)

REGLA 6 — Negocio joven o informal
SI antiguedad_meses < 12 O figura_fiscal = informal
ENTONCES ninguna fintech de este catálogo aplica.
   Redirigir a: programas de gobierno (NAFIN, FINABIEN, fondos estatales — en Jalisco: FOJAL),
   microcrédito, o regularización fiscal como PFAE ante el SAT como primer paso.

REGLA 7 — Buró comprometido
SI buro_estatus = moroso
ENTONCES advertir que la aprobación es improbable en todo el catálogo.
   Excepción parcial: XEPELIN, porque el análisis pesa sobre el pagador de la factura.
   Sugerir primero regularizar antes de aplicar, para no acumular consultas.
```

**Regla de presentación:** nunca devuelvas más de 3 opciones. Si dos reglas empatan, ordena por menor CAT.

---

## 3. Fichas de proveedores

Cada ficha usa el mismo esquema para permitir parseo uniforme.

---

### 3.1 KONFIO

```yaml
id: konfio
nombre: Konfío
tipo_producto: [credito_simple, linea_revolvente, tarjeta_empresarial, tpv]
figura_legal: SOFOM ENR
licencia_bancaria: en_tramite   # solicitada a finales de 2023, etapa final ante CNBV
respaldo_deuda: [Goldman Sachs, JPMorganChase, Afore Sura]
respaldo_capital: [SoftBank, IFC, QED Investors, Citi, Goldman Sachs, Quona Capital]
monto_lineas_credito_institucionales_mxn: 7422000000
certificaciones_publicas: ninguna_publicada
proteccion_ipab: false
monto_min_mxn: 50000
monto_max_mxn: 6000000
plazo_max_meses: 24
tasa_desde_mensual: 0.017
cat_referencial: 0.43
comision_apertura: 0.01
comision_disposicion_primer_credito: 0.05
comision_disposicion_recurrente: 0.035
comision_administracion_mensual_mxn: 250
tiempo_aprobacion: "minutos a 48 horas"
requiere_garantia: false
requiere_aval: false
antiguedad_minima_meses: 12
edad_minima_solicitante: 26
acepta_pfae: true
consulta_buro: true   # Buró de Crédito y Círculo de Crédito
```

**Datos que pide el formulario:** RFC de facturación, contraseña CIEC del SAT, identificación oficial del solicitante, datos de la empresa, CLABE de depósito, autorización de consulta a buró.

**Base de autorización:** analiza tu facturación registrada ante el SAT para determinar el monto. No exige facturación mínima. Consulta buró, pero una deuda pequeña que no comprometa la salud financiera del negocio no descalifica automáticamente.

**Beneficios para negocios:** acepta PFAE que la banca suele rechazar; no pide garantía hipotecaria; ecosistema de crédito + tarjeta empresarial + terminal de pago.

**Riesgos y contras:** costo alto por comisión de disposición del 5% en el primer crédito; cobro mensual de administración; usuarios reportan cobranza agresiva ante atrasos con intereses moratorios que escalan rápido.

**Nota prospectiva:** si obtiene la licencia bancaria, su objetivo declarado es bajar el costo de captación y trasladarlo al cliente, lo que debería mejorar sus tasas. Vale la pena revisar sus condiciones cada trimestre.

**Recomendar cuando:** `necesidad = capital_trabajo`, negocio formal con 12+ meses facturando, que necesita efectivo rápido sin garantías.

---

### 3.2 XEPELIN

```yaml
id: xepelin
nombre: Xepelin
tipo_producto: [factoraje, credito_simple, confirming]
figura_legal: SOFOM ENR
licencia_bancaria: sofipo_en_tramite   # esperada durante 2026
respaldo_deuda: [Goldman Sachs, AGF chilenas, fondos de pensiones]
respaldo_capital: [Avenir, Kaszek, PayPal Ventures, Wellington Management, DST Global, Battery Ventures, Endeavor Catalyst, Nazca Ventures]
linea_goldman_usd: 140000000
certificaciones_publicas: ninguna_publicada
proteccion_ipab: false
anticipo_maximo_factura: 0.80
costo_mensual_rango: [0.015, 0.03]
costo_registro: 0
tiempo_aprobacion: "menos de 48 horas"
requiere_garantia: false
requiere_aval: false
antiguedad_minima_meses: 12
acepta_pfae: false   # requiere persona moral constituida
consulta_buro: true
alerta_solidez: "valuación ajustada de ~USD 720M a ~USD 400M en ronda puente (enero 2026)"
```

**Datos que pide el formulario:** registro en el sitio, vinculación de la cuenta del SAT; puede solicitar CIEC, autorización de buró y datos del representante legal. Luego se cargan documentos y su equipo los revisa.

**Base de autorización — la diferencia clave:** evalúa la solvencia de tus clientes, no solo la tuya. El análisis pesa sobre el pagador de la factura. Un negocio pequeño que factura a corporativos puntuales califica mejor que uno grande con clientes morosos.

**Beneficios para negocios:** no genera deuda nueva, adelanta cobranza propia; crear cuenta, vincular información y analizar la empresa no tiene costo — solo se paga al usar financiamiento; incluye confirming para pagar a proveedores.

**Riesgos y contras:** requiere persona moral, deja fuera a PFAE; el ajuste de valuación de 2026 y el retraso de su licencia SOFIPO son señales de contexto a considerar en solidez de largo plazo, aunque no afectan un crédito ya dispuesto.

**Recomendar cuando:** `modelo_venta = b2b_credito` con plazos de 30/60/90 días y clientes corporativos.

---

### 3.3 CLARA

```yaml
id: clara
nombre: Clara
tipo_producto: [tarjeta_corporativa, gestion_gastos, pagos_spei_financiados, pagos_internacionales]
razon_social: "CF TECH, S.A. de C.V., SOFOM E.N.R."
figura_legal: SOFOM ENR
autorizacion: "CNBV + registro CONDUSEF"
respaldo_deuda: [Goldman Sachs, IFC, Covalto, BBVA Spark, General Catalyst]
linea_goldman_usd: 150000000
capacidad_deuda_total_usd: 250000000
respaldo_capital: [Goldman Sachs, Citi, GGV Capital]
certificaciones_publicas: [SOC 2 Type II, ISO 27001, PCI DSS 4.0]
red_tarjeta: Mastercard
proteccion_fraude: "nivel World Elite"
proteccion_ipab: false
costo_emision: 0
costo_mantenimiento: 0
dias_financiamiento: 40
tiempo_aprobacion: "hasta 48 horas"
emision_tarjeta_virtual: "instantánea"
emision_tarjeta_fisica_dias_habiles: [4, 10]
requiere_aval_personal: false
impacta_buro_personal: false
acepta_pfae: true
```

**Datos que pide el formulario:** el representante legal o un administrador autorizado completa la solicitud inicial. Después, finanzas emite las tarjetas del equipo desde la plataforma. Existe flujo específico de alta para persona física con actividad empresarial.

**Base de autorización:** evalúa las finanzas de la empresa, no el crédito personal de los socios. El límite se asigna según evaluación financiera y se ajusta conforme la empresa crece.

**Beneficios para negocios:** tarjetas físicas y virtuales ilimitadas dentro de la línea aprobada, con límite configurable por persona o área; cumplimiento fiscal nativo con SAT; conciliación con ERP configurable en menos de una hora; migración desde otra plataforma típicamente en una semana.

**Es la única del catálogo con certificaciones de seguridad verificables.** Reportes completos de auditoría disponibles bajo NDA a través de su Trust Center. Si el usuario prioriza seguridad de datos, esta es la respuesta.

**Riesgos y contras:** no entrega efectivo. No sirve para capital de trabajo, nómina en efectivo ni pago a proveedores que no acepten tarjeta (aunque sí financia SPEI).

**Recomendar cuando:** `necesidad = gasto_operativo`, control de gasto de equipo, viáticos, suscripciones, compras recurrentes.

---

### 3.4 KAPITAL

```yaml
id: kapital
nombre: Kapital
tipo_producto: [credito_pyme, banca_empresarial, tesoreria, inversion, factoraje]
figura_legal: "Institución de banca múltiple"
licencia_bancaria: si   # vía adquisición de Banco Autofin en 2023
adquisiciones: [Banco Autofin (2023), activos de Intercam]
valuacion_usd: 1350000000
activos_mxn: 52984000000   # cierre noviembre 2025
ranking_activos_nacional: 29
certificaciones_publicas: ninguna_publicada
marco_regulatorio: "Circular Única CNBV"
proteccion_ipab: true
cat_ejemplo: 0.583   # sin IVA
cat_ejemplo_supuestos: "crédito de $200,000 MXN a 36 meses, comisión de apertura 3%"
comision_apertura: 0.03
seguro_vida_mxn_por_millar: 11.99
fecha_calculo_cat: "2026-07-01"
```

**Base de autorización:** modelos automatizados de evaluación de riesgo con IA.

**Beneficios para negocios:** es banco regulado con protección IPAB en depósitos; permite concentrar banca, crédito y tesorería en un solo proveedor; publica su CAT de forma transparente.

**Riesgos y contras:** CAT elevado (58.3% sin IVA en su ejemplo publicado). Además, adquirió activos de Intercam, institución señalada por el Departamento del Tesoro de EE.UU. por presunto lavado de dinero; Kapital afirma trabajar con autoridades mexicanas y estadounidenses para garantizar cumplimiento. **El agente debe mencionar este contexto si el usuario pregunta por seguridad o reputación**, sin presentarlo como una acusación contra Kapital.

**Recomendar cuando:** el usuario prioriza respaldo institucional y protección IPAB sobre costo, o quiere consolidar banca y crédito.

---

### 3.5 KLAR EMPRESARIAL

```yaml
id: klar_empresarial
nombre: Klar Empresarial
tipo_producto: [tarjeta_credito_empresarial]
figura_legal: "SOFIPO (Sociedad Financiera Popular)"
licencia_bancaria: en_tramite
certificaciones_publicas: ninguna_publicada
proteccion_ipab: false   # cubierta por el fondo de protección de SOFIPOs
linea_max_mxn: 5000000
dias_sin_intereses: 40
red_tarjeta: Mastercard
uso: [comercio_fisico, comercio_digital, cajeros_mexico, cajeros_extranjero]
tiempo_aprobacion: "respuesta inmediata"
```

**Datos que pide el formulario:** solicitud 100% digital, sin papeleo ni sucursales.

**Beneficios para negocios:** tarjetas adicionales para tarjetahabientes autorizados con control de gasto y reporte individual por estado de cuenta; separa gastos personales de los del negocio; disposición en cajeros.

**Recomendar cuando:** el usuario quiere una tarjeta empresarial simple con línea amplia, sin necesitar la plataforma de gestión de gastos que ofrece Clara.

---

### 3.6 MERCADO CRÉDITO

```yaml
id: mercado_credito
nombre: Mercado Crédito (Mercado Pago)
tipo_producto: [prestamo_vendedores]
figura_legal: SOFOM
grupo: Mercado Libre
certificaciones_publicas: ninguna_publicada
proteccion_ipab: false
monto_max_mxn: 6000000
plazo_max_meses: 24
tasa_anual_promedio_publicada: 0.821
comision_anual: 0
requisito_ecosistema: true
formulario: "ninguno — oferta preautorizada en la cuenta"
```

**Base de autorización:** completamente automática. El monto se calcula con base en el historial de ventas y el uso de la plataforma, y la oferta se activa desde la propia cuenta. No hay documentos que entregar.

**Beneficios para negocios:** cero fricción, sin papeleo, fondos inmediatos.

**Riesgos y contras:** es de las opciones más caras del catálogo. **El agente debe siempre mostrar la tasa anual promedio publicada de 82.1% junto a la recomendación**, nunca presentarla solo como "rápido y sin trámites".

**Recomendar cuando:** `procesador_pagos = mercado_pago` y `urgencia = inmediata`. Fuera del ecosistema, no aplica.

---

### 3.7 COVALTO

```yaml
id: covalto
nombre: Covalto (antes Credijusto)
tipo_producto: [credito_estructurado]
figura_legal: banco
licencia_bancaria: si
proteccion_ipab: true
monto_min_mxn: 500000
monto_max_mxn: 100000000
plazo_max_meses: 60
certificaciones_publicas: ninguna_publicada
```

**Notas:** aparece también del lado financiador de otras fintech (participó en el financiamiento estructurado de Clara). Proceso más parecido al bancario que al fintech.

**Recomendar cuando:** `monto_requerido > 5000000` o necesidades de activo fijo y expansión.

---

## 4. Tabla comparativa rápida

| Proveedor | Producto | Montos MXN | Costo indicativo | Figura | Respaldo | Certificaciones | IPAB |
|---|---|---|---|---|---|---|---|
| Konfío | Crédito / línea | 50k – 6M | desde 1.7% mensual; CAT ref. 43% | SOFOM ENR (licencia bancaria en trámite) | Goldman, JPMorgan, Citi, Afore Sura | — | No |
| Xepelin | Factoraje / crédito | hasta 80% de facturas | 1.5%–3% mensual | SOFOM ENR (SOFIPO en trámite) | Goldman, PayPal Ventures | — | No |
| Clara | Tarjeta + gastos | Línea evaluada | Sin costo de emisión; 40 días | SOFOM ENR (aut. CNBV) | Goldman, Citi, IFC, BBVA Spark | SOC 2 II, ISO 27001, PCI DSS 4.0 | No |
| Kapital | Crédito + banca | Línea a medida | CAT 58.3% sin IVA (ejemplo) | Banco múltiple | Compró Banco Autofin | — | Sí |
| Klar | Tarjeta empresarial | hasta 5M | 40 días sin intereses | SOFIPO | — | — | Fondo SOFIPO |
| Mercado Crédito | Préstamo | hasta 6M | 82.1% anual promedio | SOFOM | Grupo Mercado Libre | — | No |
| Covalto | Crédito estructurado | 500k – 100M | Caso por caso | Banco | — | — | Sí |

---

## 5. Cómo estimar el monto autorizable

El agente puede calcular un **rango orientativo**, nunca una cifra exacta. Siempre presentarlo como estimación.

```
CREDITO SIMPLE / LINEA DE CAPITAL DE TRABAJO
  estimado_bajo  = facturacion_anual * 0.10
  estimado_alto  = facturacion_anual * 0.25
  # equivalente: entre 1 y 3 meses de ventas promedio

FACTORAJE
  estimado = valor_facturas_por_cobrar * anticipo
  # anticipo típico de mercado: 0.80 a 0.95
  # Xepelin: hasta 0.80

TARJETA CORPORATIVA
  no estimable por fórmula — se asigna por evaluación financiera de la empresa

CAPACIDAD DE PAGO (filtro previo)
  ratio = flujo_libre_mensual / pago_mensual_estimado
  SI ratio < 1.25 ENTONCES advertir que probablemente reduzcan el monto solicitado
```

**Topes duros:** ninguna estimación puede superar el `monto_max_mxn` de la ficha del proveedor.

**Acciones que el agente debe sugerir para afinar la estimación:**
- Precalificar sin costo en varios proveedores en paralelo (Xepelin no cobra por registro ni análisis).
- Usar los simuladores públicos de los proveedores que los tengan.
- Consultar el reporte de crédito empresarial en Buró de Crédito o Círculo de Crédito antes de aplicar — es la misma información que verá el prestamista.

---

## 6. Criterios de autorización — checklist de precalificación

Las fintech aprueban en 24 a 72 horas porque analizan CFDI, movimientos bancarios y datos del SAT en tiempo real, contra 15 a 45 días hábiles de la banca tradicional.

Variables que pesan, en orden de importancia:

1. **Volumen y consistencia de facturación** de los últimos 12 meses (CFDI emitidos).
2. **Antigüedad operativa** — el piso del catálogo es 12 meses.
3. **Calidad y concentración de clientes** — decisivo en factoraje.
4. **Buró de Crédito y Círculo de Crédito** del negocio y de los socios.
5. **Comportamiento transaccional en la plataforma**, cuando aplica (Mercado Crédito).
6. **Cumplimiento fiscal** — opinión de cumplimiento positiva, no aparecer en listas del artículo 69-B.

**Documentos comunes a casi todo el catálogo:** RFC, CIEC del SAT, autorización de buró, identificación del representante legal, comprobante de domicilio, acta constitutiva y poderes (persona moral), estados de cuenta bancarios de 3 a 12 meses, CLABE.

---

## 7. Semáforo de seguridad regulatoria

**Aclaración crítica que el agente debe hacer siempre:** la ausencia de protección IPAB **no es un riesgo cuando pides prestado**, solo cuando depositas dinero. No presentes a las SOFOM como inseguras por este motivo si el usuario solo va a solicitar crédito.

| Nivel | Figura | Significado |
|---|---|---|
| Verde | Banco múltiple (Kapital, Covalto) | Supervisión CNBV, Circular Única, IPAB en depósitos |
| Verde-amarillo | SOFIPO (Klar) | Regulada, con fondo de protección propio |
| Amarillo | SOFOM ENR (Konfío, Xepelin, Clara, Mercado Crédito) | Legal y registrada ante CONDUSEF; "no regulada" se refiere solo a que no la supervisa la CNBV en materia prudencial. Sujeta a obligaciones PLD/FT |
| Rojo | No aparece en SIPRES | No usar |

**Pasos de verificación que el agente debe incluir en toda recomendación:**

1. Buscar la **razón social exacta** en el SIPRES de CONDUSEF (`https://webapps.condusef.gob.mx/SIPRES/jsp/pub/index.jsp`) y confirmar que aparezca activa. Usar el nombre fiscal, no el comercial.
2. Exigir contrato por escrito con **CAT y tabla de amortización**.
3. Conocer todas las comisiones antes de firmar.
4. Recordar el **derecho de cancelación dentro de los primeros 10 días hábiles sin penalización**.
5. Confirmar que la entidad tenga UNE (Unidad Especializada de Atención a Usuarios).

---

## 8. Descalificadores — cuándo NO recomendar

```
NO recomendar NINGUNA fintech de este catálogo si:
  - antiguedad_meses < 12
  - figura_fiscal = informal
  - opinion_cumplimiento_sat = negativa
  → redirigir a programas de gobierno o regularización fiscal

NO recomendar XEPELIN si:
  - figura_fiscal != persona_moral
  - modelo_venta no genera cuentas por cobrar

NO recomendar KONFIO si:
  - edad_solicitante < 26 y no hay socio que pueda solicitar
  - buro_estatus = moroso

NO recomendar MERCADO_CREDITO si:
  - procesador_pagos != mercado_pago

NO recomendar CLARA ni KLAR si:
  - necesidad = capital_trabajo y el usuario necesita efectivo, no línea de gasto

NO recomendar deuda en absoluto si:
  - el usuario describe el crédito para cubrir un déficit operativo recurrente
  → sugerir primero: renegociar plazos con proveedores, factoraje de cartera existente,
    o revisar la estructura de costos. Es más barato que endeudarse.
```

---

## 9. Plantilla de respuesta al usuario

```
[1] Diagnóstico en una frase
    "Por tu perfil — {figura_fiscal}, {antiguedad_meses} meses operando,
     {modelo_venta} — tu necesidad se parece más a {necesidad}."

[2] Recomendación primaria
    Proveedor + por qué encaja + monto estimado + costo indicativo con fecha del dato

[3] Una o dos alternativas
    Con el trade-off explícito (más barato pero más lento, más rápido pero más caro)

[4] Estimación de monto
    "Con una facturación anual de ${X}, un rango típico de autorización estaría
     entre ${X*0.10} y ${X*0.25}. Es una estimación, no una oferta."

[5] Pasos de verificación
    SIPRES + CAT por escrito + comisiones + derecho de cancelación a 10 días

[6] Cierre
    "Datos vigentes a {fecha_de_datos}; verifícalos con el proveedor.
     Esto es información, no asesoría financiera."
```

---

## 10. Alternativas fuera del catálogo fintech

Para negocios que no califican o que buscan menor costo:

- **Banca tradicional:** BBVA, Santander, Banorte, HSBC. Ejemplo de referencia: crédito PyME de BBVA de $50,000 a $15,000,000 con CAT promedio ponderado de 18.5% sin IVA, pero exige ventas anuales mínimas de $5,000,000 y 4 años de antigüedad (2 años si ya es cliente). Mucho más barato, mucho más exigente.
- **Banca de desarrollo:** NAFIN, Bancomext, FINABIEN (Crédito a la Palabra de $25,000).
- **Fondos estatales:** en Jalisco, FOJAL. En CDMX, FONDESO.
- **Marketplaces de financiamiento:** permiten recibir propuestas de varios aliados financieros con una sola solicitud.

---

## 11. Glosario para respuestas al usuario

- **CAT:** Costo Anual Total. Incluye tasa, comisiones y seguros. Es la única métrica válida para comparar créditos.
- **CFDI:** factura electrónica. Es la base del análisis de casi todas las fintech.
- **CIEC:** contraseña del SAT que permite al prestamista leer tu facturación.
- **SOFOM ENR:** Sociedad Financiera de Objeto Múltiple, Entidad No Regulada. Puede prestar, no puede captar ahorro.
- **SOFIPO:** Sociedad Financiera Popular. Regulada por CNBV, puede captar ahorro, con fondo de protección propio.
- **Factoraje:** adelantar el cobro de facturas ya emitidas. No es deuda nueva.
- **Confirming:** financiar el pago a tus proveedores.
- **SIPRES:** registro público de CONDUSEF donde se verifica que una financiera opera legalmente.

---

## 12. Vigencia y mantenimiento

- **Datos capturados:** 2026-08-29.
- **Revalidar cada 90 días:** montos máximos, tasas, CAT, comisiones y estatus de licencias.
- **Cambios previsibles en el corto plazo:**
  - Konfío podría obtener licencia bancaria (etapa final ante CNBV) → revisar mejoras de tasa.
  - Xepelin espera resolución de su licencia SOFIPO durante 2026.
  - Klar inició proceso de licencia bancaria.
- **Cómo actualizar:** verificar en el sitio oficial de cada proveedor y en SIPRES; los CAT publicados incluyen fecha de cálculo, úsala como referencia de frescura.

**Descargo:** este documento es material informativo para orientar sugerencias. No constituye asesoría financiera ni recomendación de contratación. Todos los créditos están sujetos a aprobación del otorgante.
