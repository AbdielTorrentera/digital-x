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

/** Prólogo y línea de tiempo: solo estos 3 hitos, cada uno con título y texto, desde este arreglo. */
export const historia = {
  etiqueta: 'Prólogo',
  texto:
    'Digital X nació en 2018 como un proyecto para ayudar a que los eventos se escuchen bien y se vean mejor. Hoy reúne audio, video y tecnología con un solo proveedor, para eventos y negocios en Puebla, Atlixco e Izúcar de Matamoros.',
  hitos: [
    {
      anio: '2018',
      titulo: 'Nace la idea',
      texto:
        'Surge la idea de ayudar a las personas a conectar con su público: que su mensaje se escuche claro y llegue a quien tiene que llegar.',
    },
    {
      anio: '2021',
      titulo: 'Se formaliza Digital X',
      texto:
        'Decidimos llevar el servicio a más personas y negocios con la misma necesidad: conectar con su gente y con sus clientes.',
    },
    {
      anio: 'Hoy',
      titulo: 'Un solo proveedor',
      texto:
        'Reunimos audio, video y tecnología para resolver tu evento o proyecto con un solo proveedor, de principio a fin.',
    },
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
    {
      titulo: 'Equipo profesional',
      texto:
        'Trabajamos con equipo profesional y cuidamos cada detalle: la instalación, el sonido y la imagen. Queremos que el resultado se note desde el primer momento.',
    },
    {
      titulo: 'Optimización',
      texto:
        'Antes de cotizar, entendemos qué necesita tu evento o proyecto. Así proponemos el equipo y el servicio justos, sin desperdiciar recursos ni tiempo, y sin que pagues por lo que no vas a usar.',
    },
    {
      titulo: 'Versatilidad',
      texto:
        'Puedes resolver el sonido de tu evento, su transmisión y la página web de tu negocio con nosotros, sin coordinar a varios proveedores.',
    },
  ],
};

/** Lo que nos importa, en estilo manifiesto. */
export const manifiesto = {
  titulo: 'Lo que nos importa',
  foto: fotoManifiesto,
  items: [
    { titulo: 'Calidad', texto: 'No importa qué tan grande o pequeño sea tu evento: la calidad no se negocia.' },
    {
      titulo: 'Atención',
      texto: 'Escuchamos lo que necesitas y te damos la solución que mejor se adapta a tu evento o proyecto.',
    },
    {
      titulo: 'Claridad',
      texto: 'Antes de contratar te decimos qué incluye y qué no, para que no haya sorpresas.',
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
      pregunta: '¿Con quién han trabajado?',
      respuesta:
        'Con empresas, organizadores de eventos, conferencistas, grupos musicales, iglesias e instituciones educativas, en Puebla y sus alrededores.',
    },
    {
      pregunta: '¿Pueden encargarse de audio, video y tecnología en un mismo proyecto?',
      respuesta: 'Sí. Puedes contratar uno solo de nuestros servicios o combinarlos, y lo coordinamos todo nosotros.',
    },
    {
      pregunta: '¿Alguien de Digital X está pendiente durante el evento o proyecto?',
      respuesta: 'Sí. Un técnico de Digital X está pendiente durante todo tu evento o proyecto.',
    },
    { pregunta: '¿Emiten factura?', respuesta: 'Sí, emitimos factura. Pídela al cotizar.' },
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
