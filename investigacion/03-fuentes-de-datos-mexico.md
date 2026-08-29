# Catálogo de fuentes de datos comunes en emprendimientos y pymes — México

> **Punto de investigación 03 de 05** · Autora: Cristina Astaiza · País: México
> **Fecha:** 29 de agosto de 2026 · **Versión:** v2 — cruzada con la investigación 01
> **Método:** investigación documental con verificación de URLs por petición HTTP real
> **Versión maquetada:** https://claude.ai/code/artifact/a9d44fac-9226-4fdb-89be-ba2aad0c182f

De dónde salen los números de una pyme mexicana: qué fuentes existen, cuáles se pueden consumir de verdad y cuáles no están donde creemos.

---

## Contenido

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Alcance y método](#2-alcance-y-método)
3. [El problema en cifras](#3-por-qué-importan-las-fuentes-el-problema-en-cifras)
4. [Restricción regulatoria: el open banking que no llegó](#4-restricción-regulatoria-el-open-banking-que-no-llegó)
5. [Catálogo de fuentes](#5-catálogo-de-fuentes)
6. [Mapa: qué fuente alimenta cada componente](#6-mapa-qué-fuente-alimenta-cada-componente)
7. [Huecos y riesgos](#7-huecos-y-riesgos)
8. [Decisiones abiertas para el equipo](#8-decisiones-abiertas-para-el-equipo)
9. [Plantilla de ficha de fuente](#9-plantilla-de-ficha-de-fuente)
10. [Registro de verificación](#10-registro-de-verificación)
11. [Cruce con el journey map de asesoría de financiamiento](#11-cruce-con-el-journey-map-de-asesoría-de-financiamiento)

---

## 1. Resumen ejecutivo

Seis hallazgos que cambian decisiones de producto, no seis datos curiosos.

### 🔴 Hallazgo 1 · Arquitectura — no existe open banking operativo en México

La Ley Fintech lo ordena desde 2018, pero solo se publicaron las reglas de datos abiertos —sucursales y cajeros—. Las de datos agregados y transaccionales nunca salieron. **Ninguna capa bancaria del producto puede apoyarse en una API regulada:** hoy todo pasa por agregadores privados con credenciales del usuario.

### Hallazgo 2 · La fuente ancla — el CFDI

Es la única fuente universal, obligatoria y estandarizada del país. Toda pyme formal tiene ahí el 100 % de sus ingresos y gastos facturados, ya clasificados con una taxonomía oficial de más de 55 000 claves. Es el punto de partida natural y **no hay que inventarle categorías**.

### Hallazgo 3 · Atajo técnico — la capa fiscal se puede comprar

Belvo extrae datos del SAT con RFC y contraseña —sin manejar la e.firma del cliente— y entrega CFDI de tres años, declaraciones, retenciones, constancia, opinión de cumplimiento y estados financieros. Cambia el cálculo de esfuerzo y de riesgo legal del proyecto.

### 🟠 Hallazgo 4 · Diagnóstico — el cuello de botella no es el crédito, es la ceguera

Se aprueba el 94 % de los créditos que se solicitan, pero el 66.5 % de las microempresas no monitorea ningún indicador y solo el 50 % de las empresas ha solicitado financiamiento alguna vez. **La pyme no es rechazada: no pide**, porque no sabe si necesita, cuánto ni si puede pagar.

### 🔴 Hallazgo 5 · Punto ciego — el efectivo

Es el 75.4 % de los medios de pago y **ninguna fuente digital lo ve**. Un producto que solo lee CFDI y banco le mostrará una realidad parcial al segmento más grande del mercado. Requiere una respuesta de diseño explícita, no un parche posterior.

### 🔴 Hallazgo 6 · Advertencia de método para todo el equipo

**La estadística oficial de financiamiento casi no cubre al micronegocio real.** La ENAFIN 2024 reporta que las microempresas son el 54 % del universo empresarial; los Censos Económicos 2024 dicen que son el **95 %**. La propia CNBV explica la brecha: la ENAFIN clasifica con el criterio de la Secretaría de Economía y **considera microempresa a la de 6 a 10 personas empleadas**. El negocio de 1 a 5 personas —la mayoría absoluta del país— queda prácticamente fuera. Toda cifra de la ENAFIN describe un México más formalizado que el real. Ver [sección 11](#11-cruce-con-el-journey-map-de-asesoría-de-financiamiento).

---

## 2. Alcance y método

### Qué incluye

El inventario de fuentes de datos que un producto de administración financiera puede consumir en México, organizadas en ocho capas, con su vía de acceso técnica real, la credencial que exigen y su estado de verificación.

### Qué no incluye — deliberadamente

Catálogo de giros de negocio, estrategia fiscal por giro, mapa de fintechs prestamistas y estructura de financiamiento: son los otros puntos de investigación del equipo. Este documento los referencia donde se tocan, pero no los desarrolla.

### Cómo se verificó

Cada fuente se contrastó contra documentación oficial o del proveedor. Las URLs se probaron con petición HTTP real; el resultado de cada una está en la [sección 10](#10-registro-de-verificación). Toda cifra estadística proviene de la **fuente primaria** —boletín, reporte o portal del organismo—, nunca de una nota de prensa secundaria, y se cita con su año a la vista.

### Límites conocidos de esta versión

- Investigación **documental**: no se entrevistó a ninguna pyme.
- Sin prueba de concepto técnica: no se descargó un CFDI real ni se abrió un sandbox.
- Los costos de las APIs comerciales **no están cotizados** porque no son públicos.
- La capa laboral (5.5) se investigó de forma parcial y está marcada como tal.

---

## 3. Por qué importan las fuentes: el problema en cifras

| Cifra | Qué dice | Fuente |
|---|---|---|
| **66.5 %** | de las microempresas **no monitorea ningún indicador** de su negocio | ENAPROCE 2018 |
| **94 %** | tasa de aprobación de los créditos solicitados (2023) | ENAFIN 2024 |
| **75.4 %** | de las empresas usa **efectivo** como medio de pago | ENAFIN 2024 |
| **97.3 %** | de las MIPYMES del país son microempresas | ENAPROCE 2018 |

### El universo

Los **Censos Económicos 2024**, cuyos resultados definitivos se publicaron el **24 de julio de 2025**, contaron **7 093 631 establecimientos** que dan trabajo a **36 592 279 personas**, clasificados con **SCIAN 2023**.

La **ENAPROCE 2018** acota el subconjunto empresarial en **4 169 677 MIPYMES** de manufacturas, comercio y servicios privados no financieros: 4 057 719 microempresas (97.3 %) y 111 958 pequeñas y medianas (2.7 %).

### La ceguera operativa

Solo el **28.2 %** de las PyMES monitorea de tres a cinco indicadores clave y apenas el **8.8 %** monitorea diez o más. Entre las microempresas, **el 66.5 % no monitorea ninguno**. Es el vacío exacto que el componente de análisis viene a llenar.

### La relación rota con el crédito

Si se les ofreciera un crédito bancario, **7 de cada 10 MIPYMES no lo aceptarían**; de esas, **6 de cada 10 lo consideran caro** y 2 de cada 10 dicen no necesitarlo. Entre las que sí se financiaron, 8 de cada 10 usaron el dinero para comprar insumos, el 27.5 % para maquinaria y el **25.6 % para pagar otros créditos** —señal de refinanciamiento, no de crecimiento— (ENAPROCE 2018).

### El embudo completo, con cifras del reporte oficial

El reporte de resultados de la **ENAFIN 2024** —107 páginas publicadas por la CNBV el 28 de mayo de 2025— permite reconstruir el embudo entero:

| Paso | Qué mide | Cifra |
|---|---|---|
| 1 | Empresas que han **solicitado** financiamiento al menos una vez desde que abrieron | **50 %** |
| 2 | Tasa de aprobación de los créditos solicitados, todas las fuentes (2023) | **94 %** |
| 3 | Tasa de aprobación entre microempresas — subió desde 87 % en 2017 | **95 %** |
| 4 | Empresas que solicitaron y enfrentaron rechazo en su solicitud de mayor monto | **17.1 %** |

La serie histórica de aprobación va de **90 % en 2017 a 92 % en 2020 y 94 % en 2023**: el crédito se ha vuelto *más* accesible para quien lo pide, no menos. La mitad del universo simplemente nunca lo pide.

### Por qué no piden, y qué pasa cuando les dicen que no

Los motivos declarados para no solicitar financiamiento entre 2022 y 2024 son **autosuficiencia (49 %)**, **desinterés (44 %)** y ya contar con financiamiento disponible (32 %). Casi la mitad de quienes se financiaron con recursos propios en 2023 lo hizo porque resulta **menos costoso que solicitar financiamiento**.

Entre las empresas cuya solicitud de mayor monto fue rechazada:

| Motivo de rechazo | % de empresas | Lectura para el producto |
|---|---|---|
| **No le dieron razones** | 22 % | El rechazo opaco es el motivo más citado, empatado en primer lugar |
| Garantías insuficientes | 22 % | Se cruza con el RUG: saber qué garantías están libres |
| **No tiene historial** | 18 % | Caso de uso directo: **construir historial con datos alternativos** |
| No cumple con los requisitos | 18 % | Precalificación anticipada evitaría la solicitud fallida |
| Baja capacidad de pago | 16 % | Calculable desde el flujo antes de solicitar |
| Mal historial crediticio | 15 % | Más frecuente entre pequeñas y medianas |
| Tenía muchas deudas | 14 % | Visible en CFDI y movimientos bancarios |
| Sin plan de negocios | 5 % | — |

El rechazo no es un trámite fallido, tiene consecuencias medibles: **17 %** de las empresas rechazadas tuvo que cancelar contratos con clientes y proveedores, **13 %** detuvo operaciones temporalmente y **8 %** recortó personal.

> **Lectura.** Una aprobación del 94 % junto a un 66.5 % de ceguera y un 50 % que nunca solicita dice una sola cosa: **el problema no está en el filtro del banco, está antes**. Y dos de los motivos de rechazo más citados —no tener historial (18 %) y no cumplir requisitos (18 %)— son exactamente los que un producto de datos puede anticipar o construir. Eso mueve el centro de gravedad del proyecto del módulo de crédito hacia el de análisis y asistencia.

### 🔴 Advertencia metodológica — aplica a toda cifra de la ENAFIN

La ENAFIN 2024 reporta que las microempresas son el **54 %** del universo empresarial. Los Censos Económicos 2024 dicen que son el **95 %**. El propio reporte de la CNBV explica la diferencia: el Censo estratifica solo por número de personas empleadas, mientras que la ENAFIN usa la clasificación oficial de la Secretaría de Economía publicada en el DOF el 30 de junio de 2009, que combina empleados, ventas anuales y sector — y su nota al pie precisa que **«se consideran microempresas de 6 a 10 personas empleadas»**.

**Consecuencia práctica:** el negocio de 1 a 5 personas queda casi fuera de la encuesta. Además, en la muestra de la ENAFIN las grandes empresas concentran el 64 % del personal ocupado, frente al 9 % de las micro. Cada cifra optimista de esta fuente —98.9 % conoce instituciones financieras, 94 % de aprobación— describe un México sensiblemente más formalizado que el que el producto va a encontrar. **Citarla siempre con esta salvedad.**

*Nota de vigencia:* ENAPROCE tuvo ediciones en 2015 y 2018; **no hay edición 2025**. Es la mejor evidencia disponible sobre capacidades gerenciales, con ocho años de antigüedad. Muestra de 22 188 empresas, levantada del 1 de octubre al 30 de noviembre de 2018. La ENAFIN 2024 cubre servicios (53 %), comercio (27 %), manufacturas (16 %) y construcción (4 %).

---

## 4. Restricción regulatoria: el open banking que no llegó

El **artículo 76 de la Ley Fintech** (2018) obliga a las entidades financieras a establecer APIs estandarizadas para compartir tres categorías de datos. Su implementación quedó a medias:

| Categoría | Contenido | Estado |
|---|---|---|
| **Datos abiertos** | Ubicación de sucursales, cajeros automáticos, productos ofertados | ✅ Publicado — DOF, 4 jun 2020 |
| **Datos agregados** | Información estadística sin identificar al cliente | 🔴 Nunca publicado |
| **Datos transaccionales** | Movimientos de cuenta del cliente — *los que el producto necesita* | 🔴 Nunca publicado |

La regulación secundaria que operacionalizaría los datos agregados y transaccionales **nunca se emitió**. El retraso supera los **2 170 días** sobre el plazo legal, y en **enero de 2026** un grupo de emprendedores promovió un amparo contra la CNBV, Banxico y la SHCP por esa omisión.

> **🔴 Consecuencia para la arquitectura.** Toda conexión bancaria del producto dependerá de **agregadores privados que operan con las credenciales del usuario**. Es viable y es lo que hace hoy el mercado, pero implica tres cosas que hay que asumir desde el diseño: fragilidad ante cambios de los bancos, un costo por consulta que no controlamos, y una responsabilidad de custodia de credenciales que cae sobre nosotros.

---

## 5. Catálogo de fuentes

Ocho capas, ordenadas de la más universal a la más artesanal.

### 5.1 Fiscales · SAT

*La capa ancla: universal, obligatoria, estandarizada y con acceso programático legítimo.*

| Fuente | Qué entrega | Credencial | Histórico | Esfuerzo |
|---|---|---|---|---|
| **WS de Descarga Masiva de CFDI** | XML o metadata de facturas emitidas y recibidas, por rango de fechas | e.firma (FIEL) | 5 años | Alto |
| **Catálogos CFDI 4.0** | `c_ClaveProdServ`, régimen fiscal, uso de CFDI, forma y método de pago | Ninguna | Vigente | Bajo |
| **Constancia de Situación Fiscal** | Régimen vigente, actividades económicas registradas, domicilio | RFC + contraseña | Vigente | Bajo |
| **Opinión de cumplimiento (32-D)** | Semáforo positivo o negativo ante el SAT | RFC + contraseña | Vigente | Bajo |
| **DIOT y declaraciones** | Operaciones con terceros; ISR e IVA declarados | RFC + contraseña | 5 años | Medio |

**Detalle técnico del web service.** La versión vigente es la **1.5, en operación desde el 30 de mayo de 2025**. El flujo encadena cuatro servicios: *autenticación* con e.firma, *solicitud* con rango de fechas y tipo (emitidos o recibidos, CFDI o metadata), *verificación* de que el paquete esté listo, y *descarga*. Existen librerías open source maduras que ya lo implementan — [`phpcfdi/sat-ws-descarga-masiva`](https://github.com/phpcfdi/sat-ws-descarga-masiva) en PHP y [`ARSoftware.Cfdi.DescargaMasiva`](https://github.com/AndresRamos/ARSoftware.Cfdi.DescargaMasiva) en .NET.

**La taxonomía viene incluida.** El catálogo `c_ClaveProdServ` tiene **más de 55 000 claves** de ocho dígitos, y cada concepto facturado obliga a usar una: **la clasificación de ingresos y gastos ya viene resuelta en el dato de origen**. El **1 de enero de 2026** el SAT publicó la actualización más amplia desde el arranque de CFDI 4.0, con **847 claves nuevas** de servicios digitales, software, SaaS, cómputo en la nube y suscripciones.

> ⚠️ **Límite de la fuente.** El CFDI captura **lo facturado, no lo real**. Un negocio que vende en efectivo sin facturar es invisible aquí. Ver [capa 5.8](#58-negocios-sin-rastro-digital) y [hueco 7.1](#7-huecos-y-riesgos).

### 5.2 Bancarias · vía agregadores

*Sin API regulada disponible, el acceso al flujo de caja real pasa por intermediarios privados.*

| Proveedor | Cobertura y capacidad verificada | Costo |
|---|---|---|
| **Belvo** | Más de 60 instituciones en México, Brasil y Colombia. Datos + pagos cuenta a cuenta. **También extrae datos del SAT**. Partner de datos de plataformas de decisión de crédito y de J.P. Morgan. Vira hacia insights con IA | Sin publicar |
| **Syncfy** (Paybook) | Una sola API para más de **125 instituciones** financieras y de servicios en 15+ países de Latinoamérica | Sin publicar |
| **Finerio Connect** | CDMX. Agregación de cuentas, **categorización automática de transacciones** y analítica, en marca blanca. Pivotó a B2B en 2020; levantó USD 6.5 M | Sin publicar |
| **Prometeo** | Agregador regional con capa de pagos | Sin publicar |

> **Hallazgo · la capa fiscal también se compra.** El producto fiscal de México de Belvo extrae del SAT con **RFC y contraseña** —no e.firma— y devuelve: CFDI de ingresos y egresos de **3 años**, declaraciones anuales de **5 años** y mensuales de 12 meses, retenciones del último año, constancia de situación fiscal, **opinión de cumplimiento** y estados financieros de 3 años. Entrega asíncrona por webhooks, con sandbox de prueba (`PMO010101000` para negocios). Ver [decisión 8.1](#81-construir-o-comprar-la-capa-fiscal).

Ninguno de los cuatro publica tarifas: el pricing es dirigido por ventas y sin capa gratuita anunciada. **Cotizar es una tarea pendiente y bloqueante.**

### 5.3 Cobros · punto de venta, pasarelas y e-commerce

*Donde vive el ingreso antes de convertirse en factura o en depósito. La capa con mejor documentación pública de todas.*

| Fuente | Qué entrega | Acceso | Esfuerzo |
|---|---|---|---|
| **Clip** | Transacciones detalladas y actualizadas del terminal. El POS más extendido entre micronegocios mexicanos | API pública ✅ 200 | Bajo |
| **Mercado Pago** | Checkout, transacciones y reportes de cuenta; pagos a meses sin intereses | API Reference pública | Bajo |
| **Conekta** | Pasarela mexicana que consolida métodos de pago en un solo proveedor | API pública | Bajo |
| **Stripe MX** | Procesamiento nacional e internacional con más de 100 métodos de pago | API pública | Bajo |

Es la capa que mejor complementa al CFDI: ve la venta **en el momento en que ocurre**, no cuando se factura.

### 5.4 Contables y ERP

*El estado financiero ya estructurado — solo si la pyme lleva contabilidad en sistema.*

| Sistema | Situación de integración | Esfuerzo |
|---|---|---|
| **Facturama** | La API REST más limpia del grupo; también es PAC autorizado | Bajo |
| **Alegra** | Nube. Facturación CFDI, contabilidad, inventarios, POS, reportes y bancos. Migra desde CONTPAQi, Aspel y Contalink | Bajo |
| **Bind ERP** | Nube. Inventarios, producción, proyectos, compras y ventas; ingresos, egresos y cuentas por cobrar y pagar | Medio |
| **CONTPAQi · Aspel** | La mayor base instalada del país, pero **son de escritorio**: SDK .NET que hay que encapsular en una API propia | Alto |
| **Microsip · QuickBooks MX · Odoo / ERPNext** | Alternativas con conector o implementación localizada al SAT | Medio |

Los **PACs** autorizados por el SAT —Facturama, Pegaso, Edicom, FEL México y otros— exponen REST y son una ruta alterna al CFDI sin custodiar la e.firma del cliente.

### 5.5 Laborales y de nómina · ⚠️ investigación parcial

*La nómina suele ser el mayor egreso de una pyme y no aparece en los componentes dibujados de la solución.*

| Fuente | Qué entrega | Vía de acceso |
|---|---|---|
| **CFDI de nómina** | Sueldos, prestaciones y retenciones por empleado y periodo | Ya viene en la descarga masiva. **Ruta más barata** |
| **IDSE** (IMSS desde su Empresa) | Altas, bajas y modificaciones salariales; emisión de cuotas, descarga de archivos SUA y constancias | Sin API pública consolidada; hoy vía tercero autorizado |
| **SUA** | Autodeterminación de cuotas obrero-patronales | Archivo generado desde IDSE |

El IMSS anunció una modernización gradual del IDSE cuyos objetivos incluyen eliminar la dependencia de Java legacy, migrar a HTML5, procesar en tiempo real y **exponer APIs REST**. Mientras eso no aterrice, la vía práctica son proveedores autorizados con REST documentado, webhooks y sandbox.

**Pendiente de esta capa:** confirmar el estado real de las APIs REST del IMSS, identificar qué terceros están autorizados y con qué condiciones, y revisar Infonavit.

### 5.6 Crediticias · sociedades de información crediticia

*El comportamiento de pago del negocio: insumo obligado de cualquier scoring.*

| Fuente | Qué entrega | Autorización del titular |
|---|---|---|
| **Buró de Crédito** | Portal de APIs con producto específico para **Personas Morales y PFAE**: comportamiento crediticio y datos generales | Documento firmado; para PF, tres preguntas de validación |
| **Círculo de Crédito** | Reporte de crédito para empresas, historial de persona física y moral | **Vía API con NIP y huella digital**, conforme a los artículos 28 y 29 de la Ley de SIC |
| **RUG** — Secretaría de Economía | Garantías mobiliarias ya inscritas: vehículos, maquinaria, inventarios, cosechas y **cuentas por cobrar** | Consulta pública ✅ 200 |

**Cómo se lee el score.** El score de Buró de Crédito va de **400 a 850**, con una zona roja de **413 a 586** considerada de alto riesgo. Sin esa escala, el dato crudo no es interpretable para el usuario final.

**Quién más consulta y reporta a las SIC.** El ecosistema de otorgantes no se agota en la banca, y cada figura reporta y consulta distinto:

- **SOFOMES**, en sus dos variantes: reguladas (ER, supervisadas por la CNBV) y no reguladas (ENR, solo ante CONDUSEF).
- **SOFIPOs**, que captan ahorro y otorgan crédito, con depósitos protegidos por el IPAB.
- **Uniones de crédito.**
- **Banca de desarrollo** —Nafin y Bancomext—, que **casi nunca presta directo**: canaliza fondeo y garantías a través de bancos e intermediarios, vía crédito PyME, factoraje y cadenas productivas.

> ⚠️ **Fricción de onboarding.** Para persona física sin actividad empresarial la autenticación se resuelve con tres preguntas. Pero **para personas morales y PFAE lo más común sigue siendo un documento físico firmado presencialmente o enviado por paquetería** — justo el segmento del producto. Existe salida por firma electrónica con e.firma, pero es un paso que hay que diseñar.

### 5.7 Públicas de referencia y benchmarking

*Gratuitas, oficiales y con acceso programático. La capa que permite comparar a un negocio contra su sector.*

| Fuente | Contenido | Acceso | Estado |
|---|---|---|---|
| **INEGI · API DENUE** | Identificación, ubicación, actividad y tamaño de **más de 5 millones de establecimientos**, por entidad y municipio | REST con token | ✅ 200 |
| **INEGI · API de Indicadores (BIE)** | Series económicas; claves vía Constructor de Consultas | REST con token | ✅ 200 |
| **INEGI · Censos Económicos 2024** | Universo completo de unidades económicas con SCIAN 2023. Definitivos desde el 24 jul 2025 | Tabulados y microdatos | ✅ 200 |
| **CNBV + INEGI · ENAFIN 2024** | Acceso, uso, barreras y condiciones de financiamiento; por tamaño, sector y localidad | Reporte y tabulados | ✅ 200 |
| **INEGI · ENAPROCE** | Capacidades gerenciales, financiamiento y cadenas productivas de MIPYMES | Microdatos | ⚠️ 2018 |
| **Banxico · API SIE** | Tasas de referencia, tipo de cambio y crédito | Token de 64 caracteres | ✅ 200 |
| **CNBV · Portafolio de Información** | Cartera de crédito y morosidad por sector | Descarga pública | ✅ 200 |
| **SIEM** en datos.gob.mx | Establecimientos registrados ante cámaras empresariales; registros de sep y oct 2025 | Datos abiertos | ✅ 200 |
| **CONDUSEF · SIPRES** | Registro público de **más de 6 200 instituciones financieras**: ubicación, contacto, estatus administrativo, objeto social, funcionarios y capital mínimo fijo | Consulta pública | ✅ 200 |
| **CONDUSEF · Buró de Entidades Financieras** | Sanciones impuestas por infracciones a las leyes que regulan a las instituciones financieras | Consulta pública | ✅ 200 |
| **CONDUSEF · RECA y calculadoras de CAT** | Registro de contratos de adhesión y comparadores del Costo Anual Total, obligatorio por la Ley para la Transparencia y Ordenamiento de los Servicios Financieros | Consulta pública | ✅ Verificado |

> **SIPRES no es solo referencia: es una fuente funcional.** Existe por mandato de la Ley de Protección y Defensa al Usuario de Servicios Financieros y su consulta es abierta. Sirve para **verificar que un prestamista existe y está registrado** antes de conectarlo o recomendarlo — incluidos los casos de nombres parecidos o autorizaciones supuestas. Es un control ejecutable dentro del producto. Ver [sección 11](#11-cruce-con-el-journey-map-de-asesoría-de-financiamiento).

### 5.8 Negocios sin rastro digital

*La capa que responde por la palabra «emprendimientos» del enunciado: el negocio que todavía no tiene RFC, ni banco empresarial, ni terminal, ni contador.*

Las siete capas anteriores asumen un negocio ya formalizado. Un emprendimiento en etapa temprana **no dispone de ninguna de ellas**: sin RFC no hay CFDI, sin cuenta empresarial no hay agregador, sin historial no hay buró.

> **🔴 Por qué esta capa no es opcional.** La brecha estadística lo confirma: la ENAFIN ve un universo donde las micro son el 54 %, los Censos Económicos uno donde son el **95 %**. Ese 41 % de diferencia **es exactamente la población de esta capa** — el negocio de 1 a 5 personas que ni la encuesta oficial de financiamiento alcanza. Y el 18 % de los rechazos de crédito se explica por *no tener historial*: construirlo con estas fuentes es el caso de uso más claro del producto.

| Fuente | Qué entrega | Naturaleza del dato |
|---|---|---|
| **Apps de registro para micronegocios** — Treinta, Kyte | Ventas, gastos, inventario y deudas capturados desde el celular. Gratuitas o de bajo costo; **no emiten CFDI**, lo que las hace viables para quien no factura | Declarado por el dueño |
| **Punto de venta ligero** — Alegra POS, Bind | Ticket a ticket, con la opción de facturar después | Transaccional propio |
| **Captura manual asistida y OCR de tickets** | Gasto no facturado, fotografiado y digitalizado | Declarado + imagen |
| **Cuenta personal usada como empresarial** | Flujo real del negocio mezclado con el gasto del hogar; se lee por agregador pero exige separar | Transaccional mezclado |
| **Hojas de cálculo y cuadernos** | El registro más común del micronegocio. Requiere importación y normalización | Declarado, sin estructura |

> ⚠️ **Implicación de producto.** Estos datos son **declarados, no verificados**: sirven para que el dueño entienda su negocio, pero no para que un prestamista le apruebe un crédito. El modelo de datos debe llevar un **nivel de confianza por registro** que distinga el dato fiscal del bancario y del declarado — si no, el producto mezcla evidencia con testimonio y ninguna de las dos vale.
>
> Como referencia de comportamiento: los reportes de estas apps empiezan a mostrar patrones útiles **después de la primera semana de registro consistente**. La captura manual solo funciona si se sostiene el hábito, y eso es un problema de diseño de producto, no de datos.

---

## 6. Mapa: qué fuente alimenta cada componente

Los ocho componentes dibujados de la solución, contra las capas de este catálogo.

| Componente de la solución | Fuentes núcleo | Fuentes de apoyo |
|---|---|---|
| **Análisis de los números** | CFDI emitidos y recibidos `5.1` · Movimientos bancarios `5.2` | POS y pasarelas `5.3` · ERP `5.4` · Captura manual `5.8` |
| **Asistente financiero** | El modelo de datos canónico — no tiene fuentes propias | Banxico SIE y CNBV para referencias de mercado `5.7` |
| **Automatización de fuentes de datos** | *Es este documento completo* | — |
| **Asesoría en financiamiento** | Buró y Círculo `5.6` · Opinión 32-D `5.1` | RUG `5.6` · ENAFIN 2024 `5.7` · SIPRES y CAT `5.7` |
| **Automatización de gastos (SAT)** | CFDI recibidos y `c_ClaveProdServ` `5.1` | Categorización de agregador `5.2` · DIOT `5.1` |
| **Integración con fintechs prestamistas** | Paquete de scoring: CFDI + banco + buró + 32-D + RUG | Belvo ya empaqueta buena parte `5.2` |
| **Catálogo de análisis por giro** | Censos Económicos 2024 y DENUE `5.7` | BIE, SIEM, ENAPROCE `5.7` |
| **Estrategia fiscal** | Constancia de Situación Fiscal · Catálogo de régimen · Declaraciones `5.1` | Opinión de cumplimiento `5.1` |
| **Capa laboral** *(propuesta)* | CFDI de nómina `5.5` | IDSE y SUA vía tercero autorizado `5.5` |

**Dos lecturas del mapa.** La primera: la capa 5.1 alimenta **seis de los ocho componentes**, lo que la convierte en la integración de mayor retorno del proyecto. La segunda: el asistente financiero no consume ninguna fuente directamente —consume el modelo normalizado—, y por eso **definir ese modelo es más urgente que sumar conectores**.

---

## 7. Huecos y riesgos

Lo que este catálogo no resuelve, dicho antes de que aparezca en desarrollo.

| # | Hueco | Severidad | Detalle |
|---|---|---|---|
| **7.1** | **El efectivo no lo ve nadie** | 🔴 Alta | Con el 75.4 % de las empresas cobrando en efectivo, ninguna capa digital captura la operación real de una fonda, una estética o un puesto de mercado. Hay que decidir por diseño si se resuelve con captura asistida, conciliación por POS o inferencia — o si esos giros quedan fuera del alcance |
| **7.2** | **Custodia de credenciales** | 🔴 Alta | El modelo pide e.firma o contraseña del SAT y las del banco. Activa obligaciones de la LFPDPPP en aviso de privacidad y consentimiento expreso, y una responsabilidad de resguardo que hoy nadie del equipo tiene asignada |
| **7.3** | **Ningún costo está cotizado** | 🟠 Bloqueante | Belvo, Syncfy, Finerio, Buró y Círculo operan con pricing dirigido por ventas. Un catálogo sin costos describe pero no permite elegir |
| **7.4** | **ENAPROCE tiene ocho años** | 🟠 Media | No hay edición posterior a 2018. Se usa, pero siempre con el año visible |
| **7.5** | **Sin validación de campo** | 🟡 Media | Cero pymes entrevistadas. No sabemos dónde tienen hoy sus números, y esa respuesta puede reordenar las prioridades del catálogo |
| **7.6** | **Sin prueba técnica** | 🟡 Baja | No se descargó un CFDI real ni se abrió el sandbox. Sin medir: latencia del SAT, calidad real de las claves de producto, comportamiento de un RFC sin actividad |

---

## 8. Decisiones abiertas para el equipo

### 8.1 Construir o comprar la capa fiscal

| Ruta | A favor | En contra |
|---|---|---|
| **Construir** contra el WS del SAT | Control total, sin costo por consulta, sin intermediario, librerías open source maduras | Exige custodiar la **e.firma** de terceros —el nivel más alto de riesgo legal— y mantener el conector ante cada cambio del SAT |
| **Comprar** vía agregador | Una sola integración cubre SAT y banco, con RFC y contraseña en vez de e.firma. Sandbox, webhooks y mantenimiento ajeno | Costo por consulta desconocido, dependencia de un tercero y menos control sobre el dato crudo |

La decisión no se puede tomar sin el dato de [7.3](#7-huecos-y-riesgos). **Cotizar es el desbloqueo.**

### 8.2 Qué taxonomía manda: SCIAN o SAT

Los Censos Económicos y el DENUE clasifican con **SCIAN 2023**, que es lo que permite comparar un negocio contra su sector. Pero lo que el negocio tiene realmente registrado es su **actividad económica ante el SAT**, que es otro árbol. Hay que elegir una como maestra y mapear la otra; si no, el catálogo por giro nunca cuadrará con la constancia fiscal del cliente. *Decisión compartida con la investigación de giros de negocio.*

### 8.3 Qué preguntarle al cliente del proyecto

Tres respuestas que reordenan las prioridades de todo el catálogo: **quién es el usuario objetivo** —micronegocio informal o pyme con contador—, **qué país arranca primero**, y **si hay presupuesto** para APIs de paga.

---

## 9. Plantilla de ficha de fuente

Nueve campos fijos para que cualquier fuente nueva —de este equipo o del siguiente— se documente igual y se pueda comparar. La plantilla vive en [`plantillas/ficha-fuente-de-datos.md`](../plantillas/ficha-fuente-de-datos.md).

| Campo | Qué se registra |
|---|---|
| **Fuente** | Nombre oficial y organismo o empresa responsable |
| **Qué entrega** | Los campos concretos, no la categoría general |
| **Credencial** | Qué se le pide al usuario: e.firma, contraseña, token, nada |
| **Histórico** | Cuánto pasado entrega en la primera carga |
| **Método de acceso** | REST, SOAP, SDK, descarga manual, scraping |
| **Costo** | Tarifa real o «pendiente de cotizar» — nunca en blanco |
| **Límites** | Cuota de consultas, latencia, ventana de fechas |
| **Riesgo legal** | Qué consentimiento exige y qué obligación de resguardo genera |
| **Esfuerzo** | Alto, medio o bajo, con la razón en una línea |

> **La regla que sostiene la plantilla:** un campo sin dato se escribe «pendiente», nunca se deja vacío ni se rellena por inferencia. Un catálogo que declara lo que no sabe es utilizable; uno que lo disimula, no.

---

## 10. Registro de verificación

Resultado de la petición HTTP a cada URL, el 29 de agosto de 2026.

| Código | Recurso |
|---|---|
| ✅ 200 | INEGI — API del DENUE |
| ✅ 200 | INEGI — API de Indicadores / BIE |
| ✅ 200 | INEGI — Censos Económicos 2024 |
| ✅ 200 | INEGI — ENAFIN 2024 |
| ✅ 200 | CNBV — Reporte de resultados ENAFIN 2024 *(descargado y leído: 107 páginas)* |
| ✅ 200 | Banxico — Catálogo de series de la API SIE |
| ✅ 200 | CNBV — Portafolio de Información |
| ✅ 200 | datos.gob.mx — SIEM |
| ✅ 200 | RUG — Secretaría de Economía |
| ✅ 200 | Clip Developers |
| ✅ 200 | CONDUSEF — SIPRES, consulta pública |
| ✅ 200 | CONDUSEF — Buró de Entidades Financieras |
| ⚪ 403 | SAT — portal de descarga masiva · *bloqueo de peticiones automatizadas, no ausencia del servicio* |
| ⚪ — | Buró de Crédito — portal de APIs PM · *no responde a petición automatizada; requiere navegador* |

### Fuentes consultadas

- [phpCfdi — Consumo del WS del SAT](https://www.phpcfdi.com/librerias/sat-ws-descarga-masiva/) · [phpcfdi/sat-ws-descarga-masiva](https://github.com/phpcfdi/sat-ws-descarga-masiva) · [Nueva versión 1.5 del WS de Descarga Masiva](https://developers.sw.com.mx/knowledge-base/29-mayo-2025-nueva-version-del-web-service-de-descarga-masiva-sat-para-cfdi-y-cfdi-de-retenciones/) · [Catálogos CFDI 4.0 actualizados 2026](https://senhub.mx/blog/catalogos-cfdi-40-actualizados-2026)
- [Legal Paradox — Open Finance México](https://www.legalparadox.com/categories/open-finance) · [Fiskil — Marco regulatorio de open banking en México](https://www.fiskil.com/es/open-finance/mexico)
- [Belvo — API de datos fiscales de México](https://developers.belvo.com/products/fiscal_mexico/fiscal-mexico-extract-fiscal-data-api) · [Belvo — Planes y precios](https://belvo.com/plans-and-pricing/) · [Provenir — Belvo como socio de datos](https://www.provenir.com/belvo/)
- [INEGI — API del DENUE](https://www.inegi.org.mx/servicios/api_denue.html) · [INEGI — API de Indicadores](https://www.inegi.org.mx/servicios/api_indicadores.html) · [Censos Económicos 2024, resultados definitivos](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/ce/CE2024_def.pdf) · [INEGI — ENAFIN 2024](https://www.inegi.org.mx/programas/enafin/2024/) · [CNBV — Reporte de resultados ENAFIN 2024](https://www.gob.mx/cms/uploads/attachment/file/998579/Reporte_ENAFIN_2024.pdf) · [CNBV — Principales resultados ENAFIN 2024](https://www.gob.mx/cnbv/articulos/la-cnbv-y-el-inegi-dan-a-conocer-los-principales-resultados-de-la-enafin-2024) · [INEGI — Boletín ENAPROCE 2018](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2019/especiales/ENAPROCE2018.pdf)
- [Banxico — Catálogo de series SIE](https://www.banxico.org.mx/SieAPIRest/service/v1/doc/catalogoSeries) · [CONDUSEF — SIPRES](https://webapps.condusef.gob.mx/SIPRES/jsp/pub/index.jsp) · [CONDUSEF — Buró de Entidades Financieras](https://www.buro.gob.mx/) · [CONDUSEF — Registros](https://www.condusef.gob.mx/index.php?p=registros)
- [Clip Developers](https://developer.clip.mx/) · [Mercado Pago — API Reference](https://www.mercadopago.com.mx/developers/es/reference)
- [Buró de Crédito — APIs para Personas Morales](https://apim.burodecredito.com.mx/pages/bc/nuestras-apis.html) · [Círculo de Crédito — Reporte de crédito para empresas](https://empresas.circulodecredito.com.mx/reportecredito) · [Mifiel — Autorizaciones de SIC firmadas con e.firma](https://blog.mifiel.com/circulo-buro-credito-firma-digitalmente/)
- [IMSS — IDSE](https://www.imss.gob.mx/patrones/idse) · [IMSS — SUA](https://www.imss.gob.mx/patrones/sua)
- [datos.gob.mx — SIEM](https://www.datos.gob.mx/dataset/sistema_informacion_empresarial_mexicano) · [RUG](https://rug.economia.gob.mx/)
- [Treinta](https://treinta.co/) · [Alegra — Punto de venta](https://www.alegra.com/mexico/punto-de-venta/) · [Bind ERP](https://bind.com.mx/)

---

## 11. Cruce con el journey map de asesoría de financiamiento

Este catálogo es la infraestructura del recorrido que documenta la **investigación 01** ([`journey-map-asesoria-financiamiento-mexico.md`](../journey-map-asesoria-financiamiento-mexico.md)).

### 11.1 Qué fuente necesita cada etapa del recorrido

| Etapa | Momento del cliente | Fuentes que la sostienen |
|---|---|---|
| 1 | Detección de la necesidad | Flujo de caja y CFDI `5.1` `5.2` — es lo que convierte una corazonada en un monto |
| 2 | Comparación de opciones | Calculadoras de CAT y RECA de CONDUSEF `5.7` · Banxico SIE para contrastar contra tasa de mercado `5.7` |
| 3 | Precalificación | CFDI + banco + opinión 32-D `5.1` `5.2` — precalificar con datos propios evita la solicitud fallida |
| 4 | Documentación | CFDI, estados de cuenta y declaraciones `5.1` `5.2` · Estados financieros desde ERP `5.4` |
| 5 | Evaluación crediticia | Buró y Círculo `5.6` · RUG para garantías libres `5.6` |
| 6 | Oferta y negociación | CAT comparado `5.7` · Buró de Entidades Financieras para revisar sanciones del otorgante `5.7` |
| 7 | Firma y dispersión | **SIPRES** para verificar que el prestamista está registrado `5.7` |
| 8 | Seguimiento y pagos | Movimientos bancarios y CFDI para anticipar el atraso antes de que ocurra `5.1` `5.2` |

### 11.2 Dos correcciones que este catálogo aporta a la investigación 01

> **🔴 Discrepancia por resolver.** La investigación 01 cita que **«~80 % de las solicitudes de crédito de PyMEs son rechazadas»** (ABM, vía medios). El reporte oficial de la ENAFIN 2024 dice lo contrario: **94 % de aprobación** sobre los créditos solicitados, y solo **17.1 %** de las empresas solicitantes enfrentó un rechazo en su solicitud de mayor monto.
>
> No pueden convivir sin explicación en el mismo repositorio. Las tres piezas que probablemente reconcilian la diferencia: la ENAFIN mide **créditos aprobados sobre créditos solicitados**, no empresas; solo el **50 %** de las empresas ha solicitado alguna vez, así que el embudo se cae antes; y la ENAFIN **casi no cubre al negocio de 1 a 5 personas**, que es donde el rechazo debe concentrarse.
>
> **Acuerdo sugerido para el equipo:** toda cifra va a fuente primaria del organismo, nunca a la nota de prensa que la reporta.

> **Refuerzo con fuente primaria.** La investigación 01 documenta el **rechazo sin explicación suficiente** como dolor, apoyado en testimonios y notas. El dato oficial lo respalda y lo cuantifica: **«no le dieron razones» es el motivo de rechazo más citado, con 22 %**, empatado con garantías insuficientes (ENAFIN 2024). Conviene sustituir la referencia secundaria por esta.

### 11.3 Lo que este catálogo le pide a las otras investigaciones

- **A giros de negocio:** definir si la taxonomía maestra es SCIAN 2023 o el catálogo de actividades del SAT — [decisión 8.2](#82-qué-taxonomía-manda-scian-o-sat).
- **A fintechs prestamistas:** qué datos exige concretamente cada prestamista para otorgar, para dimensionar el paquete mínimo de scoring.
- **A estrategia fiscal:** qué campos de la constancia y de las declaraciones se necesitan realmente, para no pedirle al usuario más credenciales de las indispensables.

---

*Documento vivo. Los huecos declarados en la sección 7 se cierran con cotizaciones, entrevistas y una prueba técnica; hasta entonces quedan explícitos y no inferidos.*
