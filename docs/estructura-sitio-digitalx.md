# Digital X — Estructura del sitio (digitalx.mx)

Archivo 1 de 2. Complemento: `reglas-seo-digitalx.md` (metadatos, técnica, imágenes, schema, SEO local).
Versión: borrador de trabajo · 2026-10-23

---

## 0. Instrucciones para el agente (leer primero)

1. Este archivo es la **fuente de verdad** de URLs, páginas y jerarquía. No decidas por tu cuenta.
2. **No crees** páginas, URLs ni categorías que no estén en la tabla de la sección 3.
3. **No cambies** el patrón de URL (sección 2). Los slugs marcados como *provisional* solo cambian si el dueño lo aprueba por escrito.
4. **No inventes datos**: clientes, cifras, marcas, precios, equipo, direcciones, testimonios, casos, permisos, distancias. Si falta un dato, escribe `[PENDIENTE: qué falta]` en su lugar y lístalo en tu reporte final.
5. **No publiques** páginas con estado "Pendiente de material". Solo se muestra una tarjeta o mención dentro de su categoría, sin enlace a una página vacía.
6. Si algo no está definido, o dos reglas parecen chocar, **detente y pregunta** antes de implementar.
7. Si este archivo y `reglas-seo-digitalx.md` chocan: URLs, páginas y jerarquía mandan en **este**; metadatos y técnica mandan en el **de SEO**.
8. Alcance: este documento no define diseño visual (colores, tipografías, layout).
9. **Enlaces a páginas planeadas.** En desarrollo el contenido (por ejemplo, las tarjetas de servicios del Inicio) puede enlazar a páginas con estado "Lanzamiento" que aún no están construidas: llevan a la 404. Las "Pendiente de material" nunca se enlazan. El **build de producción** (`VERCEL_ENV=production`) falla mientras exista un enlace interno a una página sin construir, con la lista de páginas y enlaces. El sitemap muestra **solo páginas construidas**; el menú principal y el pie enlazan las páginas planeadas (ver sección 4).

---

## 1. Datos del negocio

| Dato | Valor |
| --- | --- |
| Nombre | Digital X |
| Dominio nuevo | digitalx.mx |
| Dominio anterior | digitalequis.com (se redirige con 301) |
| Ubicación | Atlixco, estado de Puebla. **Sin dirección pública** |
| Teléfono | +52 244 124 4913 |
| WhatsApp | 522441244913 (el número 244 137 1957 ya no se usa) |
| Correo | `[PENDIENTE: correo definitivo en digitalx.mx]` |
| Redes | `[PENDIENTE: URLs de Facebook, Instagram, TikTok y del perfil de Google]` |
| Historia | La idea de Digital X nació en 2018 y el negocio se formalizó en 2021 (datos del dueño; `foundingDate` = 2018) |
| Zonas con traslado incluido (dato interno) | Puebla, Atlixco, Izúcar de Matamoros |
| Zonas con cargo adicional (dato interno) | Tepeaca, San Martín Texmelucan, Amozoc y alrededores |

"Puebla" sola significa la **ciudad** de Puebla. El estado se escribe "estado de Puebla" (por ejemplo, "Atlixco, estado de Puebla"). Solo se nombran en el sitio las zonas de esta tabla, como una sola lista de lugares: "Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores". Los dos grupos (traslado incluido y cargo adicional) son **dato interno**: no se muestran en el sitio.

---

## 2. Reglas de URL (fijas)

1. **Patrón de servicios:** `/servicios-de-{categoría}/{servicio}/`, con categoría = `audio`, `video` o `tecnologia`.
2. **El slug del servicio es lo que la gente busca, sin la ciudad.** La ciudad va en title, H1 y texto, nunca en la URL.
3. **Máximo 3 niveles.** Prohibidos subniveles por municipio o por tipo de evento.
4. **Formato:** minúsculas, sin acentos ni ñ, guiones entre palabras, sin fechas, sin palabras de relleno, barra final siempre.
5. **Una página = una búsqueda principal.** Si dos páginas buscan lo mismo, se fusionan.
6. **Una página nueva solo sale con material real** (fotos, clips o caso).
7. **Una URL publicada no se cambia.** Si hay que hacerlo, va con 301 y se registra en la sección 6.
8. **Páginas institucionales en primer nivel,** sin categoría.
9. **Versión canónica:** `https://digitalx.mx/` (sin www; www redirige 301 a sin www).

---

## 3. Estructura del sitio

```
/                                                   Inicio
/servicios/                                         Hub general (vitrina de las 3 categorías)
│
├─ /servicios-de-audio/                             Categoría Audio
│   └─ /servicios-de-audio/renta-de-audio/          Renta de audio y sonido, y sonorización, para eventos
│
├─ /servicios-de-video/                             Categoría Video
│   ├─ /servicios-de-video/circuito-cerrado/        Circuito cerrado para eventos
│   ├─ /servicios-de-video/grabacion-de-eventos/    Producción de videos para eventos
│   ├─ /servicios-de-video/streaming/               Transmisión en vivo
│   ├─ /servicios-de-video/dron/                    Video con dron
│   └─ /servicios-de-video/recorridos-360/          Recorridos virtuales 360
│
└─ /servicios-de-tecnologia/                        Categoría Tecnología
    ├─ /servicios-de-tecnologia/paginas-web/        Páginas web (páginas de destino y desarrollo web)
    ├─ /servicios-de-tecnologia/apps-moviles/       Desarrollo de apps móviles
    ├─ /servicios-de-tecnologia/desarrollo-de-software/   Desarrollo de software
    └─ /servicios-de-tecnologia/tienda-en-linea/    Tienda en línea

/proyectos/
/blog/                                              Listado de artículos
│   └─ /blog/{slug-del-articulo}/
/nosotros/
/condiciones-de-contratacion/
/politica-de-privacidad/
```

| URL | Estado | Nota |
| --- | --- | --- |
| `/` | Lanzamiento | |
| `/servicios/` | Lanzamiento | |
| `/servicios-de-audio/` | Lanzamiento | |
| `/servicios-de-audio/renta-de-audio/` | Lanzamiento | Renta de audio y sonido, y sonorización, para eventos: usar "audio", "sonido" y "sonorización" en sus textos. La sonorización no tiene página propia |
| `/servicios-de-video/` | Lanzamiento | Misma URL del sitio anterior |
| `/servicios-de-video/circuito-cerrado/` | Lanzamiento | Cámaras en vivo proyectadas en pantallas. No es un sistema de seguridad |
| `/servicios-de-video/grabacion-de-eventos/` | Lanzamiento | Producción de videos para eventos. Antes incluía el circuito cerrado y era el servicio de mayores ingresos `[PENDIENTE: confirmar cuál de los dos lo es hoy]` |
| `/servicios-de-video/streaming/` | Lanzamiento | Transmisión en vivo |
| `/servicios-de-video/dron/` | Lanzamiento | Video con dron |
| `/servicios-de-video/recorridos-360/` | Lanzamiento | Recorridos virtuales 360 |
| `/servicios-de-tecnologia/` | Lanzamiento | |
| `/servicios-de-tecnologia/paginas-web/` | Lanzamiento | Páginas de destino y desarrollo web |
| `/servicios-de-tecnologia/apps-moviles/` | Lanzamiento | Desarrollo de apps móviles |
| `/servicios-de-tecnologia/desarrollo-de-software/` | Lanzamiento | 3 proyectos: SaaS, sitio de compras, e-commerce en desarrollo |
| `/servicios-de-tecnologia/tienda-en-linea/` | Lanzamiento | Tienda en línea |
| `/proyectos/` | Lanzamiento | |
| `/blog/` | **Pendiente de material** | Se publica cuando haya al menos `[PENDIENTE: número mínimo, sugerido 3]` artículos reales. Mientras tanto, la ruta no se genera ni se enlaza |
| `/blog/{slug}/` | Según cada artículo | Un artículo = una búsqueda principal; no puede competir con una página de servicio (regla 5 de la sección 2) |
| `/nosotros/` | Lanzamiento | |
| `/condiciones-de-contratacion/` | Lanzamiento | |
| `/politica-de-privacidad/` | Lanzamiento | |

Los 10 servicios son los oficiales del Perfil de Negocio de Google. Todas las páginas de servicio están en "Lanzamiento", pero **cada una se publica cuando el dueño apruebe sus fotos y videos** (regla 6 de la sección 2: una página nueva solo sale con material real). Mientras una página no esté construida no se enlaza: el Inicio y los demás enlaces llevan a WhatsApp.

Páginas por municipio: **no existen** en esta estructura (ver `reglas-seo-digitalx.md`, sección 2).

---

## 4. Navegación y jerarquía

- **Menú principal** (panel a pantalla completa, sin desplegables): Inicio · Servicios · Proyectos · Nosotros, y Blog cuando `/blog/` esté publicado. Enlaza páginas planeadas aunque no estén construidas (ver sección 0, punto 9); las categorías de servicios se enlazan desde `/servicios/` y desde las tarjetas del Inicio.
- **Pie de página:** las 3 categorías de servicios (Servicios de audio, Servicios de video y Servicios de tecnología), grupo "Digital X" con Proyectos y Nosotros (y Blog cuando esté publicado), grupo "Contacto" con el teléfono y WhatsApp, redes (Facebook, Instagram, TikTok y perfil de Google: solo las que tengan URL real; nunca enlaces vacíos ni con `#`) y texto de cobertura (ver SEO, sección 4). Todas son páginas planeadas, aunque no estén construidas. En la línea inferior, junto al ©, van como enlaces pequeños Condiciones de contratación y Política de privacidad.
- **Cada artículo del blog** enlaza al menos a una página de servicio relacionada, con texto descriptivo.
- **Cada categoría** enlaza a todas sus subpáginas publicadas.
- **Cada subpágina** muestra migas de pan: Inicio › {Categoría} › {Servicio}.
- **No migrar** restos de la plantilla anterior: entrada "Hello world!", menús "Business" y "Company", navegación en inglés.

---

## 5. Qué es cada página y a quién le habla

Una página le habla a **un solo cliente**.

| Página | Cliente | Contenido obligatorio |
| --- | --- | --- |
| Inicio | Servicios por categoría (Audio, Video y Tecnología) | Propuesta: "Un solo proveedor en Puebla, Atlixco e Izúcar de Matamoros para el audio y el video de tu evento, y para la página web, la app o el software de tu negocio" (la frase ya nombra las ciudades). No usar "software a la medida": el servicio se llama "Desarrollo de software". Servicios por categoría: tres tarjetas apiladas (Audio, Video y Tecnología), cada una con su foto, una frase de para quién es y los nombres de sus servicios como texto. Cada tarjeta entera enlaza a la página de su categoría (`/servicios-de-audio/`, `/servicios-de-video/`, `/servicios-de-tecnologia/`); no hay enlaces ni botones por servicio en el Inicio (esos enlaces van en cada página de categoría). Recorridos virtuales 360 va en Video. No hay secciones separadas por tipo de cliente. Proyectos: la sección solo se muestra cuando hay al menos 3 con foto y permiso (si no, no se dibuja). "Por qué Digital X" con ventajas comprobables: personal técnico capacitado, un solo proveedor, equipo y solución según tu evento o proyecto y cotización a la medida. **No se publican topes de personas ni datos del equipo.** Cobertura como lista de lugares (Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores), sin condiciones de traslado ni cargos, y con la invitación a escribir si el evento o proyecto es en otro lugar. Testimonio solo con permiso. FAQ. CTA final a WhatsApp. El botón de la portada es "Ver servicios" (baja a `#servicios`, y a `/servicios/` cuando exista); la portada, Cobertura y FAQ no llevan botón de WhatsApp. |
| `/servicios/` | Cualquiera | Vitrina con las 3 categorías, distinta de la sección de servicios del Inicio (tarjetas apiladas). Portada con foto y H1 "Elige tu servicio de audio, video o tecnología en Puebla"; una frase de introducción con las ciudades; 3 tarjetas de categoría en cuadrícula (foto, nombre, "Para" con una frase, "Servicios" con los nombres como texto —la sonorización va en Audio— y el botón "Ver servicios de {categoría}"; la tarjeta entera es un solo enlace a su categoría); y una cuarta celda "¿No sabes qué servicio necesitas?" con el botón a WhatsApp. Sin preguntas frecuentes ni migas. Mensaje de WhatsApp: general |
| Renta de audio | Organizadores de fiestas, agrupaciones, clases (ej. zumba), conferencias, salones | Renta de audio y sonido, y sonorización, para eventos (usar las tres palabras en los textos). Personal técnico capacitado de principio a fin, equipo y sonorización elegidos según el evento, cotización a la medida y viáticos incluidos en la cotización final. **Sin precios** (decisión del dueño) **y sin topes de personas ni datos del equipo**. En su lugar: ejemplos por tipo de evento, factores que mueven el costo (personas, horas, distancia, equipo), fotos reales, enlace a condiciones de contratación. FAQ. Enlace cruzado a circuito cerrado, producción de videos y transmisión en vivo |
| Circuito cerrado | Instituciones, eventos culturales, conferencias, eventos deportivos | Cámaras en vivo proyectadas en pantallas del lugar. **No es un sistema de seguridad**: aclararlo siempre, y explicarlo junto con "pantallas para eventos" o "proyección en vivo". Pantallas **rentadas a un tercero**: redactar "coordinamos", nunca "tenemos". Precio de referencia: `[PENDIENTE: confirmar a qué servicio aplica "desde $5,000 MXN" (Circuito cerrado, Producción de videos o ambos) y si incluye IVA]` |
| Producción de videos para eventos | Instituciones, eventos culturales, conferencias, deportivos | Grabación y producción del video del evento (la URL es `grabacion-de-eventos`), audio, dron si aplica. Precio de referencia y tiempo de entrega: `[PENDIENTE: ver Circuito cerrado y confirmar el tiempo de entrega]` |
| Transmisión en vivo (streaming) | Organizadores de conferencias, eventos culturales, cultos | Transmisión en vivo en alta definición |
| Video con dron | Eventos y propiedades/turismo | Video aéreo. Permisos de la AFAC: verificar antes de afirmar nada |
| Recorridos virtuales 360 | `[PENDIENTE: a quién le habla]` | Recorridos virtuales 360. `[PENDIENTE: qué incluye y casos]` |
| Servicios de audio (categoría) | Organizadores de fiestas, conferencias, eventos culturales, cultos, clases y salones | Una sola plantilla para las 3 categorías, con datos distintos: migas (Inicio › Categoría), H1 con contador (/1, /2, /3), foto principal con ficha de 3 filas, navegación interna (Qué hacemos, Servicios, Te puede servir), "Qué hacemos" en dos párrafos, una tarjeta por servicio (nombre y una frase; el nombre es enlace solo cuando la página del servicio está construida, si no es texto), "También te puede servir" (la categoría complementaria, `/proyectos/` y `/condiciones-de-contratacion/`), tarjeta de cotización a WhatsApp y 3 o 4 preguntas frecuentes propias. Apunta a "servicios de audio para eventos": "renta de audio y sonido" y "sonorización" se desarrollan en la subpágina (regla 5 de la sección 2). Mensaje de WhatsApp: el de renta de audio. Sin precios, cifras, marcas, topes de personas ni datos del equipo |
| Servicios de video (categoría) | Organizadores de eventos, instituciones y negocios | Misma plantilla. Explica el circuito cerrado como proyección en vivo en pantallas para eventos (que se coordinan) y aclara que no es un sistema de seguridad; distingue circuito cerrado de transmisión en vivo; el video editado se entrega con un tiempo que se confirma al cotizar. Enlaza a Audio y a Tecnología. Mensaje de WhatsApp: general |
| Servicios de tecnología (categoría) | Dueños de negocio | Misma plantilla. Agrupa páginas web, apps móviles (se pueden desarrollar para Android y iPhone), desarrollo de software y tienda en línea; explica que se trabaja por etapas con pago por etapa (igual que las condiciones de contratación). Enlaza a Video. Mensaje de WhatsApp: general |
| Páginas web | Negocios | Páginas de destino y desarrollo web. Validar competencia antes de definir el enfoque |
| Apps móviles | Negocios | Desarrollo de apps móviles. `[PENDIENTE: casos y qué incluye]` |
| Desarrollo de software | Negocios con procesos propios | Los 3 proyectos como casos (problema, solución, resultado), anónimos si no hay permiso. El e-commerce se presenta "en desarrollo" |
| Tienda en línea | Negocios que quieren vender por internet | Tiendas en línea. El e-commerce propio se presenta "en desarrollo" hasta que esté terminado |
| `/proyectos/` | Cualquiera | Portafolio etiquetado por servicio, solo trabajos reales y con permiso |
| `/blog/` | Quien investiga antes de contratar | Artículos útiles y propios (guías, comparativas, consejos para eventos), con fecha y autor. Sin artículos de relleno ni generados sin revisión. Categorías como filtros en la misma página, **sin URL propia** por categoría |
| `/blog/{slug}/` | Una búsqueda informativa concreta | Respuesta completa a una pregunta real, fotos propias cuando existan, enlace a la página de servicio relacionada y CTA |
| `/condiciones-de-contratacion/` | Cliente que va a contratar | Página de texto simple (sin fotos): etiqueta "Legal", H1 "Condiciones de contratación" e intro; "Cotización"; "Servicios de audio y video" (anticipo del 50 %, pago del 50 % restante a más tardar 5 días hábiles antes, cancelación según los días naturales que falten —más de 30 días: se devuelve el 25 % del total; de 16 a 30: no se devuelve el anticipo; 15 o menos: se cubre el total— y hora extra del 15 % del costo del servicio); "Proyectos de tecnología" (planeación y diseño pagados por adelantado y no reembolsables, desarrollo por etapas con pago por etapa, cancelación sin reembolso de las etapas pagadas, entregas por etapa liquidada y proyecto detenido: pausa a los 15 días naturales y cancelación a los 30); "Traslado y viáticos" (costo adicional cuando aplica, desglosado en la cotización, **sin nombrar zonas**: siguen siendo dato interno); "¿Tienes dudas?" con WhatsApp y llamada; y la fecha de "Última actualización" (constante en `content/condiciones.ts`, se cambia con cada edición del texto). Condiciones confirmadas por el dueño. **No se agregan** porcentajes por etapa, penalizaciones con cifra, IVA, facturación ni reprogramaciones. La lista "Aplica a" sale de `lib/servicios.ts`, la misma del Inicio. |
| `/nosotros/` | Cualquiera | Quiénes somos: encabezado con foto; prólogo con línea de tiempo de 3 hitos, cada uno con título y texto (2018: Nace la idea; 2021: Se formaliza Digital X; Hoy: Un solo proveedor); "Qué nos distingue" (3 tarjetas: Equipo profesional, Optimización y Versatilidad); "Lo que nos importa" (manifiesto de 3 puntos: Calidad, Atención y Claridad); proyectos (los del arreglo único de `content/proyectos.ts`: los de ejemplo llevan la etiqueta EJEMPLO y el build de producción falla mientras existan); 5 preguntas frecuentes (con quién han trabajado, audio, video y tecnología en un mismo proyecto, técnico durante el evento, factura y oficina); y un cierre sin formulario con WhatsApp y llamada. **No se publica** nombre, foto ni biografía del dueño, equipo con personas, tamaño del equipo ni cantidad de colaboradores, cifras, precios ni reseñas. |
| `/politica-de-privacidad/` | Cualquiera | Página de texto simple (sin fotos), igual que las condiciones: etiqueta "Legal", H1 "Política de privacidad" e intro; "Responsable" (Digital X como nombre comercial, **sin nombre del dueño ni domicilio por ahora**); "Qué datos recibimos" (nombre y teléfono, datos del evento o proyecto y, si piden factura, datos fiscales; sin datos sensibles); "Para qué los usamos" (cotizar, prestar el servicio, facturar; sin publicidad ni venta); "Con quién los compartimos"; "Este sitio web" (sin formularios, sin cookies de publicidad ni de seguimiento, sin analítica); "Tus derechos" con WhatsApp y llamada; "Cambios a esta política"; y la fecha de "Última actualización" (constante en `content/privacidad.ts`, se cambia con cada edición). **No se agregan** correo, plazos con cifra ni menciones a formularios futuros. **Si el sitio agrega formulario, analítica o cookies, esta página se actualiza antes de publicarlos.** |

Los textos del sitio anterior se pueden reutilizar **corrigiendo** estas erratas: "perzonalizado", "Apicaciones", "de de", "Beneficiese", "siguiente Nivel".

---

## 6. Redirecciones 301 (digitalequis.com → digitalx.mx)

| Antigua | Nueva |
| --- | --- |
| `/` | `/` |
| `/servicios/` | `/servicios/` |
| `/nosotros/` | `/nosotros/` |
| `/contacto/` | `/` (el sitio nuevo no tiene página de contacto, decisión del dueño) |
| `/politica-de-privacidad/` | `/politica-de-privacidad/` |
| `/servicios-de-video/` | `/servicios-de-video/` |
| `/renta-de-audio/` | `/servicios-de-audio/renta-de-audio/` |

- Redirigir cualquier otra URL del dominio viejo a `/`, **nunca** a una página sin relación.
- El dominio viejo debe seguir respondiendo para que el 301 funcione.

---

## 7. Pendientes

**Datos**
- [ ] Correo definitivo en digitalx.mx.
- [ ] URLs de Facebook, Instagram, TikTok y del perfil de Google.
- [ ] 3 o 4 proyectos para el Inicio, con fotos, nombre del lugar y permiso.
- [ ] Autorización de Genaro Ríos (Impact Hub CDMX) para su testimonio con nombre y foto.
- [ ] Marcas y modelos de equipo (ver SEO, sección 8).
- [ ] Casos del portafolio: audio en una iglesia y proyección con pantallas. **No son un servicio**: cuando haya fotos y permiso entrarán en `/proyectos/` como casos de éxito, con su ficha enlazando a la página del servicio que se usó.
- [ ] Casos de software (problema, solución, resultado).
- [ ] Tiempo de entrega del video editado.
- [ ] Precio de referencia "desde $5,000 MXN": a qué servicio aplica (Circuito cerrado, Producción de videos o ambos) y si incluye IVA.
- [ ] Fotos y videos de cada página de servicio, aprobados por el dueño antes de publicarla.
- [ ] **Antes del lanzamiento:** revisión legal de `/condiciones-de-contratacion/` y de la política de privacidad (LFPC y LFPDPPP).
- [ ] **OBLIGATORIO antes del lanzamiento:** el aviso de privacidad debe incluir la identidad y el domicilio del responsable según la LFPDPPP de 2025. El dueño decidió no publicarlos por ahora; resolverlo con la revisión legal (por ejemplo, un domicilio para notificaciones). Mientras tanto la política no los trae.
- [ ] **Antes del lanzamiento:** contrato modelo para audio y video y para tecnología, revisado por un abogado. La cancelación con 15 días o menos y las etapas de tecnología solo son exigibles con contrato firmado.

**Decisiones**
- [ ] A quién le habla y qué incluye Recorridos virtuales 360.
- [ ] ¿Cada proyecto tiene su página (`/proyectos/{slug}/`) o son secciones dentro de `/proyectos/`? **Por defecto: secciones, sin páginas individuales.**
- [ ] ¿Se crea una página única `/cobertura/`? **Por defecto: no.**
- [ ] Número mínimo de artículos para publicar el blog y temas de los primeros artículos.
- [ ] **Fase 3 (Sanity):** cuando el contenido de `SchemaNegocio.astro` venga de Sanity, cambiar `JSON.stringify` por `serializarJsonLd` (`lib/jsonld.ts`), que escapa `<`, `>` y `&` para que ningún texto cierre el `<script>` (seguridad §4).
- [ ] **Fase 4 (sigue sin aplicarse: el hub y las 3 categorías ya están construidos, pero ninguna página de servicio):** al construir la primera página de servicio, enlazar en las tarjetas del Inicio los nombres de los servicios ya construidos. Hoy cada tarjeta entera es un `<a>`, y un enlace dentro de otro no es HTML válido. Propuesta: la tarjeta pasa a `<article>` con el título como enlace extendido a toda la tarjeta (`::after` sobre la tarjeta), y los nombres de servicios construidos como enlaces por encima (`position: relative; z-index: 1`); los demás quedan como texto. El aspecto no cambia y el foco queda en el título. No se programa antes: hoy ningún servicio está construido.
- [ ] Reemplazar los 3 proyectos de ejemplo de `content/proyectos.ts` por proyectos reales (con foto y permiso del cliente) y pasarlos a Sanity en la fase 3, con esa misma forma: título, municipio, servicios, foto, texto corto y permiso.

---

## 8. Criterios de aceptación

- [ ] Existen todas las páginas con estado "Lanzamiento" y ninguna más, con la URL exacta de la sección 3.
- [ ] Ninguna página "Pendiente de material" está publicada ni enlazada.
- [ ] Todos los enlaces internos funcionan y usan texto descriptivo. En desarrollo se permiten los que van a páginas planeadas sin construir; en producción, ninguno.
- [ ] El build de producción falla si queda algún enlace interno a una página sin construir.
- [ ] Las redirecciones de la sección 6 responden 301 al destino correcto.
- [ ] No hay datos inventados: todo hueco aparece como `[PENDIENTE: ...]` y está en el reporte final.
- [ ] Erratas heredadas corregidas y los tres pilares con texto propio.
