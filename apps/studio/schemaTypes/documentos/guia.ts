import {defineArrayMember, defineField, defineType} from 'sanity'

export const guiaDeServicios = defineType({
  name: 'guiaDeServicios',
  title: 'Guía «¿Qué servicios necesito?»',
  type: 'document',
  description:
    'Hoy NO se muestra en ninguna página (decisión del dueño). Queda lista para activarse cuando se decida dónde mostrarla.',
  fields: [
    defineField({
      name: 'etiqueta',
      title: 'Etiqueta pequeña',
      type: 'string',
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'Ejemplo: ¿Qué servicios necesito para mi evento?',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'items',
      title: 'Casos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'caso',
          fields: [
            defineField({
              name: 'escenario',
              title: 'Si tu evento es…',
              type: 'string',
              description: 'Ejemplo: Una conferencia con público numeroso',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'servicios',
              title: 'Te recomendamos',
              type: 'array',
              of: [defineArrayMember({type: 'reference', to: [{type: 'servicio'}]})],
              validation: (Rule) => Rule.required().min(1).unique(),
            }),
          ],
          preview: {select: {title: 'escenario'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Guía de servicios (inactiva)'})},
})
