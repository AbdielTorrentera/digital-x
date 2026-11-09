import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  archivosTemporales,
  enlacesANoConstruidas,
  nombresDeFotosTemporales,
  paginasConPendientes,
  urlDeArchivoHtml,
} from './proteccion-produccion.ts';

test('archivosTemporales detecta las fotos temporales por el nombre del archivo', () => {
  const rutas = [
    '_astro/temporal-escenario.BkQ2x1Zr_Z1AbCd.webp',
    '_astro/temporal-escenario.BkQ2x1Zr.avif',
    'index.html',
    '_astro/logo.Cx9.svg',
    '_astro/Base.astro_astro_type_script_index_0_lang.k4R4D1FF.js',
  ];
  assert.deepEqual(archivosTemporales(rutas), [
    '_astro/temporal-escenario.BkQ2x1Zr_Z1AbCd.webp',
    '_astro/temporal-escenario.BkQ2x1Zr.avif',
  ]);
});

test('archivosTemporales no confunde una carpeta ni una palabra parecida con una foto temporal', () => {
  assert.deepEqual(archivosTemporales(['temporal-no-es-un-archivo/index.html', '_astro/contemporal.webp']), []);
  assert.deepEqual(archivosTemporales([]), []);
});

test('archivosTemporales entiende rutas de Windows', () => {
  assert.deepEqual(archivosTemporales(['_astro\\temporal-a.webp']), ['_astro\\temporal-a.webp']);
});

test('paginasConPendientes lista las páginas con [PENDIENTE visible, en texto o en atributos', () => {
  const paginas = [
    { url: '/', html: '<main><p>[PENDIENTE: proyecto con foto]</p></main>' },
    { url: '/nosotros/', html: '<main><p>Quiénes somos</p></main>' },
    { url: '/proyectos/', html: '<img alt="[PENDIENTE: describir la foto]" src="/a.webp">' },
  ];
  assert.deepEqual(paginasConPendientes(paginas), ['/', '/proyectos/']);
});

test('paginasConPendientes ignora comentarios, scripts, estilos y JSON-LD', () => {
  const html = [
    '<!-- [PENDIENTE: nota para quien edite] -->',
    '<style>/* [PENDIENTE: ajustar] */ p { margin: 0 }</style>',
    '<script>const nota = "[PENDIENTE: algo]";</script>',
    '<script type="application/ld+json">{"description":"[PENDIENTE: texto]"}</script>',
    '<main><p>Todo confirmado</p></main>',
  ].join('');
  assert.deepEqual(paginasConPendientes([{ url: '/', html }]), []);
});

test('paginasConPendientes sin páginas devuelve una lista vacía', () => {
  assert.deepEqual(paginasConPendientes([]), []);
});

test('urlDeArchivoHtml convierte la ruta del HTML en la URL pública', () => {
  assert.equal(urlDeArchivoHtml('index.html'), '/');
  assert.equal(urlDeArchivoHtml('404.html'), '/404/');
  assert.equal(urlDeArchivoHtml('servicios/index.html'), '/servicios/');
  assert.equal(urlDeArchivoHtml('servicios/renta-de-audio/index.html'), '/servicios/renta-de-audio/');
  assert.equal(urlDeArchivoHtml('servicios\\index.html'), '/servicios/');
});

test('nombresDeFotosTemporales agrupa por foto original las variantes de tamaño y formato', () => {
  const rutas = [
    '_astro/temporal-a.HASH_1.webp',
    '_astro/temporal-a.HASH_2.avif',
    '_astro/temporal-b.OTRO_1.webp',
    '_astro/otra-foto.X_1.webp',
    'index.html',
  ];
  assert.deepEqual(nombresDeFotosTemporales(rutas), ['temporal-a', 'temporal-b']);
  assert.deepEqual(nombresDeFotosTemporales(['index.html']), []);
});

const sinConstruir = ['/servicios/renta-de-audio/', '/servicios/'];

test('enlacesANoConstruidas lista cada enlace interno a una página planeada que no está construida', () => {
  const paginas = [
    {
      url: '/',
      html: '<a href="/servicios/renta-de-audio/">Renta de audio y sonido</a><a href="/">Inicio</a>',
    },
    { url: '/404/', html: '<a href="/servicios/">Ver servicios</a>' },
  ];
  assert.deepEqual(enlacesANoConstruidas(paginas, sinConstruir), [
    { pagina: '/', enlace: '/servicios/renta-de-audio/' },
    { pagina: '/404/', enlace: '/servicios/' },
  ]);
});

test('enlacesANoConstruidas detecta el enlace aunque lleve ancla, parámetros o sea relativo', () => {
  const paginas = [
    { url: '/', html: '<a href=\'/servicios/#audio\'>a</a><a href="/servicios/?x=1">b</a><a href="servicios/">c</a>' },
  ];
  assert.deepEqual(
    enlacesANoConstruidas(paginas, sinConstruir).map((e) => e.enlace),
    ['/servicios/#audio', '/servicios/?x=1', 'servicios/'],
  );
});

test('enlacesANoConstruidas ignora externos, esquemas, anclas, páginas construidas y código', () => {
  const html = [
    '<a href="https://digitalx.mx/servicios/">externo</a>',
    '<a href="//digitalx.mx/servicios/">sin protocolo</a>',
    '<a href="tel:+522441244913">llamar</a>',
    '<a href="#servicios">ancla</a>',
    '<a href="/#servicios">inicio con ancla</a>',
    '<!-- <a href="/servicios/">comentario</a> -->',
    '<script>const a = \'<a href="/servicios/">x</a>\';</script>',
  ].join('');
  assert.deepEqual(enlacesANoConstruidas([{ url: '/', html }], sinConstruir), []);
  assert.deepEqual(enlacesANoConstruidas([], sinConstruir), []);
});

test('enlacesANoConstruidas no repite el mismo enlace de una misma página', () => {
  const html = '<a href="/servicios/">uno</a><a href="/servicios/">dos</a>';
  assert.equal(enlacesANoConstruidas([{ url: '/', html }], sinConstruir).length, 1);
});
