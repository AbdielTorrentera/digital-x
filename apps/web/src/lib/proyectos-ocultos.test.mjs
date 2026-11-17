// Sin proyectos publicados, o sin la «Página de proyectos» publicada, la sección de proyectos no existe: ni /proyectos/ ni
// los detalles se registran, nada del sitio los enlaza (menú, pie, tarjetas, «También te puede servir») y la guarda de
// producción no tiene nada que reprochar. El contenido se lee una sola vez al importar, así que cada caso corre en un
// proceso aparte con su propia instantánea (CONTENIDO_JSON).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const muestra = JSON.parse(readFileSync(new URL('./contenido/pruebas/contenido.json', import.meta.url), 'utf8'));

/** Corre `codigo` (un módulo) con una instantánea derivada de la de prueba y devuelve lo que imprime como JSON. */
const conContenido = (cambio, codigo) => {
  const instantanea = structuredClone(muestra);
  cambio(instantanea);
  const carpeta = mkdtempSync(join(tmpdir(), 'dx-proyectos-'));
  const archivo = join(carpeta, 'contenido.json');
  writeFileSync(archivo, JSON.stringify(instantanea));
  const salida = execFileSync(process.execPath, ['--input-type=module', '-e', codigo], {
    cwd: new URL('..', import.meta.url).pathname,
    env: { ...process.env, CONTENIDO_JSON: archivo },
    encoding: 'utf8',
  });
  return JSON.parse(salida);
};

const resumen = `
  import { enlacesEmpresa, menu, paginas, urlsPublicadas, urlsSinConstruir, archivosDe } from './lib/paginas.ts';
  import { enlaceSiExiste } from './lib/enlaces.ts';
  import { hayProyectos } from './lib/contenido/proyectos.ts';
  console.log(JSON.stringify({
    hayProyectos,
    menu: menu.map((i) => i.url),
    pie: enlacesEmpresa.map((p) => p.url),
    publicadas: urlsPublicadas.filter((u) => u.startsWith('/proyectos')),
    sinConstruir: urlsSinConstruir.filter((u) => u.startsWith('/proyectos')),
    registradas: paginas.filter((p) => p.url.startsWith('/proyectos')).map((p) => p.url),
    enlace: enlaceSiExiste('/proyectos/'),
    archivos: archivosDe('/proyectos/'),
  }));
`;

const sinProyectos = (inst) => {
  inst.documentos = inst.documentos.filter((d) => d._type !== 'proyecto');
};
const sinPagina = (inst) => {
  inst.documentos = inst.documentos.filter((d) => d._type !== 'paginaProyectos');
};

test('con proyectos y la «Página de proyectos», /proyectos/ y cada detalle existen y entran al menú y al pie', () => {
  const r = conContenido(() => {}, resumen);
  assert.equal(r.hayProyectos, true);
  assert.deepEqual(r.menu, ['/', '/audio/renta-de-audio/', '/video/', '/proyectos/', '/nosotros/']);
  assert.deepEqual(r.pie, ['/proyectos/', '/nosotros/']);
  assert.deepEqual([...r.publicadas].sort(), [
    '/proyectos/',
    '/proyectos/proyecto-con-todos-los-campos/',
    '/proyectos/proyecto-de-prueba/',
  ]);
  assert.deepEqual(r.sinConstruir, []);
  assert.equal(r.enlace, '/proyectos/');
  assert.ok(r.archivos.includes('proyectos/[...slug].astro'));
});

test('cero proyectos: no hay /proyectos/ ni detalles, no hay enlaces a ella y no queda nada «sin construir» de proyectos', () => {
  const r = conContenido(sinProyectos, resumen);
  assert.equal(r.hayProyectos, false);
  assert.ok(!r.menu.includes('/proyectos/'));
  assert.ok(!r.pie.includes('/proyectos/'));
  assert.deepEqual(r.publicadas, []);
  assert.deepEqual(r.registradas, ['/proyectos/'], 'solo queda la página fija, sin construir');
  assert.equal(r.enlace, null, 'los enlaces a /proyectos/ se muestran como texto');
});

test('con proyectos pero sin «Página de proyectos» publicada pasa lo mismo: nada se enlaza ni se genera', () => {
  const r = conContenido(sinPagina, resumen);
  assert.equal(r.hayProyectos, false);
  assert.ok(!r.menu.includes('/proyectos/'));
  assert.deepEqual(r.publicadas, []);
  assert.equal(r.enlace, null);
  // Los detalles existen en el registro pero sin construir: no se generan ni entran al sitemap (`publicadas` está vacío).
  assert.equal(r.registradas.length, 3);
});
