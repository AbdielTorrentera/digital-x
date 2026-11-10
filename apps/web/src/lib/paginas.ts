/**
 * Registro de páginas. Fuente: docs/estructura-sitio-digitalx.md sección 3.
 * No agregar URLs que no estén en esa tabla.
 *
 * Una página solo aparece en menú, pie y sitemap si su estado es 'lanzamiento' Y está
 * construida. Marcar `construida: true` al crear su archivo en src/pages/ (el build falla
 * si se marca sin que el archivo exista). Los servicios no tienen archivo propio: los genera
 * pages/servicios/[slug].astro, y el build también falla si uno construido no trae su contenido completo
 * en content/servicios.ts.
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
  /** Solo los servicios: la sección del catálogo (/servicios/#audio, #video o #tecnologia) donde aparecen */
  categoria?: Categoria;
}

export const paginas: Pagina[] = [
  { url: '/', titulo: 'Inicio', estado: 'lanzamiento', construida: true },
  { url: '/servicios/', titulo: 'Servicios', estado: 'lanzamiento', construida: true },

  // Los 10 servicios son los oficiales del Perfil de Negocio de Google (estructura-sitio sección 3). Un solo catálogo
  // (/servicios/) y una página por servicio (/servicios/{slug}/), generada por pages/servicios/[slug].astro solo
  // cuando `construida` es true. Cada una se publica cuando el dueño apruebe sus fotos y videos: hasta entonces no se
  // enlaza y el catálogo la muestra como texto. El orden de aquí es el del catálogo y el de los textos del Inicio.
  {
    url: '/servicios/renta-de-audio/',
    titulo: 'Renta de audio y sonido',
    estado: 'lanzamiento',
    construida: true,
    categoria: 'audio',
  },

  {
    url: '/servicios/circuito-cerrado-para-eventos/',
    titulo: 'Circuito cerrado para eventos',
    estado: 'lanzamiento',
    construida: true,
    categoria: 'video',
  },
  {
    url: '/servicios/video-para-eventos/',
    titulo: 'Producción de videos para eventos',
    estado: 'lanzamiento',
    construida: true,
    categoria: 'video',
  },
  {
    url: '/servicios/streaming-para-eventos/',
    titulo: 'Transmisión en vivo',
    estado: 'lanzamiento',
    construida: true,
    categoria: 'video',
  },
  {
    url: '/servicios/video-con-drone/',
    titulo: 'Video con drone',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },
  {
    url: '/servicios/recorridos-virtuales-360/',
    titulo: 'Recorridos virtuales 360',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'video',
  },

  {
    url: '/servicios/paginas-web/',
    titulo: 'Páginas web',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },
  {
    url: '/servicios/tienda-en-linea/',
    titulo: 'Tienda en línea',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },
  {
    url: '/servicios/aplicaciones-moviles/',
    titulo: 'Desarrollo de aplicaciones móviles',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },
  {
    url: '/servicios/desarrollo-de-software/',
    titulo: 'Desarrollo de software',
    estado: 'lanzamiento',
    construida: false,
    categoria: 'tecnologia',
  },

  { url: '/proyectos/', titulo: 'Proyectos', estado: 'lanzamiento', construida: false },
  // [PENDIENTE: número mínimo de artículos para publicar el blog]
  { url: '/blog/', titulo: 'Blog', estado: 'pendiente', construida: false },
  { url: '/nosotros/', titulo: 'Nosotros', estado: 'lanzamiento', construida: true },
  {
    url: '/condiciones-de-contratacion/',
    titulo: 'Condiciones de contratación',
    estado: 'lanzamiento',
    construida: true,
  },
  { url: '/politica-de-privacidad/', titulo: 'Política de privacidad', estado: 'lanzamiento', construida: true },
];

export const visible = (p: Pagina) => p.estado === 'lanzamiento' && p.construida;
const porUrl = (url: string) => paginas.find((p) => p.url === url && visible(p));

/** Rutas relativas a src/pages/ que debe tener una página para estar construida. */
export const archivosDe = (url: string) => {
  const ruta = url === '/' ? 'index' : url.slice(1, -1);
  const archivos = [`${ruta}.astro`, `${ruta}/index.astro`];
  // Los servicios (/servicios/{slug}/) salen todos de una sola ruta dinámica.
  if (/^\/servicios\/[^/]+\/$/.test(url)) archivos.push('servicios/[slug].astro');
  return archivos;
};

/** `/servicios/renta-de-audio/` → `renta-de-audio`; solo para las URLs de servicio. */
export const slugDe = (url: string) => url.split('/')[2] ?? '';

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
  /** Sección del catálogo: /servicios/#audio, #video o #tecnologia (el id existe en pages/servicios/index.astro). */
  url: string;
}

/** Las 3 categorías de servicios del pie. Ya no son páginas: cada una lleva a su sección del catálogo. */
export const categoriasDeServicios: CategoriaDelPie[] = [
  { titulo: 'Servicios de audio', url: '/servicios/#audio' },
  { titulo: 'Servicios de video', url: '/servicios/#video' },
  { titulo: 'Servicios de tecnología', url: '/servicios/#tecnologia' },
];

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
