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
    { nombre: 'Servicios de audio', url: 'https://digitalx.mx/servicios-de-audio/' },
  ]);
  assert.equal(datos['@type'], 'BreadcrumbList');
  assert.deepEqual(
    datos.itemListElement.map((m) => [m.position, m.name, m.item]),
    [
      [1, 'Inicio', 'https://digitalx.mx/'],
      [2, 'Servicios de audio', 'https://digitalx.mx/servicios-de-audio/'],
    ],
  );
});

test('serviceJsonLd referencia al negocio por @id y solo lleva url si la página existe', () => {
  const base = {
    nombre: 'Transmisión en vivo',
    tipo: 'Servicios de video',
    descripcion: 'Tu evento en vivo por internet.',
    idNegocio: 'https://digitalx.mx/#negocio',
  };
  const sinPagina = serviceJsonLd(base);
  assert.equal(sinPagina['@type'], 'Service');
  assert.deepEqual(sinPagina.provider, { '@id': 'https://digitalx.mx/#negocio' });
  assert.ok(!('url' in sinPagina));
  assert.equal(
    serviceJsonLd({ ...base, url: 'https://digitalx.mx/servicios-de-video/streaming/' }).url,
    'https://digitalx.mx/servicios-de-video/streaming/',
  );
  assert.ok(!/ProfessionalService|address|"geo"/.test(JSON.stringify(sinPagina)));
});

test('collectionPageJsonLd lista los elementos en orden y apunta por @id al negocio', () => {
  const datos = collectionPageJsonLd({
    url: 'https://digitalx.mx/servicios/',
    nombre: 'Servicios',
    descripcion: 'Elige tu servicio.',
    idNegocio: 'https://digitalx.mx/#negocio',
    elementos: [
      { name: 'Servicios de audio', url: 'https://digitalx.mx/servicios-de-audio/' },
      { name: 'Servicios de video', url: 'https://digitalx.mx/servicios-de-video/' },
    ],
  });
  assert.equal(datos['@type'], 'CollectionPage');
  assert.equal(datos['@id'], 'https://digitalx.mx/servicios/#pagina');
  assert.deepEqual(datos.about, { '@id': 'https://digitalx.mx/#negocio' });
  assert.equal(datos.mainEntity['@type'], 'ItemList');
  assert.deepEqual(
    datos.mainEntity.itemListElement.map((e) => [e['@type'], e.position, e.name]),
    [
      ['ListItem', 1, 'Servicios de audio'],
      ['ListItem', 2, 'Servicios de video'],
    ],
  );
  assert.ok(!/ProfessionalService|"address"|"geo"/.test(JSON.stringify(datos)));
});
