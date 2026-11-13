// Validaciones del Studio que necesitan consultar otros documentos o recorrer el documento completo.
// Las reglas puras viven en `@digitalx/sanity/reglas`; aquí solo se conectan con Sanity.
import type {DocumentRule, SanityDocument, ValidationContext} from 'sanity'
import {hallazgosDeVocabulario, oracionesRepetidas, textosDe} from '@digitalx/sanity/reglas'

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
      documentos.map((d) => [d._id, [...textosDe(d)].map((t) => t.texto)]),
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
    [id]: [...textosDe(actual)].map((t) => t.texto),
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
