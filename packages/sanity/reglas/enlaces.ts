// Seguridad §4.3: los enlaces que vienen del contenido solo aceptan https:, mailto:, tel: y rutas internas.

const PROTOCOLOS = ['https:', 'mailto:', 'tel:']

export function enlaceAceptable(valor: string): boolean {
  if (/^\/(?!\/)/.test(valor)) return true
  try {
    return PROTOCOLOS.includes(new URL(valor).protocol)
  } catch {
    return false
  }
}

/** Solo https: (las redes y el enlace de reseña no admiten mailto: ni tel:). */
export function esHttps(valor: string): boolean {
  try {
    return new URL(valor).protocol === 'https:'
  } catch {
    return false
  }
}

/** Dominios por red: una red con la URL de otro sitio es un error de captura. */
export const DOMINIOS_DE_RED: Record<string, RegExp> = {
  facebook: /(^|\.)(facebook\.com|fb\.com|fb\.me)$/i,
  instagram: /(^|\.)instagram\.com$/i,
  tiktok: /(^|\.)tiktok\.com$/i,
  youtube: /(^|\.)(youtube\.com|youtu\.be)$/i,
  linkedin: /(^|\.)linkedin\.com$/i,
  google: /(^|\.)(google\.com|g\.page|goo\.gl|maps\.app\.goo\.gl|business\.google\.com)$/i,
}

export function urlDeRedValida(red: string, valor: string): boolean {
  if (!esHttps(valor)) return false
  const patron = DOMINIOS_DE_RED[red]
  return patron ? patron.test(new URL(valor).hostname) : true
}
