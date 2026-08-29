# MVP hackatón (2h): asesor financiero/fiscal IA para PyMEs — plan de ejecución

> Plan de arquitectura y ejecución para el equipo. Aún no ejecutado — pendiente de que alguien lo tome y construya. Basado en la investigación ya consolidada en este repo.

## Contexto

El equipo acumuló investigación real en este repo (journey map de financiamiento, taxonomía de giros SAT/SCIAN, estrategias fiscales por rubro, y sobre todo `fintech.md` — un motor de reglas de ruteo a fintechs casi listo para productizar) pero no hay código de aplicación todavía. El objetivo es demostrar en un hackatón de **2 horas** que esa investigación se puede convertir en un producto: el usuario entra, responde preguntas sobre su giro y sus números, el sistema "llena" automáticamente una fuente de datos tipo Google Sheets, genera un análisis financiero/fiscal concluyente, y despierta un asesor de IA en chat que dialoga sobre ese análisis.

Con solo 2 horas, el criterio rector es **caja turca**: construir de verdad la parte que es el diferenciador (entender el negocio, generar un análisis correcto basado en las reglas ya documentadas, y conversar con un asesor de IA que las respeta), y simular de forma convincente la parte que no es el punto de la demo pero es costosa de construir de verdad (integración real con Google Sheets API/OAuth). Decisiones ya confirmadas: sin autenticación, sin Google Cloud/Sheets API real (mock visual), código en `app/` en la raíz del repo, alcance de 3 giros y 4 fintechs.

## Alcance y qué NO se construye

- **Sin auth, sin base de datos.** Todo el estado vive en memoria de React durante la sesión del navegador. No hay Supabase, no hay persistencia entre recargas.
- **Sin integración real a Google Sheets.** Se simula visualmente (pantalla con estética de hoja de cálculo que se "llena" con las respuestas del usuario) — cero llamadas a Google API, cero riesgo de fallo de credenciales en vivo.
- **Una sola página** (`app/page.tsx`) con una máquina de estados simple por pasos (`onboarding → sheets-mock → resultados → chat`), sin enrutado entre páginas. Es la opción más rápida de construir y de la que menos se puede romper en 2h.
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
2. **Mock "Google Sheets"** — al enviar el formulario, transición de ~1-2 segundos a una pantalla con estética de hoja de cálculo (tabla con encabezado tipo Sheets, filas = campos del perfil ya llenos) y un texto tipo "Sincronizando con Google Sheets…" → "Listo". Sin llamadas de red reales.
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
  knowledge.ts             # constantes: fichas de los 4 proveedores, alertas fiscales por giro, texto del system prompt
components/
  OnboardingForm.tsx
  SheetsMock.tsx
  ResultadosView.tsx
  ChatAsesor.tsx
```

No se tocan `README.md`, los `.md` de investigación, `investigacion/`, `plantillas/` ni `.claude/skills/`.

## Plan por bloques de tiempo (120 min)

| Bloque | Duración | Qué |
|---|---|---|
| Setup | 0:00–0:10 | `create-next-app` (TS + Tailwind + App Router), instalar `@anthropic-ai/sdk`, `.env.local` con `ANTHROPIC_API_KEY` |
| Motor de análisis | 0:10–0:35 | `lib/analysis.ts` + `lib/knowledge.ts` con las reglas de las 3 secciones arriba, sin UI todavía |
| Onboarding | 0:35–1:05 | `OnboardingForm.tsx` + wiring a `lib/analysis.ts` en el submit, guardado en estado de `page.tsx` |
| Mock Sheets | 1:05–1:20 | `SheetsMock.tsx`, transición fija, sin red |
| Resultados | 1:20–1:40 | `ResultadosView.tsx` renderizando la salida del motor |
| Chat | 1:40–2:05 | `api/chat/route.ts` + `ChatAsesor.tsx`, prueba de una pregunta real |
| Buffer/fix | 2:05–2:15 | Correr el golden path completo una vez, arreglar lo que truene |

**Qué cortar primero si falta tiempo (en este orden):** 1) animación de la pantalla mock de Sheets (dejarla instantánea, sin transición), 2) alternativas de financiamiento (mostrar solo la recomendación primaria), 3) un giro de los 3 (quedarse con comercio + restaurante), 4) el chat pasa de "conversación libre" a un solo botón "Explícame esta recomendación" con una sola llamada fija a Claude.

**Nunca cortar:** el motor de análisis determinista, la vista de resultados, y que el chat responda con datos reales del perfil (no genéricos) — es el corazón de la demo.

## Verificación end-to-end

Un único guion manual, corrido antes de mostrar la demo:

1. Perfil A — **comercio**, `antiguedad_meses=24`, `procesador_pagos=mercado_pago` → debe disparar Regla 4 (Mercado Crédito) y mostrar la advertencia obligatoria del 82.1% anual.
2. Perfil B — **restaurante**, `vende_por_plataforma_digital=rappi_didi_ubereats`, `rfc_registrado_en_plataforma=false` → debe mostrar la alerta de retención 20%/16% (no la de 2.1%/8%) y el IVA 16% del alimento preparado.
3. Perfil C — **servicios_profesionales**, `antiguedad_meses=6` → debe activar el descalificador duro de §8: ninguna fintech recomendada, redirección a NAFIN/FOJAL.
4. En cada uno: confirmar que la pantalla de resultados no contradice las reglas citadas arriba, y que el chat, al preguntarle "¿por qué me recomendaste esto?", cita el dato real del perfil (no inventa cifras) y cierra con el disclaimer.
5. Probar una pregunta del chat sin conexión/API key inválida para confirmar que muestra un error legible y no rompe la página.
