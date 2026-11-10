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

1. **Patrón de servicios:** un solo catálogo en `/servicios/` y una página por servicio en `/servicios/{slug}/`. Las categorías (Audio, Video y Tecnología) **no son páginas**: son secciones del catálogo (`/servicios/#audio`, `#video` y `#tecnologia`).
2. **El slug del servicio es lo que la gente busca, sin la ciudad.** La ciudad va en title, H1 y texto, nunca en la URL.
3. **Máximo 2 niveles en servicios** (`/servicios/{slug}/`). Prohibidos subniveles por municipio o por tipo de evento.
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
/servicios/                                         Catálogo: los 10 servicios en 3 secciones (#audio, #video, #tecnologia)
│
├─ /servicios/renta-de-audio/                       Renta de audio y sonido, y sonorización, para eventos
├─ /servicios/circuito-cerrado-para-eventos/        Circuito cerrado para eventos
├─ /servicios/video-para-eventos/                   Producción de videos para eventos
├─ /servicios/streaming-para-eventos/               Transmisión en vivo
├─ /servicios/video-con-drone/                      Video con drone
├─ /servicios/recorridos-virtuales-360/             Recorridos virtuales 360
├─ /servicios/paginas-web/                          Páginas web (páginas de destino y desarrollo web)
├─ /servicios/tienda-en-linea/                      Tienda en línea
├─ /servicios/aplicaciones-moviles/                 Desarrollo de aplicaciones móviles
└─ /servicios/desarrollo-de-software/               Desarrollo de software

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
| `/servicios/` | Lanzamiento | Catálogo. Sustituye a las páginas de categoría (decisión del dueño): `/servicios-de-audio/`, `/servicios-de-video/` y `/servicios-de-tecnologia/` no existen ni se redirigen (nunca se publicaron) |
| `/servicios/renta-de-audio/` | Lanzamiento | Renta de audio y sonido, y sonorización, para eventos: usar "audio", "sonido" y "sonorización" en sus textos. La sonorización no tiene página propia: es una sección de esta |
| `/servicios/circuito-cerrado-para-eventos/` | Lanzamiento | Cámaras en vivo proyectadas en pantallas para eventos |
| `/servicios/video-para-eventos/` | Lanzamiento | Producción de videos para eventos. Antes incluía el circuito cerrado y era el servicio de mayores ingresos `[PENDIENTE: confirmar cuál de los dos lo es hoy]` |
| `/servicios/streaming-para-eventos/` | Lanzamiento | Transmisión en vivo |
| `/servicios/video-con-drone/` | Lanzamiento | Video con drone |
| `/servicios/recorridos-virtuales-360/` | Lanzamiento | Recorridos virtuales 360 |
| `/servicios/paginas-web/` | Lanzamiento | Páginas de destino y desarrollo web |
| `/servicios/tienda-en-linea/` | Lanzamiento | Tienda en línea |
| `/servicios/aplicaciones-moviles/` | Lanzamiento | Desarrollo de aplicaciones móviles |
| `/servicios/desarrollo-de-software/` | Lanzamiento | 3 proyectos: SaaS, sitio de compras, e-commerce en desarrollo |
| `/proyectos/` | Lanzamiento | |
| `/blog/` | **Pendiente de material** | Se publica cuando haya al menos `[PENDIENTE: número mínimo, sugerido 3]` artículos reales. Mientras tanto, la ruta no se genera ni se enlaza |
| `/blog/{slug}/` | Según cada artículo | Un artículo = una búsqueda principal; no puede competir con una página de servicio (regla 5 de la sección 2) |
| `/nosotros/` | Lanzamiento | |
| `/condiciones-de-contratacion/` | Lanzamiento | |
| `/politica-de-privacidad/` | Lanzamiento | |

Los 10 servicios son los oficiales del Perfil de Negocio de Google. Todas las páginas de servicio están en "Lanzamiento", pero **cada una se publica cuando el dueño apruebe sus fotos y videos** (regla 6 de la sección 2: una página nueva solo sale con material real). Mientras una página no esté construida no se enlaza ni se genera (`pages/servicios/[slug].astro` solo genera las construidas en `lib/paginas.ts`): el catálogo y la guía "¿Qué servicios necesito?" la muestran como texto o la enlazan a su tarjeta (`/servicios/#slug`), y la tarjeta de su categoría en el Inicio la nombra sin enlace. El nombre de cada servicio y su estado viven solo en `lib/paginas.ts`; sus textos, en `content/servicios.ts`.

Páginas por municipio: **no existen** en esta estructura (ver `reglas-seo-digitalx.md`, sección 2).

---

## 4. Navegación y jerarquía

- **Menú principal** (panel a pantalla completa, sin desplegables): Inicio · Servicios · Proyectos · Nosotros, y Blog cuando `/blog/` esté publicado. Enlaza páginas planeadas aunque no estén construidas (ver sección 0, punto 9); las categorías de servicios son secciones de `/servicios/` y se enlazan desde las tarjetas del Inicio y desde el pie.
- **Pie de página:** las 3 categorías de servicios (Servicios de audio, Servicios de video y Servicios de tecnología), que llevan a `/servicios/#audio`, `#video` y `#tecnologia`, grupo "Digital X" con Proyectos y Nosotros (y Blog cuando esté publicado), grupo "Contacto" con el teléfono y WhatsApp, redes (Facebook, Instagram, TikTok y perfil de Google: solo las que tengan URL real; nunca enlaces vacíos ni con `#`) y texto de cobertura (ver SEO, sección 4). Todas son páginas planeadas, aunque no estén construidas. En la línea inferior, junto al ©, van como enlaces pequeños Condiciones de contratación y Política de privacidad.
- **Cada artículo del blog** enlaza al menos a una página de servicio relacionada, con texto descriptivo.
- **El catálogo** (`/servicios/`) muestra los 10 servicios en sus 3 secciones y enlaza a cada página de servicio publicada. Muestra migas de pan: Inicio › Servicios.
- **Cada página de servicio** muestra migas de pan: Inicio › Servicios › {Servicio}, y enlaza a `/servicios/`, a `/proyectos/` y a un servicio complementario.
- **No migrar** restos de la plantilla anterior: entrada "Hello world!", menús "Business" y "Company", navegación en inglés.

---

## 5. Qué es cada página y a quién le habla

Una página le habla a **un solo cliente**.

| Página | Cliente | Contenido obligatorio |
| --- | --- | --- |
| Inicio | Servicios por categoría (Audio, Video y Tecnología) | Propuesta: "Un solo proveedor en Puebla, Atlixco e Izúcar de Matamoros para el audio y el video de tu evento, y para la página web, la app o el software de tu negocio" (la frase ya nombra las ciudades). No usar "software a la medida": el servicio se llama "Desarrollo de software". Servicios por categoría: tres tarjetas apiladas (Audio, Video y Tecnología), cada una con su foto, una frase de para quién es y los nombres de sus servicios como texto. Cada tarjeta entera lleva a su sección del catálogo (`/servicios/#audio`, `/servicios/#video`, `/servicios/#tecnologia`) con un enlace extendido en el título (un solo `<a>`, sin enlaces anidados). Los nombres de servicio de la tarjeta son enlaces a su página solo cuando está construida; si no, son texto. No hay botones por servicio en el Inicio. Recorridos virtuales 360 va en Video. No hay secciones separadas por tipo de cliente. Proyectos: la sección solo se muestra cuando hay al menos 3 con foto y permiso (si no, no se dibuja). "Por qué Digital X" con ventajas comprobables: personal técnico capacitado, un solo proveedor, equipo y solución según tu evento o proyecto y cotización a la medida. **No se publican topes de personas ni datos del equipo.** Cobertura como lista de lugares (Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores), sin condiciones de traslado ni cargos, y con la invitación a escribir si el evento o proyecto es en otro lugar. Testimonio solo con permiso. FAQ. CTA final a WhatsApp. El botón de la portada es "Ver servicios" (va a `/servicios/`); la portada, Cobertura y FAQ no llevan botón de WhatsApp. |
| `/servicios/` | Cualquiera | Catálogo, distinto de la sección de servicios del Inicio (tarjetas apiladas). Migas Inicio › Servicios y portada con foto y H1 "Servicios de audio, video y tecnología en Puebla"; una introducción con las ciudades y la invitación a cotizar por WhatsApp; barra de salto "Todos · Audio · Video · Tecnología" (enlaces a las secciones, no un filtro: todo el contenido está en el HTML y funciona sin JavaScript); 3 secciones (`#audio`, `#video`, `#tecnologia`) con su H2, una línea "Para" y una tarjeta por servicio (foto, nombre en H3, número, descripción corta y las filas "Para" e "Incluye"; con `id` = slug; enlaza a su página solo si está construida); la guía "¿Qué servicios necesito para mi evento?" (5 casos: conferencia o evento corporativo, evento con mucho público, evento para compartir en línea, dar a conocer un lugar o negocio, presencia en internet; cada nombre enlaza a su página si está construida y, si no, a su tarjeta); y el cierre con WhatsApp y llamada. Entre 400 y 600 palabras visibles. Datos estructurados: `CollectionPage` con `ItemList` solo de los servicios publicados (sin `ItemList` mientras no haya ninguno) y `BreadcrumbList`. Mensaje de WhatsApp: general |
| Renta de audio y sonido (`renta-de-audio`) | Organizadores de fiestas, agrupaciones, clases (ej. zumba), conferencias, salones | Renta de audio y sonido, y sonorización, para eventos (usar las tres palabras en los textos). Personal técnico capacitado de principio a fin, equipo y sonorización elegidos según el evento, cotización a la medida y viáticos incluidos en la cotización final. **Sin precios** (decisión del dueño) **y sin topes de personas ni datos del equipo**. En su lugar: ejemplos por tipo de evento, factores que mueven el costo (personas, horas, distancia, equipo), fotos reales, enlace a condiciones de contratación. FAQ. Enlace cruzado a circuito cerrado, producción de videos y transmisión en vivo. Sección propia "Sonorización" (sin página aparte). Mensaje de WhatsApp: el de renta de audio |
| Circuito cerrado para eventos (`circuito-cerrado-para-eventos`) | Instituciones, eventos culturales, conferencias, eventos deportivos | Cámaras en vivo proyectadas en pantallas del lugar, para que todo el público vea el escenario. **No se menciona seguridad ni vigilancia**: "circuito cerrado" va siempre con "para eventos", "en vivo" o "pantallas". Las pantallas (LED o televisores) y la planta de luz son de **proveedores**: se coordinan y van en la cotización; redactar "coordinamos", nunca "nuestras pantallas", "tenemos" ni "equipo propio". **No se ofrece proyector** y no se menciona. **No se menciona si graba o no.** Se usa también en exteriores. Qué incluye (confirmado por el dueño): personal que opera las cámaras durante el evento, una o varias cámaras en vivo según el evento, la imagen en vivo en las pantallas del lugar, pantallas para eventos si se necesitan (las coordinamos y van incluidas en la cotización) y montaje e instalación del equipo. Requiere acceso a corriente eléctrica de 110 V; si el lugar no tiene energía, se revisa al cotizar y, si hace falta, se coordina una planta de luz con un proveedor. Si el audio del evento es de otro proveedor, nos coordinamos con él para integrarlo. El video del evento va por Producción de videos para eventos. Una sección extra, "Pantalla LED o televisor" (un televisor puede quedarse corto en un salón grande, con mucha luz conviene LED y una pantalla más grande no siempre es mejor; se revisa al cotizar); sin galería hasta que haya fotos reales; 5 preguntas frecuentes propias. Mensaje de WhatsApp: el de circuito cerrado. Precio de referencia: `[PENDIENTE: confirmar a qué servicio aplica "desde $5,000 MXN" (Circuito cerrado, Producción de videos o ambos) y si incluye IVA]`; no se publica |
| Producción de videos para eventos (`video-para-eventos`) | Instituciones, empresas, organizadores de conferencias, talleres, eventos corporativos, culturales y religiosos, y ceremonias | Grabación de video de eventos y videos institucionales, corporativos y promocionales **dentro de esta misma página**. **Sin eventos sociales** (bodas, XV años, bautizos, fiestas) por ahora. Cobertura de un equipo de **al menos dos personas y hasta tres cámaras** (excepción a la regla de no publicar datos del equipo; sin marcas), por hora (lo más común), por un tiempo específico o solo momentos clave, con una o varias cámaras. Audio directo de la consola del evento cuando el lugar lo permite. Se entrega el video editado; el material sin editar, si se acuerda al cotizar. **No se publican plazos de entrega ni precios**: el plazo se acuerda al cotizar y la página solo lista de qué depende el precio. Secciones: Para qué eventos, Opciones de cobertura, Video institucional, corporativo y promocional, Qué recibes y cuándo, De qué depende el precio y Proyectos (hasta 3, con la etiqueta EJEMPLO mientras sean de ejemplo; sin proyectos no se dibuja). Sin "Cómo trabajamos" ni "Dónde trabajamos" (ya están en condiciones y en el Inicio). 5 preguntas frecuentes sin repetir lo que dicen las secciones. Mensaje de WhatsApp: el de video para un evento o un video promocional. Precio de referencia: `[PENDIENTE: ver Circuito cerrado]`; no se publica |
| Transmisión en vivo (`streaming-para-eventos`) | Organizadores de conferencias, talleres, eventos corporativos, culturales, religiosos, escolares y deportivos, e instituciones | Streaming de eventos en vivo por Facebook, YouTube y otras plataformas, a una o varias páginas. Cámaras: **"una o varias, según tu evento"** y personal que las opera (excepción a la regla de datos del equipo; nunca "multicámara" ni cifras de cámaras). **No se promete "alta definición" ni velocidades**, ni se publican marcas, plazos, precios, cifras de asistentes ni límites de horas. Audio de preferencia directo de la consola del evento. Revisión del lugar y pruebas antes del evento. Rótulos, logos o diseños en pantalla según el paquete. **El internet es de un proveedor**: si el lugar no tiene buena conexión, se coordina con él (nunca "nuestro internet" ni "tenemos"). La grabación de la transmisión se puede entregar con costo extra. Producción de videos y circuito cerrado son servicios aparte que se pueden sumar. Secciones: Para qué eventos y De qué depende el precio; proyectos (hasta 3, con EJEMPLO mientras sean de ejemplo). Sin "Qué no incluye", "Cómo trabajamos" ni "Dónde trabajamos". 5 preguntas frecuentes sin repetir lo que dicen las secciones ni la nota (WiFi, caída del internet o la plataforma, música con derechos de autor, retraso y plataformas). Mensaje de WhatsApp: el de transmisión en vivo |
| Video con drone (`video-con-drone`) | Eventos, empresas y espacios | **Video y fotografía aérea** con drone, en exteriores e interiores, para eventos (conferencias, ceremonias, eventos culturales y deportivos), empresas y negocios (instalaciones y videos promocionales) y espacios (hoteles, restaurantes, escuelas y museos, combinables con un recorrido virtual 360). Se planean las tomas con el cliente y se **revisa el lugar y las condiciones antes de volar**; el clima se resuelve según el caso. Entrega: video editado, tomas sin editar o ambos, y fotografía aérea, según lo acordado en la cotización. Las tomas se hacen en los momentos clave (no se graba todo el evento de corrido). **Sin afirmaciones legales** (permisos, normas, autorizaciones, certificaciones ni registros), **sin la AFAC ni la autoridad aeronáutica**, sin peso, modelos, marcas ni cifras de baterías, y sin decir si se vuela sobre personas. **No se ofrecen espectáculos de drones con luces.** La única mención de reglas de vuelo: hay zonas restringidas, como las cercanas a aeropuertos. Sin bodas, XV años ni fiestas; sin plazos ni precios. Secciones: Fotografía aérea, Para qué sirve, Exteriores e interiores y De qué depende el precio; proyectos (hasta 3, con EJEMPLO mientras sean de ejemplo). 5 preguntas frecuentes sin repetir lo que dicen las secciones. Mensaje de WhatsApp: el de video o fotografía aérea con drone |
| Recorridos virtuales 360 (`recorridos-virtuales-360`) | Negocios, hoteles, restaurantes, escuelas, museos y otros espacios | **Un recorrido virtual es un conjunto de fotos 360 enlazadas** que el cliente recorre desde el celular o la computadora (no es un video). Se capturan con drone y, para interiores, con cámara 360 **cuando el proyecto lo requiere** (no se afirma equipo propio). Incluye planeación del recorrido, captura, unión de las imágenes y enlace de los puntos, **puntos de información** si se necesitan, y entrega con **un enlace para compartir** y, según la plataforma, **un código para insertarlo** en la página web. **La plataforma donde se aloja tiene un costo aparte** (sin nombrarla). **Google Maps:** un recorrido no aparece automáticamente en Google; lo que se puede publicar en Google Maps son **fotos 360** del lugar, con apoyo de Digital X y **incluido en el servicio si no tiene costo**. Nunca se promete el recorrido completo en Google Maps ni se sugiere relación con Google. Se puede combinar con video con drone y con producción de videos. Sin marcas ni nombres de plataformas, plazos, precios, bodas, XV años ni fiestas. Secciones: Google Maps, Para qué sirve, Cómo lo hacemos y De qué depende el precio. Sin proyectos hasta que haya uno con la etiqueta de este servicio. 5 preguntas frecuentes sin repetir lo que dicen las secciones ni la nota. Mensaje de WhatsApp: el de recorrido virtual 360. `[PENDIENTE: casos]` |
| Páginas web (`paginas-web`) | Negocios | Páginas de destino y desarrollo web. Validar competencia antes de definir el enfoque |
| Desarrollo de aplicaciones móviles (`aplicaciones-moviles`) | Negocios e instituciones | Aplicaciones móviles según lo que necesite el proyecto, para Android y iPhone, del levantamiento de requerimientos a la implementación. `[PENDIENTE: casos]` |
| Desarrollo de software (`desarrollo-de-software`) | Negocios con procesos propios | Sistemas hechos para los procesos propios del negocio (no usar "a la medida"). Trabajo por etapas con pago por etapa, como las condiciones de contratación. Los 3 proyectos como casos (problema, solución, resultado), anónimos si no hay permiso. El e-commerce se presenta "en desarrollo" |
| Tienda en línea (`tienda-en-linea`) | Negocios que quieren vender por internet | Tiendas en línea. El e-commerce propio se presenta "en desarrollo" hasta que esté terminado |
| `/proyectos/` | Cualquiera | Portafolio etiquetado por servicio, solo trabajos reales y con permiso |
| `/blog/` | Quien investiga antes de contratar | Artículos útiles y propios (guías, comparativas, consejos para eventos), con fecha y autor. Sin artículos de relleno ni generados sin revisión. Categorías como filtros en la misma página, **sin URL propia** por categoría |
| `/blog/{slug}/` | Una búsqueda informativa concreta | Respuesta completa a una pregunta real, fotos propias cuando existan, enlace a la página de servicio relacionada y CTA |
| `/condiciones-de-contratacion/` | Cliente que va a contratar | Página de texto simple (sin fotos): etiqueta "Legal", H1 "Condiciones de contratación" e intro; "Cotización"; "Servicios de audio y video" (anticipo del 50 %, pago del 50 % restante a más tardar 5 días hábiles antes, cancelación según los días naturales que falten —más de 30 días: se devuelve el 25 % del total; de 16 a 30: no se devuelve el anticipo; 15 o menos: se cubre el total— y hora extra del 15 % del costo del servicio); "Proyectos de tecnología" (planeación y diseño pagados por adelantado y no reembolsables, desarrollo por etapas con pago por etapa, cancelación sin reembolso de las etapas pagadas, entregas por etapa liquidada y proyecto detenido: pausa a los 15 días naturales y cancelación a los 30); "Traslado y viáticos" (costo adicional cuando aplica, desglosado en la cotización, **sin nombrar zonas**: siguen siendo dato interno); "¿Tienes dudas?" con WhatsApp y llamada; y la fecha de "Última actualización" (constante en `content/condiciones.ts`, se cambia con cada edición del texto). Condiciones confirmadas por el dueño. **No se agregan** porcentajes por etapa, penalizaciones con cifra, IVA, facturación ni reprogramaciones. La lista "Aplica a" sale de `lib/servicios.ts`, la misma del Inicio. |
| `/nosotros/` | Cualquiera | Quiénes somos: encabezado con foto; prólogo con línea de tiempo de 3 hitos, cada uno con título y texto (2018: Nace la idea; 2021: Se formaliza Digital X; Hoy: Un solo proveedor); "Qué nos distingue" (3 tarjetas: Equipo profesional, Optimización y Versatilidad); "Lo que nos importa" (manifiesto de 3 puntos: Calidad, Atención y Claridad); proyectos (los del arreglo único de `content/proyectos.ts`: los de ejemplo llevan la etiqueta EJEMPLO y el build de producción falla mientras existan); 5 preguntas frecuentes (con quién han trabajado, audio, video y tecnología en un mismo proyecto, técnico durante el evento, factura y oficina); y un cierre sin formulario con WhatsApp y llamada. **No se publica** nombre, foto ni biografía del dueño, equipo con personas, tamaño del equipo ni cantidad de colaboradores, cifras, precios ni reseñas. |
| `/politica-de-privacidad/` | Cualquiera | Página de texto simple (sin fotos), igual que las condiciones: etiqueta "Legal", H1 "Política de privacidad" e intro; "Responsable" (Digital X como nombre comercial, **sin nombre del dueño ni domicilio por ahora**); "Qué datos recibimos" (nombre y teléfono, datos del evento o proyecto y, si piden factura, datos fiscales; sin datos sensibles); "Para qué los usamos" (cotizar, prestar el servicio, facturar; sin publicidad ni venta); "Con quién los compartimos"; "Este sitio web" (sin formularios, sin cookies de publicidad ni de seguimiento, sin analítica); "Tus derechos" con WhatsApp y llamada; "Cambios a esta política"; y la fecha de "Última actualización" (constante en `content/privacidad.ts`, se cambia con cada edición). **No se agregan** correo, plazos con cifra ni menciones a formularios futuros. **Si el sitio agrega formulario, analítica o cookies, esta página se actualiza antes de publicarlos.** |

**Plantilla de página de servicio** (la misma para los 10): migas Inicio › Servicios › {Servicio}; H1 con el número del catálogo; foto principal con la categoría y una ficha de 3 filas; navegación interna (Descripción, Qué incluye, secciones extra como Sonorización y Te puede servir); descripción; lista de lo que incluye (solo lo confirmado); "También te puede servir" (servicios complementarios, `/proyectos/` y `/condiciones-de-contratacion/`); tarjeta de cotización a WhatsApp; preguntas frecuentes propias (no se dibujan si no hay); galería por secciones (solo con fotos reales); cierre con WhatsApp y llamada. Datos estructurados: `Service` con `areaServed` y proveedor por `@id`, `BreadcrumbList` y `FAQPage`. Sin tarjeta de asesor ni mapa.

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
| `/servicios-de-video/` | `/servicios/streaming-para-eventos/` (un solo salto; la categoría ya no es una página. La página vieja aparece en tercer lugar en Google para "streaming para eventos puebla" y "streaming profesional puebla"; revisar con Search Console) |
| `/renta-de-audio/` | `/servicios/renta-de-audio/` |

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
- [x] Tiempo de entrega del video editado: no se publica; el plazo se acuerda al cotizar.
- [ ] Precio de referencia "desde $5,000 MXN": a qué servicio aplica (Circuito cerrado, Producción de videos o ambos) y si incluye IVA.
- [ ] Fotos y videos de cada página de servicio, aprobados por el dueño antes de publicarla.
- [ ] **Antes del lanzamiento:** revisión legal de `/condiciones-de-contratacion/` y de la política de privacidad (LFPC y LFPDPPP).
- [ ] **OBLIGATORIO antes del lanzamiento:** el aviso de privacidad debe incluir la identidad y el domicilio del responsable según la LFPDPPP de 2025. El dueño decidió no publicarlos por ahora; resolverlo con la revisión legal (por ejemplo, un domicilio para notificaciones). Mientras tanto la política no los trae.
- [ ] **Antes del lanzamiento:** las 301 por ruta de `digitalequis.com` (sección 6) solo funcionan si ese dominio apunta a Vercel: el reenvío de GoDaddy es solo de dominio completo y no conserva la ruta. Apuntar el dominio a Vercel (con el DNS que se elija), agregar las redirecciones en la configuración del proyecto y verificarlas.
- [ ] **Antes del lanzamiento:** contrato modelo para audio y video y para tecnología, revisado por un abogado. La cancelación con 15 días o menos y las etapas de tecnología solo son exigibles con contrato firmado.
- [ ] **Recorridos virtuales 360 y la CSP:** hoy la página no incrusta ningún recorrido. Si se muestra uno dentro de digitalx.mx (con un `iframe`), habrá que permitir esa plataforma en la `Content-Security-Policy` de `apps/web/vercel.json`: hoy es `default-src 'self'` (en modo solo reportar) y bloquearía el marco. Agregar `frame-src` con el dominio de la plataforma que se elija antes de publicarlo, y anotar ese origen en la política de `docs/reglas-seguridad-digitalx.md` (sección de encabezados HTTP).

**Decisiones**
- [x] A quién le habla y qué incluye Recorridos virtuales 360: ver la fila de la sección 5.
- [ ] ¿Cada proyecto tiene su página (`/proyectos/{slug}/`) o son secciones dentro de `/proyectos/`? **Por defecto: secciones, sin páginas individuales.**
- [ ] ¿Se crea una página única `/cobertura/`? **Por defecto: no.**
- [ ] Número mínimo de artículos para publicar el blog y temas de los primeros artículos.
- [ ] **Fase 3 (Sanity):** cuando el contenido de `SchemaNegocio.astro` venga de Sanity, cambiar `JSON.stringify` por `serializarJsonLd` (`lib/jsonld.ts`), que escapa `<`, `>` y `&` para que ningún texto cierre el `<script>` (seguridad §4).
- [x] **Fase 4:** los nombres de servicio dentro de las tarjetas del Inicio enlazan a su página solo si está construida. La tarjeta pasó de `<a>` a `<article>` con el título como enlace extendido a toda la tarjeta (`::after`) y los nombres como enlaces por encima (`position: relative; z-index: 1`); los demás quedan como texto. El aspecto no cambia. Hoy están construidas `renta-de-audio`, `circuito-cerrado-para-eventos`, `video-para-eventos`, `streaming-para-eventos`, `video-con-drone` y `recorridos-virtuales-360`.
- [ ] Reemplazar los 3 proyectos de ejemplo de `content/proyectos.ts` por proyectos reales (con foto y permiso del cliente) y pasarlos a Sanity en la fase 3, con esa misma forma: título, municipio, servicios, foto, texto corto y permiso.

**Fase 3 (Sanity): servicios**

Los servicios se editarán desde Sanity (agregar un servicio o cambiar lo que incluye sin tocar código). Hoy los componentes no llevan nada específico de un servicio (ni `if` por slug ni secciones fijas por servicio): `PaginaServicio.astro`, `TarjetaServicio.astro`, `Servicios.astro` (Inicio) y el catálogo leen todo de datos. Los tipos de `content/servicios.ts` están pensados para pasar 1 a 1 a un esquema de Sanity.

*Cómo se mapea cada dato a Sanity*

| Hoy (archivo y campo) | En Sanity | Nota |
| --- | --- | --- |
| `lib/paginas.ts`: `url` (`/servicios/{slug}/`) | `servicio.slug` (tipo `slug`, único) | La URL se arma con el slug. Validación: minúsculas, guiones, sin acentos (sección 2). |
| `lib/paginas.ts`: `titulo` | `servicio.nombre` (`string`) | Es el nombre oficial del servicio y el texto de los enlaces. |
| `lib/paginas.ts`: `categoria` | `servicio.categoria` (referencia a `categoriaDeServicios`) | |
| Posición en el arreglo de `paginas.ts` | `servicio.orden` (`number`) | Define el orden del catálogo, el número [01] y la lista de nombres del Inicio y de las condiciones. |
| `lib/paginas.ts`: `construida` (y `estado: 'lanzamiento'`) | `servicio.publicada` (`boolean`) | No se puede marcar sin que el contenido esté completo (lo que hoy revisa `faltantesDePagina`). |
| `descripcion`, `title`, `meta`, `h1`, `para`, `incluye`, `serviceType` | Campos `string` o `text` del mismo nombre | `serviceType` es opcional. Los límites de `title` (60) y de `meta` (155) van como validación del campo. |
| `mensaje` (clave de `mensajesWhatsApp` en `negocio.ts`) | `servicio.mensajeWhatsApp` (`text`) | El texto del mensaje pasa de `negocio.ts` al servicio; el mensaje general queda en los ajustes del negocio. |
| `pagina.ficha` | `servicio.ficha`: arreglo de objetos `{ etiqueta, valor }` | Exactamente 3 filas (validación). |
| `pagina.descripcion` | Objeto `{ titulo, parrafos }`; `parrafos` es un arreglo de `text` | |
| `pagina.incluye` | Arreglo de `string` | |
| `pagina.incluyeNota` (texto con enlaces) | Arreglo de objetos de dos tipos: `trozoTexto { texto }` y `trozoServicio { servicio, texto }` | `servicio` es una **referencia** al documento `servicio`; el enlace sale de su `publicada` (su página) o de su tarjeta (`/servicios/#slug`), como hoy en `enlaceDeServicio`. No se usa Portable Text para conservar esta forma. |
| `pagina.secciones` (`id`, `etiqueta`, `titulo`, `bloques`) | Arreglo de objetos `{ id, etiqueta, titulo, bloques }` | `id` sale del título (campo `slug`). |
| `bloques`: `{ parrafo }`, `{ lista }`, `{ puntos }` | Arreglo con tres tipos de objeto: `bloqueParrafo { texto }`, `bloqueLista { items: string[] }` y `bloquePuntos { items: { titulo, texto }[] }` | El orden del arreglo es el orden en la página. El `texto` de un punto puede llevar enlaces a servicios (hoy `string` o `TextoConEnlaces`): en Sanity es un arreglo de `trozoTexto` y `trozoServicio`, como `incluyeNota`. |
| `pagina.tambien` (`intro`, `items`) | Objeto `{ intro, items }`; cada item es `relacionadoServicio { servicio, texto }` (referencia) o `relacionadoPagina { titulo, ruta, texto }` | `ruta` solo acepta páginas del registro (`/proyectos/`, `/condiciones-de-contratacion/`): validación personalizada. |
| `pagina.cotizacion`, `pagina.cierre` | Objetos `{ etiqueta, texto }` y `{ titulo, texto }` | |
| `pagina.faq` | Arreglo de objetos `{ pregunta, respuesta }` | El `FAQPage` se sigue armando de la misma lista que se ve. |
| `servicios-fotos.ts`: foto principal (`src`, `alt`) | `servicio.foto`: `image` con un campo `alt` obligatorio | Se pide en WebP o AVIF con `auto=format` y nombre descriptivo (SEO sección 6); `width` y `height` salen del archivo. |
| `servicios-fotos.ts`: `galeria` | Arreglo de objetos `{ titulo, fotos }`; `fotos` es un arreglo de `image` con `alt` | Si queda vacío, la galería y su botón no se dibujan. |
| `servicios-fotos.ts`: `fotoCierre`, `fotoPortada` | Documento único `ajustesDeServicios` (o campos del catálogo) | Son compartidas por todos los servicios. |
| Protección de fotos `temporal-*` | Un campo `foto.esTemporal` (`boolean`) o una regla de publicación | Sin archivos `temporal-` el build ya no puede detectarlas por el nombre; la regla debe impedir publicar con foto temporal. |
| `catalogo.secciones` (`id`, `categoria`, `etiqueta`, `titulo`, `para`, `sinPagina`) | Documento `categoriaDeServicios` | `sinPagina` es el arreglo de nombres sin página (hoy, la sonorización de Audio). `etiqueta` es también el chip de cada servicio y `titulo` el `serviceType` por defecto. |
| `catalogo` (`title`, `descripcion`, `h1`, `intro`, `cierre`) | Documento único `catalogo` | Su title y su meta no cambian sin aprobación (SEO sección 1). |
| `catalogo.guia` (`escenario`, `slugs`) | Dentro de `catalogo`: arreglo de objetos `{ escenario, servicios }`; `servicios` es un arreglo de **referencias** a `servicio` | |
| `content/proyectos.ts`: `servicios` (nombres en texto) | `proyecto.servicios`: arreglo de **referencias** a `servicio` | La página de cada servicio trae hasta 3 proyectos que lo referencian (`references(^._id)`); hoy los compara por el nombre exacto. |

*Cómo se agrega un servicio*

1. **Hoy** depende de tres archivos:
   - `lib/paginas.ts`: una entrada nueva (`url`, `titulo`, `estado`, `construida: false`, `categoria`) en la posición que debe ocupar.
   - `content/servicios.ts`: el slug en `slugs` y su entrada en `servicios` (`faltantesDePagina` dice qué falta para publicarla), más su mensaje en `negocio.ts` (y en reglas-seo sección 11).
   - `content/servicios-fotos.ts`: su foto y, si hay, su galería.
   - Para publicarlo, `construida: true`. Las listas del catálogo, el Inicio, las condiciones y la guía salen de esos datos.
2. **En la fase 3** se crea el documento `servicio` en Sanity, se llena y se publica (`publicada`) cuando pasa las validaciones; un webhook dispara el rebuild. No se toca código, `paginas.ts` ni `servicios-fotos.ts`. `paginas.ts` queda solo con las páginas de código (Inicio, Nosotros, condiciones y privacidad, catálogo, Proyectos y Blog); `pages/servicios/[slug].astro` genera una página por cada servicio publicado en Sanity y los tipos `Slug` y `slugs` desaparecen (se generan con los tipos de Sanity).

*Pruebas que pasan a ser validaciones del esquema*

- Las pruebas de `content/servicios.test.mjs` que fijan textos o formato de un servicio pasan a ser **validaciones del esquema de Sanity** en la fase 3: límites de `title` (60) y de `meta` (155), zona y cierre de la meta, ficha de 3 filas, "Qué incluye" exacto de un servicio, orden y `id` de las secciones, y los barridos de vocabulario ("seguridad", "vigilancia", "proyector", "nuestras pantallas", "tenemos pantallas", "equipo propio", eventos sociales, plazos, precios, marcas, "dron", "apps" y "a la medida" en software).
- Las que comparan varios textos (oraciones repetidas entre páginas, o entre las secciones y las FAQ de un servicio) no caben en la validación de un campo: pasan a una verificación del build sobre los datos que llegan de Sanity.

---

## 8. Criterios de aceptación

- [ ] Existen todas las páginas con estado "Lanzamiento" y ninguna más, con la URL exacta de la sección 3.
- [ ] Ninguna página "Pendiente de material" está publicada ni enlazada.
- [ ] Todos los enlaces internos funcionan y usan texto descriptivo. En desarrollo se permiten los que van a páginas planeadas sin construir; en producción, ninguno.
- [ ] El build de producción falla si queda algún enlace interno a una página sin construir.
- [ ] Las redirecciones de la sección 6 responden 301 al destino correcto.
- [ ] No hay datos inventados: todo hueco aparece como `[PENDIENTE: ...]` y está en el reporte final.
- [ ] Erratas heredadas corregidas y los tres pilares con texto propio.
