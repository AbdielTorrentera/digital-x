import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAXIMO_PROYECTOS,
  MINIMO_PROYECTOS,
  proyectosDeNosotros,
  proyectosDelInicio,
  proyectosPublicables,
  titulosDeEjemplo,
} from './proyectos.ts';

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

const ejemplo = (n) => ({
  titulo: `Ejemplo ${n}`,
  foto: { src: `/foto-${n}.webp` },
  permiso: false,
  placeholder: true,
});

test('los proyectos de ejemplo no cuentan para el Inicio: sin permiso no se publican', () => {
  assert.deepEqual(proyectosDelInicio([ejemplo(1), ejemplo(2), ejemplo(3)]), []);
});

test('Nosotros muestra los reales con permiso y los de ejemplo, y deja fuera los que no tienen foto o permiso', () => {
  const sinFoto = { titulo: 'Sin foto', permiso: true };
  const sinPermiso = { titulo: 'Sin permiso', foto: { src: '/x.webp' }, permiso: false };
  const lista = [real(1), ejemplo(2), sinFoto, sinPermiso];
  assert.deepEqual(
    proyectosDeNosotros(lista).map((p) => p.titulo),
    ['Proyecto 1', 'Ejemplo 2'],
  );
});

test('titulosDeEjemplo lista solo los títulos de los proyectos de ejemplo', () => {
  assert.deepEqual(titulosDeEjemplo([real(1), ejemplo(2), ejemplo(3)]), ['Ejemplo 2', 'Ejemplo 3']);
  assert.deepEqual(titulosDeEjemplo([real(1)]), []);
  assert.deepEqual(titulosDeEjemplo([]), []);
});
