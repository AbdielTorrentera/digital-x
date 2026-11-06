import { urlsPlaneadas } from './paginas.ts';

/**
 * Enlace a una página del sitio desde el contenido (tarjetas del Inicio, por ejemplo).
 * Acepta cualquier página en lanzamiento, esté construida o no: en desarrollo una sin construir lleva a la 404 y el
 * build de producción falla mientras quede un enlace a ella (astro.config.mjs). Una URL que no está en el registro,
 * o que está pendiente de material, nunca se enlaza: el build se detiene en vez de publicar un enlace roto.
 */
export const enlaceAPagina = (url: string): string => {
  if (!esPaginaPlaneada(url)) {
    throw new Error(`"${url}" no está en src/lib/paginas.ts como página en lanzamiento: no se puede enlazar.`);
  }
  return url;
};

/** ¿Es una página registrada en lanzamiento? La usa también check:enlaces para tolerar las aún no construidas. */
export const esPaginaPlaneada = (ruta: string): boolean => urlsPlaneadas.includes(ruta);
