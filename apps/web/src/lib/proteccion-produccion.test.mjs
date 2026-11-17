import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enlacesANoConstruidas, urlDeArchivoHtml } from './proteccion-produccion.ts';

test('urlDeArchivoHtml convierte la ruta del HTML en la URL pública', () => {
  assert.equal(urlDeArchivoHtml('index.html'), '/');
  assert.equal(urlDeArchivoHtml('404.html'), '/404/');
  assert.equal(urlDeArchivoHtml('nosotros/index.html'), '/nosotros/');
  assert.equal(urlDeArchivoHtml('audio/renta-de-audio/index.html'), '/audio/renta-de-audio/');
  assert.equal(urlDeArchivoHtml('nosotros\\index.html'), '/nosotros/');
});

const sinConstruir = ['/audio/renta-de-audio/', '/proyectos/'];

test('enlacesANoConstruidas lista cada enlace interno a una página planeada que no está construida', () => {
  const paginas = [
    {
      url: '/',
      html: '<a href="/audio/renta-de-audio/">Renta de audio y sonido</a><a href="/">Inicio</a>',
    },
    { url: '/404/', html: '<a href="/proyectos/">Ver proyectos</a>' },
  ];
  assert.deepEqual(enlacesANoConstruidas(paginas, sinConstruir), [
    { pagina: '/', enlace: '/audio/renta-de-audio/' },
    { pagina: '/404/', enlace: '/proyectos/' },
  ]);
});

test('enlacesANoConstruidas detecta el enlace aunque lleve ancla, parámetros o sea relativo', () => {
  const paginas = [
    { url: '/', html: '<a href=\'/proyectos/#audio\'>a</a><a href="/proyectos/?x=1">b</a><a href="proyectos/">c</a>' },
  ];
  assert.deepEqual(
    enlacesANoConstruidas(paginas, sinConstruir).map((e) => e.enlace),
    ['/proyectos/#audio', '/proyectos/?x=1', 'proyectos/'],
  );
});

test('enlacesANoConstruidas ignora externos, esquemas, anclas, páginas construidas y código', () => {
  const html = [
    '<a href="https://digitalx.mx/proyectos/">externo</a>',
    '<a href="//digitalx.mx/proyectos/">sin protocolo</a>',
    '<a href="tel:+522441244913">llamar</a>',
    '<a href="#servicios">ancla</a>',
    '<a href="/#servicios">inicio con ancla</a>',
    '<!-- <a href="/proyectos/">comentario</a> -->',
    '<script>const a = \'<a href="/proyectos/">x</a>\';</script>',
  ].join('');
  assert.deepEqual(enlacesANoConstruidas([{ url: '/', html }], sinConstruir), []);
  assert.deepEqual(enlacesANoConstruidas([], sinConstruir), []);
});

test('enlacesANoConstruidas no repite el mismo enlace de una misma página', () => {
  const html = '<a href="/proyectos/">uno</a><a href="/proyectos/">dos</a>';
  assert.equal(enlacesANoConstruidas([{ url: '/', html }], sinConstruir).length, 1);
});
