import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

// Un solo juego de íconos: Phosphor Icons (MIT), Regular en todos; Bold solo en el teléfono flotante; Fill, nunca.
// Única excepción: el logo de WhatsApp, glifo oficial de la marca de Simple Icons (CC0). Ver reglas-diseno §6.
const icons = new URL('../icons/', import.meta.url);
const fuente = readFileSync(new URL('./Icon.astro', import.meta.url), 'utf8');
const MARCA = 'whatsapp-simple-icons.svg';

test('los íconos son archivos de Phosphor en src/icons, con su licencia MIT; solo el logo de WhatsApp es de otra fuente', () => {
  const archivos = readdirSync(icons).filter((f) => f.endsWith('.svg'));
  assert.deepEqual(archivos.sort(), [
    'arrow-up-right.svg',
    'check.svg',
    'list.svg',
    'map-pin.svg',
    'phone-bold.svg',
    'plus.svg',
    MARCA,
    'x.svg',
  ]);
  const licencia = readFileSync(new URL('LICENSE-PHOSPHOR', icons), 'utf8');
  assert.match(licencia, /MIT License/);
  assert.match(licencia, /Phosphor Icons/);
  // Originales de Phosphor: caja de 256, `currentColor`, sin colores propios.
  for (const f of archivos.filter((x) => x !== MARCA)) {
    const svg = readFileSync(new URL(f, icons), 'utf8');
    assert.match(svg, /viewBox="0 0 256 256"/, f);
    assert.match(svg, /fill="currentColor"/, f);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,6}\b/i, `${f} trae un color propio`);
  }
});

test('el logo de WhatsApp es el glifo oficial de Simple Icons (CC0): caja de 24, currentColor, una sola forma, con su licencia', () => {
  const svg = readFileSync(new URL(MARCA, icons), 'utf8');
  assert.match(svg, /^<svg viewBox="0 0 24 24"[^>]*fill="currentColor">/);
  assert.equal((svg.match(/<path /g) ?? []).length, 1, 'el glifo no se redibuja ni se le agregan formas');
  assert.match(svg, /d="M17\.472 14\.382c-\.297-\.149/, 'el trazo es el original de Simple Icons');
  assert.doesNotMatch(svg, /#[0-9a-f]{3,6}\b/i);
  const licencia = readFileSync(new URL('LICENSE-SIMPLE-ICONS', icons), 'utf8');
  assert.match(licencia, /Simple Icons/);
  assert.match(licencia, /CC0 1\.0/);
});

test('Icon.astro importa solo esos archivos: Bold solo en llamada, la marca solo en WhatsApp y ninguno en Fill', () => {
  const importados = [...fuente.matchAll(/from '\.\.\/icons\/([^']+)\?raw'/g)].map((m) => m[1]);
  for (const f of importados) assert.ok(existsSync(new URL(f, icons)), f);
  assert.deepEqual(
    importados.filter((f) => f.includes('-fill')),
    [],
    'ningún ícono va en peso Fill',
  );
  assert.deepEqual(
    importados.filter((f) => f.includes('-bold')),
    ['phone-bold.svg'],
  );
  assert.deepEqual(
    importados.filter((f) => f.includes('simple-icons')),
    [MARCA],
  );
  assert.match(fuente, /import whatsapp from '\.\.\/icons\/whatsapp-simple-icons\.svg\?raw'/);
  assert.doesNotMatch(fuente, /<svg viewBox/, 'no hay SVG dibujados a mano dentro de Icon.astro');
  assert.doesNotMatch(fuente, /search/, 'la lupa se eliminó');
});

test('los botones flotantes: ícono del mismo tamaño de token, logo de WhatsApp en blanco sobre #1D9446', () => {
  const wa = readFileSync(new URL('./WhatsApp.astro', import.meta.url), 'utf8');
  const llamar = readFileSync(new URL('./LlamarFlotante.astro', import.meta.url), 'utf8');
  const tokens = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8');
  assert.match(wa, /<Icon name="whatsapp" size="flotante" \/>/);
  assert.match(llamar, /<Icon name="phone" size="flotante" \/>/);
  assert.match(wa, /color: var\(--dx-blanco\)/);
  assert.match(tokens, /--dx-whatsapp: #1d9446;/);
});
