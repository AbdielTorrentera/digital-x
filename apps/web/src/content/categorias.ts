/**
 * Las categorías de servicios (Audio, Video y Tecnología) como datos: la forma de un documento `categoria` de Sanity en
 * la fase 3 (estructura-sitio sección 7). El menú, el Inicio, el pie y las páginas de categoría (/audio/, /video/ y
 * /tecnologia/) se arman desde aquí y desde el registro de servicios (lib/paginas.ts); nada es específico de una
 * categoría en los componentes. Sin imágenes (la foto de la tarjeta del Inicio vive en inicio.ts), para poder probar estos
 * textos con node:test.
 * Regla (lib/paginas.ts): con UN solo servicio construido, la categoría no tiene página y sus enlaces van directo a ese
 * servicio; con dos o más, se genera /{slug}/.
 * Fuentes: docs/estructura-sitio-digitalx.md secciones 2 a 5 y docs/reglas-seo-digitalx.md sección 1. Solo hechos
 * confirmados: sin precios, cifras, marcas ni clientes inventados.
 */
import type { ImageMetadata } from 'astro';
import type { PreguntaFrecuente } from '../lib/jsonld.ts';
import type { Categoria } from '../lib/paginas.ts';
import type { Slug } from './servicios.ts';

/** Un cliente con el que se ha trabajado. Solo se muestra con `permiso: true` (nunca se inventan clientes). */
export interface Cliente {
  nombre: string;
  /** Logo opcional; con él, el `alt` es obligatorio. Sin logo se muestra el nombre. */
  logo?: { src: ImageMetadata; alt: string };
  /** true solo si el cliente autorizó mostrarse en el sitio. */
  permiso: boolean;
}

export interface CategoriaContenido {
  /** La clave que usa el registro de servicios (`categoria` en lib/paginas.ts). */
  id: Categoria;
  /** URL de su página: /{slug}/ (solo cuando la categoría tiene dos o más servicios construidos). */
  slug: string;
  /** Texto del menú y chip de cada servicio ("Video"). */
  etiqueta: string;
  /** Texto del pie y tipo de servicio del JSON-LD cuando el servicio no trae el suyo ("Servicios de video"). */
  titulo: string;
  /** Para quién es: la frase de la tarjeta del Inicio, antes de los nombres de sus servicios. */
  para: string;
  /** Nombres de servicios de la categoría que no tienen página, en minúscula, para frases como "a, b y c". */
  sinPagina?: string[];
  title: string;
  /** Meta description (máx. 155): servicio + zona + invitación a cotizar por WhatsApp. */
  meta: string;
  h1: string;
  /** Párrafo bajo el H1. */
  intro: string;
  /** Cierre de la página (foto oscura con WhatsApp y llamada). */
  cierre: { titulo: string; texto: string };
  /** Preguntas frecuentes de la categoría; sin ellas, la sección no se dibuja (ni el FAQPage). */
  faq: PreguntaFrecuente[];
  /** Con quiénes hemos trabajado; sin ninguno con permiso, la sección no se dibuja. */
  clientes: Cliente[];
}

/** Las 3 categorías, en el orden del menú y del Inicio. */
export const categorias: CategoriaContenido[] = [
  {
    id: 'audio',
    slug: 'audio',
    etiqueta: 'Audio',
    titulo: 'Servicios de audio',
    para: 'Para quienes organizan fiestas, conferencias, eventos culturales y cultos, con personal técnico de principio a fin.',
    // Servicio oficial sin página propia: se nombra en los textos corridos (Inicio y condiciones) pero no se enlaza.
    sinPagina: ['sonorización'],
    title: 'Servicios de audio en Puebla y Atlixco | Digital X',
    meta: 'Renta de audio y sonido, y sonorización, para eventos en Puebla y Atlixco, con personal técnico capacitado. Cotiza por WhatsApp.',
    h1: 'Servicios de audio para eventos en Puebla',
    intro:
      'Que tu evento se escuche claro: rentamos audio y sonido, y hacemos la sonorización, con personal técnico capacitado de principio a fin en Puebla, Atlixco, Izúcar de Matamoros y alrededores. Cuéntanos tu evento por WhatsApp y te decimos qué equipo necesitas.',
    cierre: {
      titulo: 'Que tu evento suene bien',
      texto: 'Escríbenos por WhatsApp o llámanos y te decimos qué audio necesita tu evento.',
    },
    faq: [],
    clientes: [],
  },
  {
    id: 'video',
    slug: 'video',
    etiqueta: 'Video',
    titulo: 'Servicios de video',
    para: 'Para que tu evento se vea y se transmita, y para mostrar tu negocio o institución.',
    title: 'Servicios de video en Puebla y Atlixco | Digital X',
    meta: 'Circuito cerrado para eventos, producción de videos, streaming, video con drone y recorridos 360 en Puebla y Atlixco. Cotiza por WhatsApp.',
    h1: 'Servicios de video para eventos y negocios en Puebla',
    intro:
      'Hacemos el video de tu evento y de tu negocio en Puebla, Atlixco, Izúcar de Matamoros y alrededores: cámaras en vivo en pantallas para que todo tu público vea el escenario, transmisión en vivo, producción de videos, tomas con drone y recorridos virtuales 360. Elige el servicio que necesitas o cuéntanos tu evento por WhatsApp y te decimos cuál te conviene.',
    cierre: {
      titulo: 'Cuéntanos tu evento',
      texto: 'Escríbenos por WhatsApp o llámanos y te decimos qué servicio de video te conviene.',
    },
    faq: [
      {
        pregunta: '¿Qué servicio de video me conviene para mi evento?',
        respuesta:
          'Si quieres que todo tu público vea el escenario en el lugar, el circuito cerrado para eventos; si quieres quedarte con el video, la producción de videos para eventos; y si también quieres que lo vean en línea, la transmisión en vivo. Cuéntanos tu evento por WhatsApp y te decimos cuál te conviene.',
      },
      {
        pregunta: '¿Puedo combinar varios servicios de video en el mismo evento?',
        respuesta:
          'Sí, siempre que los incluyamos en tu cotización. El circuito cerrado para eventos, la transmisión en vivo, la producción de videos y las tomas con drone se pueden sumar en el mismo evento. Dinos qué quieres combinar y lo cotizamos.',
      },
      {
        pregunta: '¿Qué servicio de video sirve para mostrar mi negocio o mi lugar?',
        respuesta:
          'La producción de videos incluye videos institucionales, corporativos y promocionales. El video con drone muestra tu lugar desde el aire y el recorrido virtual 360, por dentro; también se pueden combinar.',
      },
      {
        pregunta: '¿Puedo transmitir mi evento en vivo y quedarme también con el video?',
        respuesta:
          'Sí. Si la necesitas, la grabación de la transmisión se agrega con un costo extra; y si quieres un video editado, puedes sumar la producción de videos para eventos.',
      },
    ],
    clientes: [],
  },
  {
    id: 'tecnologia',
    slug: 'tecnologia',
    etiqueta: 'Tecnología',
    titulo: 'Servicios de tecnología',
    para: 'Para negocios e instituciones que necesitan presencia y herramientas en línea.',
    title: 'Servicios de tecnología en Puebla y Atlixco | Digital X',
    meta: 'Páginas web, tienda en línea, aplicaciones móviles y desarrollo de software para negocios en Puebla y Atlixco. Cotiza por WhatsApp.',
    h1: 'Servicios de tecnología para negocios en Puebla',
    intro:
      'Desarrollamos tecnología para negocios en Puebla, Atlixco, Izúcar de Matamoros y alrededores: páginas web, tiendas en línea, aplicaciones móviles y software para los procesos de tu negocio. Cuéntanos qué necesita tu negocio por WhatsApp y te decimos por dónde empezar.',
    cierre: {
      titulo: 'Cuéntanos qué necesita tu negocio',
      texto: 'Escríbenos por WhatsApp o llámanos y te decimos por dónde empezar.',
    },
    faq: [
      {
        pregunta: '¿Necesito una página web, una tienda en línea, una aplicación móvil o software?',
        respuesta:
          'Si quieres presentar tu negocio, una página web; si quieres que tus clientes elijan y paguen sus productos, una tienda en línea; si necesitas algo en el celular, una aplicación móvil; y si lo que quieres es llevar mejor los procesos de tu negocio, software a la medida. Cuéntanos tu caso y te orientamos.',
      },
      {
        pregunta: '¿Puedo conectar mi sistema o mi aplicación con otros sistemas o con mi página web?',
        respuesta:
          'Sí. Un sistema o una aplicación se pueden conectar con otros sistemas o con tu página web; esa conexión se cotiza como una función más.',
      },
      {
        pregunta: 'Si mi negocio apenas empieza, ¿por dónde comienzo?',
        respuesta:
          'Cuéntanos qué hace tu negocio y qué quieres lograr, y te decimos por dónde empezar. Una aplicación puede arrancar con una versión sencilla y crecer después, siempre que se construya bien desde el inicio, con las bases para crecer.',
      },
    ],
    clientes: [],
  },
];

/**
 * "¿Qué servicios necesito para mi evento?": cada escenario y los servicios que le convienen. Lista para activarse: hoy
 * ninguna página la dibuja (decisión del dueño; la tenía el catálogo, que ya no existe). Los enlaces van a las páginas de
 * servicio; un servicio sin página se muestra como texto.
 */
export const guia = {
  etiqueta: 'Guía para elegir',
  titulo: '¿Qué servicios necesito para mi evento?',
  items: [
    {
      escenario: 'Conferencia o evento corporativo',
      slugs: ['renta-de-audio', 'circuito-cerrado-para-eventos', 'video-para-eventos'],
    },
    { escenario: 'Evento con mucho público', slugs: ['renta-de-audio', 'circuito-cerrado-para-eventos'] },
    { escenario: 'Evento que quieres compartir en línea', slugs: ['streaming-para-eventos', 'renta-de-audio'] },
    { escenario: 'Dar a conocer un lugar o negocio', slugs: ['video-con-drone', 'recorridos-virtuales-360'] },
    { escenario: 'Presencia en internet', slugs: ['paginas-web', 'tienda-en-linea'] },
  ] satisfies { escenario: string; slugs: Slug[] }[],
};
