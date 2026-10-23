# Digital X — Reglas de SEO (digitalx.mx)

Archivo 2 de 2. Complemento: `estructura-sitio-digitalx.md` (URLs, páginas, datos del negocio).
Versión: borrador de trabajo · 2026-10-23

---

## 0. Instrucciones para el agente (leer primero)

1. Lee primero `estructura-sitio-digitalx.md`. Las URLs y las páginas permitidas salen de ahí.
2. Estas reglas son **obligatorias** salvo las marcadas como *propuesta* o `[PENDIENTE]`.
3. **No inventes**: marcas, cifras, clientes, reseñas, direcciones, coordenadas, certificaciones, permisos ni casos. Si falta un dato, deja `[PENDIENTE: ...]` y repórtalo.
4. **No agregues** páginas, ciudades, palabras clave ni secciones fuera de lo definido. Si crees que falta algo, propónlo al final de tu reporte; no lo implementes.
5. Los metadatos de cada página se definen **página por página** con el dueño. Mientras no estén en la sección 1, deja `[PENDIENTE: SEO de esta página]`.
6. Si una regla choca con otra o con la estructura, detente y pregunta.
7. Tareas de la sección 14 son del **dueño**, fuera del sitio. No las simules ni las des por hechas.

---

## 1. Metadatos por página

### Reglas generales
- **Title:** máx. 60 caracteres. Patrón: `{Servicio} en {Ciudad} | Digital X`. Único en todo el sitio.
- **Meta description:** máx. 155 caracteres. Incluye servicio, zona y llamado a la acción. Única en todo el sitio.
- **H1:** uno por página. Servicio + ciudad + a quién le hablas. Ver sección 3.
- **Ciudad prioritaria** en title y H1: Atlixco. Las demás zonas van en el texto.
- No repetir la palabra clave de forma forzada (title, H1 y primer párrafo se leen naturales).

### Páginas ya definidas

| Página | Title | H1 |
| --- | --- | --- |
| Inicio | `Audio, video y tecnología en Atlixco, Puebla \| Digital X` | `Audio, video y tecnología para tus eventos y tu negocio en Atlixco` |

Meta del Inicio: `Renta de sonido, video de eventos, streaming y software a la medida en Atlixco, Puebla. Cobertura en un radio de 50 km. Cotiza con Digital X.`

### Resto de páginas
`[PENDIENTE: SEO de cada página. Se define una por una, en este orden]`
1. Grabación de eventos y circuito cerrado
2. Renta de sonido
3. Instalación de audio
4. Streaming
5. Software a la medida
6. Video para redes, sitios web y el resto

Para cada una se define: palabra clave principal, title, meta, H1, secciones, FAQ y enlaces internos.

---

## 2. Páginas locales y cobertura

El principio es correcto: no intentar posicionar todo en el Inicio. Se cumple con **una página por servicio** (estructura del sitio), no con una página por ciudad.

- **PROHIBIDO** crear páginas por municipio o por combinación servicio + ciudad con el mismo texto cambiando solo el nombre. Google lo trata como contenido duplicado.
- **PROHIBIDO** subniveles de URL por ciudad (rompe la regla de máximo 3 niveles).
- Las zonas se mencionan **con naturalidad** dentro de cada página de servicio y en el pie de página.
- Una página por municipio solo se puede considerar más adelante si existe contenido **único y real** de ese lugar (trabajos hechos ahí, fotos, casos). Requiere aprobación expresa del dueño y definir su URL en el archivo de estructura.
- Solo se nombran las zonas **confirmadas** en la sección 1 de `estructura-sitio-digitalx.md`.

---

## 3. Encabezados

- Un solo H1 por página. H2 para secciones. H3 para subsecciones. No saltar niveles.
- Los títulos responden a una intención de búsqueda o de compra, no a una bienvenida.

| | Ejemplo |
| --- | --- |
| Correcto | `Renta de sonido en Atlixco para eventos de hasta 500 personas` |
| Correcto | `Video y circuito cerrado para eventos en Atlixco` |
| Incorrecto | `Bienvenidos a Digital X - Soluciones Integrales` |
| Incorrecto | `Digital X` (como único H1 del Inicio) |

Los H1 anteriores son ejemplos de formato. "Sonido" vs "audio" se valida antes de fijarlo.

---

## 4. Enlazado interno y pie de página

- Cada **subpágina** enlaza a: su categoría, `/proyectos/` y un servicio complementario.
- Cada **categoría** enlaza a todas sus subpáginas publicadas.
- Textos de enlace **descriptivos**. PROHIBIDO: "ver más", "clic aquí", "leer más", "contacto" como único texto de un enlace de servicio.
- Enlaces cruzados obligatorios: renta de sonido ↔ grabación de eventos ("¿quieres también grabar o transmitir tu evento?").
- **Pie de página geográfico:** un texto fijo, igual en todo el sitio, con las zonas confirmadas. Ejemplo:
  `Servicios de audio, video y tecnología en Atlixco, Izúcar de Matamoros y alrededores, Puebla.`
  - En texto plano, **sin enlaces por ciudad** (no existen páginas por ciudad).
  - No pasar de 5 zonas ni repetir el mismo nombre varias veces.
  - Mantener actualizado con las zonas realmente confirmadas.

---

## 5. Contenido

- **PROHIBIDO** inventar clientes, cifras, equipo, marcas, premios, certificaciones o permisos.
- **PROHIBIDO** publicar logos de clientes, testimonios, fotos de terceros o videos de clientes sin autorización confirmada por el dueño.
- **PROHIBIDO** texto oculto, relleno de palabras clave o listas de ciudades repetidas.
- **Páginas delgadas:** una página sin material propio (fotos, clips, caso) no se publica. Ver estado "Pendiente de material".
- **Contenido duplicado:** ningún bloque de texto se repite entre páginas. El pilar "Personalización" no repite el de "Desempeño".
- **Precios:** renta de audio no muestra cifras (decisión del dueño). Cualquier otro precio solo si el dueño lo confirmó (ej. "desde $5,000 MXN" en grabación de eventos, pendiente de confirmar IVA).
- **Circuito cerrado** se explica siempre junto con "pantallas para eventos" o "proyección en vivo", y se aclara que no es seguridad. Las pantallas son rentadas: se redacta "coordinamos".
- **Dron:** no afirmar permisos, registros ni regulación sin verificarlos.

---

## 6. Imágenes y video

### Nombres de archivo
- Formato: `{servicio}-{detalle}-{lugar}.webp`. Minúsculas, sin acentos, guiones, sin nombres genéricos de cámara (`IMG_1234`).
- **El lugar solo se escribe si la foto realmente se tomó ahí.**
- Ejemplos de formato:
  - `renta-de-sonido-evento-cultural-atlixco.webp`
  - `circuito-cerrado-pantallas-conferencia-atlixco.webp`
  - `instalacion-audio-iglesia-atlixco.webp`
- No nombrar archivos con servicios que Digital X no ofrece (por ejemplo, cámaras de seguridad o redes de voz y datos).
- **Imágenes servidas desde Sanity:** el CDN de Sanity renombra los archivos con un identificador. Para cumplir esta regla, las URLs públicas usan el nombre descriptivo como sufijo (*vanity filename*), generado a partir del nombre original del archivo o de un campo del documento, y se piden en WebP/AVIF con `auto=format`.

### Texto alternativo (`alt`)
- Obligatorio en toda imagen de contenido. Describe lo que se ve, con servicio y lugar cuando aplique.
  Ejemplo: `Pantalla de circuito cerrado en conferencia en Atlixco`.
- Imágenes decorativas: `alt=""`.

### Formato y carga
- Imágenes en **WebP o AVIF**. No usar PNG para fotos.
- Las imágenes de contenido van como `<img>`, **no** como fondo CSS (los fondos CSS no se indexan ni llevan `alt`).
- Dimensiones declaradas (`width` y `height`) para evitar saltos de diseño.
- `loading="lazy"` en todo lo que no esté en la primera pantalla.
- **Video:** compresión web, imagen de póster, carga diferida, sin audio ni autoplay con sonido. En móvil no cargar videos pesados de fondo.

---

## 7. Proyectos y casos de éxito

Cada proyecto en `/proyectos/` se presenta como **ficha corta**, no como foto suelta. Solo trabajos reales y con permiso.

Campos de cada ficha:
1. **Título:** servicio + tipo de trabajo + lugar. Ej.: `Audio para iglesia en Atlixco`, `Circuito cerrado en conferencia en Atlixco`.
2. **Reto:** qué necesitaba el cliente.
3. **Solución:** qué se hizo y con qué enfoque.
4. **Resultado:** qué se logró.
5. **Fotos** con nombre de archivo y `alt` según la sección 6.
6. **Enlace** a la subpágina del servicio correspondiente.

Si falta un campo, `[PENDIENTE: ...]`. Casos de software: anónimos si no hay permiso del cliente.

---

## 7b. Blog

- Cada artículo responde **una** búsqueda informativa y no compite con una página de servicio por la misma palabra clave.
- Title, meta y H1 únicos, con las mismas reglas de la sección 1. La ciudad solo cuando sea natural.
- Fecha de publicación y de actualización visibles; autor visible.
- Enlace a la página de servicio relacionada y CTA al final.
- **PROHIBIDO** publicar artículos de relleno, generados sin revisión del dueño o copiados de otros sitios.
- Las categorías son filtros dentro de `/blog/`, **sin páginas propias** (evita páginas delgadas).
- El blog no entra en el sitemap ni en el menú hasta que esté publicado (ver estructura, sección 3).

---

## 8. Marcas

- Mencionar marcas **solo** si el dueño confirma que usa ese equipo. `[PENDIENTE: marcas y modelos de mezcladora, bocinas, micrófonos y pantallas/proyección]`.
- Redacción permitida: "Trabajamos con equipo de marcas como X".
- **PROHIBIDO** afirmar "distribuidor autorizado", "certificado por" o usar logos de marcas como si fueran respaldo, sin documento que lo compruebe.
- No incluir marcas de ejemplo que no se usen.

---

## 9. SEO técnico

- `lang="es-MX"` en el HTML.
- **HTTPS** en todo el sitio. Una sola versión canónica: `https://digitalx.mx/`.
- **Canonical** autorreferenciado en cada página.
- **`sitemap.xml`** con solo las páginas publicadas (excluir las "Pendiente de material"). Declararlo en `robots.txt`.
- **`robots.txt`**: no bloquear nada importante.
- **`noindex`:** páginas de agradecimiento, resultados de búsqueda interna y cualquier entorno de pruebas. En Vercel, toda versión que no sea producción (`VERCEL_ENV` distinto de `production`) lleva `noindex` y `robots.txt` bloqueado. El Studio (`admin.digitalx.mx`) lleva `noindex` siempre.
- ⚠ **Antes de lanzar:** quitar el `noindex` y el bloqueo de robots del entorno de pruebas, y verificarlo.
- **404** con enlaces de regreso a Inicio y Servicios.
- **Open Graph** y Twitter Card básicos en cada página (título, descripción, imagen).
- **Un solo sistema de SEO** (un solo plugin o módulo; no duplicar etiquetas).
- Las redirecciones 301 siguen la sección 6 de `estructura-sitio-digitalx.md`.

---

## 10. Rendimiento y móvil

La mayoría de las búsquedas urgentes (renta de audio, soporte) vienen desde celular. Diseñar **primero para móvil**.

- Objetivo: página usable en menos de **2 s** en 4G móvil. Umbral mínimo de aprobación (Core Web Vitals "bueno"): **LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms**. Medir con PageSpeed Insights.
- Botón de llamada con enlace `tel:+522441244913`, área táctil de **al menos 48 px**, visible sin hacer scroll en móvil.
- Texto legible sin hacer zoom, sin scroll horizontal.
- Sin ventanas emergentes que tapen el contenido en móvil.

---

## 11. Conversión: WhatsApp y llamada

- **Botón flotante de WhatsApp** visible en todas las páginas, con el texto: `Cotiza tu evento o proyecto aquí`.
  - Fijo en una esquina, sin tapar el CTA principal ni el contenido en móvil.
  - Con `aria-label` descriptivo.
- Enlace de WhatsApp: `https://wa.me/522441244913?text={mensaje codificado}`.
- **Cada página usa su propio mensaje prellenado** *(propuesta; confirmar con el dueño)*:

| Página | Mensaje |
| --- | --- |
| General / Inicio | `Hola, estoy interesado en una cotización. Servicio: __ Fecha: __ Lugar: __` |
| Renta de sonido | `Hola, necesito audio para un evento. Fecha: __ Lugar: __ Personas: __ Tipo de evento: __` |
| Instalación de audio | `Hola, quiero cotizar una instalación de audio. Tipo de lugar (iglesia, escuela, restaurante, otro): __ Ubicación: __` |
| Grabación de eventos | `Hola, quiero cotizar la cobertura de video de un evento. Fecha: __ Lugar: __ Tipo de evento: __ ¿Necesito pantallas o transmisión?: __` |
| Video para redes | `Hola, me interesa video para redes sociales. Negocio: __ Qué necesito: __` |
| Streaming | `Hola, quiero transmitir un evento en vivo. Fecha: __ Lugar: __ Plataforma(s): __` |
| Software a la medida | `Hola, quiero cotizar un proyecto de software. Qué necesito resolver: __` |
| Dron | `[PENDIENTE]` |

- **Medición:** registrar eventos de clic en WhatsApp, llamada y correo, indicando la página de origen.

---

## 12. Datos estructurados (JSON-LD)

- **Sitio completo:** un nodo `ProfessionalService` (subtipo de `LocalBusiness`) con: `name` = "Digital X", `url`, `telephone` = "+522441244913", `email` (cuando esté definido), `areaServed` (solo zonas confirmadas), `sameAs` (redes oficiales, cuando existan).
- **Cada página de servicio:** nodo `Service` con `name`, `serviceType`, `description`, `provider` (referencia al negocio) y `areaServed`.
- **`FAQPage`** solo en páginas que muestran las preguntas frecuentes en pantalla.
- **`BreadcrumbList`** en subpáginas.
- **`BlogPosting`** en cada artículo del blog, con `headline`, `datePublished`, `dateModified`, `author` e `image`, todos coincidiendo con lo visible.
- **PROHIBIDO:**
  - Publicar `address`/`streetAddress` o **coordenadas (`geo`)**. El negocio opera sin dirección pública; las coordenadas revelarían un domicilio.
  - Reseñas o `aggregateRating` que no estén visibles y comprobables en el sitio.
  - Datos que no coincidan con el contenido visible de la página.
- El validador puede mostrar advertencia por falta de `address`. Es aceptable; no inventar una.

---

## 13. Consistencia de nombre y teléfono (NAP)

Como no hay dirección pública, la consistencia se aplica a **nombre y teléfono**, más la zona de servicio.

- **Nombre:** `Digital X`, escrito siempre igual en el sitio, Google, Facebook, Instagram y directorios. `[PENDIENTE: confirmar si el nombre oficial lleva algún añadido]`.
- **Teléfono:** `+52 244 124 4913` en pantalla; `+522441244913` en `tel:` y schema.
- **Correo:** uno solo, el mismo en todas partes.
- No agregar servicios ni ciudades al nombre del negocio (Google lo prohíbe en el perfil).

---

## 14. Acciones fuera del sitio (responsable: dueño)

1. **Perfil de Negocio de Google** como negocio de área de servicio (servicios a domicilio):
   - Ocultar la dirección. Google puede pedir verificación (a veces por video) y ahí usa una dirección de forma privada.
   - Agregar manualmente las zonas confirmadas.
   - Categoría principal: `[PENDIENTE: elegir]`.
   - Mismos datos que el sitio.
2. **Reseñas:** pedirlas a clientes **reales** después de cada servicio.
   - Se puede sugerir que cuenten qué servicio recibieron y dónde.
   - **PROHIBIDO** escribirles el texto, ofrecer descuentos o pagos por reseña, o pedirlas solo a clientes satisfechos.
   - Responder todas las reseñas.
3. **Search Console:** verificar `digitalx.mx` y `digitalequis.com`; usar la herramienta de cambio de dirección; enviar el sitemap.
4. **Analítica:** configurar GA4 con los eventos de la sección 11.
5. **Directorios y redes:** mismos nombre y teléfono en Facebook, Instagram y directorios locales.
6. **Dominio anterior:** renovarlo por varios años. Hoy sus servidores de nombres apuntan a un estacionamiento de Hostinger y no responde: regresarlos a GoDaddy (o al DNS que se elija) **antes** de lanzar, o las redirecciones 301 no funcionarán. Para no perder correos a las direcciones viejas, configurar reenvío de `@digitalequis.com` al correo nuevo.

---

## 15. Resumen de lo prohibido

- Páginas por ciudad con texto duplicado, o subniveles de URL por ciudad.
- Publicar páginas sin material propio.
- Inventar datos, marcas, clientes, reseñas, permisos o casos.
- Dirección o coordenadas públicas.
- Enlaces con texto "ver más" o "clic aquí" como único texto.
- Fondos CSS para imágenes de contenido; fotos en PNG; nombres de archivo genéricos.
- Relleno de palabras clave, texto oculto, listas repetidas de ciudades.
- Reseñas dictadas, compradas o filtradas.
- Lanzar con `noindex` activo o con robots bloqueado.

---

## 16. Pendientes

- [ ] Metadatos y estructura de cada página (se definen una por una).
- [ ] Zonas por confirmar: Puebla (capital), Amozoc, Tepeaca.
- [ ] Marcas y modelos de equipo.
- [ ] Mensajes de WhatsApp: confirmar los propuestos.
- [ ] Nombre oficial para Google y redes.
- [ ] Categoría principal del Perfil de Negocio.
- [ ] Correo y redes definitivos.

---

## 17. Criterios de aceptación

- [ ] Cada página publicada tiene title, meta y H1 únicos y dentro de los límites.
- [ ] Ninguna página tiene imágenes de contenido como fondo CSS; todas llevan `alt`.
- [ ] Todas las fotos en WebP/AVIF con nombres descriptivos y dimensiones declaradas.
- [ ] El pie de página tiene el texto de cobertura, sin enlaces por ciudad.
- [ ] El botón flotante de WhatsApp aparece en todas las páginas con el mensaje correcto por página.
- [ ] JSON-LD presente y sin `address` ni `geo`; valida sin errores.
- [ ] `sitemap.xml` solo con páginas publicadas; sin `noindex` en páginas de contenido.
- [ ] LCP ≤ 2.5 s en móvil en las páginas principales.
- [ ] Reporte final con todos los `[PENDIENTE: ...]` pendientes.
