import assert from 'node:assert/strict'
import test from 'node:test'
import {faltantesDePagina, problemaDePermiso} from './index.ts'

test('permiso: obligatorio en reseñas, clientes y proyectos reales; no en proyectos de ejemplo', () => {
  assert.ok(problemaDePermiso({_type: 'resena'}))
  assert.ok(problemaDePermiso({_type: 'resena', permiso: false}))
  assert.equal(problemaDePermiso({_type: 'resena', permiso: true}), null)
  assert.ok(problemaDePermiso({_type: 'cliente', permiso: false}))
  assert.ok(problemaDePermiso({_type: 'proyecto', permiso: false, esEjemplo: false}))
  assert.equal(problemaDePermiso({_type: 'proyecto', permiso: true}), null)
  assert.equal(problemaDePermiso({_type: 'proyecto', esEjemplo: true}), null)
  assert.ok(
    problemaDePermiso({_type: 'cliente', esEjemplo: true}),
    'solo los proyectos tienen ejemplo',
  )
})

const completo = {
  foto: {asset: {_ref: 'image-x'}},
  mensajeWhatsApp: 'Hola',
  pagina: {
    ficha: [1, 2, 3],
    descripcion: {titulo: 'T', parrafos: ['p']},
    incluye: ['a'],
    tambien: {items: [1]},
    cotizacion: {etiqueta: 'E', texto: 'T'},
    cierre: {titulo: 'T', texto: 'T'},
  },
}

test('faltantesDePagina: vacío si el servicio está completo y dice qué falta si no', () => {
  assert.deepEqual(faltantesDePagina(completo), [])
  assert.deepEqual(faltantesDePagina({}).length, 8)
  assert.deepEqual(faltantesDePagina({...completo, pagina: {...completo.pagina, ficha: [1, 2]}}), [
    'la ficha (exactamente 3 datos)',
  ])
  assert.deepEqual(faltantesDePagina({...completo, foto: undefined}), ['la foto del encabezado'])
})
