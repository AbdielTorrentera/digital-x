import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enlaceDeServicio, lista, partesDeServicios, partesDeSlugs, serviciosDe } from './servicios.ts';
import { paginas } from './paginas.ts';

test('serviciosDe lista los servicios de cada categoría con el nombre del registro, en el orden del catálogo', () => {
  assert.deepEqual(
    serviciosDe('audio').map((s) => s.titulo),
    ['Renta de audio y sonido'],
  );
  assert.deepEqual(
    serviciosDe('video').map((s) => s.titulo),
    [
      'Circuito cerrado para eventos',
      'Producción de videos para eventos',
      'Transmisión en vivo',
      'Video con drone',
      'Recorridos virtuales 360',
    ],
  );
  assert.deepEqual(
    serviciosDe('tecnologia').map((s) => s.titulo),
    ['Páginas web', 'Tienda en línea', 'Desarrollo de aplicaciones móviles', 'Desarrollo de software'],
  );
});

test('serviciosDe marca como construido solo el servicio cuya página ya existe y está en lanzamiento', () => {
  for (const categoria of ['audio', 'video', 'tecnologia']) {
    for (const { titulo, url, slug, construida } of serviciosDe(categoria)) {
      const pagina = paginas.find((p) => p.url === url);
      assert.equal(pagina.titulo, titulo);
      assert.equal(url, `/servicios/${slug}/`);
      assert.equal(construida, pagina.construida && pagina.estado === 'lanzamiento', titulo);
    }
  }
});

test('enlaceDeServicio lleva a la página si está construida y, si no, a su tarjeta del catálogo', () => {
  for (const p of paginas.filter((x) => x.categoria)) {
    const slug = p.url.split('/')[2];
    assert.equal(enlaceDeServicio(slug), p.construida ? p.url : `/servicios/#${slug}`, slug);
  }
  assert.throws(() => enlaceDeServicio('inventado'), /no es un servicio/);
});

test('lista es el texto de los servicios que salen del registro (Inicio y condiciones)', () => {
  assert.equal(lista.audio, 'renta de audio y sonido, y sonorización');
  assert.equal(
    lista.video,
    'circuito cerrado para eventos, producción de videos para eventos, transmisión en vivo, video con drone y recorridos virtuales 360',
  );
  assert.equal(
    lista.tecnologia,
    'páginas web, tienda en línea, desarrollo de aplicaciones móviles y desarrollo de software',
  );
});

test('partesDeServicios da la frase en trozos, con el nombre de cada servicio y su URL solo si está construido', () => {
  const nombres = (categoria) => partesDeServicios(categoria).filter((p) => 'nombre' in p);
  assert.equal(nombres('video').length, 5);
  assert.equal(nombres('tecnologia').length, 4);
  // Audio: el servicio con página y la sonorización, que es texto sin enlace.
  const [renta, sonorizacion] = nombres('audio');
  assert.equal(renta.nombre, 'renta de audio y sonido');
  assert.equal(
    renta.url,
    paginas.find((p) => p.url === '/servicios/renta-de-audio/').construida ? '/servicios/renta-de-audio/' : null,
  );
  assert.deepEqual(sonorizacion, { nombre: 'sonorización', url: null });
  // Unidos, los trozos son exactamente la frase de `lista`.
  const unido = (categoria) =>
    partesDeServicios(categoria)
      .map((p) => p.literal ?? p.nombre)
      .join('');
  for (const categoria of ['audio', 'video', 'tecnologia']) assert.equal(unido(categoria), lista[categoria]);
});

test('partesDeSlugs une los nombres del registro y enlaza cada uno a su página o a su tarjeta del catálogo', () => {
  // Un servicio sin página (video-para-eventos) va a su tarjeta; uno construido, a su página.
  assert.deepEqual(
    partesDeSlugs(['renta-de-audio', 'video-para-eventos'])
      .filter((p) => 'nombre' in p)
      .map((p) => p.url),
    ['/servicios/renta-de-audio/', '/servicios/#video-para-eventos'],
  );
  const partes = partesDeSlugs(['renta-de-audio', 'circuito-cerrado-para-eventos']);
  const texto = partes.map((p) => p.literal ?? p.nombre).join('');
  // El primer nombre ya lleva una "y": la coma evita leerlo como "audio y (sonido y circuito cerrado)".
  assert.equal(texto, 'Renta de audio y sonido, y Circuito cerrado para eventos');
  assert.deepEqual(
    partes.filter((p) => 'nombre' in p).map((p) => p.url),
    ['/servicios/renta-de-audio/', '/servicios/circuito-cerrado-para-eventos/'],
  );
  const tres = partesDeSlugs(['renta-de-audio', 'circuito-cerrado-para-eventos', 'video-para-eventos']);
  assert.equal(
    tres.map((p) => p.literal ?? p.nombre).join(''),
    'Renta de audio y sonido, Circuito cerrado para eventos y Producción de videos para eventos',
  );
  assert.throws(() => partesDeSlugs(['inventado']), /no es un servicio/);
});
