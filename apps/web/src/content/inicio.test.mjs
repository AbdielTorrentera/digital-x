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

test('la portada lleva el H1, la marca con su lema y nada más: sin párrafo ni botón', () => {
  const portada = bloque('portada');
  assert.match(portada, /h1: 'Audio, video y tecnología para tus eventos y tu negocio en Puebla'/);
  assert.match(portada, /marca: \{ lema: 'Soluciones de audio, video y tecnología' \}/);
  assert.ok(!/\btexto:|\bboton:/.test(portada), 'la portada no lleva párrafo ni botón');
});

test('"Qué hacemos": etiqueta, título, texto, foto temporal con alt y el único botón "Ver servicios" a #servicios', () => {
  const sec = bloque('queHacemos');
  assert.match(sec, /etiqueta: 'Qué hacemos'/);
  assert.match(sec, /titulo: 'Para tus eventos y tu negocio en Puebla'/);
  assert.match(
    sec,
    /Un solo proveedor en Puebla, Atlixco e Izúcar de Matamoros para el audio y el video de tu evento, y para la página web, la app o el software de tu negocio\./,
  );
  assert.match(sec, /boton: \{ etiqueta: 'Ver servicios', href: urlVerServicios \}/);
  assert.match(sec, /alt: '[^']+'/);
  assert.match(inicio, /temporal-conferencia-escenario-pantalla/);
  // Sin las tarjetas de cifras de la plantilla: nada de números inventados.
  assert.ok(!/stats|\bvalor:|index:/.test(sec), 'no hay tarjetas de cifras');
});

test('el texto de "Qué hacemos" no se repite en el Inicio ni queda un segundo botón "Ver servicios"', () => {
  assert.equal((inicio.match(/Un solo proveedor en Puebla/g) ?? []).length, 1);
  assert.equal((inicio.match(/etiqueta: 'Ver servicios'/g) ?? []).length, 1);
});

test('el cierre del Inicio conserva su título y su texto (ahora en CierreContacto)', () => {
  const cierre = bloque('cierre');
  assert.match(cierre, /titulo: 'Cotiza tu evento o proyecto'/);
  assert.match(cierre, /texto: 'Cuéntanos qué necesitas por WhatsApp y te respondemos con una cotización\.'/);
});
