/**
 * Proyectos del sitio (estructura-sitio sección 5): la sección del Inicio se muestra cuando hay al menos 3 con foto, y
 * no más de 4. Mientras tanto no se dibuja nada, ni siquiera un [PENDIENTE]. Todo lo publicado en Sanity se muestra.
 * También, el SEO automático de cada proyecto (título y descripción cuando el dueño no los escribe) y su fecha legible.
 * Funciones puras, sin imports.
 */
export const MINIMO_PROYECTOS = 3;
export const MAXIMO_PROYECTOS = 4;

interface Proyecto {
  titulo?: string;
  foto?: unknown;
  /** Nombres de los servicios usados, como están en lib/paginas.ts. */
  servicios?: string[];
}

/** Los que se pueden mostrar: los que tienen foto. */
export const proyectosPublicables = <T extends Proyecto>(items: T[]): T[] =>
  items.filter((proyecto) => Boolean(proyecto.foto));

/** Los que se muestran en el Inicio, o una lista vacía si todavía no hay suficientes. */
export const proyectosDelInicio = <T extends Proyecto>(items: T[]): T[] => {
  const publicables = proyectosPublicables(items);
  return publicables.length >= MINIMO_PROYECTOS ? publicables.slice(0, MAXIMO_PROYECTOS) : [];
};

/** Los de la página Nosotros: los que tienen foto. */
export const proyectosDeNosotros = <T extends Proyecto>(items: T[]): T[] => proyectosPublicables(items);

/** Los de la página de un servicio: hasta `maximo`, con foto, que usaron ese servicio (su nombre exacto en `servicios`). */
export const proyectosDeServicio = <T extends Proyecto>(items: T[], nombre: string, maximo = 3): T[] =>
  proyectosPublicables(items)
    .filter((proyecto) => (proyecto.servicios ?? []).includes(nombre))
    .slice(0, maximo);

/** Los de la página de una categoría: hasta `maximo`, con foto, que usaron algún servicio de esa categoría (nombres exactos). */
export const proyectosDeCategoria = <T extends Proyecto>(items: T[], nombres: string[], maximo = 4): T[] =>
  proyectosPublicables(items)
    .filter((proyecto) => (proyecto.servicios ?? []).some((nombre) => nombres.includes(nombre)))
    .slice(0, maximo);

const sinAcentos = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Título para Google de un proyecto: el que escribió el dueño y, si lo dejó vacío, «{título} en {municipio} | Digital X»
 * (sin repetir el municipio si el título ya lo nombra; se compara sin acentos ni mayúsculas). No agrega ningún dato.
 */
export const tituloSeoDeProyecto = (proyecto: { titulo: string; municipio: string; seoTitle?: string }): string => {
  const escrito = proyecto.seoTitle?.trim();
  if (escrito) return escrito;
  const yaLoNombra = sinAcentos(proyecto.titulo).includes(sinAcentos(proyecto.municipio.trim()));
  return `${proyecto.titulo}${yaLoNombra ? '' : ` en ${proyecto.municipio}`} | Digital X`;
};

/** Descripción para Google de un proyecto: la que escribió el dueño o, si la dejó vacía, su resumen tal cual. */
export const metaSeoDeProyecto = (proyecto: { resumen: string; seoMeta?: string }): string =>
  proyecto.seoMeta?.trim() || proyecto.resumen;

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** «2026-03-14» → «marzo de 2026». Se lee la cadena, sin `Date`, para que la zona horaria no mueva el mes. */
export const fechaLegible = (fecha: string): string => {
  const [anio, mes] = fecha.split('-');
  const nombre = MESES[Number(mes) - 1];
  return nombre ? `${nombre} de ${anio}` : fecha;
};
