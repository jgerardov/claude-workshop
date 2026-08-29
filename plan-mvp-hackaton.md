# MVP hackatón (2h): asesor financiero/fiscal IA para PyMEs — plan de ejecución

> Plan de arquitectura y ejecución para el equipo. Aún no ejecutado — pendiente de que alguien lo tome y construya. Basado en la investigación ya consolidada en este repo.

## Flujo de negocio: qué demuestra este MVP y qué no

El producto completo, tal como quedó planteado, tiene 5 pasos conceptuales:

1. **Entender el negocio**
2. **Integraciones con fuentes de datos**
3. **Análisis de los números**
4. **Asistencia financiera, fiscal y de financiamiento**
5. **Integraciones con fintechs y SAT para fuentes de información**

Un MVP de 2 horas no puede construir los 5 de verdad. Esta es la lectura honesta de qué se demuestra en vivo, qué se simula, y qué queda completamente fuera — para que el equipo entienda el concepto de negocio antes de leer los detalles técnicos de abajo:

| # | Paso | En este MVP |
|---|---|---|
| 1 | Entender el negocio | ✅ **Real, de punta a punta.** El onboarding pregunta giro y números clave y arma el perfil del negocio. |
| 2 | Integraciones con fuentes de datos | ⚠️ **Simulado.** Pantalla de "Sincronizando con Google Sheets" con apariencia real, sin ninguna API conectada. |
| 3 | Análisis de los números | ✅ **Real, de punta a punta.** Un motor de reglas determinista calcula régimen fiscal, alertas del giro y recomendación de financiamiento a partir del perfil. |
| 4 | Asistencia financiera, fiscal y de financiamiento | ✅ **Real, de punta a punta.** La vista de resultados y el chat con el asesor de IA responden con las conclusiones reales del análisis. |
| 5 | Integraciones con fintechs y SAT | ⚠️ **Simulado.** Pantallas de "Verificando ante el SAT" (incluye descarga simulada de CFDI de los últimos 12 meses) y "Consultando pre-aprobación con {proveedor}" con apariencia real, sin ninguna API conectada. |

**Por qué CFDI específicamente.** `investigacion/03-fuentes-de-datos-mexico.md` identifica al CFDI como **"la fuente ancla"** (§5.1, hallazgo 2): es la única fuente universal, obligatoria y estandarizada del país, ya viene clasificada con un catálogo oficial de más de 55,000 claves, y **alimenta 6 de los 8 componentes de la solución** — más que cualquier otra fuente del catálogo (§6). Es, con evidencia, la integración de mayor apalancamiento del producto completo. Por eso el mock del SAT no se queda solo en "Constancia de Situación Fiscal" y "Opinión de cumplimiento": incluye una línea de CFDI que sustenta los `ingresos_anuales` y `gastos_deducibles_anuales` que el usuario ya declaró, presentándolos como si vinieran de sus facturas reales — sin inventar un número distinto al que ya se capturó. La integración real al Web Service de Descarga Masiva del SAT sigue fuera de alcance del MVP por la misma razón que el resto de §5: requiere e.firma (el mayor riesgo legal identificado en la decisión 8.1) o un agregador pagado sin tarifa cotizada (Belvo).

**Por qué se recortó así:** el punto que realmente prueba la tesis del producto — que la investigación del equipo se puede convertir en un asesor que entiende un negocio y da una recomendación fiscal/financiera correcta y conversable — son los pasos 1, 3 y 4. Esos son 100% reales. Los pasos 2 y 5 son integraciones de infraestructura (Google Sheets, SAT, fintechs) que no cambian si la recomendación es correcta o no, y son costosas de construir de verdad en 2h (credenciales de Google Cloud, e.firma o agregador pagado para el SAT, contratos/API keys de cada fintech). Para que el jurado vea el *concepto de producto completo* — no solo el análisis y el chat, sino la promesa de automatización — los tres (Sheets, SAT, fintechs) se simulan visualmente como una sola secuencia de "integrando tus datos" inmediatamente después del onboarding. Ningún dato mostrado en esa simulación se inventa: el mock del SAT reutiliza lo que el usuario ya declaró en el formulario, y el mock de fintechs reutiliza el monto que ya calculó el motor de análisis — solo se presentan como si vinieran de una consulta externa.

## Contexto

El equipo acumuló investigación real en este repo (journey map de financiamiento, taxonomía de giros SAT/SCIAN, estrategias fiscales por rubro, y sobre todo `fintech.md` — un motor de reglas de ruteo a fintechs casi listo para productizar) pero no hay código de aplicación todavía. El objetivo es demostrar en un hackatón de **2 horas** que esa investigación se puede convertir en un producto: el usuario entra, responde preguntas sobre su giro y sus números, el sistema simula automatizar sus fuentes de datos (SAT, Google Sheets, fintechs), genera un análisis financiero/fiscal concluyente, y despierta un asesor de IA en chat que dialoga sobre ese análisis.

Con solo 2 horas, el criterio rector es **caja turca**: construir de verdad la parte que es el diferenciador (entender el negocio, generar un análisis correcto basado en las reglas ya documentadas, y conversar con un asesor de IA que las respeta), y simular de forma convincente la parte que no es el punto de la demo pero es costosa de construir de verdad (SAT, Google Sheets, APIs de fintechs — las tres requieren credenciales, contratos o infraestructura que no se resuelven en 2h). Decisiones ya confirmadas: sin autenticación, sin ninguna integración externa real (SAT/Sheets/fintechs — las tres mockeadas), código en `app/` en la raíz del repo, alcance de 3 giros y 4 fintechs.

## Alcance y qué NO se construye

- **Sin auth, sin base de datos.** Todo el estado vive en memoria de React durante la sesión del navegador. No hay Supabase, no hay persistencia entre recargas.
- **Sin ninguna integración externa real.** SAT, Google Sheets y las APIs de las 4 fintechs se simulan visualmente en una sola secuencia de pantallas — cero llamadas de red a servicios externos, cero riesgo de fallo de credenciales en vivo.
- **Una sola página** (`app/page.tsx`) con una máquina de estados simple por pasos (`onboarding → mock-integraciones → resultados → chat`), sin enrutado entre páginas. Es la opción más rápida de construir y de la que menos se puede romper en 2h.
- **Sin shadcn/ui, sin Zustand, sin TanStack Query.** Solo Tailwind utilities + `useState`/`useReducer` de React. Nada de esto es necesario para una demo de una sesión.
- **Sin streaming** en el chat — request/response simple contra la API de Anthropic. Menos superficie de fallo.

## Modelo de datos del perfil (en memoria, un solo objeto)

Basado literalmente en `fintech.md` §1, recortado a lo que los 3 giros y 4 reglas de financiamiento necesitan, más los campos fiscales mínimos de `estrategias-fiscales-por-rubro-mexico.md` §1 y `giros-de-negocio-sat.md`:

```ts
type Perfil = {
  giro: 'comercio' | 'restaurante' | 'servicios_profesionales'
  figura_fiscal: 'PFAE' | 'persona_moral' | 'informal'
  antiguedad_meses: number
  ingresos_anuales: number
  gastos_deducibles_anuales: number
  modelo_venta: 'b2b_credito' | 'b2b_contado' | 'b2c_mostrador' | 'ecommerce'
  necesidad: 'capital_trabajo' | 'liquidez_cartera' | 'gasto_operativo' | 'activo_fijo'
  monto_requerido: number
  procesador_pagos: 'mercado_pago' | 'clip' | 'otro' | 'ninguno'
  dias_credito_otorgado?: number       // solo si modelo_venta = b2b_credito
  vende_por_plataforma_digital?: 'rappi_didi_ubereats' | 'marketplace' | 'ninguno'
  rfc_registrado_en_plataforma?: boolean
  buro_estatus: 'limpio' | 'atrasos_menores' | 'moroso' | 'desconocido'
  opinion_cumplimiento_sat?: 'positiva' | 'negativa' | 'desconocida'   // default 'positiva' en la demo — la usa el mock del SAT
}
```

## Motor de análisis (`lib/analysis.ts`) — puro, sin LLM, determinista

Reglas copiadas/adaptadas literalmente de los documentos, no reinventadas:

1. **Régimen fiscal recomendado** — `estrategias-fiscales-por-rubro-mexico.md` §1: RESICO PF si `ingresos_anuales <= 3,500,000`; si los `gastos_deducibles_anuales` son altos relativo a ingresos, sugerir comparar contra Régimen de Actividades Empresariales y Profesionales (§3, la heurística de "¿tus deducciones reales superan el ahorro de la tasa reducida?").
2. **Alertas fiscales por giro** (tabla fija de 3 entradas, `estrategias-fiscales-por-rubro-mexico.md` §2):
   - `comercio`: costo de lo vendido vs. costo de compras; retención 2.5% ISR si vende por plataforma digital.
   - `restaurante`: IVA 16% siempre en alimento preparado (nunca 0% "para llevar"); si `vende_por_plataforma_digital` y `rfc_registrado_en_plataforma`, retención 2.1% ISR + 8% IVA, si no, 20%/16%.
   - `servicios_profesionales`: RESICO tributa sobre flujo de cobro, no facturación; retención 2.5% si opera por plataforma.
3. **Financiamiento** — árbol de `fintech.md` §2, solo Reglas 1, 2, 3, 4 (Xepelin/factoraje, Konfío/capital de trabajo, Clara/gasto operativo, Mercado Crédito/ecosistema), con los **descalificadores duros de §8** evaluados primero (si `antiguedad_meses < 12` o `figura_fiscal = informal` → ninguna fintech, redirigir a NAFIN/FOJAL; si `buro_estatus = moroso` → advertencia, solo Xepelin como excepción parcial).
4. **Estimación de monto** — fórmulas literales de §5 (`ingresos_anuales * 0.10` a `* 0.25` para crédito simple).
5. **Salida siempre incluye el disclaimer de la plantilla §9 [6]** y el paso de verificación SIPRES de §7.

## Flujo de la UI (un solo archivo `app/page.tsx` + componentes de sección)

1. **Onboarding** — un formulario en una sola pantalla con los campos de `Perfil` agrupados (no wizard multi-paso, para ahorrar tiempo de construcción de navegación entre pasos). Selects para los enums (giro limitado a 3 opciones, resto de catálogos de `fintech.md`).
2. **Mock de integraciones (SAT + Sheets + fintechs)** — al enviar el formulario, primero se corre el motor de análisis (silencioso, en memoria) para tener ya calculados régimen, alertas y ruta de financiamiento; luego se muestra **una sola pantalla** con un checklist que va marcando 3 pasos en secuencia, ~1-2s cada uno:
   - `Verificando RFC ante el SAT...` → ✓ Constancia de Situación Fiscal — Régimen: `{figura_fiscal}` · ✓ Opinión de cumplimiento: `{opinion_cumplimiento_sat}` · ✓ No aparece en listas del artículo 69-B · ✓ 12 meses de CFDI descargados — Ingresos facturados: `{ingresos_anuales}` · Gastos con CFDI: `{gastos_deducibles_anuales}`
   - `Sincronizando con Google Sheets...` → tabla tipo hoja de cálculo con los campos del perfil ya llenos
   - `Consultando pre-aprobación con {proveedor primario}...` → ✓ Rango estimado: `${estimado_bajo} – ${estimado_alto}` MXN (el mismo número que ya calculó el motor de análisis, no uno nuevo)

   Sin llamadas de red reales en ninguno de los 3. Los 3 pasos viven en **un solo componente reutilizable** parametrizado por una lista `{ titulo, resultado }[]`, no en tres componentes distintos — construirlo una vez y pasarle 3 configuraciones es más barato que tres pantallas separadas.
3. **Resultados** — tarjetas/secciones con: diagnóstico en una frase, régimen fiscal recomendado + alertas del giro, recomendación de financiamiento (primaria + 1-2 alternativas + monto estimado + semáforo regulatorio + verificación SIPRES + disclaimer).
4. **Chat asesor** — botón "Hablar con tu asesor" que revela un panel de chat. Cada mensaje del usuario dispara un fetch a `app/api/chat/route.ts`.

## Chat asesor (`app/api/chat/route.ts`)

- Recibe `{ perfil, analisis, mensajes }` del cliente en cada request (sin persistencia de servidor).
- System prompt = transcripción resumida de las reglas de `fintech.md` §0 (no inventar cifras, marcar que los datos son de esta sesión, sugerir no decidir, comparar CAT no tasa, verificación SIPRES obligatoria) + el JSON de `perfil` y `analisis` ya calculado, inyectados como contexto.
- Llamada no-streaming al SDK de Anthropic (`@anthropic-ai/sdk`), modelo Claude, respuesta completa devuelta como JSON.
- Cada respuesta relacionada a financiamiento debe cerrar recordando el disclaimer (reforzado en el propio system prompt).

## Archivos a crear

```
app/
  page.tsx                 # máquina de estados de los 4 pasos, todo el árbol de UI
  api/chat/route.ts        # única ruta de servidor, llamada a Anthropic
  globals.css              # Tailwind
lib/
  analysis.ts              # motor de reglas puro (sección "Motor de análisis" arriba)
  types.ts                 # tipo Perfil + tipo Analisis de salida
  knowledge.ts             # constantes: fichas de los 4 proveedores (incluye tiempo_aprobacion, usado en el mock de fintechs), alertas fiscales por giro, texto del system prompt
components/
  OnboardingForm.tsx
  IntegracionesMock.tsx    # checklist genérico de 3 pasos: SAT, Sheets, fintech primaria
  ResultadosView.tsx
  ChatAsesor.tsx
```

No se tocan `README.md`, los `.md` de investigación, `investigacion/`, `plantillas/` ni `.claude/skills/`.

## Plan por bloques de tiempo (~140 min)

> Mockear 3 integraciones en vez de 1 empuja el tiempo real por encima del bloque original de 120 min. Si el hackatón es estrictamente 2h, aplicar de inmediato el primer corte de la lista de abajo (checklist sin animación gradual) para recuperar esos ~20 min.

| Bloque | Duración | Qué |
|---|---|---|
| Setup | 0:00–0:10 | `create-next-app` (TS + Tailwind + App Router), instalar `@anthropic-ai/sdk`, `.env.local` con `ANTHROPIC_API_KEY` |
| Motor de análisis | 0:10–0:35 | `lib/analysis.ts` + `lib/knowledge.ts` con las reglas de las 3 secciones arriba, sin UI todavía |
| Onboarding | 0:35–1:00 | `OnboardingForm.tsx` + wiring a `lib/analysis.ts` en el submit, guardado en estado de `page.tsx` |
| Mock integraciones | 1:00–1:20 | `IntegracionesMock.tsx` genérico + las 3 configuraciones (SAT, Sheets, fintech), transición fija, sin red |
| Resultados | 1:20–1:40 | `ResultadosView.tsx` renderizando la salida del motor |
| Chat | 1:40–2:05 | `api/chat/route.ts` + `ChatAsesor.tsx`, prueba de una pregunta real |
| Buffer/fix | 2:05–2:20 | Correr el golden path completo una vez, arreglar lo que truene |

**Qué cortar primero si falta tiempo (en este orden):** 1) animación secuencial del mock de integraciones (mostrar los 3 checks ya resueltos de inmediato, sin efecto paso a paso), 2) alternativas de financiamiento (mostrar solo la recomendación primaria), 3) un giro de los 3 (quedarse con comercio + restaurante), 4) el chat pasa de "conversación libre" a un solo botón "Explícame esta recomendación" con una sola llamada fija a Claude, 5) si aún falta tiempo, el mock de integraciones se recorta a solo Sheets + fintech (se cae el paso del SAT, que es el más nuevo y el menos crítico para la tesis del producto).

**Nunca cortar:** el motor de análisis determinista, la vista de resultados, y que el chat responda con datos reales del perfil (no genéricos) — es el corazón de la demo.

## Verificación end-to-end

Un único guion manual, corrido antes de mostrar la demo:

1. Perfil A — **comercio**, `antiguedad_meses=24`, `procesador_pagos=mercado_pago` → debe disparar Regla 4 (Mercado Crédito) y mostrar la advertencia obligatoria del 82.1% anual.
2. Perfil B — **restaurante**, `vende_por_plataforma_digital=rappi_didi_ubereats`, `rfc_registrado_en_plataforma=false` → debe mostrar la alerta de retención 20%/16% (no la de 2.1%/8%) y el IVA 16% del alimento preparado.
3. Perfil C — **servicios_profesionales**, `antiguedad_meses=6` → debe activar el descalificador duro de §8: ninguna fintech recomendada, redirección a NAFIN/FOJAL.
4. En cada uno: confirmar que el mock de integraciones muestra los 3 checks (SAT, Sheets, fintech) con datos que coinciden con el perfil y el análisis ya calculados (no números distintos a los de la vista de resultados), que la pantalla de resultados no contradice las reglas citadas arriba, y que el chat, al preguntarle "¿por qué me recomendaste esto?", cita el dato real del perfil (no inventa cifras) y cierra con el disclaimer.
5. Probar una pregunta del chat sin conexión/API key inválida para confirmar que muestra un error legible y no rompe la página.
