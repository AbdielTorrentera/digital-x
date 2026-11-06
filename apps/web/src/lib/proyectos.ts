/**
 * Proyectos del Inicio (estructura-sitio sección 5): la sección solo se muestra cuando hay al menos 3 con foto y
 * permiso del cliente, y no más de 4. Mientras tanto no se dibuja nada, ni siquiera un [PENDIENTE].
 */
export const MINIMO_PROYECTOS = 3;
export const MAXIMO_PROYECTOS = 4;

interface Proyecto {
  foto?: unknown;
  /** true solo si el cliente autorizó mostrar el proyecto. */
  permiso?: boolean;
}

/** Los que se pueden publicar: con foto y con permiso. */
export const proyectosPublicables = <T extends Proyecto>(items: T[]): T[] =>
  items.filter((proyecto) => proyecto.permiso === true && Boolean(proyecto.foto));

/** Los que se muestran en el Inicio, o una lista vacía si todavía no hay suficientes. */
export const proyectosDelInicio = <T extends Proyecto>(items: T[]): T[] => {
  const publicables = proyectosPublicables(items);
  return publicables.length >= MINIMO_PROYECTOS ? publicables.slice(0, MAXIMO_PROYECTOS) : [];
};
