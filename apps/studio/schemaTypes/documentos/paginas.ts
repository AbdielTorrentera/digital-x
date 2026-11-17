import {defineArrayMember, defineField, defineType} from 'sanity'
import {campoFoto, campoSeo} from '../campos'
import {validacionDeInicio, validacionDePagina} from '../../validaciones'

const GRUPOS = [
  {name: 'contenido', title: 'Textos', default: true},
  {name: 'fotos', title: 'Fotos'},
  {name: 'seo', title: 'Google'},
]

// Los campos de los objetos (queHacemos, hitos…) no llevan `group`: el grupo es del campo de primer nivel.
const texto = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    validation: (Rule) => Rule.required(),
  })

const parrafo = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'text',
    rows: 3,
    description,
    validation: (Rule) => Rule.required(),
  })

export const inicio = defineType({
  name: 'inicio',
  title: 'Inicio',
  type: 'document',
  groups: GRUPOS,
  validation: validacionDeInicio,
  fields: [
    defineField({
      name: 'h1',
      title: 'Título principal (H1)',
      type: 'string',
      group: 'contenido',
      description:
        'El título grande de la portada. Es el único H1 de la página. Menciona el servicio y la ciudad. Ejemplo: Audio, video y tecnología para tus eventos y tu negocio en Puebla',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'queHacemos',
      title: 'Sección «Qué hacemos»',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      description:
        'La sección con foto debajo de la portada. Su texto no puede repetirse en ninguna otra página.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Digital X'),
        texto('titulo', 'Título', 'Ejemplo: Qué hacemos'),
        parrafo('texto', 'Texto', 'El texto aprobado de la sección. No lleva cifras ni precios.'),
        texto(
          'boton',
          'Texto del botón',
          'Baja a las tarjetas de servicios. Ejemplo: Ver servicios',
        ),
      ],
    }),
    defineField({
      name: 'servicios',
      title: 'Sección de servicios',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Servicios'),
        texto('titulo', 'Título', 'Ejemplo: Servicios de audio, video y tecnología en Puebla'),
      ],
    }),
    defineField({
      name: 'proyectos',
      title: 'Sección de proyectos',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      description: 'Solo se muestra cuando hay al menos 3 proyectos con foto.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Proyectos'),
        texto('titulo', 'Título', 'Ejemplo: Proyectos de Digital X'),
      ],
    }),
    defineField({
      name: 'resenas',
      title: 'Sección de reseñas',
      type: 'object',
      group: 'contenido',
      description:
        'Muestra las reseñas marcadas como «destacada». Si no hay ninguna publicada, la sección no aparece.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Reseñas'),
        texto('titulo', 'Título', 'Ejemplo: Lo que dicen nuestros clientes'),
      ],
    }),
    defineField({
      name: 'porQue',
      title: 'Sección «Por qué Digital X»',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      description:
        'Ventajas que se pueden comprobar. No se publican topes de personas ni datos del equipo.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Por qué Digital X'),
        texto('titulo', 'Título', 'Ejemplo: Por qué contratar a Digital X'),
        defineField({
          name: 'items',
          title: 'Ventajas',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'ventaja',
              fields: [
                texto('titulo', 'Título', 'Ejemplo: Un solo proveedor'),
                parrafo(
                  'texto',
                  'Texto',
                  'Una frase. Ejemplo: Audio, video y tecnología con un solo equipo de trabajo.',
                ),
              ],
              preview: {select: {title: 'titulo', subtitle: 'texto'}},
            }),
          ],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'cobertura',
      title: 'Sección de cobertura',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      description:
        'Sin condiciones de traslado ni cargos. Puedes escribir {zonas} para los lugares de cobertura y {servicios-audio}, {servicios-video} y {servicios-tecnologia} para los nombres de los servicios: el sitio los pone y los mantiene al día.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Cobertura'),
        texto('titulo', 'Título', 'Ejemplo: Dónde trabajamos'),
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
      validation: (Rule) => Rule.required(),
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Preguntas frecuentes'),
        texto('titulo', 'Título', 'Ejemplo: Preguntas frecuentes'),
        parrafo('texto', 'Frase de introducción', 'Ejemplo: Lo que más nos preguntan al cotizar.'),
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
      validation: (Rule) => Rule.required(),
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
    {...texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Nosotros'), group: 'contenido'},
    defineField({
      name: 'h1',
      title: 'Título principal (H1)',
      type: 'string',
      group: 'contenido',
      description: 'Ejemplo: Quiénes somos: Digital X, audio, video y tecnología en Puebla',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'historia',
      title: 'Historia (línea de tiempo)',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      description:
        'No se publican el nombre, la foto ni la biografía del dueño, ni el tamaño del equipo.',
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Prólogo'),
        parrafo('texto', 'Texto', 'Un párrafo breve que presenta la historia.'),
        defineField({
          name: 'hitos',
          title: 'Hitos',
          type: 'array',
          description: 'En orden. Ejemplo: 2018 — Nace la idea',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'hito',
              fields: [
                texto('anio', 'Año o etiqueta', 'Ejemplo: 2018 (o «Hoy»)'),
                texto('titulo', 'Título', 'Ejemplo: Nace la idea'),
                parrafo('texto', 'Texto', 'Una o dos frases.'),
              ],
              preview: {select: {title: 'anio', subtitle: 'titulo'}},
            }),
          ],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'distingue',
      title: 'Sección «Qué nos distingue»',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      fields: [
        texto('titulo', 'Título', 'Ejemplo: Qué nos distingue'),
        defineField({
          name: 'items',
          title: 'Tarjetas',
          type: 'array',
          description: 'Ejemplo: Equipo profesional',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'tarjeta',
              fields: [
                texto('titulo', 'Título', 'Ejemplo: Equipo profesional'),
                parrafo('texto', 'Texto', 'Una o dos frases.'),
              ],
              preview: {select: {title: 'titulo', subtitle: 'texto'}},
            }),
          ],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'manifiesto',
      title: 'Sección «Lo que nos importa»',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      fields: [
        texto('titulo', 'Título', 'Ejemplo: Lo que nos importa'),
        defineField({
          name: 'items',
          title: 'Puntos',
          type: 'array',
          description: 'Ejemplo: Calidad, Atención y Claridad',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'punto',
              fields: [
                texto('titulo', 'Título', 'Ejemplo: Claridad'),
                parrafo('texto', 'Texto', 'Una o dos frases.'),
              ],
              preview: {select: {title: 'titulo', subtitle: 'texto'}},
            }),
          ],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'proyectos',
      title: 'Sección de proyectos',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Proyectos'),
        texto('titulo', 'Título', 'Ejemplo: Proyectos de Digital X'),
        texto('boton', 'Texto del botón', 'Ejemplo: Ver todos los proyectos'),
      ],
    }),
    defineField({
      name: 'preguntas',
      title: 'Preguntas frecuentes',
      type: 'object',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
      fields: [
        texto('etiqueta', 'Etiqueta pequeña', 'Ejemplo: Preguntas frecuentes'),
        texto('titulo', 'Título', 'Ejemplo: Preguntas frecuentes'),
        parrafo(
          'texto',
          'Frase de introducción',
          'Ejemplo: Lo que más nos preguntan sobre Digital X.',
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
      validation: (Rule) => Rule.required(),
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
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'h1',
        title: 'Título principal (H1)',
        type: 'string',
        group: 'contenido',
        description: `Ejemplo: ${ejemplo.h1}`,
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'intro',
        title: 'Introducción',
        type: 'text',
        rows: 3,
        group: 'contenido',
        description: `Un párrafo bajo el título. Ejemplo: ${ejemplo.intro}`,
        validation: (Rule) => Rule.required(),
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
  intro: 'Lo que dicen quienes ya trabajaron con nosotros, publicado.',
  title: 'Reseñas de clientes | Digital X',
  meta: 'Lee lo que dicen los clientes de Digital X sobre su evento o proyecto de audio, video y tecnología en Puebla y Atlixco.',
})
