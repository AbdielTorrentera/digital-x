/**
 * Contenido del Inicio. Textos locales, mientras no estén en Sanity.
 * Fuentes: docs/estructura-sitio-digitalx.md sección 5 (qué lleva el Inicio) y docs/reglas-seo-digitalx.md
 * sección 1 (title, meta y H1). Solo hechos confirmados; lo que falta va como [PENDIENTE: ...].
 */
import type { ImageMetadata } from 'astro';
import { mensajesWhatsApp, waUrl, zonas } from '../lib/negocio';
import { urlVerServicios } from '../lib/paginas';
import { lista } from '../lib/servicios';
import { proyectos as proyectosDelSitio } from './proyectos';
import type { PreguntaFrecuente } from '../lib/jsonld';

// ⚠ FOTOS TEMPORALES (src/assets/temporales/, ver su README). Para poner una real: cambiar el import y el alt.
// El build de producción falla mientras alguna página use una temporal.
import fotoPortada from '../assets/temporales/temporal-salon-escenario-pantalla-bocinas.jpg';
import fotoQueHacemos from '../assets/temporales/temporal-conferencia-escenario-pantalla.jpg';
import fotoPorQue from '../assets/temporales/temporal-consola-mezcla-manos.jpg';

export interface Foto {
  src: ImageMetadata;
  alt: string;
}

const whatsappGeneral = waUrl(mensajesWhatsApp.general);

export const portada = {
  // H1, title y meta: exactos de reglas-seo sección 1.
  title: 'Audio, video y tecnología en Puebla y Atlixco | Digital X',
  descripcion:
    'Renta de audio, circuito cerrado para eventos, streaming y desarrollo web en Puebla, Atlixco e Izúcar de Matamoros. Cotiza con Digital X.',
  h1: 'Audio, video y tecnología para tus eventos y tu negocio en Puebla',
  // Junto al H1 va el logo blanco, grande (decorativo, lo pinta la portada). Sin lema, sin párrafo y sin botón: la propuesta y
  // el único botón "Ver servicios" viven en la sección "Qué hacemos" (queHacemos).
  // [PENDIENTE: video de portada. Sin clip, la foto sirve igual en móvil y en escritorio.]
  foto: {
    src: fotoPortada,
    alt: 'Salón para eventos con escenario, pantalla grande, bocinas y luces, y mesas preparadas',
  } satisfies Foto,
};

// "Qué hacemos": el "About us" de la plantilla Marby (HomeAbout, commit 6a6f883d), SIN las tarjetas de cifras (no hay datos
// y no se inventan números). El texto, aprobado por el dueño, no se repite en ninguna otra parte del sitio. El botón baja a
// las tarjetas de servicios (/#servicios) y es el único "Ver servicios" del Inicio. Foto temporal.
export const queHacemos = {
  etiqueta: 'Digital X',
  titulo: 'Qué hacemos',
  texto:
    'Un solo proveedor para tu evento y tu negocio: nos encargamos de que tu evento se vea y se escuche bien, y de darle a tu negocio las herramientas digitales que necesita, en Puebla, Atlixco, Izúcar de Matamoros y alrededores.',
  boton: { etiqueta: 'Ver servicios', href: urlVerServicios },
  foto: {
    src: fotoQueHacemos,
    alt: 'Presentador con micrófono en un escenario con pantalla grande y luces',
  } satisfies Foto,
};

// Tarjetas de servicios del Inicio, una por categoría (Audio, Video y Tecnología), como la sección Services de Marby: cada
// tarjeta entera es un enlace al destino de su categoría (su página de categoría o, si solo tiene un servicio construido,
// ese servicio; ver `destinoDeCategoria`). El texto sale de content/categorias.ts: para quién es y los nombres de sus
// servicios (los 10 oficiales, cada uno una sola vez): un nombre es enlace a su página solo si ya está construida.
// Las fotos viven en categorias-fotos.ts. [PENDIENTE: el dueño debe confirmar las frases de las tarjetas.] Sin cifras,
// marcas ni capacidades.
export const servicios = {
  etiqueta: 'Servicios',
  titulo: 'Servicios de audio, video y tecnología en Puebla',
  /** Etiqueta pequeña de cada tarjeta. */
  etiquetaTarjeta: 'Servicios',
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
