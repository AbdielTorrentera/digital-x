import assert from 'node:assert/strict'
import test from 'node:test'
import {
  bloquesATexto,
  hallazgosDeVocabulario,
  oraciones,
  oracionesRepetidas,
  textosDe,
} from './index.ts'

const bloque = (texto) => ({
  _type: 'block',
  _key: 'b',
  children: [{_type: 'span', text: texto}],
  markDefs: [],
})
const servicio = (slug, extra = {}) => ({
  _type: 'servicio',
  slug: {_type: 'slug', current: slug},
  ...extra,
})
const mensajes = (doc) => hallazgosDeVocabulario(doc).map((h) => h.mensaje)

test('textosDe: rutas con _key, bloques completos y sin identificadores ni rutas', () => {
  const doc = {
    _id: 'x',
    slug: {current: 'abc'},
    faq: [{_key: 'k1', pregunta: '¿Cuánto?', respuesta: [bloque('Hola '), 3]}],
    ruta: '/proyectos/',
  }
  const textos = [...textosDe(doc)].map((t) => [t.ruta, t.texto])
  assert.deepEqual(textos, [
    [['faq', {_key: 'k1'}, 'pregunta'], '¿Cuánto?'],
    [['faq', {_key: 'k1'}, 'respuesta', {_key: 'b'}], 'Hola '],
  ])
  assert.equal(bloquesATexto([bloque('Uno'), bloque('dos')]), 'Uno dos')
})

test('oraciones: 7 palabras o más, normalizadas, y repetidas entre documentos', () => {
  assert.deepEqual(oraciones('Hola. Esta es una oración con más de siete palabras.'), [
    'esta es una oracion con mas de siete palabras',
  ])
  const r = oracionesRepetidas({
    a: ['Cotizamos a la medida cada evento que nos piden. Algo único aquí.'],
    b: ['COTIZAMOS a la medida cada evento que nos piden!'],
    c: ['Otra cosa muy distinta que no se repite en ningún lado.'],
  })
  assert.equal(r.length, 1)
  assert.deepEqual(r[0].documentos, ['a', 'b'])
})

test('vocabulario global: rechaza lo que las reglas prohíben', () => {
  const casos = {
    vigilancia: 'Servicio de vigilancia para tu evento',
    'cámaras de seguridad': 'Instalamos cámaras de seguridad',
    proyector: 'Incluye proyector',
    'nuestras pantallas': 'Usamos nuestras pantallas LED',
    multicámara: 'Transmisión multicámara',
    dron: 'Video con dron',
    apps: 'Hacemos apps',
    precio: 'Desde $5,000 MXN',
  }
  for (const [nombre, texto] of Object.entries(casos))
    assert.ok(mensajes({_type: 'articulo', cuerpo: [bloque(texto)]}).length >= 1, nombre)
  for (const ok of [
    'Video con drone para eventos',
    'Desarrollo de aplicaciones móviles y una app sencilla',
  ])
    assert.deepEqual(mensajes({_type: 'articulo', extracto: ok}), [], ok)
})

test('circuito cerrado: siempre con «para eventos», «en vivo» o «pantallas»; una pregunta se exime', () => {
  assert.equal(
    mensajes({_type: 'articulo', extracto: 'Contrata un circuito cerrado hoy'}).length,
    1,
  )
  assert.deepEqual(
    mensajes({_type: 'articulo', extracto: 'Circuito cerrado para eventos en Puebla'}),
    [],
  )
  assert.deepEqual(mensajes({_type: 'articulo', extracto: '¿Qué es el circuito cerrado?'}), [])
  assert.ok(
    mensajes({_type: 'articulo', extracto: 'Circuito cerrado en pantallas y seguridad del lugar'})
      .length >= 1,
  )
})

test('no se revisan las reseñas (son palabras del cliente) ni los datos que no son redacción', () => {
  assert.deepEqual(
    mensajes({_type: 'resena', texto: 'Buen servicio, el dron se vio increíble'}),
    [],
  )
  assert.deepEqual(
    mensajes({_type: 'configuracion', telefono: '+522441244913', whatsapp: '522441244913'}),
    [],
  )
})

test('reglas por servicio: drone, páginas web (cifra y Google), tienda (plataforma) y software', () => {
  assert.ok(
    mensajes(servicio('video-con-drone', {extra: 'Contamos con permiso de la AFAC'})).length,
  )
  assert.deepEqual(
    mensajes(servicio('video-con-drone', {extra: 'Revisamos el lugar antes de volar'})),
    [],
  )
  const web = (texto, seccion = 'otra') =>
    servicio('paginas-web', {pagina: {secciones: [{_key: 's', id: seccion, titulo: texto}]}})
  assert.ok(mensajes(web('Aparece en Google')).length, 'Google fuera de posicionamiento')
  assert.deepEqual(mensajes(web('Aparecer bien en Google es otro trabajo', 'posicionamiento')), [])
  assert.deepEqual(
    mensajes(
      servicio('paginas-web', {pagina: {incluye: ['Hasta 3 ajustes pequeños al entregar']}}),
    ),
    [],
  )
  assert.ok(mensajes(servicio('paginas-web', {pagina: {incluye: ['5 secciones']}})).length)
  const tienda = (pregunta, respuesta) =>
    servicio('tienda-en-linea', {pagina: {faq: [{_key: 'f', pregunta, respuesta}]}})
  assert.deepEqual(
    mensajes(tienda('¿Cuál es la mejor plataforma para mi tienda?', 'La que se adapte a ti')),
    [],
  )
  assert.ok(mensajes(tienda('¿Cómo pago?', 'Con la plataforma que quieras')).length)
  assert.ok(mensajes(servicio('desarrollo-de-software', {extra: 'Podemos pasar tu Excel'})).length)
})

test('reglas que dependen del servicio: renta de audio y software exigen palabras en su SEO', () => {
  assert.equal(mensajes(servicio('renta-de-audio', {h1: 'Renta de audio en Puebla'})).length, 1)
  assert.deepEqual(
    mensajes(servicio('renta-de-audio', {h1: 'Renta de audio y sonido para eventos'})),
    [],
  )
  const sw = servicio('desarrollo-de-software', {
    h1: 'Desarrollo de software en Puebla',
    seo: {title: 'x', meta: 'x'},
    descripcion: 'x',
  })
  assert.equal(mensajes(sw).length, 4)
})

test('categorías: sin cifras (salvo 360), sin IVA y «a la medida» solo en sus preguntas', () => {
  const cat = (extra) => ({_type: 'categoria', slug: {current: 'video'}, ...extra})
  assert.deepEqual(mensajes(cat({intro: 'Recorridos 360 para negocios'})), [])
  assert.equal(mensajes(cat({intro: 'Más de 10 años'})).length, 1)
  assert.equal(mensajes(cat({intro: 'Servicio a la medida'})).length, 1)
  assert.deepEqual(
    mensajes(
      cat({faq: [{_key: 'f', pregunta: '¿Es a la medida?', respuesta: 'Sí, a la medida.'}]}),
    ),
    [],
  )
})

test('los textos obligatorios señalan el campo que hay que corregir', () => {
  const sw = hallazgosDeVocabulario(
    servicio('desarrollo-de-software', {
      h1: 'Desarrollo de software',
      seo: {title: 'Software a la medida', meta: 'x'},
    }),
  )
  assert.deepEqual(sw.map((h) => h.ruta.join('.')).sort(), ['descripcion', 'h1', 'seo.meta'])
})

test('marcadores: solo los conocidos; resolver y volver al marcador', async () => {
  const {aMarcadores, resolverMarcadores} = await import('./index.ts')
  assert.deepEqual(
    mensajes({_type: 'inicio', cobertura: {texto: 'Trabajamos en {zonas}. Y {servicios-audio}.'}}),
    [],
  )
  assert.equal(mensajes({_type: 'inicio', cobertura: {texto: 'Trabajamos en {zona}.'}}).length, 1)
  assert.equal(mensajes({_type: 'inicio', cobertura: {texto: 'Hola {nombre}'}}).length, 1)
  const valores = {
    zonas: 'Puebla y Atlixco',
    'servicios-audio': 'audio',
    'servicios-video': 'video',
    'servicios-tecnologia': 'web',
  }
  const plantilla = 'Trabajamos en {zonas}. En video, {servicios-video}.'
  assert.equal(
    resolverMarcadores(plantilla, valores),
    'Trabajamos en Puebla y Atlixco. En video, video.',
  )
  assert.equal(aMarcadores('Trabajamos en Puebla y Atlixco.', valores), 'Trabajamos en {zonas}.')
})

test('el texto alternativo de una foto solo pasa por las reglas de todo el sitio', () => {
  const foto = (alt) => servicio('streaming-para-eventos', {foto: {_type: 'foto', alt}})
  assert.deepEqual(
    mensajes(foto('Manos sobre los controles de una consola de mezcla de audio')),
    [],
  )
  assert.equal(mensajes(foto('Cámaras de seguridad en un salón')).length, 1)
  assert.equal(
    mensajes(servicio('streaming-para-eventos', {descripcion: 'Mezcla en vivo'})).length,
    1,
  )
})

test('marcadores en uso y bloqueo: no se quita el último servicio de una categoría que el Inicio nombra', async () => {
  const {categoriasDeMarcadores, motivoDeBloqueo} = await import('./index.ts')
  assert.deepEqual(
    categoriasDeMarcadores([
      'Trabajamos en {zonas}',
      'En video, {servicios-video}. En audio, {servicios-audio}. {servicios-video}',
    ]),
    ['video', 'audio'],
  )
  const base = {
    categoria: 'video',
    serviciosRestantes: 0,
    sinPagina: 0,
    categoriasEnElInicio: ['video'],
  }
  assert.match(motivoDeBloqueo(base), /{servicios-video}/)
  assert.equal(motivoDeBloqueo({...base, serviciosRestantes: 1}), null)
  assert.equal(motivoDeBloqueo({...base, sinPagina: 1}), null)
  assert.equal(motivoDeBloqueo({...base, categoriasEnElInicio: ['audio']}), null)
})
