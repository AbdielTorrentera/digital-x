import {foto} from './objetos/foto'
import {textoConEnlaces} from './objetos/texto'
import {bloqueLista, bloqueParrafo, bloquePuntos, seccion} from './objetos/bloques'
import {
  cierre,
  cotizacion,
  filaFicha,
  pregunta,
  red,
  relacionadoPagina,
  relacionadoServicio,
  seccionGaleria,
  tambien,
} from './objetos/comunes'
import {cuerpoArticulo} from './objetos/cuerpoArticulo'
import {configuracion} from './documentos/configuracion'
import {inicio, nosotros, paginaBlog, paginaProyectos, paginaResenas} from './documentos/paginas'
import {categoria} from './documentos/categoria'
import {servicio} from './documentos/servicio'
import {proyecto} from './documentos/proyecto'
import {cliente} from './documentos/cliente'
import {resena} from './documentos/resena'
import {articulo, autor, categoriaBlog} from './documentos/blog'
import {guiaDeServicios} from './documentos/guia'

export const schemaTypes = [
  // Documentos únicos
  configuracion,
  inicio,
  nosotros,
  paginaProyectos,
  paginaBlog,
  paginaResenas,
  guiaDeServicios,
  // Documentos
  categoria,
  servicio,
  proyecto,
  cliente,
  resena,
  articulo,
  categoriaBlog,
  autor,
  // Objetos reutilizables
  foto,
  textoConEnlaces,
  bloqueParrafo,
  bloqueLista,
  bloquePuntos,
  seccion,
  pregunta,
  filaFicha,
  relacionadoServicio,
  relacionadoPagina,
  tambien,
  cierre,
  cotizacion,
  seccionGaleria,
  red,
  cuerpoArticulo,
]
