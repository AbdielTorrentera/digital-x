// Validaciones del Studio que necesitan consultar otros documentos o recorrer el documento completo.
// Las reglas puras viven en `@digitalx/sanity/reglas`; aquí solo se conectan con Sanity. Solo hay reglas técnicas: las
// de redacción (docs/) son guía para quien escribe y no se validan.
import type {DocumentRule, ValidationContext} from 'sanity'
import {
  categoriasDeMarcadores,
  marcadoresDesconocidos,
  PAGINAS_FIJAS_SIN_CONSTRUIR,
  textosDe,
} from '@digitalx/sanity/reglas'

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

/** Validación de un documento con textos que llevan marcadores: ninguno desconocido (error). */
export const validacionDePagina = (Rule: DocumentRule) => [Rule.custom(marcadoresConocidos).error()]

/** El Inicio: marcadores conocidos y, además, que sus marcadores tengan datos (error, igual que en el build). */
export const validacionDeInicio = (Rule: DocumentRule) => [
  ...validacionDePagina(Rule),
  Rule.custom(marcadoresConDatos).error(),
]
