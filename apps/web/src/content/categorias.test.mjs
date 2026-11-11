import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { categorias } from './categorias.ts';
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
    const texto = [c.etiqueta, c.titulo, c.para, c.title, c.meta, c.h1, c.intro, c.cierre.titulo, c.cierre.texto].join(
      ' ',
    );
    assert.ok(!/\$|MXN|\bIVA\b|desde \d/i.test(texto), `precio en ${c.id}`);
    assert.ok(!/\d/.test(texto.replace(/360/g, '')), `cifra en ${c.id}`);
    assert.ok(!/a la medida/i.test(texto), `"a la medida" en ${c.id}: solo se usa en la página de software`);
    assert.ok(!/seguridad|vigilancia|proyector/i.test(texto), `vocabulario prohibido en ${c.id}`);
    assert.ok(!/\bapps\b|\bdron\b/i.test(texto), `"apps" o "dron" en ${c.id}`);
    // "Circuito cerrado" siempre con "para eventos", "en vivo" o "pantallas".
    for (const oracion of texto.split(/[.:]/).filter((o) => /circuito cerrado/i.test(o)))
      assert.match(oracion, /para eventos|en vivo|pantallas/i, oracion);
  }
});

test('las preguntas frecuentes y los clientes de las categorías están listos pero vacíos: la sección no se dibuja y no se inventa nada', () => {
  for (const c of categorias) {
    assert.ok(Array.isArray(c.faq) && c.faq.length === 0, `faq de ${c.id}`);
    assert.ok(Array.isArray(c.clientes) && c.clientes.length === 0, `clientes de ${c.id}`);
  }
});

test('ningún texto ni dato enlaza a /servicios/ ni a sus anclas: esa página ya no existe', () => {
  const carpetas = ['.', '../lib'];
  for (const carpeta of carpetas) {
    for (const archivo of readdirSync(new URL(carpeta, import.meta.url)).filter(
      (nombre) => nombre.endsWith('.ts') && !nombre.endsWith('.test.mjs'),
    )) {
      const texto = readFileSync(new URL(`${carpeta}/${archivo}`, import.meta.url), 'utf8').replace(
        /\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm,
        '',
      );
      assert.ok(!/['"`]\/servicios\/['"`#?]/.test(texto), `${archivo} enlaza a /servicios/`);
      assert.ok(!/\/servicios\/#/.test(texto), `${archivo} enlaza a un ancla de /servicios/`);
    }
  }
});
