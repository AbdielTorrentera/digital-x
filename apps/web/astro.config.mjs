import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esProduccion } from './src/lib/entorno.ts';
import { archivosDe, urlsConstruidas, urlsPublicadas, urlsSinConstruir } from './src/lib/paginas.ts';
import {
  enlacesANoConstruidas,
  nombresDeFotosTemporales,
  paginasConPendientes,
  urlDeArchivoHtml,
} from './src/lib/proteccion-produccion.ts';

const site = 'https://digitalx.mx';

// Una página marcada como construida en src/lib/paginas.ts debe tener su archivo en src/pages/.
// Si no, el menú y el sitemap enlazarían a un 404.
const dirPaginas = fileURLToPath(new URL('./src/pages/', import.meta.url));
for (const url of urlsConstruidas) {
  if (!archivosDe(url).some((f) => existsSync(dirPaginas + f))) {
    throw new Error(`paginas.ts marca "${url}" como construida, pero no existe su archivo en src/pages/`);
  }
}

const publicadas = new Set(urlsPublicadas.map((u) => new URL(u, site).href));

const archivosDeCarpeta = (dir) =>
  readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    return statSync(ruta).isDirectory() ? archivosDeCarpeta(ruta) : [ruta];
  });

// En producción (VERCEL_ENV=production) el build falla si queda material provisional: fotos de
// src/assets/temporales/, algún "[PENDIENTE" visible o un enlace interno a una página planeada que aún no está
// construida (en desarrollo ese enlace lleva a la 404). En local y en previews no se aplica.
const proteccionProduccion = {
  name: 'proteccion-produccion',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (!esProduccion) return;
      const raiz = fileURLToPath(dir);
      const rutas = archivosDeCarpeta(raiz).map((ruta) => relative(raiz, ruta));
      const temporales = nombresDeFotosTemporales(rutas);
      const paginasHtml = rutas
        .filter((ruta) => ruta.endsWith('.html'))
        .map((ruta) => ({ url: urlDeArchivoHtml(ruta), html: readFileSync(join(raiz, ruta), 'utf8') }));
      const conPendientes = paginasConPendientes(paginasHtml);
      const aNoConstruidas = enlacesANoConstruidas(paginasHtml, urlsSinConstruir);
      const problemas = [];
      if (temporales.length > 0) {
        problemas.push(
          `Fotos temporales en el build (reemplázalas por las reales, ver src/assets/temporales/README.md):\n${temporales.map((nombre) => `  - ${nombre}`).join('\n')}`,
        );
      }
      if (conPendientes.length > 0) {
        problemas.push(`Páginas con [PENDIENTE visible:\n${conPendientes.map((u) => `  - ${u}`).join('\n')}`);
      }
      if (aNoConstruidas.length > 0) {
        problemas.push(
          `Enlaces a páginas que aún no están construidas (construye la página y márcala en src/lib/paginas.ts, o quita el enlace):\n${aNoConstruidas.map((e) => `  - ${e.pagina} → ${e.enlace}`).join('\n')}`,
        );
      }
      if (problemas.length > 0) {
        throw new Error(`No se puede publicar en producción.\n${problemas.join('\n')}`);
      }
    },
  },
};

export default defineConfig({
  output: 'static',
  site,
  trailingSlash: 'always',
  // sitemap-index.xml solo con las páginas publicadas (lanzamiento + construidas). Sin 404.
  integrations: [sitemap({ filter: (page) => publicadas.has(page) }), proteccionProduccion],
  // The stylesheets are small, so they go inside the page instead of blocking the first paint as separate requests.
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
