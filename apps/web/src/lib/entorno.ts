/**
 * Solo el entorno de producción de Vercel se indexa (reglas-seo sección 9).
 * Local y previews llevan noindex y robots.txt bloqueado.
 * ⚠ Antes de lanzar: verificar que VERCEL_ENV=production en el proyecto de digitalx.mx.
 */
export const esProduccion = process.env.VERCEL_ENV === 'production';
