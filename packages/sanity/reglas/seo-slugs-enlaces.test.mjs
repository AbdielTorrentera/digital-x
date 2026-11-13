import assert from 'node:assert/strict'
import test from 'node:test'
import {
  enlaceAceptable,
  problemasDeMeta,
  problemasDeSlug,
  problemasDeTitle,
  slugificar,
  urlDeRedValida,
} from './index.ts'

test('title: ≤ 60 caracteres y termina en « | Digital X»', () => {
  assert.deepEqual(problemasDeTitle('Video con drone en Puebla | Digital X'), [])
  assert.equal(problemasDeTitle('Video con drone en Puebla').length, 1)
  assert.equal(problemasDeTitle(`${'a'.repeat(55)} | Digital X`).length, 1)
})

test('meta: ≤ 155; en servicios y categorías, con zona e invitación a cotizar', () => {
  const buena =
    'Video y fotografía aérea con drone para eventos en Puebla y Atlixco. Cotiza por WhatsApp.'
  assert.deepEqual(problemasDeMeta(buena, true), [])
  assert.equal(
    problemasDeMeta('Video aéreo para eventos. Cotiza por WhatsApp.', true).length,
    1,
    'sin zona',
  )
  assert.equal(problemasDeMeta('Video aéreo en Puebla.', true).length, 1, 'sin invitación')
  assert.deepEqual(problemasDeMeta('Cualquier texto corto sin zona.', false), [])
  assert.equal(problemasDeMeta('a'.repeat(156), false).length, 1)
})

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

test('redes: https y el dominio de esa red', () => {
  assert.ok(urlDeRedValida('facebook', 'https://www.facebook.com/digitalx'))
  assert.ok(urlDeRedValida('instagram', 'https://instagram.com/digitalx'))
  assert.ok(!urlDeRedValida('facebook', 'https://instagram.com/digitalx'))
  assert.ok(!urlDeRedValida('facebook', 'http://facebook.com/digitalx'))
  assert.ok(!urlDeRedValida('tiktok', 'https://evil-tiktok.com/x'))
})
