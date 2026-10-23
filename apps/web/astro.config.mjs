import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { archivosDe, urlsConstruidas, urlsPublicadas } from './src/lib/paginas.ts';

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

export default defineConfig({
  output: 'static',
  site,
  trailingSlash: 'always',
  // sitemap-index.xml solo con las páginas publicadas (lanzamiento + construidas). Sin 404.
  integrations: [sitemap({ filter: (page) => publicadas.has(page) })],
  // The stylesheets are small, so they go inside the page instead of blocking the first paint as separate requests.
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
