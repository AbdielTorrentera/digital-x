// Lee la instantánea del contenido de Sanity que dejó `scripts/descargar-contenido.ts` (`pnpm build` y `pnpm dev` la
// descargan antes de empezar). Se lee una vez, de forma síncrona, para que `astro.config.mjs`, las páginas y las pruebas
// vean exactamente los mismos datos. Las pruebas usan una muestra fija con `CONTENIDO_JSON`.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Asset, Documento, Instantanea } from '@digitalx/sanity/reglas';

const ruta = resolve(process.cwd(), process.env.CONTENIDO_JSON || '.contenido/sanity.json');

const leer = (): Instantanea => {
  try {
    return JSON.parse(readFileSync(ruta, 'utf8')) as Instantanea;
  } catch {
    throw new Error(
      `No hay contenido de Sanity en ${ruta}. Corre "pnpm contenido:descargar" (o usa "pnpm build" / "pnpm dev", que lo bajan solos).`,
    );
  }
};

const { documentos, assets } = leer();
const porId = new Map(documentos.map((d) => [d._id, d]));

/** El documento publicado con ese ID, o `undefined` (por ejemplo, una referencia débil a algo sin publicar). */
export const documento = <T>(id: string): T | undefined => porId.get(id) as T | undefined;

/** Un documento que el sitio no puede dibujar sin él: si falta, el build se detiene con un mensaje claro. */
export const documentoObligatorio = <T>(id: string): T => {
  const doc = porId.get(id);
  if (!doc) throw new Error(`Falta el documento "${id}" en el contenido de Sanity.`);
  return doc as T;
};

/** Todos los documentos publicados de un tipo (`servicio`, `categoria`…). */
export const documentosDe = <T>(tipo: string): (T & Documento)[] =>
  documentos.filter((d) => d._type === tipo) as unknown as (T & Documento)[];

export const asset = (id: string): Asset => {
  const encontrado = assets[id];
  if (!encontrado) throw new Error(`Falta el archivo de foto "${id}" en el contenido de Sanity.`);
  return encontrado;
};
