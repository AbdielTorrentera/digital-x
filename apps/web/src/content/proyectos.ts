/**
 * Proyectos del sitio: UN solo arreglo para todas las páginas (Inicio y Nosotros; luego /proyectos/). Esta es la forma
 * que tendrá el esquema de Sanity en la fase 3; hasta entonces vive aquí, sin Sanity.
 * Los 3 proyectos de abajo son EJEMPLOS (`placeholder: true`): sin clientes, marcas, fechas ni cifras, con fotos
 * temporales. Se muestran con la etiqueta "EJEMPLO" y el build de producción falla mientras existan.
 * [PENDIENTE: reemplazarlos por proyectos reales, con foto y permiso del cliente.]
 */
import type { Foto } from './inicio';
import { esProduccion } from '../lib/entorno';
import { titulosDeEjemplo } from '../lib/proyectos';

// ⚠ FOTOS TEMPORALES (src/assets/temporales/, ver su README).
import fotoConferencia from '../assets/temporales/temporal-conferencia-escenario-pantalla.jpg';
import fotoDrone from '../assets/temporales/temporal-drone-campo.jpg';
import fotoSitioWeb from '../assets/temporales/temporal-laptop-escritorio-software.jpg';

export interface Proyecto {
  titulo: string;
  municipio: string;
  /** Nombres de los servicios usados, como etiquetas. */
  servicios: string[];
  foto: Foto;
  /** Texto corto. */
  texto: string;
  /** true solo si el cliente autorizó mostrar el proyecto. */
  permiso: boolean;
  /** true mientras sea un EJEMPLO inventado: se ve con la etiqueta EJEMPLO y no puede publicarse. */
  placeholder: boolean;
}

export const proyectos: Proyecto[] = [
  {
    titulo: 'Conferencia empresarial',
    municipio: 'Puebla',
    servicios: ['Audio', 'Circuito cerrado para eventos'],
    foto: {
      src: fotoConferencia,
      alt: 'Presentador con micrófono en un escenario con pantalla grande y luces',
    },
    texto: 'Audio y pantallas en vivo para una conferencia, con un técnico pendiente durante todo el evento.',
    permiso: false,
    placeholder: true,
  },
  {
    titulo: 'Transmisión multicámara con drone',
    municipio: 'Atlixco',
    servicios: ['Transmisión en vivo', 'Video con drone', 'Producción de video'],
    foto: { src: fotoDrone, alt: 'Drone en vuelo sobre un campo con el cielo nublado' },
    texto: 'Transmisión en vivo con varias cámaras y tomas aéreas para un evento al aire libre.',
    permiso: false,
    placeholder: true,
  },
  {
    titulo: 'Sitio web para un negocio local',
    municipio: 'Izúcar de Matamoros',
    servicios: ['Páginas web'],
    foto: {
      src: fotoSitioWeb,
      alt: 'Laptop abierta sobre un escritorio de madera con código en la pantalla',
    },
    texto: 'Diseño y desarrollo de un sitio web para presentar los servicios de un negocio local.',
    permiso: false,
    placeholder: true,
  },
];

// Protección de producción: con VERCEL_ENV=production el build falla en cuanto cualquier página importe estos datos
// (Inicio y Nosotros), aunque los ejemplos no se muestren. Los de ejemplo nunca deben publicarse.
const ejemplos = titulosDeEjemplo(proyectos);
if (esProduccion && ejemplos.length > 0) {
  throw new Error(
    `No se puede publicar en producción: hay proyectos de ejemplo (placeholder: true) en src/content/proyectos.ts. Reemplázalos por proyectos reales:\n${ejemplos.map((titulo) => `  - ${titulo}`).join('\n')}`,
  );
}
