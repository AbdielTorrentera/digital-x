// Barrido de vocabulario (identidad §5, SEO §5, estructura §5). Es el mismo que hoy hacen las pruebas de
// `content/servicios.test.mjs` y `categorias.test.mjs`, pero sobre los datos de Sanity: el Studio lo muestra
// como error al capturar y el build lo repite sobre lo que llega (etapa 3).
import {TIPOS_CON_VOCABULARIO} from './constantes.ts'
import {MARCADOR_DESCONOCIDO, MARCADORES} from './marcadores.ts'
import {textosDe, type Ruta, type Texto} from './texto.ts'

export interface ReglaDeVocabulario {
  patron: RegExp
  motivo: string
  /** Frases permitidas que se quitan del texto antes de probar el patrón. */
  quitar?: RegExp
  /** La regla solo se aplica a los textos que cumplan esto (por ejemplo, solo dentro de las preguntas). */
  solo?: (t: Texto) => boolean
  /** La regla no se aplica a los textos que cumplan esto (por ejemplo, la sección que sí puede hablar de Google). */
  excepto?: (t: Texto) => boolean
}

export interface Hallazgo {
  ruta: Ruta
  mensaje: string
}

const PLAZOS = {
  patron: /\d+\s*(d[ií]as|horas|semanas|meses)/i,
  motivo: 'no se publican plazos de entrega',
}
const PRECIOS = {
  patron: /\$|\bMXN\b|\bIVA\b|desde\s+(\$|\d|un precio|el precio|el costo|un costo)/i,
  motivo: 'no se publican precios (decisión del dueño)',
}
const PORCENTAJES = {
  patron: /%|por ciento|anticipo|\d+\s*pagos?/i,
  motivo:
    'no se publican porcentajes ni cifras de pago (el pago es por etapas, según las condiciones)',
}
const SOCIALES = {
  patron: /boda|xv\b|quince|bautizo|fiesta|social/i,
  motivo: 'por ahora no se ofrecen eventos sociales',
}
const SIN_CIFRAS = {patron: /\d/, motivo: 'esta página no lleva cifras'}
const DEMOS = {
  patron: /\bdemos?\b|demostraci|te mostramos|antes de pagar/i,
  motivo: 'no se prometen demos previas',
}
// En Sanity el `id` de una sección es un `slug` ({current}); en los JSON de prueba puede ser un texto.
const idDe = (a: Record<string, unknown>) =>
  typeof a.id === 'string' ? a.id : ((a.id as {current?: string} | undefined)?.current ?? '')
const dentroDeSeccion = (id: RegExp) => (t: Texto) => t.ancestros.some((a) => id.test(idDe(a)))
const dentroDe = (clave: string) => (t: Texto) => t.ruta.includes(clave)

/** Reglas de todo el sitio. */
export const reglasGlobales: ReglaDeVocabulario[] = [
  {
    patron: MARCADOR_DESCONOCIDO,
    motivo: `solo existen estos marcadores: ${MARCADORES.map((m) => `{${m}}`).join(', ')}`,
  },
  {
    patron: /vigilancia/i,
    motivo: 'el circuito cerrado es para eventos: nunca se habla de vigilancia',
  },
  {
    patron: /sistema de seguridad|c[aá]maras de seguridad/i,
    motivo: 'nunca se habla de seguridad ni de cámaras de seguridad',
  },
  {
    patron: /circuito cerrado[\s\S]{0,200}seguridad|seguridad[\s\S]{0,200}circuito cerrado/i,
    motivo: 'el circuito cerrado nunca se junta con seguridad',
  },
  {patron: /proyector/i, motivo: 'no se ofrece proyector y no se menciona'},
  {
    patron:
      /nuestras? pantallas?|tenemos (las |tus )?pantallas|equipo propio|nuestra planta|nuestro internet|tenemos (el |tu |nuestro )?internet/i,
    motivo:
      'las pantallas, la planta de luz y el internet son de proveedores: escribe «coordinamos», no «tenemos» ni «nuestras»',
  },
  {
    patron: /multic[aá]mara|alta definici[oó]n/i,
    motivo: 'di «una o varias cámaras, según tu evento»',
  },
  {patron: /\bdron\b/i, motivo: 'se escribe «drone» (plural «drones»)'},
  {
    patron: /\bapps\b/i,
    motivo: 'el servicio se llama «aplicaciones móviles»; en texto corrido, «app» en singular',
  },
  {patron: /\$\s?\d|\bMXN\b/i, motivo: 'no se publican precios sin que el dueño los confirme'},
]

/**
 * «Circuito cerrado» siempre con «para eventos», «en vivo» o «pantallas» (SEO §5). Se evalúa por texto. Una pregunta
 * (empieza con «¿») solo nombra el servicio y su respuesta lo explica, como ya hacía la prueba de contenido.
 */
export const circuitoCerradoSuelto = (texto: string) =>
  !texto.startsWith('¿') &&
  /circuito cerrado/i.test(texto) &&
  !/para eventos|en vivo|pantallas/i.test(texto)

const reglasDeCategoria: ReglaDeVocabulario[] = [
  {patron: /\bIVA\b|desde \d/i, motivo: 'no se publican precios'},
  {...SIN_CIFRAS, quitar: /360/g, motivo: 'las categorías no llevan cifras (solo «360»)'},
  {
    patron: /a la medida/i,
    excepto: dentroDe('faq'),
    motivo: '«a la medida» en una categoría solo puede ir en sus preguntas frecuentes',
  },
]

const tecnologiaComun: ReglaDeVocabulario[] = [PRECIOS, PORCENTAJES, PLAZOS, DEMOS]

/** Reglas por servicio (clave = slug). */
export const reglasDeServicio: Record<string, ReglaDeVocabulario[]> = {
  'circuito-cerrado-para-eventos': [
    {patron: /grab/i, motivo: 'el circuito cerrado no habla de grabar'},
    {patron: /seguridad|vigilancia/i, motivo: 'nunca seguridad ni vigilancia'},
    {
      patron: /LED|televisor/i,
      solo: dentroDe('faq'),
      motivo: 'LED y televisores solo se explican en su sección, no en las preguntas',
    },
  ],
  'video-para-eventos': [
    SOCIALES,
    PLAZOS,
    {patron: /\$\s?\d|\bMXN\b|desde \d/i, motivo: 'no se publican precios'},
    {
      patron: /sony|canon|nikon|blackmagic|panasonic|dji|gopro|rode|sennheiser|shure/i,
      motivo: 'no se publican marcas de equipo',
    },
  ],
  'streaming-para-eventos': [
    {patron: /mezcla|\bHD\b|4k|full hd/i, motivo: 'no se prometen calidades de imagen'},
    {
      patron: /\b(dos|tres|cuatro|cinco|\d+)\s+c[aá]maras/i,
      motivo: 'no se publica el número de cámaras: «una o varias»',
    },
    {
      patron: /\d+\s*(d[ií]as|horas|semanas|meses|personas|asistentes|mbps|megas)/i,
      motivo: 'no se publican cifras',
    },
    {patron: /\$\s?\d|\bMXN\b|desde \d/i, motivo: 'no se publican precios'},
    {
      patron: /sony|canon|blackmagic|panasonic|obs studio|vmix|restream|streamyard|zoom/i,
      motivo: 'no se publican marcas ni plataformas',
    },
  ],
  'video-con-drone': [
    {
      patron: /permiso|autoriz|certific|registrad|AFAC|aeron[aá]utic|norma(tiva)?\b|cumpl/i,
      motivo: 'sin afirmaciones legales ni la autoridad aeronáutica',
    },
    {
      patron: /\d+\s*(g|gr|gramos|kg|kilos|min|minutos|horas|mah|km|metros|m)\b/i,
      motivo: 'sin pesos, baterías ni distancias',
    },
    {
      patron: /sobre (las |los )?(personas|invitados|asistentes|gente|p[uú]blico)|encima de/i,
      motivo: 'no se dice si se vuela sobre personas',
    },
    {
      patron: /dji|mavic|phantom|inspire|mini ?[234]|autel|parrot|skydio/i,
      motivo: 'no se publican marcas ni modelos',
    },
    SOCIALES,
    {patron: /\$\s?\d|\bMXN\b|desde \d/i, motivo: 'no se publican precios'},
  ],
  'recorridos-virtuales-360': [
    {
      patron: /google/i,
      excepto: dentroDeSeccion(/google/),
      motivo: '«Google» solo puede ir en la sección Google Maps',
    },
    {
      patron:
        /aparece(r[aá])? (el recorrido )?(completo )?en google|se publica(r[aá])? (el recorrido )?completo/i,
      motivo: 'nunca se promete el recorrido completo en Google Maps',
    },
    {
      patron:
        /acreditad|certificad|confianza de google|socio de google|partner|agencia de google|verificad/i,
      motivo: 'sin relación con Google',
    },
    {
      patron:
        /matterport|kuula|street ?view|3dvista|cloudpano|ricoh|theta|insta360|gopro|dji|my360|roundme|panoee|zillow/i,
      motivo: 'no se nombran marcas ni plataformas',
    },
    {
      patron:
        /nuestras? c[aá]maras? 360|c[aá]mara 360 propia|equipo propio|tenemos (una )?c[aá]mara/i,
      motivo: 'no se afirma equipo propio: «con cámara 360 cuando el proyecto lo requiere»',
    },
    PLAZOS,
    {patron: /\$\s?\d|\bMXN\b|desde \d/i, motivo: 'no se publican precios'},
    SOCIALES,
  ],
  'paginas-web': [
    ...tecnologiaComun,
    {
      patron: /google/i,
      excepto: dentroDeSeccion(/posicionamiento/),
      motivo: '«Google» solo puede ir en la sección de posicionamiento',
    },
    {
      patron: /primeros lugares|primer lugar|SEO|garantiz|garant[ií]a/i,
      motivo: 'no se promete posicionamiento en Google',
    },
    {
      ...SIN_CIFRAS,
      quitar: /Hasta 3 ajustes pequeños al entregar/g,
      motivo: 'la única cifra permitida es «Hasta 3 ajustes pequeños al entregar»',
    },
    {
      patron:
        /wordpress|wix|shopify|woocommerce|squarespace|webflow|godaddy|hostinger|elementor|canva|figma|vercel|sanity|astro|react|cloudflare/i,
      motivo: 'no se nombran marcas ni herramientas',
    },
  ],
  'tienda-en-linea': [
    ...tecnologiaComun,
    {
      patron: /google|posicionamiento|SEO|garantiz|garant[ií]a/i,
      motivo: 'no se promete posicionamiento',
    },
    {
      patron: /ventas|vender m[aá]s|aument|increment|resultados/i,
      motivo: 'no se promete vender ni resultados',
    },
    {
      ...SIN_CIFRAS,
      quitar: /hasta 3 ajustes pequeños/gi,
      motivo: 'la única cifra permitida es «hasta 3 ajustes pequeños»',
    },
    {
      patron:
        /shopify|woocommerce|wix|squarespace|prestashop|magento|tiendanube|mercado ?(pago|libre)|paypal|stripe|conekta|openpay|clip\b|oxxo|visa|mastercard|amazon|wordpress|vercel|sanity|astro|react/i,
      motivo: 'no se nombran plataformas ni pasarelas: «la pasarela que elijas»',
    },
    {
      patron: /a la medida|propia|propio|desde cero|open source/i,
      motivo: 'no se dice cómo se construye la tienda (decisión pendiente)',
    },
    {
      patron: /plataforma/i,
      excepto: (t) =>
        t.ancestros.some((a) => typeof a.pregunta === 'string' && /plataforma/i.test(a.pregunta)),
      motivo:
        '«plataforma» solo aparece en la pregunta «¿Cuál es la mejor plataforma para mi tienda?»',
    },
  ],
  'aplicaciones-moviles': [
    ...tecnologiaComun,
    {
      patron: /uber|instagram|apple|google|facebook|tiktok|whatsapp web/i,
      quitar: /Cotiza por WhatsApp/g,
      motivo: 'no se nombran apps ni empresas conocidas',
    },
    {
      patron:
        /swift|kotlin|flutter|react|ionic|xamarin|java\b|javascript|xcode|android studio|firebase|app store|play store|google play|testflight/i,
      motivo: 'no se nombran lenguajes, herramientas ni tiendas: «tiendas de aplicaciones»',
    },
    {
      patron: /pedidos?\b/i,
      motivo:
        '«pedidos» no es ejemplo de aplicación: usa registros, clientes, reservas o catálogos',
    },
    {
      patron: /garantiz|garant[ií]a|aseguramos|conseguir[aá]s|ingresos|ventas|aumenta|resultados/i,
      motivo: 'no se prometen descargas, ventas ni resultados',
    },
    SIN_CIFRAS,
  ],
  'desarrollo-de-software': [
    ...tecnologiaComun,
    {
      patron: /\bERP\b|inteligencia artificial|\bIA\b|\bCRM\b/,
      motivo: 'sin ERP, inteligencia artificial ni CRM empresarial',
    },
    {
      patron:
        /ahorr|garantiz|garant[ií]a|aseguramos|ventas|ingresos|resultados|aumenta|increment|rentabilidad/i,
      motivo: 'no se prometen ahorros, ventas ni resultados',
    },
    {
      patron:
        /\b(sap|odoo|salesforce|excel|microsoft|google|apple|python|php|laravel|django|postgres|mysql|firebase|aws|azure|oracle|java|javascript|react|angular|vue|node|wordpress)\b/i,
      motivo: 'no se nombran lenguajes, herramientas ni marcas',
    },
    SIN_CIFRAS,
  ],
}

/** Textos que un servicio concreto debe incluir (SEO §1, §5 y estructura §5). Cada hallazgo apunta al campo que falta corregir. */
export function faltanTextosObligatorios(slug: string, doc: Record<string, unknown>): Hallazgo[] {
  const faltan: Hallazgo[] = []
  const seo = (doc.seo ?? {}) as Record<string, unknown>
  const dice = (v: unknown, patron: RegExp) => typeof v === 'string' && patron.test(v)
  if (slug === 'renta-de-audio' && (!dice(doc.h1, /audio/i) || !dice(doc.h1, /sonido/i)))
    faltan.push({
      ruta: ['h1'],
      mensaje: 'El H1 debe llevar juntas las palabras «audio» y «sonido».',
    })
  if (slug === 'desarrollo-de-software') {
    const campos: [Ruta, string, unknown][] = [
      [['h1'], 'El H1', doc.h1],
      [['seo', 'title'], 'El título para Google', seo.title],
      [['seo', 'meta'], 'La descripción para Google', seo.meta],
      [['descripcion'], 'La descripción corta', doc.descripcion],
    ]
    for (const [ruta, nombre, valor] of campos)
      if (!dice(valor, /a la medida/i))
        faltan.push({
          ruta,
          mensaje: `${nombre} de Desarrollo de software debe decir «a la medida» (es la búsqueda principal).`,
        })
  }
  return faltan
}

function aplicar(reglas: ReglaDeVocabulario[], t: Texto, hallazgos: Hallazgo[]) {
  for (const r of reglas) {
    if (r.solo && !r.solo(t)) continue
    if (r.excepto?.(t)) continue
    const texto = r.quitar ? t.texto.replace(r.quitar, '') : t.texto
    const coincidencia = texto.match(r.patron)
    if (coincidencia)
      hallazgos.push({ruta: t.ruta, mensaje: `«${coincidencia[0].trim()}»: ${r.motivo}.`})
  }
}

/** Todo lo que el vocabulario rechaza en un documento. Vacío = limpio. */
export function hallazgosDeVocabulario(doc: Record<string, unknown>): Hallazgo[] {
  const tipo = typeof doc._type === 'string' ? doc._type : ''
  if (!TIPOS_CON_VOCABULARIO.includes(tipo)) return []
  const slug = (doc.slug as {current?: string} | undefined)?.current ?? ''
  const hallazgos: Hallazgo[] = []
  const extra =
    tipo === 'servicio'
      ? (reglasDeServicio[slug] ?? [])
      : tipo === 'categoria'
        ? reglasDeCategoria
        : []
  for (const t of textosDe(doc)) {
    if (!t.texto.trim()) continue
    aplicar(reglasGlobales, t, hallazgos)
    // El texto alternativo describe la foto tal cual: solo se le aplican las reglas de todo el sitio.
    if (t.ruta.at(-1) !== 'alt') aplicar(extra, t, hallazgos)
    if (circuitoCerradoSuelto(t.texto))
      hallazgos.push({
        ruta: t.ruta,
        mensaje: '«circuito cerrado» siempre va con «para eventos», «en vivo» o «pantallas».',
      })
  }
  if (tipo === 'servicio') hallazgos.push(...faltanTextosObligatorios(slug, doc))
  return hallazgos
}
