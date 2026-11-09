import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categorias, hub } from './servicios.ts';
import { mensajesWhatsApp } from '../lib/negocio.ts';
import { categoriasDeServicios, paginas, urlsPlaneadas } from '../lib/paginas.ts';

const todas = Object.values(categorias);
const paginasDelTema = [hub, ...todas];

// Todo el texto que se ve en las páginas, en bloques (para revisar reglas de vocabulario).
const bloques = [
  hub.intro,
  ...hub.categorias.map((c) => c.para),
  hub.contacto.texto,
  ...todas.flatMap((c) => [
    ...c.ficha.map((f) => f.valor),
    ...c.queHacemos.parrafos,
    ...c.servicios.items.map((s) => s.frase),
    ...c.tambien.items.map((t) => t.texto),
    c.cotizacion.texto,
    ...c.faq.items.flatMap((f) => [f.pregunta, f.respuesta]),
  ]),
];

test('title y meta cumplen reglas-seo sección 1 (title ≤ 60, meta ≤ 155) y no se repiten', () => {
  for (const p of paginasDelTema) {
    assert.ok(p.title.length <= 60, `title de ${p.title} mide ${p.title.length}`);
    assert.ok(p.descripcion.length <= 155, `meta de ${p.title} mide ${p.descripcion.length}`);
    assert.ok(p.title.endsWith(' | Digital X'), p.title);
    assert.ok(p.h1.includes('Puebla'), `el H1 de ${p.title} nombra Puebla`);
  }
  for (const campo of ['title', 'descripcion', 'h1']) {
    const valores = paginasDelTema.map((p) => p[campo]);
    assert.equal(new Set(valores).size, valores.length, `${campo} repetido`);
  }
});

test('hay una categoría por cada página de categoría del registro, con su URL, nombre y contador', () => {
  assert.deepEqual(
    hub.categorias.map((c) => [c.url, c.titulo]),
    categoriasDeServicios.map((c) => [c.url, c.titulo]),
  );
  hub.categorias.forEach((c, i) => {
    const datos = categorias[c.categoria];
    assert.equal(datos.url, c.url);
    assert.equal(datos.nombre, c.titulo);
    assert.equal(datos.contador, c.contador);
    assert.equal(c.contador, `/${i + 1}`);
  });
});

test('cada categoría describe todos sus servicios del registro, una vez y en orden', () => {
  for (const c of todas) {
    const esperados = paginas.filter((p) => p.categoria === c.categoria && !p.hub).map((p) => p.url);
    assert.deepEqual(
      c.servicios.items.map((s) => s.url),
      esperados,
      c.nombre,
    );
    for (const s of c.servicios.items) assert.ok(s.frase.length > 0, s.url);
  }
});

test('los enlaces relacionados van a páginas en lanzamiento, nunca a la propia categoría', () => {
  for (const c of todas) {
    for (const t of c.tambien.items) {
      assert.ok(urlsPlaneadas.includes(t.url), `${t.url} no está en lanzamiento`);
      assert.notEqual(t.url, c.url);
    }
    assert.ok(
      c.tambien.items.some((t) => t.url === '/proyectos/'),
      `${c.nombre} enlaza /proyectos/`,
    );
  }
});

test('Audio y Video se enlazan entre sí y Video y Tecnología también (estructura SEO §4)', () => {
  const destinos = (c) => categorias[c].tambien.items.map((t) => t.url);
  assert.ok(destinos('audio').includes('/servicios-de-video/'));
  assert.ok(destinos('video').includes('/servicios-de-audio/'));
  assert.ok(destinos('video').includes('/servicios-de-tecnologia/'));
  assert.ok(destinos('tecnologia').includes('/servicios-de-video/'));
});

test('cada categoría tiene 3 filas de ficha y entre 3 y 4 preguntas propias, sin repetirse entre categorías', () => {
  const preguntas = todas.flatMap((c) => c.faq.items.map((f) => f.pregunta));
  for (const c of todas) {
    assert.equal(c.ficha.length, 3, c.nombre);
    assert.ok(c.faq.items.length >= 3 && c.faq.items.length <= 4, c.nombre);
  }
  assert.equal(new Set(preguntas).size, preguntas.length);
});

test('el circuito cerrado se explica con pantallas y nunca con "no graba" ni como cámaras de seguridad', () => {
  for (const texto of bloques) {
    assert.ok(!/no graba|ni graba/i.test(texto), `"no graba" en: ${texto}`);
    // Las preguntas solo nombran el servicio; su respuesta es la que lo explica.
    if (texto.startsWith('¿')) continue;
    assert.ok(!/cámaras de seguridad/i.test(texto), `cámaras de seguridad en: ${texto}`);
    if (/circuito cerrado/i.test(texto)) assert.match(texto, /pantallas/i, `circuito cerrado sin pantallas: ${texto}`);
  }
});

test('ningún texto lleva [PENDIENTE, precios ni cifras de equipo, y las pantallas se "coordinan"', () => {
  for (const texto of bloques) {
    assert.ok(!texto.includes('[PENDIENTE'), texto);
    assert.ok(!/\$\s?\d|MXN|tenemos las pantallas|tenemos pantallas/i.test(texto), texto);
  }
});

test('"software a la medida" no se usa: el servicio se llama "Desarrollo de software" (estructura §5)', () => {
  for (const texto of bloques) assert.ok(!/software a la medida/i.test(texto), texto);
});

test('WhatsApp: Audio usa el mensaje de renta de audio; Video y Tecnología, el general', () => {
  assert.equal(categorias.audio.cotizacion.mensaje, mensajesWhatsApp.rentaDeAudio);
  assert.equal(categorias.video.cotizacion.mensaje, mensajesWhatsApp.general);
  assert.equal(categorias.tecnologia.cotizacion.mensaje, mensajesWhatsApp.general);
  assert.equal(hub.contacto.mensaje, mensajesWhatsApp.general);
});
