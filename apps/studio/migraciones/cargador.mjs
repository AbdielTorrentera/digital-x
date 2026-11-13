// Cargador para los scripts de migración: deja a Node importar el contenido de `apps/web/src/content` tal cual está.
// - Los imports sin extensión (`'../lib/negocio'`) se resuelven a `.ts` (Astro/Vite lo hacen solos; Node no).
// - Una foto (`import foto from '…jpg'`) se vuelve `{src: ruta absoluta}`, que es lo que sube la importación.
// Sin dependencias. Se borra junto con `content/*.ts` en la etapa 3.
import {existsSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

export async function resolve(especificador, contexto, siguiente) {
  if (
    especificador.startsWith('.') &&
    !path.extname(especificador) &&
    contexto.parentURL?.startsWith('file:')
  ) {
    const base = path.resolve(path.dirname(fileURLToPath(contexto.parentURL)), especificador)
    for (const candidato of [`${base}.ts`, path.join(base, 'index.ts')])
      if (existsSync(candidato)) return siguiente(pathToFileURL(candidato).href, contexto)
  }
  return siguiente(especificador, contexto)
}

export async function load(url, contexto, siguiente) {
  if (url.endsWith('.jpg'))
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify({src: fileURLToPath(url)})}`,
    }
  return siguiente(url, contexto)
}
