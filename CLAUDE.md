# Digital X — sitio web

Sitio de Digital X, agencia de audio, video y tecnología en Atlixco, Puebla.
Reemplaza el sitio anterior en WordPress.

## Estructura
Monorepo con pnpm workspaces.
- apps/web: Astro, basado en la plantilla Marby (licencia MIT, conservar LICENSE).
  Sitio público → digitalequis.com
- apps/studio: Sanity Studio en español → admin.digitalequis.com
- packages/: código compartido entre web y studio (consultas GROQ, tipos generados).

## Comandos
- Gestor de paquetes: pnpm. Nunca usar npm ni npx (usar pnpm dlx).
- Comandos de Sanity: `pnpm sanity ...` desde apps/studio.
- Desarrollo: `pnpm dev` dentro de cada app (web en :4321, studio en :3333).

## Contenido
- Fuente del contenido actual: docs/estructura-digitalx.md. Todo el sitio va en español.
- En Sanity: proyectos (con galería), servicios, testimonios, FAQ, logos de clientes,
  datos de contacto, teléfono de WhatsApp y cifras.
- En código: diseño, layout, menú, pie de página y páginas legales.
- Videos: Mux (plugin sanity-plugin-mux-input), plan gratuito, máximo 10 videos.

## Reglas
- Conservar las URLs actuales: /servicios/, /nosotros/, /contacto/, /renta-de-audio/,
  /servicios-de-video/, /politica-de-privacidad/
- Botón flotante de WhatsApp en todo el sitio, con mensaje prellenado según la página.
- Las "propiedades" de Marby se convierten en "proyectos": tipo de evento, lugar,
  servicio y fecha en lugar de área, recámaras y precio.
- El sitio es estático; un webhook de Sanity dispara el rebuild en Vercel.
- No usar las fotos de demo de Marby en producción (no están licenciadas).

## Dominios
- Principal: digitalx.mx (DNS en Akky) → sitio público
- Studio: admin.digitalx.mx
- digitalequis.com (DNS en GoDaddy) → redirige todo a digitalx.mx, conservando las rutas

## Datos de contacto
- Teléfono y WhatsApp: +52 244 124 4913
- Correo público: contacto@digitalx.mx (todavía no configurado; no mostrarlo en el sitio
  hasta que el correo funcione)