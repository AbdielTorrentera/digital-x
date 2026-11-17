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
