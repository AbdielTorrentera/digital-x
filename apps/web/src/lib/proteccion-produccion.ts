/**
 * Protecciones del build de producción: impiden publicar por error material provisional.
 * Solo actúan cuando VERCEL_ENV=production (ver astro.config.mjs); en local y en previews no se aplican.
 * Funciones puras, sin imports, para poder probarlas con node:test.
 */

/** Las fotos de apps/web/src/assets/temporales/ se llaman "temporal-…" y Astro conserva ese nombre al emitirlas. */
const PREFIJO_TEMPORAL = 'temporal-';

/** De una lista de rutas (por ejemplo, los archivos de dist/), las que son fotos temporales. */
export const archivosTemporales = (rutas: string[]): string[] =>
  rutas.filter((ruta) => (ruta.split(/[\\/]/).pop() ?? '').startsWith(PREFIJO_TEMPORAL));

/**
 * Astro emite cada foto en varios anchos y formatos (temporal-x.HASH_a.webp, temporal-x.HASH_b.avif…).
 * Esto las agrupa por la foto original ("temporal-x") para que el aviso del build sea legible.
 */
export const nombresDeFotosTemporales = (rutas: string[]): string[] => [
  ...new Set(archivosTemporales(rutas).map((ruta) => (ruta.split(/[\\/]/).pop() ?? '').replace(/\..*$/, ''))),
];

export interface PaginaHtml {
  url: string;
  html: string;
}

// Un [PENDIENTE que solo está en un comentario, un script, un estilo o el JSON-LD no lo ve nadie y no cuenta.
const sinCodigoNiComentarios = (html: string) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');

/** URLs de las páginas cuyo HTML visible (texto o atributos como alt) todavía trae un `[PENDIENTE`. */
export const paginasConPendientes = (paginas: PaginaHtml[]): string[] =>
  paginas.filter((pagina) => sinCodigoNiComentarios(pagina.html).includes('[PENDIENTE')).map((pagina) => pagina.url);

/** `index.html` → `/`, `404.html` → `/404/`, `video/index.html` → `/video/`. */
export const urlDeArchivoHtml = (ruta: string): string => {
  const limpia = ruta
    .replace(/\\/g, '/')
    .replace(/(^|\/)index\.html$/, '$1')
    .replace(/\.html$/, '/');
  return limpia.startsWith('/') ? limpia : `/${limpia}`;
};

export interface EnlaceANoConstruida {
  /** Página donde está el enlace. */
  pagina: string;
  /** Destino tal como está escrito en el HTML. */
  enlace: string;
}

/**
 * Enlaces internos del HTML (href) que apuntan a una página planeada que aún no está construida. En desarrollo se
 * permiten (llevan a la 404); en producción no. Ignora enlaces externos, esquemas (tel:, mailto:), anclas de la misma
 * página y todo lo que esté en comentarios, scripts o estilos. `#ancla` y `?x` no cambian la página de destino.
 */
export const enlacesANoConstruidas = (paginas: PaginaHtml[], urlsSinConstruir: string[]): EnlaceANoConstruida[] => {
  const sinConstruir = new Set(urlsSinConstruir);
  const encontrados = new Map<string, EnlaceANoConstruida>();
  for (const { url, html } of paginas) {
    for (const m of sinCodigoNiComentarios(html).matchAll(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      const enlace = (m[1] ?? m[2] ?? '').trim();
      if (!enlace || /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(enlace)) continue;
      const ruta = new URL(enlace, `https://sitio.local${url}`).pathname;
      if (sinConstruir.has(ruta)) encontrados.set(`${url}\n${enlace}`, { pagina: url, enlace });
    }
  }
  return [...encontrados.values()];
};
