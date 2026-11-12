import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

// Un solo juego de íconos: Phosphor Icons (MIT), peso Regular; solo los dos flotantes van en Fill (reglas-diseno §6).
const icons = new URL('../icons/', import.meta.url);
const fuente = readFileSync(new URL('./Icon.astro', import.meta.url), 'utf8');

test('todos los íconos son archivos de Phosphor en src/icons, con su licencia MIT', () => {
  const archivos = readdirSync(icons).filter((f) => f.endsWith('.svg'));
  assert.deepEqual(archivos.sort(), [
    'arrow-up-right.svg',
    'check.svg',
    'list.svg',
    'map-pin.svg',
    'phone-fill.svg',
    'plus.svg',
    'whatsapp-logo-fill.svg',
    'x.svg',
  ]);
  const licencia = readFileSync(new URL('LICENSE-PHOSPHOR', icons), 'utf8');
  assert.match(licencia, /MIT License/);
  assert.match(licencia, /Phosphor Icons/);
  // Originales de la biblioteca: caja de 256, `currentColor`, sin colores propios.
  for (const f of archivos) {
    const svg = readFileSync(new URL(f, icons), 'utf8');
    assert.match(svg, /viewBox="0 0 256 256"/, f);
    assert.match(svg, /fill="currentColor"/, f);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,6}\b/i, `${f} trae un color propio`);
  }
});

test('Icon.astro importa solo esos archivos y la excepción Fill es solo de WhatsApp y llamada', () => {
  const importados = [...fuente.matchAll(/from '\.\.\/icons\/([^']+)\?raw'/g)].map((m) => m[1]);
  for (const f of importados) assert.ok(existsSync(new URL(f, icons)), f);
  assert.deepEqual(importados.filter((f) => f.includes('-fill')).sort(), ['phone-fill.svg', 'whatsapp-logo-fill.svg']);
  assert.doesNotMatch(fuente, /<svg viewBox/, 'no hay SVG dibujados a mano dentro de Icon.astro');
  assert.doesNotMatch(fuente, /search/, 'la lupa se eliminó');
});

test('los botones flotantes usan el mismo tamaño de ícono y el logo de WhatsApp va en blanco', () => {
  const wa = readFileSync(new URL('./WhatsApp.astro', import.meta.url), 'utf8');
  const llamar = readFileSync(new URL('./LlamarFlotante.astro', import.meta.url), 'utf8');
  assert.match(wa, /<Icon name="whatsapp" size="flotante" \/>/);
  assert.match(llamar, /<Icon name="phone" size="flotante" \/>/);
  assert.match(wa, /color: var\(--dx-blanco\)/);
});
