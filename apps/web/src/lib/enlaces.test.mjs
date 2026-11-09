import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anclaDe, enlaceAPagina, esPaginaPlaneada, idsDeHtml } from './enlaces.ts';

test('una página construida se enlaza', () => {
  assert.equal(enlaceAPagina('/'), '/');
});

test('una página en lanzamiento se enlaza aunque todavía no esté construida', () => {
  assert.equal(enlaceAPagina('/servicios/video-con-drone/'), '/servicios/video-con-drone/');
  assert.equal(esPaginaPlaneada('/servicios/tienda-en-linea/'), true);
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

test('un enlace con ancla se valida por su ruta: /servicios/#audio se enlaza, una ruta inventada con ancla no', () => {
  assert.equal(enlaceAPagina('/servicios/#audio'), '/servicios/#audio');
  assert.equal(enlaceAPagina('/servicios/video-con-drone/#que-incluye'), '/servicios/video-con-drone/#que-incluye');
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
