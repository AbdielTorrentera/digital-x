import { test } from 'node:test';
import assert from 'node:assert/strict';
import { actualizacion } from './privacidad.ts';

test('la fecha de actualización es una fecha válida y se muestra en español', () => {
  assert.match(actualizacion.iso, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(actualizacion.texto, /^\d{1,2} de [a-záéíóú]+ de \d{4}$/);
});
