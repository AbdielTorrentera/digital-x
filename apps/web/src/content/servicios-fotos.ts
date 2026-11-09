/**
 * Fotos de los servicios (el catálogo y la página de cada uno). Aparte de servicios.ts porque importan imágenes y
 * los textos se prueban con node:test.
 *
 * ⚠ FOTOS TEMPORALES (src/assets/temporales/, ver su README). Hay repetidas entre servicios porque son provisionales.
 * Para poner una real: cambiar el import y el alt. El build de producción falla mientras alguna página use una temporal.
 */
import type { Foto } from './inicio';
import type { Slug } from './servicios';

import fotoRack from '../assets/temporales/temporal-rack-audio-evento.jpg';
import fotoConferencia from '../assets/temporales/temporal-conferencia-escenario-pantalla.jpg';
import fotoCamara from '../assets/temporales/temporal-camara-tripode-transmision.jpg';
import fotoConsola from '../assets/temporales/temporal-consola-mezcla-manos.jpg';
import fotoDrone from '../assets/temporales/temporal-drone-campo.jpg';
import fotoSalon from '../assets/temporales/temporal-salon-escenario-pantalla-bocinas.jpg';
import fotoLaptop from '../assets/temporales/temporal-laptop-escritorio-software.jpg';

/** Una sección de la galería de un servicio (por ejemplo "Eventos" o "Equipo"), con sus fotos. */
export interface SeccionGaleria {
  titulo: string;
  fotos: Foto[];
}

export interface FotoDeServicio extends Foto {
  /** Fotos reales del servicio, por sección. Sin ellas, la galería ni el botón "Ver todas las fotos" se dibujan. */
  galeria?: SeccionGaleria[];
}

const laptop: Foto = {
  src: fotoLaptop,
  alt: 'Laptop abierta sobre un escritorio de madera con código en la pantalla',
};

export const fotos: Record<Slug, FotoDeServicio> = {
  'renta-de-audio': {
    src: fotoRack,
    alt: 'Equipo de audio profesional en cajas de rack, con cables y luces de colores de un evento',
  },
  'circuito-cerrado-para-eventos': {
    src: fotoConferencia,
    alt: 'Presentador con micrófono en un escenario con pantalla grande y luces',
  },
  'video-para-eventos': {
    src: fotoCamara,
    alt: 'Cámara de video sobre un trípode grabando una sesión en un salón',
  },
  'streaming-para-eventos': {
    src: fotoConsola,
    alt: 'Manos sobre los controles de una consola de mezcla de audio',
  },
  'video-con-drone': {
    src: fotoDrone,
    alt: 'Drone en vuelo sobre un campo con el cielo nublado',
  },
  'recorridos-virtuales-360': {
    src: fotoSalon,
    alt: 'Salón para eventos con escenario, pantalla grande, bocinas y luces, y mesas preparadas',
  },
  'paginas-web': laptop,
  'tienda-en-linea': laptop,
  'aplicaciones-moviles': laptop,
  'desarrollo-de-software': laptop,
};

/** Foto oscura del cierre de contacto (catálogo y páginas de servicio). Es decorativa: sin alt. */
export const fotoCierre = fotoSalon;

/** Portada del catálogo. */
export const fotoPortada: Foto = {
  src: fotoSalon,
  alt: 'Salón para eventos con escenario, pantalla grande, bocinas y luces, y mesas preparadas',
};
