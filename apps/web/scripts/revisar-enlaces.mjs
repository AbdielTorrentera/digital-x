/**
 * Revisa que los enlaces internos de apps/web/dist apunten a archivos que existen (buenas prácticas §5).
 * Uso: pnpm check:enlaces (después de pnpm build). Termina con código 1 si hay enlaces rotos.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

// Enlaces de un HTML: href, src, poster y cada URL de srcset.
const enlacesDe = (html) => {
  const enlaces = [];
  for (const m of html.matchAll(/\s(href|src|poster|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const atributo = m[1].toLowerCase();
    const valor = m[2] ?? m[3] ?? '';
    if (atributo === 'srcset') {
      // "a.png 1x, b.png 2x": la URL es lo primero de cada candidato.
      for (const candidato of valor.split(',')) enlaces.push(candidato.trim().split(/\s+/)[0]);
    } else {
      enlaces.push(valor.trim());
    }
  }
  return enlaces.filter(Boolean);
};

// Externos (https:, //host), esquemas (mailto:, tel:, data:, javascript:) y anclas (#x) no apuntan a un archivo del sitio.
const esInterno = (enlace) => !/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(enlace);

const existe = (ruta) => existsSync(ruta) && statSync(ruta).isFile();

const resuelve = (rutaUrl) => {
  const base = join(dist, decodeURIComponent(rutaUrl));
  if (rutaUrl.endsWith('/')) return existe(join(base, 'index.html'));
  return existe(base) || existe(join(base, 'index.html')) || existe(`${base}.html`);
};

const rotos = [];
let revisados = 0;
for (const archivo of htmlDe(dist)) {
  const paginaUrl = '/' + relative(dist, archivo).replace(/index\.html$/, '').replace(/\\/g, '/');
  for (const enlace of enlacesDe(readFileSync(archivo, 'utf8'))) {
    if (!esInterno(enlace)) continue;
    const sinHash = enlace.split('#')[0].split('?')[0];
    if (!sinHash) continue; // "?x" o "#x": la misma página
    // Relativos ("foto.png") se resuelven contra la carpeta de la página; los absolutos, contra dist.
    const absoluto = sinHash.startsWith('/') ? sinHash : new URL(sinHash, `https://sitio.local${paginaUrl}`).pathname;
    revisados++;
    if (!resuelve(absoluto)) rotos.push(`${paginaUrl}  →  ${enlace}`);
  }
}

if (rotos.length > 0) {
  console.error(`Enlaces internos rotos (${rotos.length}):`);
  for (const r of rotos) console.error(`  ${r}`);
  process.exit(1);
}
console.log(`Enlaces internos revisados: ${revisados}. Ninguno roto.`);
