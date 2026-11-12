import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Contrato del apilado de tarjetas del Inicio (sections/Servicios.astro). La comprobación con clic real en el navegador
// vive en scripts/verificar-botones-servicios.mjs (necesita Chrome); aquí se vigilan en CI las reglas que la sostienen.
const fuente = readFileSync(new URL('./Servicios.astro', import.meta.url), 'utf8');
const estilos = fuente.slice(fuente.indexOf('<style>'));

test('el espacio entre tarjetas deja cada botón a la vista antes de que la siguiente lo cubra (dvh, no 20 px fijos)', () => {
  const bloque = estilos.match(/\.services__stack\s*\{[^}]*\}/)[0];
  assert.match(bloque, /gap:\s*clamp\(20px,\s*45dvh,\s*480px\)/);
});

test('el botón de la tarjeta es decorativo y deja pasar el clic al enlace de SU tarjeta', () => {
  assert.match(estilos, /\.svc :global\(\.svc__boton\)\s*\{\s*pointer-events:\s*none;/);
  assert.match(
    fuente,
    /<Btn class="svc__boton" label=\{s\.boton\} variant="secondary" \/>/,
    'el botón no lleva href propio',
  );
  // Un solo enlace extendido por tarjeta, dentro de su <article> (sticky, con su propio contexto de apilado).
  assert.equal((fuente.match(/class="svc__enlace"/g) ?? []).length, 1);
  assert.match(estilos, /\.svc__enlace::after\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;/);
});

test('con movimiento reducido las tarjetas van una debajo de otra, sin espacio extra ni desplazamiento', () => {
  const reducido = estilos.slice(estilos.indexOf('prefers-reduced-motion'));
  assert.match(reducido, /\.services__stack\s*\{\s*gap:\s*20px;/);
  // `top` vuelve a auto (también en la tercera tarjeta, que lo cambia en móvil): en relative desplazaría la tarjeta.
  assert.match(reducido, /\.svc,\s*\.svc:nth-child\(3\)\s*\{\s*position:\s*relative;\s*top:\s*auto;/);
});
