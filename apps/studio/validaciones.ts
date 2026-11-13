// Validaciones del Studio que necesitan consultar otros documentos o recorrer el documento completo.
// Las reglas puras viven en `@digitalx/sanity/reglas`; aquí solo se conectan con Sanity.
import type {DocumentRule, SanityDocument, ValidationContext} from 'sanity'
import {
  categoriasDeMarcadores,
  hallazgosDeVocabulario,
  oracionesRepetidas,
  PAGINAS_FIJAS_SIN_CONSTRUIR,
  textosDe,
} from '@digitalx/sanity/reglas'

const API_VERSION = '2025-01-01'

const idPublicado = (id = '') => id.replace(/^drafts\./, '')

/** El título SEO y la meta no se repiten en ninguna otra página (SEO §1). `campo` es una constante del código. */
export async function textoSeoUnico(
  campo: 'seo.title' | 'seo.meta',
  valor: string,
  contexto: ValidationContext,
) {
  const id = idPublicado(contexto.document?._id)
  const otros = await contexto
    .getClient({apiVersion: API_VERSION})
    .fetch<number>(
      `count(*[defined(${campo}) && ${campo} == $valor && !(_id in [$publicado, $borrador])])`,
      {
        valor,
        publicado: id,
        borrador: `drafts.${id}`,
      },
    )
  return otros === 0
}

/** Barrido de vocabulario sobre todo el documento: cada hallazgo marca el campo donde está. */
export function vocabularioDelDocumento(documento: unknown) {
  if (!documento) return true
  const hallazgos = hallazgosDeVocabulario(documento as Record<string, unknown>)
  if (!hallazgos.length) return true
  return hallazgos.map(({ruta, mensaje}) => ({message: mensaje, paths: [ruta]}))
}

/** El vocabulario bloquea «Publicar» (error); las oraciones repetidas solo avisan. */
export const vocabulario = (Rule: DocumentRule) => Rule.custom(vocabularioDelDocumento).error()

// El texto alternativo de una misma foto se repite en varias páginas y es correcto.
const sinAlt = (t: {ruta: unknown[]}) => t.ruta.at(-1) !== 'alt'

const TIPOS_QUE_NO_SE_REPITEN = ['servicio', 'categoria', 'inicio', 'nosotros']
let cache: {momento: number; documentos: Record<string, string[]>} | null = null

async function textosPublicados(contexto: ValidationContext) {
  if (cache && Date.now() - cache.momento < 20_000) return cache.documentos
  const documentos = await contexto
    .getClient({apiVersion: API_VERSION})
    .fetch<SanityDocument[]>(`*[_type in $tipos && !(_id in path("drafts.**"))]`, {
      tipos: TIPOS_QUE_NO_SE_REPITEN,
    })
  cache = {
    momento: Date.now(),
    documentos: Object.fromEntries(
      documentos.map((d) => [d._id, [...textosDe(d)].filter(sinAlt).map((t) => t.texto)]),
    ),
  }
  return cache.documentos
}

/** Aviso: oraciones (7 palabras o más) que ya están en otra página (SEO §5: ningún bloque se repite entre páginas). */
export async function avisoDeOracionesRepetidas(documento: unknown, contexto: ValidationContext) {
  const actual = documento as SanityDocument | undefined
  if (!actual || !TIPOS_QUE_NO_SE_REPITEN.includes(actual._type)) return true
  const id = idPublicado(actual._id)
  const otros = await textosPublicados(contexto)
  const repetidas = oracionesRepetidas({
    ...Object.fromEntries(Object.entries(otros).filter(([otroId]) => otroId !== id)),
    [id]: [...textosDe(actual)].filter(sinAlt).map((t) => t.texto),
  }).filter((r) => r.documentos.includes(id))
  if (!repetidas.length) return true
  return `Estas oraciones ya están en otra página (el contenido repetido daña el SEO): ${repetidas
    .slice(0, 3)
    .map((r) => `«${r.oracion.slice(0, 60)}…»`)
    .join(', ')}`
}

/** Un artículo debe enlazar al menos un servicio que ya tenga su página publicada (estructura §4). */
export async function algunServicioConPagina(
  servicios: {_ref?: string}[] | undefined,
  contexto: ValidationContext,
) {
  const ids = (servicios ?? []).map((s) => s._ref).filter(Boolean)
  if (!ids.length) return true
  const conPagina = await contexto
    .getClient({apiVersion: API_VERSION})
    .fetch<number>(`count(*[_id in $ids && paginaConstruida == true])`, {ids})
  return (
    conPagina > 0 ||
    'Ninguno de estos servicios tiene su página construida todavía: elige al menos uno que sí.'
  )
}

/** Validación de las páginas con texto propio: vocabulario (error) y oraciones repetidas (aviso). */
export const validacionDePagina = (Rule: DocumentRule) => [
  vocabulario(Rule),
  Rule.custom(avisoDeOracionesRepetidas).warning(),
]

/** Aviso: la página enlazada todavía no existe (hoy lleva a la 404; el build de producción no la acepta). */
export const avisoDePaginaSinConstruir = (ruta?: string) =>
  ruta && PAGINAS_FIJAS_SIN_CONSTRUIR.includes(ruta)
    ? `La página ${ruta} todavía no existe: el enlace funcionará cuando se publique. Mientras tanto, el sitio no se puede publicar en producción con este enlace.`
    : true

/** Cuántos servicios publicados (más los que no tienen página) tiene una categoría, por su slug. */
export async function serviciosDeCategoria(
  slug: string,
  cliente: {fetch: <T>(q: string, p: object) => Promise<T>},
) {
  const [servicios, sinPagina] = await Promise.all([
    cliente.fetch<number>(
      'count(*[_type == "servicio" && !(_id in path("drafts.**")) && categoria->slug.current == $slug])',
      {slug},
    ),
    cliente.fetch<number>(
      'count(*[_type == "categoria" && !(_id in path("drafts.**")) && slug.current == $slug][0].sinPagina)',
      {slug},
    ),
  ])
  return {servicios, sinPagina: sinPagina ?? 0}
}

/** El Inicio solo puede usar {servicios-X} si esa categoría tiene servicios publicados (si no, el build se detendría). */
export async function marcadoresConDatos(documento: unknown, contexto: ValidationContext) {
  const textos = [...textosDe(documento)].map((t) => t.texto)
  const cliente = contexto.getClient({apiVersion: API_VERSION})
  const sinDatos: string[] = []
  for (const categoria of categoriasDeMarcadores(textos)) {
    const {servicios, sinPagina} = await serviciosDeCategoria(categoria, cliente)
    if (servicios + sinPagina === 0) sinDatos.push(`{servicios-${categoria}}`)
  }
  return sinDatos.length
    ? `El Inicio usa ${sinDatos.join(', ')}, pero esa categoría no tiene servicios publicados. Quita el marcador o publica un servicio.`
    : true
}

/** El Inicio: lo de cualquier página y, además, que sus marcadores tengan datos (error, igual que en el build). */
export const validacionDeInicio = (Rule: DocumentRule) => [
  ...validacionDePagina(Rule),
  Rule.custom(marcadoresConDatos).error(),
]
