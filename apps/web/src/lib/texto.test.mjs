import { test } from 'node:test';
import assert from 'node:assert/strict';
import { comoTexto } from './texto.ts';

test('comoTexto deja un texto sin enlaces tal cual', () => {
  assert.equal(comoTexto('Sin enlaces.'), 'Sin enlaces.');
});

test('comoTexto une los trozos y solo deja el texto de los enlaces, a un servicio o a una página', () => {
  assert.equal(
    comoTexto([
      'Una ',
      { slug: 'paginas-web', texto: 'página web' },
      ' o las ',
      { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
      '.',
    ]),
    'Una página web o las condiciones de contratación.',
  );
  assert.equal(comoTexto([]), '');
});
