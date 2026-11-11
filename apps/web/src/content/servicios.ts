/**
 * Contenido de cada servicio (/servicios/{slug}/). Textos locales, mientras no estén en
 * Sanity. El nombre de cada servicio y su estado (construida) viven en lib/paginas.ts: aquí solo va lo demás. Sin
 * imágenes: las fotos van en servicios-fotos.ts, para poder probar estos textos con node:test.
 * Fuentes: docs/estructura-sitio-digitalx.md sección 5, docs/reglas-seo-digitalx.md sección 1 (title y meta) y los
 * textos confirmados por el dueño. Solo hechos confirmados: sin precios, cifras, marcas, topes de personas ni datos del
 * equipo. El circuito cerrado se describe siempre como cámaras en vivo en pantallas para eventos, sin mencionar seguridad
 * ni vigilancia. Las pantallas (LED o televisores) y la planta de luz son de proveedores: se coordinan, y no se ofrece proyector.
 */
import type { PreguntaFrecuente } from '../lib/jsonld.ts';
import { mensajesWhatsApp } from '../lib/negocio.ts';
import { comoTexto, type TextoConEnlaces } from '../lib/texto.ts';

export type { TextoConEnlaces };

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
  | { parrafo: string | TextoConEnlaces }
  | { lista: string[] }
  | { puntos: { titulo: string | TextoConEnlaces; texto: string | TextoConEnlaces }[] };

export interface SeccionExtra {
  /** Id de la sección y de su enlace en la navegación interna. */
  id: string;
  /** Texto del enlace en la navegación interna. */
  etiqueta: string;
  titulo: string;
  bloques: BloqueDeSeccion[];
}

/** El texto de los bloques de una sección, línea por línea (para revisar vocabulario y repeticiones en las pruebas). */
export const textosDeBloques = (bloques: BloqueDeSeccion[]): string[] =>
  bloques.flatMap((bloque) =>
    'parrafo' in bloque
      ? [comoTexto(bloque.parrafo)]
      : 'lista' in bloque
        ? bloque.lista
        : bloque.puntos.map((punto) => `${comoTexto(punto.titulo)}: ${comoTexto(punto.texto)}`),
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
    meta: 'Streaming y transmisión en vivo de conferencias y eventos culturales y deportivos en Puebla y Atlixco, con una o varias cámaras. Cotiza por WhatsApp.',
    h1: 'Streaming y transmisión en vivo para eventos en Puebla',
    para: 'Conferencias, eventos culturales y cultos',
    incluye: 'Facebook, YouTube y más',
    mensaje: mensajesWhatsApp.streaming,
    serviceType: 'Transmisión en vivo y streaming de eventos',
    pagina: {
      ficha: [
        { etiqueta: 'Plataformas', valor: 'Facebook, YouTube y más' },
        { etiqueta: 'Cámaras', valor: 'Una o varias, según tu evento' },
        { etiqueta: 'Para', valor: 'Eventos, conferencias, escuelas e instituciones' },
      ],
      descripcion: {
        titulo: 'Transmisión de tu evento en vivo por internet',
        parrafos: [
          'En Digital X hacemos el streaming de tu evento: lo transmitimos en vivo a Facebook, YouTube y otras plataformas, en Puebla, Atlixco, Izúcar de Matamoros y alrededores. Puede ser desde algo sencillo hasta una transmisión más completa, con una o varias cámaras, según lo que necesite tu evento.',
          'Cada transmisión se cotiza a la medida. Cuéntanos qué quieres transmitir y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'La transmisión en vivo de tu evento a una o varias páginas o plataformas',
        'Una o varias cámaras, según tu evento, con personal que las opera',
        'Audio de preferencia directo de la consola del evento, para una señal limpia',
        'Revisión del lugar y pruebas antes del evento',
        'Rótulos, logos o diseños en pantalla, según el paquete que contrates',
      ],
      incluyeNota: [
        'Si hace falta, coordinamos el internet con un proveedor. La grabación de la transmisión se puede entregar con un costo extra. La ',
        { slug: 'video-para-eventos', texto: 'producción de videos para eventos' },
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
                'Eventos escolares',
                'Eventos deportivos',
              ],
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
                'La complejidad del evento y el número de cámaras',
                'El audio que se necesite',
                'Los rótulos o diseños en pantalla',
                'Si incluyes tomas con drone',
                'Las plataformas a las que se transmite',
                'El internet, si hay que coordinarlo',
                'El traslado al lugar',
              ],
            },
            { parrafo: 'Los viáticos se desglosan en la cotización.' },
          ],
        },
      ],
      tambien: {
        intro: '¿Tu evento también necesita audio, pantallas o video editado?',
        items: [
          { slug: 'renta-de-audio', texto: 'Sonido para el evento que vas a transmitir' },
          { slug: 'circuito-cerrado-para-eventos', texto: 'Pantallas en vivo para quien está en el lugar' },
          { slug: 'video-para-eventos', texto: 'Video editado de tu evento para verlo después' },
          { slug: 'video-con-drone', texto: 'Tomas con drone para tu evento' },
          proyectos,
          condiciones('Pagos, viáticos y cancelación'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu transmisión',
        texto: 'Mándanos la fecha, el lugar, el tipo de evento, la plataforma y cuánto dura.',
      },
      cierre: {
        titulo: 'Que tu evento se vea en línea',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos la transmisión de tu evento.',
      },
      faq: [
        {
          pregunta: '¿Sirve el WiFi del lugar?',
          respuesta:
            'Lo ideal es internet por cable y con buena velocidad de subida, no solo de bajada; el WiFi de muchos lugares no alcanza. Si el lugar no tiene buena conexión, coordinamos el internet con un proveedor.',
        },
        {
          pregunta: '¿Qué pasa si se cae el internet o la plataforma?',
          respuesta: 'Puede pasar. Por eso acordamos contigo, antes del evento, qué hacer si algo falla.',
        },
        {
          pregunta: '¿Puedo poner cualquier música?',
          respuesta:
            'No. Facebook o YouTube pueden silenciar o cortar la transmisión si hay música con derechos de autor.',
        },
        {
          pregunta: '¿Se ve en el mismo instante?',
          respuesta:
            'Siempre hay unos segundos de retraso entre lo que pasa en el evento y lo que ve el público en línea.',
        },
        {
          pregunta: '¿En qué plataformas se transmite?',
          respuesta:
            'En Facebook, YouTube y otras plataformas. Cuéntanos dónde quieres transmitir y te indicamos cómo conectarlo.',
        },
      ],
    },
  },

  'video-con-drone': {
    descripcion: 'Video y fotografía aérea con drone para eventos, empresas y espacios, en exteriores e interiores.',
    title: 'Video y fotografía aérea con drone en Puebla | Digital X',
    meta: 'Video y fotografía aérea con drone para eventos, empresas y espacios en Puebla y Atlixco. Entregamos video y fotos. Cotiza por WhatsApp.',
    h1: 'Video y fotografía aérea con drone en Puebla',
    para: 'Eventos, negocios y espacios',
    incluye: 'Video y fotografía aérea',
    mensaje: mensajesWhatsApp.drone,
    serviceType: 'Video y fotografía aérea con drone',
    pagina: {
      ficha: [
        { etiqueta: 'Tomas', valor: 'Video y fotografía aérea con drone' },
        { etiqueta: 'Entrega', valor: 'Video editado, tomas sin editar o ambos, y fotografía aérea' },
        { etiqueta: 'Para', valor: 'Eventos, empresas y espacios' },
      ],
      descripcion: {
        titulo: 'Tomas aéreas para tu evento, tu negocio o tu espacio',
        parrafos: [
          'En Digital X grabamos video y fotografía aérea con drone para eventos, empresas y espacios en Puebla, Atlixco, Izúcar de Matamoros y alrededores, tanto en exteriores como en interiores.',
          'Planeamos contigo las tomas que necesitas y revisamos el lugar antes de volar. Cada servicio se cotiza a la medida: cuéntanos qué quieres mostrar y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'Planeación de las tomas contigo',
        'Revisión del lugar y de las condiciones antes de volar',
        'Grabación con drone y piloto en el lugar, en exteriores o interiores',
        'Tomas en los momentos clave de tu evento',
        'Entrega del material: video editado, tomas sin editar o ambos, y fotografía aérea, según lo que acordemos en la cotización',
      ],
      incluyeNota: [
        'La ',
        { slug: 'video-para-eventos', texto: 'producción de videos para eventos' },
        ', la ',
        { slug: 'streaming-para-eventos', texto: 'transmisión en vivo' },
        ' y el ',
        { slug: 'circuito-cerrado-para-eventos', texto: 'circuito cerrado para eventos' },
        ' son servicios aparte y se pueden combinar.',
      ],
      secciones: [
        {
          id: 'fotografia-aerea',
          etiqueta: 'Fotografía aérea',
          titulo: 'Fotografía aérea',
          bloques: [
            {
              parrafo:
                'Además de video, tomamos fotografía aérea con drone de eventos, instalaciones y espacios. Se puede entregar junto con el video o por separado.',
            },
          ],
        },
        {
          id: 'para-que-sirve',
          etiqueta: 'Para qué sirve',
          titulo: 'Para qué sirve',
          bloques: [
            {
              puntos: [
                {
                  titulo: 'Eventos',
                  texto: 'conferencias, ceremonias y eventos culturales y deportivos, al aire libre o en salones.',
                },
                {
                  titulo: 'Empresas y negocios',
                  texto: 'presentar tus instalaciones y videos promocionales.',
                },
                {
                  titulo: 'Espacios',
                  texto: [
                    'hoteles, restaurantes, escuelas y museos, que además se pueden combinar con un ',
                    { slug: 'recorridos-virtuales-360', texto: 'recorrido virtual 360' },
                    '.',
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'exteriores-e-interiores',
          etiqueta: 'Exteriores e interiores',
          titulo: 'Exteriores e interiores',
          bloques: [
            {
              parrafo:
                'Además de las tomas aéreas en exteriores, podemos grabar en interiores, como salones, pasillos y espacios cerrados, siempre que el lugar lo permita.',
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
                'La duración del servicio y el número de tomas o ubicaciones',
                'Si es en exteriores, en interiores o ambos',
                'Lo que necesites recibir: video editado, tomas sin editar, fotografías o una combinación',
                'Si lo combinas con video de eventos, transmisión o un recorrido 360',
                'El traslado al lugar',
              ],
            },
            { parrafo: 'En la cotización, el traslado y los viáticos aparecen desglosados.' },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres combinar el drone con otros servicios?',
        items: [
          { slug: 'video-para-eventos', texto: 'Cobertura en video de conferencias y eventos' },
          { slug: 'streaming-para-eventos', texto: 'Streaming de tu evento en vivo' },
          { slug: 'circuito-cerrado-para-eventos', texto: 'Cámaras en vivo y pantallas para tu público' },
          { slug: 'renta-de-audio', texto: 'Equipo de audio y sonorización con técnico' },
          { slug: 'recorridos-virtuales-360', texto: 'Recorrido virtual 360 de tu espacio' },
          proyectos,
          condiciones('Anticipo y cancelación'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu video o tus fotos',
        texto:
          'Mándanos la fecha, el lugar, el tipo de evento o proyecto, si es interior o exterior y qué quieres mostrar.',
      },
      cierre: {
        titulo: 'Que se vea tu espacio desde el aire',
        texto:
          'Escríbenos por WhatsApp o llámanos y cotizamos el video o la fotografía aérea de tu evento o tu espacio.',
      },
      faq: [
        {
          pregunta: '¿Se puede volar un drone en cualquier lugar?',
          respuesta: 'No. Hay zonas restringidas, como las cercanas a aeropuertos.',
        },
        {
          pregunta: '¿Se puede volar con lluvia o viento?',
          respuesta:
            'Con lluvia o viento fuerte no se puede volar. Si pasa el día del servicio, lo vemos contigo según el caso.',
        },
        {
          pregunta: '¿Por qué las tomas se hacen en momentos clave?',
          respuesta:
            'Las baterías del drone duran poco, así que planeamos las tomas para los momentos clave en lugar de grabar todo el evento de corrido.',
        },
        {
          pregunta: '¿Por qué contratar el servicio y no usar un drone propio?',
          respuesta:
            'Un buen resultado requiere experiencia y planeación. Nosotros nos encargamos del vuelo y de las tomas para que tú te concentres en tu evento o tu negocio.',
        },
        {
          pregunta: '¿Hacen espectáculos de drones con luces?',
          respuesta: 'No. Nuestro servicio es de video y fotografía aérea.',
        },
      ],
    },
  },

  'recorridos-virtuales-360': {
    descripcion:
      'Recorridos virtuales con fotos 360 enlazadas para hoteles, restaurantes, escuelas, museos y negocios, con drone y cámara 360.',
    title: 'Recorridos virtuales 360 para negocios en Puebla | Digital X',
    meta: 'Recorridos virtuales 360 con drone y cámara 360 para negocios, hoteles, restaurantes y escuelas en Puebla y Atlixco. Cotiza por WhatsApp.',
    h1: 'Recorridos virtuales 360 para negocios y espacios en Puebla',
    para: 'Hoteles, restaurantes, escuelas, museos y negocios',
    incluye: 'Fotos 360 enlazadas',
    mensaje: mensajesWhatsApp.recorridos360,
    serviceType: 'Recorridos virtuales y fotografía 360',
    pagina: {
      ficha: [
        { etiqueta: 'Qué es', valor: 'Fotos 360 enlazadas que se recorren desde el celular o la computadora' },
        { etiqueta: 'Captura', valor: 'Con drone y, para interiores, con cámara 360 cuando el proyecto lo requiere' },
        { etiqueta: 'Para', valor: 'Negocios, hoteles, restaurantes, escuelas y museos' },
      ],
      descripcion: {
        titulo: 'Recorridos virtuales de tu negocio o tu espacio',
        parrafos: [
          'En Digital X creamos recorridos virtuales 360 para negocios, hoteles, restaurantes, escuelas, museos y otros espacios en Puebla, Atlixco, Izúcar de Matamoros y alrededores. Un recorrido virtual es un conjunto de fotos 360 enlazadas que tu cliente recorre desde el celular o la computadora antes de visitarte. No es un video.',
          'Capturamos el material con drone y, para interiores, con cámara 360 cuando el proyecto lo requiere. Planeamos contigo el recorrido y te lo entregamos listo para compartir. Cada recorrido se cotiza a la medida.',
        ],
      },
      incluye: [
        'Planeación del recorrido contigo: qué puntos se capturan y cómo se enlazan',
        'Captura del material en tu lugar, con drone y, para interiores, con cámara 360 cuando el proyecto lo requiere',
        'Unión de las imágenes y enlace de los puntos',
        'Puntos de información dentro del recorrido, si los necesitas',
        'Entrega del recorrido con un enlace para compartir y, según la plataforma, un código para insertarlo en tu página web',
      ],
      incluyeNota: [
        'La plataforma donde se aloja el recorrido tiene un costo aparte, según la que elijas. El ',
        { slug: 'video-con-drone', texto: 'video con drone' },
        ' y la ',
        { slug: 'video-para-eventos', texto: 'producción de videos para eventos' },
        ' son servicios aparte y se pueden combinar.',
      ],
      secciones: [
        {
          id: 'google-maps',
          etiqueta: 'Google Maps',
          titulo: 'Google Maps',
          bloques: [
            {
              parrafo:
                'Un recorrido no aparece automáticamente en Google. Lo que sí se puede publicar en Google Maps son fotos 360 de tu lugar: te apoyamos con su publicación y, si no tiene costo, va incluida en el servicio.',
            },
          ],
        },
        {
          id: 'para-que-sirve',
          etiqueta: 'Para qué sirve',
          titulo: 'Para qué sirve',
          bloques: [
            {
              lista: [
                'Hoteles y restaurantes',
                'Escuelas y museos',
                'Negocios y oficinas',
                'Inmuebles y espacios que quieres mostrar antes de que te visiten',
              ],
            },
            { parrafo: 'No es solo para casas en venta: sirve para cualquier lugar que quieras mostrar.' },
          ],
        },
        {
          id: 'como-lo-hacemos',
          etiqueta: 'Cómo lo hacemos',
          titulo: 'Cómo lo hacemos',
          bloques: [
            {
              lista: [
                'Planeamos contigo los puntos del recorrido.',
                'Capturamos con drone y, para interiores, con cámara 360 cuando el proyecto lo requiere, y unimos las imágenes.',
                'Cuando el espacio se beneficia de una vista con altura, sumamos tomas aéreas con drone.',
                'De ti necesitamos acceso al lugar en la fecha acordada, de preferencia con buena luz, y que nos indiques qué zonas quieres mostrar.',
              ],
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
                'El tamaño del espacio y el número de puntos de toma',
                'Si es en interiores, exteriores, aéreo o una combinación',
                'Los puntos de información que quieras agregar',
                'Si lo combinas con video o fotografía aérea',
                'El traslado al lugar',
              ],
            },
            { parrafo: 'Con esos datos preparamos tu cotización, con los viáticos desglosados.' },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres sumar video o pantallas a tu proyecto?',
        items: [
          { slug: 'video-con-drone', texto: 'Video y fotografía aérea de tu espacio' },
          { slug: 'video-para-eventos', texto: 'Video de eventos en tu lugar' },
          { slug: 'streaming-para-eventos', texto: 'Transmite lo que pasa en tu lugar' },
          { slug: 'circuito-cerrado-para-eventos', texto: 'Imagen en vivo en pantallas para tus eventos' },
          proyectos,
          condiciones('Qué pagar al inicio y cómo cancelar'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu recorrido',
        texto:
          'Mándanos la fecha, el lugar, el tipo de espacio, su tamaño aproximado y si es interior, exterior o aéreo.',
      },
      cierre: {
        titulo: 'Que tu espacio se pueda visitar antes de llegar',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos el recorrido virtual de tu espacio.',
      },
      faq: [
        {
          pregunta: '¿Se puede hacer con cualquier celular?',
          respuesta: 'No. Un recorrido profesional usa equipo especial y se unen las imágenes para que se vea bien.',
        },
        {
          pregunta: '¿Cuántas fotos se necesitan?',
          respuesta:
            'Depende del tamaño del espacio. Con unas pocas fotos no se cubre todo: se necesitan varios puntos de toma y buena luz.',
        },
        {
          pregunta: '¿Lo puedo poner en mi página web?',
          respuesta: 'Sí, según la plataforma que elijas.',
        },
        {
          pregunta: '¿Una vez hecho, dura para siempre?',
          respuesta:
            'Si tu lugar cambia, como una remodelación o nuevas instalaciones, conviene actualizar el recorrido.',
        },
        {
          pregunta: '¿Es lo mismo que un video con drone?',
          respuesta:
            'No. El video es una grabación que se ve de corrido; el recorrido virtual son fotos enlazadas que la persona recorre a su ritmo.',
        },
      ],
    },
  },

  'paginas-web': {
    descripcion: 'Diseño y desarrollo de páginas web y landing pages para negocios, con dominio y hosting aparte.',
    title: 'Diseño de páginas web en Puebla y Atlixco | Digital X',
    meta: 'Diseño y desarrollo de páginas web y landing pages para negocios en Puebla y Atlixco. Dominio y hosting aparte. Cotiza por WhatsApp.',
    h1: 'Diseño y desarrollo de páginas web en Puebla',
    para: 'Negocios',
    incluye: 'Páginas web y landing pages',
    mensaje: mensajesWhatsApp.paginasWeb,
    serviceType: 'Diseño y desarrollo de páginas web y landing pages',
    pagina: {
      ficha: [
        { etiqueta: 'Tipos', valor: 'Landing page, página informativa o sitio con funciones' },
        { etiqueta: 'Administración', valor: 'Parte administrable básica' },
        { etiqueta: 'Dominio y hosting', valor: 'Aparte y a tu nombre' },
      ],
      descripcion: {
        titulo: 'Tu página web, diseñada y desarrollada para tu negocio',
        parrafos: [
          'En Digital X diseñamos y desarrollamos páginas web y landing pages para negocios, profesionistas y organizaciones en Puebla, Atlixco, Izúcar de Matamoros y alrededores.',
          'Empezamos por entender tu negocio, diseñamos la página, la desarrollamos y la publicamos. Cada proyecto se cotiza según su tamaño y sus funciones: cuéntanos qué necesitas y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'Levantamiento de requerimientos e información de tu negocio',
        'Diseño de la página',
        'Desarrollo de la página, adaptada a celular',
        'Una parte administrable básica para que actualices algunos contenidos',
        'Publicación del sitio',
        'Hasta 3 ajustes pequeños al entregar',
      ],
      incluyeNota: [
        'El dominio y el hosting se contratan aparte y quedan a tu nombre. El logo, los textos y las fotos los entregas tú; si lo prefieres, nosotros los ponemos con un costo aparte. El mantenimiento se cotiza aparte, y los cambios mayores después de la entrega no están incluidos.',
      ],
      secciones: [
        {
          id: 'tipos-de-pagina',
          etiqueta: 'Tipos de página',
          titulo: 'Tipos de página',
          bloques: [
            {
              puntos: [
                {
                  titulo: 'Landing page',
                  texto:
                    'una sola página para presentar un servicio, un evento o una campaña, con botón de WhatsApp o formulario.',
                },
                {
                  titulo: 'Página informativa',
                  texto: 'varias secciones para presentar tu negocio, tus servicios y tus datos de contacto.',
                },
                {
                  titulo: 'Sitio con funciones',
                  texto: 'formularios, secciones especiales o integraciones, según lo que necesites.',
                },
              ],
            },
            {
              parrafo: [
                'Si lo que quieres es vender por internet, mira nuestra página de ',
                { slug: 'tienda-en-linea', texto: 'tienda en línea' },
                '. Si necesitas algo más a la medida, consulta ',
                { slug: 'aplicaciones-moviles', texto: 'aplicaciones móviles' },
                ' y ',
                { slug: 'desarrollo-de-software', texto: 'desarrollo de software' },
                '.',
              ],
            },
          ],
        },
        {
          id: 'posicionamiento',
          etiqueta: 'Posicionamiento',
          titulo: 'Posicionamiento en Google',
          bloques: [
            {
              parrafo:
                'Una página nueva no aparece sola arriba en los resultados de Google. Aparecer bien es un trabajo aparte y continuo, y no lo prometemos como parte del precio de la página. Sí dejamos tu página adaptada a celular y con una estructura clara.',
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
                'El número de secciones o páginas',
                'Las funciones que necesites (formularios, integraciones, secciones especiales)',
                'Si quieres que pongamos el logo, los textos o las fotos',
                'El mantenimiento, si lo contratas',
                'El dominio y el hosting, que van aparte',
              ],
            },
            {
              parrafo: [
                'El pago se hace por etapas, como explican nuestras ',
                { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
                '.',
              ],
            },
          ],
        },
      ],
      tambien: {
        intro: '¿Tu negocio necesita algo más que una página?',
        items: [
          { slug: 'tienda-en-linea', texto: 'Si además quieres vender por internet' },
          { slug: 'aplicaciones-moviles', texto: 'Una aplicación para el celular de tus clientes' },
          { slug: 'desarrollo-de-software', texto: 'Un sistema para los procesos de tu negocio' },
          { slug: 'video-con-drone', texto: 'Fotos y video aéreo de tu negocio para tu página' },
          { slug: 'video-para-eventos', texto: 'Video de tus eventos para mostrar en tu página' },
          proyectos,
          condiciones('Cómo se paga un proyecto por etapas'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu página',
        texto:
          'Cuéntanos a qué se dedica tu negocio, si quieres una landing page o varias secciones y si ya tienes logo, textos, fotos y dominio.',
      },
      cierre: {
        titulo: 'Que tu negocio se vea en internet',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos la página web de tu negocio.',
      },
      faq: [
        {
          pregunta: '¿Cuánto tarda en hacerse?',
          respuesta:
            'Depende de cuántas secciones y funciones lleve, y de qué tan pronto nos entregues la información. El plazo se acuerda al cotizar.',
        },
        {
          pregunta: '¿Pago una sola vez?',
          respuesta: 'No. El dominio y el hosting se renuevan cada año.',
        },
        {
          pregunta: '¿Puedo actualizar mi página yo mismo?',
          respuesta: 'En parte: algunos contenidos los puedes actualizar tú; los demás cambios los hacemos nosotros.',
        },
        {
          pregunta: '¿Puedo cambiarle todo después de la entrega?',
          respuesta: 'No. Los cambios mayores no forman parte del proyecto.',
        },
        {
          pregunta: '¿Qué diferencia hay entre una página web y una tienda en línea?',
          respuesta:
            'Una página web presenta tu negocio, lo que ofreces y cómo contactarte. Una tienda en línea, además, te permite vender tus productos por internet.',
        },
      ],
    },
  },

  'tienda-en-linea': {
    descripcion:
      'Diseño y desarrollo de tiendas en línea para negocios que quieren vender por internet, con dominio y hosting aparte.',
    title: 'Tienda en línea en Puebla y Atlixco | Digital X',
    meta: 'Diseño y desarrollo de tiendas en línea para negocios en Puebla y Atlixco: catálogo, carrito y pagos en línea. Cotiza por WhatsApp.',
    h1: 'Diseño y desarrollo de tiendas en línea en Puebla',
    para: 'Negocios que venden por internet',
    incluye: 'Diseño y desarrollo',
    mensaje: mensajesWhatsApp.tiendaEnLinea,
    serviceType: 'Diseño y desarrollo de tiendas en línea',
    pagina: {
      ficha: [
        { etiqueta: 'Funciones', valor: 'Catálogo, carrito, pagos en línea y pedidos' },
        { etiqueta: 'Administración', valor: 'Tú administras tus productos' },
        { etiqueta: 'Dominio y hosting', valor: 'Van aparte, a tu nombre' },
      ],
      descripcion: {
        titulo: 'Tu tienda en línea, con catálogo, carrito y pagos',
        parrafos: [
          'En Digital X diseñamos y desarrollamos tiendas en línea para negocios que quieren empezar a vender por internet en Puebla, Atlixco, Izúcar de Matamoros y alrededores.',
          'Te acompañamos desde conocer tu negocio y tus productos hasta publicar tu tienda. Cada proyecto se cotiza según el tamaño de tu catálogo y las funciones que necesites: cuéntanos qué vendes y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'Levantamiento de requerimientos: qué vendes, a quién y cómo',
        'Diseño y desarrollo de la tienda, adaptada a celular',
        'Catálogo de productos que tú administras',
        'Carrito de compras',
        'Pagos en línea con la pasarela que elijas',
        'Panel para ver tus pedidos',
        'Opciones de envío o entrega, según lo que necesites',
        'Publicación de la tienda y hasta 3 ajustes pequeños cuando te la entregamos',
      ],
      incluyeNota: [
        'Dominio y hosting van aparte, a tu nombre. Las pasarelas de pago cobran una comisión por cada venta, aparte de nuestro servicio. Si quieres, precargamos tus productos con un costo adicional. El mantenimiento también se cotiza por separado.',
      ],
      secciones: [
        {
          id: 'que-necesitas',
          etiqueta: 'Qué necesitas',
          titulo: 'Qué necesitas para abrir una tienda en línea',
          bloques: [
            {
              lista: [
                'Tus productos con nombre, descripción, precio y fotos',
                'Cómo vas a cobrar y cómo vas a entregar o enviar',
                'Tu logo y los datos de tu negocio',
                'Quién va a atender los pedidos',
              ],
            },
            { parrafo: 'Si todavía no tienes algo de esto, lo vemos contigo al cotizar.' },
          ],
        },
        {
          id: 'tienda-o-pagina',
          etiqueta: 'Tienda o página web',
          titulo: '¿Tienda en línea o página web?',
          bloques: [
            {
              parrafo: [
                'Si quieres presentar tu negocio y recibir mensajes por WhatsApp, puede bastar con una ',
                { slug: 'paginas-web', texto: 'página web' },
                '. Si quieres que tus clientes elijan productos, los paguen y tú recibas el pedido, lo que necesitas es una tienda en línea. Si no estás seguro, cuéntanos tu caso y te recomendamos una.',
              ],
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
                'El número de productos y su variedad',
                'Las funciones que necesites (pagos, envíos, panel de pedidos)',
                'Si quieres que precarguemos tus productos',
                'El mantenimiento de la tienda, si lo contratas',
                'El dominio y el hosting, aparte de la tienda',
              ],
            },
            {
              parrafo: [
                'Como en nuestros otros proyectos de tecnología, el pago es por etapas; los detalles están en las ',
                { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
                '.',
              ],
            },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres complementar tu tienda en línea?',
        items: [
          { slug: 'paginas-web', texto: 'Si primero necesitas presentar tu negocio en internet' },
          { slug: 'aplicaciones-moviles', texto: 'Una aplicación móvil que complemente tu tienda' },
          { slug: 'desarrollo-de-software', texto: 'Un sistema para llevar el control interno de tu negocio' },
          { slug: 'video-con-drone', texto: 'Tomas aéreas de tu local o tus instalaciones para tu tienda' },
          { slug: 'video-para-eventos', texto: 'Video promocional de tus productos o de tu negocio' },
          proyectos,
          condiciones('Cómo se pagan las etapas de tu tienda'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu tienda',
        texto:
          'Cuéntanos qué vendes, cuántos productos tienes aproximadamente y si ya cuentas con fotos, descripciones y dominio.',
      },
      cierre: {
        titulo: 'Que tus productos estén en internet',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos la tienda en línea de tu negocio.',
      },
      faq: [
        {
          pregunta: '¿Puedo administrar mis productos yo mismo?',
          respuesta: 'Sí. Desde tu tienda puedes agregar, editar y quitar productos.',
        },
        {
          pregunta: '¿Con qué medio de pago cobro?',
          respuesta: 'Con la pasarela de pago que tú elijas; nosotros la conectamos a tu tienda.',
        },
        {
          pregunta: '¿Cómo se hacen los envíos?',
          respuesta: 'Depende de tu negocio: configuramos las opciones de envío o de entrega que necesites.',
        },
        {
          pregunta: '¿Cuál es la mejor plataforma para mi tienda?',
          respuesta:
            'Depende de lo que vendas, cuántos productos tengas y cómo quieras administrarla. Te recomendamos la opción adecuada al cotizar.',
        },
        {
          pregunta: '¿Cuánto tarda en estar lista?',
          respuesta:
            'Depende del número de productos, de las funciones y de qué tan pronto nos entregues la información. Lo acordamos al cotizar.',
        },
      ],
    },
  },

  'aplicaciones-moviles': {
    descripcion: 'Aplicaciones móviles a la medida para iPhone y Android: registros, clientes, reservas y catálogos.',
    title: 'Desarrollo de aplicaciones móviles en Puebla | Digital X',
    meta: 'Desarrollo de aplicaciones móviles para iPhone y Android: registros, clientes, reservas y catálogos, en Puebla y Atlixco. Cotiza por WhatsApp.',
    h1: 'Desarrollo de aplicaciones móviles en Puebla',
    para: 'Negocios e instituciones',
    incluye: 'iPhone y Android',
    mensaje: mensajesWhatsApp.aplicacionesMoviles,
    serviceType: 'Desarrollo de aplicaciones móviles a la medida',
    pagina: {
      ficha: [
        { etiqueta: 'Plataformas', valor: 'iPhone y Android' },
        { etiqueta: 'Para', valor: 'Negocios e instituciones' },
        { etiqueta: 'Entrega', valor: 'Implementación y capacitación' },
      ],
      descripcion: {
        titulo: 'Tu aplicación móvil, de la idea a la implementación',
        parrafos: [
          'En Digital X desarrollamos aplicaciones móviles a la medida para negocios en Puebla, Atlixco, Izúcar de Matamoros y alrededores, para iPhone y Android.',
          'Empezamos por entender qué necesitas que haga tu app y quién la va a usar; después la desarrollamos, la implementamos y capacitamos a tu equipo. Cada app se cotiza según lo que necesite hacer: cuéntanos tu idea y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'Levantamiento de requerimientos: qué debe hacer la app y quién la va a usar',
        'Desarrollo de una aplicación multiplataforma, que funciona en iPhone y Android',
        'Implementación',
        'Capacitación para usarla',
        'Publicación en las tiendas de aplicaciones, si lo requieres',
      ],
      incluyeNota: [
        'Las cuentas de desarrollador de las tiendas de aplicaciones tienen costo; cómo se cubre se define en cada proyecto. El mantenimiento y las actualizaciones se cotizan aparte, y la promoción de la app para conseguir descargas no está incluida.',
      ],
      secciones: [
        {
          id: 'tipos-de-aplicaciones',
          etiqueta: 'Tipos de aplicaciones',
          titulo: 'Qué tipo de aplicaciones hacemos',
          bloques: [
            { parrafo: 'Aplicaciones sencillas para tu negocio, como:' },
            {
              lista: [
                'Registros: de visitas, de actividades, de datos o de lo que necesites llevar en orden',
                'Control de clientes',
                'Reservas',
                'Catálogos de productos o servicios',
              ],
            },
            { parrafo: 'Si tu idea es grande, podemos empezar con una versión sencilla y crecerla después.' },
          ],
        },
        {
          id: 'app-o-pagina-web',
          etiqueta: 'App o página web',
          titulo: '¿App o página web?',
          bloques: [
            {
              parrafo: [
                'Una app móvil no es una ',
                { slug: 'paginas-web', texto: 'página web' },
                ' en el celular: es un desarrollo distinto y más costoso. Si lo que buscas es presentar tu negocio o vender por internet, quizá te convenga más una página web o una ',
                { slug: 'tienda-en-linea', texto: 'tienda en línea' },
                '. Cuéntanos tu caso y te decimos qué opción te conviene.',
              ],
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
                'Las pantallas y funciones que necesites',
                'Si necesitas conexión con otros sistemas o con una página web',
                'La publicación en las tiendas de aplicaciones',
                'El mantenimiento de la app, si lo contratas',
                'El traslado, si se requiere una reunión presencial',
              ],
            },
            {
              parrafo: [
                'El pago de una aplicación es por etapas; las ',
                { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
                ' explican cómo funciona.',
              ],
            },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres acompañar tu aplicación con otros servicios?',
        items: [
          { slug: 'paginas-web', texto: 'Si lo que necesitas es presentar tu negocio en una página' },
          { slug: 'tienda-en-linea', texto: 'Una tienda en línea para vender tus productos' },
          {
            slug: 'desarrollo-de-software',
            texto: 'Un sistema para llevar los procesos de tu negocio junto con tu app',
          },
          { slug: 'video-con-drone', texto: 'Video aéreo para presentar tu proyecto' },
          { slug: 'video-para-eventos', texto: 'Un video promocional para presentar tu aplicación' },
          proyectos,
          condiciones('Cómo se pagan las etapas de tu aplicación'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu aplicación',
        texto:
          'Cuéntanos para qué necesitas la app, quiénes la usarían y si ya tienes una página, una app o un sistema.',
      },
      cierre: {
        titulo: 'Que tu idea se convierta en una aplicación',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos la aplicación móvil de tu negocio.',
      },
      faq: [
        {
          pregunta: '¿La gente descargará mi app cuando esté lista?',
          respuesta:
            'No sola. Sin promoción casi nadie encuentra una app nueva, por eso conviene planear cómo vas a darla a conocer.',
        },
        {
          pregunta: '¿Subirla a las tiendas es inmediato?',
          respuesta: 'No. Las tiendas de aplicaciones revisan cada app antes de publicarla y pueden pedir cambios.',
        },
        {
          pregunta: '¿Una vez hecha ya no cuesta más?',
          respuesta: 'Una app necesita actualizaciones cuando cambian los sistemas de los celulares.',
        },
        {
          pregunta: '¿Qué necesito para empezar?',
          respuesta:
            'Una idea clara de qué debe hacer la app y quién la va a usar. Si todavía no la tienes, la definimos contigo.',
        },
        {
          pregunta: '¿Cuánto tarda en estar lista mi app?',
          respuesta: 'Depende de las pantallas y las funciones; te damos el plazo al cotizar.',
        },
      ],
    },
  },

  'desarrollo-de-software': {
    descripcion:
      'Software a la medida para que los procesos de tu negocio funcionen, desde el levantamiento de requerimientos hasta la implementación.',
    title: 'Desarrollo de software a la medida en Puebla | Digital X',
    meta: 'Desarrollo de software a la medida para negocios en Puebla y Atlixco: sistemas para registros, clientes, reservas y catálogos. Cotiza por WhatsApp.',
    h1: 'Desarrollo de software a la medida en Puebla',
    para: 'Negocios con procesos propios',
    incluye: 'Sistemas web',
    mensaje: mensajesWhatsApp.desarrolloDeSoftware,
    serviceType: 'Desarrollo de software a la medida para negocios',
    pagina: {
      ficha: [
        { etiqueta: 'Tipo', valor: 'Sistemas web, desde el navegador' },
        { etiqueta: 'Para', valor: 'Negocios con procesos propios' },
        { etiqueta: 'Entrega', valor: 'Sistema implementado y equipo capacitado' },
      ],
      descripcion: {
        titulo: 'Software hecho para cómo trabaja tu negocio',
        parrafos: [
          'En Digital X desarrollamos software a la medida para negocios en Puebla, Atlixco, Izúcar de Matamoros y alrededores: un sistema hecho para tu forma de trabajar, en lugar de adaptarte a un programa genérico.',
          'Empezamos por entender el proceso que quieres resolver; después lo desarrollamos, lo implementamos y capacitamos a tu equipo. Cada proyecto se cotiza según lo que necesite hacer: cuéntanos qué proceso quieres mejorar y te respondemos con una propuesta.',
        ],
      },
      incluye: [
        'Levantamiento de requerimientos: entender el proceso que quieres resolver',
        'Desarrollo del sistema, de preferencia web, para usarlo desde el navegador',
        'Implementación en tu negocio',
        'Capacitación para tu equipo',
      ],
      incluyeNota: [
        'El hosting o los servidores donde funciona el sistema van aparte, igual que las licencias o servicios de terceros que necesite. El mantenimiento se cotiza por separado, y no se incluyen cambios mayores una vez entregado el sistema.',
      ],
      secciones: [
        {
          id: 'que-es',
          etiqueta: 'Qué es',
          titulo: 'Qué es un software a la medida',
          bloques: [
            {
              parrafo:
                'Es un sistema que se construye para tu negocio. En lugar de usar un programa genérico que no hace exactamente lo que necesitas, desarrollamos una herramienta que se adapta a tus procesos: cómo llevas tus registros, atiendes a tus clientes o administras tu información.',
            },
          ],
        },
        {
          id: 'que-puede-hacer',
          etiqueta: 'Qué puede hacer',
          titulo: 'Qué puede hacer',
          bloques: [
            {
              lista: [
                'Llevar registros ordenados de lo que hoy anotas en papel o en hojas de cálculo',
                'Controlar a tus clientes y su seguimiento',
                'Administrar reservas o citas',
                'Mantener un catálogo de productos o servicios con un panel para administrarlo',
                'Generar reportes sencillos con tu información',
              ],
            },
          ],
        },
        {
          id: 'software-app-o-pagina-web',
          etiqueta: 'Cuál te conviene',
          titulo: '¿Software, app o página web?',
          bloques: [
            {
              puntos: [
                {
                  titulo: [
                    { slug: 'paginas-web', texto: 'Página web' },
                    ' o ',
                    { slug: 'tienda-en-linea', texto: 'tienda en línea' },
                  ],
                  texto: 'Presentan tu negocio o venden tus productos en internet.',
                },
                {
                  titulo: [{ slug: 'aplicaciones-moviles', texto: 'Aplicación móvil' }],
                  texto: 'Se instala en el celular de tus clientes o de tu equipo.',
                },
                {
                  titulo: 'Software a la medida',
                  texto:
                    'Organiza lo que pasa dentro de tu negocio, como los registros, los clientes, las reservas o el catálogo.',
                },
              ],
            },
            { parrafo: '¿Dudas cuál te conviene? Cuéntanos tu caso y te orientamos.' },
          ],
        },
        {
          id: 'precio',
          etiqueta: 'Precio',
          titulo: 'De qué depende el precio',
          bloques: [
            {
              lista: [
                'Las funciones o módulos que necesites',
                'Cuántas personas lo van a usar',
                'Si quieres pasar la información que ya tienes en hojas de cálculo',
                'La conexión con otros sistemas o con tu página web',
                'El hosting y las licencias de terceros',
                'El traslado, si la reunión es presencial',
              ],
            },
            {
              parrafo: [
                'Cada etapa del sistema tiene su pago; los detalles están en las ',
                { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
                '.',
              ],
            },
          ],
        },
      ],
      tambien: {
        intro: '¿Quieres complementar tu software con otros servicios?',
        items: [
          { slug: 'aplicaciones-moviles', texto: 'Si necesitas llevar tu proceso al celular' },
          { slug: 'paginas-web', texto: 'Una página web para dar a conocer tu negocio' },
          { slug: 'tienda-en-linea', texto: 'Un catálogo con carrito y pagos en línea' },
          { slug: 'video-con-drone', texto: 'Tomas aéreas de tus instalaciones para presentar tu negocio' },
          { slug: 'video-para-eventos', texto: 'Un video institucional para presentar tu empresa' },
          proyectos,
          condiciones('Cómo se pagan las etapas de tu sistema'),
        ],
      },
      cotizacion: {
        etiqueta: 'Cotiza tu software',
        texto:
          'Cuéntanos qué proceso quieres resolver, cuántas personas lo usarían y si hoy lo llevas en papel, en hojas de cálculo o en otro sistema.',
      },
      cierre: {
        titulo: 'Platícanos el proceso que quieres resolver',
        texto: 'Escríbenos por WhatsApp o llámanos y cotizamos el software a la medida de tu negocio.',
      },
      faq: [
        {
          pregunta: '¿Mi negocio necesita un software a la medida?',
          respuesta:
            'Si hoy llevas tus registros, clientes o reservas en papel, en hojas de cálculo o en mensajes, y eso te quita tiempo o genera errores, puede ayudarte. Cuéntanos tu caso y te decimos si te conviene o si basta con una página web o una aplicación.',
        },
        {
          pregunta: '¿Pueden pasar al sistema lo que ya tengo en hojas de cálculo?',
          respuesta: 'Sí. Se cotiza como una función más del sistema.',
        },
        {
          pregunta: '¿Quién es dueño del sistema y de mi información?',
          respuesta: [
            'Tu información siempre es tuya. El sistema se entrega en los términos de tu contrato, como explican nuestras ',
            { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
            '.',
          ],
        },
        {
          pregunta: '¿Cuánto tarda en estar listo el sistema?',
          respuesta: 'Depende de las funciones y de qué tan claro esté el proceso; el plazo lo definimos al cotizar.',
        },
        {
          pregunta: '¿Qué necesito para empezar mi sistema?',
          respuesta:
            'Saber qué proceso quieres resolver y quién lo va a usar. Si aún no está claro, lo aterrizamos contigo en la primera sesión.',
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
