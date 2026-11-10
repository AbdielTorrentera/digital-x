/**
 * Proyectos del sitio (estructura-sitio sección 5): la sección solo se muestra cuando hay al menos 3 con foto y
 * permiso del cliente, y no más de 4. Mientras tanto no se dibuja nada, ni siquiera un [PENDIENTE].
 */
export const MINIMO_PROYECTOS = 3;
export const MAXIMO_PROYECTOS = 4;

interface Proyecto {
  titulo?: string;
  foto?: unknown;
  /** true solo si el cliente autorizó mostrar el proyecto. */
  permiso?: boolean;
  /** true mientras el proyecto es un EJEMPLO inventado para armar la página: nunca debe publicarse. */
  placeholder?: boolean;
  /** Nombres de los servicios usados, como están en lib/paginas.ts. */
  servicios?: string[];
}

/** Los que se pueden publicar: con foto y con permiso. */
export const proyectosPublicables = <T extends Proyecto>(items: T[]): T[] =>
  items.filter((proyecto) => proyecto.permiso === true && Boolean(proyecto.foto));

/** Los que se muestran en el Inicio, o una lista vacía si todavía no hay suficientes. */
export const proyectosDelInicio = <T extends Proyecto>(items: T[]): T[] => {
  const publicables = proyectosPublicables(items);
  return publicables.length >= MINIMO_PROYECTOS ? publicables.slice(0, MAXIMO_PROYECTOS) : [];
};

/** Los de la página Nosotros: con foto y, o con permiso del cliente, o todavía de ejemplo (se ven con la etiqueta EJEMPLO). */
export const proyectosDeNosotros = <T extends Proyecto>(items: T[]): T[] =>
  items.filter((proyecto) => Boolean(proyecto.foto) && (proyecto.permiso === true || proyecto.placeholder === true));

/**
 * Los de la página de un servicio: hasta `maximo`, con foto, que usaron ese servicio (su nombre exacto en `servicios`) y,
 * o con permiso del cliente, o todavía de ejemplo (se ven con la etiqueta EJEMPLO). Sin ninguno, la sección no se dibuja.
 */
export const proyectosDeServicio = <T extends Proyecto>(items: T[], nombre: string, maximo = 3): T[] =>
  items
    .filter(
      (proyecto) =>
        Boolean(proyecto.foto) &&
        (proyecto.permiso === true || proyecto.placeholder === true) &&
        (proyecto.servicios ?? []).includes(nombre),
    )
    .slice(0, maximo);

/** Títulos de los proyectos de ejemplo. En producción debe estar vacía (content/proyectos.ts lanza un error si no). */
export const titulosDeEjemplo = <T extends Proyecto>(items: T[]): string[] =>
  items.filter((proyecto) => proyecto.placeholder === true).map((proyecto) => proyecto.titulo ?? '(sin título)');
