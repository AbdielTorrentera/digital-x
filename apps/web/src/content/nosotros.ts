/**
 * Contenido de /nosotros/. Textos locales, mientras no estén en Sanity. Fuente: pedido del dueño; metadatos de
 * docs/reglas-seo-digitalx.md sección 1. Sin datos del dueño, tamaño del equipo, cifras, precios ni reseñas.
 */
import type { Foto } from './inicio';
import { mensajesWhatsApp, negocio, telUrl, waUrl } from '../lib/negocio';
import type { PreguntaFrecuente } from '../lib/jsonld';

// ⚠ FOTOS TEMPORALES (src/assets/temporales/, ver su README). El build de producción falla mientras alguna página las use.
import fotoPortada from '../assets/temporales/temporal-rack-audio-evento.jpg';
import fotoDistingue from '../assets/temporales/temporal-camara-tripode-transmision.jpg';
import fotoManifiesto from '../assets/temporales/temporal-consola-mezcla-manos.jpg';
import fotoProyectos from '../assets/temporales/temporal-bocinas-colgadas-techo.jpg';
import fotoCierre from '../assets/temporales/temporal-salon-escenario-pantalla-bocinas.jpg';

export const pagina = {
  title: 'Nosotros: audio, video y tecnología en Puebla | Digital X',
  descripcion:
    'Conoce Digital X: audio, video y tecnología para eventos y negocios en Puebla, Atlixco e Izúcar de Matamoros. Un solo proveedor, cotización a la medida.',
  etiqueta: 'Nosotros',
  h1: 'Quiénes somos: Digital X, audio, video y tecnología en Puebla',
  foto: {
    src: fotoPortada,
    alt: 'Equipo de audio profesional en cajas de rack, con cables y luces de colores de un evento',
  } satisfies Foto,
};

/** Prólogo y línea de tiempo: solo estos 3 hitos, desde este arreglo. */
export const historia = {
  etiqueta: 'Prólogo',
  texto:
    'Digital X nació en 2018 como un proyecto para ayudar a que los eventos se escuchen bien y se vean mejor. Hoy reúne audio, video y tecnología con un solo proveedor, para eventos y negocios en Puebla, Atlixco e Izúcar de Matamoros.',
  hitos: [
    { anio: '2018', texto: 'Nace la idea de Digital X.' },
    { anio: '2021', texto: 'Se formaliza el negocio.' },
    { anio: 'Hoy', texto: 'Audio, video y tecnología con un solo proveedor.' },
  ],
};

/** Qué nos distingue: lista numerada. */
export const distingue = {
  titulo: 'Qué nos distingue',
  foto: {
    src: fotoDistingue,
    alt: 'Cámara de video sobre un trípode grabando una sesión en un salón',
  } satisfies Foto,
  items: [
    { titulo: 'Calidad', texto: 'Equipo y cuidado profesional en cada servicio.' },
    {
      titulo: 'Optimización',
      texto: 'Armamos el servicio con lo que tu evento necesita, sin desperdiciar equipo ni tiempo.',
    },
    { titulo: 'Rapidez', texto: 'Atendemos y cotizamos con agilidad.' },
    {
      titulo: 'Innovación',
      texto: 'Incorporamos tecnología como dron, transmisión en vivo y recorridos 360.',
    },
    { titulo: 'Versatilidad', texto: 'Audio, video y tecnología con un solo proveedor.' },
  ],
};

/** Lo que nos importa, en estilo manifiesto. */
export const manifiesto = {
  titulo: 'Lo que nos importa',
  foto: fotoManifiesto,
  items: [
    { titulo: 'Cada evento es distinto', texto: 'Por eso cada cotización se arma a la medida.' },
    { titulo: 'Tu evento no se queda solo', texto: 'Un técnico está pendiente del audio durante todo el evento.' },
    {
      titulo: 'Claridad antes de contratar',
      texto: 'Te decimos qué incluye y qué no, para que no haya sorpresas.',
    },
  ],
};

/** Sección de proyectos (en el lugar de la sección de equipo de Marby). Los proyectos salen de content/proyectos.ts. */
export const proyectosPagina = {
  etiqueta: 'Proyectos',
  titulo: 'Proyectos de Digital X',
  foto: fotoProyectos,
  boton: { etiqueta: 'Ver todos los proyectos', href: '/proyectos/' },
};

export const faq = {
  etiqueta: 'Preguntas frecuentes',
  titulo: 'Preguntas frecuentes',
  texto: 'Lo que más nos preguntan sobre Digital X.',
  items: [
    {
      pregunta: '¿Desde cuándo existe Digital X?',
      respuesta: 'La idea nació en 2018 y el negocio se formalizó en 2021.',
    },
    {
      pregunta: '¿Con quién trabajan?',
      respuesta:
        'Con empresas, organizadores de eventos, conferencistas, grupos musicales y personas que necesitan audio, video o tecnología.',
    },
    {
      pregunta: '¿Tienen oficina?',
      respuesta:
        'No tenemos oficina abierta al público. Atendemos por WhatsApp y llamada, y trabajamos en el lugar de tu evento o proyecto.',
    },
  ] satisfies PreguntaFrecuente[],
};

/** Cierre: el bloque de contacto de Marby (foto oscura con velo), sin formulario. Enlaces y número salen de negocio.ts. */
export const cierre = {
  foto: fotoCierre,
  titulo: '¿Listo para cotizar?',
  texto: 'Escríbenos por WhatsApp o llámanos. Cada cotización se arma a la medida de tu evento o proyecto.',
  whatsapp: { etiqueta: 'Cotizar por WhatsApp', href: waUrl(mensajesWhatsApp.general) },
  llamar: { etiqueta: 'Llamar', href: telUrl, numero: negocio.telefono.pantalla },
};
