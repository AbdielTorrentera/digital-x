# Digital X — Reglas de diseño (digitalx.mx)

Define **cómo se aplica** la marca en el sitio: retícula, espaciado, tipografía en pantalla, jerarquía, componentes, movimiento y accesibilidad.
Complementos: `identidad-marca-digitalx.md` (qué colores, logos y tipografías existen), `reglas-seo-digitalx.md` (rendimiento, imágenes, conversión) y `estructura-sitio-digitalx.md` (qué páginas existen).
Versión: borrador de trabajo · 2026-10-30

---

## 0. Instrucciones para el agente (leer primero)

1. **Mobile first, siempre.** Cada componente se diseña, se construye y se revisa primero a 375 px y después se amplía. Nada se da por terminado sin revisarlo en móvil.
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
| Sobre fondo negro | Amarillo, texto negro; *hover* amarillo dorado | Contorno blanco, texto blanco | Blanco, subrayado; *hover* amarillo |

- **Altura mínima 48 px** y área táctil de al menos 48 × 48 px (más estricta que el mínimo de WCAG, por la regla de SEO §10). Separación mínima entre dos objetivos táctiles: 8 px.
- Texto del botón: **verbo + objeto** ("Cotizar por WhatsApp", "Ver servicios de audio"). Prohibido "ver más", "clic aquí" o "enviar" solo (ver SEO §4).
- En móvil, el botón principal de la portada y de los llamados a la acción ocupa **todo el ancho** disponible.
- Botones solo con ícono: `aria-label` obligatorio.
- Estados obligatorios: normal, *hover*, foco visible, presionado y deshabilitado (deshabilitado sin depender solo de la opacidad: lleva cursor y atributo `disabled`).

### Tarjetas

- Relleno: `--esp-4` en móvil, `--esp-5` en escritorio. Separación entre tarjetas siempre mayor que su relleno.
- En móvil, una columna; en tableta, dos; en escritorio, tres o cuatro según el contenido.
- Si la tarjeta entera es clicable, el enlace va en el título y se extiende a toda la tarjeta; no hay enlaces anidados.
- No todas las tarjetas tienen el mismo peso: si una es la recomendada o la principal, se distingue.

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

- `--radio-chico` 4 px (campos, etiquetas), `--radio` 8 px (botones, tarjetas), `--radio-pildora` 999 px (botón flotante de WhatsApp). No se usan otros.
- Sombras solo para elementos que flotan sobre el contenido (menú abierto, botón de WhatsApp): `--dx-sombra`. Las tarjetas no llevan sombra.

---

## 7. Navegación

- **Móvil:** header fijo con logo a la izquierda, botón "Llamar" y botón "Menú". El menú abierto tiene los enlaces abajo, al alcance del pulgar.
- **Escritorio:** barra horizontal con el desplegable de Servicios.
- El header fijo no ocupa más de 64 px de alto en móvil.
- La página actual se marca en el menú con algo más que el color (subrayado o indicador) y `aria-current="page"`.
- Migas de pan en subpáginas (ver estructura §4).
- `[PENDIENTE: color del header (blanco o negro). Hoy es blanco con logo negro; decidir al ver el Inicio con su portada oscura]`.

---

## 8. Movimiento y animación

- Solo se animan `transform` y `opacity` (no tamaños, márgenes ni posiciones), para no afectar el rendimiento.
- Duraciones: 150 ms (*hover*, botones), 250 ms (menús, acordeones), hasta 400 ms (entradas de sección). Nada más lento.
- Las animaciones de entrada son sutiles (desplazamiento máximo de 24 px) y se ejecutan **una sola vez**.
- Con `prefers-reduced-motion`, se desactivan animaciones, carruseles automáticos, el desplazamiento suave y la reproducción automática de video.
- **Prohibido:** secuestrar el scroll, carruseles que avanzan solos sin botón de pausa, parpadeos de más de 3 veces por segundo y video con sonido automático.
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

- [ ] Color del header (blanco o negro).
- [ ] Confirmar el juego de íconos (se mantiene el de Marby mientras tanto).
- [ ] Colores de estado para formularios (ver marca §2), si se publica el formulario.
- [ ] Estilo del menú de escritorio: acercarlo al de Marby cuando haya páginas de servicio en el desplegable.
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
