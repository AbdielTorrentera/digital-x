import {defineArrayMember, defineField, defineType} from 'sanity'
import {campoFoto, campoSeo} from '../campos'
import {validacionDePagina} from '../../validaciones'

const GRUPOS = [
  {name: 'contenido', title: 'Textos', default: true},
  {name: 'fotos', title: 'Fotos'},
  {name: 'seo', title: 'Google'},
]

const texto = (name: string, title: string, description: string, max: number) =>
  defineField({
    name,
    title,
    type: 'string',
    group: 'contenido',
    description,
    validation: (Rule) => Rule.required().max(max),
  })

const parrafo = (name: string, title: string, description: string, max = 400) =>
  defineField({
    name,
    title,
    type: 'text',
    rows: 3,
    group: 'contenido',
    description,
    validation: (Rule) => Rule.required().max(max),
  })

export const inicio = defineType({
  name: 'inicio',
  title: 'Inicio',
  type: 'document',
  groups: GRUPOS,
  validation: validacionDePagina,
  fields: [
    defineField({
      name: 'h1',
      title: 'Título principal (H1)',
      type: 'string',
      group: 'contenido',
      description:
        'El título grande de la portada. Es el único H1 de la página. Menciona el servicio y la ciudad. Ejemplo: Audio, video y tecnología para tus eventos y tu negocio en Puebla',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'queHacemos',
      title: 'Sección «Qué hacemos»',
      type: 'object',
      group: 'contenido',
      description:
        'La sección con foto debajo de la portada. Su texto no puede repetirse en ninguna otra página.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Digital X', 30),
        texto('titulo', 'Título', 'Ejemplo: Qué hacemos', 60),
        parrafo(
          'texto',
          'Texto',
          'El texto aprobado de la sección. No lleva cifras ni precios.',
          500,
        ),
        texto(
          'boton',
          'Texto del botón',
          'Baja a las tarjetas de servicios. Ejemplo: Ver servicios',
          30,
        ),
      ],
    }),
    defineField({
      name: 'servicios',
      title: 'Sección de servicios',
      type: 'object',
      group: 'contenido',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Servicios', 30),
        texto('titulo', 'Título', 'Ejemplo: Servicios de audio, video y tecnología en Puebla', 90),
      ],
    }),
    defineField({
      name: 'proyectos',
      title: 'Sección de proyectos',
      type: 'object',
      group: 'contenido',
      description: 'Solo se muestra cuando hay al menos 3 proyectos con foto y permiso.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Proyectos', 30),
        texto('titulo', 'Título', 'Ejemplo: Proyectos de Digital X', 60),
      ],
    }),
    defineField({
      name: 'resenas',
      title: 'Sección de reseñas',
      type: 'object',
      group: 'contenido',
      description:
        'Muestra las reseñas marcadas como «destacada». Si no hay ninguna publicada con permiso, la sección no aparece.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Reseñas', 30),
        texto('titulo', 'Título', 'Ejemplo: Lo que dicen nuestros clientes', 70),
      ],
    }),
    defineField({
      name: 'porQue',
      title: 'Sección «Por qué Digital X»',
      type: 'object',
      group: 'contenido',
      description:
        'Ventajas que se pueden comprobar. No se publican topes de personas ni datos del equipo.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Por qué Digital X', 30),
        texto('titulo', 'Título', 'Ejemplo: Por qué contratar a Digital X', 70),
        defineField({
          name: 'items',
          title: 'Ventajas',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'ventaja',
              fields: [
                texto('titulo', 'Título', 'Ejemplo: Un solo proveedor', 50),
                parrafo(
                  'texto',
                  'Texto',
                  'Una frase. Ejemplo: Audio, video y tecnología con un solo equipo de trabajo.',
                  200,
                ),
              ],
              preview: {select: {title: 'titulo', subtitle: 'texto'}},
            }),
          ],
          validation: (Rule) => Rule.required().min(3).max(6),
        }),
      ],
    }),
    defineField({
      name: 'cobertura',
      title: 'Sección de cobertura',
      type: 'object',
      group: 'contenido',
      description:
        'Sin condiciones de traslado ni cargos. Puedes escribir {zonas} para los lugares de cobertura y {servicios-audio}, {servicios-video} y {servicios-tecnologia} para los nombres de los servicios: el sitio los pone y los mantiene al día.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Cobertura', 30),
        texto('titulo', 'Título', 'Ejemplo: Dónde trabajamos', 60),
        parrafo(
          'texto',
          'Texto',
          'Ejemplo: Trabajamos en Puebla, Atlixco, Izúcar de Matamoros y alrededores. Si tu evento es en otro lugar, escríbenos y lo vemos.',
        ),
      ],
    }),
    defineField({
      name: 'preguntas',
      title: 'Sección de preguntas frecuentes',
      type: 'object',
      group: 'contenido',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Preguntas frecuentes', 30),
        texto('titulo', 'Título', 'Ejemplo: Preguntas frecuentes', 60),
        parrafo(
          'texto',
          'Frase de introducción',
          'Ejemplo: Lo que más nos preguntan al cotizar.',
          160,
        ),
        defineField({
          name: 'items',
          title: 'Preguntas',
          type: 'array',
          of: [defineArrayMember({type: 'pregunta'})],
          description:
            'Puedes escribir {zonas} para los lugares de cobertura y {servicios-audio}, {servicios-video} y {servicios-tecnologia} para los nombres de los servicios: el sitio los pone y los mantiene al día.',
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'cierre',
      title: 'Cierre de la página',
      type: 'cierre',
      group: 'contenido',
      description:
        'Con los botones de WhatsApp y llamada. El título es el llamado final. Ejemplo: Cotiza tu evento o proyecto',
    }),
    campoFoto({
      name: 'fotoPortada',
      title: 'Foto de la portada',
      group: 'fotos',
      description:
        'La foto que se ve de fondo en la portada del Inicio. Es lo primero que carga: mejor horizontal y con la pantalla o el escenario bien visibles.',
    }),
    campoFoto({
      name: 'fotoQueHacemos',
      title: 'Foto de «Qué hacemos»',
      group: 'fotos',
      description: 'Horizontal. Ejemplo: un presentador en un escenario con pantalla grande.',
    }),
    campoFoto({
      name: 'fotoPorQue',
      title: 'Foto de «Por qué Digital X»',
      group: 'fotos',
      description: 'Ejemplo: manos sobre los controles de una consola de audio.',
    }),
    campoSeo({
      ejemploTitle: 'Audio, video y tecnología en Puebla y Atlixco | Digital X',
      ejemploMeta:
        'Renta de audio, circuito cerrado para eventos, streaming y desarrollo web en Puebla, Atlixco e Izúcar de Matamoros. Cotiza con Digital X.',
    }),
  ],
  preview: {prepare: () => ({title: 'Inicio'})},
})

export const nosotros = defineType({
  name: 'nosotros',
  title: 'Nosotros',
  type: 'document',
  groups: GRUPOS,
  validation: validacionDePagina,
  fields: [
    texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Nosotros', 30),
    defineField({
      name: 'h1',
      title: 'Título principal (H1)',
      type: 'string',
      group: 'contenido',
      description: 'Ejemplo: Quiénes somos: Digital X, audio, video y tecnología en Puebla',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'historia',
      title: 'Historia (línea de tiempo)',
      type: 'object',
      group: 'contenido',
      description:
        'No se publican el nombre, la foto ni la biografía del dueño, ni el tamaño del equipo.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Prólogo', 30),
        parrafo('texto', 'Texto', 'Un párrafo breve que presenta la historia.', 600),
        defineField({
          name: 'hitos',
          title: 'Hitos',
          type: 'array',
          description: 'Exactamente 3, en orden. Ejemplo: 2018 — Nace la idea',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'hito',
              fields: [
                texto('anio', 'Año o etiqueta', 'Ejemplo: 2018 (o «Hoy»)', 12),
                texto('titulo', 'Título', 'Ejemplo: Nace la idea', 60),
                parrafo('texto', 'Texto', 'Una o dos frases.', 400),
              ],
              preview: {select: {title: 'anio', subtitle: 'titulo'}},
            }),
          ],
          validation: (Rule) => Rule.required().length(3).error('Son exactamente 3 hitos.'),
        }),
      ],
    }),
    defineField({
      name: 'distingue',
      title: 'Sección «Qué nos distingue»',
      type: 'object',
      group: 'contenido',
      fields: [
        texto('titulo', 'Título', 'Ejemplo: Qué nos distingue', 60),
        defineField({
          name: 'items',
          title: 'Tarjetas',
          type: 'array',
          description: 'Exactamente 3. Ejemplo: Equipo profesional',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'tarjeta',
              fields: [
                texto('titulo', 'Título', 'Ejemplo: Equipo profesional', 50),
                parrafo('texto', 'Texto', 'Una o dos frases.', 300),
              ],
              preview: {select: {title: 'titulo', subtitle: 'texto'}},
            }),
          ],
          validation: (Rule) => Rule.required().length(3).error('Son exactamente 3 tarjetas.'),
        }),
      ],
    }),
    defineField({
      name: 'manifiesto',
      title: 'Sección «Lo que nos importa»',
      type: 'object',
      group: 'contenido',
      fields: [
        texto('titulo', 'Título', 'Ejemplo: Lo que nos importa', 60),
        defineField({
          name: 'items',
          title: 'Puntos',
          type: 'array',
          description: 'Exactamente 3. Ejemplo: Calidad, Atención y Claridad',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'punto',
              fields: [
                texto('titulo', 'Título', 'Ejemplo: Claridad', 50),
                parrafo('texto', 'Texto', 'Una o dos frases.', 300),
              ],
              preview: {select: {title: 'titulo', subtitle: 'texto'}},
            }),
          ],
          validation: (Rule) => Rule.required().length(3).error('Son exactamente 3 puntos.'),
        }),
      ],
    }),
    defineField({
      name: 'proyectos',
      title: 'Sección de proyectos',
      type: 'object',
      group: 'contenido',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Proyectos', 30),
        texto('titulo', 'Título', 'Ejemplo: Proyectos de Digital X', 60),
        texto('boton', 'Texto del botón', 'Ejemplo: Ver todos los proyectos', 40),
      ],
    }),
    defineField({
      name: 'preguntas',
      title: 'Preguntas frecuentes',
      type: 'object',
      group: 'contenido',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Preguntas frecuentes', 30),
        texto('titulo', 'Título', 'Ejemplo: Preguntas frecuentes', 60),
        parrafo(
          'texto',
          'Frase de introducción',
          'Ejemplo: Lo que más nos preguntan sobre Digital X.',
          160,
        ),
        defineField({
          name: 'items',
          title: 'Preguntas',
          type: 'array',
          of: [defineArrayMember({type: 'pregunta'})],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'cierre',
      title: 'Cierre de la página',
      type: 'cierre',
      group: 'contenido',
      description: 'Sin formulario: solo los botones de WhatsApp y llamada.',
    }),
    campoFoto({
      name: 'foto',
      title: 'Foto de la portada',
      group: 'fotos',
      description: 'Ejemplo: equipo de audio en cajas de rack, con cables y luces de un evento.',
    }),
    campoFoto({
      name: 'fotoDistingue',
      title: 'Foto de «Qué nos distingue»',
      group: 'fotos',
      description: 'Ejemplo: cámara de video sobre un trípode grabando una sesión.',
    }),
    campoFoto({
      name: 'fotoManifiesto',
      title: 'Foto de «Lo que nos importa»',
      group: 'fotos',
      description: 'Va de fondo con velo oscuro: mejor con poco detalle.',
    }),
    campoFoto({
      name: 'fotoProyectos',
      title: 'Foto de la sección de proyectos',
      group: 'fotos',
      description: 'Va de fondo con velo oscuro.',
    }),
    campoFoto({
      name: 'fotoCierre',
      title: 'Foto del cierre',
      group: 'fotos',
      description: 'Va de fondo con velo oscuro, detrás de los botones de WhatsApp y llamada.',
    }),
    campoSeo({
      ejemploTitle: 'Nosotros: audio, video y tecnología en Puebla | Digital X',
      ejemploMeta:
        'Conoce Digital X: audio, video y tecnología para eventos y negocios en Puebla, Atlixco e Izúcar de Matamoros. Un solo proveedor, cotización a la medida.',
    }),
  ],
  preview: {prepare: () => ({title: 'Nosotros'})},
})

/** Las páginas de listado: Proyectos, Blog y Reseñas comparten forma (encabezado, introducción y su SEO). */
const paginaDeListado = (
  name: string,
  title: string,
  ejemplo: {h1: string; intro: string; title: string; meta: string},
) =>
  defineType({
    name,
    title,
    type: 'document',
    groups: GRUPOS,
    validation: validacionDePagina,
    fields: [
      defineField({
        name: 'etiqueta',
        title: 'Etiqueta pequeña',
        type: 'string',
        group: 'contenido',
        description: `Ejemplo: ${title}`,
        validation: (Rule) => Rule.required().max(30),
      }),
      defineField({
        name: 'h1',
        title: 'Título principal (H1)',
        type: 'string',
        group: 'contenido',
        description: `Ejemplo: ${ejemplo.h1}`,
        validation: (Rule) => Rule.required().max(90),
      }),
      defineField({
        name: 'intro',
        title: 'Introducción',
        type: 'text',
        rows: 3,
        group: 'contenido',
        description: `Un párrafo bajo el título. Ejemplo: ${ejemplo.intro}`,
        validation: (Rule) => Rule.required().max(400),
      }),
      campoFoto({
        name: 'foto',
        title: 'Foto de la portada',
        group: 'fotos',
        description: 'Va de fondo con el título encima y un velo oscuro.',
      }),
      campoSeo({ejemploTitle: ejemplo.title, ejemploMeta: ejemplo.meta}),
    ],
    preview: {prepare: () => ({title})},
  })

export const paginaProyectos = paginaDeListado('paginaProyectos', 'Página de proyectos', {
  h1: 'Proyectos de audio, video y tecnología en Puebla',
  intro: 'Trabajos reales de Digital X, con lo que se necesitaba, lo que se hizo y cómo quedó.',
  title: 'Proyectos de audio, video y tecnología | Digital X',
  meta: 'Mira proyectos reales de Digital X: audio, video y tecnología para eventos y negocios en Puebla y Atlixco. Cotiza por WhatsApp.',
})
export const paginaBlog = paginaDeListado('paginaBlog', 'Página del blog', {
  h1: 'Blog de Digital X',
  intro: 'Guías y consejos para tu evento o tu negocio.',
  title: 'Blog de audio, video y tecnología | Digital X',
  meta: 'Guías y consejos de audio, video y tecnología para tus eventos y tu negocio en Puebla y Atlixco, escritos por Digital X.',
})
export const paginaResenas = paginaDeListado('paginaResenas', 'Página de reseñas', {
  h1: 'Reseñas de clientes de Digital X',
  intro: 'Lo que dicen quienes ya trabajaron con nosotros, publicado con su permiso.',
  title: 'Reseñas de clientes | Digital X',
  meta: 'Lee lo que dicen los clientes de Digital X sobre su evento o proyecto de audio, video y tecnología en Puebla y Atlixco.',
})
