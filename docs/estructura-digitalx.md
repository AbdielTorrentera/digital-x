# Digital X — Estructura completa del sitio para recrearlo

Oct 1, 2026 · @Abdiel

## Resumen

El sitio tiene 7 páginas reales, 1 menú principal de 4 enlaces y unos 25 archivos multimedia en uso; todo lo necesario para recrearlo está en este documento. Lo saqué de la exportación de WordPress del 2 de octubre de 2026.

- **Nombre:** Digital X
- **Dominio:** digitalequis.com
- **Descripción del sitio (meta):** Agencia especializada en servicios de audio, video y tecnología. Ofrecemos soluciones integrales para eventos, grabación, producción y desarrollo digital en Puebla y alrededores.
- **Tema de WordPress:** Astra (con tema hijo), importado de una plantilla de Starter Templates.
- **Constructor de bloques:** Spectra (bloques `uagb`: contenedores, info-box, FAQ, timeline, slider, call-to-action).
- **Plugins detectados:** SureForms (formularios), SureRank y Yoast SEO (SEO).

Cada página se describe sección por sección, de arriba abajo, con sus textos exactos. Los nombres de bloque entre paréntesis indican el tipo de componente que habría que recrear (por ejemplo, "tarjeta con ícono" o "acordeón").

## Mapa del sitio y navegación

El menú principal ("Header") tiene 4 enlaces: Inicio, Servicios, Nosotros y Contacto, en ese orden. Las páginas de Audio y Video no están en el menú; se llega a ellas desde las tarjetas de la página Servicios.

| Página | URL | En menú | Llega desde |
| --- | --- | --- | --- |
| Inicio | / | Sí (1) | — |
| Servicios | /servicios/ | Sí (2) | Menú, botón "ver servicios" del Inicio |
| Nosotros | /nosotros/ | Sí (3) | Menú |
| Contacto | /contacto/ | Sí (4) | Menú |
| Servicios de Audio | /renta-de-audio/ | No | Tarjeta "Audio" en Servicios |
| Servicios de Video | /servicios-de-video/ | No | Tarjeta "Video" en Servicios |
| Política de Privacidad | /politica-de-privacidad/ | No | Pie de página (por confirmar) |

Si quieres conservar el posicionamiento en Google, mantén estas mismas URLs en el sitio nuevo o configura redirecciones 301.

En la exportación también vienen elementos sobrantes de la plantilla que no hace falta recrear: un menú "Business" (Proyectos, Equipo, Preguntas, Clientes, todos apuntando a #), un menú "Company" duplicado del principal, un bloque de navegación en inglés (Home, About, Services, Contact) y la entrada de ejemplo "Hello world!".

## Página: Inicio (/)

Seis secciones; encabezado transparente sobre una portada con imagen de fondo (`portada-web.png`).

1. **Portada (hero)**, texto blanco sobre imagen de fondo
   - Antetítulo: Soluciones tecnológicas y audiovisuales
   - Título (H1): Digital X
   - Texto: Nos apasiona dar vida a tus proyectos con sonido profesional, grabaciones de calidad, producciones audiovisuales y soluciones digitales para tu negocio.
   - Botón: "ver servicios" → /servicios/
2. **¿Qué podemos hacer por ti?** (título centrado + 3 tarjetas con ícono)
   - Texto: En Digital X fusionamos lo mejor del audio profesional, la producción audiovisual y la tecnología digital para que tu proyecto destaque.
   - Tarjeta **Audio** (ícono bocina): Renta de audio, grabación, podcast, consultoría
   - Tarjeta **Video** (ícono película): Videos para redes, Transmisiones en vivo.
   - Tarjeta **Tech** (ícono laptop con código): Web, Apps y soluciones para negocios.
3. **Algunos de nuestros proyectos** (galería de 4 imágenes)
   - Imágenes: `streaming.png`, `EmprendeJP.jpeg`, `atlixco.jpeg`, `plan.jpeg`
   - Botón: "ver más" → # (sin destino)
4. **Frase destacada** (centrada)
   - Cita (H3): "Disfrutamos el proceso sin descuidar lo importante."
   - Texto: Calidad - con uso de equipo adecuado. Desempeño - con personal capacitado. Personalización - solución específica a cada proyecto.
5. **Logos de clientes** (fila de 4 logos, fondo gris claro #f5f5f5)
   - `impacthub-logo.svg`, `ejp-logo.png`, `simi-logo.png`, `pajcha-logo.png`
6. **Llamado a la acción**
   - Título (H3, color principal): ¿Tienes una idea? Trabajemos juntos en ella
   - Texto: Contáctanos y recibe una propuesta personalizada.
   - Botón: "contacto" → WhatsApp 522441244913, mensaje: "Hola, Estoy interesado en una cotización para mi evento"

## Página: Nosotros (/nosotros/)

Cinco secciones; portada con fondo `nosotros.png` y una sección con fondo `plan.jpeg`.

1. **Portada**, texto blanco sobre imagen
   - Título (H1): Conoce a Digital X
   - Subtítulo (H4): Agencia creativa de audio, video y tecnología en Atlixco, Puebla.
   - Texto: Damos vida a ideas y proyectos a través de soluciones personalizadas, con calidad y pasión por el detalle.
2. **Quiénes somos / Misión / Qué hacemos** (3 bloques de texto)
   - **¿Quiénes somos?** Somos una agencia apasionada por el **audio, el video y la tecnología**, nacida en Atlixco, Puebla. Transformamos ideas en proyectos con propósito, calidad y creatividad.
   - **Misión:** Ayudamos a personas y marcas a **dar vida a sus ideas**, creando experiencias únicas a través de una ejecución técnica y humana de alto nivel.
   - **¿Qué hacemos?** (lista con ícono de flecha)
     - **Audio:** renta, grabaciones, sonorización y consultoría
     - **Audiovisuales:** videos, podcasts y streaming
     - **Digital:** desarrollo web, App móvil multiplataforma y asesoría tecnológica
3. **Nuestra ruta** (4 pasos numerados)
   - 1. Escuchamos tu idea — Comprendemos tus necesidades, objetivos y visión.
   - 2. Planeamos — Diseñamos una propuesta técnica y creativa a tu medida.
   - 3. Ejecutamos con precisión — Llevamos a cabo cada etapa con calidad y profesionalismo.
   - 4. Entregamos resultados reales — Optimizamos y ajustamos hasta alcanzar el mejor resultado.
4. **¿Por qué elegirnos?** (título + acordeón desplegable con íconos +/−)
   - Texto: Nos basamos en tres pilares fundamentales
   - **Calidad:** Cuidamos cada detalle técnico y estético para que tu proyecto tenga un resultado impecable y de alto nivel.
   - **Desempeño:** Nos comprometemos con la excelencia en cada etapa: planeación, ejecución y entrega. Buscamos eficiencia, precisión y resultados que superen las expectativas.
   - **Personalización:** (repite el texto de Desempeño; ver pendientes)
5. **Llamado a la acción**
   - Título (H3, color principal): ¿Interesado en iniciar un proyecto con nosotros?
   - Texto: Contáctanos y recibe una propuesta personalizada
   - Botón: "Contacto" → WhatsApp 522441244913, mensaje: "Hola, Estoy interesado en sus servicios para un evento"

## Página: Servicios (/servicios/)

Cinco secciones; portada con fondo `portada.png`.

1. **Portada**, texto blanco sobre imagen
   - Título (H1): Servicios
   - Subtítulo (H4): Digital X ofrece soluciones y servicios de alta calidad.
   - Texto: Nuestro compromiso es garantizar que cada detalle esté perfectamente afinado para crear experiencias que combinan calidad técnica, creatividad y atención personalizada.
2. **¿Qué podemos hacer por ti?** (4 tarjetas con ícono, clicables)

| Tarjeta | Ícono | Texto | Enlace |
| --- | --- | --- | --- |
| Audio | audífonos | Renta de Audio, sonorizaciones, grabación, consultoría | "Ver más" → /renta-de-audio |
| Video | cámara de video | Videos para redes, video institucional, vuelo drone interior y exterior, Transmisión en vivo, Podcast | "Ver más" → /servicios-de-video |
| Tech | laptop con código | Sitios web para empresas, Aplicaciones Web, Apps Móvil multiplataforma | # (sin página) |
| Ayuda y Soporte | usuario en círculo | Tecnología para negocio, asesoría, implementación de proyectos | # (sin página) |

3. **Clientes** (fondo gris claro #f5f5f5)
   - Texto: Estos son algunos de nuestros clientes con los que hemos trabajado y construimos relaciones sólidas.
   - Logos: `impacthub-logo.svg`, `ejp-logo.png`, `simi-logo.png`, `pajcha-logo.png`
4. **Testimonio**
   - Cita (H3): "Los recomiendo ampliamente si quieren evitar dolores de cabeza"
   - Texto: Adquirí los servicios de Digital X para cubrir un evento en el Centro de Convenciones Atlixco y el servicio superó mis expectativas ya que además del audio y circuito cerrado que funcionaron a la perfección, pudimos transmitir nuestro evento en vivo desde todas nuestras redes sociales, en alta definición y sin cortes.
   - Foto: `genaro.jpeg` — **Genaro Ríos**, Gerente de programas de Impact Hub CDMX
5. **Llamado a la acción**
   - Título (H3): ¿Tienes una idea? ¡Trabajemos juntos en ella!
   - Texto: Contáctanos y recibe una propuesta personalizada.
   - Botón: "contacto" → WhatsApp 522441244913, mensaje: "Hola, Estoy interesado en sus servicios para un evento"

## Página: Servicios de Audio (/renta-de-audio/)

Cinco secciones; es la página más completa del sitio e incluye un carrusel y preguntas frecuentes.

1. **Portada**, texto blanco sobre imagen
   - Título (H1): Renta de audio
   - Subtítulo (H4): Renta de sonido | Puebla
   - Texto: Si estás organizando una boda, conferencia, concierto, o fiesta, tenemos el equipo de audio perfecto para ti. Cada evento es único, por eso ofrecemos soluciones personalizadas
   - Botón: "contáctanos" → WhatsApp 522441244913, mensaje: "Hola, Estoy interesado en un servicio de audio para mi evento"
2. **Renta de sonido para cada momento único** + 3 tarjetas con ícono a la izquierda
   - Texto: En Digital X nos dedicamos a solucionar los desafíos que se presentan en el sector del audio. Nos especializamos en ayudar a nuestros clientes a superar obstáculos y alcanzar sus objetivos con éxito en cada uno de sus proyectos.
   - **Calidad** (ícono palomita): Aseguramos un estándar de calidad mediante el uso de equipo adecuado.
   - **Desempeño** (ícono personas): Benefíciese de nuestro personal capacitado orientado a obtener resultados excepcionales durante el recorrido de su Evento.
   - **Personalización** (ícono cursor): repite el texto de Desempeño (ver pendientes)
3. **Tipos de evento**: carrusel de 4 imágenes a un lado y lista de 4 categorías al otro
   - Imágenes del carrusel: `image-social.avif`, `image-empresarial.avif`, `image-musical.avif`, `image-politico.avif`
   - Título (H3): Ofrecemos paquetes de renta de equipo de sonido personalizados que se adapten perfectamente a tu tipo de evento.

| Categoría | Ícono | Eventos |
| --- | --- | --- |
| Social | personas | Bodas, Cumpleaños, Bautizos, Graduaciones, Aniversarios |
| Empresarial | edificio | Cursos, Seminarios, Reuniones, Ferias, Conferencias |
| Musical | nota musical | Solistas, Grupos Musicales |
| Político | persona con corbata | Ruedas de prensa, Discurso, Cierres de campaña, Debates |

4. **Preguntas Frecuentes** (acordeón)
   - Texto: Listamos las preguntas más frecuentes sobre nuestros servicios.

| Pregunta | Respuesta |
| --- | --- |
| ¿Puedo obtener un presupuesto personalizado para mi evento? | Por supuesto, puedes pedir una cotización personalizada en nuestro sitio web o comunicándote con nuestro equipo. Estamos a tu disposición para ayudarte a encontrar la mejor opción de sonido que se adapte a tu presupuesto y requerimientos. |
| ¿Hay un técnico durante mi evento? | Sí, nuestro equipo estará disponible para brindarte soporte técnico durante el evento permitiéndote concentrarte en tu presentación y en la interacción con tu audiencia |
| ¿Dónde ofrecen sus servicios? | Estamos ubicados en la ciudad de Atlixco pero ofrecemos servicios en el estado de Puebla. |
| ¿En cuánto sale la hora extra y cuántas puedo solicitar? | El costo de la hora extra es el 15% sobre el valor total del servicio, cubrimos un máximo de 5hrs, en caso de requerir de 6 a superior debe ser notificado el día de la reservación. |
| ¿Debemos de firmar un contrato de servicio? | Sí, un contrato de servicio te mantendrá tranquilo, este deberá especificar la hora del montaje del equipo, duración del evento, horas contratadas, equipo de audio e iluminación (cantidad), dirección y teléfonos del proveedor previamente checados. |

5. **Llamado a la acción** (caja centrada con ícono de WhatsApp)
   - Título (H3): Hagamos que tu evento suene mejor
   - Texto: Contáctanos hoy mismo para cotizar y llevemos tu evento al siguiente nivel.
   - Botón: "Contacto" → WhatsApp, mismo mensaje que la portada

Nota: corregí acentos y la errata "perzonalizado" en esta transcripción; en el sitio actual aparecen sin corregir.

## Página: Servicios de Video (/servicios-de-video/)

Seis secciones, con dos videos en reproducción automática (sin sonido y en bucle).

1. **Portada**, texto blanco sobre imagen de fondo `streaming.png`
   - Título (H1): Producción y Servicios de Video
   - Texto: Creamos contenido audiovisual que conecta con tu audiencia, mejora tu presencia en redes y da una imagen profesional a tu negocio o proyecto.
   - Texto en cursiva: Trabajamos en Atlixco, Puebla y alrededores
2. **Nuestros servicios de video** (4 tarjetas con ícono)
   - **Videos para redes** (ícono personas): videos cortos, dinámicos y atractivos, ideales para plataformas como Instagram, Facebook o TikTok.
   - **Video institucional** (ícono edificio): videos corporativos que reflejan la identidad, valores y servicios de tu empresa.
   - **Vuelo de dron (interior y exterior)** (ícono visor VR): **Ideal para:** eventos, recorridos virtuales, videos turísticos o inmobiliarios.
   - **Transmisión en vivo (Streaming)** (ícono cámara): Calidad de audio y video, para conferencias, conciertos, cultos o presentaciones.
3. **Video a lo ancho**: `Drone.mp4` (autoplay, loop, muted)
4. **Nuestro proceso de trabajo** (línea de tiempo vertical de 4 pasos)
   - Planeación — analizamos tus objetivos y estilo visual.
   - Producción — grabamos con equipo profesional y personal capacitado.
   - Edición — cuidamos la narrativa, el color y el sonido.
   - Entrega — obtienes un video optimizado para la plataforma que necesites.
5. **¿Por qué elegirnos?** (lista con íconos a un lado, video al otro)
   - Experiencia en producción audiovisual y audio profesional.
   - Calidad cinematográfica en cada proyecto.
   - Servicio completo: desde la idea hasta la publicación.
   - Trato cercano, atención personalizada y precios justos.
   - Video: `valle-de-catrinas-2025-atlixco.mp4` (autoplay, loop, muted)
6. **Llamado a la acción** (caja centrada con ícono de WhatsApp)
   - Título (H3): ¿Listo para producir tu próximo video?
   - Texto: Escríbenos y hablemos de tu proyecto
   - Botón: "Contacto" → WhatsApp 522441244913, mensaje: "Hola, Estoy interesado en una cotización para servicios de video"

Meta descripción de la página: Videos para redes, institucionales, dron, streaming y podcast. Producción de video profesional en Puebla con calidad, creatividad y servicio cercano.

## Página: Contacto (/contacto/)

Tres secciones; el contacto es por teléfono, correo y WhatsApp. El formulario existe en WordPress pero no está colocado en ninguna página.

1. **Portada**, texto blanco sobre fondo `encabezadoContacto.png`
   - Título (H1): Contáctanos
   - Subtítulo (H4): Estamos listos para escucharte
2. **Nuestros datos** (texto a un lado, imagen `contacto.png` al otro)
   - Texto: Si tienes una duda, escríbenos y con gusto te ayudamos.
   - Teléfono (ícono teléfono): +(52) 2441244913
   - Correo (ícono sobre): equipo@digitalequis.com
3. **WhatsApp**
   - Título (H3, color principal): Si lo prefieres puedes mandarnos un mensaje
   - Texto: Hablemos de tu próximo proyecto, estamos a un mensaje de distancia.
   - Botón: "whatsapp" → WhatsApp 522441244913, mensaje: "Hola, Estoy interesado en una cotización para mi evento"

**Formulario "Simple Contact Form" (SureForms, sin usar)**, por si quieres incluirlo en el sitio nuevo:

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| Tu nombre | Texto | Sí |
| Tu correo | Email | Sí |
| Escribe aquí el servicio de tu interés | Área de texto | Sí |

Botón de envío: "Enviar". Al enviar muestra un mensaje de confirmación; no tiene reCAPTCHA.

## Página: Política de Privacidad (/politica-de-privacidad/)

Página de texto simple, con 11 apartados (subtítulos H2) y su texto completo:

**Quiénes somos.** Somos Digital X, una agencia ubicada en Atlixco, Puebla, México. Ofrecemos servicios de audio, video y tecnología, incluyendo renta de equipo, grabación, producción y desarrollo digital. Nuestro sitio web es: https://digitalequis.com. Puedes contactarnos en: contacto@digitalequis.com

**Comentarios y formularios de contacto.** Cuando los visitantes completan un formulario de contacto o solicitan información, recopilamos los datos mostrados en el formulario (como nombre, correo electrónico y mensaje), junto con la dirección IP y el tipo de navegador para prevenir spam. No utilizamos estos datos con fines comerciales sin tu consentimiento.

**Archivos multimedia.** Si subes imágenes o archivos a nuestro sitio (por ejemplo, para enviar logotipos o material de proyecto), evita incluir datos de ubicación (EXIF GPS). Otros visitantes podrían descargar y extraer esa información.

**Cookies.** Nuestro sitio puede utilizar cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio. Estas cookies no recopilan información personal a menos que la proporciones voluntariamente. Puedes desactivarlas desde la configuración de tu navegador.

**Contenido incrustado de otros sitios.** Algunos artículos o secciones pueden incluir contenido incrustado (como videos, imágenes o publicaciones de redes sociales). Este contenido se comporta como si hubieras visitado directamente ese sitio web, el cual podría recopilar datos sobre ti o usar cookies.

**Con quién compartimos tus datos.** Tu información no se comparte con terceros, excepto cuando es necesario para completar un servicio solicitado (por ejemplo, procesadores de pago, servicios de correo o analítica web). Nunca vendemos ni cedemos tus datos a empresas externas.

**Cuánto tiempo conservamos tus datos.** Los datos enviados mediante formularios se conservan el tiempo necesario para dar seguimiento a tu solicitud o cotización. Si eres cliente, la información se guarda conforme a las obligaciones legales de facturación y servicio.

**Tus derechos sobre tus datos.** Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier momento escribiendo a: contacto@digitalequis.com. También puedes solicitar que eliminemos cualquier información que hayamos almacenado, salvo aquella que debamos conservar por motivos legales o administrativos.

**Dónde se envían tus datos.** Las solicitudes enviadas a través de formularios pueden ser verificadas mediante un servicio automático de detección de spam para proteger la seguridad del sitio.

**Cambios en esta política.** Digital X puede actualizar esta Política de Privacidad en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en esta página.

**Contacto.** Si tienes preguntas sobre esta política o el tratamiento de tus datos personales, contáctanos en: contacto@digitalequis.com, Atlixco, Puebla, México.

## Recursos multimedia

La exportación solo trae los enlaces, no los archivos: descárgalos antes de dar de baja el hosting. De 64 archivos, 28 son tuyos y en uso o probablemente en uso; el resto son restos de la plantilla.

Todos están bajo `https://digitalequis.com/wp-content/uploads/` seguido de la ruta indicada.

| Archivo | Dónde se usa |
| --- | --- |
| 2025/10/portada-web.png | Fondo de la portada de Inicio |
| 2025/10/portada.png | Fondo de la portada de Servicios |
| 2025/10/nosotros.png | Fondo de la portada de Nosotros |
| 2025/10/plan.jpeg | Proyecto en Inicio y fondo de sección en Nosotros |
| 2025/10/streaming.png | Proyecto en Inicio y fondo de portada en Audio y Video |
| 2025/10/EmprendeJP.jpeg | Proyecto en Inicio |
| 2025/10/atlixco.jpeg | Proyecto en Inicio |
| 2025/10/impacthub-logo.svg | Logo de cliente (Inicio y Servicios) |
| 2025/10/ejp-logo.png | Logo de cliente (Inicio y Servicios) |
| 2025/10/simi-logo.png | Logo de cliente (Inicio y Servicios) |
| 2025/10/pajcha-logo.png | Logo de cliente (Inicio y Servicios) |
| 2025/10/genaro.jpeg | Foto del testimonio en Servicios |
| 2025/11/image-social.avif | Carrusel en Audio |
| 2025/11/image-empresarial.avif | Carrusel en Audio |
| 2025/11/image-musical.avif | Carrusel en Audio |
| 2025/11/image-politico.avif | Carrusel en Audio |
| 2025/11/Drone.mp4 | Video en Servicios de Video |
| 2025/11/valle-de-catrinas-2025-atlixco.mp4 | Video en Servicios de Video |
| 2026/09/encabezadoContacto.png | Fondo de la portada de Contacto |
| 2026/09/contacto.png | Imagen en Contacto |
| 2025/10/digitalx-logo.png | Logo del sitio (probable, en el encabezado) |
| 2025/10/Logo-Digitalx-19.png | Variante del logo |
| 2025/11/icon.png | Ícono del sitio / favicon (probable) |
| 2025/10/hero-audio2-scaled.avif, sonido.png, encabezadoweb.gif | Subidos por ti, no aparecen en las páginas |
| 2026/09/contacto.jpg, hubiTransBla.png | Subidos por ti, no aparecen en las páginas |

**Sobrantes de la plantilla (no hace falta descargarlos):** todo lo de las carpetas 2017, 2019, 2020, 2021, 2022 y 2023, más las copias en 2025/10 de team-1/2/3, home-hero-bg, about-bg-img, why-choose-us y default.png.

## Elementos globales e identidad visual

Los colores exactos, tipografías, encabezado y pie de página no vienen en la exportación: Astra los guarda en el Personalizador. Antes de cerrar WordPress, apúntalos o tómales captura.

**Dónde encontrarlos en WordPress:**

- Colores: Apariencia → Personalizar → Global → Colores. El sitio usa la paleta global de Astra; el color 0 es el principal (íconos, títulos de llamados a la acción, acordeones), el 2 y el 3 se usan en textos y el 4 y 5 como fondos de sección.
- Tipografías: Apariencia → Personalizar → Global → Tipografía.
- Encabezado: Apariencia → Personalizar → Header Builder (logo, menú y si hay botón). En Inicio, Nosotros, Servicios y Contacto el encabezado es transparente sobre la portada.
- Pie de página: Apariencia → Personalizar → Footer Builder (textos, enlaces a la política de privacidad y redes sociales).

**Patrones de diseño que se repiten** (útiles para crear componentes reutilizables):

- **Portada:** imagen de fondo con texto blanco; antetítulo o subtítulo pequeño, H1 grande y un párrafo; a veces un botón.
- **Tarjeta con ícono:** ícono en color principal, título H3/H4 y texto corto; opcionalmente enlace "Ver más".
- **Sección con fondo gris claro** (#f5f5f5) para logos de clientes.
- **Acordeón** de preguntas o pilares con íconos +/−.
- **Llamado a la acción final** en todas las páginas: título, una línea de texto y botón a WhatsApp con mensaje prellenado distinto según la página.

Íconos usados (Font Awesome): volume-high, film, laptop-code, headphones, video, circle-user, users, building, vr-cardboard, music, user-tie, check, arrow-pointer, caret-right, phone-volume, envelope, whatsapp, circle-plus, circle-minus.

## Pendientes antes de migrar

Hay 4 cosas que guardar antes de cerrar WordPress y varias correcciones que conviene aprovechar en el sitio nuevo.

**Antes de dar de baja WordPress**

- [x] Descargar los 28 archivos de la tabla de recursos (o toda la carpeta `wp-content/uploads` desde el hosting).
- [x] Anotar colores, tipografías, encabezado y pie de página desde el Personalizador de Astra.
- [x] Revisar qué hay en el pie de página (redes sociales, enlaces) porque no viene en la exportación.
- [ ] Mantener las mismas URLs en el sitio nuevo o preparar redirecciones 301.

**Inconsistencias en el contenido**

- [ ] Correo: la página Contacto usa equipo@digitalequis.com y la Política de Privacidad usa contacto@digitalequis.com. Elegir uno.
- [ ] Teléfono: hoy todo el sitio usa +52 244 124 4913, pero Google aún muestra +52 244 137 1957 en una versión antigua de la página de Video. Confirmar cuál es el vigente. Resuelto: es +52 244 124 4913; el 1957 ya no se usa.
- [ ] El pilar "Personalización" repite el texto de "Desempeño" en Nosotros y en Renta de Audio; falta escribir su texto propio.
- [ ] El botón "ver más" de proyectos en Inicio no lleva a ningún lado; las tarjetas Tech y Ayuda y Soporte en Servicios tampoco tienen página.
- [ ] El formulario de contacto existe pero no se muestra; decidir si va en la página Contacto.

**Erratas a corregir:** "perzonalizado" (FAQ de Audio), "Apicaciones" (tarjeta Tech), "de de" (frase de Inicio), "Beneficiese" sin acento y "siguiente Nivel" con mayúscula (Audio).
