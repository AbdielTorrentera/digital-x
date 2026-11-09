import { test } from 'node:test';
import assert from 'node:assert/strict';
import { actualizacion, pagina } from './privacidad.ts';

test('title y meta cumplen reglas-seo sección 1 (title ≤ 60, meta ≤ 155)', () => {
  assert.equal(pagina.title, 'Política de privacidad | Digital X');
  assert.ok(pagina.title.length <= 60);
  assert.ok(pagina.descripcion.length <= 155);
});

test('la fecha de actualización es una fecha válida y se muestra en español', () => {
  assert.match(actualizacion.iso, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(actualizacion.texto, /^\d{1,2} de [a-záéíóú]+ de \d{4}$/);
});
