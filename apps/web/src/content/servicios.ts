/**
 * Contenido de /servicios/ y de las 3 categorías (Audio, Video y Tecnología). Textos locales, mientras no estén en
 * Sanity. Sin imágenes: las fotos y su `alt` van en cada página, junto al import, para poder probar estos textos.
 * Fuentes: docs/estructura-sitio-digitalx.md sección 5, docs/reglas-seo-digitalx.md sección 1 (title, meta y H1) y
 * las preguntas del dueño. Solo hechos confirmados: sin precios, cifras, marcas, topes de personas ni datos del equipo.
 * El circuito cerrado se describe siempre como proyección en vivo y nunca como sistema de seguridad.
 */
import type { PreguntaFrecuente } from '../lib/jsonld.ts';
import { mensajesWhatsApp } from '../lib/negocio.ts';
import type { Categoria } from '../lib/paginas.ts';

/** Un enlace a otra página con su descripción ("También te puede servir"). */
export interface EnlaceRelacionado {
  titulo: string;
  texto: string;
  url: string;
}

export interface DatosCategoria {
  categoria: Categoria;
  url: string;
  /** Texto de la miga de pan y del tipo de servicio en los datos estructurados. */
  nombre: string;
  /** Contador de la plantilla (/1, /2 y /3), el mismo de las tarjetas del Inicio. */
  contador: string;
  title: string;
  descripcion: string;
  h1: string;
  /** Tres filas de la ficha junto a la foto principal. */
  ficha: { etiqueta: string; valor: string }[];
  queHacemos: { titulo: string; parrafos: string[] };
  servicios: {
    titulo: string;
    /** Una frase por servicio, en el orden de paginas.ts; el nombre sale del registro de páginas. */
    items: { url: string; frase: string }[];
  };
  tambien: { titulo: string; items: EnlaceRelacionado[] };
  cotizacion: { etiqueta: string; texto: string; mensaje: string };
  faq: { etiqueta: string; titulo: string; texto: string; items: PreguntaFrecuente[] };
}

const proyectos: EnlaceRelacionado = {
  titulo: 'Proyectos de Digital X',
  texto: 'Conoce nuestros trabajos',
  url: '/proyectos/',
};

export const hub = {
  title: 'Servicios de audio, video y tecnología en Puebla | Digital X',
  descripcion:
    'Servicios para tu evento o tu negocio: audio, video y tecnología en Puebla, Atlixco e Izúcar de Matamoros. Elige el tuyo y cotiza por WhatsApp.',
  h1: 'Elige tu servicio de audio, video o tecnología en Puebla',
  intro:
    'Trabajamos en Puebla, Atlixco, Izúcar de Matamoros y alrededores con tres áreas de servicio: audio para que tu evento se escuche, video para que se vea y se transmita, y tecnología para que tu negocio funcione en internet.',
  /** Una tarjeta por categoría, en el orden de las tarjetas del Inicio. */
  categorias: [
    {
      categoria: 'audio',
      url: '/servicios-de-audio/',
      contador: '/1',
      titulo: 'Servicios de audio',
      para: 'Que tu evento se escuche claro, con personal técnico capacitado de principio a fin.',
      boton: 'Ver servicios de audio',
    },
    {
      categoria: 'video',
      url: '/servicios-de-video/',
      contador: '/2',
      titulo: 'Servicios de video',
      para: 'Que tu evento se vea en pantallas, se transmita en vivo y quede en video, y que tu lugar se vea desde el aire o en 360.',
      boton: 'Ver servicios de video',
    },
    {
      categoria: 'tecnologia',
      url: '/servicios-de-tecnologia/',
      contador: '/3',
      titulo: 'Servicios de tecnología',
      para: 'Que encuentren tu negocio en internet, que vendas en línea y que tus procesos funcionen con software propio.',
      boton: 'Ver servicios de tecnología',
    },
  ] satisfies {
    categoria: Categoria;
    url: string;
    contador: string;
    titulo: string;
    para: string;
    boton: string;
  }[],
  contacto: {
    titulo: '¿No sabes qué servicio necesitas?',
    texto: 'Cuéntanos tu evento o proyecto y te decimos qué te conviene.',
    boton: 'Cotizar por WhatsApp',
    mensaje: mensajesWhatsApp.general,
  },
};

const audio: DatosCategoria = {
  categoria: 'audio',
  url: '/servicios-de-audio/',
  nombre: 'Servicios de audio',
  contador: '/1',
  title: 'Servicios de audio para eventos en Puebla | Digital X',
  descripcion:
    'Renta de audio y sonido, y sonorización, para fiestas, conferencias, eventos culturales y cultos en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
  h1: 'Servicios de audio para eventos en Puebla',
  ficha: [
    { etiqueta: 'Para', valor: 'Fiestas, conferencias, eventos culturales, cultos, clases y salones' },
    { etiqueta: 'Personal', valor: 'Técnico capacitado de principio a fin' },
    { etiqueta: 'Cotización', valor: 'A la medida, con viáticos desglosados' },
  ],
  queHacemos: {
    titulo: 'Audio para que tu evento se escuche claro',
    parrafos: [
      'Rentamos audio y sonido para eventos en Puebla, Atlixco, Izúcar de Matamoros y alrededores, y nos encargamos de la sonorización: elegimos el equipo según tu evento.',
      'Nuestro personal técnico capacitado te acompaña de principio a fin, para que tú te ocupes de tu público y no del sonido.',
    ],
  },
  servicios: {
    titulo: 'Nuestros servicios de audio',
    items: [
      {
        url: '/servicios-de-audio/renta-de-audio/',
        frase:
          'Equipo de audio y sonorización para tu fiesta, conferencia, clase o culto, con personal técnico durante todo el evento.',
      },
    ],
  },
  tambien: {
    titulo: 'También te puede servir',
    items: [
      { titulo: 'Servicios de video', texto: 'Proyecta, transmite o graba tu evento', url: '/servicios-de-video/' },
      proyectos,
      {
        titulo: 'Condiciones de contratación',
        texto: 'Anticipo, pagos y cancelación',
        url: '/condiciones-de-contratacion/',
      },
    ],
  },
  cotizacion: {
    etiqueta: 'Cotiza tu evento',
    texto: 'Mándanos la fecha, el lugar, el tipo de evento y cuántas personas esperas.',
    mensaje: mensajesWhatsApp.rentaDeAudio,
  },
  faq: {
    etiqueta: 'Preguntas frecuentes',
    titulo: 'Preguntas frecuentes sobre audio para eventos',
    texto: 'Lo que más nos preguntan antes de rentar audio.',
    items: [
      {
        pregunta: '¿Para qué eventos rentan audio y sonido?',
        respuesta:
          'Para fiestas, conferencias, eventos culturales, cultos, clases como zumba, agrupaciones musicales y eventos en salones. Elegimos el equipo y la sonorización según cada evento.',
      },
      {
        pregunta: '¿De qué depende el precio de la renta de audio?',
        respuesta:
          'Del número de personas, las horas de servicio, la distancia al lugar y el equipo que se necesita. Los viáticos se desglosan y se incluyen en la cotización, para que conozcas el total desde el principio.',
      },
      {
        pregunta: '¿Qué pasa si mi evento dura más de lo contratado?',
        respuesta:
          'Puedes pedir horas extra. Cada hora extra cuesta el 15 % del costo del servicio, según nuestras condiciones de contratación.',
      },
      {
        pregunta: '¿También pueden proyectar, grabar o transmitir mi evento?',
        respuesta:
          'Sí. Con circuito cerrado proyectamos tu evento en vivo en pantallas del lugar (no es un sistema de seguridad). Con producción de videos para eventos queda en video, y con transmisión en vivo lo ven por internet. Los puedes sumar al audio en la misma cotización.',
      },
    ],
  },
};

const video: DatosCategoria = {
  categoria: 'video',
  url: '/servicios-de-video/',
  nombre: 'Servicios de video',
  contador: '/2',
  title: 'Servicios de video para eventos en Puebla | Digital X',
  descripcion:
    'Circuito cerrado, producción de videos, transmisión en vivo, video con dron y recorridos 360 en Puebla, Atlixco e Izúcar de Matamoros. Cotiza por WhatsApp.',
  h1: 'Servicios de video para eventos y negocios en Puebla',
  ficha: [
    { etiqueta: 'Para', valor: 'Eventos, conferencias, instituciones y negocios' },
    { etiqueta: 'Pantallas', valor: 'Las coordinamos para tu evento' },
    { etiqueta: 'Cotización', valor: 'A la medida, según el servicio y el lugar' },
  ],
  queHacemos: {
    titulo: 'Video para que tu evento se vea, se transmita y quede en video',
    parrafos: [
      'En Puebla, Atlixco, Izúcar de Matamoros y alrededores llevamos tu evento a las pantallas del lugar, a internet y a un video que puedes guardar. También grabamos con dron y hacemos recorridos virtuales 360.',
      'El circuito cerrado es proyección en vivo: cámaras cuya imagen se ve en pantallas para eventos dentro del mismo lugar. No es un sistema de seguridad. Si además quieres el video de tu evento, súmale la producción de videos para eventos.',
    ],
  },
  servicios: {
    titulo: 'Nuestros servicios de video',
    items: [
      {
        url: '/servicios-de-video/circuito-cerrado/',
        frase:
          'Proyección en vivo de tu evento en pantallas que coordinamos, para que todo tu público vea el escenario. No es un sistema de seguridad.',
      },
      {
        url: '/servicios-de-video/grabacion-de-eventos/',
        frase: 'Grabamos y producimos el video de tu evento para que lo guardes o lo compartas.',
      },
      {
        url: '/servicios-de-video/streaming/',
        frase: 'Tu conferencia, evento cultural o culto en vivo por internet, en alta definición.',
      },
      {
        url: '/servicios-de-video/dron/',
        frase: 'Video aéreo de tu evento, de tu propiedad o de un lugar turístico.',
      },
      {
        url: '/servicios-de-video/recorridos-360/',
        frase:
          'Tomamos el material y publicamos tu recorrido virtual 360 en una plataforma de recorridos virtuales, para que conozcan tu salón, hotel, negocio, escuela o lugar turístico desde la pantalla.',
      },
    ],
  },
  tambien: {
    titulo: 'También te puede servir',
    items: [
      {
        titulo: 'Servicios de audio',
        texto: 'Renta de audio y sonido para el mismo evento',
        url: '/servicios-de-audio/',
      },
      {
        titulo: 'Servicios de tecnología',
        texto: 'Una página web para tu negocio',
        url: '/servicios-de-tecnologia/',
      },
      proyectos,
      {
        titulo: 'Condiciones de contratación',
        texto: 'Cómo se aparta la fecha y cómo se paga',
        url: '/condiciones-de-contratacion/',
      },
    ],
  },
  cotizacion: {
    etiqueta: 'Cotiza tu evento',
    texto: 'Cuéntanos la fecha, el lugar y qué quieres proyectar, grabar o transmitir.',
    mensaje: mensajesWhatsApp.general,
  },
  faq: {
    etiqueta: 'Preguntas frecuentes',
    titulo: 'Preguntas frecuentes sobre video para eventos',
    texto: 'Lo que más nos preguntan antes de contratar video.',
    items: [
      {
        pregunta: '¿El circuito cerrado es lo mismo que las cámaras de seguridad?',
        respuesta:
          'No. Es proyección en vivo: las cámaras captan tu evento y la imagen se ve al momento en pantallas del lugar, para que todo tu público vea lo que pasa en el escenario. No es un sistema de seguridad.',
      },
      {
        pregunta: '¿Qué diferencia hay entre circuito cerrado y transmisión en vivo?',
        respuesta:
          'El circuito cerrado se ve en pantallas dentro del lugar del evento. La transmisión en vivo se ve por internet, desde donde esté tu público. Puedes contratar uno o los dos.',
      },
      {
        pregunta: '¿Cómo obtengo un video de mi evento?',
        respuesta:
          'Con la producción de videos para eventos: grabamos tu evento y te entregamos el video editado. El tiempo de entrega depende de la carga de trabajo y de la urgencia; te lo confirmamos al cotizar.',
      },
      {
        pregunta: '¿Ustedes ponen las pantallas?',
        respuesta:
          'Las pantallas para eventos las coordinamos nosotros, junto con las cámaras y la proyección en vivo, para que no tengas que buscar otro proveedor.',
      },
    ],
  },
};

const tecnologia: DatosCategoria = {
  categoria: 'tecnologia',
  url: '/servicios-de-tecnologia/',
  nombre: 'Servicios de tecnología',
  contador: '/3',
  title: 'Servicios de tecnología para negocios en Puebla | Digital X',
  descripcion:
    'Páginas web, apps móviles, desarrollo de software y tienda en línea para negocios en Puebla, Atlixco e Izúcar de Matamoros. Cotiza por WhatsApp.',
  h1: 'Servicios de tecnología para tu negocio en Puebla',
  ficha: [
    { etiqueta: 'Para', valor: 'Negocios e instituciones' },
    { etiqueta: 'Cómo trabajamos', valor: 'Por etapas: planeación, diseño y desarrollo' },
    { etiqueta: 'Pagos', valor: 'Por etapa' },
  ],
  queHacemos: {
    titulo: 'Páginas web, apps y software para tu negocio',
    parrafos: [
      'Desarrollamos páginas web, apps móviles, software y tiendas en línea para negocios e instituciones de Puebla, Atlixco, Izúcar de Matamoros y alrededores.',
      'Trabajamos por etapas: primero entendemos qué necesitas resolver, después planeamos y diseñamos, y desarrollamos por partes que recibes conforme avanzan.',
    ],
  },
  servicios: {
    titulo: 'Nuestros servicios de tecnología',
    items: [
      {
        url: '/servicios-de-tecnologia/paginas-web/',
        frase: 'Páginas de destino y sitios completos para que encuentren tu negocio y te escriban.',
      },
      {
        url: '/servicios-de-tecnologia/apps-moviles/',
        frase:
          'Apps para el celular de tus clientes o de tu equipo, según lo que necesite tu proyecto. Se pueden desarrollar para Android y iPhone.',
      },
      {
        url: '/servicios-de-tecnologia/desarrollo-de-software/',
        frase: 'Sistemas hechos para los procesos propios de tu negocio.',
      },
      {
        url: '/servicios-de-tecnologia/tienda-en-linea/',
        frase: 'Para vender tus productos por internet.',
      },
    ],
  },
  tambien: {
    titulo: 'También te puede servir',
    items: [
      {
        titulo: 'Servicios de video',
        texto: 'Video con dron o recorrido 360 para tu página',
        url: '/servicios-de-video/',
      },
      proyectos,
      {
        titulo: 'Condiciones de contratación',
        texto: 'Cómo se pagan los proyectos de tecnología',
        url: '/condiciones-de-contratacion/',
      },
    ],
  },
  cotizacion: {
    etiqueta: 'Cotiza tu proyecto',
    texto: 'Cuéntanos qué necesitas resolver y a qué se dedica tu negocio.',
    mensaje: mensajesWhatsApp.general,
  },
  faq: {
    etiqueta: 'Preguntas frecuentes',
    titulo: 'Preguntas frecuentes sobre tecnología para negocios',
    texto: 'Lo que más nos preguntan antes de empezar un proyecto.',
    items: [
      {
        pregunta: '¿Qué diferencia hay entre una página web y una tienda en línea?',
        respuesta:
          'Una página web presenta tu negocio, lo que ofreces y cómo contactarte. Una tienda en línea, además, te permite vender tus productos por internet.',
      },
      {
        pregunta: '¿Cómo se paga un proyecto de tecnología?',
        respuesta:
          'Por etapas. La planeación y el diseño se pagan por adelantado, y el desarrollo se paga etapa por etapa. Recibes lo de cada etapa cuando queda liquidada. El detalle está en nuestras condiciones de contratación.',
      },
      {
        pregunta: '¿Pueden hacer un sistema para los procesos de mi negocio?',
        respuesta:
          'Sí. Con desarrollo de software hacemos sistemas para los procesos propios de tu negocio. Cuéntanos qué quieres resolver y te proponemos cómo hacerlo.',
      },
      {
        pregunta: '¿Las apps funcionan en Android y iPhone?',
        respuesta:
          'Se pueden desarrollar multiplataforma, para Android y iPhone. Lo definimos según lo que necesite tu proyecto.',
      },
    ],
  },
};

export const categorias = { audio, video, tecnologia } satisfies Record<Categoria, DatosCategoria>;
