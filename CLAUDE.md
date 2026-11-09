# Digital X — sitio web (digitalx.mx)

## El negocio

Digital X es una agencia de **audio, video y tecnología** con base en Atlixco, estado de Puebla. Sus servicios son los oficiales de su Perfil de Negocio de Google:

- **Audio:** renta de audio y sonido, y sonorización, para eventos (personal técnico capacitado de principio a fin). La sonorización se nombra en los textos pero no tiene página propia.
- **Video:** circuito cerrado para eventos (cámaras en vivo proyectadas en pantallas; no es sistema de seguridad ni graba), producción de videos para eventos, transmisión en vivo (streaming), video con dron y recorridos virtuales 360.
- **Tecnología:** páginas web (páginas de destino y desarrollo web), desarrollo de apps móviles, desarrollo de software y tienda en línea.

Sus clientes son, por un lado, **quienes organizan un evento** (fiestas, conferencias, eventos culturales, cultos) y, por otro, **negocios e instituciones** que necesitan contenido o software. Atiende en Puebla (la ciudad), Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores. Dato interno: en las tres primeras el traslado va incluido y en las demás hay cargo adicional; eso **no se publica** en el sitio. **No tiene dirección pública**. Casi todos los clientes llegan desde el celular y cotizan por WhatsApp.

## Qué estamos construyendo

Un sitio nuevo que reemplaza al anterior en WordPress (digitalequis.com). Objetivos, en orden:

1. Que la gente de la zona encuentre a Digital X en Google cuando busca cada servicio.
2. Que cotice por WhatsApp o llame con el menor esfuerzo posible desde el celular.
3. Que el dueño pueda actualizar proyectos, preguntas frecuentes y artículos sin tocar código.

## Reglas del proyecto (leer antes de cualquier tarea)

Las reglas viven en `docs/`, un archivo por tema. **Son obligatorias.** Antes de implementar algo, lee los archivos que apliquen:

| Archivo | Manda sobre |
| --- | --- |
| `docs/estructura-sitio-digitalx.md` | Datos del negocio, páginas permitidas, URLs, navegación, redirecciones y estados de publicación |
| `docs/reglas-seo-digitalx.md` | Metadatos, encabezados, enlazado, contenido, imágenes, SEO técnico, rendimiento, WhatsApp, datos estructurados |
| `docs/reglas-seguridad-digitalx.md` | Secretos, contenido de Sanity, encabezados HTTP, dependencias, cuentas y datos personales. Tiene la prioridad más alta |
| `docs/identidad-marca-digitalx.md` | Logos, colores, contraste, tipografías y tono de voz |
| `docs/reglas-diseno-digitalx.md` | Retícula, espaciado, tipografía en pantalla, jerarquía, componentes, movimiento y accesibilidad |
| `docs/buenas-practicas-digitalx.md` | Organización del código, estilo, pruebas, Git, CI/CD y definición de terminado |

**Orden de prioridad cuando dos reglas chocan:** seguridad > estructura > SEO > marca > diseño > buenas prácticas.

### Reglas que nunca se rompen

1. **No inventes datos:** clientes, cifras, marcas, precios, testimonios, permisos, zonas, direcciones, equipo ni casos. Si falta algo, escribe `[PENDIENTE: qué falta]` y repórtalo.
2. **No crees páginas ni URLs** fuera de la tabla de `docs/estructura-sitio-digitalx.md`. No publiques ni enlaces páginas en estado "Pendiente de material".
3. **Si algo no está definido o dos reglas chocan, detente y pregunta** antes de implementar.
4. **Antes de cambiar código, muestra un plan corto** con los archivos que vas a tocar y espera aprobación.
5. **Al terminar cada tarea,** entrega un reporte con lo que hiciste, cómo se verificó (build, revisión en navegador) y la lista de `[PENDIENTE: ...]` que quedan.

6. **Mobile first.** Todo se diseña y se prueba primero a 360 px y después en
   pantallas grandes (detalle en reglas-diseno).
7. **Cero costos.** Prohibido usar, activar o recomendar cualquier servicio,
   plan, función o complemento de pago, o que pida tarjeta. Si algo solo
   existe de pago, se reporta y se busca una alternativa gratuita.

## Stack y estructura del repo

Monorepo con pnpm workspaces:

- `apps/web`: sitio público en **Astro**, basado en la plantilla **Marby** (licencia MIT: conservar `LICENSE` y el crédito). → `digitalx.mx`
- `apps/studio`: **Sanity Studio**, en español. → `admin.digitalx.mx`
- `packages/`: código compartido (consultas GROQ, tipos generados de Sanity).

Servicios externos: **Vercel** (dos proyectos, uno por app; cada uno se reconstruye solo cuando cambia su carpeta), **Sanity** (plan gratuito, dataset `production`), **Mux** para videos (plan gratuito, máximo 10). El sitio es estático; un webhook de Sanity dispara el rebuild en Vercel.

- `brand/` es la fuente única de logos e íconos; lo copiado en `apps/web` se actualiza desde ahí, nunca al revés.
- Mux en plan gratuito: se acepta su marca en el reproductor; no proponer quitarla.

**Qué va en Sanity:** proyectos, artículos del blog, preguntas frecuentes, testimonios (solo con permiso), servicios, datos de contacto y SEO de proyectos y artículos. **Qué va en código:** diseño, layout, navegación, páginas legales y SEO de las páginas fijas.

## Comandos

- Gestor de paquetes: **pnpm**. Nunca usar `npm` ni `npx` (usar `pnpm dlx`).
- Desarrollo: `pnpm dev` dentro de cada app (web en :4321, studio en :3333).
- Comandos de Sanity: `pnpm sanity ...` desde `apps/studio`.
- Antes de dar por terminada una tarea en `apps/web`: `pnpm build` sin errores.
- Verificaciones: `pnpm format` / `pnpm format:check` (raíz); `pnpm check`, `pnpm test`, `pnpm build` y `pnpm check:enlaces` (en `apps/web`); `pnpm check` (en `apps/studio`).

## Adaptar Marby: lo que hay que cambiar

La plantilla trae cosas que chocan con las reglas. Al trabajar en cada sección:

- **Idioma:** todo en español, `lang="es-MX"`.
- **"Properties" → proyectos**, con los campos de `docs/reglas-seo-digitalx.md` sección 7 (reto, solución, resultado). Sin precio, recámaras ni área.
- **Video de portada:** imagen de póster en móvil; el video solo se carga en escritorio. Debe cumplir LCP ≤ 2.5 s.
- **Imágenes de contenido como fondo CSS:** pasarlas a `<img>` con `alt`, `width` y `height`.
- **Mapa de Google** en el detalle: quitarlo.
- **Tarjeta de asesor, sección de equipo, testimonios y logos:** no se muestran sin datos reales y permiso.
- **Formulario de contacto:** no hay página de contacto (decisión del dueño); no se publica ningún formulario. El contacto es por WhatsApp y llamada.
- **Badge de tienda y enlaces a Startfrom:** quitarlos (salvo el crédito de licencia).
- **Animaciones y scroll suave (Lenis):** respetar `prefers-reduced-motion` y medir que no afecten el INP en móvil.
- **Fotos de demo de Marby:** no están licenciadas; no pueden llegar a producción.

## Referencia

- Textos del sitio anterior (solo para reutilizarlos, corrigiendo erratas): `docs/referencia/sitio-anterior-wordpress.md`. No es fuente de verdad: logos, testimonios y datos de ahí no se publican sin confirmación.
