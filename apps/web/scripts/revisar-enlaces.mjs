/**
 * Revisa que los enlaces internos de apps/web/dist apunten a archivos que existen (buenas prácticas §5), y que las
 * anclas (`/#servicios`, `#que-incluye`) apunten a un `id` que exista en la página de destino. Un `href="#"` falla.
 * Excepción: un enlace a una página planeada (en paginas.ts con estado "lanzamiento") se acepta aunque todavía no esté
 * construida (y su ancla no se puede revisar); con cualquier otra URL que no exista, falla. El build de producción es
 * quien prohíbe las planeadas.
 * Uso: pnpm check:enlaces (después de pnpm build). Termina con código 1 si hay enlaces rotos.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { anclaDe, esPaginaPlaneada, idsDeHtml } from '../src/lib/enlaces.ts';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

if (!existsSync(dist)) {
  console.error('No existe apps/web/dist. Corre `pnpm build` antes de revisar los enlaces.');
  process.exit(1);
}

const htmlDe = (dir) =>
  readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return htmlDe(ruta);
    return ruta.endsWith('.html') ? [ruta] : [];
  });

// Enlaces de un HTML: href, src, poster y cada URL de srcset. Solo los href llevan anclas que revisar.
const enlacesDe = (html) => {
  const enlaces = [];
  for (const m of html.matchAll(/\s(href|src|poster|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const atributo = m[1].toLowerCase();
    const valor = m[2] ?? m[3] ?? '';
    if (atributo === 'srcset') {
      // "a.png 1x, b.png 2x": la URL es lo primero de cada candidato.
      for (const candidato of valor.split(',')) enlaces.push({ atributo, valor: candidato.trim().split(/\s+/)[0] });
    } else {
      enlaces.push({ atributo, valor: valor.trim() });
    }
  }
  return enlaces.filter((enlace) => enlace.valor);
};

// Externos (https:, //host) y esquemas (mailto:, tel:, data:, javascript:) no apuntan a un archivo del sitio.
const esInterno = (enlace) => !/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(enlace);

const existe = (ruta) => existsSync(ruta) && statSync(ruta).isFile();

const resuelve = (rutaUrl) => {
  const base = join(dist, decodeURIComponent(rutaUrl));
  if (rutaUrl.endsWith('/')) return existe(join(base, 'index.html'));
  return existe(base) || existe(join(base, 'index.html')) || existe(`${base}.html`);
};

// Los id de cada archivo HTML, leídos una sola vez.
const idsEnCache = new Map();
const idsDe = (archivo) => {
  if (!idsEnCache.has(archivo)) idsEnCache.set(archivo, idsDeHtml(readFileSync(archivo, 'utf8')));
  return idsEnCache.get(archivo);
};
// El archivo HTML de una URL del sitio ("/video/" → dist/video/index.html).
const archivoDe = (rutaUrl) => {
  const base = join(dist, decodeURIComponent(rutaUrl));
  return [join(base, 'index.html'), base, `${base}.html`].find(existe);
};

const rotos = [];
const planeados = [];
let revisados = 0;
let revisadas = 0;
for (const archivo of htmlDe(dist)) {
  const paginaUrl =
    '/' +
    relative(dist, archivo)
      .replace(/index\.html$/, '')
      .replace(/\\/g, '/');
  for (const { atributo, valor: enlace } of enlacesDe(readFileSync(archivo, 'utf8'))) {
    if (!esInterno(enlace)) continue;
    const ancla = atributo === 'href' ? anclaDe(enlace) : '';
    if (atributo === 'href' && enlace.endsWith('#')) {
      rotos.push(`${paginaUrl}  →  ${enlace}  (ancla vacía)`);
      continue;
    }
    const sinHash = enlace.split('#')[0].split('?')[0];
    // "?x" o "#x": la misma página.
    const absoluto = !sinHash
      ? paginaUrl
      : sinHash.startsWith('/')
        ? sinHash
        : // Relativos ("foto.png") se resuelven contra la carpeta de la página; los absolutos, contra dist.
          new URL(sinHash, `https://sitio.local${paginaUrl}`).pathname;
    if (sinHash) revisados++;
    if (!sinHash && !ancla) continue;
    // /servicios/ (el catálogo) ya no existe: ni la ruta ni sus anclas se enlazan desde ninguna página.
    if (absoluto === '/servicios/') {
      rotos.push(`${paginaUrl}  →  ${enlace}  (/servicios/ ya no existe: usa la categoría o el servicio)`);
      continue;
    }
    if (sinHash && !resuelve(absoluto)) {
      (esPaginaPlaneada(absoluto) ? planeados : rotos).push(`${paginaUrl}  →  ${enlace}`);
      continue;
    }
    if (ancla) {
      const destino = sinHash ? archivoDe(absoluto) : archivo;
      revisadas++;
      if (!destino || !idsDe(destino).has(ancla))
        rotos.push(`${paginaUrl}  →  ${enlace}  (no existe #${ancla} en ${absoluto})`);
    }
  }
}

if (rotos.length > 0) {
  console.error(`Enlaces internos rotos (${rotos.length}):`);
  for (const r of rotos) console.error(`  ${r}`);
  process.exit(1);
}
const aviso = planeados.length > 0 ? ` (${planeados.length} a páginas planeadas que aún no se construyen)` : '';
console.log(`Enlaces internos revisados: ${revisados}, y ${revisadas} anclas. Ninguno roto${aviso}.`);
