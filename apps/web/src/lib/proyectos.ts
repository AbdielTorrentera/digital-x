/**
 * Proyectos del sitio (estructura-sitio sección 5): la sección del Inicio se muestra cuando hay al menos 3 con foto, y
 * no más de 4. Mientras tanto no se dibuja nada, ni siquiera un [PENDIENTE]. Todo lo publicado en Sanity se muestra.
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
