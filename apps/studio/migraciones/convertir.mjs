// Convierte el contenido actual (apps/web/src/content/*.ts y lib/negocio.ts) en documentos de Sanity, y hace la
// conversión inversa para comprobar que no se perdió ni cambió nada. No escribe en ningún dataset.
// Se ejecuta con el cargador: `node --import ./migraciones/registrar.mjs …`. Se borra en la etapa 3 junto con
// `content/*.ts` (el historial de Git lo conserva).
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {aMarcadores, RUTAS_FIJAS, RUTAS_TAMBIEN, slugificar} from '@digitalx/sanity/reglas'

const WEB = path.resolve(import.meta.dirname, '../../web/src')
const importar = (ruta) => import(pathToFileURL(path.join(WEB, ruta)).href)

const hash = (texto) => createHash('sha1').update(texto).digest('hex')
const clave = (texto) => hash(texto).slice(0, 12)
export const sha1DeArchivo = (ruta) => hash(readFileSync(ruta))

const ref = (id) => ({_type: 'reference', _ref: id})
const idServicio = (slug) => `servicio-${slug}`
const idCategoria = (id) => `categoria-${id}`

// ---------- texto con enlaces <-> Portable Text ----------

/** `string | TextoConEnlaces` → un bloque de Portable Text con sus enlaces como anotaciones. */
function aBloques(texto) {
  const piezas = typeof texto === 'string' ? [texto] : texto
  const base = clave(JSON.stringify(piezas))
  const markDefs = []
  const children = piezas.map((pieza, i) => {
    if (typeof pieza === 'string')
      return {_type: 'span', _key: `${base}s${i}`, text: pieza, marks: []}
    const _key = `${base}m${i}`
    if ('slug' in pieza) {
      markDefs.push({_type: 'enlaceServicio', _key, servicio: ref(idServicio(pieza.slug))})
    } else {
      if (!RUTAS_FIJAS.some((r) => r.value === pieza.url))
        throw new Error(`Enlace a una página que no es fija: ${pieza.url}`)
      markDefs.push({_type: 'enlacePagina', _key, ruta: pieza.url})
    }
    return {_type: 'span', _key: `${base}s${i}`, text: pieza.texto, marks: [_key]}
  })
  return [{_type: 'block', _key: `${base}b`, style: 'normal', markDefs, children}]
}

const normalizarTexto = (texto) => {
  const fusion = []
  for (const pieza of typeof texto === 'string' ? [texto] : texto) {
    if (typeof pieza === 'string' && typeof fusion.at(-1) === 'string')
      fusion[fusion.length - 1] += pieza
    else fusion.push(typeof pieza === 'string' ? pieza : {...pieza})
  }
  return fusion.length === 1 && typeof fusion[0] === 'string' ? fusion[0] : fusion
}

const esTextoConEnlaces = (v) =>
  Array.isArray(v) && v.some((x) => x && typeof x === 'object' && 'texto' in x)

/** Deja un texto con enlaces del contenido original en la misma forma que devuelve `desdeBloques`. */
export const normalizar = (valor) => {
  if (esTextoConEnlaces(valor)) return normalizarTexto(valor)
  if (Array.isArray(valor)) return valor.map(normalizar)
  if (valor && typeof valor === 'object')
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, normalizar(v)]))
  return valor
}

/** Lo inverso de `aBloques`: de Portable Text a `string | TextoConEnlaces`. */
export function desdeBloques(bloques) {
  if (bloques?.length !== 1) throw new Error(`Se esperaba un solo párrafo y hay ${bloques?.length}`)
  const [bloque] = bloques
  return normalizarTexto(
    bloque.children.map((hijo) => {
      const def = bloque.markDefs.find((d) => hijo.marks.includes(d._key))
      if (!def) return hijo.text
      if (def._type === 'enlaceServicio')
        return {slug: def.servicio._ref.replace(/^servicio-/, ''), texto: hijo.text}
      return {url: def.ruta, texto: hijo.text}
    }),
  )
}

// ---------- claves de los elementos de las listas ----------

/** Cada objeto de una lista necesita un `_key`; se calcula de su posición para que sea el mismo en cada ejecución. */
function conClaves(valor, ruta) {
  if (Array.isArray(valor)) {
    valor.forEach((item, i) => {
      if (item && typeof item === 'object') {
        item._key ??= clave(`${ruta}/${i}`)
        conClaves(item, `${ruta}/${item._key}`)
      }
    })
  } else if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) conClaves(v, `${ruta}/${k}`)
  }
}

// ---------- construcción ----------

export async function construir() {
  const [
    inicio,
    nosotros,
    proyectosM,
    serviciosM,
    fotosS,
    categoriasM,
    fotosC,
    negocioM,
    libServicios,
  ] = await Promise.all([
    importar('content/inicio.ts'),
    importar('content/nosotros.ts'),
    importar('content/proyectos.ts'),
    importar('content/servicios.ts'),
    importar('content/servicios-fotos.ts'),
    importar('content/categorias.ts'),
    importar('content/categorias-fotos.ts'),
    importar('lib/negocio.ts'),
    importar('lib/servicios.ts'),
  ])
  const {servicios} = serviciosM
  const {categorias, guia} = categoriasM
  const {zonas, mensajesWhatsApp, negocio} = negocioM
  const {lista, serviciosDe} = libServicios

  const marcadores = {
    zonas: zonas.texto,
    'servicios-audio': lista.audio,
    'servicios-video': lista.video,
    'servicios-tecnologia': lista.tecnologia,
  }

  // Fotos: las que hoy no tienen texto alternativo (el contenido guarda solo el archivo) son decorativas: fondos.
  const rutaFoto = (f) => (typeof f.src === 'string' ? f.src : f.src.src)
  const archivos = new Set()
  const foto = (f) => {
    const ruta = rutaFoto(f)
    archivos.add(ruta)
    return {
      _type: 'foto',
      // El importador espera la marca en el objeto de la foto y pone él mismo la referencia `asset`.
      _sanityAsset: `image@${pathToFileURL(ruta).href}`,
      ...(f.alt ? {alt: f.alt} : {decorativa: true}),
      temporal: path.basename(ruta).startsWith('temporal-'),
    }
  }

  const pregunta = (p) => ({
    _type: 'pregunta',
    pregunta: p.pregunta,
    respuesta: aBloques(p.respuesta),
  })
  const preguntas = (bloque) => ({
    etiqueta: bloque.etiqueta,
    titulo: bloque.titulo,
    texto: bloque.texto,
    items: bloque.items.map(pregunta),
  })
  // Las respuestas que hoy se arman con datos se guardan con marcadores ({zonas}, {servicios-audio}…).
  const conMarcadores = (t) => (typeof t === 'string' ? aMarcadores(t, marcadores) : t)

  const documentos = []

  // --- configuracion ---
  documentos.push({
    _id: 'configuracion',
    _type: 'configuracion',
    telefono: negocio.telefono.tel,
    whatsapp: negocio.whatsapp,
    fundacion: negocio.fundacion,
    mensajeWhatsAppGeneral: mensajesWhatsApp.general,
    // Las URLs siguen pendientes (negocio.ts): las redes quedan creadas pero ocultas y sin dirección.
    redes: ['facebook', 'instagram', 'tiktok', 'google'].map((red) => ({
      _type: 'red',
      red,
      activa: false,
    })),
    zonas: zonas.todas,
    fotoCierre: foto(fotosS.fotoCierre),
  })

  // --- categorias ---
  categorias.forEach((c, i) => {
    if (c.id !== c.slug)
      throw new Error(
        `La categoría ${c.id} tiene un slug distinto: la migración supone que son iguales`,
      )
    documentos.push({
      _id: idCategoria(c.id),
      _type: 'categoria',
      etiqueta: c.etiqueta,
      slug: {_type: 'slug', current: c.slug},
      orden: i + 1,
      titulo: c.titulo,
      para: c.para,
      ...(c.sinPagina ? {sinPagina: c.sinPagina} : {}),
      h1: c.h1,
      intro: c.intro,
      cierre: {_type: 'cierre', ...c.cierre},
      foto: foto(fotosC.fotosDeCategoria[c.id]),
      faq: c.faq.map(pregunta),
      clientes: c.clientes.map(() => {
        throw new Error('Hay clientes en el contenido: la migración no los conoce')
      }),
      seo: {title: c.title, meta: c.meta},
    })
  })

  // --- servicios ---
  const bloque = (b) => {
    if ('parrafo' in b) return {_type: 'bloqueParrafo', texto: aBloques(b.parrafo)}
    if ('lista' in b) return {_type: 'bloqueLista', items: b.lista}
    return {
      _type: 'bloquePuntos',
      items: b.puntos.map((p) => ({
        _type: 'punto',
        titulo: aBloques(p.titulo),
        texto: aBloques(p.texto),
      })),
    }
  }
  for (const categoria of categorias) {
    serviciosDe(categoria.id).forEach((s, i) => {
      const c = servicios[s.slug]
      const p = c.pagina
      if (fotosS.fotos[s.slug].galeria?.length)
        throw new Error(`${s.slug} tiene galería: la migración no la conoce`)
      documentos.push({
        _id: idServicio(s.slug),
        _type: 'servicio',
        nombre: s.titulo,
        slug: {_type: 'slug', current: s.slug},
        categoria: ref(idCategoria(categoria.id)),
        orden: i + 1,
        paginaConstruida: s.construida,
        descripcion: c.descripcion,
        h1: c.h1,
        ...(c.serviceType ? {serviceType: c.serviceType} : {}),
        mensajeWhatsApp: c.mensaje,
        seo: {title: c.title, meta: c.meta},
        foto: foto(fotosS.fotos[s.slug]),
        pagina: {
          ficha: p.ficha.map((f) => ({_type: 'filaFicha', etiqueta: f.etiqueta, valor: f.valor})),
          descripcion: {titulo: p.descripcion.titulo, parrafos: p.descripcion.parrafos},
          incluye: p.incluye,
          ...(p.incluyeNota ? {incluyeNota: aBloques(p.incluyeNota)} : {}),
          ...(p.secciones
            ? {
                secciones: p.secciones.map((sec) => ({
                  _type: 'seccion',
                  titulo: sec.titulo,
                  etiqueta: sec.etiqueta,
                  id: {_type: 'slug', current: sec.id},
                  bloques: sec.bloques.map(bloque),
                })),
              }
            : {}),
          tambien: {
            _type: 'tambien',
            ...(p.tambien.intro ? {intro: p.tambien.intro} : {}),
            items: p.tambien.items.map((item) => {
              if ('slug' in item)
                return {
                  _type: 'relacionadoServicio',
                  servicio: ref(idServicio(item.slug)),
                  texto: item.texto,
                }
              if (!RUTAS_TAMBIEN.some((r) => r.value === item.url))
                throw new Error(`"También" enlaza a ${item.url}`)
              return {
                _type: 'relacionadoPagina',
                titulo: item.titulo,
                ruta: item.url,
                texto: item.texto,
              }
            }),
          },
          cotizacion: {_type: 'cotizacion', ...p.cotizacion},
          cierre: {_type: 'cierre', ...p.cierre},
          ...(p.faq ? {faq: p.faq.map(pregunta)} : {}),
        },
      })
    })
  }

  // --- inicio ---
  documentos.push({
    _id: 'inicio',
    _type: 'inicio',
    h1: inicio.portada.h1,
    queHacemos: {
      etiqueta: inicio.queHacemos.etiqueta,
      titulo: inicio.queHacemos.titulo,
      texto: inicio.queHacemos.texto,
      boton: inicio.queHacemos.boton.etiqueta,
    },
    servicios: {etiqueta: inicio.servicios.etiqueta, titulo: inicio.servicios.titulo},
    proyectos: {etiqueta: inicio.proyectos.etiqueta, titulo: inicio.proyectos.titulo},
    porQue: {
      etiqueta: inicio.porQue.etiqueta,
      titulo: inicio.porQue.titulo,
      items: inicio.porQue.items.map((i) => ({_type: 'ventaja', titulo: i.titulo, texto: i.texto})),
    },
    cobertura: {
      etiqueta: inicio.cobertura.etiqueta,
      titulo: inicio.cobertura.titulo,
      texto: conMarcadores(inicio.cobertura.texto),
    },
    preguntas: preguntas({
      ...inicio.faq,
      items: inicio.faq.items.map((i) => ({...i, respuesta: conMarcadores(i.respuesta)})),
    }),
    cierre: {_type: 'cierre', titulo: inicio.cierre.titulo, texto: inicio.cierre.texto},
    fotoPortada: foto(inicio.portada.foto),
    fotoQueHacemos: foto(inicio.queHacemos.foto),
    fotoPorQue: foto(inicio.porQue.foto),
    seo: {title: inicio.portada.title, meta: inicio.portada.descripcion},
  })

  // --- nosotros ---
  documentos.push({
    _id: 'nosotros',
    _type: 'nosotros',
    etiqueta: nosotros.pagina.etiqueta,
    h1: nosotros.pagina.h1,
    historia: {
      etiqueta: nosotros.historia.etiqueta,
      texto: nosotros.historia.texto,
      hitos: nosotros.historia.hitos.map((h) => ({
        _type: 'hito',
        anio: h.anio,
        titulo: h.titulo,
        texto: h.texto,
      })),
    },
    distingue: {
      titulo: nosotros.distingue.titulo,
      items: nosotros.distingue.items.map((i) => ({
        _type: 'tarjeta',
        titulo: i.titulo,
        texto: i.texto,
      })),
    },
    manifiesto: {
      titulo: nosotros.manifiesto.titulo,
      items: nosotros.manifiesto.items.map((i) => ({
        _type: 'punto',
        titulo: i.titulo,
        texto: i.texto,
      })),
    },
    proyectos: {
      etiqueta: nosotros.proyectosPagina.etiqueta,
      titulo: nosotros.proyectosPagina.titulo,
      boton: nosotros.proyectosPagina.boton.etiqueta,
    },
    preguntas: preguntas(nosotros.faq),
    cierre: {_type: 'cierre', titulo: nosotros.cierre.titulo, texto: nosotros.cierre.texto},
    foto: foto(nosotros.pagina.foto),
    fotoDistingue: foto(nosotros.distingue.foto),
    fotoManifiesto: foto(nosotros.manifiesto.foto),
    fotoProyectos: foto(nosotros.proyectosPagina.foto),
    fotoCierre: foto(nosotros.cierre.foto),
    seo: {title: nosotros.pagina.title, meta: nosotros.pagina.descripcion},
  })

  // --- guía de servicios (inactiva) ---
  documentos.push({
    _id: 'guiaDeServicios',
    _type: 'guiaDeServicios',
    etiqueta: guia.etiqueta,
    titulo: guia.titulo,
    items: guia.items.map((i) => ({
      _type: 'caso',
      escenario: i.escenario,
      servicios: i.slugs.map((s) => ref(idServicio(s))),
    })),
  })

  // --- proyectos de ejemplo ---
  const idPorNombre = new Map(
    categorias.flatMap((c) => serviciosDe(c.id)).map((s) => [s.titulo, s.slug]),
  )
  for (const p of proyectosM.proyectos) {
    documentos.push({
      _id: `proyecto-${slugificar(p.titulo, 80)}`,
      _type: 'proyecto',
      titulo: p.titulo,
      slug: {_type: 'slug', current: slugificar(p.titulo, 80)},
      resumen: p.texto,
      municipio: p.municipio,
      servicios: p.servicios.map((nombre) => {
        if (!idPorNombre.has(nombre))
          throw new Error(`El proyecto «${p.titulo}» usa un servicio que no existe: ${nombre}`)
        return ref(idServicio(idPorNombre.get(nombre)))
      }),
      fotos: [foto(p.foto)],
      permiso: p.permiso,
      esEjemplo: p.placeholder,
    })
  }

  // --- autor del blog ---
  documentos.push({
    _id: 'autor-equipo-digitalx',
    _type: 'autor',
    nombre: 'Equipo Digital X',
    esOrganizacion: true,
  })

  for (const doc of documentos) conClaves(doc, doc._id)

  const ids = documentos.map((d) => d._id)
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (repetidos.length) throw new Error(`IDs repetidos: ${repetidos.join(', ')}`)

  return {
    documentos,
    archivos: [...archivos],
    marcadores,
    originales: {
      fotoCierre: fotosS.fotoCierre,
      inicio,
      nosotros,
      proyectos: proyectosM.proyectos,
      servicios,
      fotosServicios: fotosS.fotos,
      categorias,
      fotosCategorias: fotosC.fotosDeCategoria,
      guia,
      negocio: negocioM,
      lista,
      serviciosDe,
    },
  }
}

// ---------- conversión inversa y comparación ----------

const limpio = (x) => JSON.parse(JSON.stringify(x))

/** De un documento de Sanity de vuelta a la forma del contenido original (para compararlas). */
export function invertir(doc, {marcadores, nombreDeServicio}) {
  const resolver = (t) =>
    typeof t === 'string'
      ? Object.entries(marcadores).reduce((s, [m, v]) => s.replaceAll(`{${m}}`, v), t)
      : t
  const faq = (items) =>
    items.map((p) => ({pregunta: p.pregunta, respuesta: desdeBloques(p.respuesta)}))
  const deBloque = (b) => {
    if (b._type === 'bloqueParrafo') return {parrafo: desdeBloques(b.texto)}
    if (b._type === 'bloqueLista') return {lista: b.items}
    return {
      puntos: b.items.map((p) => ({titulo: desdeBloques(p.titulo), texto: desdeBloques(p.texto)})),
    }
  }
  const sinTipo = ({_type, _key, ...resto}) => resto
  const fotoDe = (f) => ({archivo: f.asset.archivo, alt: f.alt, decorativa: f.decorativa === true})
  switch (doc._type) {
    case 'servicio': {
      const p = doc.pagina
      return {
        nombre: doc.nombre,
        orden: doc.orden,
        construida: doc.paginaConstruida,
        categoria: doc.categoria._ref,
        foto: fotoDe(doc.foto),
        contenido: {
          descripcion: doc.descripcion,
          title: doc.seo.title,
          meta: doc.seo.meta,
          h1: doc.h1,
          mensaje: doc.mensajeWhatsApp,
          serviceType: doc.serviceType,
          pagina: {
            ficha: p.ficha.map(({etiqueta, valor}) => ({etiqueta, valor})),
            descripcion: {titulo: p.descripcion.titulo, parrafos: p.descripcion.parrafos},
            incluye: p.incluye,
            incluyeNota: p.incluyeNota && desdeBloques(p.incluyeNota),
            secciones: p.secciones?.map((s) => ({
              id: s.id.current,
              etiqueta: s.etiqueta,
              titulo: s.titulo,
              bloques: s.bloques.map(deBloque),
            })),
            tambien: {
              intro: p.tambien.intro,
              items: p.tambien.items.map((i) =>
                i._type === 'relacionadoServicio'
                  ? {slug: i.servicio._ref.replace(/^servicio-/, ''), texto: i.texto}
                  : {titulo: i.titulo, url: i.ruta, texto: i.texto},
              ),
            },
            cotizacion: sinTipo(p.cotizacion),
            cierre: sinTipo(p.cierre),
            faq: p.faq && faq(p.faq),
          },
        },
      }
    }
    case 'categoria':
      return {
        etiqueta: doc.etiqueta,
        slug: doc.slug.current,
        orden: doc.orden,
        titulo: doc.titulo,
        para: doc.para,
        sinPagina: doc.sinPagina,
        title: doc.seo.title,
        meta: doc.seo.meta,
        h1: doc.h1,
        intro: doc.intro,
        cierre: sinTipo(doc.cierre),
        faq: faq(doc.faq),
        clientes: doc.clientes,
        foto: fotoDe(doc.foto),
      }
    case 'inicio':
      return {
        h1: doc.h1,
        seo: doc.seo,
        queHacemos: doc.queHacemos,
        servicios: doc.servicios,
        proyectos: doc.proyectos,
        porQue: {
          ...doc.porQue,
          items: doc.porQue.items.map(({titulo, texto}) => ({titulo, texto})),
        },
        cobertura: {...doc.cobertura, texto: resolver(doc.cobertura.texto)},
        preguntas: {
          etiqueta: doc.preguntas.etiqueta,
          titulo: doc.preguntas.titulo,
          texto: doc.preguntas.texto,
          items: faq(doc.preguntas.items).map((i) => ({...i, respuesta: resolver(i.respuesta)})),
        },
        cierre: sinTipo(doc.cierre),
        fotos: [doc.fotoPortada, doc.fotoQueHacemos, doc.fotoPorQue].map(fotoDe),
      }
    case 'nosotros':
      return {
        etiqueta: doc.etiqueta,
        h1: doc.h1,
        seo: doc.seo,
        historia: {
          ...doc.historia,
          hitos: doc.historia.hitos.map(({anio, titulo, texto}) => ({anio, titulo, texto})),
        },
        distingue: {
          titulo: doc.distingue.titulo,
          items: doc.distingue.items.map(({titulo, texto}) => ({titulo, texto})),
        },
        manifiesto: {
          titulo: doc.manifiesto.titulo,
          items: doc.manifiesto.items.map(({titulo, texto}) => ({titulo, texto})),
        },
        proyectos: doc.proyectos,
        preguntas: {
          etiqueta: doc.preguntas.etiqueta,
          titulo: doc.preguntas.titulo,
          texto: doc.preguntas.texto,
          items: faq(doc.preguntas.items),
        },
        cierre: sinTipo(doc.cierre),
        fotos: [
          doc.foto,
          doc.fotoDistingue,
          doc.fotoManifiesto,
          doc.fotoProyectos,
          doc.fotoCierre,
        ].map(fotoDe),
      }
    case 'proyecto':
      return {
        titulo: doc.titulo,
        municipio: doc.municipio,
        servicios: doc.servicios.map((r) => nombreDeServicio(r._ref)),
        texto: doc.resumen,
        permiso: doc.permiso,
        placeholder: doc.esEjemplo,
        foto: fotoDe(doc.fotos[0]),
        fotos: doc.fotos.length,
      }
    case 'guiaDeServicios':
      return {
        etiqueta: doc.etiqueta,
        titulo: doc.titulo,
        items: doc.items.map((i) => ({
          escenario: i.escenario,
          slugs: i.servicios.map((r) => r._ref.replace(/^servicio-/, '')),
        })),
      }
    case 'configuracion':
      return {
        telefono: doc.telefono,
        whatsapp: doc.whatsapp,
        fundacion: doc.fundacion,
        mensajeWhatsAppGeneral: doc.mensajeWhatsAppGeneral,
        redes: doc.redes.map(({red, activa, url}) => ({red, activa, url})),
        zonas: doc.zonas,
        fotoCierre: fotoDe(doc.fotoCierre),
      }
    case 'autor':
      return {nombre: doc.nombre, esOrganizacion: doc.esOrganizacion}
    default:
      throw new Error(`Tipo sin conversión inversa: ${doc._type}`)
  }
}

/** Lo que debe salir de `invertir` para cada documento, según el contenido original. */
export function esperado(doc, {originales: o, marcadores}) {
  const archivo = (f) => ({
    archivo: path.basename(typeof f.src === 'string' ? f.src : f.src.src),
    alt: f.alt,
  })
  const rutaSrc = (f) => (typeof f.src === 'string' ? f.src : f.src.src)
  const conAlt = (f) => ({archivo: path.basename(rutaSrc(f)), alt: f.alt, decorativa: !f.alt})
  switch (doc._type) {
    case 'servicio': {
      const slug = doc.slug.current
      const {para, incluye, ...contenido} = o.servicios[slug]
      // Un texto con enlaces sin ningún enlace (lista de trozos de texto) se lee igual que un texto corrido.
      const comoTexto = (t) => (typeof t === 'string' || Array.isArray(t) ? normalizarTexto(t) : t)
      const pagina = contenido.pagina
      contenido.pagina = {
        ...pagina,
        incluyeNota: pagina.incluyeNota && comoTexto(pagina.incluyeNota),
        secciones: pagina.secciones?.map((sec) => ({
          ...sec,
          bloques: sec.bloques.map((b) =>
            'parrafo' in b
              ? {parrafo: comoTexto(b.parrafo)}
              : 'puntos' in b
                ? {
                    puntos: b.puntos.map((pt) => ({
                      titulo: comoTexto(pt.titulo),
                      texto: comoTexto(pt.texto),
                    })),
                  }
                : b,
          ),
        })),
        faq: pagina.faq?.map((f) => ({...f, respuesta: comoTexto(f.respuesta)})),
      }
      const delRegistro = o.serviciosDe(
        o.categorias.find((c) => `categoria-${c.id}` === doc.categoria._ref).id,
      )
      const servicio = delRegistro.find((s) => s.slug === slug)
      return {
        nombre: servicio.titulo,
        orden: delRegistro.indexOf(servicio) + 1,
        construida: servicio.construida,
        categoria: doc.categoria._ref,
        foto: conAlt(o.fotosServicios[slug]),
        contenido: normalizar(contenido),
      }
    }
    case 'categoria': {
      const {id, ...c} = o.categorias.find((x) => `categoria-${x.id}` === doc._id)
      const {clientes, ...resto} = c
      return {
        ...normalizar(resto),
        orden: o.categorias.findIndex((x) => x.id === id) + 1,
        clientes: [],
        foto: conAlt(o.fotosCategorias[id]),
      }
    }
    case 'inicio': {
      const i = o.inicio
      return normalizar({
        h1: i.portada.h1,
        seo: {title: i.portada.title, meta: i.portada.descripcion},
        queHacemos: {
          etiqueta: i.queHacemos.etiqueta,
          titulo: i.queHacemos.titulo,
          texto: i.queHacemos.texto,
          boton: i.queHacemos.boton.etiqueta,
        },
        servicios: {etiqueta: i.servicios.etiqueta, titulo: i.servicios.titulo},
        proyectos: {etiqueta: i.proyectos.etiqueta, titulo: i.proyectos.titulo},
        porQue: {etiqueta: i.porQue.etiqueta, titulo: i.porQue.titulo, items: i.porQue.items},
        cobertura: {
          etiqueta: i.cobertura.etiqueta,
          titulo: i.cobertura.titulo,
          texto: i.cobertura.texto,
        },
        preguntas: {
          etiqueta: i.faq.etiqueta,
          titulo: i.faq.titulo,
          texto: i.faq.texto,
          items: i.faq.items,
        },
        cierre: {titulo: i.cierre.titulo, texto: i.cierre.texto},
        fotos: [i.portada.foto, i.queHacemos.foto, i.porQue.foto].map(conAlt),
      })
    }
    case 'nosotros': {
      const n = o.nosotros
      return normalizar({
        etiqueta: n.pagina.etiqueta,
        h1: n.pagina.h1,
        seo: {title: n.pagina.title, meta: n.pagina.descripcion},
        historia: n.historia,
        distingue: {titulo: n.distingue.titulo, items: n.distingue.items},
        manifiesto: {titulo: n.manifiesto.titulo, items: n.manifiesto.items},
        proyectos: {
          etiqueta: n.proyectosPagina.etiqueta,
          titulo: n.proyectosPagina.titulo,
          boton: n.proyectosPagina.boton.etiqueta,
        },
        preguntas: {
          etiqueta: n.faq.etiqueta,
          titulo: n.faq.titulo,
          texto: n.faq.texto,
          items: n.faq.items,
        },
        cierre: {titulo: n.cierre.titulo, texto: n.cierre.texto},
        fotos: [
          n.pagina.foto,
          n.distingue.foto,
          n.manifiesto.foto,
          n.proyectosPagina.foto,
          n.cierre.foto,
        ].map(conAlt),
      })
    }
    case 'proyecto': {
      const p = o.proyectos.find((x) => x.titulo === doc.titulo)
      return {
        titulo: p.titulo,
        municipio: p.municipio,
        servicios: p.servicios,
        texto: p.texto,
        permiso: p.permiso,
        placeholder: p.placeholder,
        foto: conAlt(p.foto),
        fotos: 1,
      }
    }
    case 'guiaDeServicios':
      return {etiqueta: o.guia.etiqueta, titulo: o.guia.titulo, items: o.guia.items}
    case 'configuracion': {
      const {negocio, zonas, mensajesWhatsApp} = o.negocio
      return {
        telefono: negocio.telefono.tel,
        whatsapp: negocio.whatsapp,
        fundacion: negocio.fundacion,
        mensajeWhatsAppGeneral: mensajesWhatsApp.general,
        redes: ['facebook', 'instagram', 'tiktok', 'google'].map((red) => ({red, activa: false})),
        zonas: zonas.todas,
        fotoCierre: conAlt(o.fotoCierre),
      }
    }
    case 'autor':
      return {nombre: 'Equipo Digital X', esOrganizacion: true}
    default:
      throw new Error(`Tipo sin valor esperado: ${doc._type}`)
  }
}

export {limpio}
