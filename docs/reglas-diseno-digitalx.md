# Digital X — Reglas de diseño (digitalx.mx)

Define **cómo se aplica** la marca en el sitio: retícula, espaciado, tipografía en pantalla, jerarquía, componentes, movimiento y accesibilidad.
Complementos: `identidad-marca-digitalx.md` (qué colores, logos y tipografías existen), `reglas-seo-digitalx.md` (rendimiento, imágenes, conversión) y `estructura-sitio-digitalx.md` (qué páginas existen).
Versión: borrador de trabajo · 2026-10-30

---

## 0. Instrucciones para el agente (leer primero)

1. **Mobile first, siempre.** Cada componente se diseña, se construye y se revisa primero a 360 px y después se amplía. Nada se da por terminado sin revisarlo en móvil.
2. Usa **solo** los valores de este archivo (escala de espaciado, escala tipográfica, anchos, radios, duraciones). Si necesitas un valor que no existe, **detente y pregunta**; no inventes uno "a ojo".
3. Los valores se declaran como **variables (tokens)** en `src/styles/tokens.css` y se usan por nombre. Prohibidos los números sueltos en componentes (`margin: 22px`, `font-size: 15px`).
4. Colores, logos y tipografías salen de `identidad-marca-digitalx.md`; aquí solo se dice cómo usarlos. Si chocan, manda el archivo de marca.
5. Reutiliza las secciones de Marby (`components/sections`, `components/ui`) adaptándolas a estas reglas antes de crear componentes nuevos.
6. No uses adjetivos como criterio ("más moderno", "más limpio"). Cada decisión de diseño se justifica con una regla de este archivo.

---

## 1. Puntos de corte (breakpoints)

| Nombre | Ancho | Retícula | Margen lateral | Medianil (gutter) |
| --- | --- | --- | --- | --- |
| Móvil | 0 – 767 px | 4 columnas | 16 px | 16 px |
| Tableta | 768 – 1023 px | 8 columnas | 32 px | 24 px |
| Escritorio | 1024 – 1279 px | 12 columnas | 32 px | 24 px |
| Ancho | 1280 px o más | 12 columnas | automático | 32 px |

- **Contenedor máximo:** 1280 px de ancho de contenido, centrado. En pantallas mayores, el fondo de la sección puede ir a todo lo ancho, pero el contenido no.
- Los estilos base son los de móvil; los demás se agregan con `min-width` (nunca al revés con `max-width`).
- **Anchos de revisión obligatorios:** 360, 375, 390, 768, 1024 y 1440 px. 360 px es el ancho mínimo que se debe soportar (Android de gama media).

---

## 2. Espaciado

Escala de **8 puntos**, con 4 y 12 para ajustes finos:

| Token | Valor | Uso típico |
| --- | --- | --- |
| `--esp-1` | 4 px | Ícono junto a texto |
| `--esp-2` | 8 px | Etiqueta y su campo; título y su subtítulo |
| `--esp-3` | 12 px | Elementos de una lista compacta |
| `--esp-4` | 16 px | Relleno interno de tarjetas en móvil; entre campos |
| `--esp-5` | 24 px | Relleno de tarjetas en escritorio; entre tarjetas en móvil |
| `--esp-6` | 32 px | Entre tarjetas en escritorio; entre bloques de una sección |
| `--esp-7` | 48 px | Entre título de sección y su contenido |
| `--esp-8` | 64 px | Relleno vertical de secciones en móvil |
| `--esp-9` | 96 px | Relleno vertical de secciones en escritorio |
| `--esp-10` | 128 px | Secciones destacadas en escritorio (portada, llamado final) |

Reglas:

1. **Todo espacio sale de la escala.** Prohibidos valores como 9, 13 o 22 px.
2. **Lo de adentro es menor que lo de afuera.** El espacio dentro de un grupo siempre es menor que el espacio entre grupos (proximidad). Ejemplo: etiqueta–campo 8 px; campo–campo 16-24 px; tarjeta–tarjeta mayor que el relleno de la tarjeta.
3. **Más espacio arriba de un título que debajo**, para que el título quede pegado al contenido que presenta.
4. El texto **nunca toca** el borde de su contenedor; mínimo `--esp-4`.
5. Lo más importante de una pantalla lleva más espacio alrededor; amontonar resta valor.

---

## 3. Tipografía en pantalla

Familias y pesos: los de `identidad-marca-digitalx.md` (Archivo 800 en títulos, Onest 400 y 600 en textos).

### Escala

Base 16 px en móvil (escala 1.25) y 18 px en escritorio (escala 1.333). Entre ambos extremos, tamaño fluido con `clamp()`.

| Token | Móvil | Escritorio | Uso |
| --- | --- | --- | --- |
| `--txt-display` | 39 px | 57 px | Un solo uso por página: H1 de portada |
| `--txt-h1` | 31 px | 43 px | H1 de páginas interiores |
| `--txt-h2` | 25 px | 32 px | Títulos de sección |
| `--txt-h3` | 20 px | 24 px | Títulos de tarjeta, subsecciones |
| `--txt-cuerpo` | 16 px | 18 px | Párrafos |
| `--txt-chico` | 14 px | 14 px | Etiquetas, pies de foto, fechas. **Nunca párrafos** |

- Tamaños en **`rem`**, no en `px`, para respetar el tamaño de letra que el usuario elija en su teléfono.
- **Mínimo absoluto:** 14 px. El cuerpo de texto nunca baja de 16 px.
- La jerarquía la marca el H del contenido (un solo H1, sin saltar niveles; ver SEO §3), no el tamaño: un H2 puede verse como `--txt-h3` si el diseño lo pide, pero sigue siendo H2.

### Interlineado, medida y espaciado

| Elemento | Interlineado | Espaciado entre letras |
| --- | --- | --- |
| Títulos grandes (display, h1, h2) | 1.05 – 1.15 | −0.02 em |
| Títulos chicos (h3) | 1.2 – 1.3 | 0 |
| Cuerpo | 1.5 | 0 (el de la fuente) |
| Etiquetas en mayúsculas | 1.2 | +0.06 em |

- **Medida:** máximo **68 caracteres por línea** en párrafos (`max-width: 68ch`). En pantallas anchas el texto no se estira a todo lo ancho.
- **Alineación:** párrafos a la izquierda. Centrado solo para textos de hasta 3 líneas (un título, un llamado a la acción, un botón). Prohibido el texto justificado.
- **Mayúsculas:** solo etiquetas cortas. Prohibidos párrafos o títulos largos en mayúsculas.
- Entre párrafos, espacio (`--esp-4`); nunca sangría y espacio a la vez.
- Fuentes con `font-display: swap`.

---

## 4. Color en la interfaz

Los colores y sus combinaciones permitidas están en `identidad-marca-digitalx.md` (§2 y §3). Su aplicación:

- **Proporción aproximada por pantalla:** 60 % fondo (negro o blanco), 30 % neutros (gris claro, textos, tarjetas), **10 % amarillo** (botones, acentos, detalles).
- **Un solo color de acento.** El amarillo marca lo que se debe tocar o mirar primero; si todo es amarillo, nada destaca.
- **El amarillo como resalte, solo sobre fondos oscuros.** Subrayados de la página actual, *hover*, foco y selección de texto usan el amarillo únicamente sobre negro o fotos oscuras; **sobre blanco o gris claro, el resalte es negro** (subrayado o peso, y selección en negro con texto blanco). Nunca amarillo sobre fondo claro (identidad §3).
- **El color nunca es la única señal.** Estados, errores, etiquetas obligatorias y categorías llevan además ícono o texto.
- **Prohibidos los degradados detrás de texto.** El texto sobre foto lleva la capa oscura `--dx-capa-oscura` (60 %).
- **Contraste de elementos que no son texto** (bordes de campos y botones, íconos que comunican algo, indicador de foco): mínimo **3:1** contra su fondo. Las líneas divisoras decorativas no necesitan cumplirlo.
- Sin modo oscuro por ahora: el sitio ya alterna secciones claras y negras.

---

## 5. Jerarquía y composición

1. **Una acción principal por sección.** Un solo botón primario; las demás acciones van como secundarias (contorno) o enlaces de texto. Nunca varios botones con el mismo peso.
2. **Prueba de entrecerrar los ojos:** al ver la pantalla borrosa debe distinguirse un punto principal (título o botón). Si lo que más resalta es el menú, el diseño está mal.
3. **Orden de lectura:** lo esencial arriba a la izquierda. En móvil, el orden de apilado se define explícitamente y lo primero que aparece es lo más importante para el cliente (qué hacemos y cómo cotizar), no la decoración.
4. **Alineación:** todo se alinea a la retícula. Bordes que casi coinciden (a pocos píxeles) se corrigen para que coincidan exactamente. Un borde izquierdo fuerte guía la lectura.
5. **Agrupar sin cajas cuando se pueda:** primero espacio (proximidad), luego fondo compartido (tarjeta) y solo al final líneas.
6. **Elementos que hacen lo mismo se ven igual; elementos que hacen cosas distintas se ven distintos** (por ejemplo, todos los enlaces de texto subrayados).
7. **Alternancia de secciones:** secciones negras y claras alternadas, sin dos secciones con la misma textura visual seguidas.

---

## 6. Componentes

### Botones

| | Primario | Secundario | Enlace de texto |
| --- | --- | --- | --- |
| Sobre fondo claro | Negro, texto blanco | Contorno negro, texto negro | Negro, subrayado |
| Sobre fondo negro | Amarillo, texto negro; *hover* amarillo dorado | Contorno blanco, texto blanco, fondo transparente (variante `contorno`); *hover* y foco: relleno blanco translúcido | Blanco, subrayado; *hover* amarillo |

- **Área táctil de al menos 48 × 48 px** (más estricta que el mínimo de WCAG, por la regla de SEO §10). Separación mínima entre dos objetivos táctiles: 8 px.
- **El botón es el de la plantilla Marby, tal cual:** 28 px de alto, etiqueta de 12 px en mayúsculas y flecha que gira 45° al pasar el cursor. Su zona de toque se agranda a 48 px de forma invisible (`::after`), sin cambiar el tamaño que se ve. Primario: negro sobre fondo claro y amarillo sobre negro. Secundario: gris, sin contorno.
- La Btn original de 28 px también se permite como elemento decorativo dentro de una tarjeta que es en sí el enlace (un `<span>`): el área táctil es la tarjeta.
- Texto del botón: **verbo + objeto** ("Cotizar por WhatsApp", "Ver servicios de audio"). Prohibido "ver más", "clic aquí" o "enviar" solo (ver SEO §4).
- Botones solo con ícono: `aria-label` obligatorio.
- Estados: normal, *hover* (la flecha gira) y foco visible.

### Cierre de contacto

- Bloque de cierre de la página (Nosotros, las categorías y las 10 páginas de servicio): foto oscura con velo (`--dx-capa-oscura`) y **una sola columna centrada**: título, texto y, debajo, los botones. **Sin caja con borde** ni panel de vidrio.
- **Dos botones lado a lado y centrados**, con jerarquía clara: "Cotizar por WhatsApp" es el principal (**amarillo, el único con relleno**) y "Llamar" es el secundario, **de contorno blanco** con texto blanco y fondo transparente (variante `contorno` de `Btn`); al pasar el cursor o con foco se rellena de blanco translúcido. Mismo alto (28 px, 48 px de área táctil) y misma tipografía que el principal, para que se vean como pareja. En pantallas angostas pueden apilarse si no caben.
- **No se muestra el número de teléfono**: el botón "Llamar" lleva `aria-label` con el número ("Llamar a Digital X: +52 …") y el teléfono sigue en el pie.
- Ancho de texto limitado a unos 60 caracteres, para que no se estire en pantallas grandes.

### Tarjetas

- Relleno: `--esp-4` en móvil, `--esp-5` en escritorio. Separación entre tarjetas siempre mayor que su relleno.
- En móvil, una columna; en tableta, dos; en escritorio, tres o cuatro según el contenido.
- Si la tarjeta entera es clicable, el enlace es la tarjeta (con `aria-label`) o va en el título y se extiende a toda la tarjeta; no hay enlaces anidados.
- No todas las tarjetas tienen el mismo peso: si una es la recomendada o la principal, se distingue.
- **Tarjetas de servicio del Inicio.** Son la sección Services de la plantilla Marby (`sections/Servicios.astro`, componente configurable). **Sin contorno**, con el **gris de la plantilla original** (`--dx-gris-tarjeta`, `#F5F5F6`, su `--ink-50`; excepción a la paleta decidida por el dueño, solo para este fondo; el texto sigue en negro) y esquinas de 8 px. Cada tarjeta entera es un solo enlace (a la página de su categoría o de su servicio) y el botón que lleva es decorativo.
  - **Inicio (apilado):** tres tarjetas del mismo alto; cada una se fija debajo del header (`position: sticky`) y la siguiente se desliza encima. Solo CSS. Separación de 20 px y alto fijo de 500 px, como el original.
  - **Páginas de categoría: tarjeta de propiedad.** Las páginas de categoría ya no usan el apilado: siguen el listado de la plantilla Marby (`/property`), **sin filtros ni búsqueda**. Cuadrícula de **2 columnas desde 768 px y 1 en móvil** con `ui/TarjetaServicio.astro` (la PropertyCard): foto (proporción 1.24; al pasar el cursor en escritorio aparece una barra con el chip de la categoría y la flecha), barra con el **nombre y el número `[01]`** (dentro de la categoría), y **tres renglones de datos** (los de la ficha del servicio, con sus propias etiquetas; etiqueta a la izquierda, valor a la derecha, y un valor largo se parte en líneas). La barra del nombre usa `--dx-gris-tarjeta`. **Toda la tarjeta enlaza al servicio** (el título se extiende a toda ella, sin enlaces anidados; el foco se dibuja alrededor de la tarjeta). Separación con la escala: `--esp-7` entre filas y `--medianil` entre columnas. La portada de la categoría es la del listado de Marby: foto con velo (`--dx-brillo-sobre-foto`), el H1 encima y la introducción debajo; las preguntas frecuentes van en cuadrícula (tarjetas numeradas que se abren, 1, 2 y 3 columnas).
  - Con `prefers-reduced-motion: reduce` las tarjetas del apilado se muestran una debajo de otra, sin que se fijen ni se encimen.
  - Excepción a las medidas de esta sección: las tarjetas conservan las del original (relleno de 20 px en escritorio). En móvil y tableta (menos de 810 px) el alto es el del contenido y la foto se adapta al alto de la pantalla (`clamp(120px, 24dvh, 260px)`): la tarjeta pegada, con su botón completo, debe caber entera en la pantalla (se prueba a 360 × 640, 375 × 667, 390 × 844 y 768 × 1024). Si no cabe, se reduce primero la foto y después el relleno; nunca se quita el efecto de apilado.
  - Los `<source>` de `<picture>` no se dibujan (`source { display: none }` en el reset): dentro de un flex, cada uno ocupaba un lugar y un hueco.

### Portada del Inicio

- **Llena exactamente la pantalla visible bajo la barra**: `min-height: calc(100dvh - var(--nav-alto))` (con `100vh` de respaldo). La barra es fija pero está en el flujo, así que la portada no puede medir el alto completo de la pantalla ni un porcentaje (con `85vh` quedaba una franja blanca de 27 a 54 px). Crece si su contenido es más alto, sin cortarlo.
- `--nav-alto` se calcula de la barra real (logo de 128 px × 515/1609 + 2 × 20 px = 81 px), no es un número a mano; de él cuelgan también la navegación interna y los saltos.
- Un solo H1. **Marca:** el logo blanco (decorativo, `aria-hidden`; el accesible es el de la barra) del lado derecho en escritorio y tableta, con su lema debajo en letra pequeña; en móvil, arriba del H1. Abajo queda el espacio del botón flotante de WhatsApp para que no la tape. Sin párrafo ni botón en la portada.
- **Sección "Qué hacemos"** (el "About us" de Marby, sin tarjetas de cifras): etiqueta, foto a la izquierda, título grande, texto y botón a la derecha; en móvil, en una columna. Su espacio con la de servicios (ambas blancas) es el de una sola.
- **Cierre del Inicio:** `CierreContacto`; una línea fina de 1 px (`--borde`) arriba del pie, en todas las páginas, para que el cierre de foto oscura y el pie negro no queden como dos bloques oscuros seguidos.

### Encabezado de la página de servicio

- **Encabezado dividido** de fondo claro (`--dx-gris-claro`), sin franja gris del título: en escritorio (desde 1024 px) dos mitades con la **foto a la mitad izquierda, de borde a borde y a todo lo alto** (alto mínimo `clamp(520px, 100dvh - barra, 720px)`), y a la derecha las migas, la etiqueta de la categoría en pequeño, el H1 grande y los tres datos del servicio con sus líneas; en móvil, foto arriba (4:3) y texto abajo. El alto es mínimo (el texto crece con el zoom). Sin botones nuevos.
- **Navegación interna (`NavInterna`):** fija debajo de la barra; si no cabe completa (360 px), **se desplaza sola en horizontal** al cambiar la sección activa, para dejarla centrada y visible, solo con el scroll de la propia barra (nunca se mueve la página); con `prefers-reduced-motion` el movimiento es directo. Sin barra de desplazamiento visible. Conserva `aria-current` y los saltos con Lenis.

### Formularios (cuando se publiquen)

- Etiqueta **visible arriba** de cada campo (no solo *placeholder*).
- Campos de 48 px de alto y texto de **16 px como mínimo** (con menos, el iPhone hace zoom al escribir).
- Tipo de teclado correcto en móvil: `type="tel"`, `type="email"`, `inputmode`, `autocomplete`.
- Errores junto al campo, con ícono y texto que diga cómo corregirlo; nunca solo en rojo.
- Un solo botón principal al final.

### Imágenes y video

- Proporciones fijas por tipo: 16:9 (portadas y video), 4:3 (proyectos), 1:1 (equipo, logos de clientes) y 4:5 (galerías en móvil). Recorte con `object-fit: cover`.
- Formatos, nombres, `alt`, dimensiones y carga diferida: ver `reglas-seo-digitalx.md` §6.
- En móvil, el video de portada se sustituye por su imagen de póster.

### Íconos

- Un solo juego de íconos con el mismo grosor de trazo. Tamaño base 24 px (20 px dentro de botones).
- Íconos decorativos con `aria-hidden="true"`; los que comunican algo llevan texto visible o `aria-label`.

### Radios y sombras

- `--radio-chico` 4 px (campos, etiquetas), `--radio` 8 px (botones, tarjetas), `--radio-pildora` 999 px (botones flotantes de WhatsApp y de llamada). No se usan otros.
- Sombras solo para elementos que flotan sobre el contenido (menú abierto, botón de WhatsApp): `--dx-sombra`. Las tarjetas no llevan sombra.

---

## 7. Navegación

- **Encabezado: barra NEGRA** (`--dx-negro`) en todas las páginas y tamaños, fija (`position: sticky`), **sin translucidez ni desenfoque**, con el **logo blanco** (`Logo` en `currentColor`, idéntico a `brand/svg/digitalx-logo-blanco.svg`; identidad §1). Texto blanco (21:1 sobre negro) y foco amarillo (`--foco-color` sobre fondos oscuros, ≥ 3:1).
- **Escritorio (desde 1024 px):** el **menú va a la vista en la barra**, a la derecha del logo: Inicio · Audio · Video · Tecnología · Nosotros, y Proyectos y Blog cuando estén construidas (generado desde `lib/paginas.ts`; estructura §4). Texto de **16 px** en blanco, con zona de toque de 48 px de alto y separación de `--esp-6`. La página actual se marca con **subrayado amarillo de 2 px** y `aria-current="page"`; en un servicio, la entrada de su categoría lleva el mismo subrayado y `aria-current="true"`. *Hover* y foco también en amarillo (texto y subrayado; el contorno de foco ya es amarillo sobre fondos oscuros). Se muestra completo desde 1024 px (el corte de "Escritorio", §1): las 5 entradas de hoy ocupan unos 400 px y con Proyectos y Blog unos 600 px, dentro de los ~700 px libres entre el logo y el borde. Sin JavaScript, el menú de escritorio funciona (son enlaces).
- **Móvil y tableta (menos de 1024 px): menú hamburguesa.** La misma barra negra con el botón de la plantilla Marby, que abre el panel a pantalla completa. **El botón es un chip blanco de 32 × 28 px con el ícono negro de tres líneas** (contraste 21:1 sobre la barra negra; `aria-label`, `aria-expanded` y `aria-controls`; zona de toque de 48 × 48 px). El panel abierto es **claro** (gris), con las mismas entradas que la barra, la X para cerrar y "Cotizar por WhatsApp". **Sin amarillo** (fondo claro): la entrada actual (`aria-current`, también la de la categoría del servicio) y el *hover* se marcan con subrayado negro.
- Solo el botón abre el panel (no toda la barra). Se mantienen foco atrapado en el panel, Escape para cerrar, bloqueo del scroll y regreso del foco al botón de abrir. Sin JavaScript el botón no se muestra y la navegación queda en el pie.
- La llamada directa no está en el header ni en el menú: es un botón flotante solo ícono, encima del de WhatsApp, en celular y tableta (SEO §11). Los botones flotantes no cambian.
- El alto de la barra es el del logo más 20 px de relleno arriba y abajo (unos 81 px).
- Migas de pan en subpáginas (ver estructura §4): Inicio › {Categoría} › {Servicio}.
- **Regla general del resalte:** el amarillo de marca (`--dx-amarillo`) se usa como resalte (subrayado, *hover*, foco, selección de texto) **solo sobre fondos oscuros** (la barra negra, el cierre, el pie y las secciones `.sobre-negro`); sobre blanco o gris claro, el resalte es negro. La selección de texto es negro con texto blanco por defecto y amarillo con texto negro dentro de `.sobre-negro` (`::selection` en `global.css`).

---

## 8. Movimiento y animación

- Solo se animan `transform` y `opacity` (no tamaños, márgenes ni posiciones), para no afectar el rendimiento.
- Duraciones: 150 ms (*hover*, botones), 250 ms (menús, acordeones), hasta 400 ms (entradas de sección). Nada más lento.
- Las animaciones de entrada son sutiles (desplazamiento máximo de 24 px) y se ejecutan **una sola vez**.
- **Las animaciones originales de la plantilla Marby se conservan tal cual (con `prefers-reduced-motion`); los límites de esta sección aplican a componentes nuevos.** Excepción por decisión del dueño: la fila de proyectos (el Team de Marby, en Nosotros y en las páginas de categoría) **no lleva botón de pausa** y cada proyecto aparece **una sola vez** (sin copias). **Si las tarjetas caben en el ancho, se muestran fijas**, sin avance ni arrastre. **Si lo exceden, es un carrusel deslizable**: contenedor con desplazamiento horizontal nativo (con el dedo en móvil; con la rueda, el trackpad o el arrastre en escritorio) que además avanza solo a unos 50 px por segundo **de ida y vuelta** (al llegar a un extremo se detiene un momento y regresa), de modo que nunca se ven repetidas dos tarjetas a la vez. El avance se detiene mientras la persona toca, arrastra, desliza, pasa el cursor o enfoca una tarjeta, y se reanuda unos 3 segundos después de soltar. Con `prefers-reduced-motion` (o sin JavaScript) no se mueve sola y la fila se desliza a mano o con el teclado.
- Con `prefers-reduced-motion`, se desactivan animaciones, carruseles automáticos, el desplazamiento suave y la reproducción automática de video.
- **Prohibido:** secuestrar el scroll, carruseles nuevos que avanzan solos sin botón de pausa (la fila de proyectos de Nosotros es la excepción descrita arriba), parpadeos de más de 3 veces por segundo y video con sonido automático.
- En pantallas táctiles el desplazamiento es el nativo del sistema (sin desplazamiento suave por JavaScript).

---

## 9. Accesibilidad

Objetivo: **WCAG 2.2 nivel AA**.

- HTML semántico: `header`, `nav`, `main`, `footer`, listas y botones reales (no `div` clicables).
- Enlace "Saltar al contenido" como primer elemento (ya existe).
- Todo se puede usar con teclado, en un orden lógico, con **foco siempre visible**: contorno de 2 px con separación de 2 px, negro sobre fondos claros y amarillo sobre negro.
- El sitio funciona con el **zoom del navegador al 200 %** y con el **tamaño de letra más grande** del teléfono, sin que se corte, encime u oculte contenido.
- El diseño soporta los ajustes de espaciado de WCAG (interlineado 1.5, espacio entre párrafos 2×, entre letras 0.12 em, entre palabras 0.16 em) sin romperse: **prohibidas las alturas fijas** en cajas con texto y los botones de ancho fijo.
- Texto real, nunca imágenes con texto.
- Se prueba con contenido real y largo (nombres de lugares largos, títulos de dos líneas), no con textos cortos de ejemplo.

---

## 10. Errores comunes que se deben evitar

- [ ] Todo centrado.
- [ ] Espacios fuera de la escala o espaciado interno mayor que el externo.
- [ ] Más de dos familias tipográficas o títulos sin escala.
- [ ] Líneas de texto de más de 75 caracteres o interlineado apretado en párrafos.
- [ ] Varios botones con el mismo peso, o un acento de color distinto para cada uno.
- [ ] Texto sobre foto o degradado sin capa oscura.
- [ ] Componentes que solo se revisaron en escritorio.
- [ ] Textos de relleno, erratas o datos inventados en el diseño final.

---

## 11. Pendientes

- [ ] Confirmar el juego de íconos (se mantiene el de Marby mientras tanto).
- [ ] Colores de estado para formularios (ver marca §2), si se publica el formulario.
---

## 12. Criterios de aceptación

- [ ] Cada página revisada a 360, 375, 390, 768, 1024 y 1440 px, sin scroll horizontal.
- [ ] Ningún espacio, tamaño, radio o duración fuera de los tokens.
- [ ] Cuerpo de texto ≥ 16 px en `rem`, interlineado 1.5 y ≤ 68 caracteres por línea.
- [ ] Una sola acción principal por sección; prueba de entrecerrar los ojos superada.
- [ ] Objetivos táctiles ≥ 48 px y separados al menos 8 px.
- [ ] Foco visible en todos los elementos interactivos y navegación completa con teclado.
- [ ] Zoom al 200 % y letra grande del teléfono sin contenido cortado.
- [ ] Contraste: texto ≥ 4.5:1 (≥ 3:1 en texto grande), elementos de interfaz ≥ 3:1.
- [ ] Animaciones desactivadas con `prefers-reduced-motion`.

---

## Referencias

- Curso gratuito de fundamentos de UX/UI Open: tipografía (escala, espaciado, pantallas), color (paletas, revisión de diseños con IA), layout (retículas, espaciado, jerarquía, responsive, revisión de diseños con IA) y Gestalt. https://uxuiopen.com/es/free-course
- WCAG 2.2 (W3C): contraste, tamaño de objetivos, ajuste de espaciado de texto y zoom.
