// El dataset es público (seguridad §4.1): lo publicado lo puede leer cualquiera sin token. Por eso el permiso es
// obligatorio PARA PUBLICAR, no solo para mostrar: sin permiso el documento se queda en borrador (que no es público).

/** Reseñas y clientes necesitan permiso siempre. */
export const MENSAJE_PERMISO =
  'Sin el permiso de esta persona o empresa no se puede publicar: el contenido de Sanity lo puede leer cualquiera. Márcalo solo si ya lo tienes confirmado; si no, deja el documento en borrador.'

/** Un proyecto real necesita permiso; uno de ejemplo (ficticio) no. */
export function problemaDePermiso(doc: {
  permiso?: boolean
  esEjemplo?: boolean
  _type?: string
}): string | null {
  if (doc._type === 'proyecto' && doc.esEjemplo === true) return null
  return doc.permiso === true ? null : MENSAJE_PERMISO
}
