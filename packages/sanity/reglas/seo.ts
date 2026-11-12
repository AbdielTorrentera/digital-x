import {INVITACION_META, MAX_META, MAX_TITLE, SUFIJO_TITLE, ZONAS_EN_META} from './constantes.ts'

/** SEO §1: title de 60 caracteres como máximo, con el patrón `{Servicio} en {Ciudad} | Digital X`. */
export function problemasDeTitle(title: string): string[] {
  const problemas: string[] = []
  if (title.length > MAX_TITLE)
    problemas.push(`Mide ${title.length} caracteres y el máximo es ${MAX_TITLE}.`)
  if (!title.endsWith(SUFIJO_TITLE)) problemas.push(`Debe terminar en «${SUFIJO_TITLE.trim()}».`)
  return problemas
}

/**
 * SEO §1: la meta mide 155 como máximo. En servicios y categorías, además, nombra la zona e invita a cotizar
 * (`servicio` = true); en el resto de las páginas solo se revisa la longitud.
 */
export function problemasDeMeta(meta: string, servicio = false): string[] {
  const problemas: string[] = []
  if (meta.length > MAX_META)
    problemas.push(`Mide ${meta.length} caracteres y el máximo es ${MAX_META}.`)
  if (servicio && !ZONAS_EN_META.test(meta)) problemas.push('Nombra la zona: Puebla o Atlixco.')
  if (servicio && !meta.endsWith(INVITACION_META))
    problemas.push(`Debe terminar invitando a cotizar: «${INVITACION_META}»`)
  return problemas
}
