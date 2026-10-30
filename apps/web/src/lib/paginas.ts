/**
 * Registro de páginas. Fuente: docs/estructura-sitio-digitalx.md sección 3.
 * No agregar URLs que no estén en esa tabla.
 *
 * Una página solo aparece en menú, pie, 404 y sitemap si su estado es
 * 'lanzamiento' Y está construida. Marcar `construida: true` al crear su archivo
 * en src/pages/ (el build falla si se marca sin que el archivo exista).
 */
export type Categoria = 'audio' | 'video' | 'tecnologia';

export interface Pagina {
  url: string;
  titulo: string;
  estado: 'lanzamiento' | 'pendiente';
  construida: boolean;
  categoria?: Categoria;
  /** true si es la página de la categoría (hub), no un servicio */
  hub?: boolean;
}

export const paginas: Pagina[] = [
  { url: '/', titulo: 'Inicio', estado: 'lanzamiento', construida: true },
  { url: '/servicios/', titulo: 'Servicios', estado: 'lanzamiento', construida: false },

  { url: '/servicios-de-audio/', titulo: 'Audio', estado: 'lanzamiento', construida: false, categoria: 'audio', hub: true },
  { url: '/servicios-de-audio/renta-de-sonido/', titulo: 'Renta de sonido', estado: 'lanzamiento', construida: false, categoria: 'audio' },
  { url: '/servicios-de-audio/instalacion-de-audio/', titulo: 'Instalación de audio', estado: 'lanzamiento', construida: false, categoria: 'audio' },

  { url: '/servicios-de-video/', titulo: 'Video', estado: 'lanzamiento', construida: false, categoria: 'video', hub: true },
  { url: '/servicios-de-video/grabacion-de-eventos/', titulo: 'Grabación de eventos', estado: 'lanzamiento', construida: false, categoria: 'video' },
  { url: '/servicios-de-video/video-para-redes/', titulo: 'Video para redes', estado: 'lanzamiento', construida: false, categoria: 'video' },
  { url: '/servicios-de-video/streaming/', titulo: 'Streaming', estado: 'lanzamiento', construida: false, categoria: 'video' },
  { url: '/servicios-de-video/dron/', titulo: 'Dron', estado: 'pendiente', construida: false, categoria: 'video' },

  { url: '/servicios-de-tecnologia/', titulo: 'Tecnología', estado: 'lanzamiento', construida: false, categoria: 'tecnologia', hub: true },
  { url: '/servicios-de-tecnologia/software-a-la-medida/', titulo: 'Software a la medida', estado: 'lanzamiento', construida: false, categoria: 'tecnologia' },
  { url: '/servicios-de-tecnologia/sitios-web/', titulo: 'Sitios web', estado: 'lanzamiento', construida: false, categoria: 'tecnologia' },
  { url: '/servicios-de-tecnologia/tienda-en-linea/', titulo: 'Tienda en línea', estado: 'pendiente', construida: false, categoria: 'tecnologia' },

  { url: '/proyectos/', titulo: 'Proyectos', estado: 'lanzamiento', construida: false },
  // [PENDIENTE: número mínimo de artículos para publicar el blog]
  { url: '/blog/', titulo: 'Blog', estado: 'pendiente', construida: false },
  { url: '/nosotros/', titulo: 'Nosotros', estado: 'lanzamiento', construida: false },
  { url: '/contacto/', titulo: 'Contacto', estado: 'lanzamiento', construida: false },
  { url: '/condiciones-de-contratacion/', titulo: 'Condiciones de contratación', estado: 'lanzamiento', construida: false },
  { url: '/politica-de-privacidad/', titulo: 'Política de privacidad', estado: 'lanzamiento', construida: false },
];

export const visible = (p: Pagina) => p.estado === 'lanzamiento' && p.construida;
const porUrl = (url: string) => paginas.find((p) => p.url === url && visible(p));

/** Rutas relativas a src/pages/ que debe tener una página para estar construida. */
export const archivosDe = (url: string) => {
  const ruta = url === '/' ? 'index' : url.slice(1, -1);
  return [`${ruta}.astro`, `${ruta}/index.astro`];
};

// El build falla si una página se marca como construida sin su archivo (ver astro.config.mjs).
export const urlsConstruidas = paginas.filter((p) => p.construida).map((p) => p.url);

export const urlsPublicadas = paginas.filter(visible).map((p) => p.url);

export interface GrupoMenu {
  titulo: string;
  /** página de la categoría, si ya está construida */
  hub: Pagina | undefined;
  servicios: Pagina[];
}

const nombresCategoria: Record<Categoria, string> = { audio: 'Audio', video: 'Video', tecnologia: 'Tecnología' };

/** Categorías de servicios con al menos una página visible (la categoría o alguno de sus servicios). */
export const gruposDeServicios: GrupoMenu[] = (['audio', 'video', 'tecnologia'] as Categoria[])
  .map((c) => ({
    titulo: nombresCategoria[c],
    hub: paginas.find((p) => p.categoria === c && p.hub && visible(p)),
    servicios: paginas.filter((p) => p.categoria === c && !p.hub && visible(p)),
  }))
  .filter((g) => g.hub || g.servicios.length > 0);

export interface ItemMenu {
  titulo: string;
  url?: string;
  /** si existe, el ítem es un desplegable (Servicios) */
  grupos?: GrupoMenu[];
}

/** Menú principal: Inicio · Servicios (desplegable) · Proyectos · Blog · Nosotros · Contacto. */
export const menu: ItemMenu[] = [
  porUrl('/') && { titulo: 'Inicio', url: '/' },
  (gruposDeServicios.length > 0 || porUrl('/servicios/')) && {
    titulo: 'Servicios',
    url: porUrl('/servicios/')?.url,
    grupos: gruposDeServicios,
  },
  ...['/proyectos/', '/blog/', '/nosotros/', '/contacto/'].map((u) => {
    const p = porUrl(u);
    return p && { titulo: p.titulo, url: p.url };
  }),
].filter(Boolean) as ItemMenu[];

/** Enlaces de información del pie (sin servicios, que salen de gruposDeServicios). */
export const enlacesInformacion: Pagina[] = [
  '/proyectos/',
  '/blog/',
  '/nosotros/',
  '/contacto/',
  '/condiciones-de-contratacion/',
  '/politica-de-privacidad/',
]
  .map(porUrl)
  .filter(Boolean) as Pagina[];

/** Enlaces de salida de la 404: Inicio y Servicios (reglas-seo sección 9), solo si existen. */
export const enlacesDe404: Pagina[] = ['/', '/servicios/'].map(porUrl).filter(Boolean) as Pagina[];
