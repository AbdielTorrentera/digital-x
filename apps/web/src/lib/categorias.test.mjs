import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categoriasConDestino, clientesConPermiso } from './categorias.ts';
import {
  construirCategoriasDelPie,
  construirMenu,
  destinoDeCategoria,
  MINIMO_PARA_PAGINA,
  paginas,
  paginasDeCategoria,
  serviciosConstruidos,
  urlsPublicadas,
} from './paginas.ts';
import { parrafoDeCategoria } from './servicios.ts';
import { categorias } from '../content/categorias.ts';

// Deja construidos solo `cuantos` servicios de la categoría (los primeros del registro) mientras corre `prueba`, y los
// restaura al terminar. Así se prueba la regla de las categorías con 0, 1 y 2 o más servicios.
const conConstruidos = (id, cuantos, prueba) => {
  const servicios = paginas.filter((p) => p.categoria === id);
  const antes = servicios.map((p) => p.construida);
  servicios.forEach((p, i) => (p.construida = i < cuantos));
  try {
    prueba();
  } finally {
    servicios.forEach((p, i) => (p.construida = antes[i]));
  }
};

test('hoy Audio tiene un servicio construido, Video 5 y Tecnología 4', () => {
  assert.equal(serviciosConstruidos('audio').length, 1);
  assert.equal(serviciosConstruidos('video').length, 5);
  assert.equal(serviciosConstruidos('tecnologia').length, 4);
  assert.equal(MINIMO_PARA_PAGINA, 2);
});

test('con un solo servicio construido la categoría no tiene página y lleva directo a ese servicio', () => {
  assert.equal(destinoDeCategoria('audio'), '/servicios/renta-de-audio/');
  assert.ok(!paginasDeCategoria().some((p) => p.paginaDe === 'audio'));
  assert.ok(!paginas.some((p) => p.url === '/audio/'));
  assert.ok(!urlsPublicadas.includes('/audio/'));
});

test('con dos o más servicios construidos la categoría tiene su página en /{slug}/', () => {
  assert.equal(destinoDeCategoria('video'), '/video/');
  assert.equal(destinoDeCategoria('tecnologia'), '/tecnologia/');
  assert.deepEqual(
    paginasDeCategoria().map((p) => [p.url, p.paginaDe, p.construida]),
    [
      ['/video/', 'video', true],
      ['/tecnologia/', 'tecnologia', true],
    ],
  );
  for (const url of ['/video/', '/tecnologia/']) assert.ok(urlsPublicadas.includes(url), url);
});

test('la regla sigue a los servicios: con 0, 1 y 2 construidos cambia el destino, la página, el menú y el pie', () => {
  conConstruidos('video', 0, () => {
    assert.equal(destinoDeCategoria('video'), null);
    assert.ok(!paginasDeCategoria().some((p) => p.paginaDe === 'video'));
    assert.ok(!construirMenu().some((i) => i.titulo === 'Video'), 'sin servicios no hay entrada en el menú');
    assert.ok(!construirCategoriasDelPie().some((c) => c.titulo === 'Servicios de video'));
    assert.ok(!categoriasConDestino().some((c) => c.categoria.id === 'video'));
  });
  conConstruidos('video', 1, () => {
    const unico = serviciosConstruidos('video')[0];
    assert.equal(destinoDeCategoria('video'), unico.url);
    assert.ok(!paginasDeCategoria().some((p) => p.paginaDe === 'video'));
    assert.deepEqual(
      construirMenu().find((i) => i.titulo === 'Video'),
      { titulo: 'Video', url: unico.url },
    );
    const video = categoriasConDestino().find((c) => c.categoria.id === 'video');
    assert.equal(video.directo, true);
    assert.equal(video.servicioUnico.url, unico.url);
  });
  conConstruidos('video', 2, () => {
    assert.equal(destinoDeCategoria('video'), '/video/');
    assert.ok(paginasDeCategoria().some((p) => p.url === '/video/'));
    assert.equal(categoriasConDestino().find((c) => c.categoria.id === 'video').directo, false);
  });
  // Y al terminar, todo vuelve a como estaba.
  assert.equal(destinoDeCategoria('video'), '/video/');
});

test('el menú se genera de los datos: Inicio, una entrada por categoría con destino y Nosotros; Proyectos y Blog solo si están construidas', () => {
  assert.deepEqual(
    construirMenu().map((i) => i.titulo),
    ['Inicio', 'Audio', 'Video', 'Tecnología', 'Nosotros'],
  );
  const proyectos = paginas.find((p) => p.url === '/proyectos/');
  assert.ok(proyectos && !proyectos.construida, 'Proyectos aún no está construida');
  proyectos.construida = true;
  try {
    assert.deepEqual(
      construirMenu().map((i) => i.titulo),
      ['Inicio', 'Audio', 'Video', 'Tecnología', 'Proyectos', 'Nosotros'],
    );
  } finally {
    proyectos.construida = false;
  }
});

test('categoriasConDestino sigue el orden de los datos y marca Audio como directo', () => {
  assert.deepEqual(
    categoriasConDestino().map((c) => [c.categoria.id, c.href, c.directo]),
    [
      ['audio', '/servicios/renta-de-audio/', true],
      ['video', '/video/', false],
      ['tecnologia', '/tecnologia/', false],
    ],
  );
  assert.deepEqual(
    categorias.map((c) => c.id),
    ['audio', 'video', 'tecnologia'],
  );
});

test('parrafoDeCategoria une para quién es y los nombres de sus servicios, el primero con mayúscula y enlazado solo si está construido', () => {
  const partes = parrafoDeCategoria(categorias.find((c) => c.id === 'audio'));
  const texto = partes.map((p) => p.literal ?? p.nombre).join('');
  assert.match(texto, /^Para quienes organizan fiestas.* Renta de audio y sonido, y sonorización\.$/);
  assert.deepEqual(
    partes.filter((p) => 'nombre' in p).map((p) => p.url),
    ['/servicios/renta-de-audio/', null],
  );
});

test('clientesConPermiso solo deja a los clientes que autorizaron: nunca se inventan ni se muestran sin permiso', () => {
  assert.deepEqual(clientesConPermiso([]), []);
  const clientes = [
    { nombre: 'Con permiso', permiso: true },
    { nombre: 'Sin permiso', permiso: false },
  ];
  assert.deepEqual(
    clientesConPermiso(clientes).map((c) => c.nombre),
    ['Con permiso'],
  );
  // Hoy no hay clientes con permiso en ninguna categoría: la sección no se dibuja.
  for (const categoria of categorias) assert.deepEqual(clientesConPermiso(categoria.clientes), [], categoria.id);
});
