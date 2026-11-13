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
