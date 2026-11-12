import {SLUGS_RESERVADOS} from './constantes.ts'

/** Estructura §2.4: minúsculas, sin acentos ni ñ, guiones entre palabras. */
export const FORMATO_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function slugificar(texto: string, maximo = 96): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maximo)
    .replace(/-+$/g, '')
}

export function problemasDeSlug(
  slug: string | undefined,
  opciones: {reservados?: boolean} = {},
): string[] {
  if (!slug) return ['Falta el slug (la parte de la dirección web).']
  const problemas: string[] = []
  if (!FORMATO_SLUG.test(slug))
    problemas.push(
      'Usa solo minúsculas, números y guiones (sin acentos, ñ ni espacios). Ejemplo: video-con-drone',
    )
  if (opciones.reservados && SLUGS_RESERVADOS.includes(slug))
    problemas.push(`«${slug}» ya lo usa una página fija del sitio. Elige otro.`)
  return problemas
}
