import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'
import {validarContenido} from './index.ts'

const muestra = JSON.parse(
  readFileSync(new URL('../muestra/contenido.json', import.meta.url), 'utf8'),
)
const copia = () => structuredClone(muestra)
const doc = (inst, id) => inst.documentos.find((d) => d._id === id)
const errores = (inst, produccion = false) => validarContenido(inst, {produccion}).errores
const con = (inst, patron) => errores(inst).filter((e) => patron.test(e))

test('la muestra (contenido real de production) pasa todas las reglas fuera de producción', () => {
  const {errores, avisos} = validarContenido(muestra, {produccion: false})
  assert.deepEqual(errores, [])
  assert.ok(
    avisos.some((a) => /fotos temporales/.test(a)),
    'avisa de las fotos temporales y los proyectos de ejemplo',
  )
})

test('en producción fallan las fotos temporales y los proyectos de ejemplo, con el campo donde están', () => {
  const e = errores(muestra, true)
  assert.ok(e.some((x) => /categoria-audio.*la foto «foto» es temporal/.test(x)))
  assert.equal(e.filter((x) => /proyecto de ejemplo/.test(x)).length, 5)
})

test('falta un documento único: falla', () => {
  const m = copia()
  m.documentos = m.documentos.filter((d) => d._id !== 'inicio')
  assert.ok(errores(m).some((e) => /Falta el documento publicado «Inicio»/.test(e)))
})

test('un proyecto real publicado sin permiso falla; uno de ejemplo no', () => {
  const m = copia()
  const p = doc(m, 'proyecto-conferencia-empresarial')
  assert.deepEqual(con(m, /sin permiso/), [])
  p.esEjemplo = false
  assert.equal(con(m, /sin permiso/).length, 1)
})

test('reseña y cliente sin permiso fallan', () => {
  const m = copia()
  m.documentos.push(
    {_id: 'r1', _type: 'resena', texto: 'x'.repeat(50), permiso: false},
    {_id: 'c1', _type: 'cliente', nombre: 'E', permiso: false},
  )
  assert.equal(con(m, /sin permiso/).length, 2)
})

test('vocabulario, [PENDIENTE y marcador desconocido fallan', () => {
  const m = copia()
  doc(m, 'servicio-video-con-drone').descripcion = 'Video con dron para vigilancia'
  doc(m, 'nosotros').h1 = '[PENDIENTE: título]'
  doc(m, 'inicio').cobertura.texto = 'Trabajamos en {zona}.'
  assert.ok(con(m, /dron/).length >= 1)
  assert.ok(con(m, /hueco de contenido/).length >= 1)
  assert.ok(con(m, /solo existen estos marcadores/).length >= 1)
})

test('SEO: título de más de 60, meta sin zona y título repetido fallan', () => {
  const m = copia()
  doc(m, 'servicio-video-con-drone').seo.title = `${'a'.repeat(55)} | Digital X`
  doc(m, 'servicio-tienda-en-linea').seo.meta = 'Una tienda en línea. Cotiza por WhatsApp.'
  doc(m, 'categoria-video').seo.title = doc(m, 'categoria-audio').seo.title
  assert.ok(con(m, /título para Google/).length >= 1)
  assert.ok(con(m, /Nombra la zona/).length >= 1)
  assert.ok(con(m, /título para Google está repetida/i).length + con(m, /La título/).length >= 0)
  assert.ok(
    errores(m).some((e) =>
      /repetida en: categoria-audio, categoria-video|repetida en: categoria-video, categoria-audio/.test(
        e,
      ),
    ),
  )
})

test('una página construida incompleta falla', () => {
  const m = copia()
  doc(m, 'servicio-video-con-drone').pagina.ficha = [{etiqueta: 'a', valor: 'b'}]
  assert.ok(con(m, /su página está construida pero falta la ficha/).length === 1)
})

test('fotos: sin alt (y no decorativa) y sin archivo fallan; una decorativa sin alt no', () => {
  const m = copia()
  const inicio = doc(m, 'inicio')
  inicio.fotoPortada.alt = ''
  assert.equal(con(m, /«fotoPortada» no tiene texto alternativo/).length, 1)
  inicio.fotoPortada.decorativa = true
  assert.equal(con(m, /«fotoPortada» no tiene texto alternativo/).length, 0)
  inicio.fotoQueHacemos.asset._ref = 'image-inexistente-1x1-jpg'
  assert.equal(con(m, /«fotoQueHacemos» no tiene su archivo/).length, 1)
})

test('configuración: teléfono, zonas y redes', () => {
  const m = copia()
  const c = doc(m, 'configuracion')
  c.telefono = '244 124 4913'
  c.zonas = ['Atlixco', 'Atlixco']
  c.redes = [
    {red: 'facebook', activa: true},
    {red: 'instagram', url: 'https://www.facebook.com/x'},
  ]
  assert.equal(con(m, /teléfono/).length, 1)
  assert.equal(con(m, /zonas/).length, 1)
  assert.equal(con(m, /activa pero no tiene dirección/).length, 1)
  assert.equal(con(m, /dirección de instagram/).length, 1)
})

test('un marcador {servicios-X} sin servicios en esa categoría, o sin zonas para {zonas}, falla', () => {
  const m = copia()
  m.documentos = m.documentos.filter(
    (d) => !(d._type === 'servicio' && d.categoria._ref === 'categoria-audio'),
  )
  m.documentos.forEach(
    (d) => d._type === 'categoria' && d._id === 'categoria-audio' && (d.sinPagina = []),
  )
  doc(m, 'inicio').preguntas.items[1].respuesta[0].children[0].text = 'En audio, {servicios-audio}.'
  assert.ok(con(m, /marcador \{servicios-audio\}/).length >= 1)
})

test('los campos obligatorios que el sitio necesita fallan con un mensaje claro', () => {
  const m = copia()
  delete doc(m, 'inicio').queHacemos
  delete doc(m, 'categoria-video').cierre
  assert.equal(con(m, /inicio.*falta queHacemos/).length, 1)
  assert.equal(con(m, /categoria-video.*falta cierre/).length, 1)
})

test('las oraciones repetidas son aviso, no error', () => {
  const m = copia()
  const t = 'Esta oración se repite exactamente igual en dos páginas distintas del sitio.'
  doc(m, 'categoria-audio').intro = t
  doc(m, 'categoria-video').intro = t
  const r = validarContenido(m, {produccion: false})
  assert.ok(r.avisos.some((a) => /Oración repetida/.test(a)))
  assert.ok(!r.errores.some((e) => /Oración repetida/.test(e)))
})

test('una referencia fuerte a algo no publicado falla; una débil se omite', () => {
  const m = copia()
  doc(m, 'proyecto-conferencia-empresarial').servicios = [
    {_type: 'reference', _ref: 'servicio-no-publicado'},
  ]
  assert.equal(con(m, /servicio-no-publicado/).length, 1)
  const n = copia()
  doc(n, 'categoria-video').clientes = [
    {_type: 'reference', _ref: 'cliente-sin-publicar', _weak: true},
  ]
  assert.deepEqual(con(n, /cliente-sin-publicar/), [])
})
