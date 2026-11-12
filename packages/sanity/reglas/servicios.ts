// Lo que debe traer un servicio para publicar su página. Es `faltantesDePagina` de `content/servicios.ts`,
// que el build ya exige: ahora también lo ve el dueño al marcar «Página construida».

interface ServicioConPagina {
  pagina?: {
    ficha?: unknown[]
    descripcion?: {titulo?: string; parrafos?: unknown[]}
    incluye?: unknown[]
    tambien?: {items?: unknown[]}
    cotizacion?: {etiqueta?: string; texto?: string}
    cierre?: {titulo?: string; texto?: string}
  }
  foto?: {asset?: unknown}
  mensajeWhatsApp?: string
}

export function faltantesDePagina(servicio: ServicioConPagina): string[] {
  const p = servicio.pagina
  const faltan: string[] = []
  if (!servicio.foto?.asset) faltan.push('la foto del encabezado')
  if (!servicio.mensajeWhatsApp) faltan.push('el mensaje de WhatsApp')
  if (p?.ficha?.length !== 3) faltan.push('la ficha (exactamente 3 datos)')
  if (!p?.descripcion?.titulo || !p.descripcion.parrafos?.length)
    faltan.push('la descripción (título y párrafos)')
  if (!p?.incluye?.length) faltan.push('qué incluye')
  if (!p?.tambien?.items?.length) faltan.push('«También te puede servir»')
  if (!p?.cotizacion?.etiqueta || !p.cotizacion.texto) faltan.push('la tarjeta de cotización')
  if (!p?.cierre?.titulo || !p.cierre.texto) faltan.push('el cierre')
  return faltan
}
