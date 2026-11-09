import { test } from 'node:test';
import assert from 'node:assert/strict';
import { actualizacion, pagina, secciones } from './condiciones.ts';
import { lista } from '../lib/servicios.ts';

const parrafos = (titulo) =>
  secciones
    .find((s) => s.titulo === titulo)
    .bloques.filter((b) => 'parrafo' in b)
    .map((b) => b.parrafo);

test('"Aplica a" sale de la lista compartida de servicios, no de texto escrito a mano', () => {
  const [audioYVideo] = parrafos('Servicios de audio y video');
  assert.equal(audioYVideo, `Aplica a: ${lista.audio}; ${lista.video}.`);
  const [tecnologia] = parrafos('Proyectos de tecnología');
  assert.equal(tecnologia, `Aplica a: ${lista.tecnologia}.`);
});

test('title y meta cumplen reglas-seo sección 1 (title ≤ 60, meta ≤ 155)', () => {
  assert.equal(pagina.title, 'Condiciones de contratación | Digital X');
  assert.ok(pagina.title.length <= 60);
  assert.ok(pagina.descripcion.length <= 155);
});

test('la fecha de actualización es una fecha válida y se muestra en español', () => {
  assert.match(actualizacion.iso, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(actualizacion.texto, /^\d{1,2} de [a-záéíóú]+ de \d{4}$/);
});
