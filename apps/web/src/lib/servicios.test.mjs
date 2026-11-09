import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nombresDeServicios, serviciosDe } from './servicios.ts';
import { paginas } from './paginas.ts';

test('serviciosDe lista los servicios de cada categoría con el nombre del registro, sin la página de la categoría', () => {
  assert.deepEqual(
    serviciosDe('audio').map((s) => s.titulo),
    ['Renta de audio y sonido'],
  );
  assert.deepEqual(
    serviciosDe('video').map((s) => s.titulo),
    [
      'Circuito cerrado para eventos',
      'Producción de videos para eventos',
      'Transmisión en vivo',
      'Video con dron',
      'Recorridos virtuales 360',
    ],
  );
  assert.deepEqual(
    serviciosDe('tecnologia').map((s) => s.titulo),
    ['Páginas web', 'Desarrollo de apps móviles', 'Desarrollo de software', 'Tienda en línea'],
  );
});

test('serviciosDe marca como construido solo el servicio cuya página ya existe y está en lanzamiento', () => {
  for (const categoria of ['audio', 'video', 'tecnologia']) {
    for (const { titulo, url, construida } of serviciosDe(categoria)) {
      const pagina = paginas.find((p) => p.url === url);
      assert.equal(pagina.titulo, titulo);
      assert.equal(construida, pagina.construida && pagina.estado === 'lanzamiento', titulo);
    }
  }
});

test('nombresDeServicios suma la sonorización en Audio, que no tiene página propia', () => {
  assert.deepEqual(nombresDeServicios('audio'), ['Renta de audio y sonido', 'Sonorización']);
  assert.equal(nombresDeServicios('video').length, 5);
  assert.equal(nombresDeServicios('tecnologia').length, 4);
});
