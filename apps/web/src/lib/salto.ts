/**
 * Menú interno de secciones (NavInterna): a qué posición hay que desplazar la barra, horizontalmente, para que la
 * sección activa quede centrada y visible. Es solo el scroll de la barra (nunca el de la página). Sin desborde (cabe
 * completa) no hay nada que mover. La posición queda dentro de los límites de la barra.
 */
export interface MedidasDelSalto {
  /** Distancia del enlace al inicio del contenido de la barra (su `offsetLeft`). */
  izquierda: number;
  /** Ancho del enlace. */
  ancho: number;
  /** Ancho visible de la barra (su `clientWidth`). */
  barraAncho: number;
  /** Ancho total del contenido de la barra (su `scrollWidth`). */
  scrollAncho: number;
}

export const posicionParaCentrar = ({ izquierda, ancho, barraAncho, scrollAncho }: MedidasDelSalto): number => {
  const maximo = Math.max(scrollAncho - barraAncho, 0);
  const centrado = izquierda - (barraAncho - ancho) / 2;
  return Math.min(Math.max(centrado, 0), maximo);
};
