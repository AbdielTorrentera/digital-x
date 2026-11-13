import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anclaDe, enlaceAPagina, esPaginaPlaneada, idsDeHtml } from './enlaces.ts';

test('una página construida se enlaza', () => {
  assert.equal(enlaceAPagina('/'), '/');
});

test('una página en lanzamiento se enlaza aunque todavía no esté construida', () => {
  assert.equal(enlaceAPagina('/video/video-con-drone/'), '/video/video-con-drone/');
  assert.equal(esPaginaPlaneada('/tecnologia/tienda-en-linea/'), true);
});

test('una página pendiente de material nunca se enlaza, aunque esté en el registro', () => {
  assert.throws(() => enlaceAPagina('/blog/'), /no se puede enlazar/);
  assert.equal(esPaginaPlaneada('/blog/'), false);
});

test('una URL que no está en el registro tampoco se enlaza', () => {
  assert.throws(() => enlaceAPagina('/servicios-de-audio/'), /no se puede enlazar/);
  assert.equal(esPaginaPlaneada('/servicios-de-audio/'), false);
  assert.equal(esPaginaPlaneada('/inventada/'), false);
});

test('un enlace con ancla se valida por su ruta: /#servicios se enlaza, una ruta inventada con ancla no', () => {
  assert.equal(enlaceAPagina('/#servicios'), '/#servicios');
  // /servicios/ ya no existe (los servicios cuelgan de /{categoria}/{slug}/): ni la ruta ni sus anclas se pueden enlazar.
  assert.throws(() => enlaceAPagina('/servicios/'), /no se puede enlazar/);
  assert.throws(() => enlaceAPagina('/servicios/#audio'), /no se puede enlazar/);
  assert.equal(enlaceAPagina('/video/video-con-drone/#que-incluye'), '/video/video-con-drone/#que-incluye');
  assert.throws(() => enlaceAPagina('/inventada/#audio'), /no se puede enlazar/);
  assert.throws(() => enlaceAPagina('/blog/#x'), /no se puede enlazar/);
});

test('idsDeHtml lee los id con comillas dobles o simples y anclaDe saca el ancla del enlace', () => {
  const ids = idsDeHtml('<main id="contenido"><section id=\'audio\' class="x"><p data-id="no">t</p></section></main>');
  assert.deepEqual([...ids].sort(), ['audio', 'contenido']);
  assert.equal(anclaDe('/servicios/#audio'), 'audio');
  assert.equal(anclaDe('#que-hacemos'), 'que-hacemos');
  assert.equal(anclaDe('/servicios/'), '');
  assert.equal(anclaDe('/servicios/#'), '');
});

test('nada en src/ ni en el contenido de Sanity apunta a /servicios/: los servicios cuelgan de /{categoria}/{slug}/', () => {
  const carpetas = [
    '.',
    './contenido',
    '../content',
    '../components',
    '../components/sections',
    '../components/ui',
    '../pages',
    '../pages/[categoria]',
    '../scripts',
  ];
  let revisados = 0;
  for (const carpeta of carpetas) {
    for (const archivo of readdirSync(new URL(`${carpeta}/`, import.meta.url)).filter(
      (nombre) => /\.(ts|astro)$/.test(nombre) && !nombre.endsWith('.test.mjs'),
    )) {
      // Sin comentarios: se revisa el código y los textos, no lo que explica la historia.
      const texto = readFileSync(new URL(`${carpeta}/${archivo}`, import.meta.url), 'utf8').replace(
        /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|^\s*\/\/.*$/gm,
        '',
      );
      revisados++;
      assert.ok(!/\/servicios\//.test(texto), `${carpeta}/${archivo} apunta a /servicios/`);
    }
  }
  assert.ok(revisados > 40, `solo se revisaron ${revisados} archivos`);
  const datos = readFileSync(new URL('../../../../packages/sanity/muestra/contenido.json', import.meta.url), 'utf8');
  assert.ok(!datos.includes('/servicios/'), 'el contenido de Sanity enlaza a /servicios/');
});
