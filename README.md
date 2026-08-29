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

| # | Tema | Responsable | Estado | Documento |
|---|---|---|---|---|
| 01 | Journey map de asesoría de financiamiento | Gerardo | ✅ v1 | [`journey-map-asesoria-financiamiento-mexico.md`](./journey-map-asesoria-financiamiento-mexico.md) |
| 02 | Catálogo de giros de negocio | — | ⬜ Pendiente | — |
| 03 | **Catálogo de fuentes de datos comunes en emprendimientos y pymes** | Cristina | ✅ v2 | [`investigacion/03-fuentes-de-datos-mexico.md`](./investigacion/03-fuentes-de-datos-mexico.md) |
| 04 | Catálogo de estrategia fiscal por giro de negocio | — | ⬜ Pendiente | — |
| 05 | Fintechs prestamistas | — | ⬜ Pendiente | — |
| 06 | Estructura y flujo de financiamiento por giro de negocio | — | ⬜ Pendiente | — |

---

## Convención propuesta

```
README.md                        # este índice
investigacion/
  NN-tema.md                     # un archivo por punto, numerado
plantillas/
  ficha-fuente-de-datos.md       # formato común para documentar fuentes
```

> **Nota:** el documento 01 sigue en la raíz. Se propone moverlo a `investigacion/01-journey-map-asesoria-financiamiento.md` — queda a decisión de su autor para no romperle el historial.

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

| Decisión | Quién la desbloquea | Detalle |
|---|---|---|
| **Construir o comprar la capa fiscal** — el web service del SAT por cuenta propia, o vía agregador | Requiere cotizar Belvo, Syncfy, Finerio, Buró y Círculo. Ninguno publica tarifas | [03 §8.1](./investigacion/03-fuentes-de-datos-mexico.md#81-construir-o-comprar-la-capa-fiscal) |
| **Taxonomía maestra: SCIAN 2023 o catálogo de actividades del SAT** | Documentos 02 y 03 en conjunto | [03 §8.2](./investigacion/03-fuentes-de-datos-mexico.md#82-qué-taxonomía-manda-scian-o-sat) |
| **Cómo se resuelve el hueco del efectivo** — 75.4 % de las empresas cobra en efectivo y ninguna fuente digital lo ve | Documentos 02 y 03 | [03 §7.1](./investigacion/03-fuentes-de-datos-mexico.md#7-huecos-y-riesgos) |
| **Discrepancia 94 % de aprobación vs. 80 % de rechazo** | Documentos 01 y 03 | [03 §11.2](./investigacion/03-fuentes-de-datos-mexico.md#112-dos-correcciones-que-este-catálogo-aporta-a-la-investigación-01) |

## Preguntas pendientes para el cliente del proyecto

- **Quién es el usuario objetivo:** ¿micronegocio informal o pyme con contador? Cambia qué fuentes son prioritarias.
- **Qué país arranca primero.**
- **Si hay presupuesto** para APIs de paga.
