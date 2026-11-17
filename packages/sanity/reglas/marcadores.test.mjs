import assert from 'node:assert/strict'
import test from 'node:test'
import {
  categoriasDeMarcadores,
  marcadoresDesconocidos,
  motivoDeBloqueo,
  resolverMarcadores,
} from './index.ts'

test('marcadoresDesconocidos: los conocidos pasan; cualquier otro {algo} se reporta con su campo', () => {
  const doc = (texto) => ({_type: 'inicio', cobertura: {texto}})
  assert.deepEqual(marcadoresDesconocidos(doc('Trabajamos en {zonas}. Y {servicios-audio}.')), [])
  assert.deepEqual(marcadoresDesconocidos(doc('Trabajamos en {zona}.')), [
    {ruta: ['cobertura', 'texto'], marcador: '{zona}'},
  ])
  assert.equal(marcadoresDesconocidos(doc('Hola {nombre} y {zonas} y {otro}')).length, 2)
})

test('resolverMarcadores reemplaza cada marcador por su valor', () => {
  const valores = {
    zonas: 'Puebla y Atlixco',
    'servicios-audio': 'audio',
    'servicios-video': 'video',
    'servicios-tecnologia': 'web',
  }
  assert.equal(
    resolverMarcadores('Trabajamos en {zonas}. En video, {servicios-video}.', valores),
    'Trabajamos en Puebla y Atlixco. En video, video.',
  )
})

test('marcadores en uso y bloqueo: no se quita el último servicio de una categoría que el Inicio nombra', () => {
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
