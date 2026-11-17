// Validaciones del Studio que necesitan consultar otros documentos o recorrer el documento completo.
// Las reglas puras viven en `@digitalx/sanity/reglas`; aquí solo se conectan con Sanity. Solo hay reglas técnicas: las
// de redacción (docs/) son guía para quien escribe y no se validan.
import type {DocumentRule, ValidationContext} from 'sanity'
import {categoriasDeMarcadores, marcadoresDesconocidos, textosDe} from '@digitalx/sanity/reglas'

const API_VERSION = '2025-01-01'

/** Un `{algo}` que no es un marcador conocido se mostraría tal cual en el sitio: error. */
export function marcadoresConocidos(documento: unknown) {
  if (!documento) return true
  const desconocidos = marcadoresDesconocidos(documento)
  if (!desconocidos.length) return true
  return desconocidos.map(({ruta, marcador}) => ({
    message: `«${marcador}» no es un marcador conocido.`,
    paths: [ruta],
  }))
}

type Cliente = {fetch: <T>(q: string, p: object) => Promise<T>}

/**
 * ¿Existe hoy la sección de proyectos? Solo con al menos un proyecto publicado Y la «Página de proyectos» publicada (lo
 * mismo que exige el sitio: `hayProyectos` en `apps/web/src/lib/contenido/proyectos.ts`).
 */
export async function haySeccionDeProyectos(cliente: Cliente) {
  const {proyectos, pagina} = await cliente.fetch<{proyectos: number; pagina: number}>(
    '{"proyectos": count(*[_type == "proyecto" && !(_id in path("drafts.**"))]), "pagina": count(*[_id == "paginaProyectos"])}',
    {},
  )
  return {proyectos, pagina, existe: proyectos > 0 && pagina > 0}
}

/**
 * Aviso: un enlace a /proyectos/ solo se dibuja si la sección existe (con proyectos publicados y la «Página de proyectos»
 * publicada); si no, el sitio lo muestra como texto sin enlace. No bloquea nada.
 */
export const avisoDePaginaSinConstruir = async (
  ruta: string | undefined,
  contexto: ValidationContext,
) => {
  if (ruta !== '/proyectos/') return true
  const {existe} = await haySeccionDeProyectos(contexto.getClient({apiVersion: API_VERSION}))
  return existe
    ? true
    : 'Todavía no hay proyectos publicados, o falta publicar la «Página de proyectos»: mientras tanto el sitio muestra este enlace como texto, sin enlace.'
}

/** Aviso en un proyecto: sin la «Página de proyectos» publicada, el sitio no muestra ningún proyecto con su página. */
export const avisoDeProyectoSinPagina = async (_valor: unknown, contexto: ValidationContext) => {
  const {pagina} = await haySeccionDeProyectos(contexto.getClient({apiVersion: API_VERSION}))
  return pagina > 0
    ? true
    : 'Falta publicar la «Página de proyectos» (en Páginas): mientras no esté publicada, el sitio no muestra /proyectos/ ni la página de este proyecto.'
}

/** Cuántos servicios publicados (más los que no tienen página) tiene una categoría, por su slug. */
export async function serviciosDeCategoria(slug: string, cliente: Cliente) {
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

/** Validación de un documento con textos que llevan marcadores: ninguno desconocido (error). */
export const validacionDePagina = (Rule: DocumentRule) => [Rule.custom(marcadoresConocidos).error()]

/** El Inicio: marcadores conocidos y, además, que sus marcadores tengan datos (error, igual que en el build). */
export const validacionDeInicio = (Rule: DocumentRule) => [
  ...validacionDePagina(Rule),
  Rule.custom(marcadoresConDatos).error(),
]
