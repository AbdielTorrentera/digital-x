/**
 * Contenido del Inicio. Textos locales, mientras no estén en Sanity.
 * Fuentes: docs/estructura-sitio-digitalx.md sección 5 (qué lleva el Inicio) y docs/reglas-seo-digitalx.md
 * sección 1 (title, meta y H1). Solo hechos confirmados; lo que falta va como [PENDIENTE: ...].
 */
import type { ImageMetadata } from 'astro';
import { mensajesWhatsApp, waUrl, zonas } from '../lib/negocio';
import { urlVerServicios, type Categoria as IdCategoria } from '../lib/paginas';
import { lista } from '../lib/servicios';
import { proyectos as proyectosDelSitio } from './proyectos';
import type { PreguntaFrecuente } from '../lib/jsonld';

// ⚠ FOTOS TEMPORALES (src/assets/temporales/, ver su README). Para poner una real: cambiar el import y el alt.
// El build de producción falla mientras alguna página use una temporal.
import fotoPortada from '../assets/temporales/temporal-salon-escenario-pantalla-bocinas.jpg';
import fotoAudio from '../assets/temporales/temporal-bocinas-colgadas-techo.jpg';
import fotoVideo from '../assets/temporales/temporal-camara-tripode-transmision.jpg';
import fotoTecnologia from '../assets/temporales/temporal-laptop-escritorio-software.jpg';
import fotoPorQue from '../assets/temporales/temporal-consola-mezcla-manos.jpg';

export interface Foto {
  src: ImageMetadata;
  alt: string;
}

/** Una tarjeta de la sección de servicios: una categoría (Audio, Video o Tecnología) que enlaza a su sección del catálogo. */
export interface Categoria {
  contador: string;
  titulo: 'Audio' | 'Video' | 'Tecnología';
  /** Sus servicios (nombres desde el registro de páginas) van detrás de `para`, en la misma frase. */
  categoria: IdCategoria;
  /** Para quién es. */
  para: string;
  /** Sección del catálogo (/servicios/#audio, #video o #tecnologia). */
  url: string;
  foto: Foto;
}

const whatsappGeneral = waUrl(mensajesWhatsApp.general);

export const portada = {
  // H1, title y meta: exactos de reglas-seo sección 1.
  title: 'Audio, video y tecnología en Puebla y Atlixco | Digital X',
  descripcion:
    'Renta de audio, circuito cerrado, streaming y desarrollo web en Puebla, Atlixco e Izúcar de Matamoros. Cotiza con Digital X.',
  h1: 'Audio, video y tecnología para tus eventos y tu negocio en Puebla',
  // Debajo del H1 van las ciudades (reglas-seo sección 1): Puebla en el H1 y las demás en esta frase. Habla de todos los
  // servicios: audio y video para eventos; página web, app o software para negocios.
  texto:
    'Un solo proveedor en Puebla, Atlixco e Izúcar de Matamoros para el audio y el video de tu evento, y para la página web, la app o el software de tu negocio.',
  // Baja a la sección de servicios (/#servicios) y, cuando exista, a /servicios/.
  boton: { etiqueta: 'Ver servicios', href: urlVerServicios },
  // [PENDIENTE: video de portada. Sin clip, la foto sirve igual en móvil y en escritorio.]
  foto: {
    src: fotoPortada,
    alt: 'Salón para eventos con escenario, pantalla grande, bocinas y luces, y mesas preparadas',
  } satisfies Foto,
};

// Tres tarjetas, una por categoría (Audio, Video y Tecnología), como la sección Services de Marby: cada tarjeta entera
// es un enlace a su sección del catálogo (/servicios/#audio). El texto dice para quién es y nombra los servicios de la
// categoría (los 10 oficiales, cada uno una sola vez): un nombre es enlace a su página solo si ya está construida.
// [PENDIENTE: el dueño debe confirmar las frases de las tarjetas.] Sin cifras, marcas ni capacidades.
export const servicios = {
  etiqueta: 'Servicios',
  titulo: 'Servicios de audio, video y tecnología en Puebla',
  /** Etiqueta pequeña de cada tarjeta. */
  etiquetaTarjeta: 'Servicios',
  items: [
    {
      contador: '/1',
      titulo: 'Audio',
      categoria: 'audio',
      para: 'Para quienes organizan fiestas, conferencias, eventos culturales y cultos, con personal técnico de principio a fin.',
      url: '/servicios/#audio',
      foto: {
        src: fotoAudio,
        alt: 'Bocinas de sonido profesional colgadas del techo de un recinto, en blanco y negro',
      },
    },
    {
      contador: '/2',
      titulo: 'Video',
      categoria: 'video',
      para: 'Para que tu evento se vea y se transmita, y para mostrar tu negocio o institución.',
      url: '/servicios/#video',
      foto: {
        src: fotoVideo,
        alt: 'Cámara de video sobre un trípode grabando una sesión en un salón',
      },
    },
    {
      contador: '/3',
      titulo: 'Tecnología',
      categoria: 'tecnologia',
      para: 'Para negocios e instituciones que necesitan presencia y herramientas en línea.',
      url: '/servicios/#tecnologia',
      foto: {
        src: fotoTecnologia,
        alt: 'Laptop abierta sobre un escritorio de madera con código en la pantalla',
      },
    },
  ] satisfies Categoria[],
};

export const proyectos = {
  etiqueta: 'Proyectos',
  titulo: 'Proyectos de Digital X',
  // La sección solo se dibuja con 3 o más proyectos con foto y permiso (lib/proyectos.ts). El arreglo es el mismo que usa
  // Nosotros (content/proyectos.ts); hoy solo hay ejemplos, sin permiso, así que el Inicio no los muestra.
  // [PENDIENTE: 3 o 4 proyectos reales, con foto, nombre del lugar y permiso del cliente.]
  items: proyectosDelSitio,
};

// Solo ventajas permitidas (estructura-sitio sección 5). Sin topes de personas ni datos del equipo.
export const porQue = {
  etiqueta: 'Por qué Digital X',
  titulo: 'Por qué contratar a Digital X',
  foto: {
    src: fotoPorQue,
    alt: 'Manos sobre los controles de una consola de mezcla de audio',
  } satisfies Foto,
  items: [
    {
      titulo: 'Personal técnico capacitado',
      texto: 'Personal técnico capacitado atiende tu evento o proyecto de principio a fin.',
    },
    { titulo: 'Un solo proveedor', texto: 'Audio, video y tecnología con un solo equipo de trabajo.' },
    {
      titulo: 'Equipo según lo que necesitas',
      texto: 'Elegimos el equipo y la solución según tu evento o proyecto.',
    },
    { titulo: 'Cotización a la medida', texto: 'Cada cotización se arma según lo que necesitas.' },
  ],
};

// Una sola lista de lugares, sin condiciones de traslado ni cargos: los dos grupos de zonas son dato interno.
const textoCobertura = `Trabajamos en ${zonas.texto}. Si tu evento o proyecto es en otro lugar, escríbenos y lo vemos.`;

export const cobertura = {
  etiqueta: 'Cobertura',
  titulo: 'Dónde trabajamos',
  texto: textoCobertura,
};

// Preguntas frecuentes generales (de todos los servicios). La primera sale del sitio anterior, corregida.
// Quedan fuera: hora extra (15 % y su vigencia por confirmar) y contrato (condiciones por confirmar).
// [PENDIENTE: preguntas frecuentes nuevas.]
export const faq = {
  etiqueta: 'Preguntas frecuentes',
  titulo: 'Preguntas frecuentes',
  texto: 'Lo que más nos preguntan al cotizar.',
  items: [
    {
      pregunta: '¿Cómo puedo cotizar un servicio?',
      respuesta:
        'Escríbenos por WhatsApp o llámanos y te enviamos una cotización a la medida de tu evento o proyecto. Te ayudamos a encontrar la opción que se ajuste a lo que necesitas.',
    },
    {
      pregunta: '¿Qué servicios ofrecen?',
      respuesta: `En audio, ${lista.audio}. En video, ${lista.video}. En tecnología, ${lista.tecnologia}.`,
    },
    {
      pregunta: '¿Dónde ofrecen sus servicios?',
      respuesta: textoCobertura,
    },
    {
      pregunta: '¿Qué datos necesitan para cotizar?',
      respuesta:
        'La fecha, el lugar, el tipo de evento o proyecto, si es en interior o exterior y qué servicio necesitas. Con eso preparamos una cotización adecuada.',
    },
    {
      pregunta: '¿Cómo se aparta la fecha?',
      respuesta:
        'Una vez que aceptas la cotización, se aparta la fecha con un anticipo y se liquida antes del evento o de la entrega.',
    },
    {
      pregunta: '¿Cuánto cuesta un servicio?',
      respuesta:
        'Cada servicio se cotiza a la medida. El precio depende del tipo de evento o proyecto, el lugar, la duración y el equipo que se necesite. Escríbenos por WhatsApp con esos datos y te respondemos con una propuesta.',
    },
  ] satisfies PreguntaFrecuente[],
};

export const cierre = {
  titulo: 'Cotiza tu evento o proyecto',
  texto: 'Cuéntanos qué necesitas por WhatsApp y te respondemos con una cotización.',
  boton: { etiqueta: 'Cotizar por WhatsApp', href: whatsappGeneral },
};
