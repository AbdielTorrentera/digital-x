import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enlaceAPagina, esPaginaPlaneada } from './enlaces.ts';

test('una página construida se enlaza', () => {
  assert.equal(enlaceAPagina('/'), '/');
});

test('una página en lanzamiento se enlaza aunque todavía no esté construida', () => {
  assert.equal(enlaceAPagina('/servicios-de-audio/renta-de-audio/'), '/servicios-de-audio/renta-de-audio/');
  assert.equal(esPaginaPlaneada('/servicios-de-tecnologia/tienda-en-linea/'), true);
});

test('una página pendiente de material nunca se enlaza, aunque esté en el registro', () => {
  assert.throws(() => enlaceAPagina('/blog/'), /no se puede enlazar/);
  assert.equal(esPaginaPlaneada('/blog/'), false);
});

test('una URL que no está en el registro tampoco se enlaza', () => {
  assert.throws(() => enlaceAPagina('/servicios-de-audio/renta-de-sonido/'), /no se puede enlazar/);
  assert.equal(esPaginaPlaneada('/servicios-de-audio/renta-de-sonido/'), false);
  assert.equal(esPaginaPlaneada('/inventada/'), false);
});
