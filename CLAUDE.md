# Digital X — sitio web (digitalx.mx)

## El negocio

Digital X es una agencia de **audio, video y tecnología** en Atlixco, Puebla. Ofrece:

- **Audio:** renta de sonido para eventos (hasta 500 personas, técnico en cada evento) e instalación de audio fija (iglesias, escuelas, restaurantes).
- **Video:** grabación de eventos con circuito cerrado (proyección en vivo en pantallas), video para redes, streaming y dron.
- **Tecnología:** software a la medida, sitios web y tiendas en línea.

Sus clientes son, por un lado, **quienes organizan un evento** (fiestas, conferencias, eventos culturales, cultos) y, por otro, **negocios e instituciones** que necesitan contenido o software. Trabaja en un radio de unos 50 km desde Atlixco y **no tiene dirección pública**. Casi todos los clientes llegan desde el celular y cotizan por WhatsApp.

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
| `docs/reglas-diseno-digitalx.md` | Retícula, espaciado, tipografía en pantalla, jerarquía, componentes, movimiento y accesibilidad |
| `docs/buenas-practicas-digitalx.md` | Organización del código, estilo, pruebas, Git, CI/CD y definición de terminado |

**Orden de prioridad cuando dos reglas chocan:** seguridad > estructura > SEO > marca > diseño > buenas prácticas.

### Reglas que nunca se rompen

1. **No inventes datos:** clientes, cifras, marcas, precios, testimonios, permisos, zonas, direcciones, equipo ni casos. Si falta algo, escribe `[PENDIENTE: qué falta]` y repórtalo.
2. **No crees páginas ni URLs** fuera de la tabla de `docs/estructura-sitio-digitalx.md`. No publiques ni enlaces páginas en estado "Pendiente de material".
3. **Si algo no está definido o dos reglas chocan, detente y pregunta** antes de implementar.
4. **Antes de cambiar código, muestra un plan corto** con los archivos que vas a tocar y espera aprobación.
5. **Al terminar cada tarea,** entrega un reporte con lo que hiciste, cómo se verificó (build, revisión en navegador) y la lista de `[PENDIENTE: ...]` que quedan.

6. **Mobile first.** Todo se diseña y se prueba primero a 375 px de ancho y
   después se adapta a pantallas grandes. Nada se da por terminado sin
   revisarlo en móvil: sin scroll horizontal, texto legible sin zoom y
   áreas táctiles de al menos 48 px. (Detalle en reglas-seo, sección 10.)

## Stack y estructura del repo

Monorepo con pnpm workspaces:

- `apps/web`: sitio público en **Astro**, basado en la plantilla **Marby** (licencia MIT: conservar `LICENSE` y el crédito). → `digitalx.mx`
- `apps/studio`: **Sanity Studio**, en español. → `admin.digitalx.mx`
- `packages/`: código compartido (consultas GROQ, tipos generados de Sanity).

Servicios externos: **Vercel** (dos proyectos, uno por app; cada uno se reconstruye solo cuando cambia su carpeta), **Sanity** (plan gratuito, dataset `production`), **Mux** para videos (plan gratuito, máximo 10). El sitio es estático; un webhook de Sanity dispara el rebuild en Vercel.

**Qué va en Sanity:** proyectos, artículos del blog, preguntas frecuentes, testimonios (solo con permiso), servicios, datos de contacto y SEO de proyectos y artículos. **Qué va en código:** diseño, layout, navegación, páginas legales y SEO de las páginas fijas.

## Comandos

- Gestor de paquetes: **pnpm**. Nunca usar `npm` ni `npx` (usar `pnpm dlx`).
- Desarrollo: `pnpm dev` dentro de cada app (web en :4321, studio en :3333).
- Comandos de Sanity: `pnpm sanity ...` desde `apps/studio`.
- Antes de dar por terminada una tarea en `apps/web`: `pnpm build` sin errores.

## Adaptar Marby: lo que hay que cambiar

La plantilla trae cosas que chocan con las reglas. Al trabajar en cada sección:

- **Idioma:** todo en español, `lang="es-MX"`.
- **"Properties" → proyectos**, con los campos de `docs/reglas-seo-digitalx.md` sección 7 (reto, solución, resultado). Sin precio, recámaras ni área.
- **Video de portada:** imagen de póster en móvil; el video solo se carga en escritorio. Debe cumplir LCP ≤ 2.5 s.
- **Imágenes de contenido como fondo CSS:** pasarlas a `<img>` con `alt`, `width` y `height`.
- **Mapa de Google** en el detalle: quitarlo.
- **Tarjeta de asesor, sección de equipo, testimonios y logos:** no se muestran sin datos reales y permiso.
- **Formulario de contacto:** oculto hasta que el dueño decida publicarlo.
- **Badge de tienda y enlaces a Startfrom:** quitarlos (salvo el crédito de licencia).
- **Animaciones y scroll suave (Lenis):** respetar `prefers-reduced-motion` y medir que no afecten el INP en móvil.
- **Fotos de demo de Marby:** no están licenciadas; no pueden llegar a producción.

## Referencia

- Textos del sitio anterior (solo para reutilizarlos, corrigiendo erratas): `docs/referencia/sitio-anterior-wordpress.md`. No es fuente de verdad: logos, testimonios y datos de ahí no se publican sin confirmación.
