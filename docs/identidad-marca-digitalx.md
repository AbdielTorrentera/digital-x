# Digital X — Identidad de marca

Define **qué es** la marca: logos, colores, tipografías y tono. Cómo se aplica en el sitio (espaciados, componentes, animaciones) va en `reglas-diseno-digitalx.md`.
Versión: borrador de trabajo · 2026-10-23

---

## 0. Instrucciones para el agente (leer primero)

1. Usa **solo** los colores, logos y tipografías de este archivo. No agregues colores, degradados ni variantes de logo.
2. Lo marcado como *propuesta* o `[PENDIENTE]` no es definitivo: úsalo como valor provisional y repórtalo.
3. Los colores se declaran **una sola vez** como variables (tokens) y se usan siempre por su nombre, nunca con el código HEX suelto en los componentes.
4. Cualquier combinación de texto y fondo debe cumplir las reglas de contraste de la sección 3. Si un diseño de la plantilla no las cumple, se cambia el diseño, no la regla.

---

## 1. Logo

El logo es un logotipo de texto: **"DIGITAL"** en letras gruesas y una **"X"** grande que sobresale arriba y abajo de la palabra.

### Versiones y archivos

Los archivos fuente están en `brand/` (raíz del repo). En el sitio se usan **siempre los SVG**; los PNG son solo para usos fuera de la web (documentos, correos, redes).

| Archivo | Uso |
| --- | --- |
| `svg/digitalx-logo-negro.svg` | Logo sobre fondos claros (blanco, gris claro, amarillo) |
| `svg/digitalx-logo-blanco.svg` | Logo sobre fondos oscuros (negro, fotos oscuras) |
| `svg/digitalx-logo.svg` | Logo con `fill="currentColor"`: toma el color del texto donde se inserte (útil en código) |
| `svg/digitalx-isotipo-negro.svg` / `-blanco.svg` | Solo la X, transparente |
| `favicon/favicon.svg`, `favicon.ico`, `favicon-16/32/48.png` | Favicon del navegador |
| `favicon/apple-touch-icon.png` (180 px) | Ícono al guardar el sitio en iPhone |
| `favicon/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Íconos para Android y el `site.webmanifest` |
| `favicon/site.webmanifest` | Manifiesto con nombre e íconos |
| `png/digitalx-logo-{negro,blanco}-{600,1200,2400}.png` | Logo en PNG transparente para documentos y correos |
| `png/digitalx-isotipo-{negro,blanco}-512.png` | X en PNG transparente |
| `social/digitalx-perfil-1080.png` | Foto de perfil para Facebook, Instagram, WhatsApp Business y Google |
| `social/og-digitalx-1200x630.png` | Imagen genérica para compartir enlaces (Open Graph) |

- Los vectores se **reconstruyeron a partir del PNG** original (coincidencia del 99.6 %; la X es un polígono exacto). Si aparece el archivo vectorial original del diseñador, se reemplazan.
- El isotipo (la X sola) se usa para favicon, ícono de app y avatar: X negra sobre fondo `--dx-amarillo`.
- *Propuesta:* versión del logo en amarillo (`--dx-amarillo`) sobre negro para usos especiales. `[PENDIENTE: aprobación del dueño]`. Mientras no se apruebe, solo existen negro y blanco.

### Reglas de uso

- **Espacio de respeto:** alrededor del logo, como mínimo la altura de la palabra "DIGITAL". Nada (texto, bordes, otros logos) entra en ese espacio.
- **Tamaño mínimo:** 120 px de ancho en pantalla para el logo completo. Por debajo de eso se usa el isotipo.
- **Sobre fotos:** solo si el fondo detrás del logo es lo bastante oscuro o claro para leerlo; si no, se pone sobre una franja sólida.
- **PROHIBIDO:** deformarlo (estirarlo o achatarlo), rotarlo, cambiar la proporción entre "DIGITAL" y la X, separar o mover la X, agregarle sombras, contornos, brillos o degradados, ponerlo en colores fuera de la sección 2, o redibujarlo con otra tipografía.
- En el sitio, el logo lleva `alt="Digital X"` y enlaza al Inicio.

---

## 2. Colores

Paleta oficial (archivo `paleta_Colores_Digital-x.ase`), más el blanco para fondos y textos.

| Token | HEX | Nombre (*propuesta*) | Uso principal |
| --- | --- | --- | --- |
| `--dx-amarillo` | `#F2E205` | Amarillo Digital X | Color de marca. Botones principales, acentos, íconos y detalles sobre fondo oscuro |
| `--dx-amarillo-dorado` | `#F2CB05` | Amarillo dorado | Estado *hover* y *activo* de los botones amarillos, acentos secundarios |
| `--dx-negro` | `#000000` | Negro | Fondo principal de secciones oscuras, texto sobre fondos claros, logo |
| `--dx-gris-medio` | `#999999` | Gris medio | Texto secundario **solo sobre negro** (fechas, etiquetas, pies de foto), bordes |
| `--dx-gris-claro` | `#DBDBDB` | Gris claro | Fondos de secciones claras, divisores sobre negro |
| `--dx-blanco` | `#FFFFFF` | Blanco | Texto sobre negro, fondos claros |

- **Proporción sugerida** *(propuesta)*: el sitio es predominantemente **negro y blanco**; el amarillo es el acento (botones, llamados a la acción, detalles) y no debe cubrir más de un 10 % aproximado de una pantalla. Así el amarillo destaca donde importa: en lo que se debe tocar.
- **No hay más colores.** Si se necesita un color de estado (error, éxito en formularios), se define primero aquí. `[PENDIENTE: colores de estado, si se usa formulario]`.
- El botón flotante de WhatsApp usa el **verde oficial de WhatsApp** (`#25D366`) con ícono y texto en **negro** (el blanco sobre ese verde no cumple contraste: 2.0:1), por ser un elemento reconocible de terceros. Es la única excepción a la paleta.

---

## 3. Contraste (accesibilidad)

Relaciones de contraste medidas entre los colores de la paleta. Mínimo exigido (WCAG AA): **4.5:1** para texto normal y **3:1** para texto grande (24 px o más, o 19 px en negrita) y para íconos o bordes de botones.

| Texto \ Fondo | Negro | Blanco | Gris claro | Amarillo | Amarillo dorado |
| --- | --- | --- | --- | --- | --- |
| **Negro** | — | 21.0 ✅ | 15.2 ✅ | 15.7 ✅ | 13.3 ✅ |
| **Blanco** | 21.0 ✅ | — | 1.4 ❌ | 1.3 ❌ | 1.6 ❌ |
| **Amarillo** | 15.7 ✅ | 1.3 ❌ | 1.0 ❌ | — | 1.2 ❌ |
| **Amarillo dorado** | 13.3 ✅ | 1.6 ❌ | 1.1 ❌ | 1.2 ❌ | — |
| **Gris medio** | 7.4 ✅ | 2.8 ❌ | 2.1 ❌ | 2.1 ❌ | 1.8 ❌ |

Reglas que salen de esta tabla:

- ✅ **Amarillo sobre negro** y **negro sobre amarillo** son las combinaciones de marca. Los botones amarillos llevan **texto negro**.
- ❌ **PROHIBIDO amarillo sobre blanco o gris claro**, para texto, íconos o bordes: no se lee.
- ❌ **PROHIBIDO texto blanco sobre amarillo.**
- ❌ **PROHIBIDO gris medio como texto sobre fondos claros.** Sobre fondo claro, el texto secundario va en negro (con menor tamaño o peso si hace falta jerarquía).
- El texto sobre fotos lleva una capa oscura detrás que garantice al menos 4.5:1.

---

## 4. Tipografía

Tipografías del sitio:

| Uso | Tipografía | Por qué |
| --- | --- | --- |
| Títulos | **Archivo**, pesos 800-900 | Sans gruesa y geométrica, cercana al peso del logo, con licencia libre (SIL OFL) |
| Textos | **Onest** (la de la plantilla), pesos 400 y 600 | Muy legible en pantallas chicas, soporta acentos y ñ, licencia libre |

- Máximo **dos familias** en todo el sitio.
- Fuentes **auto-alojadas** (Fontsource), sin cargar desde Google Fonts.
- **No usar la tipografía del logo** para textos del sitio, aunque se identifique; el logo siempre es imagen.
- Títulos en mayúsculas y minúsculas normales (no todo en mayúsculas), salvo etiquetas cortas.

---

## 5. Tono de voz

- **Trato:** de **tú**.
- **Cercano y directo:** frases cortas, verbos concretos, sin tecnicismos innecesarios. Se habla del resultado para el cliente ("tu evento se escucha en todo el salón") antes que del equipo.
- **Seguro, sin exagerar:** nada de "los mejores", "líderes", "número uno" ni promesas que no se puedan comprobar.
- **Vocabulario obligatorio** (de `reglas-seo-digitalx.md`):
  - "iglesia" o "templo", no "casa de culto".
  - Pantallas para eventos: "**coordinamos**", nunca "tenemos".
  - "Circuito cerrado" siempre junto con "proyección en vivo" o "pantallas para eventos", aclarando que no es seguridad.
- Ortografía cuidada: acentos, signos de apertura (¿ ¡) y mayúsculas solo donde corresponde.

---

## 6. Fotografía y video

- **Solo material propio y real** de trabajos de Digital X, con permiso cuando aparezcan personas, logos o lugares de clientes (ver `reglas-seo-digitalx.md`, sección 5).
- Estilo *(propuesta)*: fotos con luz de evento, contrastadas, mostrando equipo en uso y público; que se vea el ambiente y el trabajo técnico, no fotos de catálogo.
- **PROHIBIDO** usar fotos de bancos de imágenes como si fueran trabajos propios, y las fotos de demo de la plantilla.
- Formatos, nombres de archivo y `alt`: ver `reglas-seo-digitalx.md`, sección 6.

---

## 7. Pendientes

- [ ] Archivo vectorial original del diseñador, si existe (reemplazaría los reconstruidos).
- [ ] Aprobar o descartar la versión del logo en amarillo.
- [ ] Nombres oficiales de los colores.
- [ ] Colores de estado para formularios, si se publica el formulario.
