// Validación del contenido que baja el build (apps/web/scripts/descargar-contenido.ts). Es la misma lista de reglas que
// aplica el Studio al capturar: todo lo que aquí es ERROR es también error del Studio (bloquea «Publicar»), y lo que es
// AVISO aquí es aviso en el Studio. Las únicas excepciones son tres guardas que solo fallan en producción: foto
// temporal, proyecto de ejemplo y enlace a una página fija que aún no existe (esta última la revisa el build sobre el
// HTML, `astro.config.mjs`).
import {MAX_ALT, MIN_ALT, TIPOS_CON_VOCABULARIO} from './constantes.ts'
import {urlDeRedValida, esHttps} from './enlaces.ts'
import {problemaDePermiso} from './permiso.ts'
import {problemasDeMeta, problemasDeTitle} from './seo.ts'
import {faltantesDePagina} from './servicios.ts'
import {problemasDeSlug} from './slugs.ts'
import {oracionesRepetidas, textosDe, type Ruta} from './texto.ts'
import {hallazgosDeVocabulario} from './vocabulario.ts'

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
  avisos: string[]
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

const TIPOS_CON_SEO_OBLIGATORIO = ['inicio', 'nosotros', 'categoria', 'servicio']

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

export function validarContenido(
  {documentos, assets}: Instantanea,
  {produccion}: {produccion: boolean},
): Resultado {
  const errores: string[] = []
  const avisos: string[] = []
  const error = (doc: Documento, mensaje: string) =>
    errores.push(`${doc._id} (${doc._type}): ${mensaje}`)
  const ids = new Set(documentos.map((d) => d._id))
  const publicados = (tipo: string) => documentos.filter((d) => d._type === tipo)

  // 1) Documentos únicos y categorías
  for (const tipo of ['configuracion', 'inicio', 'nosotros'])
    if (!documentos.some((d) => d._id === tipo && d._type === tipo))
      errores.push(`Falta el documento publicado «${NOMBRES[tipo]}» en Sanity.`)
  if (publicados('categoria').length === 0) errores.push('No hay ninguna categoría publicada.')

  // 2) Campos obligatorios, vocabulario, referencias, permisos
  for (const doc of documentos) {
    for (const campo of OBLIGATORIOS[doc._type] ?? [])
      if (vacio(doc[campo])) error(doc, `falta ${campo}`)

    if (TIPOS_CON_VOCABULARIO.includes(doc._type))
      for (const h of hallazgosDeVocabulario(doc))
        error(doc, `${h.mensaje} (${rutaATexto(h.ruta)})`)

    const permiso = problemaDePermiso(
      doc as {permiso?: boolean; esEjemplo?: boolean; _type?: string},
    )
    if (['resena', 'cliente', 'proyecto'].includes(doc._type) && permiso)
      error(doc, 'está publicado sin permiso: no se debe publicar')

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

  // 3) Slugs
  for (const doc of documentos) {
    if (doc._type !== 'servicio' && doc._type !== 'categoria') continue
    const slug = (doc.slug as {current?: string} | undefined)?.current
    for (const problema of problemasDeSlug(slug, {reservados: doc._type === 'categoria'}))
      error(doc, problema)
    if (
      doc._type === 'servicio' &&
      typeof doc.nombre === 'string' &&
      /a la medida/i.test(doc.nombre)
    )
      error(doc, 'el nombre de un servicio nunca lleva «a la medida»')
  }

  // 4) SEO: límites y que no se repitan
  const titles = new Map<string, string[]>()
  const metas = new Map<string, string[]>()
  for (const doc of documentos) {
    const seo = doc.seo as {title?: string; meta?: string} | undefined
    const exigeMeta =
      TIPOS_CON_SEO_OBLIGATORIO.includes(doc._type) ||
      (['proyecto', 'articulo'].includes(doc._type) && doc.esEjemplo !== true)
    if (!seo?.title && TIPOS_CON_SEO_OBLIGATORIO.includes(doc._type))
      error(doc, 'falta el título para Google')
    if (!seo?.meta && exigeMeta) error(doc, 'falta la descripción para Google')
    if (seo?.title) {
      for (const p of problemasDeTitle(seo.title)) error(doc, `título para Google: ${p}`)
      titles.set(seo.title, [...(titles.get(seo.title) ?? []), doc._id])
    }
    if (seo?.meta) {
      for (const p of problemasDeMeta(
        seo.meta,
        doc._type === 'servicio' || doc._type === 'categoria',
      ))
        error(doc, `descripción para Google: ${p}`)
      metas.set(seo.meta, [...(metas.get(seo.meta) ?? []), doc._id])
    }
  }
  for (const [mapa, nombre] of [
    [titles, 'título'],
    [metas, 'descripción'],
  ] as const)
    for (const [, donde] of mapa)
      if (donde.length > 1)
        errores.push(`La ${nombre} para Google está repetida en: ${donde.join(', ')}.`)

  // 5) Servicios con página construida
  for (const doc of publicados('servicio'))
    if (doc.paginaConstruida === true)
      for (const falta of faltantesDePagina(doc as Parameters<typeof faltantesDePagina>[0]))
        error(doc, `su página está construida pero falta ${falta}`)

  // 6) Configuración
  const config = documentos.find((d) => d._id === 'configuracion')
  if (config) {
    if (typeof config.telefono === 'string' && !/^\+52\d{10}$/.test(config.telefono))
      error(config, 'el teléfono debe ser +52 y 10 dígitos')
    if (typeof config.whatsapp === 'string' && !/^52\d{10}$/.test(config.whatsapp))
      error(config, 'el WhatsApp debe ser 52 y 10 dígitos')
    if (typeof config.fundacion === 'string' && !/^\d{4}$/.test(config.fundacion))
      error(config, 'el año de fundación debe tener 4 dígitos')
    const zonas = Array.isArray(config.zonas) ? config.zonas : []
    if (zonas.length < 1 || zonas.length > 6 || new Set(zonas).size !== zonas.length)
      error(config, 'las zonas deben ser de 1 a 6 y sin repetirse')
    const redes = Array.isArray(config.redes)
      ? (config.redes as {red?: string; url?: string; activa?: boolean}[])
      : []
    if (new Set(redes.map((r) => r.red)).size !== redes.length)
      error(config, 'hay una red repetida')
    for (const r of redes) {
      if (r.activa && !r.url) error(config, `la red ${r.red} está activa pero no tiene dirección`)
      if (r.url && !urlDeRedValida(r.red ?? '', r.url))
        error(config, `la dirección de ${r.red} no es válida`)
    }
    if (typeof config.enlaceResena === 'string' && !esHttps(config.enlaceResena))
      error(config, 'el enlace de reseñas debe empezar con https://')
  }

  // 7) Fotos: texto alternativo y archivo existente
  let temporales = 0
  for (const doc of documentos)
    for (const [objeto, ruta] of objetosConRuta(doc)) {
      if (objeto._type !== 'foto') continue
      const donde = rutaATexto(ruta)
      const asset = objeto.asset as {_ref?: string} | undefined
      if (!asset?._ref || !assets[asset._ref]) {
        error(doc, `la foto «${donde}» no tiene su archivo en Sanity`)
        continue
      }
      if (objeto.decorativa !== true) {
        const largo = typeof objeto.alt === 'string' ? objeto.alt.trim().length : 0
        if (largo < MIN_ALT || largo > MAX_ALT)
          error(
            doc,
            `la foto «${donde}» no tiene texto alternativo de ${MIN_ALT} a ${MAX_ALT} caracteres (ni es decorativa)`,
          )
      }
      if (objeto.temporal === true) {
        temporales += 1
        if (produccion)
          error(
            doc,
            `la foto «${donde}» es temporal: bloquea la publicación en producción hasta cambiarla por la real`,
          )
      }
    }

  // 8) Proyectos de ejemplo: bloquean producción
  const ejemplos = publicados('proyecto').filter((d) => d.esEjemplo === true)
  if (produccion)
    for (const doc of ejemplos)
      error(
        doc,
        'es un proyecto de ejemplo: bloquea la publicación en producción hasta cambiarlo por uno real',
      )
  if (!produccion && (temporales > 0 || ejemplos.length > 0))
    avisos.push(
      `${temporales} fotos temporales y ${ejemplos.length} proyectos de ejemplo: no se puede publicar en producción mientras existan.`,
    )

  // 9) Marcadores del Inicio: cada {servicios-X} necesita una categoría X con servicios
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

  // 10) Avisos: oraciones repetidas entre páginas (no fallan; en el Studio también son aviso)
  const textosPorDoc = Object.fromEntries(
    documentos
      .filter((d) => ['servicio', 'categoria', 'inicio', 'nosotros'].includes(d._type))
      .map((d) => [
        d._id,
        [...textosDe(d)].filter((t) => t.ruta.at(-1) !== 'alt').map((t) => t.texto),
      ]),
  )
  for (const r of oracionesRepetidas(textosPorDoc))
    avisos.push(`Oración repetida en ${r.documentos.join(' y ')}: «${r.oracion.slice(0, 70)}…»`)

  return {errores, avisos}
}
