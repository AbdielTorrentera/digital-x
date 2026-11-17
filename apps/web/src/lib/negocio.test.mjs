import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mensajesWhatsApp, negocio, redesConUrl, telUrl, waUrl, zonas } from './negocio.ts';

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

test('el mensaje general de WhatsApp sale de la configuración y el de cada servicio, del propio servicio', () => {
  assert.equal(typeof mensajesWhatsApp.general, 'string');
  assert.ok(mensajesWhatsApp.general.length > 0);
  assert.deepEqual(Object.keys(mensajesWhatsApp), ['general']);
});

test('las zonas salen de la configuración, sin repetirse, y los grupos de traslado no existen en el código (dato interno)', () => {
  assert.ok(!('trasladoIncluido' in zonas) && !('cargoAdicional' in zonas));
  assert.equal(zonas.todas.length, 2);
  assert.equal(new Set(zonas.todas).size, zonas.todas.length, 'ninguna zona repetida');
});

test('la lista pública de lugares es una sola, en español y termina en "y alrededores"', () => {
  assert.equal(zonas.texto, 'Ciudad Uno, Ciudad Dos y alrededores');
});

test('el texto del pie nombra las zonas de la configuración y no muestra condiciones de traslado ni cargos ni un radio', () => {
  for (const zona of zonas.todas) assert.ok(negocio.textoCobertura.includes(zona), `falta ${zona}`);
  assert.equal(
    negocio.textoCobertura,
    'Servicios de audio, video y tecnología en Ciudad Uno, Ciudad Dos y alrededores.',
  );
  assert.ok(!/traslado|cargo|km|radio/i.test(negocio.textoCobertura));
});

test('redesConUrl deja fuera las redes sin URL y conserva las que ya la tienen', () => {
  const redes = [
    { nombre: 'Facebook', url: null },
    { nombre: 'Instagram', url: 'https://www.instagram.com/digitalx' },
  ];
  assert.deepEqual(redesConUrl(redes), [{ nombre: 'Instagram', url: 'https://www.instagram.com/digitalx' }]);
  assert.deepEqual(redesConUrl([{ nombre: 'TikTok', url: null }]), []);
});

test('negocio.redes solo trae redes activas con dirección https (no se pintan enlaces vacíos)', () => {
  assert.ok(negocio.redes.every((red) => typeof red.url === 'string' && red.url.startsWith('https://')));
});
