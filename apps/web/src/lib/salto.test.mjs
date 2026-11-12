import { test } from 'node:test';
import assert from 'node:assert/strict';
import { posicionParaCentrar } from './salto.ts';

const barra = { barraAncho: 328, scrollAncho: 700 };

test('centra el enlace activo en la barra', () => {
  // Un enlace de 100 px que empieza en 300: queda centrado en la barra de 328 px (300 - 114).
  assert.equal(posicionParaCentrar({ ...barra, izquierda: 300, ancho: 100 }), 186);
});

test('el primer enlace no pasa del inicio y el último no pasa del final', () => {
  assert.equal(posicionParaCentrar({ ...barra, izquierda: 4, ancho: 90 }), 0);
  assert.equal(posicionParaCentrar({ ...barra, izquierda: 600, ancho: 96 }), 700 - 328);
});

test('si la barra cabe completa no hay nada que desplazar', () => {
  assert.equal(posicionParaCentrar({ barraAncho: 600, scrollAncho: 600, izquierda: 200, ancho: 100 }), 0);
});
