import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  archivosDe,
  enlacesEmpresa,
  enlacesLegales,
  categoriasDeServicios,
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

test('el pie enlaza las 3 secciones del catálogo, en orden', () => {
  assert.deepEqual(categoriasDeServicios, [
    { titulo: 'Servicios de audio', url: '/servicios/#audio' },
    { titulo: 'Servicios de video', url: '/servicios/#video' },
    { titulo: 'Servicios de tecnología', url: '/servicios/#tecnologia' },
  ]);
  // Ya no son páginas: cada una es una sección de /servicios/, que sí está en lanzamiento.
  for (const { url } of categoriasDeServicios)
    assert.ok(urlsPlaneadas.includes(url.split('#')[0]), `${url} no está en lanzamiento`);
});

test('el grupo "Digital X" del pie enlaza Proyectos y Nosotros, y los legales van aparte', () => {
  assert.deepEqual(
    enlacesEmpresa.map((p) => [p.titulo, p.url]),
    [
      ['Proyectos', '/proyectos/'],
      ['Nosotros', '/nosotros/'],
    ],
  );
  assert.deepEqual(
    enlacesLegales.map((p) => [p.titulo, p.url]),
    [
      ['Condiciones de contratación', '/condiciones-de-contratacion/'],
      ['Política de privacidad', '/politica-de-privacidad/'],
    ],
  );
  // Nunca el Blog mientras esté pendiente, y todo lo que el pie enlaza está en lanzamiento.
  for (const { url } of [...enlacesEmpresa, ...enlacesLegales])
    assert.ok(urlsPlaneadas.includes(url), `${url} no está en lanzamiento`);
});

test('el menú enlaza páginas planeadas, en este orden, y nunca una pendiente de material', () => {
  assert.deepEqual(
    menu.map((i) => i.url),
    ['/', '/servicios/', '/proyectos/', '/nosotros/'],
  );
  for (const { url } of menu) assert.ok(urlsPlaneadas.includes(url), `${url} está en el menú sin estar en lanzamiento`);
  assert.ok(!menu.some((i) => i.url === '/blog/'), 'Blog no se publica todavía');
});

test('archivosDe da las rutas posibles del archivo de cada página', () => {
  assert.deepEqual(archivosDe('/'), ['index.astro', 'index/index.astro']);
  assert.deepEqual(archivosDe('/servicios/'), ['servicios.astro', 'servicios/index.astro']);
  // Los servicios salen de la ruta dinámica pages/servicios/[slug].astro.
  assert.deepEqual(archivosDe('/servicios/renta-de-audio/'), [
    'servicios/renta-de-audio.astro',
    'servicios/renta-de-audio/index.astro',
    'servicios/[slug].astro',
  ]);
});

const servicios = paginas.filter((p) => p.categoria);

test('hay 10 servicios, todos en "lanzamiento", y solo renta de audio, circuito cerrado, video, streaming y drone están construidos', () => {
  assert.equal(servicios.length, 10);
  for (const p of servicios) assert.equal(p.estado, 'lanzamiento', p.url);
  assert.deepEqual(
    servicios.filter((p) => p.construida).map((p) => p.url),
    [
      '/servicios/renta-de-audio/',
      '/servicios/circuito-cerrado-para-eventos/',
      '/servicios/video-para-eventos/',
      '/servicios/streaming-para-eventos/',
      '/servicios/video-con-drone/',
    ],
  );
});

test('los servicios son los oficiales: ni uno más ni uno menos', () => {
  assert.deepEqual(servicios.map((p) => p.url).sort(), [
    '/servicios/aplicaciones-moviles/',
    '/servicios/circuito-cerrado-para-eventos/',
    '/servicios/desarrollo-de-software/',
    '/servicios/paginas-web/',
    '/servicios/recorridos-virtuales-360/',
    '/servicios/renta-de-audio/',
    '/servicios/streaming-para-eventos/',
    '/servicios/tienda-en-linea/',
    '/servicios/video-con-drone/',
    '/servicios/video-para-eventos/',
  ]);
});

test('los servicios eliminados ya no están en el registro', () => {
  const urls = paginas.map((p) => p.url);
  for (const url of [
    '/servicios-de-audio/',
    '/servicios-de-video/',
    '/servicios-de-tecnologia/',
    '/servicios-de-audio/renta-de-audio/',
    '/servicios-de-audio/renta-de-sonido/',
    '/servicios-de-audio/instalacion-de-audio/',
    '/servicios-de-video/video-para-redes/',
    '/servicios-de-tecnologia/software-a-la-medida/',
    '/servicios-de-tecnologia/sitios-web/',
  ]) {
    assert.ok(!urls.includes(url), `${url} debería haberse eliminado`);
  }
});

test('no hay página de contacto: /contacto/ no está en el registro, el menú ni el pie', () => {
  assert.ok(!paginas.some((p) => p.url === '/contacto/'));
  assert.ok(![...menu, ...enlacesEmpresa, ...enlacesLegales].some((i) => i.url === '/contacto/'));
});

test('toda URL cumple el formato de estructura §2: minúsculas, sin acentos, con barra final y los servicios en /servicios/{slug}/', () => {
  for (const p of paginas) {
    assert.match(p.url, /^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/, `formato de ${p.url}`);
    if (p.categoria) assert.match(p.url, /^\/servicios\/[a-z0-9-]+\/$/, `${p.url} no es /servicios/{slug}/`);
  }
  assert.equal(new Set(paginas.map((p) => p.url)).size, paginas.length, 'URLs repetidas');
});

test('urlsPlaneadas son las de lanzamiento (construidas o no) y urlsSinConstruir las que aún no existen', () => {
  assert.ok(urlsPlaneadas.includes('/servicios/video-con-drone/'));
  assert.ok(urlsPublicadas.every((url) => urlsPlaneadas.includes(url)));
  assert.ok(urlsSinConstruir.every((url) => urlsPlaneadas.includes(url) && !urlsPublicadas.includes(url)));
  assert.equal(urlsPlaneadas.length, urlsPublicadas.length + urlsSinConstruir.length);
  // Las pendientes de material nunca son planeadas.
  for (const p of paginas.filter((x) => x.estado === 'pendiente')) assert.ok(!urlsPlaneadas.includes(p.url));
});

test('"Ver servicios" de la 404 va a la sección del Inicio mientras /servicios/ no exista', () => {
  assert.equal(urlVerServicios, urlsPublicadas.includes('/servicios/') ? '/servicios/' : '/#servicios');
});
