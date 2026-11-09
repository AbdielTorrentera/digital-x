import { paginas, visible, type Categoria } from './paginas.ts';

/**
 * Servicios oficiales de cada categoría (los del Perfil de Negocio de Google), en minúscula para poder usarlos a mitad
 * de frase. Fuente única: la leen las tarjetas y las preguntas frecuentes del Inicio y las condiciones de contratación.
 * La sonorización va como texto, sin página propia (la cubre la de renta de audio y sonido).
 */
export const lista = {
  audio: 'renta de audio y sonido, y sonorización',
  video:
    'circuito cerrado para eventos, producción de videos para eventos, transmisión en vivo, video con dron y recorridos virtuales 360',
  tecnologia: 'páginas web, desarrollo de apps móviles, desarrollo de software y tienda en línea',
};

export interface ServicioDeCategoria {
  titulo: string;
  url: string;
  /** Solo un servicio con página construida se enlaza; si no, su nombre se muestra como texto. */
  construida: boolean;
}

/** Servicios de una categoría, desde el registro de páginas (nombre y estado), en el orden de estructura §3. */
export const serviciosDe = (categoria: Categoria): ServicioDeCategoria[] =>
  paginas
    .filter((p) => p.categoria === categoria && !p.hub)
    .map((p) => ({ titulo: p.titulo, url: p.url, construida: visible(p) }));

/** Nombres de los servicios de una categoría para mostrarlos como texto; la sonorización no tiene página propia. */
export const nombresDeServicios = (categoria: Categoria): string[] => [
  ...serviciosDe(categoria).map((s) => s.titulo),
  ...(categoria === 'audio' ? ['Sonorización'] : []),
];
