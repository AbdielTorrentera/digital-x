import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fechaLegible,
  MAXIMO_PROYECTOS,
  metaSeoDeProyecto,
  MINIMO_PROYECTOS,
  proyectosDeCategoria,
  proyectosDeNosotros,
  proyectosDeServicio,
  proyectosDelInicio,
  proyectosPublicables,
  tituloSeoDeProyecto,
} from './proyectos.ts';

const real = (n) => ({ titulo: `Proyecto ${n}`, foto: { src: `/foto-${n}.webp` } });

test('sin proyectos no se muestra nada', () => {
  assert.deepEqual(proyectosDelInicio([]), []);
});

test('con menos de 3 proyectos publicables la sección no se muestra', () => {
  assert.equal(MINIMO_PROYECTOS, 3);
  assert.deepEqual(proyectosDelInicio([real(1), real(2)]), []);
});

test('con 3 proyectos con foto la sección se muestra', () => {
  assert.equal(proyectosDelInicio([real(1), real(2), real(3)]).length, 3);
});

test('sin foto un proyecto no cuenta', () => {
  const sinFoto = { titulo: 'Sin foto' };
  assert.deepEqual(proyectosPublicables([sinFoto]), []);
  assert.deepEqual(proyectosDelInicio([real(1), real(2), sinFoto]), []);
});

test('no se muestran más de 4', () => {
  assert.equal(MAXIMO_PROYECTOS, 4);
  assert.equal(proyectosDelInicio([1, 2, 3, 4, 5, 6].map(real)).length, 4);
});

test('Nosotros muestra todos los que tienen foto', () => {
  const sinFoto = { titulo: 'Sin foto' };
  assert.deepEqual(
    proyectosDeNosotros([real(1), sinFoto, real(2)]).map((p) => p.titulo),
    ['Proyecto 1', 'Proyecto 2'],
  );
});

const usa = (proyecto, ...servicios) => ({ ...proyecto, servicios });

test('proyectosDeServicio trae solo los que usaron ese servicio y tienen foto', () => {
  const unServicio = usa(real(1), 'Producción de videos para eventos');
  const conDos = usa(real(2), 'Producción de videos para eventos', 'Video con drone');
  const otroServicio = usa(real(3), 'Páginas web');
  const sinFoto = usa({ titulo: 'Sin foto' }, 'Producción de videos para eventos');
  assert.deepEqual(
    proyectosDeServicio([unServicio, conDos, otroServicio, sinFoto], 'Producción de videos para eventos'),
    [unServicio, conDos],
  );
});

test('proyectosDeServicio compara el nombre exacto, no uno parecido, y no pasa de 3', () => {
  assert.deepEqual(proyectosDeServicio([usa(real(1), 'Producción de video')], 'Producción de videos para eventos'), []);
  const cinco = [1, 2, 3, 4, 5].map((n) => usa(real(n), 'Video con drone'));
  assert.equal(proyectosDeServicio(cinco, 'Video con drone').length, 3);
  assert.equal(proyectosDeServicio(cinco, 'Video con drone', 2).length, 2);
  assert.deepEqual(proyectosDeServicio([], 'Video con drone'), []);
});

test('proyectosDeCategoria trae los que usaron algún servicio de la categoría y tienen foto, y no pasa de 4', () => {
  const nombres = ['Video con drone', 'Transmisión en vivo'];
  const deLaCategoria = usa(real(1), 'Producción de videos para eventos', 'Video con drone');
  const otro = usa(real(2), 'Transmisión en vivo');
  const deOtra = usa(real(3), 'Páginas web');
  const sinFoto = usa({ titulo: 'Sin foto' }, 'Video con drone');
  assert.deepEqual(proyectosDeCategoria([deLaCategoria, otro, deOtra, sinFoto], nombres), [deLaCategoria, otro]);
  const seis = [1, 2, 3, 4, 5, 6].map((n) => usa(real(n), 'Video con drone'));
  assert.equal(proyectosDeCategoria(seis, nombres).length, 4);
  assert.deepEqual(proyectosDeCategoria([], nombres), []);
  // Un nombre parecido no cuenta: el nombre debe ser el exacto del registro.
  assert.deepEqual(proyectosDeCategoria([usa(real(1), 'Video')], nombres), []);
});

test('el título para Google es el del dueño y, si falta, «{título} en {municipio} | Digital X»', () => {
  const p = { titulo: 'Conferencia empresarial', municipio: 'Puebla' };
  assert.equal(tituloSeoDeProyecto({ ...p, seoTitle: 'Mi título | Digital X' }), 'Mi título | Digital X');
  assert.equal(tituloSeoDeProyecto(p), 'Conferencia empresarial en Puebla | Digital X');
  assert.equal(tituloSeoDeProyecto({ ...p, seoTitle: '   ' }), 'Conferencia empresarial en Puebla | Digital X');
});

test('el título automático no repite el municipio si el título ya lo nombra (sin acentos ni mayúsculas)', () => {
  assert.equal(
    tituloSeoDeProyecto({ titulo: 'Audio para evento cultural en Atlixco', municipio: 'Atlixco' }),
    'Audio para evento cultural en Atlixco | Digital X',
  );
  assert.equal(
    tituloSeoDeProyecto({ titulo: 'Sonido en IZUCAR de Matamoros', municipio: 'Izúcar de Matamoros' }),
    'Sonido en IZUCAR de Matamoros | Digital X',
  );
  assert.equal(
    tituloSeoDeProyecto({ titulo: 'Streaming', municipio: 'Izúcar de Matamoros' }),
    'Streaming en Izúcar de Matamoros | Digital X',
  );
});

test('la descripción para Google es la del dueño y, si falta, el resumen tal cual', () => {
  assert.equal(metaSeoDeProyecto({ resumen: 'Resumen.', seoMeta: 'Mi meta.' }), 'Mi meta.');
  assert.equal(metaSeoDeProyecto({ resumen: 'Resumen.' }), 'Resumen.');
  assert.equal(metaSeoDeProyecto({ resumen: 'Resumen.', seoMeta: '' }), 'Resumen.');
});

test('fechaLegible da mes y año en español sin mover el mes por la zona horaria', () => {
  assert.equal(fechaLegible('2026-03-14'), 'marzo de 2026');
  assert.equal(fechaLegible('2026-01-01'), 'enero de 2026');
  assert.equal(fechaLegible('2025-12-31'), 'diciembre de 2025');
  assert.equal(fechaLegible('rara'), 'rara');
});
