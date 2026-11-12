import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { categorias } from './categorias.ts';
import { comoTexto } from '../lib/texto.ts';
import { servicios } from './servicios.ts';
import { paginas } from '../lib/paginas.ts';

test('hay 3 categorías (Audio, Video y Tecnología), en ese orden, con su slug y su id del registro', () => {
  assert.deepEqual(
    categorias.map((c) => [c.id, c.slug, c.etiqueta, c.titulo]),
    [
      ['audio', 'audio', 'Audio', 'Servicios de audio'],
      ['video', 'video', 'Video', 'Servicios de video'],
      ['tecnologia', 'tecnologia', 'Tecnología', 'Servicios de tecnología'],
    ],
  );
  // Cada categoría tiene servicios en el registro, y los slugs son URL válidas (minúsculas, sin acentos).
  for (const c of categorias) {
    assert.match(c.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, c.slug);
    assert.ok(
      paginas.some((p) => p.categoria === c.id),
      `${c.id} no tiene servicios`,
    );
  }
});

test('el SEO de cada categoría: title ≤ 60, meta ≤ 155 con zona e invitación a cotizar, H1 con Puebla, y únicos en el sitio', () => {
  for (const c of categorias) {
    assert.ok(c.title.length <= 60, `title de ${c.id} mide ${c.title.length}`);
    assert.ok(c.title.endsWith(' | Digital X'), c.title);
    assert.ok(c.meta.length <= 155, `meta de ${c.id} mide ${c.meta.length}`);
    assert.match(c.meta, /Puebla|Atlixco/, `meta de ${c.id} sin zona`);
    assert.match(c.meta, /Cotiza por WhatsApp\.$/, `meta de ${c.id} sin invitación a cotizar`);
    assert.ok(c.h1.includes('Puebla'), `H1 de ${c.id} sin Puebla`);
    assert.ok(c.intro.length > 0 && c.cierre.titulo.length > 0 && c.cierre.texto.length > 0, c.id);
  }
  for (const campo of ['title', 'meta', 'h1']) {
    const valores = [...categorias.map((c) => c[campo]), ...Object.values(servicios).map((s) => s[campo])];
    assert.equal(new Set(valores).size, valores.length, `${campo} repetido`);
  }
});

test('los textos de las categorías: sin precios, cifras (salvo "360"), marcas, "a la medida", seguridad ni vigilancia', () => {
  for (const c of categorias) {
    const preguntas = c.faq.flatMap((f) => [f.pregunta, comoTexto(f.respuesta)]).join(' ');
    const sinFaq = [c.etiqueta, c.titulo, c.para, c.title, c.meta, c.h1, c.intro, c.cierre.titulo, c.cierre.texto].join(
      ' ',
    );
    const texto = `${sinFaq} ${preguntas}`;
    assert.ok(!/\$|MXN|\bIVA\b|desde \d/i.test(texto), `precio en ${c.id}`);
    assert.ok(!/\d/.test(texto.replace(/360/g, '')), `cifra en ${c.id}`);
    // "A la medida" no se usa como nombre ni en el SEO de una categoría; en una respuesta de las preguntas frecuentes sí
    // puede aparecer ("software a la medida"), aprobado por el dueño (reglas-seo §5).
    assert.ok(!/a la medida/i.test(sinFaq), `"a la medida" en ${c.id} fuera de sus preguntas frecuentes`);
    assert.ok(!/seguridad|vigilancia|proyector/i.test(texto), `vocabulario prohibido en ${c.id}`);
    assert.ok(!/\bapps\b|\bdron\b/i.test(texto), `"apps" o "dron" en ${c.id}`);
    // "Circuito cerrado" siempre con "para eventos", "en vivo" o "pantallas".
    for (const oracion of texto.split(/[.:]/).filter((o) => /circuito cerrado/i.test(o)))
      assert.match(oracion, /para eventos|en vivo|pantallas/i, oracion);
  }
});

test('las preguntas frecuentes de las categorías: Video 4 y Tecnología 3 (aprobadas); Audio vacía hasta que tenga página; clientes vacíos', () => {
  const faq = Object.fromEntries(categorias.map((c) => [c.id, c.faq]));
  assert.equal(faq.video.length, 4);
  assert.equal(faq.tecnologia.length, 3);
  assert.equal(faq.audio.length, 0);
  assert.deepEqual(
    faq.video.map((f) => f.pregunta),
    [
      '¿Qué servicio de video me conviene para mi evento?',
      '¿Puedo combinar varios servicios de video en el mismo evento?',
      '¿Qué servicio de video sirve para mostrar mi negocio o mi lugar?',
      '¿Puedo transmitir mi evento en vivo y quedarme también con el video?',
    ],
  );
  assert.deepEqual(
    faq.tecnologia.map((f) => f.pregunta),
    [
      '¿Necesito una página web, una tienda en línea, una aplicación móvil o software?',
      '¿Puedo conectar mi sistema o mi aplicación con otros sistemas o con mi página web?',
      'Si mi negocio apenas empieza, ¿por dónde comienzo?',
    ],
  );
  // Ninguna pregunta de categoría es una pregunta de un servicio (sin contenido duplicado).
  const deServicios = new Set(Object.values(servicios).flatMap((s) => (s.pagina?.faq ?? []).map((f) => f.pregunta)));
  for (const f of categorias.flatMap((c) => c.faq)) assert.ok(!deServicios.has(f.pregunta), f.pregunta);
  for (const c of categorias) assert.ok(Array.isArray(c.clientes) && c.clientes.length === 0, `clientes de ${c.id}`);
});

test('nada en src/ (datos, lib, componentes, páginas ni scripts) apunta a /servicios/: los servicios cuelgan de /{categoria}/{slug}/', () => {
  const carpetas = [
    '.',
    '../lib',
    '../components',
    '../components/sections',
    '../components/ui',
    '../pages',
    '../pages/[categoria]',
    '../scripts',
  ];
  let revisados = 0;
  for (const carpeta of carpetas) {
    for (const archivo of readdirSync(new URL(`${carpeta}/`, import.meta.url)).filter(
      (nombre) => /\.(ts|astro)$/.test(nombre) && !nombre.endsWith('.test.mjs'),
    )) {
      // Sin comentarios: se revisa el código y los textos, no lo que explica la historia.
      const texto = readFileSync(new URL(`${carpeta}/${archivo}`, import.meta.url), 'utf8').replace(
        /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|^\s*\/\/.*$/gm,
        '',
      );
      revisados++;
      assert.ok(!/\/servicios\//.test(texto), `${carpeta}/${archivo} apunta a /servicios/`);
    }
  }
  assert.ok(revisados > 40, `solo se revisaron ${revisados} archivos`);
});
