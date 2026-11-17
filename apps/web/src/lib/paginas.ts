/**
 * Registro de páginas. Fuente: docs/estructura-sitio-digitalx.md sección 3.
 * No agregar URLs que no estén en esa tabla.
 *
 * Una página solo aparece en menú, pie y sitemap si su estado es 'lanzamiento' Y está
 * construida. Marcar `construida: true` al crear su archivo en src/pages/ (el build falla
 * si se marca sin que el archivo exista). Los servicios no tienen archivo propio: los genera
 * pages/[categoria]/[slug].astro desde los servicios publicados en Sanity («Página construida»), y el build también falla
 * si uno construido no trae su contenido completo. Las páginas de categoría (/audio/, /video/ y /tecnologia/) tampoco: las
 * genera pages/[categoria].astro desde las categorías de Sanity, y solo existen cuando la categoría tiene dos o más
 * servicios construidos (ver `destinoDeCategoria`).
 *
 * Páginas planeadas: las de estado 'lanzamiento' que aún no se construyen. Se pueden enlazar
 * desde el contenido (en desarrollo llevan a la 404), pero el build de producción falla
 * mientras exista un enlace a una (ver astro.config.mjs). Las 'pendiente' nunca se enlazan.
 */
import { PAGINAS_FIJAS_SIN_CONSTRUIR } from '@digitalx/sanity/reglas';
import { categorias } from './contenido/categorias.ts';
import { registroDeServicios } from './contenido/servicios.ts';

/** El slug de una categoría (`audio`, `video`, `tecnologia`…): sale de las categorías de Sanity. */
export type Categoria = string;

export interface Pagina {
  url: string;
  titulo: string;
  estado: 'lanzamiento' | 'pendiente';
  construida: boolean;
  /** Solo los servicios: la categoría a la que pertenecen (Audio, Video o Tecnología). */
  categoria?: Categoria;
  /** Solo las páginas de categoría (/audio/, /video/ y /tecnologia/): la categoría de la que son página. */
  paginaDe?: Categoria;
}

/** El slug de la URL de una categoría (/audio/, /video/, /tecnologia/), desde las categorías de Sanity. */
const slugDeCategoria = (id: Categoria) => categorias.find((c) => c.id === id)!.slug;

/**
 * Un servicio del registro. Su URL **se deriva de su categoría**: /{categoria}/{slug}/ (por ejemplo,
 * /video/video-con-drone/). Nunca se escribe a mano, y nada cuelga de /servicios/.
 */
const servicio = (slug: string, titulo: string, categoria: Categoria, construida: boolean): Pagina => ({
  url: `/${slugDeCategoria(categoria)}/${slug}/`,
  titulo,
  estado: 'lanzamiento',
  construida,
  categoria,
});

/** Páginas fijas y servicios. Las páginas de categoría se derivan de estos y de las categorías de Sanity (abajo). */
const base: Pagina[] = [
  { url: '/', titulo: 'Inicio', estado: 'lanzamiento', construida: true },

  // Los servicios son los oficiales del Perfil de Negocio de Google (estructura-sitio sección 3) y salen de Sanity, por
  // orden de categoría y luego por su orden. Una página por servicio (/{categoria}/{slug}/), generada por
  // pages/[categoria]/[slug].astro solo cuando «Página construida» está marcada: hasta entonces no se enlaza y su nombre
  // es texto.
  ...registroDeServicios.map((s) => servicio(s.slug, s.titulo, s.categoria, s.construida)),

  // Se construye en su etapa: entonces se quita de `PAGINAS_FIJAS_SIN_CONSTRUIR` (packages/sanity/reglas/constantes.ts).
  {
    url: '/proyectos/',
    titulo: 'Proyectos',
    estado: 'lanzamiento',
    construida: !PAGINAS_FIJAS_SIN_CONSTRUIR.includes('/proyectos/'),
  },
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

/** Los servicios de una categoría que ya tienen página, en el orden del registro. */
export const serviciosConstruidos = (id: Categoria): Pagina[] => base.filter((p) => p.categoria === id && visible(p));

/** Con cuántos servicios construidos una categoría tiene su propia página. Con uno solo, el enlace va a ese servicio. */
export const MINIMO_PARA_PAGINA = 2;

/**
 * Las páginas de categoría que existen hoy: las categorías con dos o más servicios construidos. Se calcula cada vez, así
 * que sigue al registro (publicar o retirar un servicio cambia la lista sin tocar nada más).
 */
export const paginasDeCategoria = (): Pagina[] =>
  categorias
    .filter((c) => serviciosConstruidos(c.id).length >= MINIMO_PARA_PAGINA)
    .map((c) => ({ url: `/${c.slug}/`, titulo: c.etiqueta, estado: 'lanzamiento', construida: true, paginaDe: c.id }));

/**
 * A dónde lleva una categoría en el menú, el Inicio y el pie: su página si tiene dos o más servicios construidos; el
 * servicio, si solo tiene uno (entonces no hay página de categoría); `null` si no tiene ninguno (no se muestra).
 */
export const destinoDeCategoria = (id: Categoria): string | null => {
  const construidos = serviciosConstruidos(id);
  if (construidos.length === 0) return null;
  if (construidos.length === 1) return construidos[0].url;
  return `/${categorias.find((c) => c.id === id)!.slug}/`;
};

/** Todas las páginas: fijas, servicios y las de categoría que existen hoy. */
export const paginas: Pagina[] = [...base, ...paginasDeCategoria()];

/** Rutas relativas a src/pages/ que debe tener una página para estar construida. */
export const archivosDe = (url: string) => {
  const ruta = url === '/' ? 'index' : url.slice(1, -1);
  const archivos = [`${ruta}.astro`, `${ruta}/index.astro`];
  // Los servicios (/{categoria}/{slug}/) salen todos de una sola ruta dinámica, y las categorías de otra.
  if (paginas.some((p) => p.categoria && p.url === url)) archivos.push('[categoria]/[slug].astro');
  if (paginas.some((p) => p.paginaDe && p.url === url)) archivos.push('[categoria].astro');
  return archivos;
};

/** `/audio/renta-de-audio/` → `renta-de-audio`; solo para las URLs de servicio. */
export const slugDe = (url: string) => url.split('/')[2] ?? '';

/** El servicio del registro con ese slug (`renta-de-audio`), o `undefined` si no es uno. */
export const servicioPorSlug = (slug: string): Pagina | undefined =>
  paginas.find((p) => p.categoria && slugDe(p.url) === slug);

// El build falla si una página se marca como construida sin su archivo (ver astro.config.mjs).
export const urlsConstruidas = paginas.filter((p) => p.construida).map((p) => p.url);

export const urlsPublicadas = paginas.filter(visible).map((p) => p.url);

/** Páginas en lanzamiento, construidas o no: las únicas a las que el contenido puede enlazar. */
export const urlsPlaneadas = paginas.filter((p) => p.estado === 'lanzamiento').map((p) => p.url);

/** Planeadas que todavía no existen: producción no compila si algún enlace apunta a ellas. */
export const urlsSinConstruir = paginas.filter((p) => p.estado === 'lanzamiento' && !p.construida).map((p) => p.url);

export interface CategoriaDelPie {
  /** Texto del enlace: "Audio", "Video" o "Tecnología" (la columna ya se llama "Servicios"). */
  titulo: string;
  /** A dónde lleva (`destinoDeCategoria`): la página de la categoría o su único servicio construido. */
  url: string;
}

/** Las categorías de servicios del pie, con su destino. Una categoría sin ningún servicio construido no se muestra. */
export const construirCategoriasDelPie = (): CategoriaDelPie[] =>
  categorias.flatMap((c) => {
    const url = destinoDeCategoria(c.id);
    return url ? [{ titulo: c.etiqueta, url }] : [];
  });
export const categoriasDeServicios: CategoriaDelPie[] = construirCategoriasDelPie();

export interface ItemMenu {
  titulo: string;
  url: string;
}

/**
 * Menú principal (barra negra en escritorio y panel de pantalla completa de Marby en móvil): Inicio · una entrada por
 * categoría (Audio, Video, Tecnología) · Proyectos · Blog · Nosotros. No hay página de contacto (decisión del dueño): el
 * teléfono y WhatsApp viven en el pie y en los botones flotantes.
 * Se genera desde el registro y desde las categorías: **una entrada solo aparece cuando su página está construida**
 * (nunca enlaza una página sin construir), y una categoría lleva a su página o, si solo tiene un servicio, a ese servicio.
 * Hoy: Inicio · Audio · Video · Tecnología · Nosotros. Proyectos y Blog entran cuando se construyan.
 */
export const construirMenu = (): ItemMenu[] => {
  const pagina = (url: string): ItemMenu[] => {
    const p = paginas.find((x) => x.url === url && visible(x));
    return p ? [{ titulo: p.titulo, url: p.url }] : [];
  };
  return [
    ...pagina('/'),
    ...categorias.flatMap((c) => {
      const url = destinoDeCategoria(c.id);
      return url ? [{ titulo: c.etiqueta, url }] : [];
    }),
    ...pagina('/proyectos/'),
    ...pagina('/blog/'),
    ...pagina('/nosotros/'),
  ];
};
export const menu: ItemMenu[] = construirMenu();

// El pie, como el menú, se genera desde el registro y **solo muestra páginas construidas**: Proyectos y Blog aparecen
// solos cuando existan. Nunca enlaza una página sin construir.
const paginasDelPie = (urls: string[]) =>
  urls.map((url) => paginas.find((p) => p.url === url && visible(p))).filter(Boolean) as Pagina[];

/** Grupo "Digital X" del pie: Proyectos, Blog y Nosotros, los que estén construidos. */
export const construirEnlacesEmpresa = (): Pagina[] => paginasDelPie(['/proyectos/', '/blog/', '/nosotros/']);
export const enlacesEmpresa = construirEnlacesEmpresa();

/** Línea inferior del pie, junto al ©: Condiciones de contratación y Política de privacidad. */
export const construirEnlacesLegales = (): Pagina[] =>
  paginasDelPie(['/condiciones-de-contratacion/', '/politica-de-privacidad/']);
export const enlacesLegales = construirEnlacesLegales();

/** Destino de "Ver servicios" (portada y 404): la sección de servicios del Inicio. */
export const urlVerServicios = '/#servicios';
