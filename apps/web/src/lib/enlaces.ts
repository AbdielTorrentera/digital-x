import { paginas, urlsPlaneadas, visible } from './paginas.ts';

/**
 * Enlace a una página del sitio desde el contenido (tarjetas del Inicio, por ejemplo), con o sin ancla
 * (`/#servicios`). Acepta cualquier página en lanzamiento, esté construida o no: en desarrollo una sin construir
 * lleva a la 404 y el build de producción falla mientras quede un enlace a ella (astro.config.mjs). Una URL que no está
 * en el registro, o que está pendiente de material, nunca se enlaza: el build se detiene en vez de publicar un enlace
 * roto. Que el ancla exista en la página lo verifica `pnpm check:enlaces` sobre el HTML construido.
 */
export const enlaceAPagina = (url: string): string => {
  if (!esPaginaPlaneada(url.split('#')[0])) {
    throw new Error(`"${url}" no está en src/lib/paginas.ts como página en lanzamiento: no se puede enlazar.`);
  }
  return url;
};

/**
 * Enlace a una página que puede no existir según los datos (hoy, /proyectos/: solo existe con proyectos publicados):
 * devuelve la URL si la página está construida y `null` si no, para que el componente muestre texto sin enlace. Una URL
 * que no está en el registro se rechaza igual que en `enlaceAPagina`. Es el mismo patrón que `enlaceDeServicio`.
 */
export const enlaceSiExiste = (url: string): string | null => {
  enlaceAPagina(url);
  const pagina = paginas.find((p) => p.url === url.split('#')[0]);
  return pagina && visible(pagina) ? url : null;
};

/** ¿Es una página registrada en lanzamiento? La usa también check:enlaces para tolerar las aún no construidas. */
export const esPaginaPlaneada = (ruta: string): boolean => urlsPlaneadas.includes(ruta);

/** Los `id` que declara un HTML: a ellos pueden apuntar las anclas (`#id`). */
export const idsDeHtml = (html: string): Set<string> =>
  new Set([...html.matchAll(/\sid\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map((m) => m[1] ?? m[2] ?? ''));

/** El ancla de un enlace sin el `#` ("/#servicios" → "servicios"); vacío si no tiene o si es solo "#". */
export const anclaDe = (enlace: string): string => {
  const i = enlace.indexOf('#');
  return i === -1 ? '' : decodeURIComponent(enlace.slice(i + 1));
};
