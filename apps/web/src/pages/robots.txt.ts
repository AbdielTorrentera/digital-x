import type { APIRoute } from 'astro';
import { esProduccion } from '../lib/entorno';

/**
 * Producción (VERCEL_ENV=production): se permite todo y se declara el sitemap.
 * Local y previews: se bloquea todo (reglas-seo sección 9).
 */
export const GET: APIRoute = ({ site }) =>
  new Response(
    esProduccion
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
