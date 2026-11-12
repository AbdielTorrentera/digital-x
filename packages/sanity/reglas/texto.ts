// Texto plano a partir de los datos de Sanity, y oraciones para detectar contenido repetido (SEO §5).

export type Segmento = string | number | {_key: string}
export type Ruta = Segmento[]

export interface Texto {
  ruta: Ruta
  texto: string
  /** Objetos por los que se pasó, de la raíz al padre: permite reglas como «solo dentro de las preguntas frecuentes». */
  ancestros: Record<string, unknown>[]
}

/** Claves cuyo valor no es redacción del sitio (identificadores, rutas, enlaces, datos de contacto). */
const CLAVES_QUE_NO_SON_TEXTO = new Set([
  '_type',
  '_key',
  '_id',
  '_ref',
  '_rev',
  '_weak',
  '_createdAt',
  '_updatedAt',
  'style',
  'listItem',
  'marks',
  'current',
  'ruta',
  'url',
  'href',
  'id',
  'telefono',
  'whatsapp',
  'correo',
  'red',
  'origen',
  'fecha',
  'fechaPublicacion',
  'fechaActualizacion',
])

const esObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function textoDeBloque(bloque: Record<string, unknown>): string {
  const hijos = Array.isArray(bloque.children) ? bloque.children : []
  return hijos.map((h) => (esObjeto(h) && typeof h.text === 'string' ? h.text : '')).join('')
}

/** Cada cadena de redacción del documento, con su ruta (en el formato que usa Sanity para marcar un campo). */
export function* textosDe(
  valor: unknown,
  ruta: Ruta = [],
  ancestros: Record<string, unknown>[] = [],
): Generator<Texto> {
  if (typeof valor === 'string') {
    yield {ruta, texto: valor, ancestros}
  } else if (Array.isArray(valor)) {
    for (const [i, item] of valor.entries()) {
      const segmento: Segmento =
        esObjeto(item) && typeof item._key === 'string' ? {_key: item._key} : i
      yield* textosDe(item, [...ruta, segmento], ancestros)
    }
  } else if (esObjeto(valor)) {
    // Un bloque de Portable Text es un solo párrafo: se revisa completo, no por trozos de formato.
    if (valor._type === 'block') {
      yield {ruta, texto: textoDeBloque(valor), ancestros}
      return
    }
    for (const [clave, hijo] of Object.entries(valor)) {
      if (CLAVES_QUE_NO_SON_TEXTO.has(clave)) continue
      yield* textosDe(hijo, [...ruta, clave], [...ancestros, valor])
    }
  }
}

/** Texto plano de un arreglo de bloques (por ejemplo, `textoConEnlaces`). */
export function bloquesATexto(bloques: unknown): string {
  if (!Array.isArray(bloques)) return ''
  return bloques.filter(esObjeto).map(textoDeBloque).join(' ')
}

const PALABRAS_MINIMAS = 7

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** Oraciones de 7 palabras o más, normalizadas (sin acentos, mayúsculas ni signos). */
export function oraciones(texto: string): string[] {
  return texto
    .split(/(?<=[.!?:;])\s+|\n+/)
    .map(normalizar)
    .filter((o) => o.split(' ').length >= PALABRAS_MINIMAS)
}

export interface OracionRepetida {
  oracion: string
  documentos: string[]
}

/** Oraciones que aparecen en dos o más documentos distintos. `documentos` asocia el id de cada uno con sus textos. */
export function oracionesRepetidas(documentos: Record<string, string[]>): OracionRepetida[] {
  const dondeEsta = new Map<string, Set<string>>()
  for (const [id, textos] of Object.entries(documentos))
    for (const texto of textos)
      for (const oracion of oraciones(texto))
        dondeEsta.set(oracion, (dondeEsta.get(oracion) ?? new Set()).add(id))
  return [...dondeEsta]
    .filter(([, ids]) => ids.size > 1)
    .map(([oracion, ids]) => ({oracion, documentos: [...ids]}))
}
