import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mensajesWhatsApp, negocio, telUrl, waUrl } from './negocio.ts';

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
