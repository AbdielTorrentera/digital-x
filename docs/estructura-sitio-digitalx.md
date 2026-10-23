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

---

## 1. Datos del negocio

| Dato | Valor |
| --- | --- |
| Nombre | Digital X |
| Dominio nuevo | digitalx.mx |
| Dominio anterior | digitalequis.com (se redirige con 301) |
| Ubicación | Atlixco, Puebla. **Sin dirección pública** |
| Teléfono | +52 244 124 4913 |
| WhatsApp | 522441244913 (el número 244 137 1957 ya no se usa) |
| Correo | `[PENDIENTE: correo definitivo en digitalx.mx]` |
| Redes | `[PENDIENTE: URL de Facebook e Instagram]` |
| Zonas confirmadas | Atlixco, Izúcar de Matamoros |
| Radio objetivo | ~50 km desde Atlixco. Un municipio solo se nombra en el sitio si el dueño lo confirma |
| Zonas por confirmar | Puebla (capital), Amozoc, Tepeaca: `[PENDIENTE: confirmar si se cubren]` |

"Puebla" en frases como "Atlixco, Puebla" se refiere siempre al estado.

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
│   ├─ /servicios-de-audio/renta-de-sonido/
│   └─ /servicios-de-audio/instalacion-de-audio/
│
├─ /servicios-de-video/                             Categoría Video
│   ├─ /servicios-de-video/grabacion-de-eventos/    (incluye circuito cerrado)
│   ├─ /servicios-de-video/video-para-redes/        (incluye edición)
│   ├─ /servicios-de-video/streaming/
│   └─ /servicios-de-video/dron/
│
└─ /servicios-de-tecnologia/                        Categoría Tecnología
    ├─ /servicios-de-tecnologia/software-a-la-medida/
    ├─ /servicios-de-tecnologia/sitios-web/
    └─ /servicios-de-tecnologia/tienda-en-linea/

/proyectos/
/blog/                                              Listado de artículos
│   └─ /blog/{slug-del-articulo}/
/nosotros/
/contacto/
/condiciones-de-contratacion/
/politica-de-privacidad/
```

| URL | Estado | Nota |
| --- | --- | --- |
| `/` | Lanzamiento | |
| `/servicios/` | Lanzamiento | |
| `/servicios-de-audio/` | Lanzamiento | |
| `/servicios-de-audio/renta-de-sonido/` | Lanzamiento | Slug provisional: validar "sonido" vs "audio" en el autocompletado de Google |
| `/servicios-de-audio/instalacion-de-audio/` | Lanzamiento | Ya hay 2 casos reales (iglesia, proyección con pantallas) |
| `/servicios-de-video/` | Lanzamiento | Misma URL del sitio anterior |
| `/servicios-de-video/grabacion-de-eventos/` | Lanzamiento | Servicio de mayores ingresos |
| `/servicios-de-video/video-para-redes/` | Lanzamiento | Slug provisional |
| `/servicios-de-video/streaming/` | Lanzamiento | |
| `/servicios-de-video/dron/` | **Pendiente de material** | Publicar con los primeros trabajos |
| `/servicios-de-tecnologia/` | Lanzamiento | |
| `/servicios-de-tecnologia/software-a-la-medida/` | Lanzamiento | 3 proyectos: SaaS, sitio de compras, e-commerce en desarrollo |
| `/servicios-de-tecnologia/sitios-web/` | Lanzamiento | |
| `/servicios-de-tecnologia/tienda-en-linea/` | **Pendiente de material** | Publicar cuando el e-commerce esté terminado |
| `/proyectos/` | Lanzamiento | |
| `/blog/` | **Pendiente de material** | Se publica cuando haya al menos `[PENDIENTE: número mínimo, sugerido 3]` artículos reales. Mientras tanto, la ruta no se genera ni se enlaza |
| `/blog/{slug}/` | Según cada artículo | Un artículo = una búsqueda principal; no puede competir con una página de servicio (regla 5 de la sección 2) |
| `/nosotros/` | Lanzamiento | |
| `/contacto/` | Lanzamiento | |
| `/condiciones-de-contratacion/` | Lanzamiento | |
| `/politica-de-privacidad/` | Lanzamiento | |

Páginas por municipio: **no existen** en esta estructura (ver `reglas-seo-digitalx.md`, sección 2).

---

## 4. Navegación y jerarquía

- **Menú principal:** Inicio · Servicios (desplegable: Audio, Video, Tecnología, con sus subpáginas publicadas) · Proyectos · Blog · Nosotros · Contacto. "Blog" solo aparece cuando `/blog/` esté publicado.
- **Pie de página:** servicios principales, Blog (cuando esté publicado), Condiciones de contratación, Política de privacidad, contacto, texto de cobertura (ver SEO, sección 4).
- **Cada artículo del blog** enlaza al menos a una página de servicio relacionada, con texto descriptivo.
- **Cada categoría** enlaza a todas sus subpáginas publicadas.
- **Cada subpágina** muestra migas de pan: Inicio › {Categoría} › {Servicio}.
- **No migrar** restos de la plantilla anterior: entrada "Hello world!", menús "Business" y "Company", navegación en inglés.

---

## 5. Qué es cada página y a quién le habla

Una página le habla a **un solo cliente**.

| Página | Cliente | Contenido obligatorio |
| --- | --- | --- |
| Inicio | Dos caminos: organizador de evento / negocio o institución | Propuesta (un solo proveedor para que el evento se vea, se escuche y se transmita; más software a la medida). Sección "Para tu evento" y sección "Para tu negocio o institución". 3 o 4 proyectos. "Por qué Digital X" con hechos comprobables: equipo para hasta 500 personas, mezcladora de 32 canales, técnico en cada evento, un solo proveedor. Cobertura. Testimonio solo con permiso. FAQ. CTA |
| `/servicios/` | Cualquiera | Vitrina con las 3 categorías y enlaces descriptivos |
| Renta de sonido | Organizadores de fiestas, agrupaciones, clases (ej. zumba), conferencias, salones | Capacidad hasta 500 personas, mezcladora de 32 canales, técnico en todos los eventos, viáticos incluidos en la cotización final. **Sin precios** (decisión del dueño). En su lugar: ejemplos por tipo de evento, factores que mueven el costo (personas, horas, distancia, equipo), fotos reales, enlace a condiciones de contratación. FAQ. Enlace cruzado a grabación de eventos |
| Instalación de audio | Iglesias/templos, escuelas, restaurantes | Casos reales: audio en una iglesia y proyección con pantallas (instalación **fija**; no confundir con el circuito cerrado de eventos). Qué incluye: `[PENDIENTE: elegir 2 o 3 servicios]`. Usar "iglesia" o "templo", no "casa de culto". No usar "asesoría" como término principal: casi no se busca |
| Grabación de eventos | Instituciones, eventos culturales, conferencias, deportivos | Grabación, circuito cerrado (proyección en vivo en pantallas del lugar), streaming opcional, audio, dron si aplica. Pantallas **rentadas a un tercero**: redactar "coordinamos", nunca "tenemos". Aclarar que circuito cerrado no es cámaras de seguridad. Precio de referencia: desde $5,000 MXN `[PENDIENTE: confirmar si incluye IVA]`. Tiempo de entrega: `[PENDIENTE]` |
| Video para redes | Negocios que necesitan contenido | Videos para redes, edición |
| Streaming | Organizadores de conferencias, eventos culturales, cultos | Transmisión en vivo en alta definición |
| Dron | Eventos y propiedades/turismo | Video aéreo, foto aérea 360°, tours. Permisos de la AFAC: verificar antes de afirmar nada |
| Tecnología (hub) | Dueños de negocio | Agrupa software, sitios y tienda en línea |
| Software a la medida | Negocios con procesos propios | Los 3 proyectos como casos (problema, solución, resultado), anónimos si no hay permiso. El e-commerce se presenta "en desarrollo" |
| Sitios web | Negocios | Validar competencia antes de definir el enfoque |
| `/proyectos/` | Cualquiera | Portafolio etiquetado por servicio, solo trabajos reales y con permiso |
| `/blog/` | Quien investiga antes de contratar | Artículos útiles y propios (guías, comparativas, consejos para eventos), con fecha y autor. Sin artículos de relleno ni generados sin revisión. Categorías como filtros en la misma página, **sin URL propia** por categoría |
| `/blog/{slug}/` | Una búsqueda informativa concreta | Respuesta completa a una pregunta real, fotos propias cuando existan, enlace a la página de servicio relacionada y CTA |
| `/condiciones-de-contratacion/` | Cliente que va a contratar | Anticipo, cancelación, horas extra (en el sitio anterior: 15% del servicio, máximo 5 horas; `[PENDIENTE: confirmar vigencia]`), viáticos incluidos en la cotización, contrato. Todo `[PENDIENTE: confirmar con el dueño]` |
| `/nosotros/` | Cualquiera | Quiénes somos, misión, ruta de 4 pasos (escuchamos, planeamos, ejecutamos, entregamos), pilares Calidad, Desempeño y Personalización, **cada uno con texto propio** |
| `/contacto/` | Cliente listo para escribir | Teléfono, correo, WhatsApp, zonas de servicio. Formulario: `[PENDIENTE: decidir si se publica]` |
| `/politica-de-privacidad/` | Cualquiera | Reescribir sin los apartados genéricos de WordPress que no aplican (comentarios, metadatos EXIF) |

Los textos del sitio anterior se pueden reutilizar **corrigiendo** estas erratas: "perzonalizado", "Apicaciones", "de de", "Beneficiese", "siguiente Nivel".

---

## 6. Redirecciones 301 (digitalequis.com → digitalx.mx)

| Antigua | Nueva |
| --- | --- |
| `/` | `/` |
| `/servicios/` | `/servicios/` |
| `/nosotros/` | `/nosotros/` |
| `/contacto/` | `/contacto/` |
| `/politica-de-privacidad/` | `/politica-de-privacidad/` |
| `/servicios-de-video/` | `/servicios-de-video/` |
| `/renta-de-audio/` | `/servicios-de-audio/renta-de-sonido/` |

- Redirigir cualquier otra URL del dominio viejo a `/`, **nunca** a una página sin relación.
- El dominio viejo debe seguir respondiendo para que el 301 funcione.

---

## 7. Pendientes

**Datos**
- [ ] Correo definitivo en digitalx.mx.
- [ ] URLs de Facebook e Instagram.
- [ ] 3 o 4 proyectos para el Inicio, con fotos, nombre del lugar y permiso.
- [ ] Autorización de Genaro Ríos (Impact Hub CDMX) para su testimonio con nombre y foto.
- [ ] Zonas realmente cubiertas además de Atlixco e Izúcar de Matamoros.
- [ ] Marcas y modelos de equipo (ver SEO, sección 8).
- [ ] Casos de instalación (iglesia, proyección) con foto y descripción.
- [ ] Casos de software (problema, solución, resultado).
- [ ] Tiempo de entrega del video editado.
- [ ] Contenido de condiciones de contratación.

**Decisiones**
- [ ] Slug de video para redes (`video-para-redes` provisional).
- [ ] `renta-de-sonido` vs `renta-de-audio`.
- [ ] Qué incluye exactamente la instalación de audio.
- [ ] Formulario de contacto: sí o no.
- [ ] ¿Cada proyecto tiene su página (`/proyectos/{slug}/`) o son secciones dentro de `/proyectos/`? **Por defecto: secciones, sin páginas individuales.**
- [ ] ¿Se crea una página única `/cobertura/`? **Por defecto: no.**
- [ ] Número mínimo de artículos para publicar el blog y temas de los primeros artículos.
- [ ] ¿`/nosotros/` incluye sección de equipo (nombres, puestos, fotos con permiso)? **Por defecto: no.**

---

## 8. Criterios de aceptación

- [ ] Existen todas las páginas con estado "Lanzamiento" y ninguna más, con la URL exacta de la sección 3.
- [ ] Ninguna página "Pendiente de material" está publicada ni enlazada.
- [ ] Todos los enlaces internos funcionan y usan texto descriptivo.
- [ ] Las redirecciones de la sección 6 responden 301 al destino correcto.
- [ ] No hay datos inventados: todo hueco aparece como `[PENDIENTE: ...]` y está en el reporte final.
- [ ] Erratas heredadas corregidas y los tres pilares con texto propio.
