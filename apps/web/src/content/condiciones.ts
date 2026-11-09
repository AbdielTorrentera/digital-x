/**
 * Contenido de /condiciones-de-contratacion/. Textos locales, tal cual los dio el dueño; metadatos de
 * docs/reglas-seo-digitalx.md sección 1. Sin porcentajes por etapa, penalizaciones con cifra, IVA, facturación ni
 * reprogramaciones. Las zonas de traslado son dato interno y no se nombran aquí.
 */
import { mensajesWhatsApp, telUrl, waUrl } from '../lib/negocio.ts';
import { lista } from '../lib/servicios.ts';

export const pagina = {
  title: 'Condiciones de contratación | Digital X',
  descripcion:
    'Cómo contratar a Digital X: anticipo, pagos, cancelación, horas extra y viáticos en eventos, y cómo trabajamos los proyectos de tecnología.',
  etiqueta: 'Legal',
  h1: 'Condiciones de contratación',
};

/** Fecha del commit `feat:` de esta página; se cambia cada vez que cambian los textos. */
const actualizacionIso = '2026-11-09';
export const actualizacion = {
  iso: actualizacionIso,
  texto: new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(actualizacionIso)),
};

export const intro =
  'Esta página resume cómo trabajamos, para que conozcas las reglas antes de cotizar. Las condiciones de cada servicio se detallan en el contrato que firmamos contigo.';

/** Un bloque de texto: un párrafo o una lista con viñetas. */
export type Bloque = { parrafo: string } | { lista: string[] };

export interface Subseccion {
  titulo: string;
  bloques: Bloque[];
}

export interface Seccion {
  titulo: string;
  /** Bloques antes de las subsecciones (H3). */
  bloques: Bloque[];
  subsecciones?: Subseccion[];
}

export const secciones: Seccion[] = [
  {
    titulo: 'Cotización',
    bloques: [
      {
        parrafo:
          'Cada servicio se cotiza a la medida. La cotización indica qué incluye el servicio y, cuando aplica, el costo de traslado y viáticos desglosado.',
      },
    ],
  },
  {
    titulo: 'Servicios de audio y video',
    bloques: [{ parrafo: `Aplica a: ${lista.audio}; ${lista.video}.` }],
    subsecciones: [
      {
        titulo: 'Anticipo',
        bloques: [
          {
            parrafo:
              'Para apartar la fecha se pide un anticipo del 50 % del total. Con él reservamos al personal y el equipo para tu servicio.',
          },
        ],
      },
      {
        titulo: 'Pago del resto',
        bloques: [
          {
            parrafo:
              'El 50 % restante se liquida a más tardar 5 días hábiles antes de la fecha del servicio. Si no se liquida a tiempo, no podemos realizar el servicio y se considera una cancelación.',
          },
        ],
      },
      {
        titulo: 'Cancelación',
        bloques: [
          { parrafo: 'Depende de los días naturales que falten para la fecha del servicio:' },
          {
            lista: [
              'Más de 30 días: te devolvemos la mitad de tu anticipo (el 25 % del total) en un plazo de 15 a 30 días hábiles.',
              'De 16 a 30 días: el anticipo no se devuelve, porque tu fecha quedó reservada y dejamos de aceptar otros eventos.',
              '15 días o menos: se cubre el total del servicio, porque el personal y el equipo ya están comprometidos.',
            ],
          },
        ],
      },
      {
        titulo: 'Horas extra',
        bloques: [
          {
            parrafo:
              'Si el servicio se extiende más del horario contratado, cada hora extra tiene un costo del 15 % del costo del servicio.',
          },
        ],
      },
    ],
  },
  {
    titulo: 'Proyectos de tecnología',
    bloques: [{ parrafo: `Aplica a: ${lista.tecnologia}.` }],
    subsecciones: [
      {
        titulo: 'Planeación y diseño',
        bloques: [
          {
            parrafo:
              'Todo proyecto empieza con una etapa de planeación: definimos el alcance y te mostramos cómo se verá tu sitio o aplicación. Esta etapa se paga por adelantado y no es reembolsable, porque recibes el trabajo de planeación y diseño.',
          },
        ],
      },
      {
        titulo: 'Desarrollo por etapas',
        bloques: [
          {
            parrafo:
              'Si apruebas la planeación y contratas el desarrollo, lo que pagaste se descuenta del total. El desarrollo se divide en etapas, cada una con su pago, según tu contrato.',
          },
        ],
      },
      {
        titulo: 'Cancelación',
        bloques: [{ parrafo: 'Si cancelas, las etapas ya pagadas no se reembolsan, incluida la etapa en curso.' }],
      },
      {
        titulo: 'Entregas',
        bloques: [
          {
            parrafo:
              'Te entregamos los archivos y accesos de cada etapa liquidada. Al liquidar el proyecto completo recibes el código, los diseños y los accesos, en los términos de tu contrato.',
          },
        ],
      },
      {
        titulo: 'Si el proyecto se detiene',
        bloques: [
          {
            parrafo:
              'Para avanzar necesitamos tus textos, logos, accesos y comentarios. Si no tenemos respuesta en 15 días naturales, el proyecto se pausa; a los 30 días se cancela. Reactivarlo puede tener un costo adicional, según tu contrato.',
          },
        ],
      },
    ],
  },
  {
    titulo: 'Traslado y viáticos',
    bloques: [
      {
        parrafo:
          'Cuando aplica, el traslado y los viáticos son un costo adicional al servicio; se desglosan y se incluyen en tu cotización.',
      },
    ],
  },
];

/** "¿Tienes dudas?": la frase se parte para poner los enlaces en "WhatsApp" y "llámanos". */
export const dudas = {
  titulo: '¿Tienes dudas?',
  antes: 'Escríbenos por ',
  whatsapp: { texto: 'WhatsApp', href: waUrl(mensajesWhatsApp.general) },
  medio: ' o ',
  llamar: { texto: 'llámanos', href: telUrl },
  despues: ' antes de contratar y te explicamos cualquier punto.',
};
