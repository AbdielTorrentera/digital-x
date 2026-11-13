// Genera el archivo de importación (NDJSON) a partir del contenido actual. No toca ningún dataset ni usa la red.
//   pnpm migracion:exportar
import {mkdirSync, statSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {construir} from './convertir.mjs'

const salida = path.resolve(import.meta.dirname, 'salida')
const {documentos, archivos, avisos} = await construir()

mkdirSync(salida, {recursive: true})
writeFileSync(
  path.join(salida, 'contenido.ndjson'),
  documentos.map((d) => JSON.stringify(d)).join('\n') + '\n',
)
writeFileSync(path.join(salida, 'ids.txt'), documentos.map((d) => d._id).join('\n') + '\n')

const porTipo = Object.entries(Object.groupBy(documentos, (d) => d._type)).map(
  ([tipo, docs]) => `${tipo}: ${docs.length}`,
)
console.log(`Documentos: ${documentos.length}\n  ${porTipo.join('\n  ')}`)
console.log(`\nFotos (archivos distintos): ${archivos.length}`)
for (const a of archivos)
  console.log(`  ${path.basename(a)} (${Math.round(statSync(a).size / 1024)} KB)`)
console.log(`\nIDs: ${documentos.map((d) => d._id).join(', ')}`)
if (avisos.length)
  console.log(`\nAvisos (${avisos.length}):\n  ${[...new Set(avisos)].join('\n  ')}`)
console.log(
  `\nEscrito en ${path.relative(process.cwd(), salida)}/ (contenido.ndjson e ids.txt; no se suben a Git)`,
)
