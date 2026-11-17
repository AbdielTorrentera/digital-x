import assert from 'node:assert/strict'
import test from 'node:test'
import {faltantesDePagina} from './index.ts'

const completo = {
  foto: {asset: {_ref: 'image-x'}},
  mensajeWhatsApp: 'Hola',
  pagina: {
    ficha: [{etiqueta: 'a', valor: 'b'}],
    descripcion: {titulo: 't', parrafos: ['p']},
    incluye: ['x'],
    tambien: {items: [{}]},
    cotizacion: {etiqueta: 'e', texto: 't'},
    cierre: {titulo: 't', texto: 't'},
  },
}

test('faltantesDePagina: vacío si el servicio está completo y dice qué falta si no', () => {
  assert.deepEqual(faltantesDePagina(completo), [])
  assert.equal(faltantesDePagina({}).length, 8)
  assert.deepEqual(faltantesDePagina({...completo, foto: undefined}), ['la foto del encabezado'])
  assert.deepEqual(faltantesDePagina({...completo, pagina: {...completo.pagina, ficha: []}}), [
    'la ficha',
  ])
})

test('la ficha no exige una cantidad fija de datos', () => {
  for (const n of [1, 2, 3, 5]) {
    const ficha = Array.from({length: n}, () => ({etiqueta: 'a', valor: 'b'}))
    assert.deepEqual(faltantesDePagina({...completo, pagina: {...completo.pagina, ficha}}), [])
  }
})
