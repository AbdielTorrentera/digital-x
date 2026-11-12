/**
 * Fotos de las categorías (la tarjeta del Inicio y la portada de cada página de categoría). Aparte de categorias.ts
 * porque importan imágenes y los textos se prueban con node:test (igual que servicios-fotos.ts).
 *
 * ⚠ FOTOS TEMPORALES (src/assets/temporales/, ver su README). Para poner una real: cambiar el import y el alt. El build de
 * producción falla mientras alguna página use una temporal.
 */
import type { Foto } from './inicio';
import type { Categoria } from '../lib/paginas';

import fotoAudio from '../assets/temporales/temporal-bocinas-colgadas-techo.jpg';
import fotoVideo from '../assets/temporales/temporal-camara-tripode-transmision.jpg';
import fotoTecnologia from '../assets/temporales/temporal-laptop-escritorio-software.jpg';

export const fotosDeCategoria: Record<Categoria, Foto> = {
  audio: {
    src: fotoAudio,
    alt: 'Bocinas de sonido profesional colgadas del techo de un recinto, en blanco y negro',
  },
  video: {
    src: fotoVideo,
    alt: 'Cámara de video sobre un trípode grabando una sesión en un salón',
  },
  tecnologia: {
    src: fotoTecnologia,
    alt: 'Laptop abierta sobre un escritorio de madera con código en la pantalla',
  },
};
