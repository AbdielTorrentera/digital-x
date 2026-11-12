import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aboutPageJsonLd,
  breadcrumbListJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  sameAsDeRedes,
  serializarJsonLd,
  serviceJsonLd,
} from './jsonld.ts';

test('serializarJsonLd escapa lo que podría cerrar el script o inyectar HTML', () => {
  const salida = serializarJsonLd({ texto: '</script><img src=x onerror=alert(1)> & más' });
  assert.ok(!salida.includes('<'), 'no debe quedar ningún "<"');
  assert.ok(!salida.includes('>'), 'no debe quedar ningún ">"');
  assert.ok(!salida.includes('&'), 'no debe quedar ningún "&"');
  // Al leerlo como JSON vuelve a ser el texto original.
  assert.equal(JSON.parse(salida).texto, '</script><img src=x onerror=alert(1)> & más');
});

test('serializarJsonLd escapa los separadores de línea de Unicode', () => {
  const salida = serializarJsonLd({ texto: 'a\u2028b\u2029c' });
  assert.ok(!salida.includes('\u2028') && !salida.includes('\u2029'));
  assert.equal(JSON.parse(salida).texto, 'a\u2028b\u2029c');
});

test('faqPageJsonLd lleva cada pregunta y respuesta tal como se muestran', () => {
  const preguntas = [
    { pregunta: '¿Hay un técnico durante mi evento?', respuesta: 'Sí, un técnico atiende el sonido todo el evento.' },
    { pregunta: '¿Dónde dan servicio?', respuesta: 'Atlixco e Izúcar de Matamoros y alrededores.' },
  ];
  const datos = faqPageJsonLd(preguntas);
  assert.equal(datos['@type'], 'FAQPage');
  assert.equal(datos.mainEntity.length, preguntas.length);
  preguntas.forEach(({ pregunta, respuesta }, i) => {
    assert.equal(datos.mainEntity[i]['@type'], 'Question');
    assert.equal(datos.mainEntity[i].name, pregunta);
    assert.equal(datos.mainEntity[i].acceptedAnswer.text, respuesta);
  });
});

test('faqPageJsonLd publica el texto plano de una respuesta con enlaces, igual a lo que se lee en pantalla', () => {
  const respuesta = [
    'Como explican nuestras ',
    { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
    '.',
  ];
  const datos = faqPageJsonLd([{ pregunta: '¿Cómo se paga?', respuesta }]);
  assert.equal(datos.mainEntity[0].acceptedAnswer.text, 'Como explican nuestras condiciones de contratación.');
});

test('faqPageJsonLd no publica dirección ni coordenadas', () => {
  const texto = JSON.stringify(faqPageJsonLd([{ pregunta: 'P', respuesta: 'R' }]));
  assert.ok(!/address|streetAddress|"geo"/.test(texto));
});

test('sameAsDeRedes lista las URLs de las redes y, sin ninguna, no hay propiedad', () => {
  assert.equal(sameAsDeRedes([]), undefined);
  assert.deepEqual(
    sameAsDeRedes([
      { nombre: 'Facebook', url: 'https://www.facebook.com/digitalx' },
      { nombre: 'Instagram', url: 'https://www.instagram.com/digitalx' },
    ]),
    ['https://www.facebook.com/digitalx', 'https://www.instagram.com/digitalx'],
  );
});

test('aboutPageJsonLd apunta por @id al negocio y no declara otro negocio', () => {
  const datos = aboutPageJsonLd({
    url: 'https://digitalx.mx/nosotros/',
    nombre: 'Nosotros',
    descripcion: 'Conoce Digital X.',
    idNegocio: 'https://digitalx.mx/#negocio',
  });
  assert.equal(datos['@type'], 'AboutPage');
  assert.equal(datos.url, 'https://digitalx.mx/nosotros/');
  assert.deepEqual(datos.about, { '@id': 'https://digitalx.mx/#negocio' });
  assert.deepEqual(datos.mainEntity, { '@id': 'https://digitalx.mx/#negocio' });
  const texto = JSON.stringify(datos);
  assert.ok(!texto.includes('ProfessionalService') && !texto.includes('Person'));
});

test('breadcrumbListJsonLd numera las migas y lleva la URL de cada una', () => {
  const datos = breadcrumbListJsonLd([
    { nombre: 'Inicio', url: 'https://digitalx.mx/' },
    { nombre: 'Renta de audio y sonido', url: 'https://digitalx.mx/audio/renta-de-audio/' },
  ]);
  assert.equal(datos['@type'], 'BreadcrumbList');
  assert.deepEqual(
    datos.itemListElement.map((m) => [m.position, m.name, m.item]),
    [
      [1, 'Inicio', 'https://digitalx.mx/'],
      [2, 'Renta de audio y sonido', 'https://digitalx.mx/audio/renta-de-audio/'],
    ],
  );
});

test('serviceJsonLd referencia al negocio por @id, lleva sus zonas y no declara otro negocio', () => {
  const datos = serviceJsonLd({
    url: 'https://digitalx.mx/audio/renta-de-audio/',
    nombre: 'Renta de audio y sonido',
    tipo: 'Servicios de audio',
    descripcion: 'Equipo de audio y sonorización.',
    idNegocio: 'https://digitalx.mx/#negocio',
    zonas: ['Puebla', 'Atlixco'],
  });
  assert.equal(datos['@type'], 'Service');
  assert.equal(datos['@id'], 'https://digitalx.mx/audio/renta-de-audio/#servicio');
  assert.deepEqual(datos.provider, { '@id': 'https://digitalx.mx/#negocio' });
  assert.deepEqual(datos.areaServed, [
    { '@type': 'City', name: 'Puebla' },
    { '@type': 'City', name: 'Atlixco' },
  ]);
  assert.ok(!/ProfessionalService|address|"geo"/.test(JSON.stringify(datos)));
});

test('collectionPageJsonLd lista los elementos en orden y apunta por @id al negocio', () => {
  const datos = collectionPageJsonLd({
    url: 'https://digitalx.mx/video/',
    nombre: 'Servicios',
    descripcion: 'Elige tu servicio.',
    idNegocio: 'https://digitalx.mx/#negocio',
    elementos: [
      { name: 'Renta de audio y sonido', url: 'https://digitalx.mx/audio/renta-de-audio/' },
      { name: 'Video con drone', url: 'https://digitalx.mx/video/video-con-drone/' },
    ],
  });
  assert.equal(datos['@type'], 'CollectionPage');
  assert.equal(datos['@id'], 'https://digitalx.mx/video/#pagina');
  assert.deepEqual(datos.about, { '@id': 'https://digitalx.mx/#negocio' });
  assert.equal(datos.mainEntity['@type'], 'ItemList');
  assert.deepEqual(
    datos.mainEntity.itemListElement.map((e) => [e['@type'], e.position, e.name]),
    [
      ['ListItem', 1, 'Renta de audio y sonido'],
      ['ListItem', 2, 'Video con drone'],
    ],
  );
  assert.ok(!/ProfessionalService|"address"|"geo"/.test(JSON.stringify(datos)));
});

test('collectionPageJsonLd sin elementos no lleva ItemList vacío', () => {
  const datos = collectionPageJsonLd({
    url: 'https://digitalx.mx/video/',
    nombre: 'Servicios',
    descripcion: 'Elige tu servicio.',
    idNegocio: 'https://digitalx.mx/#negocio',
    elementos: [],
  });
  assert.equal(datos['@type'], 'CollectionPage');
  assert.deepEqual(datos.about, { '@id': 'https://digitalx.mx/#negocio' });
  assert.ok(!('mainEntity' in datos));
});
