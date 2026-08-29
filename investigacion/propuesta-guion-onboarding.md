# Propuesta · Guion de onboarding conversacional

> **Estado:** propuesta para revisión del equipo. No modifica código todavía.
> **Autora:** Cristina Astaiza · 29 de agosto de 2026
> **Afecta:** `components/onboarding/steps/*`, `components/fuentes/ConectarFuentes.tsx`, `lib/analysis.ts`
> **Alineada con:** [`guia-de-marca`](../guia-de-marca) · [`investigacion/03-fuentes-de-datos-mexico.md`](./03-fuentes-de-datos-mexico.md) · [`fintech.md`](../fintech.md) §8

---

## Por qué cambiar el onboarding actual

El formulario de hoy pide, entre otras cosas, **«Gastos deducibles anuales (MXN)»**.

Eso asume dos conocimientos que el usuario objetivo no tiene: saber qué gasto es deducible, y conocer su total anual. La investigación 03 documenta que **el 66.5 % de las microempresas no monitorea ningún indicador de su negocio** (ENAPROCE 2018). No es que lleve mal la cuenta: no la lleva.

**Un formulario que pide lo que el usuario no sabe le está pidiendo que haga el trabajo que el producto promete hacer por él.** Y contradice la regla principal de la marca: *Finanzza no le dice al usuario qué hacer con su dinero; le ayuda a entenderlo para que decida mejor.*

### Auditoría de la jerga actual

| Pregunta actual | Problema |
|---|---|
| «Gastos deducibles anuales» | No sabe qué es deducible **ni** cuánto suma al año |
| «Modelo de venta: B2C mostrador / B2B a crédito» | Jerga corporativa. Quien tiene una fonda no se describe como B2C |
| «Figura fiscal: PFAE / Persona moral» | Muchos no saben bajo qué régimen están dados de alta |
| «Antigüedad operando (meses)» | Nadie piensa su negocio en meses |
| «Capital de trabajo» / «Activo fijo» | Jerga financiera |
| «¿Tu opinión de cumplimiento ante el SAT es positiva?» | Jerga fiscal — y es un dato que se lee del SAT, no se pregunta |
| «Procesador de pagos» | Se dice «con qué cobras», no «procesador» |
| «Estatus en buró: Moroso» | Palabra estigmatizante en un producto que quiere acompañar |

Lo que ya está bien y conviene extender: los campos de buró y opinión de cumplimiento **ya ofrecen «No lo sé»**. El patrón correcto existe; solo no está aplicado en todas partes.

---

## Tres reglas de diseño

1. **Nunca preguntar lo que la fuente ya sabe.** El CFDI trae los gastos clasificados con más de 55 000 claves oficiales (investigación 03, §5.1). Preguntar cuáles son deducibles duplica un trabajo que el sistema ya hace mejor. → La pregunta de deducibles **se elimina**, no se reescribe.
2. **«No sé» es respuesta válida en todas las preguntas.** Y cada «no sé» se convierte en el motivo para conectar una fuente: *«No pasa nada, eso lo veo en tus facturas»*.
3. **Preguntar en la unidad que la persona maneja.** Nadie conoce su venta anual. Casi todos saben cuánto vendieron ayer.

**El orden también cambia:** primero la conversación, después las fuentes. La conversación es la que da la razón para conectar — no se pide una contraseña del SAT en frío, se pide para responder algo que el usuario acaba de preguntar.

---

## El guion

Cada pregunta es una pantalla con opciones tocables. Respuesta libre solo donde hay un número.

### 1 · ¿A qué se dedica tu negocio?

`Vendo productos` · `Vendo comida o bebida` · `Doy un servicio` · `Otra cosa`

> Sustituye «giro de negocio». Mapea a los tres giros del alcance del MVP.

### 2 · ¿Desde cuándo lo tienes?

`Menos de 6 meses` · `Entre 6 meses y un año` · `Entre 1 y 3 años` · `Más de 3 años`

> Sustituye «antigüedad en meses». El descalificador de los 12 meses (`fintech.md` §8) sigue funcionando: se toma el piso del rango.

### 3 · ¿Ya facturas?

`Sí, doy factura cuando me la piden` · `Todavía no, pero estoy dado de alta` · `No estoy dado de alta` · `No estoy seguro`

> Sustituye «figura fiscal». El régimen exacto se lee de la Constancia de Situación Fiscal al conectar el SAT. No se le pregunta al usuario algo que su constancia ya dice.

### 4 · ¿Quién te compra?

`Gente que llega a mi local` · `Otros negocios, y me pagan de inmediato` · `Otros negocios, y me pagan semanas después` · `Por internet o por apps`

> Sustituye B2C/B2B. La tercera opción es la que activa la ruta de factoraje (`fintech.md` §2, regla 1).

### 5 · ¿Cómo te pagan? *(se pueden marcar varias)*

`Efectivo` · `Terminal de tarjeta` · `Transferencia` · `Por app de reparto`

> Sustituye «procesador de pagos». Si solo marca efectivo, el sistema ya sabe que va a ver poco — y **lo dice**, en vez de mostrar un análisis incompleto sin advertencia (investigación 03, §7.1: el 75.4 % de las empresas cobra en efectivo y ninguna fuente digital lo ve).

### 6 · ¿Más o menos cuánto vendes en un día normal?

Campo numérico. Opción visible: `Varía mucho` → *«¿Y en una semana?»*

> Sustituye «ingresos anuales». De aquí se estima el anual, **diciéndolo**: *«Con eso calculo unos $X al año. Es una estimación tuya; cuando conectemos el SAT la ajusto a lo que realmente facturaste.»*

### 7 · ¿Cuáles son tus gastos fijos del mes? *(marcar los que apliquen)*

`Renta` · `Sueldos` · `Mercancía o material` · `Luz, agua, internet` · `Créditos que ya estoy pagando`

> **Sustituye «gastos deducibles anuales».** Se pregunta por lo que la persona sí conoce. Cuáles de esos son deducibles lo determina el sistema con el CFDI — y explicárselo es precisamente el valor que entrega el asesor después.

### 8 · ¿Para qué necesitas dinero?

`Para comprar más mercancía o material` · `Para pagar los gastos del mes` · `Para una máquina, equipo o local` · **`Porque no me alcanza para cerrar el mes`** · **`No necesito dinero, solo quiero entender mi negocio`**

> **Las dos últimas opciones no existen hoy y son las más importantes.** Ver la sección siguiente.

### 9 · ¿Has tenido problemas para pagar un crédito?

`Nunca` · `Me atrasé alguna vez` · `Tengo algo vencido ahorita` · `No sé`

> Sustituye «estatus en buró / moroso». Sin etiquetas que estigmaticen. El «no sé» se resuelve con la consulta al buró.

### Pregunta eliminada

**«¿Tu opinión de cumplimiento ante el SAT es positiva?»** — se lee del SAT al conectar, junto con la constancia y las listas del artículo 69-B. No se pregunta.

---

## La regla que falta en el motor

`lib/analysis.ts` implementa los descalificadores por antigüedad, informalidad y buró, pero **no** el más importante de `fintech.md` §8:

> **NO recomendar deuda en absoluto si** el usuario describe el crédito para cubrir un déficit operativo recurrente → sugerir primero renegociar plazos con proveedores, factoraje de la cartera existente, o revisar la estructura de costos. *Es más barato que endeudarse.*

La opción **«Porque no me alcanza para cerrar el mes»** de la pregunta 8 es la que la activa.

**Redactada en la voz de la marca** (Dato → Contexto → Acción, sin juicio, sin decidir por el usuario):

> **Dato.** «Un crédito para cubrir los gastos del mes se paga con el dinero del mes siguiente.»
> **Contexto.** «Cuando el hueco es del mes, suele repetirse — y entonces el crédito se vuelve parte del gasto fijo. El 25.6 % de las empresas que se financiaron usó el dinero para pagar otros créditos.»
> **Acción.** «Antes de endeudarte, hay tres cosas que podrías revisar primero: renegociar plazos con tus proveedores, adelantar el cobro de las facturas que ya emitiste, o mirar dónde se está yendo el gasto. ¿Las vemos?»

Esto respeta la regla de marca —no le dice qué hacer, le da con qué decidir— y es el diferenciador real del producto: **una fintech vive de colocar crédito y nunca va a decirte que no lo pidas.**

La segunda opción nueva, **«Solo quiero entender mi negocio»**, reconoce algo que los datos ya dicen: solo el 50 % de las empresas ha pedido financiamiento alguna vez (ENAFIN 2024). La otra mitad no quiere crédito — y es justamente la que más necesita el análisis.

---

## Cómo se enlaza con las fuentes

Cada «no sé» deja de ser un hueco y se vuelve el puente al paso siguiente:

| El usuario responde | Finanzza contesta |
|---|---|
| «No estoy seguro» de si factura | «Lo confirmo en un segundo con tu RFC. ¿Me dejas conectarme al SAT?» |
| «Varía mucho» en la venta diaria | «Entonces mejor lo saco de tus facturas, que no fallan. ¿Conectamos el SAT?» |
| «No sé» en el buró | «Puedo consultarlo por ti, con tu permiso.» |
| Solo cobra en efectivo | «Entonces tus facturas no van a contar toda la historia. Te propongo registrar las ventas del mostrador aquí mismo.» |

Es el orden que ya está en el código —onboarding, luego fuentes— pero con la motivación puesta en la conversación, no en un catálogo de conectores presentado en frío.

---

## Qué implica implementarlo

| Cambio | Dónde | Esfuerzo |
|---|---|---|
| Reescribir las preguntas y opciones | `components/onboarding/steps/*` | Medio — es presentación, la lógica no cambia |
| Convertir rangos a los valores que espera el motor | `components/onboarding/OnboardingWizard.tsx` | Bajo |
| Añadir las dos opciones nuevas de necesidad | `lib/types.ts` (`necesidad`) | Bajo |
| Implementar la regla de no endeudarse | `lib/analysis.ts` | Bajo — la regla ya está redactada en `fintech.md` §8 |
| Enlazar cada «no sé» con su fuente | `components/fuentes/ConectarFuentes.tsx` | Medio |

**Nota de alcance:** la recomendación es mantener las respuestas en **botones**, no en chat de texto libre. Se siente conversacional, entrega campos estructurados al motor determinista, y no depende de la API en vivo — que es donde se rompen las demos. El chat con IA se queda donde ya está y donde brilla: después del análisis, para conversar sobre el resultado.

---

*Propuesta abierta a discusión. Si el equipo la aprueba, se implementa sobre el código existente sin cambiar la arquitectura del flujo.*
