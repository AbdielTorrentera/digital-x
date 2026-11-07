/**
 * Registro de páginas. Fuente: docs/estructura-sitio-digitalx.md sección 3.
 * No agregar URLs que no estén en esa tabla.
 *
 * Una página solo aparece en menú, pie y sitemap si su estado es 'lanzamiento' Y está
 * construida. Marcar `construida: true` al crear su archivo en src/pages/ (el build falla
 * si se marca sin que el archivo exista).
 *
 * Páginas planeadas: las de estado 'lanzamiento' que aún no se construyen. Se pueden enlazar
 * desde el contenido (en desarrollo llevan a la 404), pero el build de producción falla
 * mientras exista un enlace a una (ver astro.config.mjs). Las 'pendiente' nunca se enlazan.
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

  // Los 10 servicios son los oficiales del Perfil de Negocio de Google (estructura-sitio sección 3). Cada página se
  // publica cuando el dueño apruebe sus fotos y videos: hasta entonces `construida` es false y no se enlaza.
  {
    url: '/servicios-de-audio/',
    titulo: 'Audio',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'audio',
    hub: true,
  },
  {
    url: '/servicios-de-audio/renta-de-audio/',
    titulo: 'Renta de audio y sonido',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'audio',
  },

  {
    url: '/servicios-de-video/',
    titulo: 'Video',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
    hub: true,
  },
  {
    url: '/servicios-de-video/circuito-cerrado/',
    titulo: 'Circuito cerrado para eventos',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },
  {
    url: '/servicios-de-video/grabacion-de-eventos/',
    titulo: 'Producción de videos para eventos',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },
  {
    url: '/servicios-de-video/streaming/',
    titulo: 'Transmisión en vivo',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },
  {
    url: '/servicios-de-video/dron/',
    titulo: 'Video con dron',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },
  {
    url: '/servicios-de-video/recorridos-360/',
    titulo: 'Recorridos virtuales 360',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },

  {
    url: '/servicios-de-tecnologia/',
    titulo: 'Tecnología',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
    hub: true,
  },
  {
    url: '/servicios-de-tecnologia/paginas-web/',
    titulo: 'Páginas web',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },
  {
    url: '/servicios-de-tecnologia/apps-moviles/',
    titulo: 'Desarrollo de apps móviles',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },
  {
    url: '/servicios-de-tecnologia/desarrollo-de-software/',
    titulo: 'Desarrollo de software',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },
  {
    url: '/servicios-de-tecnologia/tienda-en-linea/',
    titulo: 'Tienda en línea',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },

  { url: '/proyectos/', titulo: 'Proyectos', estado: 'lanzamiento', construida: false },
  // [PENDIENTE: número mínimo de artículos para publicar el blog]
  { url: '/blog/', titulo: 'Blog', estado: 'pendiente', construida: false },
  { url: '/nosotros/', titulo: 'Nosotros', estado: 'lanzamiento', construida: false },
  {
    url: '/condiciones-de-contratacion/',
    titulo: 'Condiciones de contratación',
    estado: 'lanzamiento',
    construida: false,
  },
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

/** Páginas en lanzamiento, construidas o no: las únicas a las que el contenido puede enlazar. */
export const urlsPlaneadas = paginas.filter((p) => p.estado === 'lanzamiento').map((p) => p.url);

/** Planeadas que todavía no existen: producción no compila si algún enlace apunta a ellas. */
export const urlsSinConstruir = paginas.filter((p) => p.estado === 'lanzamiento' && !p.construida).map((p) => p.url);

export interface CategoriaDelPie {
  /** Texto del enlace: "Servicios de audio", "Servicios de video" o "Servicios de tecnología". */
  titulo: string;
  url: string;
}

/**
 * Categorías de servicios del pie. Como el menú, enlazan las páginas de categoría planeadas aunque aún no estén
 * construidas; el build de producción falla mientras quede alguna.
 */
export const categoriasDeServicios: CategoriaDelPie[] = paginas
  .filter((p) => p.hub && p.estado === 'lanzamiento')
  .map((p) => ({ titulo: `Servicios de ${p.titulo.toLowerCase()}`, url: p.url }));

export interface ItemMenu {
  titulo: string;
  url: string;
}

/**
 * Menú principal (panel de pantalla completa de Marby): Inicio · Servicios · Proyectos · Blog · Nosotros. No hay página
 * de contacto (decisión del dueño): el teléfono y WhatsApp viven en el pie y en los botones flotantes.
 * Enlaza páginas planeadas (en lanzamiento) aunque aún no estén construidas: llevan a la 404 en desarrollo y el build
 * de producción falla mientras quede alguna. Blog solo aparece cuando está publicado (hoy "pendiente de material").
 * El pie, en cambio, solo muestra páginas construidas.
 */
export const menu: ItemMenu[] = [
  { url: '/' },
  { url: '/servicios/' },
  { url: '/proyectos/' },
  { url: '/blog/', soloPublicada: true },
  { url: '/nosotros/' },
]
  .map(({ url, soloPublicada }) => {
    const pagina = paginas.find((p) => p.url === url && (soloPublicada ? visible(p) : p.estado === 'lanzamiento'));
    return pagina && { titulo: pagina.titulo, url: pagina.url };
  })
  .filter(Boolean) as ItemMenu[];

// Como el menú, el pie enlaza páginas planeadas aunque aún no estén construidas (el build de producción falla mientras
// quede alguna). El Blog solo entra cuando esté publicado.
const paginasDelPie = (urls: string[]) =>
  urls
    .map((url) => paginas.find((p) => p.url === url && (url === '/blog/' ? visible(p) : p.estado === 'lanzamiento')))
    .filter(Boolean) as Pagina[];

/** Grupo "Digital X" del pie: Proyectos y Nosotros (y Blog cuando esté publicado). */
export const enlacesEmpresa = paginasDelPie(['/proyectos/', '/blog/', '/nosotros/']);

/** Línea inferior del pie, junto al ©: Condiciones de contratación y Política de privacidad. */
export const enlacesLegales = paginasDelPie(['/condiciones-de-contratacion/', '/politica-de-privacidad/']);

/** Destino de "Ver servicios" en la 404: la página de Servicios cuando exista; mientras, la sección del Inicio. */
export const urlVerServicios = porUrl('/servicios/')?.url ?? '/#servicios';
