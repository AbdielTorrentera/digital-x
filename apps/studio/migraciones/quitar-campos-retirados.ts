/**
 * Script de UN SOLO USO: quita de los documentos ya guardados los campos que dejaron de existir en el esquema
 * (limpieza de reglas de redacción):
 *   - `permiso` y `esEjemplo` en documentos `proyecto`; `permiso` en `cliente` y `resena`;
 *   - `decorativa` y `temporal` dentro de cada objeto `foto`.
 * Solo hace `unset` de esas rutas: no toca ningún otro campo y no crea ni borra documentos.
 *
 * Por defecto es una PRUEBA: solo lista qué cambiaría y no escribe nada. Para aplicar hay que pasar `--aplicar`.
 *
 *   pnpm sanity exec migraciones/quitar-campos-retirados.ts --with-user-token                 (prueba, production)
 *   pnpm sanity exec migraciones/quitar-campos-retirados.ts --with-user-token -- --aplicar    (escribe)
 *   SANITY_DATASET=pruebas pnpm sanity exec ...                                               (otro dataset)
 *
 * Con `--with-user-token` la prueba también ve los borradores (`drafts.*`); sin token solo vería lo publicado.
 * Antes de aplicar se detiene si alguna foto con `decorativa: true` tiene texto alternativo (se perdería su intención).
 */
import {getCliClient} from 'sanity/cli'

const CAMPOS_RAIZ: Record<string, string[]> = {
  proyecto: ['permiso', 'esEjemplo'],
  cliente: ['permiso'],
  resena: ['permiso'],
}
const CAMPOS_FOTO = ['decorativa', 'temporal']

const aplicar = process.argv.includes('--aplicar')
const dataset = process.env.SANITY_DATASET || 'production'
const cliente = getCliClient({apiVersion: '2025-01-01', dataset})

type Valor = unknown
interface Documento {
  _id: string
  _type: string
  _rev: string
  [campo: string]: Valor
}

const esObjeto = (v: Valor): v is Record<string, Valor> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/** Rutas (en la sintaxis de `unset` de Sanity) de los campos retirados, y las fotos decorativas que traen alt. */
function revisar(doc: Documento) {
  const rutas: string[] = []
  const decorativasConAlt: string[] = []
  for (const campo of CAMPOS_RAIZ[doc._type] ?? []) if (campo in doc) rutas.push(campo)

  const andar = (valor: Valor, ruta: string) => {
    if (Array.isArray(valor)) {
      valor.forEach((item, i) => {
        const clave =
          esObjeto(item) && typeof item._key === 'string' ? `[_key=="${item._key}"]` : `[${i}]`
        andar(item, `${ruta}${clave}`)
      })
    } else if (esObjeto(valor)) {
      if (valor._type === 'foto') {
        for (const campo of CAMPOS_FOTO) if (campo in valor) rutas.push(`${ruta}.${campo}`)
        if (valor.decorativa === true && typeof valor.alt === 'string' && valor.alt.trim())
          decorativasConAlt.push(`${ruta} → «${valor.alt}»`)
      }
      for (const [k, v] of Object.entries(valor))
        if (!k.startsWith('_')) andar(v, ruta ? `${ruta}.${k}` : k)
    }
  }
  andar(doc, '')
  return {rutas, decorativasConAlt}
}

const documentos = await cliente.fetch<Documento[]>(
  '*[!(_type match "system.*") && !(_type match "sanity.*") && !(_id in path("_.**"))]',
  {},
  {perspective: 'raw'} as never,
)

const cambios = documentos
  .map((doc) => ({doc, ...revisar(doc)}))
  .filter((c) => c.rutas.length > 0 || c.decorativasConAlt.length > 0)

console.log(`Dataset: ${dataset}. ${documentos.length} documentos revisados.`)
console.log(
  aplicar
    ? 'MODO: APLICAR (escribe).'
    : 'MODO: PRUEBA (no escribe nada). Usa --aplicar para escribir.',
)
let total = 0
for (const {doc, rutas, decorativasConAlt} of cambios) {
  console.log(`\n${doc._id} (${doc._type}): quitaría ${rutas.length} campo(s)`)
  for (const ruta of rutas) console.log(`  - ${ruta}`)
  for (const d of decorativasConAlt) console.log(`  ⚠ foto decorativa con texto alternativo: ${d}`)
  total += rutas.length
}
console.log(
  `\nTotal: ${total} campo(s) en ${cambios.filter((c) => c.rutas.length).length} documento(s).`,
)

const conAlt = cambios.filter((c) => c.decorativasConAlt.length > 0)
if (conAlt.length > 0) {
  console.log('\nHay fotos decorativas con texto alternativo: revísalas antes de aplicar.')
  if (aplicar) {
    console.error('No se escribió nada.')
    process.exit(1)
  }
}

if (aplicar && total > 0) {
  const TAMANO = 50
  const conRutas = cambios.filter((c) => c.rutas.length > 0)
  for (let i = 0; i < conRutas.length; i += TAMANO) {
    const transaccion = cliente.transaction()
    for (const {doc, rutas} of conRutas.slice(i, i + TAMANO))
      transaccion.patch(doc._id, (p) => p.ifRevisionId(doc._rev).unset(rutas))
    await transaccion.commit()
  }
  console.log('Listo: campos retirados quitados.')
}
