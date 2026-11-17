// Validación técnica del contenido que baja el build (apps/web/scripts/descargar-contenido.ts): solo lo que el sitio
// necesita para construirse. Las reglas de redacción de docs/ son guía para quien escribe y no se validan aquí. Lo que
// es ERROR aquí también lo es en el Studio (bloquea «Publicar»).
import {esHttps} from './enlaces.ts'
import {marcadoresDesconocidos} from './marcadores.ts'
import {faltantesDePagina} from './servicios.ts'
import {problemasDeSlug} from './slugs.ts'
import {textosDe, type Ruta} from './texto.ts'

export type Documento = {_id: string; _type: string; [campo: string]: unknown}

export interface Asset {
  url: string
  extension: string
  width: number
  height: number
  originalFilename?: string
}

export interface Instantanea {
  documentos: Documento[]
  assets: Record<string, Asset>
}

export interface Resultado {
  errores: string[]
}

const esObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const vacio = (v: unknown) =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)

const rutaATexto = (ruta: Ruta) =>
  ruta
    .map((s) => (typeof s === 'string' ? s : typeof s === 'number' ? `[${s}]` : '[…]'))
    .join('.')
    .replace(/\.\[/g, '[')

const NOMBRES: Record<string, string> = {
  configuracion: 'Configuración del sitio',
  inicio: 'Inicio',
  nosotros: 'Nosotros',
}

/** Lo que el sitio no puede dibujar sin él. En el Studio estos campos son obligatorios (`Rule.required()`). */
const OBLIGATORIOS: Record<string, string[]> = {
  configuracion: [
    'telefono',
    'whatsapp',
    'fundacion',
    'mensajeWhatsAppGeneral',
    'zonas',
    'fotoCierre',
  ],
  inicio: [
    'h1',
    'queHacemos',
    'servicios',
    'proyectos',
    'porQue',
    'cobertura',
    'preguntas',
    'cierre',
    'fotoPortada',
    'fotoQueHacemos',
    'fotoPorQue',
    'seo',
  ],
  nosotros: [
    'etiqueta',
    'h1',
    'historia',
    'distingue',
    'manifiesto',
    'proyectos',
    'preguntas',
    'cierre',
    'foto',
    'fotoDistingue',
    'fotoManifiesto',
    'fotoProyectos',
    'fotoCierre',
    'seo',
  ],
  // La «Página de proyectos» es opcional (sin ella no hay /proyectos/); si está publicada, debe traer todo lo que dibuja.
  proyecto: ['titulo', 'slug', 'resumen', 'municipio', 'servicios', 'fotos'],
  paginaProyectos: ['etiqueta', 'h1', 'intro', 'foto', 'cierre', 'seo'],
  categoria: [
    'etiqueta',
    'slug',
    'orden',
    'titulo',
    'para',
    'h1',
    'intro',
    'cierre',
    'foto',
    'seo',
  ],
  servicio: [
    'nombre',
    'slug',
    'categoria',
    'orden',
    'descripcion',
    'h1',
    'mensajeWhatsApp',
    'seo',
    'foto',
  ],
}

const TIPOS_CON_SEO_OBLIGATORIO = ['inicio', 'nosotros', 'paginaProyectos', 'categoria', 'servicio']

function* objetosConRuta(
  valor: unknown,
  ruta: Ruta = [],
): Generator<[Record<string, unknown>, Ruta]> {
  if (Array.isArray(valor))
    for (const [i, v] of valor.entries()) yield* objetosConRuta(v, [...ruta, i])
  else if (esObjeto(valor)) {
    yield [valor, ruta]
    for (const [k, v] of Object.entries(valor)) yield* objetosConRuta(v, [...ruta, k])
  }
}

function* objetosDe(valor: unknown): Generator<Record<string, unknown>> {
  if (Array.isArray(valor)) for (const v of valor) yield* objetosDe(v)
  else if (esObjeto(valor)) {
    yield valor
    for (const v of Object.values(valor)) yield* objetosDe(v)
  }
}

export function validarContenido({documentos, assets}: Instantanea): Resultado {
  const errores: string[] = []
  const error = (doc: Documento, mensaje: string) =>
    errores.push(`${doc._id} (${doc._type}): ${mensaje}`)
  const ids = new Set(documentos.map((d) => d._id))
  const publicados = (tipo: string) => documentos.filter((d) => d._type === tipo)

  // 1) Documentos fijos
  for (const tipo of ['configuracion', 'inicio', 'nosotros'])
    if (!documentos.some((d) => d._id === tipo && d._type === tipo))
      errores.push(`Falta el documento publicado «${NOMBRES[tipo]}» en Sanity.`)

  // 2) Campos que la página necesita, título y descripción para Google (solo que existan), marcadores y referencias
  for (const doc of documentos) {
    for (const campo of OBLIGATORIOS[doc._type] ?? [])
      if (vacio(doc[campo])) error(doc, `falta ${campo}`)

    if (TIPOS_CON_SEO_OBLIGATORIO.includes(doc._type)) {
      const seo = doc.seo as {title?: string; meta?: string} | undefined
      if (!seo?.title) error(doc, 'falta el título para Google')
      if (!seo?.meta) error(doc, 'falta la descripción para Google')
    }

    if (doc._type !== 'resena')
      for (const {ruta, marcador} of marcadoresDesconocidos(doc))
        error(doc, `«${marcador}» no es un marcador conocido (${rutaATexto(ruta)})`)

    for (const objeto of objetosDe(doc)) {
      // Referencias fuertes: deben existir. Las débiles (clientes, proyecto de una reseña) se omiten sin fallar.
      if (
        objeto._type === 'reference' &&
        typeof objeto._ref === 'string' &&
        objeto._weak !== true &&
        !objeto._ref.startsWith('image-') &&
        !ids.has(objeto._ref)
      )
        error(doc, `apunta a ${objeto._ref}, que no está publicado`)
    }
  }

  // 3) Slugs. Los de un proyecto son direcciones (/proyectos/{slug}/): no pueden repetirse entre proyectos.
  const slugsDeProyectos = new Map<string, number>()
  for (const doc of publicados('proyecto')) {
    const slug = (doc.slug as {current?: string} | undefined)?.current
    if (slug) slugsDeProyectos.set(slug, (slugsDeProyectos.get(slug) ?? 0) + 1)
  }
  for (const doc of documentos) {
    if (doc._type !== 'servicio' && doc._type !== 'categoria' && doc._type !== 'proyecto') continue
    const slug = (doc.slug as {current?: string} | undefined)?.current
    for (const problema of problemasDeSlug(slug, {reservados: doc._type === 'categoria'}))
      error(doc, problema)
    if (doc._type === 'proyecto' && slug && (slugsDeProyectos.get(slug) ?? 0) > 1)
      error(doc, `la dirección «${slug}» la usa otro proyecto. Elige otra.`)
  }

  // 4) Servicios con página construida
  for (const doc of publicados('servicio'))
    if (doc.paginaConstruida === true)
      for (const falta of faltantesDePagina(doc as Parameters<typeof faltantesDePagina>[0]))
        error(doc, `su página está construida pero falta ${falta}`)

  // 5) Configuración
  const config = documentos.find((d) => d._id === 'configuracion')
  if (config) {
    if (typeof config.telefono === 'string' && !/^\+52\d{10}$/.test(config.telefono))
      error(config, 'el teléfono debe ser +52 y 10 dígitos')
    if (typeof config.whatsapp === 'string' && !/^52\d{10}$/.test(config.whatsapp))
      error(config, 'el WhatsApp debe ser 52 y 10 dígitos')
    if (typeof config.fundacion === 'string' && !/^\d{4}$/.test(config.fundacion))
      error(config, 'el año de fundación debe tener 4 dígitos')
    if (!Array.isArray(config.zonas) || config.zonas.length < 1)
      error(config, 'debe haber al menos una zona')
    const redes = Array.isArray(config.redes)
      ? (config.redes as {red?: string; url?: string; activa?: boolean}[])
      : []
    for (const r of redes) {
      if (r.activa && !r.url) error(config, `la red ${r.red} está activa pero no tiene dirección`)
      if (r.url && !esHttps(r.url))
        error(config, `la dirección de ${r.red} debe empezar con https://`)
    }
    if (typeof config.enlaceResena === 'string' && !esHttps(config.enlaceResena))
      error(config, 'el enlace de reseñas debe empezar con https://')
  }

  // 6) Fotos: cada una con su archivo en Sanity
  for (const doc of documentos)
    for (const [objeto, ruta] of objetosConRuta(doc)) {
      if (objeto._type !== 'foto') continue
      const asset = objeto.asset as {_ref?: string} | undefined
      if (!asset?._ref || !assets[asset._ref])
        error(doc, `la foto «${rutaATexto(ruta)}» no tiene su archivo en Sanity`)
    }

  // 7) Marcadores del Inicio: cada {servicios-X} necesita una categoría X con servicios
  const inicio = documentos.find((d) => d._id === 'inicio')
  if (inicio) {
    const textos = [...textosDe(inicio)].map((t) => t.texto).join('\n')
    for (const [, categoria] of textos.matchAll(/\{servicios-([a-z0-9-]+)\}/g)) {
      const cat = publicados('categoria').find(
        (c) => (c.slug as {current?: string})?.current === categoria,
      )
      const servicios = publicados('servicio').filter(
        (s) => (s.categoria as {_ref?: string})?._ref === cat?._id,
      )
      const sinPagina = Array.isArray(cat?.sinPagina) ? cat.sinPagina : []
      if (!cat || servicios.length + sinPagina.length === 0)
        error(
          inicio,
          `el marcador {servicios-${categoria}} no tiene servicios publicados en esa categoría`,
        )
    }
    if (textos.includes('{zonas}') && !(Array.isArray(config?.zonas) && config.zonas.length > 0))
      error(inicio, 'el marcador {zonas} no tiene lugares en la configuración')
  }

  return {errores}
}
