# Claude Workshop — Administración financiera para emprendimientos y pymes

Repositorio de investigación del equipo. Cada persona documenta su punto y todos se consolidan aquí.

**Mercado de arranque:** México · **Última actualización:** 29 de agosto de 2026

---

## Componentes de la solución

Los ocho componentes definidos en sesión:

- Análisis de los números
- Asistente financiero
- Automatización de fuentes de datos
- Asesoría en financiamiento
- Automatización de gastos (SAT)
- Integración con fintechs prestamistas
- Catálogo de análisis financiero por giro de negocio
- Estrategia fiscal

---

## Puntos de investigación

| # | Tema | Estado | Documento |
|---|---|---|---|
| 01 | Journey map de asesoría de financiamiento | ✅ v1 | [`journey-map-asesoria-financiamiento-mexico.md`](./journey-map-asesoria-financiamiento-mexico.md) |
| 02 | Catálogo de giros de negocio | ✅ v1 | [`giros-de-negocio-sat.md`](./giros-de-negocio-sat.md) |
| 03 | **Catálogo de fuentes de datos comunes en emprendimientos y pymes** | ✅ v3 | [`investigacion/03-fuentes-de-datos-mexico.md`](./investigacion/03-fuentes-de-datos-mexico.md) |
| 04 | Catálogo de estrategia fiscal por giro de negocio | ⬜ Pendiente | — |
| 05 | Fintechs prestamistas — base de conocimiento de financiamiento | ✅ v1.0 | [`fintech.md`](./fintech.md) |
| 06 | Estructura y flujo de financiamiento por giro de negocio | ⬜ Pendiente | — |

---

## Cómo se conectan los documentos

```
02 giros            →  define la taxonomía (Anexo 6 RMF, basado en SCIAN)
                          ↓
03 fuentes de datos →  de dónde salen los datos de cada capa
                          ↓
05 fintech          →  consume ese perfil para rutear a un prestamista
                          ↓
01 journey map      →  el recorrido humano donde todo eso ocurre
```

El documento 03 lleva el cruce explícito con 01 (§11) y con 02 y 05 (§12).

---

## Convención propuesta

```
README.md                        # este índice
investigacion/
  NN-tema.md                     # un archivo por punto, numerado
plantillas/
  ficha-fuente-de-datos.md       # formato común para documentar fuentes
```

> **Nota:** los documentos 01, 02 y 05 están en la raíz. Se propone moverlos a `investigacion/` con numeración — queda a decisión de sus autores para no romper historiales.

---

## Criterios de calidad acordados

Nacen del cruce entre los documentos 01 y 03, donde aparecieron dos cifras contradictorias sobre lo mismo. Detalle en [`plantillas/ficha-fuente-de-datos.md`](./plantillas/ficha-fuente-de-datos.md).

1. **Fuente primaria siempre.** Las cifras se citan del boletín, reporte o portal del organismo que las produce — nunca de la nota de prensa que las reporta.
2. **Año visible.** Toda cifra lleva el año de su levantamiento.
3. **Cobertura declarada.** Si una fuente estadística excluye a un segmento, se dice al citarla.
4. **URLs verificadas.** Cada enlace se prueba y se registra el código de respuesta con su fecha.
5. **Vacíos explícitos.** Lo que no se encontró se documenta como no encontrado.

---

## Decisiones abiertas para todo el equipo

| Decisión | Estado | Detalle |
|---|---|---|
| **Construir o comprar la capa fiscal** — el web service del SAT por cuenta propia, o vía agregador | 🔴 Bloqueada: requiere cotizar Belvo, Syncfy, Finerio, Buró y Círculo. Ninguno publica tarifas | [03 §8.1](./investigacion/03-fuentes-de-datos-mexico.md#81-construir-o-comprar-la-capa-fiscal) |
| **Taxonomía maestra: SCIAN o catálogo del SAT** | ✅ Resuelta por el doc 02 — comparten raíz. Queda el mapeo código a código | [03 §8.2](./investigacion/03-fuentes-de-datos-mexico.md#82-qué-taxonomía-manda-scian-o-sat--resuelta-comparten-raíz) |
| **Cómo se resuelve el hueco del efectivo** — 75.4 % de las empresas cobra en efectivo y ninguna fuente digital lo ve | 🔴 Abierta | [03 §7.1](./investigacion/03-fuentes-de-datos-mexico.md#7-huecos-y-riesgos) |
| **Discrepancia 94 % de aprobación (ENAFIN) vs. 80 % de rechazo (ABM)** | 🟠 Abierta entre los docs 01 y 03 | [03 §11.2](./investigacion/03-fuentes-de-datos-mexico.md#112-dos-correcciones-que-este-catálogo-aporta-a-la-investigación-01) |
| **Qué atender para el negocio informal o con menos de 12 meses** — ninguna fintech del catálogo 05 le aplica | 🔴 Abierta | [03 §5.8](./investigacion/03-fuentes-de-datos-mexico.md#58-negocios-sin-rastro-digital) y [05 §8](./fintech.md) |
| **Modelo de datos canónico** — el esquema único al que se normalizan todas las fuentes | 🔴 Sin responsable | [03 §6](./investigacion/03-fuentes-de-datos-mexico.md#6-mapa-qué-fuente-alimenta-cada-componente) |
| **Consentimiento y custodia de credenciales** (LFPDPPP) — el producto pedirá CIEC del SAT y accesos bancarios | 🔴 Sin responsable | [03 §7.2](./investigacion/03-fuentes-de-datos-mexico.md#7-huecos-y-riesgos) |

## Preguntas pendientes para el cliente del proyecto

- **Quién es el usuario objetivo:** ¿micronegocio informal o pyme con contador? Cambia qué fuentes son prioritarias y si el catálogo 05 aplica siquiera.
- **Qué país arranca primero.**
- **Si hay presupuesto** para APIs de paga.
