import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAXIMO_PROYECTOS, MINIMO_PROYECTOS, proyectosDelInicio, proyectosPublicables } from './proyectos.ts';

const real = (n) => ({ titulo: `Proyecto ${n}`, foto: { src: `/foto-${n}.webp` }, permiso: true });

test('sin proyectos no se muestra nada', () => {
  assert.deepEqual(proyectosDelInicio([]), []);
});

test('con menos de 3 proyectos publicables la sección no se muestra', () => {
  assert.equal(MINIMO_PROYECTOS, 3);
  assert.deepEqual(proyectosDelInicio([real(1), real(2)]), []);
});

test('con 3 proyectos con foto y permiso la sección se muestra', () => {
  assert.equal(proyectosDelInicio([real(1), real(2), real(3)]).length, 3);
});

test('sin permiso o sin foto un proyecto no cuenta', () => {
  const sinPermiso = { ...real(4), permiso: false };
  const sinFoto = { titulo: 'Sin foto', permiso: true };
  assert.deepEqual(proyectosPublicables([sinPermiso, sinFoto]), []);
  assert.deepEqual(proyectosDelInicio([real(1), real(2), sinPermiso, sinFoto]), []);
});

test('no se muestran más de 4', () => {
  assert.equal(MAXIMO_PROYECTOS, 4);
  assert.equal(proyectosDelInicio([1, 2, 3, 4, 5, 6].map(real)).length, 4);
});
