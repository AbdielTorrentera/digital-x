import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aboutPageJsonLd, faqPageJsonLd, sameAsDeRedes, serializarJsonLd } from './jsonld.ts';

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
