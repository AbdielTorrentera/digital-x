import {defineArrayMember, defineField, defineType} from 'sanity'
import {RUTAS_TAMBIEN, urlDeRedValida} from '@digitalx/sanity/reglas'
import {avisoDePaginaSinConstruir} from '../../validaciones'

export const pregunta = defineType({
  name: 'pregunta',
  title: 'Pregunta frecuente',
  type: 'object',
  fields: [
    defineField({
      name: 'pregunta',
      title: 'Pregunta',
      type: 'string',
      description:
        'Escríbela como la haría un cliente. Ejemplo: ¿Necesito corriente eléctrica en el lugar?',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'respuesta',
      title: 'Respuesta',
      type: 'textoConEnlaces',
      description:
        'Responde en un párrafo, sin repetir lo que ya dicen las secciones de la página.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'pregunta'}},
})

export const filaFicha = defineType({
  name: 'filaFicha',
  title: 'Dato de la ficha',
  type: 'object',
  fields: [
    defineField({
      name: 'etiqueta',
      title: 'Etiqueta',
      type: 'string',
      description: 'Ejemplo: Entrega',
      validation: (Rule) => Rule.required().max(24),
    }),
    defineField({
      name: 'valor',
      title: 'Dato',
      type: 'string',
      description: 'Ejemplo: Video editado, tomas sin editar o ambos',
      validation: (Rule) => Rule.required().max(120),
    }),
  ],
  preview: {select: {title: 'etiqueta', subtitle: 'valor'}},
})

export const relacionadoServicio = defineType({
  name: 'relacionadoServicio',
  title: 'Otro servicio',
  type: 'object',
  fields: [
    defineField({
      name: 'servicio',
      title: 'Servicio',
      type: 'reference',
      to: [{type: 'servicio'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'texto',
      title: 'Por qué puede servirte',
      type: 'string',
      description: 'Una frase. Ejemplo: Para que todo el público vea el escenario',
      validation: (Rule) => Rule.required().max(160),
    }),
  ],
  preview: {select: {title: 'servicio.nombre', subtitle: 'texto'}},
})

export const relacionadoPagina = defineType({
  name: 'relacionadoPagina',
  title: 'Otra página',
  type: 'object',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del enlace',
      type: 'string',
      description: 'Ejemplo: Nuestros proyectos',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'ruta',
      title: 'Página',
      type: 'string',
      options: {list: RUTAS_TAMBIEN, layout: 'radio'},
      validation: (Rule) => [Rule.required(), Rule.custom(avisoDePaginaSinConstruir).warning()],
    }),
    defineField({
      name: 'texto',
      title: 'Frase',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
  ],
  preview: {select: {title: 'titulo', subtitle: 'texto'}},
})

export const tambien = defineType({
  name: 'tambien',
  title: '«También te puede servir»',
  type: 'object',
  fields: [
    defineField({
      name: 'intro',
      title: 'Frase de introducción',
      type: 'string',
      description: 'Opcional. Ejemplo: ¿Quieres también proyectar, grabar o transmitir tu evento?',
    }),
    defineField({
      name: 'items',
      title: 'Enlaces',
      type: 'array',
      of: [
        defineArrayMember({type: 'relacionadoServicio'}),
        defineArrayMember({type: 'relacionadoPagina'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export const cierre = defineType({
  name: 'cierre',
  title: 'Cierre de la página',
  type: 'object',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'Ejemplo: Cotiza tu evento o proyecto',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'texto',
      title: 'Texto',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
  ],
})

export const cotizacion = defineType({
  name: 'cotizacion',
  title: 'Tarjeta de cotización',
  type: 'object',
  fields: [
    defineField({
      name: 'etiqueta',
      title: 'Etiqueta',
      type: 'string',
      description: 'Ejemplo: Cotización',
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: 'texto',
      title: 'Texto',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
  ],
})

export const seccionGaleria = defineType({
  name: 'seccionGaleria',
  title: 'Grupo de fotos',
  type: 'object',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del grupo',
      type: 'string',
      description: 'Ejemplo: Conferencia en Atlixco',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      of: [defineArrayMember({type: 'foto'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'titulo', fotos: 'fotos'},
    prepare: ({title, fotos}) => ({title, subtitle: `${fotos?.length ?? 0} fotos`}),
  },
})

export const red = defineType({
  name: 'red',
  title: 'Red social',
  type: 'object',
  fields: [
    defineField({
      name: 'red',
      title: 'Red',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Facebook', value: 'facebook'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'Perfil de Google', value: 'google'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'LinkedIn', value: 'linkedin'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Dirección (URL)',
      type: 'url',
      description: 'La dirección completa de tu perfil. Ejemplo: https://www.facebook.com/digitalx',
      validation: (Rule) =>
        Rule.uri({scheme: ['https']}).custom((url, {parent}) => {
          const {red, activa} = (parent ?? {}) as {red?: string; activa?: boolean}
          if (!url) return activa ? 'Una red activa necesita su dirección.' : true
          return (
            !red ||
            urlDeRedValida(red, url) ||
            'Esta dirección no es de esa red: revisa que la copiaste de su perfil.'
          )
        }),
    }),
    defineField({
      name: 'activa',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: false,
      description:
        'Solo se muestran las redes activas. Actívala cuando la dirección ya sea la real.',
    }),
  ],
  preview: {
    select: {title: 'red', subtitle: 'url', activa: 'activa'},
    prepare: ({title, subtitle, activa}) => ({
      title: `${title ?? 'Red'} ${activa ? '(activa)' : '(oculta)'}`,
      subtitle,
    }),
  },
})
