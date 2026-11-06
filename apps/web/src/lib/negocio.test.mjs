import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mensajesWhatsApp, negocio, telUrl, waUrl, zonas } from './negocio.ts';

test('waUrl usa el número del negocio y el mensaje general por defecto', () => {
  assert.equal(waUrl(), `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensajesWhatsApp.general)}`);
});

test('waUrl codifica espacios, acentos y signos que romperían la URL', () => {
  const url = new URL(waUrl('¿Cotizan sonido? Fecha: 12/12 & lugar: Atlixco'));
  assert.equal(url.origin + url.pathname, `https://wa.me/${negocio.whatsapp}`);
  assert.equal(url.searchParams.get('text'), '¿Cotizan sonido? Fecha: 12/12 & lugar: Atlixco');
  assert.ok(!url.search.includes(' '), 'la consulta no debe llevar espacios sin codificar');
  // "&" sin codificar partiría el mensaje en dos parámetros.
  assert.equal([...url.searchParams.keys()].length, 1);
});

test('telUrl usa el teléfono en formato internacional', () => {
  assert.equal(telUrl, `tel:${negocio.telefono.tel}`);
  assert.match(telUrl, /^tel:\+\d+$/);
});

test('cada uno de los 10 servicios tiene su mensaje de WhatsApp', () => {
  const claves = [
    'rentaDeAudio',
    'circuitoCerrado',
    'produccionDeVideos',
    'streaming',
    'dron',
    'recorridos360',
    'paginasWeb',
    'appsMoviles',
    'desarrolloDeSoftware',
    'tiendaEnLinea',
  ];
  for (const clave of claves) {
    assert.equal(typeof mensajesWhatsApp[clave], 'string', `falta el mensaje de ${clave}`);
    assert.ok(mensajesWhatsApp[clave].length > 0);
  }
  assert.equal(Object.keys(mensajesWhatsApp).length, claves.length + 1, 'solo los 10 servicios y el general');
});

test('los mensajes de los servicios eliminados ya no existen', () => {
  for (const clave of ['rentaDeSonido', 'instalacionDeAudio', 'videoParaRedes', 'softwareALaMedida', 'sitiosWeb']) {
    assert.ok(!(clave in mensajesWhatsApp), `${clave} debería haberse eliminado`);
  }
});

test('las zonas son 6, sin repetirse, y los dos grupos quedan como dato interno', () => {
  assert.deepEqual([...zonas.trasladoIncluido], ['Puebla', 'Atlixco', 'Izúcar de Matamoros']);
  assert.deepEqual([...zonas.cargoAdicional], ['Tepeaca', 'San Martín Texmelucan', 'Amozoc']);
  assert.equal(zonas.todas.length, 6);
  assert.equal(new Set(zonas.todas).size, 6, 'ninguna zona repetida');
});

test('la lista pública de lugares es una sola, en español y termina en "y alrededores"', () => {
  assert.equal(
    zonas.texto,
    'Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores',
  );
});

test('el texto del pie nombra las 6 zonas y no muestra condiciones de traslado ni cargos ni un radio', () => {
  for (const zona of zonas.todas) assert.ok(negocio.textoCobertura.includes(zona), `falta ${zona}`);
  assert.equal(
    negocio.textoCobertura,
    'Servicios de audio, video y tecnología en Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores.',
  );
  assert.ok(!/traslado|cargo|km|radio/i.test(negocio.textoCobertura));
  assert.ok(!/Atlixco, Puebla/.test(negocio.textoCobertura), '"Puebla" sola es la ciudad, no el estado');
});
