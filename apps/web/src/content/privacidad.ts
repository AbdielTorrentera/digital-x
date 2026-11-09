/**
 * Contenido de /politica-de-privacidad/. Textos locales, tal cual los dio el dueño; metadatos de
 * docs/reglas-seo-digitalx.md sección 1. Sin nombre del dueño, domicilio, correo, plazos con cifra ni menciones a
 * formularios futuros. Si el sitio agrega formulario, analítica o cookies, esta página se actualiza antes de publicarlos.
 */
import { mensajesWhatsApp, telUrl, waUrl } from '../lib/negocio.ts';
import type { Bloque, Seccion } from './condiciones.ts';

export const pagina = {
  title: 'Política de privacidad | Digital X',
  descripcion:
    'Qué datos personales recibe Digital X cuando nos contactas por WhatsApp o teléfono, para qué los usamos y cómo ejercer tus derechos.',
  etiqueta: 'Legal',
  h1: 'Política de privacidad',
};

/** Fecha del commit `feat:` de esta página; se cambia cada vez que cambian los textos. */
const actualizacionIso = '2026-11-09';
export const actualizacion = {
  iso: actualizacionIso,
  texto: new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(actualizacionIso)),
};

export const intro =
  'En Digital X cuidamos los datos personales que nos compartes. Aquí te explicamos cuáles recibimos, para qué los usamos y cómo puedes ejercer tus derechos.';

const parrafo = (texto: string): Bloque => ({ parrafo: texto });

/** Todas las secciones menos "Tus derechos", que lleva enlaces y va aparte (`derechos`). */
export const secciones: Seccion[] = [
  {
    titulo: 'Responsable',
    bloques: [
      parrafo(
        'Digital X, nombre comercial con el que ofrecemos servicios de audio, video y tecnología en Puebla y sus alrededores, es responsable del tratamiento de los datos personales que nos compartes.',
      ),
    ],
  },
  {
    titulo: 'Qué datos recibimos',
    bloques: [
      parrafo('Cuando nos escribes por WhatsApp o nos llamas, recibimos:'),
      {
        lista: [
          'Tu nombre y tu número de teléfono.',
          'Los datos de tu evento o proyecto: fecha, lugar y servicio que necesitas.',
          'Si pides factura, tus datos fiscales.',
        ],
      },
      parrafo('No te pedimos datos sensibles.'),
    ],
  },
  {
    titulo: 'Para qué los usamos',
    bloques: [
      {
        lista: [
          'Para preparar tu cotización.',
          'Para prestar el servicio que contrataste y darle seguimiento.',
          'Para emitir tu factura y cumplir nuestras obligaciones fiscales.',
        ],
      },
      parrafo('No usamos tus datos para publicidad ni los vendemos.'),
    ],
  },
  {
    titulo: 'Con quién los compartimos',
    bloques: [
      parrafo(
        'Solo con proveedores que participan en tu servicio, con la información necesaria para realizarlo, y con las autoridades cuando la ley lo exige, por ejemplo, al emitir una factura.',
      ),
    ],
  },
  {
    titulo: 'Este sitio web',
    bloques: [
      parrafo(
        'Este sitio no tiene formularios ni te pide datos. Nuestro proveedor de alojamiento registra datos técnicos de las visitas, como la dirección IP, para operar y proteger el sitio. No usamos cookies de publicidad ni de seguimiento. Al tocar los botones de WhatsApp o de llamada, sales de este sitio hacia esas aplicaciones.',
      ),
    ],
  },
];

/** "Tus derechos" va después de las demás secciones; la frase se parte para poner los enlaces en "WhatsApp" y "llámanos". */
export const derechos = {
  titulo: 'Tus derechos',
  antes:
    'Puedes pedirnos acceder a tus datos, corregirlos, eliminarlos u oponerte a su uso, así como retirar tu consentimiento. Escríbenos por ',
  whatsapp: { texto: 'WhatsApp', href: waUrl(mensajesWhatsApp.general) },
  medio: ' o ',
  llamar: { texto: 'llámanos', href: telUrl },
  despues: ' y te responderemos en los plazos que marca la ley.',
};

export const cambios = {
  titulo: 'Cambios a esta política',
  texto: 'Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha de actualización.',
};
