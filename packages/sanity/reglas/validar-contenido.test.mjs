import assert from 'node:assert/strict'
import test from 'node:test'
import {validarContenido} from './index.ts'

const foto = (ref = 'image-a') => ({_type: 'foto', asset: {_ref: ref}})
const seo = {title: 'Título', meta: 'Descripción'}
const servicioCompleto = (extra = {}) => ({
  _id: 's1',
  _type: 'servicio',
  nombre: 'Servicio uno',
  slug: {current: 'servicio-uno'},
  categoria: {_ref: 'c1'},
  orden: 1,
  descripcion: 'd',
  h1: 'h',
  mensajeWhatsApp: 'Hola',
  seo,
  foto: foto(),
  paginaConstruida: false,
  ...extra,
})

/** Contenido mínimo que pasa todas las reglas técnicas; cada prueba rompe una cosa. */
const base = () => ({
  assets: {'image-a': {url: 'https://x/a.jpg', extension: 'jpg', width: 10, height: 10}},
  documentos: [
    {
      _id: 'configuracion',
      _type: 'configuracion',
      telefono: '+522441234567',
      whatsapp: '522441234567',
      fundacion: '2018',
      mensajeWhatsAppGeneral: 'Hola',
      zonas: ['Una'],
      redes: [],
      fotoCierre: foto(),
    },
    {
      _id: 'inicio',
      _type: 'inicio',
      h1: 'h',
      queHacemos: {},
      servicios: {},
      proyectos: {},
      porQue: {},
      cobertura: {texto: 'Trabajamos en {zonas}.'},
      preguntas: {},
      cierre: {},
      fotoPortada: foto(),
      fotoQueHacemos: foto(),
      fotoPorQue: foto(),
      seo,
    },
    {
      _id: 'nosotros',
      _type: 'nosotros',
      etiqueta: 'e',
      h1: 'h',
      historia: {},
      distingue: {},
      manifiesto: {},
      proyectos: {},
      preguntas: {},
      cierre: {},
      foto: foto(),
      fotoDistingue: foto(),
      fotoManifiesto: foto(),
      fotoProyectos: foto(),
      fotoCierre: foto(),
      seo,
    },
    {
      _id: 'c1',
      _type: 'categoria',
      etiqueta: 'Cat',
      slug: {current: 'cat'},
      orden: 1,
      titulo: 't',
      para: 'p',
      h1: 'h',
      intro: 'i',
      cierre: {},
      foto: foto(),
      seo,
    },
    servicioCompleto(),
  ],
})
const copia = () => structuredClone(base())
const doc = (inst, id) => inst.documentos.find((d) => d._id === id)
const errores = (inst) => validarContenido(inst).errores
const con = (inst, patron) => errores(inst).filter((e) => patron.test(e))

test('el contenido mínimo pasa', () => {
  assert.deepEqual(errores(base()), [])
})

test('falta un documento fijo: falla', () => {
  const m = copia()
  m.documentos = m.documentos.filter((d) => d._id !== 'inicio')
  assert.ok(errores(m).some((e) => /Falta el documento publicado «Inicio»/.test(e)))
})

test('cero categorías no es un error', () => {
  const m = copia()
  m.documentos = m.documentos.filter((d) => d._type !== 'categoria' && d._type !== 'servicio')
  assert.deepEqual(errores(m), [])
})

test('los campos que la página necesita fallan con un mensaje claro', () => {
  const m = copia()
  delete doc(m, 'inicio').queHacemos
  delete doc(m, 'c1').cierre
  assert.equal(con(m, /inicio.*falta queHacemos/).length, 1)
  assert.equal(con(m, /c1.*falta cierre/).length, 1)
})

test('título y descripción para Google: solo que existan, sin importar su largo', () => {
  const m = copia()
  doc(m, 's1').seo = {title: 'a'.repeat(200), meta: 'b'.repeat(500)}
  doc(m, 'c1').seo = {title: 'a'.repeat(200), meta: 'b'.repeat(500)}
  assert.deepEqual(errores(m), [], 'largos y repetidos pasan')
  delete doc(m, 's1').seo.title
  delete doc(m, 's1').seo.meta
  assert.equal(con(m, /s1.*falta el título para Google/).length, 1)
  assert.equal(con(m, /s1.*falta la descripción para Google/).length, 1)
})

test('slugs: obligatorio, válido y no reservado (en categorías)', () => {
  const m = copia()
  doc(m, 's1').slug = {current: 'Con Mayúsculas'}
  doc(m, 'c1').slug = {current: 'nosotros'}
  assert.equal(con(m, /s1/).length, 1)
  assert.equal(con(m, /c1.*página fija/).length, 1)
  delete doc(m, 's1').slug
  assert.equal(con(m, /s1.*Falta el slug/).length, 1)
})

test('una página construida incompleta falla; la ficha no pide una cantidad fija', () => {
  const m = copia()
  doc(m, 's1').paginaConstruida = true
  assert.ok(con(m, /su página está construida pero falta la ficha/).length === 1)
  doc(m, 's1').pagina = {
    ficha: [{etiqueta: 'a', valor: 'b'}],
    descripcion: {titulo: 't', parrafos: ['p']},
    incluye: ['x'],
    tambien: {items: [{}]},
    cotizacion: {etiqueta: 'e', texto: 't'},
    cierre: {titulo: 't', texto: 't'},
  }
  assert.deepEqual(errores(m), [])
})

test('fotos: sin archivo falla; sin alt, decorativa o temporal pasan', () => {
  const m = copia()
  const inicio = doc(m, 'inicio')
  inicio.fotoPortada = {...foto(), alt: '', decorativa: true, temporal: true}
  assert.deepEqual(errores(m), [])
  inicio.fotoQueHacemos.asset._ref = 'image-inexistente'
  assert.equal(con(m, /«fotoQueHacemos» no tiene su archivo/).length, 1)
})

test('configuración: teléfono, WhatsApp, año, zonas y redes', () => {
  const m = copia()
  const c = doc(m, 'configuracion')
  c.telefono = '244 124 4913'
  c.whatsapp = '2441244913'
  c.fundacion = '18'
  c.zonas = []
  c.redes = [
    {red: 'facebook', activa: true},
    {red: 'instagram', url: 'http://instagram.com/x'},
  ]
  c.enlaceResena = 'http://g.page/x'
  assert.equal(con(m, /teléfono/).length, 1)
  assert.equal(con(m, /WhatsApp/).length, 1)
  assert.equal(con(m, /año de fundación/).length, 1)
  assert.ok(con(m, /al menos una zona/).length >= 1)
  assert.equal(con(m, /activa pero no tiene dirección/).length, 1)
  assert.equal(con(m, /instagram debe empezar con https/).length, 1)
  assert.equal(con(m, /enlace de reseñas/).length, 1)
})

test('zonas: más de seis, repetidas y redes repetidas o de otro dominio ya no fallan', () => {
  const m = copia()
  const c = doc(m, 'configuracion')
  c.zonas = ['A', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
  c.redes = [{red: 'facebook', url: 'https://www.instagram.com/x', activa: true}, {red: 'facebook'}]
  assert.deepEqual(errores(m), [])
})

test('un marcador desconocido falla; los conocidos y los textos de redacción no', () => {
  const m = copia()
  doc(m, 'inicio').cobertura.texto = 'Trabajamos en {zona}.'
  assert.equal(con(m, /«\{zona\}» no es un marcador conocido \(cobertura\.texto\)/).length, 1)
  const n = copia()
  doc(n, 'inicio').cobertura.texto = 'Hay vigilancia, dron, $100 y [PENDIENTE: algo] a la medida.'
  assert.deepEqual(
    errores(n),
    [],
    'el vocabulario y los huecos son guía de redacción, no validación',
  )
})

test('{servicios-X} sin servicios en esa categoría, o {zonas} sin zonas, falla', () => {
  const m = copia()
  doc(m, 'inicio').cobertura.texto = 'Video: {servicios-video}.'
  assert.equal(con(m, /marcador \{servicios-video\}/).length, 1)
  doc(m, 'inicio').cobertura.texto = 'En {servicios-cat}.'
  const n = copia()
  doc(n, 'inicio').cobertura.texto = 'En {servicios-audio}. Y en {zonas}.'
  doc(n, 'configuracion').zonas = []
  assert.equal(con(n, /marcador \{servicios-audio\}/).length, 1)
  assert.equal(con(n, /marcador \{zonas\}/).length, 1)
  const ok = copia()
  doc(ok, 'c1').slug = {current: 'audio'}
  doc(ok, 'inicio').cobertura.texto = 'En {servicios-audio}.'
  assert.deepEqual(errores(ok), [])
})

test('una referencia fuerte a algo no publicado falla; una débil se omite', () => {
  const m = copia()
  doc(m, 's1').categoria = {_type: 'reference', _ref: 'categoria-no-publicada'}
  assert.equal(con(m, /categoria-no-publicada/).length, 1)
  const n = copia()
  doc(n, 'c1').clientes = [{_type: 'reference', _ref: 'cliente-sin-publicar', _weak: true}]
  assert.deepEqual(con(n, /cliente-sin-publicar/), [])
})

test('permiso, proyecto de ejemplo y reseñas cortas ya no se validan', () => {
  const m = copia()
  m.documentos.push(
    {_id: 'p1', _type: 'proyecto', titulo: 'Ejemplo', esEjemplo: true, permiso: false},
    {_id: 'r1', _type: 'resena', texto: 'corta', permiso: false},
    {_id: 'cl1', _type: 'cliente', nombre: 'E', permiso: false},
  )
  assert.deepEqual(errores(m), [])
})
