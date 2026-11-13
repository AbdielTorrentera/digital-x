// Pruebas del adaptador: la muestra de Sanity (`packages/sanity/muestra/contenido.json`, la que cargan `pnpm test` y
// `pnpm check` con CONTENIDO_JSON) se convierte en las formas que reciben los componentes. No se fijan textos: eso lo
// revisan las reglas de `packages/sanity` en el Studio y en el build.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categorias, guia } from './categorias.ts';
import { cierre, cobertura, faq, porQue, portada, queHacemos } from './inicio.ts';
import { aFoto, aImagen, nombreDeArchivo } from './imagenes.ts';
import { cierre as cierreNosotros, manifiesto, proyectosPagina } from './nosotros.ts';
import { proyectos } from './proyectos.ts';
import { faltantesDePagina, registroDeServicios, servicios, slugs } from './servicios.ts';
import { fotoCierre, fotos } from './servicios-fotos.ts';
import { aTexto } from './texto.ts';
import { negocio, zonas } from '../negocio.ts';
import { destinoDeCategoria, menu, paginas, urlsSinConstruir } from '../paginas.ts';

const muestra = JSON.parse(
  readFileSync(new URL('../../../../../packages/sanity/muestra/contenido.json', import.meta.url), 'utf8'),
);
const bloque = (texto, marks = [], defs = []) => [
  { _type: 'block', markDefs: defs, children: [{ text: texto, marks }] },
];

test('los servicios, las categorías y el registro salen de los datos, en el orden del Studio', () => {
  assert.deepEqual(
    categorias.map((c) => c.id),
    ['audio', 'video', 'tecnologia'],
  );
  assert.equal(slugs.length, registroDeServicios.length);
  for (const slug of slugs) assert.deepEqual(faltantesDePagina(slug), [], `${slug} está incompleto`);
  const porCategoria = Object.groupBy(registroDeServicios, (s) => s.categoria);
  assert.deepEqual(Object.keys(porCategoria), ['audio', 'video', 'tecnologia']);
  for (const [slug, c] of Object.entries(servicios)) {
    assert.ok(c.title && c.meta && c.h1 && c.mensaje, `${slug}: faltan datos básicos`);
    assert.ok(!('para' in c) && !('incluye' in c), 'esos dos campos ya no existen');
  }
});

test('la URL de cada servicio se deriva de su categoría y las páginas siguen al registro', () => {
  const urls = paginas.filter((p) => p.categoria).map((p) => p.url);
  for (const s of registroDeServicios) assert.ok(urls.includes(`/${s.categoria}/${s.slug}/`));
  assert.equal(destinoDeCategoria('audio'), `/audio/${registroDeServicios.find((s) => s.categoria === 'audio').slug}/`);
  assert.equal(destinoDeCategoria('video'), '/video/');
  assert.ok(menu.some((m) => m.url === '/video/'));
  assert.deepEqual(urlsSinConstruir, ['/proyectos/']);
});

test('el texto con enlaces vuelve a la forma string | TextoConEnlaces (los servicios por su slug)', () => {
  assert.equal(aTexto(bloque('Hola')), 'Hola');
  const def = { _key: 'm', _type: 'enlaceServicio', servicio: { _ref: 'servicio-video-con-drone' } };
  const [primero] = aTexto([
    {
      _type: 'block',
      markDefs: [def],
      children: [
        { text: 'Mira el ', marks: [] },
        { text: 'drone', marks: ['m'] },
        { text: '.', marks: [] },
      ],
    },
  ]);
  assert.equal(primero, 'Mira el ');
  const enlace = aTexto([{ _type: 'block', markDefs: [def], children: [{ text: 'drone', marks: ['m'] }] }]);
  assert.deepEqual(enlace, [{ slug: 'video-con-drone', texto: 'drone' }]);
  const pagina = aTexto([
    {
      _type: 'block',
      markDefs: [{ _key: 'p', _type: 'enlacePagina', ruta: '/proyectos/' }],
      children: [{ text: 'proyectos', marks: ['p'] }],
    },
  ]);
  assert.deepEqual(pagina, [{ url: '/proyectos/', texto: 'proyectos' }]);
  assert.throws(() =>
    aTexto([
      {
        _type: 'block',
        markDefs: [{ _key: 'm', _type: 'enlaceServicio', servicio: { _ref: 'servicio-no-existe' } }],
        children: [{ text: 'x', marks: ['m'] }],
      },
    ]),
  );
});

test('los marcadores del Inicio se reemplazan con las zonas y los servicios publicados', () => {
  const textos = [cobertura.texto, ...faq.items.map((i) => JSON.stringify(i.respuesta))].join(' ');
  assert.ok(!/\{(zonas|servicios-)/.test(textos), 'quedó un marcador sin reemplazar');
  assert.ok(cobertura.texto.includes(zonas.texto));
  assert.ok(textos.includes(zonas.texto));
});

test('las fotos: nombre descriptivo desde el alt, decorativas con alt vacío y tamaño del CDN', () => {
  const foto = fotos[slugs[0]];
  assert.ok(foto.alt.length >= 5);
  assert.match(
    foto.src.src,
    /^https:\/\/cdn\.sanity\.io\/images\/z037bu0t\/production\/[a-f0-9]+-\d+x\d+\.jpg\/[a-z0-9-]+\.jpg/,
  );
  assert.ok(foto.src.width > 0 && foto.src.height > 0);
  assert.ok(!foto.src.src.includes('temporal-'), 'el nombre sale del alt, no del archivo subido');
  assert.ok(
    nombreDeArchivo({ alt: 'Pantalla de circuito cerrado en una conferencia en Atlixco, con público' }).length <= 60,
  );
  assert.equal(nombreDeArchivo({ alt: 'Cámara  ÚNICA: ¡Niño!' }), 'camara-unica-nino');
  assert.equal(nombreDeArchivo({ decorativa: true, alt: 'no se usa' }, 'temporal-fondo.jpg'), 'temporal-fondo');
  // Las fotos de fondo (decorativas) llegan como imagen suelta, sin alt.
  for (const imagen of [fotoCierre, manifiesto.foto, proyectosPagina.foto, cierreNosotros.foto]) {
    assert.equal(typeof imagen.src, 'string');
    assert.ok(imagen.width > 0);
  }
  assert.equal(aFoto(muestra.documentos.find((d) => d._id === 'nosotros').fotoManifiesto).alt, '');
});

test('el recorte y el ancho máximo del CDN se calculan sobre la foto original', () => {
  const id = Object.keys(muestra.assets)[0];
  const { width, height } = muestra.assets[id];
  const entera = aImagen({ asset: { _ref: id }, alt: 'Una foto de prueba' });
  assert.deepEqual([entera.width, entera.height], [width, height]);
  const recortada = aImagen({
    asset: { _ref: id },
    alt: 'Una foto de prueba',
    crop: { top: 0, bottom: 0.5, left: 0, right: 0 },
  });
  assert.match(recortada.src, /\?rect=0,0,\d+,\d+/);
  assert.equal(recortada.height, Math.round(height / 2));
  assert.equal(aFoto({ asset: { _ref: id }, alt: 'x', hotspot: { x: 0.25, y: 0.75 } }).posicion, '25% 75%');
});

test('los proyectos traen foto, servicios por nombre y la marca de ejemplo', () => {
  assert.ok(proyectos.length > 0);
  for (const p of proyectos) {
    assert.ok(p.titulo && p.municipio && p.texto && p.foto.src.src);
    assert.ok(
      p.servicios.length > 0 && p.servicios.every((nombre) => registroDeServicios.some((s) => s.titulo === nombre)),
    );
  }
  assert.ok(
    proyectos.every((p) => p.placeholder === true && p.permiso === false),
    'hoy todos son de ejemplo',
  );
});

test('el negocio sale de la configuración y las secciones del Inicio traen sus datos', () => {
  assert.match(negocio.telefono.tel, /^\+52\d{10}$/);
  assert.equal(negocio.telefono.pantalla.replace(/\s/g, ''), negocio.telefono.tel);
  assert.match(negocio.telefono.pantalla, /^\+52 \d{3} \d{3} \d{4}$/);
  assert.deepEqual(negocio.redes, [], 'sin redes activas con dirección no se muestra ninguna');
  assert.ok(portada.h1 && portada.foto.alt && queHacemos.boton.href === '/#servicios' && porQue.items.length >= 3);
  assert.match(cierre.boton.href, /^https:\/\/wa\.me\/52\d{10}\?text=/);
  assert.ok(guia.items.every((i) => i.slugs.every((s) => slugs.includes(s))));
});

// El adaptador se detiene (no publica a medias) si a un marcador le falta su dato: se prueba en un proceso aparte con una
// copia de la muestra en la que la categoría de Audio cambia de slug, así que {servicios-audio} se queda sin servicios.
test('un marcador sin datos detiene el build con un mensaje claro', () => {
  const copia = structuredClone(muestra);
  copia.documentos.find((d) => d._id === 'categoria-audio').slug.current = 'audio-nuevo';
  copia.documentos.find((d) => d._id === 'inicio').preguntas.items[1].respuesta =
    bloque('En audio, {servicios-audio}.');
  const archivo = join(mkdtempSync(join(tmpdir(), 'contenido-')), 'sin-audio.json');
  writeFileSync(archivo, JSON.stringify(copia));
  assert.throws(
    () =>
      execFileSync('node', ['-e', "import('./src/lib/contenido/inicio.ts')"], {
        env: { ...process.env, CONTENIDO_JSON: archivo },
        stdio: 'pipe',
        cwd: new URL('../../../', import.meta.url),
      }),
    (error) => /no hay datos para ese marcador/.test(String(error.stderr)),
  );
});
