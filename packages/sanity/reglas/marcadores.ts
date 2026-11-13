// Marcadores en los textos: partes que hoy se arman con datos y que el dueño no debe escribir a mano
// (por ejemplo, la lista de lugares o los nombres de los servicios). El adaptador del sitio los reemplaza al compilar.

export const MARCADORES = [
  'zonas',
  'servicios-audio',
  'servicios-video',
  'servicios-tecnologia',
] as const

export type Marcador = (typeof MARCADORES)[number]

/** Coincide con cualquier `{algo}` que NO sea un marcador conocido. */
export const MARCADOR_DESCONOCIDO = new RegExp(`\\{(?!(${MARCADORES.join('|')})\\})[^}\\n]*\\}`)

/** Reemplaza cada marcador por su valor. Los valores salen de `zonas.texto` y de `lib/servicios.lista` (en el sitio). */
export function resolverMarcadores(texto: string, valores: Record<Marcador, string>): string {
  return MARCADORES.reduce((t, marcador) => t.replaceAll(`{${marcador}}`, valores[marcador]), texto)
}

/** Lo inverso, para la migración: pone el marcador donde el texto trae el valor tal cual. */
export function aMarcadores(texto: string, valores: Record<Marcador, string>): string {
  return MARCADORES.reduce((t, marcador) => t.replaceAll(valores[marcador], `{${marcador}}`), texto)
}

/** Las categorías (slug) cuyo marcador `{servicios-X}` usan estos textos. */
export function categoriasDeMarcadores(textos: string[]): string[] {
  return [
    ...new Set(
      textos.flatMap((t) => [...t.matchAll(/\{servicios-([a-z0-9-]+)\}/g)].map((m) => m[1])),
    ),
  ]
}

/**
 * ¿Se puede despublicar o eliminar este servicio o esta categoría? No, si el Inicio usa el marcador de su categoría y
 * después no quedaría ningún servicio publicado (ni servicios sin página) en ella: el build se detendría. Devuelve el
 * motivo para mostrarlo en el Studio, o `null` si se puede.
 */
export function motivoDeBloqueo(datos: {
  categoria: string
  /** Servicios publicados de la categoría sin contar este (0 al quitar una categoría entera). */
  serviciosRestantes: number
  /** Servicios de la categoría sin página propia (`sinPagina`). */
  sinPagina: number
  categoriasEnElInicio: string[]
}): string | null {
  if (!datos.categoriasEnElInicio.includes(datos.categoria)) return null
  if (datos.serviciosRestantes + datos.sinPagina > 0) return null
  return `El Inicio nombra los servicios de ${datos.categoria} con {servicios-${datos.categoria}} y no quedaría ninguno. Quita ese marcador del Inicio primero.`
}
