import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enlaceDeServicio, lista, partesDeServicios, partesDeSlugs, serviciosDe } from './servicios.ts';
import { paginas } from './paginas.ts';

test('serviciosDe lista los servicios de cada categoría con el nombre del registro, en el orden de Sanity', () => {
  assert.deepEqual(
    serviciosDe('audio').map((s) => s.titulo),
    ['Renta de audio y sonido'],
  );
  assert.deepEqual(
    serviciosDe('video').map((s) => s.titulo),
    ['Transmisión en vivo', 'Video con drone'],
  );
  assert.deepEqual(
    serviciosDe('tecnologia').map((s) => s.titulo),
    ['Páginas web'],
  );
});

test('serviciosDe marca como construido solo el servicio cuya página ya existe y está en lanzamiento', () => {
  for (const categoria of ['audio', 'video', 'tecnologia']) {
    for (const { titulo, url, slug, construida } of serviciosDe(categoria)) {
      const pagina = paginas.find((p) => p.url === url);
      assert.equal(pagina.titulo, titulo);
      assert.equal(url, `/${categoria}/${slug}/`);
      assert.equal(construida, pagina.construida && pagina.estado === 'lanzamiento', titulo);
    }
  }
});

test('enlaceDeServicio lleva a la página si está construida y, si no, no hay enlace (null)', () => {
  for (const p of paginas.filter((x) => x.categoria)) {
    const slug = p.url.split('/')[2];
    assert.equal(enlaceDeServicio(slug), p.construida ? p.url : null, slug);
  }
  // Páginas web no está construido en los datos de prueba: sin página no hay enlace.
  assert.equal(enlaceDeServicio('paginas-web'), null);
  assert.equal(enlaceDeServicio('video-con-drone'), '/video/video-con-drone/');
  assert.throws(() => enlaceDeServicio('inventado'), /no es un servicio/);
});

test('lista es el texto de los servicios que salen del registro (Inicio y condiciones)', () => {
  assert.equal(lista.video, 'transmisión en vivo y video con drone');
  assert.equal(lista.tecnologia, 'páginas web');
  assert.ok(lista.audio.startsWith('renta de audio y sonido, y '), 'la coma evita leer «audio y (sonido y …)»');
});

test('partesDeServicios da la frase en trozos, con el nombre de cada servicio y su URL solo si está construido', () => {
  const nombres = (categoria) => partesDeServicios(categoria).filter((p) => 'nombre' in p);
  assert.equal(nombres('video').length, 2);
  assert.equal(nombres('tecnologia').length, 1);
  // Audio: el servicio con página y el de `sinPagina` en Sanity, que es texto sin enlace.
  const [renta, sonorizacion] = nombres('audio');
  assert.equal(renta.nombre, 'renta de audio y sonido');
  assert.equal(renta.url, '/audio/renta-de-audio/');
  assert.equal(sonorizacion.url, null, 'un servicio sin página propia va como texto');
  // Unidos, los trozos son exactamente la frase de `lista`.
  const unido = (categoria) =>
    partesDeServicios(categoria)
      .map((p) => p.literal ?? p.nombre)
      .join('');
  for (const categoria of ['audio', 'video', 'tecnologia']) assert.equal(unido(categoria), lista[categoria]);
});

test('partesDeSlugs une los nombres del registro y enlaza cada uno a su página; sin página, queda como texto', () => {
  const urlsDe = (slugs) =>
    partesDeSlugs(slugs)
      .filter((p) => 'nombre' in p)
      .map((p) => p.url);
  assert.deepEqual(urlsDe(['renta-de-audio', 'paginas-web']), ['/audio/renta-de-audio/', null]);
  const partes = partesDeSlugs(['renta-de-audio', 'video-con-drone']);
  // El primer nombre ya lleva una "y": la coma evita leerlo como "audio y (sonido y video con drone)".
  assert.equal(partes.map((p) => p.literal ?? p.nombre).join(''), 'Renta de audio y sonido, y Video con drone');
  const tres = partesDeSlugs(['renta-de-audio', 'video-con-drone', 'streaming-para-eventos']);
  assert.equal(
    tres.map((p) => p.literal ?? p.nombre).join(''),
    'Renta de audio y sonido, Video con drone y Transmisión en vivo',
  );
  assert.throws(() => partesDeSlugs(['inventado']), /no es un servicio/);
});
