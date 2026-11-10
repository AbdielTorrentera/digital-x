/**
 * Contenido de /servicios/ (el catálogo) y de cada servicio (/servicios/{slug}/). Textos locales, mientras no estén en
 * Sanity. El nombre de cada servicio y su estado (construida) viven en lib/paginas.ts: aquí solo va lo demás. Sin
 * imágenes: las fotos van en servicios-fotos.ts, para poder probar estos textos con node:test.
 * Fuentes: docs/estructura-sitio-digitalx.md sección 5, docs/reglas-seo-digitalx.md sección 1 (title y meta) y los
 * textos confirmados por el dueño. Solo hechos confirmados: sin precios, cifras, marcas, topes de personas ni datos del
 * equipo. El circuito cerrado se describe siempre como cámaras en vivo en pantallas para eventos, sin mencionar seguridad
 * ni vigilancia. Las pantallas (LED o televisores) y la planta de luz son de proveedores: se coordinan, y no se ofrece proyector.
 */
import type { PreguntaFrecuente } from '../lib/jsonld.ts';
import { mensajesWhatsApp } from '../lib/negocio.ts';
import type { Categoria } from '../lib/paginas.ts';

/** Los 10 servicios, en el orden del catálogo (el mismo de lib/paginas.ts). Una prueba revisa que coincidan. */
export const slugs = [
  'renta-de-audio',
  'circuito-cerrado-para-eventos',
  'video-para-eventos',
  'streaming-para-eventos',
  'video-con-drone',
  'recorridos-virtuales-360',
  'paginas-web',
  'tienda-en-linea',
  'aplicaciones-moviles',
  'desarrollo-de-software',
] as const;
export type Slug = (typeof slugs)[number];

/** Un enlace a otra página con su descripción ("También te puede servir"). Un servicio va por su slug. */
export type EnlaceRelacionado = { texto: string } & ({ slug: Slug } | { titulo: string; url: string });

/** Un bloque de una sección extra: un párrafo, una lista con viñetas o puntos con título ("Por hora: …"). */
export type BloqueDeSeccion =
  { parrafo: string } | { lista: string[] } | { puntos: { titulo: string; texto: string }[] };

export interface SeccionExtra {
  /** Id de la sección y de su enlace en la navegación interna. */
  id: string;
  /** Texto del enlace en la navegación interna. */
  etiqueta: string;
  titulo: string;
  bloques: BloqueDeSeccion[];
}

/** Un párrafo con enlaces a servicios: trozos de texto y `{ slug, texto }` (su página si está publicada, o su tarjeta). */
export type TextoConEnlaces = (string | { slug: Slug; texto: string })[];

/** El texto de los bloques de una sección, línea por línea (para revisar vocabulario y repeticiones en las pruebas). */
export const textosDeBloques = (bloques: BloqueDeSeccion[]): string[] =>
  bloques.flatMap((bloque) =>
    'parrafo' in bloque
      ? [bloque.parrafo]
      : 'lista' in bloque
        ? bloque.lista
        : bloque.puntos.map((punto) => `${punto.titulo}: ${punto.texto}`),
  );

/** Lo que lleva la página de un servicio. Solo se publica con todo lo obligatorio (ver `faltantesDePagina`). */
export interface PaginaDeServicio {
  /** Obligatoria: 3 filas junto a la foto principal. */
  ficha?: { etiqueta: string; valor: string }[];
  /** Obligatoria: el título y los párrafos de "Descripción". */
  descripcion?: { titulo?: string; parrafos: string[] };
  /** Obligatoria: lo confirmado que incluye el servicio. */
  incluye?: string[];
  /** Párrafo bajo la lista de lo que incluye, con enlaces a otros servicios. */
  incluyeNota?: TextoConEnlaces;
  /** Secciones extra (por ejemplo, Sonorización); cada una suma su enlace a la navegación interna. */
  secciones?: SeccionExtra[];
  /** Obligatorio: servicios complementarios, /proyectos/ y condiciones de contratación. */
  tambien?: { intro?: string; items: EnlaceRelacionado[] };
  /** Obligatoria: la tarjeta de cotización. */
  cotizacion?: { etiqueta: string; texto: string };
  /** Obligatorio: el cierre de la página (foto oscura con WhatsApp y llamada). */
  cierre?: { titulo: string; texto: string };
  /** Preguntas frecuentes propias de este servicio; sin ellas, la sección no se dibuja. */
  faq?: PreguntaFrecuente[];
}

export interface ServicioContenido {
  /** Corta y confirmada por el dueño: la usan la tarjeta del catálogo y el JSON-LD. */
  descripcion: string;
  title: string;
  /** Redactada aparte de la descripción: servicio + zona + invitación a cotizar por WhatsApp. */
  meta: string;
  h1: string;
  /** Filas de la tarjeta del catálogo. */
  para: string;
  incluye: string;
  /** Mensaje prellenado de WhatsApp de este servicio (negocio.ts). */
  mensaje: string;
  /** Tipo de servicio del JSON-LD; sin él se usa la categoría ("Servicios de video"). */
  serviceType?: string;
  pagina?: PaginaDeServicio;
}

const proyectos: EnlaceRelacionado = {
  titulo: 'Proyectos de Digital X',
  texto: 'Conoce nuestros trabajos',
  url: '/proyectos/',
};
const condiciones = (texto: string): EnlaceRelacionado => ({
  titulo: 'Condiciones de contratación',
  texto,
  url: '/condiciones-de-contratacion/',
});

export const servicios: Record<Slug, ServicioContenido> = {
  'renta-de-audio': {
    descripcion:
      'Equipo de audio y sonorización, con montaje y mezcla cuando tu evento lo necesita, y un técnico pendiente del sonido durante todo tu evento.',
    title: 'Renta de audio para eventos en Puebla y Atlixco | Digital X',
    meta: 'Renta de audio y sonido, y sonorización, con técnico durante todo tu evento en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
    h1: 'Renta de audio y sonido para eventos en Puebla y Atlixco',
    para: 'Fiestas, conferencias, eventos culturales y cultos',
    incluye: 'Equipo, sonorización y técnico',
    mensaje: mensajesWhatsApp.rentaDeAudio,
    pagina: {
      ficha: [
        { etiqueta: 'Para', valor: 'Fiestas, conferencias, eventos culturales, cultos, clases y salones' },
        { etiqueta: 'Personal', valor: 'Técnico capacitado de principio a fin' },
        { etiqueta: 'Cotización', valor: 'A la medida, con viáticos desglosados' },
      ],
      descripcion: {
        titulo: 'Audio para que tu evento se escuche claro',
        parrafos: [
          'Rentamos audio y sonido para eventos en Puebla, Atlixco, Izúcar de Matamoros y alrededores.',
          'Nuestro personal técnico capacitado te acompaña de principio a fin, para que tú te ocupes de tu público y no del sonido.',
        ],
      },
      incluye: [
        'Equipo de audio',
        'Sonorización',
        'Montaje y mezcla cuando tu evento lo necesita',
        'Técnico pendiente del sonido durante todo tu evento',
      ],
      secciones: [
        {
          id: 'sonorizacion',
          etiqueta: 'Sonorización',
          titulo: 'Sonorización para tu evento',
          bloques: [
            {
              parrafo:
                'Nos encargamos de la sonorización: elegimos el equipo según tu evento y, cuando lo necesita, hacemos el montaje y la mezcla.',
            },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres también proyectar, grabar o transmitir tu evento?',
        items: [
          {
            slug: 'circuito-cerrado-para-eventos',
            texto: 'Cámaras en vivo en pantallas para que todos vean el escenario',
          },
          { slug: 'video-para-eventos', texto: 'Grabación del evento y video editado' },
          { slug: 'streaming-para-eventos', texto: 'Tu evento en vivo por internet' },
          proyectos,
          condiciones('Anticipo, pagos y cancelación'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu evento',
        texto: 'Mándanos la fecha, el lugar, el tipo de evento y cuántas personas esperas.',
      },
      cierre: {
        titulo: 'Hagamos que tu evento suene mejor',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos el audio y el sonido de tu evento.',
      },
      faq: [
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
            'Sí. Con circuito cerrado proyectamos tu evento en vivo en pantallas del lugar. Con producción de videos para eventos queda en video, y con transmisión en vivo lo ven por internet. Los puedes sumar al audio en la misma cotización.',
        },
      ],
    },
  },

  'circuito-cerrado-para-eventos': {
    descripcion: 'Cámaras en vivo proyectadas en pantallas para que todo tu público vea el escenario.',
    title: 'Circuito cerrado para eventos en Puebla | Digital X',
    meta: 'Circuito cerrado y pantallas LED o TV para eventos en Puebla: cámaras en vivo con operador para que todos vean el escenario. Cotiza por WhatsApp.',
    h1: 'Circuito cerrado para eventos en Puebla',
    para: 'Conferencias, eventos culturales y deportivos',
    incluye: 'Cámaras y pantallas',
    mensaje: mensajesWhatsApp.circuitoCerrado,
    pagina: {
      ficha: [
        {
          etiqueta: 'Qué es',
          valor: 'Cámaras en vivo en pantallas durante tu evento, para que todos vean el escenario',
        },
        {
          etiqueta: 'Para',
          valor: 'Conferencias, eventos culturales y deportivos, e instituciones; también en exteriores',
        },
        { etiqueta: 'Pantallas', valor: 'Si las necesitas, las coordinamos; van incluidas en tu cotización' },
      ],
      descripcion: {
        titulo: 'Proyección en vivo de tu evento en pantallas',
        parrafos: [
          'El circuito cerrado para eventos es proyección en vivo: cámaras cuya imagen se ve en pantallas dentro del mismo lugar, para que todo tu público vea lo que pasa en el escenario.',
          'Así todo tu público ve el escenario. Si además quieres el video de tu evento, súmale la producción de videos para eventos.',
        ],
      },
      incluye: [
        'Personal que opera las cámaras durante tu evento',
        'Una o varias cámaras en vivo, según tu evento',
        'La imagen en vivo en las pantallas del lugar',
        'Pantallas para eventos, si las necesitas: las coordinamos y van incluidas en tu cotización',
        'Montaje e instalación del equipo',
      ],
      secciones: [
        {
          id: 'pantallas',
          etiqueta: 'Pantallas',
          titulo: 'Pantalla LED o televisor',
          bloques: [
            {
              parrafo:
                'Coordinamos pantallas LED y televisores según tu lugar y tu evento. Un televisor puede quedarse corto si el salón es grande, y con mucha luz conviene una pantalla LED. Una pantalla más grande no siempre es mejor: lo importante es que todos la vean bien. Lo revisamos al cotizar.',
            },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres que tu evento también se escuche y se transmita?',
        items: [
          { slug: 'renta-de-audio', texto: 'Audio y sonorización para el mismo evento' },
          { slug: 'video-para-eventos', texto: 'Video editado de tu evento' },
          { slug: 'streaming-para-eventos', texto: 'Tu evento también por internet' },
          proyectos,
          condiciones('Cómo se aparta la fecha y cómo se paga'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu evento',
        texto: 'Mándanos la fecha, el lugar y el tipo de evento.',
      },
      cierre: {
        titulo: 'Que todo tu público vea el escenario',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos las cámaras y pantallas de tu evento.',
      },
      faq: [
        {
          pregunta: '¿Para qué sirve el circuito cerrado en un evento?',
          respuesta:
            'Para que todo tu público vea lo que pasa en el escenario: las cámaras captan tu evento en vivo y la imagen se ve al momento en pantallas del lugar.',
        },
        {
          pregunta: '¿Qué diferencia hay entre circuito cerrado y transmisión en vivo?',
          respuesta:
            'El circuito cerrado se ve en pantallas dentro del lugar del evento. La transmisión en vivo se ve por internet, desde donde esté tu público. Puedes contratar uno o los dos.',
        },
        {
          pregunta: '¿Ustedes ponen las pantallas?',
          respuesta: 'Si las necesitas, sí. Las coordinamos junto con las cámaras y van incluidas en tu cotización.',
        },
        {
          pregunta: '¿Las pantallas también llevan el audio de mi evento?',
          respuesta:
            'Si también contratas la renta de audio con nosotros, sí. Si el audio de tu evento es con otro proveedor, nos coordinamos con él para integrarlo.',
        },
        {
          pregunta: '¿Qué necesita el lugar para el circuito cerrado?',
          respuesta:
            'Acceso a corriente eléctrica de 110 V. Si el lugar no tiene energía, lo revisamos al cotizar y, si hace falta, coordinamos una planta de luz con un proveedor.',
        },
      ],
    },
  },

  'video-para-eventos': {
    descripcion:
      'Grabación profesional de conferencias, ceremonias y eventos, y videos institucionales y promocionales. Entregamos el video editado.',
    title: 'Video para eventos y conferencias en Puebla | Digital X',
    meta: 'Grabación de video para conferencias, eventos corporativos, talleres y ceremonias en Puebla y Atlixco. Entregamos el video editado. Cotiza por WhatsApp.',
    h1: 'Video para eventos y conferencias en Puebla',
    para: 'Conferencias, talleres, eventos corporativos y ceremonias',
    incluye: 'Cobertura y video editado',
    mensaje: mensajesWhatsApp.produccionDeVideos,
    serviceType: 'Producción de video para eventos, conferencias y videos institucionales',
    pagina: {
      ficha: [
        { etiqueta: 'Para', valor: 'Eventos, conferencias, empresas e instituciones' },
        { etiqueta: 'Equipo', valor: 'Al menos dos personas y hasta tres cámaras' },
        { etiqueta: 'Entrega', valor: 'Video editado; material sin editar si lo acordamos' },
      ],
      descripcion: {
        titulo: 'Video de tus conferencias y eventos',
        parrafos: [
          'En Digital X grabamos tus conferencias, talleres, eventos corporativos, culturales y religiosos y ceremonias en Puebla, Atlixco, Izúcar de Matamoros y alrededores, y te entregamos el video editado. Cada cobertura se hace con un equipo de al menos dos personas y se cotiza a la medida.',
          'También producimos videos institucionales, corporativos y promocionales para tu empresa o proyecto. Cuéntanos qué necesitas y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'Cobertura de los momentos clave que acordemos, como conferencias, entradas especiales o ceremonias',
        'Un equipo de al menos dos personas',
        'Una o varias cámaras, hasta tres ángulos, según tu evento',
        'Audio directo de la consola del evento, cuando el lugar lo permite',
        'Edición y entrega del video editado',
      ],
      incluyeNota: [
        'Si lo acordamos al cotizar, también te entregamos el material sin editar. La ',
        { slug: 'streaming-para-eventos', texto: 'transmisión en vivo' },
        ' y el ',
        { slug: 'circuito-cerrado-para-eventos', texto: 'circuito cerrado para eventos' },
        ' son servicios aparte y se pueden sumar.',
      ],
      secciones: [
        {
          id: 'para-que-eventos',
          etiqueta: 'Para qué eventos',
          titulo: 'Para qué eventos',
          bloques: [
            {
              lista: [
                'Conferencias y congresos',
                'Talleres y clases',
                'Eventos corporativos',
                'Eventos culturales',
                'Eventos religiosos',
                'Ceremonias',
              ],
            },
          ],
        },
        {
          id: 'cobertura',
          etiqueta: 'Cobertura',
          titulo: 'Opciones de cobertura',
          bloques: [
            {
              puntos: [
                {
                  titulo: 'Por hora',
                  texto:
                    'es la forma más común. Grabamos durante el tiempo contratado y cuidamos los momentos clave que acordemos.',
                },
                {
                  titulo: 'Por un tiempo específico o solo momentos clave',
                  texto: 'si necesitas otra modalidad, la valoramos al cotizar.',
                },
                {
                  titulo: 'Una cámara o varios ángulos',
                  texto:
                    'en conferencias largas o eventos grandes, grabar desde varios ángulos (general, acercamiento y escenario) da un mejor resultado que una sola cámara fija.',
                },
              ],
            },
          ],
        },
        {
          id: 'video-institucional',
          etiqueta: 'Institucional',
          titulo: 'Video institucional, corporativo y promocional',
          bloques: [
            {
              parrafo:
                'Además de eventos, producimos videos institucionales, corporativos y promocionales para presentar tu empresa, tu servicio, un lugar o un lanzamiento. Se cotizan a la medida según lo que necesites mostrar, la duración y las tomas, que pueden incluir drone. Si tienes un evento, podemos combinar la cobertura con un video promocional.',
            },
          ],
        },
        {
          id: 'entrega',
          etiqueta: 'Entrega',
          titulo: 'Qué recibes y cuándo',
          bloques: [
            {
              parrafo:
                'Recibes el video editado. El tiempo de edición depende de la duración del evento, de lo que se entregue y de la carga de trabajo; el plazo se acuerda al cotizar. Si quieres el material sin editar, dínoslo desde el inicio para incluirlo en la cotización.',
            },
          ],
        },
        {
          id: 'precio',
          etiqueta: 'Precio',
          titulo: 'De qué depende el precio',
          bloques: [
            {
              lista: [
                'La duración de la cobertura',
                'El número de cámaras y de personas',
                'Si es por hora o por momentos clave',
                'La edición y el tipo de video que necesites',
                'Las tomas con drone, si las incluyes',
                'El traslado al lugar',
              ],
            },
            { parrafo: 'Cada cotización se hace a la medida y los viáticos se desglosan.' },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres sumar pantallas, transmisión o audio a tu evento?',
        items: [
          { slug: 'circuito-cerrado-para-eventos', texto: 'Tu evento en vivo en pantallas del lugar' },
          { slug: 'streaming-para-eventos', texto: 'Transmisión por Facebook, YouTube y más' },
          { slug: 'video-con-drone', texto: 'Tomas aéreas e interiores para tu video' },
          { slug: 'renta-de-audio', texto: 'Audio y técnico de sonido para tu evento' },
          proyectos,
          condiciones('Anticipo, horas extra y cancelación'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu video',
        texto: 'Mándanos la fecha, el lugar, el tipo de evento o de video y cuánto dura.',
      },
      cierre: {
        titulo: 'Que tu evento quede en video',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos la cobertura de tu evento o tu video promocional.',
      },
      faq: [
        {
          pregunta: '¿Con un camarógrafo es suficiente?',
          respuesta:
            'Depende del evento. En conferencias largas o eventos grandes conviene grabar desde varios ángulos; lo definimos al cotizar.',
        },
        {
          pregunta: '¿Mi celular graba igual?',
          respuesta:
            'No. Con poca luz, en el audio y en la estabilidad de la imagen se nota la diferencia frente a una cámara profesional.',
        },
        {
          pregunta: '¿Cómo se escucha el audio en el video?',
          respuesta:
            'Cuando el lugar lo permite, tomamos el audio directo de la consola del evento para que se escuche limpio. Lo revisamos al cotizar.',
        },
        {
          pregunta: '¿Es lo mismo que el circuito cerrado o la transmisión en vivo?',
          respuesta:
            'No. La grabación queda como un video para verlo después; el circuito cerrado para eventos muestra el evento en vivo en pantallas, y la transmisión en vivo lo lleva a internet.',
        },
        {
          pregunta: '¿Pueden sumar tomas con drone?',
          respuesta:
            'Sí. El video con drone se puede sumar a la cobertura o a un video promocional, según el lugar y el clima.',
        },
      ],
    },
  },

  'streaming-para-eventos': {
    descripcion: 'Transmisión en vivo (streaming) de tu evento por Facebook, YouTube y otras plataformas.',
    title: 'Streaming para eventos en Puebla y Atlixco | Digital X',
    meta: 'Transmisión en vivo (streaming) de tu evento por Facebook, YouTube y más en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
    h1: 'Streaming para eventos en Puebla y Atlixco',
    para: 'Conferencias, eventos culturales y cultos',
    incluye: 'Facebook, YouTube y más',
    mensaje: mensajesWhatsApp.streaming,
  },

  'video-con-drone': {
    descripcion: 'Tomas aéreas e interiores con drone para eventos, negocios y espacios, en zonas permitidas.',
    title: 'Video con drone: eventos y negocios en Puebla | Digital X',
    meta: 'Video con drone: tomas aéreas e interiores para eventos y negocios en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
    h1: 'Video con drone: eventos y negocios en Puebla',
    para: 'Eventos, negocios y espacios',
    incluye: 'Tomas aéreas e interiores',
    mensaje: mensajesWhatsApp.drone,
  },

  'recorridos-virtuales-360': {
    descripcion:
      'Tomamos el material y publicamos tu recorrido virtual 360 en una plataforma de recorridos virtuales, para hoteles, restaurantes, escuelas, museos y negocios.',
    title: 'Recorridos virtuales 360 para negocios en Puebla | Digital X',
    meta: 'Recorridos virtuales 360 para hoteles, restaurantes, escuelas, museos y negocios en Puebla y Atlixco. Cotiza por WhatsApp.',
    h1: 'Recorridos virtuales 360 para negocios en Puebla',
    para: 'Hoteles, restaurantes, escuelas, museos y negocios',
    incluye: 'Publicación en plataforma',
    mensaje: mensajesWhatsApp.recorridos360,
  },

  'paginas-web': {
    descripcion: 'Diseño y desarrollo de páginas web y landing pages para negocios.',
    title: 'Diseño de páginas web en Puebla y Atlixco | Digital X',
    meta: 'Diseño y desarrollo de páginas web y landing pages para negocios en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
    h1: 'Diseño de páginas web en Puebla y Atlixco',
    para: 'Negocios',
    incluye: 'Páginas web y landing pages',
    mensaje: mensajesWhatsApp.paginasWeb,
    pagina: {
      faq: [
        {
          pregunta: '¿Qué diferencia hay entre una página web y una tienda en línea?',
          respuesta:
            'Una página web presenta tu negocio, lo que ofreces y cómo contactarte. Una tienda en línea, además, te permite vender tus productos por internet.',
        },
      ],
    },
  },

  'tienda-en-linea': {
    descripcion: 'Diseño y desarrollo de tiendas en línea para vender por internet.',
    title: 'Tiendas en línea para negocios en Puebla | Digital X',
    meta: 'Diseño y desarrollo de tiendas en línea para vender por internet, en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
    h1: 'Tiendas en línea para negocios en Puebla',
    para: 'Negocios que venden por internet',
    incluye: 'Diseño y desarrollo',
    mensaje: mensajesWhatsApp.tiendaEnLinea,
  },

  'aplicaciones-moviles': {
    descripcion:
      'Aplicaciones móviles según lo que necesite tu proyecto, para Android y iPhone, del levantamiento de requerimientos a la implementación.',
    title: 'Desarrollo de aplicaciones móviles en Puebla | Digital X',
    meta: 'Aplicaciones móviles para Android y iPhone, del levantamiento de requerimientos a la implementación, en Puebla y Atlixco. Cotiza por WhatsApp.',
    h1: 'Desarrollo de aplicaciones móviles en Puebla',
    para: 'Negocios e instituciones',
    incluye: 'Android y iPhone',
    mensaje: mensajesWhatsApp.aplicacionesMoviles,
    pagina: {
      faq: [
        {
          pregunta: '¿Las aplicaciones funcionan en Android y iPhone?',
          respuesta:
            'Se pueden desarrollar multiplataforma, para Android y iPhone. Lo definimos según lo que necesite tu proyecto.',
        },
      ],
    },
  },

  'desarrollo-de-software': {
    descripcion: 'Sistemas hechos para los procesos propios de tu negocio.',
    title: 'Desarrollo de software para negocios en Puebla | Digital X',
    meta: 'Desarrollo de software para los procesos propios de tu negocio en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
    h1: 'Desarrollo de software para negocios en Puebla',
    para: 'Negocios con procesos propios',
    incluye: 'Sistemas',
    mensaje: mensajesWhatsApp.desarrolloDeSoftware,
    pagina: {
      descripcion: {
        parrafos: [
          'Trabajamos por etapas: primero entendemos qué necesitas resolver, después planeamos y diseñamos, y desarrollamos por partes que recibes conforme avanzan.',
        ],
      },
      faq: [
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
      ],
    },
  },
};

/**
 * Lo que le falta al contenido de un servicio para publicar su página. Vacío = completo. El build lo exige para
 * cualquier servicio con `construida: true` (pages/servicios/[slug].astro); no se generan páginas a medias.
 */
export const faltantesDePagina = (slug: Slug): string[] => {
  const pagina = servicios[slug].pagina;
  const faltan: string[] = [];
  if (pagina?.ficha?.length !== 3) faltan.push('ficha (3 filas)');
  if (!pagina?.descripcion?.titulo || !pagina.descripcion.parrafos.length)
    faltan.push('descripcion (título y párrafos)');
  if (!pagina?.incluye?.length) faltan.push('incluye');
  if (!pagina?.tambien?.items.length) faltan.push('tambien');
  if (!pagina?.cotizacion) faltan.push('cotizacion');
  if (!pagina?.cierre) faltan.push('cierre');
  return faltan;
};

/** El catálogo: /servicios/. Title y meta son los de reglas-seo sección 1 y no cambian. */
export const catalogo = {
  title: 'Servicios de audio, video y tecnología en Puebla | Digital X',
  descripcion:
    'Servicios para tu evento o tu negocio: audio, video y tecnología en Puebla, Atlixco e Izúcar de Matamoros. Elige el tuyo y cotiza por WhatsApp.',
  h1: 'Servicios de audio, video y tecnología en Puebla',
  intro:
    'Trabajamos en Puebla, Atlixco, Izúcar de Matamoros y alrededores con tres áreas de servicio: audio para que tu evento se escuche, video para que se vea y se transmita, y tecnología para que tu negocio funcione en internet. Elige el servicio que necesitas o cuéntanos tu evento por WhatsApp y te decimos qué te conviene.',
  /** Una sección por categoría, en el orden del catálogo. `id` es el ancla (/servicios/#audio) y `etiqueta`, su pestaña. */
  secciones: [
    {
      id: 'audio',
      categoria: 'audio',
      etiqueta: 'Audio',
      titulo: 'Servicios de audio',
      para: 'Que tu evento se escuche claro, con personal técnico capacitado de principio a fin.',
    },
    {
      id: 'video',
      categoria: 'video',
      etiqueta: 'Video',
      titulo: 'Servicios de video',
      para: 'Que tu evento se vea en pantallas, se transmita en vivo y quede en video, y que tu lugar se vea desde el aire o en 360.',
    },
    {
      id: 'tecnologia',
      categoria: 'tecnologia',
      etiqueta: 'Tecnología',
      titulo: 'Servicios de tecnología',
      para: 'Que encuentren tu negocio en internet, que vendas en línea y que tus procesos funcionen con software propio.',
    },
  ] satisfies { id: string; categoria: Categoria; etiqueta: string; titulo: string; para: string }[],
  /** "¿Qué servicios necesito para mi evento?": cada escenario y los servicios que le convienen. */
  guia: {
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
  },
  cierre: {
    titulo: '¿No sabes qué servicio necesitas?',
    texto: 'Dinos la fecha, el lugar y lo que quieres lograr, y armamos tu cotización.',
    mensaje: mensajesWhatsApp.general,
  },
};
