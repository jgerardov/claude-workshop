# Plantilla · Ficha de fuente de datos

Copiar este bloque para cada fuente nueva. Nueve campos fijos, para que todas las fichas del repositorio se puedan comparar entre sí.

**La regla que sostiene la plantilla:** un campo sin dato se escribe `pendiente`, nunca se deja vacío ni se rellena por inferencia. Un catálogo que declara lo que no sabe es utilizable; uno que lo disimula, no.

---

## `<Nombre de la fuente>`

| Campo | Contenido |
|---|---|
| **Fuente** | Nombre oficial y organismo o empresa responsable |
| **Qué entrega** | Los campos concretos, no la categoría general. «Fecha, RFC del emisor, clave de producto y monto» en vez de «datos de facturación» |
| **Credencial** | Qué se le pide al usuario: e.firma, RFC + contraseña, token de desarrollador, ninguna |
| **Histórico** | Cuánto pasado entrega en la primera carga, y cuánto en las siguientes |
| **Método de acceso** | REST, SOAP, SDK, descarga manual, scraping |
| **Costo** | Tarifa real, o `pendiente de cotizar` con la fecha en que se pidió |
| **Límites** | Cuota de consultas, latencia esperada, ventana máxima de fechas |
| **Riesgo legal** | Qué consentimiento exige del titular y qué obligación de resguardo genera para nosotros |
| **Esfuerzo** | `Alto` · `Medio` · `Bajo`, con la razón en una línea |

**Estado de verificación:** `✅ verificada el <fecha>` · `⚠️ parcial` · `⛔ sin verificar`
**URL:** `<enlace>` — código HTTP obtenido y fecha de la prueba
**Notas:** límites conocidos, contradicciones con otras fuentes, pendientes

---

## Criterios de calidad acordados por el equipo

1. **Fuente primaria siempre.** Las cifras se citan del boletín, reporte o portal del organismo que las produce — nunca de la nota de prensa que las reporta.
2. **Año visible.** Toda cifra lleva el año de su levantamiento, no el de su publicación ni el de hoy.
3. **Cobertura declarada.** Si una fuente estadística excluye a un segmento —por ejemplo, la ENAFIN y el negocio de 1 a 5 personas—, se dice al citarla.
4. **URLs verificadas.** Cada enlace se prueba y se registra el código de respuesta con su fecha.
5. **Vacíos explícitos.** Lo que no se encontró se documenta como no encontrado, con la búsqueda que se intentó.
