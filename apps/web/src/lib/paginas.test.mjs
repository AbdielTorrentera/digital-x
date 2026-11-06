import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  archivosDe,
  enlacesInformacion,
  gruposDeServicios,
  menu,
  paginas,
  urlsConstruidas,
  urlsPlaneadas,
  urlsPublicadas,
  urlsSinConstruir,
  urlVerServicios,
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

test('el pie solo enlaza páginas publicadas', () => {
  const publicadas = new Set(urlsPublicadas);
  const deGrupos = gruposDeServicios.flatMap((g) => [g.hub?.url, ...g.servicios.map((s) => s.url)]);
  const todas = [...deGrupos, ...enlacesInformacion.map((p) => p.url)];
  for (const url of todas.filter(Boolean))
    assert.ok(publicadas.has(url), `${url} aparece en el pie sin estar publicada`);
});

test('el menú enlaza páginas planeadas, en este orden, y nunca una pendiente de material', () => {
  assert.deepEqual(
    menu.map((i) => i.url),
    ['/', '/servicios/', '/proyectos/', '/nosotros/', '/contacto/'],
  );
  for (const { url } of menu) assert.ok(urlsPlaneadas.includes(url), `${url} está en el menú sin estar en lanzamiento`);
  assert.ok(!menu.some((i) => i.url === '/blog/'), 'Blog no se publica todavía');
});

test('archivosDe da las rutas posibles del archivo de cada página', () => {
  assert.deepEqual(archivosDe('/'), ['index.astro', 'index/index.astro']);
  assert.deepEqual(archivosDe('/servicios/'), ['servicios.astro', 'servicios/index.astro']);
  assert.deepEqual(archivosDe('/servicios-de-audio/renta-de-audio/'), [
    'servicios-de-audio/renta-de-audio.astro',
    'servicios-de-audio/renta-de-audio/index.astro',
  ]);
});

const servicios = paginas.filter((p) => p.categoria && !p.hub);

test('hay 10 servicios, todos en "lanzamiento", y ninguno construido todavía', () => {
  assert.equal(servicios.length, 10);
  for (const p of servicios) assert.equal(p.estado, 'lanzamiento', p.url);
});

test('los servicios son los oficiales: ni uno más ni uno menos', () => {
  assert.deepEqual(servicios.map((p) => p.url).sort(), [
    '/servicios-de-audio/renta-de-audio/',
    '/servicios-de-tecnologia/apps-moviles/',
    '/servicios-de-tecnologia/desarrollo-de-software/',
    '/servicios-de-tecnologia/paginas-web/',
    '/servicios-de-tecnologia/tienda-en-linea/',
    '/servicios-de-video/circuito-cerrado/',
    '/servicios-de-video/dron/',
    '/servicios-de-video/grabacion-de-eventos/',
    '/servicios-de-video/recorridos-360/',
    '/servicios-de-video/streaming/',
  ]);
});

test('los servicios eliminados ya no están en el registro', () => {
  const urls = paginas.map((p) => p.url);
  for (const url of [
    '/servicios-de-audio/renta-de-sonido/',
    '/servicios-de-audio/instalacion-de-audio/',
    '/servicios-de-video/video-para-redes/',
    '/servicios-de-tecnologia/software-a-la-medida/',
    '/servicios-de-tecnologia/sitios-web/',
  ]) {
    assert.ok(!urls.includes(url), `${url} debería haberse eliminado`);
  }
});

test('toda URL cumple el formato de estructura §2: minúsculas, sin acentos, con barra final y prefijo de su categoría', () => {
  for (const p of paginas) {
    assert.match(p.url, /^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/, `formato de ${p.url}`);
    if (p.categoria) assert.ok(p.url.startsWith(`/servicios-de-${p.categoria}/`), `${p.url} no cuelga de su categoría`);
  }
  assert.equal(new Set(paginas.map((p) => p.url)).size, paginas.length, 'URLs repetidas');
});

test('urlsPlaneadas son las de lanzamiento (construidas o no) y urlsSinConstruir las que aún no existen', () => {
  assert.ok(urlsPlaneadas.includes('/servicios-de-audio/renta-de-audio/'));
  assert.ok(urlsPublicadas.every((url) => urlsPlaneadas.includes(url)));
  assert.ok(urlsSinConstruir.every((url) => urlsPlaneadas.includes(url) && !urlsPublicadas.includes(url)));
  assert.equal(urlsPlaneadas.length, urlsPublicadas.length + urlsSinConstruir.length);
  // Las pendientes de material nunca son planeadas.
  for (const p of paginas.filter((x) => x.estado === 'pendiente')) assert.ok(!urlsPlaneadas.includes(p.url));
});

test('"Ver servicios" de la 404 va a la sección del Inicio mientras /servicios/ no exista', () => {
  assert.equal(urlVerServicios, urlsPublicadas.includes('/servicios/') ? '/servicios/' : '/#servicios');
});
