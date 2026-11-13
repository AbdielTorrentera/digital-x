// Comprueba que lo que se va a importar (o lo que ya está en un dataset) es idéntico al contenido actual.
//   pnpm migracion:verificar --seco              no usa la red ni toca ningún dataset
//   pnpm migracion:verificar --dataset pruebas   solo lee (sin token): compara el dataset con lo esperado
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import path from 'node:path'
import {pathToFileURL, fileURLToPath} from 'node:url'
import {
  faltantesDePagina,
  hallazgosDeVocabulario,
  oracionesRepetidas,
  textosDe,
  resolverMarcadores,
} from '@digitalx/sanity/reglas'
import {projectId} from '@digitalx/sanity/config'
import {construir, esperado, invertir, limpio, sha1DeArchivo} from './convertir.mjs'

const args = process.argv.slice(2)
const dataset = args.includes('--dataset') ? args[args.indexOf('--dataset') + 1] : null
if (!dataset && !args.includes('--seco')) throw new Error('Usa --seco o --dataset <nombre>')

const requireStudio = createRequire(path.resolve(import.meta.dirname, '../package.json'))
const {createSchema} = requireStudio('sanity')
const {validateDocumentWithWorkspace} = createRequire(requireStudio.resolve('sanity'))(
  '@sanity/validation',
)
const {schemaTypes} = await import('../schemaTypes/index.ts')

const construido = await construir()
const {documentos: esperados, marcadores} = construido
const idsEsperados = new Set(esperados.map((d) => d._id))

// ---------- documentos "reales": los del dataset o, en seco, los que se importarían ----------
const recorrer = (valor, fn) => {
  if (Array.isArray(valor)) valor.forEach((v) => recorrer(v, fn))
  else if (valor && typeof valor === 'object') {
    fn(valor)
    Object.values(valor).forEach((v) => recorrer(v, fn))
  }
}
const copia = (x) => JSON.parse(JSON.stringify(x))
let actuales
let activos // asset _id → {archivo, sha1}
if (dataset) {
  const consulta = encodeURIComponent('*[!(_id in path("_.**")) && !(_id in path("drafts.**"))]')
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?perspective=published&query=${consulta}`
  const respuesta = await fetch(url)
  if (!respuesta.ok) throw new Error(`La consulta a ${dataset} falló: ${respuesta.status}`)
  const todos = (await respuesta.json()).result
  activos = new Map(
    todos
      .filter((d) => d._type === 'sanity.imageAsset')
      .map((d) => [d._id, {archivo: d.originalFilename, sha1: d.sha1hash}]),
  )
  actuales = todos.filter((d) => !d._type.startsWith('sanity.'))
} else {
  // En seco la foto aún no se sube: se usa el mismo identificador que le daría Sanity (por contenido).
  activos = new Map()
  actuales = copia(esperados)
  const unico = new Map()
  recorrer(actuales, (o) => {
    if (o._sanityAsset) {
      const ruta = fileURLToPath(o._sanityAsset.replace(/^image@/, ''))
      const sha1 = sha1DeArchivo(ruta)
      const id = `image-${sha1}-1x1-jpg`
      activos.set(id, {archivo: path.basename(ruta), sha1})
      unico.set(o, id)
    }
  })
  for (const [o, id] of unico) {
    delete o._sanityAsset
    o.asset = {_type: 'reference', _ref: id}
  }
}

// Para comparar: cada foto queda como {archivo, sha1} y se quitan los datos que cambia Sanity solo.
const normalizado = (doc) => {
  const d = copia(doc)
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete d[k]
  recorrer(d, (o) => {
    if (o.asset && o.asset._ref) o.asset = activos.get(o.asset._ref) ?? {faltante: o.asset._ref}
  })
  return d
}
// Lo esperado, con sus fotos resueltas igual (por el archivo local).
const esperadoNormalizado = (doc) => {
  const d = copia(doc)
  recorrer(d, (o) => {
    if (o._sanityAsset) {
      const ruta = fileURLToPath(o._sanityAsset.replace(/^image@/, ''))
      o.asset = {archivo: path.basename(ruta), sha1: sha1DeArchivo(ruta)}
      delete o._sanityAsset
    }
  })
  return d
}

const fallas = []
const avisos = []
const comparar = (nombre, esperadoValor, real) => {
  try {
    assert.deepStrictEqual(limpio(real), limpio(esperadoValor))
  } catch (error) {
    fallas.push(`${nombre}: ${String(error.message).split('\n').slice(0, 12).join('\n    ')}`)
  }
}

// 0) forma de la foto: el importador espera `_sanityAsset` en la propia foto, no dentro de `asset`
recorrer(esperados, (o) => {
  if (o.asset?._sanityAsset)
    fallas.push('Una foto trae _sanityAsset dentro de `asset`: el importador lo anidaría mal')
})

// 1) conteos y documentos que faltan o sobran
const nuestros = actuales.filter((d) => idsEsperados.has(d._id))
for (const id of idsEsperados)
  if (!actuales.some((d) => d._id === id)) fallas.push(`Falta el documento ${id}`)
if (dataset)
  for (const d of actuales)
    if (!idsEsperados.has(d._id))
      avisos.push(`Hay un documento que la migración no conoce: ${d._id} (${d._type})`)

// 2) cada documento es idéntico al esperado (solo contra un dataset: en seco es el mismo objeto)
if (dataset)
  for (const d of nuestros)
    comparar(
      `${d._id} (dataset vs. esperado)`,
      esperadoNormalizado(esperados.find((e) => e._id === d._id)),
      normalizado(d),
    )

// 3) conversión inversa: de los documentos de vuelta al contenido original
const nombreDeServicio = (id) => nuestros.find((d) => d._id === id)?.nombre
const contexto = {originales: construido.originales, marcadores}
for (const d of nuestros)
  comparar(
    `${d._id} (contenido original)`,
    esperado(normalizado(d), contexto),
    invertir(normalizado(d), {marcadores, nombreDeServicio}),
  )

// 4) vocabulario, página completa, referencias, SEO único y oraciones repetidas
for (const d of nuestros) {
  for (const h of hallazgosDeVocabulario(d))
    fallas.push(`${d._id}: ${h.mensaje} @${JSON.stringify(h.ruta)}`)
  if (d._type === 'servicio')
    for (const f of faltantesDePagina(d)) fallas.push(`${d._id}: falta ${f}`)
  recorrer(d, (o) => {
    if (
      o._type === 'reference' &&
      !o._ref.startsWith('image-') &&
      !actuales.some((x) => x._id === o._ref)
    )
      fallas.push(`${d._id}: referencia a ${o._ref}, que no existe`)
  })
}
for (const campo of ['title', 'meta']) {
  const vistos = Map.groupBy(
    nuestros.filter((d) => d.seo?.[campo]),
    (d) => d.seo[campo],
  )
  for (const [, docs] of vistos)
    if (docs.length > 1)
      fallas.push(`SEO ${campo} repetido en ${docs.map((d) => d._id).join(', ')}`)
}
const textos = Object.fromEntries(
  nuestros
    .filter((d) => ['servicio', 'categoria', 'inicio', 'nosotros'].includes(d._type))
    .map((d) => [
      d._id,
      [...textosDe(d)].filter((t) => t.ruta.at(-1) !== 'alt').map((t) => t.texto),
    ]),
)
for (const r of oracionesRepetidas(textos))
  avisos.push(`Oración repetida en ${r.documentos.join(' y ')}: «${r.oracion.slice(0, 70)}…»`)

// 5) el motor de validación del Studio (el mismo que usa «Publicar»)
const pregunta = async (q) => (/^count\(/.test(q.trim()) ? 0 : /\*\[_type in/.test(q) ? [] : true)
const cliente = {fetch: pregunta, withConfig: () => cliente}
const traducciones = {
  'validation:generic.required': 'Required',
  'validation:array.item-duplicate': 'Duplicado',
}
const workspace = {
  schema: createSchema({name: 'default', types: schemaTypes}),
  i18n: {
    t: (k, o) => traducciones[k] ?? (o ? `${k} ${JSON.stringify(o)}` : k),
    loadNamespaces: async () => {},
  },
  getClient: () => cliente,
}
const resumen = new Map()
for (const d of nuestros) {
  const marcadoresDelMotor = await validateDocumentWithWorkspace({
    document: d,
    workspace,
    environment: 'studio',
    getDocumentExists: async ({id}) =>
      idsEsperados.has(id) || activos.has(id) || actuales.some((x) => x._id === id),
  })
  for (const m of marcadoresDelMotor.markers ?? marcadoresDelMotor) {
    const clave = `${m.level}|${d._type}|${m.message}`
    resumen.set(clave, [...(resumen.get(clave) ?? []), `${d._id} @${JSON.stringify(m.path)}`])
  }
}
const delMotor = [...resumen].map(([clave, donde]) => ({
  nivel: clave.split('|')[0],
  tipo: clave.split('|')[1],
  mensaje: clave.split('|').slice(2).join('|'),
  donde,
}))
for (const m of delMotor.filter((x) => x.nivel === 'error'))
  fallas.push(
    `Studio (error) ${m.mensaje} → ${m.donde.slice(0, 3).join('; ')}${m.donde.length > 3 ? ` y ${m.donde.length - 3} más` : ''}`,
  )

// ---------- informe ----------
const porTipo = Object.entries(Object.groupBy(nuestros, (d) => d._type))
  .map(([t, docs]) => `${t}: ${docs.length}`)
  .join(' · ')
console.log(`Modo: ${dataset ? `dataset «${dataset}» (solo lectura)` : 'en seco (sin red)'}`)
console.log(`Documentos: ${nuestros.length} de ${idsEsperados.size} esperados → ${porTipo}`)
console.log(`Fotos distintas: ${new Set([...activos.values()].map((a) => a.sha1)).size}`)
console.log(
  `Comprobaciones: conversión inversa idéntica, vocabulario, páginas completas, referencias, SEO único y motor del Studio.`,
)
const avisosDelMotor = Map.groupBy(
  delMotor.filter((x) => x.nivel !== 'error'),
  (x) => `${x.nivel}: ${x.mensaje.slice(0, 100)}`,
)
if (avisosDelMotor.size) {
  console.log('\nAvisos del Studio (no bloquean publicar):')
  for (const [mensaje, grupo] of avisosDelMotor)
    console.log(`  ${mensaje} (${grupo.reduce((n, g) => n + g.donde.length, 0)})`)
}
if (avisos.length) console.log(`\nOtros avisos:\n  ${avisos.join('\n  ')}`)
if (fallas.length) {
  console.log(`\n✖ ${fallas.length} FALLAS:\n  ${fallas.join('\n  ')}`)
  process.exitCode = 1
} else console.log('\n✔ Sin fallas.')
