/**
 * Baja de Sanity el contenido publicado y lo deja en `.contenido/sanity.json` para que el sitio lo lea al compilar.
 * Sin token: el dataset es público y solo se lee lo publicado. Corre antes de `astro build` y de `astro dev`.
 *
 *   node scripts/descargar-contenido.ts            baja, valida y escribe la instantánea
 *   node scripts/descargar-contenido.ts --dev      igual, pero si no hay red y ya existe una instantánea, la usa
 *   node scripts/descargar-contenido.ts --muestra  además guarda la muestra fija que usan las pruebas
 *
 * Si Sanity no responde o el contenido no pasa la validación, termina con error y el build se detiene: nunca se
 * publica a medias (seguridad §2). `SANITY_DATASET=pruebas` baja otro dataset (solo para desarrollo).
 * `CONTENIDO_JSON=ruta` usa ese archivo en lugar de bajar nada (así compilan las pruebas).
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { datasetProduccion, projectId } from '@digitalx/sanity/config';
import { validarContenido, type Instantanea } from '@digitalx/sanity/reglas';

const TIPOS = [
  'configuracion',
  'inicio',
  'nosotros',
  'paginaProyectos',
  'paginaBlog',
  'paginaResenas',
  'guiaDeServicios',
  'categoria',
  'servicio',
  'proyecto',
  'cliente',
  'resena',
  'articulo',
  'categoriaBlog',
  'autor',
];
const args = process.argv.slice(2);
const dev = args.includes('--dev');
const muestra = args.includes('--muestra');
const produccion = process.env.VERCEL_ENV === 'production';
const destino = resolve(process.cwd(), '.contenido/sanity.json');
const destinoMuestra = resolve(process.cwd(), '../../packages/sanity/muestra/contenido.json');

if (process.env.CONTENIDO_JSON) {
  console.log(`Contenido: se usa ${process.env.CONTENIDO_JSON} (CONTENIDO_JSON); no se baja nada.`);
  process.exit(0);
}

const dataset = process.env.SANITY_DATASET || datasetProduccion;
const consulta = `{
  "documentos": *[_type in $tipos],
  "assets": *[_type == "sanity.imageAsset"]{_id, url, extension, originalFilename, "width": metadata.dimensions.width, "height": metadata.dimensions.height}
}`;
const url =
  `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}` +
  `?perspective=published&query=${encodeURIComponent(consulta)}&$tipos=${encodeURIComponent(JSON.stringify(TIPOS))}`;

async function bajar(): Promise<Instantanea> {
  let ultimoError: unknown;
  for (let intento = 1; intento <= 3; intento++) {
    try {
      const respuesta = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (respuesta.status === 402)
        throw new Error(
          'Sanity respondió 402: se acabó la cuota gratuita del mes (la API pública queda bloqueada hasta que se renueve).',
        );
      if (!respuesta.ok) throw new Error(`Sanity respondió ${respuesta.status} ${respuesta.statusText}.`);
      const { result } = (await respuesta.json()) as {
        result: {
          documentos: Instantanea['documentos'];
          assets: {
            _id: string;
            url: string;
            extension: string;
            originalFilename?: string;
            width: number;
            height: number;
          }[];
        };
      };
      return {
        documentos: result.documentos.sort((a, b) => a._id.localeCompare(b._id)),
        assets: Object.fromEntries(
          result.assets.sort((a, b) => a._id.localeCompare(b._id)).map(({ _id, ...asset }) => [_id, asset]),
        ),
      };
    } catch (error) {
      ultimoError = error;
      if (intento < 3) await new Promise((r) => setTimeout(r, intento * 2000));
    }
  }
  throw ultimoError;
}

function guardar(ruta: string, instantanea: Instantanea) {
  mkdirSync(dirname(ruta), { recursive: true });
  // Se escribe a un archivo temporal y se renombra: nunca queda una instantánea a medias.
  writeFileSync(`${ruta}.tmp`, `${JSON.stringify(instantanea, null, 2)}\n`);
  renameSync(`${ruta}.tmp`, ruta);
}

let instantanea: Instantanea;
try {
  instantanea = await bajar();
} catch (error) {
  const motivo = error instanceof Error ? error.message : String(error);
  if (dev && existsSync(destino)) {
    console.warn(
      `⚠ No se pudo bajar el contenido de Sanity (${motivo})\n  Se usa la última instantánea (${destino}); puede estar desactualizada.`,
    );
    process.exit(0);
  }
  console.error(
    `✖ No se pudo bajar el contenido de Sanity (${dataset}).\n  ${motivo}\n  El build se detiene para no publicar a medias; la versión anterior sigue en línea.`,
  );
  process.exit(1);
}

const { errores, avisos } = validarContenido(instantanea, { produccion });
if (errores.length > 0) {
  console.error(
    `✖ El contenido de Sanity (${dataset}) no pasa las reglas del sitio (${errores.length}):\n${errores.map((e) => `  - ${e}`).join('\n')}\n  Corrígelo en el Studio y vuelve a publicar. El build se detiene; la versión anterior sigue en línea.`,
  );
  process.exit(1);
}
guardar(destino, instantanea);
if (muestra) {
  if (dataset !== datasetProduccion) {
    console.error('La muestra se baja siempre de production.');
    process.exit(1);
  }
  guardar(destinoMuestra, instantanea);
}
const asNum = (tipo: string) => instantanea.documentos.filter((d) => d._type === tipo).length;
console.log(
  `Contenido de Sanity (${dataset}): ${instantanea.documentos.length} documentos (${asNum('servicio')} servicios, ${asNum('categoria')} categorías, ${asNum('proyecto')} proyectos) y ${Object.keys(instantanea.assets).length} fotos${muestra ? '; muestra de pruebas actualizada' : ''}.`,
);
for (const aviso of avisos) console.warn(`  ⚠ ${aviso}`);
