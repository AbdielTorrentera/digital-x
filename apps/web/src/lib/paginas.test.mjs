import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  archivosDe,
  enlacesEmpresa,
  enlacesLegales,
  categoriasDeServicios,
  construirEnlacesEmpresa,
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

test('el pie enlaza las 3 categorías como "Audio", "Video" y "Tecnología" (sin "Servicios de"), cada una a su destino', () => {
  assert.deepEqual(categoriasDeServicios, [
    { titulo: 'Audio', url: '/servicios/renta-de-audio/' },
    { titulo: 'Video', url: '/video/' },
    { titulo: 'Tecnología', url: '/tecnologia/' },
  ]);
  // Todo lo que el pie enlaza está en lanzamiento y construido: ya no hay catálogo ni anclas a /servicios/.
  for (const { url } of categoriasDeServicios) {
    assert.ok(urlsPublicadas.includes(url), `${url} no está publicada`);
    assert.ok(!url.startsWith('/servicios/#'), url);
  }
});

test('el pie se genera de las páginas construidas: hoy el grupo "Digital X" solo trae Nosotros y los legales van aparte', () => {
  assert.deepEqual(
    enlacesEmpresa.map((p) => [p.titulo, p.url]),
    [['Nosotros', '/nosotros/']],
  );
  assert.deepEqual(
    enlacesLegales.map((p) => [p.titulo, p.url]),
    [
      ['Condiciones de contratación', '/condiciones-de-contratacion/'],
      ['Política de privacidad', '/politica-de-privacidad/'],
    ],
  );
  // Nunca una página sin construir (ni Proyectos ni Blog mientras no existan): todo lo que el pie enlaza está construido.
  for (const { url } of [...enlacesEmpresa, ...enlacesLegales, ...categoriasDeServicios]) {
    const pagina = paginas.find((p) => p.url === url);
    assert.ok(pagina && visible(pagina), `${url} está en el pie sin estar construida`);
  }
  assert.ok(!enlacesEmpresa.some((p) => p.url === '/proyectos/' || p.url === '/blog/'));
});

test('Proyectos y Blog aparecen en el pie solos cuando se construyen', () => {
  const proyectos = paginas.find((p) => p.url === '/proyectos/');
  assert.ok(proyectos && !proyectos.construida);
  proyectos.construida = true;
  try {
    assert.deepEqual(
      construirEnlacesEmpresa().map((p) => p.url),
      ['/proyectos/', '/nosotros/'],
    );
  } finally {
    proyectos.construida = false;
  }
  assert.deepEqual(
    construirEnlacesEmpresa().map((p) => p.url),
    ['/nosotros/'],
  );
});

test('el menú es Inicio · Audio · Video · Tecnología · Nosotros, generado de los datos, sin "Servicios" ni páginas sin construir', () => {
  assert.deepEqual(
    menu.map((i) => [i.titulo, i.url]),
    [
      ['Inicio', '/'],
      ['Audio', '/servicios/renta-de-audio/'],
      ['Video', '/video/'],
      ['Tecnología', '/tecnologia/'],
      ['Nosotros', '/nosotros/'],
    ],
  );
  // Cada entrada solo aparece cuando su página está construida: nunca una pendiente ni una planeada sin construir.
  for (const { url } of menu) {
    const pagina = paginas.find((p) => p.url === url);
    assert.ok(pagina, `${url} no está en el registro`);
    assert.ok(visible(pagina), `${url} está en el menú sin estar construida`);
  }
  assert.ok(!menu.some((i) => i.url === '/blog/'), 'Blog no se publica todavía');
  assert.ok(!menu.some((i) => i.url === '/proyectos/'), 'Proyectos entra cuando se construya');
  assert.ok(!menu.some((i) => i.url === '/servicios/'), 'ya no hay página de Servicios');
});

test('archivosDe da las rutas posibles del archivo de cada página', () => {
  assert.deepEqual(archivosDe('/'), ['index.astro', 'index/index.astro']);
  assert.deepEqual(archivosDe('/nosotros/'), ['nosotros.astro', 'nosotros/index.astro']);
  // Los servicios salen de la ruta dinámica pages/servicios/[slug].astro.
  assert.deepEqual(archivosDe('/servicios/renta-de-audio/'), [
    'servicios/renta-de-audio.astro',
    'servicios/renta-de-audio/index.astro',
    'servicios/[slug].astro',
  ]);
  // Y las categorías con página, de pages/[categoria].astro.
  assert.deepEqual(archivosDe('/video/'), ['video.astro', 'video/index.astro', '[categoria].astro']);
});

const servicios = paginas.filter((p) => p.categoria);

test('hay 10 servicios, todos en "lanzamiento", y todos están construidos', () => {
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
      '/servicios/recorridos-virtuales-360/',
      '/servicios/paginas-web/',
      '/servicios/tienda-en-linea/',
      '/servicios/aplicaciones-moviles/',
      '/servicios/desarrollo-de-software/',
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

test('"Ver servicios" (portada y 404) va a la sección de servicios del Inicio: /servicios/ ya no existe', () => {
  assert.equal(urlVerServicios, '/#servicios');
  assert.ok(!paginas.some((p) => p.url === '/servicios/'));
});
