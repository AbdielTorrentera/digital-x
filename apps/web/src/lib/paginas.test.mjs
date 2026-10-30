import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  archivosDe,
  enlacesDe404,
  enlacesInformacion,
  gruposDeServicios,
  menu,
  paginas,
  urlsConstruidas,
  urlsPublicadas,
  visible,
} from './paginas.ts';

const base = { url: '/x/', titulo: 'X' };

test('visible: solo una página en lanzamiento y construida se muestra', () => {
  assert.equal(visible({ ...base, estado: 'lanzamiento', construida: true }), true);
  assert.equal(visible({ ...base, estado: 'lanzamiento', construida: false }), false);
});

test('visible: una página pendiente nunca se muestra, aunque ya esté construida', () => {
  assert.equal(visible({ ...base, estado: 'pendiente', construida: true }), false);
  assert.equal(visible({ ...base, estado: 'pendiente', construida: false }), false);
});

test('urlsPublicadas solo tiene páginas en lanzamiento y construidas', () => {
  for (const url of urlsPublicadas) {
    const p = paginas.find((x) => x.url === url);
    assert.ok(p, `${url} no está en el registro`);
    assert.equal(p.estado, 'lanzamiento');
    assert.equal(p.construida, true);
  }
  assert.ok(urlsPublicadas.every((url) => urlsConstruidas.includes(url)));
});

test('menú, pie y 404 solo enlazan páginas publicadas', () => {
  const publicadas = new Set(urlsPublicadas);
  const deMenu = menu.flatMap((i) => [
    i.url,
    ...(i.grupos ?? []).flatMap((g) => [g.hub?.url, ...g.servicios.map((s) => s.url)]),
  ]);
  const deGrupos = gruposDeServicios.flatMap((g) => [g.hub?.url, ...g.servicios.map((s) => s.url)]);
  const todas = [...deMenu, ...deGrupos, ...enlacesInformacion.map((p) => p.url), ...enlacesDe404.map((p) => p.url)];
  for (const url of todas.filter(Boolean))
    assert.ok(publicadas.has(url), `${url} aparece en la navegación sin estar publicada`);
});

test('archivosDe da las rutas posibles del archivo de cada página', () => {
  assert.deepEqual(archivosDe('/'), ['index.astro', 'index/index.astro']);
  assert.deepEqual(archivosDe('/servicios/'), ['servicios.astro', 'servicios/index.astro']);
  assert.deepEqual(archivosDe('/servicios-de-audio/renta-de-sonido/'), [
    'servicios-de-audio/renta-de-sonido.astro',
    'servicios-de-audio/renta-de-sonido/index.astro',
  ]);
});
