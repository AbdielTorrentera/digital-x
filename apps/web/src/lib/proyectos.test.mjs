import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAXIMO_PROYECTOS,
  MINIMO_PROYECTOS,
  proyectosDeNosotros,
  proyectosDeServicio,
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

const usa = (proyecto, ...servicios) => ({ ...proyecto, servicios });

test('proyectosDeServicio trae solo los que usaron ese servicio, con foto y con permiso o de ejemplo', () => {
  const conPermiso = usa(real(1), 'Producción de videos para eventos');
  const deEjemplo = usa({ ...ejemplo(2) }, 'Producción de videos para eventos', 'Video con drone');
  const otroServicio = usa(real(3), 'Páginas web');
  const sinPermiso = usa({ ...real(4), permiso: false }, 'Producción de videos para eventos');
  const sinFoto = usa({ titulo: 'Sin foto', permiso: true }, 'Producción de videos para eventos');
  assert.deepEqual(
    proyectosDeServicio(
      [conPermiso, deEjemplo, otroServicio, sinPermiso, sinFoto],
      'Producción de videos para eventos',
    ),
    [conPermiso, deEjemplo],
  );
});

test('proyectosDeServicio compara el nombre exacto, no uno parecido, y no pasa de 3', () => {
  assert.deepEqual(proyectosDeServicio([usa(real(1), 'Producción de video')], 'Producción de videos para eventos'), []);
  const cinco = [1, 2, 3, 4, 5].map((n) => usa(real(n), 'Video con drone'));
  assert.equal(proyectosDeServicio(cinco, 'Video con drone').length, 3);
  assert.equal(proyectosDeServicio(cinco, 'Video con drone', 2).length, 2);
  assert.deepEqual(proyectosDeServicio([], 'Video con drone'), []);
});
