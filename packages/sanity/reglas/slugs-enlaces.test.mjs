import assert from 'node:assert/strict'
import test from 'node:test'
import {enlaceAceptable, esHttps, problemasDeSlug, slugificar} from './index.ts'

test('slugs: formato, slugificar sin acentos ni ñ y slugs reservados', () => {
  assert.equal(slugificar('Páginas web: ¡diseño y niño!'), 'paginas-web-diseno-y-nino')
  assert.deepEqual(problemasDeSlug('video-con-drone'), [])
  assert.equal(problemasDeSlug('Video Con Drone').length, 1)
  assert.equal(problemasDeSlug('video--drone').length, 1)
  assert.equal(problemasDeSlug('nosotros', {reservados: true}).length, 1)
  assert.deepEqual(problemasDeSlug('nosotros'), [])
  assert.equal(problemasDeSlug(undefined).length, 1)
})

test('enlaces: solo https:, mailto:, tel: y rutas internas (seguridad §4.3)', () => {
  for (const ok of ['https://digitalx.mx', 'mailto:a@b.mx', 'tel:+522441244913', '/proyectos/'])
    assert.ok(enlaceAceptable(ok), ok)
  for (const mal of [
    'javascript:alert(1)',
    'data:text/html,x',
    'http://digitalx.mx',
    '//evil.com',
    'proyectos',
    '',
  ])
    assert.ok(!enlaceAceptable(mal), mal)
})

test('esHttps: solo https:', () => {
  assert.ok(esHttps('https://www.facebook.com/digitalx'))
  assert.ok(!esHttps('http://facebook.com/digitalx'))
  assert.ok(!esHttps('mailto:a@b.mx'))
  assert.ok(!esHttps('no es una url'))
})
