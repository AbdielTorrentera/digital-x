import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// content/inicio.ts importa imágenes y no se puede cargar con node:test: se lee como texto, sin comentarios.
const inicio = readFileSync(new URL('./inicio.ts', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm,
  '',
);
const bloque = (nombre) => {
  const desde = inicio.indexOf(`export const ${nombre} = {`);
  assert.ok(desde >= 0, `falta ${nombre}`);
  return inicio.slice(desde, inicio.indexOf('\n};', desde));
};

test('la portada lleva solo el H1 (el logo lo pinta el componente): sin lema, párrafo ni botón', () => {
  const portada = bloque('portada');
  assert.match(portada, /h1: 'Audio, video y tecnología para tus eventos y tu negocio en Puebla'/);
  assert.ok(
    !/\blema\b|\bmarca\b|Soluciones de audio, video y tecnología/.test(inicio),
    'sin lema ni marca en los datos',
  );
  assert.ok(!/\btexto:|\bboton:/.test(portada), 'la portada no lleva párrafo ni botón');
});

test('"Qué hacemos": etiqueta "Digital X", título, texto aprobado, foto temporal con alt y el único botón "Ver servicios" a #servicios', () => {
  const sec = bloque('queHacemos');
  assert.match(sec, /etiqueta: 'Digital X'/);
  assert.match(sec, /titulo: 'Qué hacemos'/);
  assert.match(
    sec,
    /Un solo proveedor para tu evento y tu negocio: nos encargamos de que tu evento se vea y se escuche bien, y de darle a tu negocio las herramientas digitales que necesita, en Puebla, Atlixco, Izúcar de Matamoros y alrededores\./,
  );
  assert.match(sec, /boton: \{ etiqueta: 'Ver servicios', href: urlVerServicios \}/);
  assert.match(sec, /alt: '[^']+'/);
  assert.match(inicio, /temporal-conferencia-escenario-pantalla/);
  // Sin las tarjetas de cifras de la plantilla: nada de números inventados.
  assert.ok(!/stats|\bvalor:|index:/.test(sec), 'no hay tarjetas de cifras');
});

test('el texto de "Qué hacemos" no se repite en el Inicio ni queda un segundo botón "Ver servicios"', () => {
  assert.equal((inicio.match(/Un solo proveedor para tu evento y tu negocio/g) ?? []).length, 1);
  assert.equal((inicio.match(/etiqueta: 'Ver servicios'/g) ?? []).length, 1);
});

test('el cierre del Inicio conserva su título y su texto (ahora en CierreContacto)', () => {
  const cierre = bloque('cierre');
  assert.match(cierre, /titulo: 'Cotiza tu evento o proyecto'/);
  assert.match(cierre, /texto: 'Cuéntanos qué necesitas por WhatsApp y te respondemos con una cotización\.'/);
});
