# Digital X — sitio público (digitalx.mx)

Sitio estático en **Astro**. Las reglas del proyecto viven en `../../docs/` y mandan sobre este archivo; el resumen está en `../../CLAUDE.md`.

## Comandos

```sh
pnpm dev      # http://localhost:4321
pnpm build    # genera dist/
pnpm preview  # sirve dist/
```

## Estructura

```
src/
  components/        Nav, Footer, WhatsApp, BotonLlamar, Seo, SchemaNegocio, Btn, Icon
    sections/, ui/   componentes de la plantilla Marby, hoy sin usar (referencia visual)
  layouts/Base.astro head, nav, pie, botón de WhatsApp, scripts
  lib/negocio.ts     datos del negocio, mensajes de WhatsApp (fuente única)
  lib/paginas.ts     registro de páginas: estado y si están construidas
  lib/entorno.ts     producción vs. previews (noindex)
  pages/             rutas
  scripts/           un módulo por comportamiento, conectados en entry.ts
  styles/            tokens.css, global.css
```

## Cómo se publica una página

1. Crear su archivo en `src/pages/` con la URL exacta de `docs/estructura-sitio-digitalx.md`.
2. En `src/lib/paginas.ts`, poner `construida: true` (y `estado: 'lanzamiento'` si ya tiene material).
3. Con eso aparece sola en el menú, el pie, la 404 y el sitemap. El build falla si se marca `construida` sin el archivo.

## Entorno

Solo `VERCEL_ENV=production` se indexa. Local y previews llevan `noindex` y `robots.txt` con `Disallow: /`. Ver `.env.example`.

## Licencia y créditos

Basado en la plantilla **Marby** de Alex Prokhorov (Startfrom), licencia MIT: ver `LICENSE`, que debe conservarse. Tipografías Urbanist y Onest (SIL Open Font License 1.1), auto-alojadas con Fontsource.
