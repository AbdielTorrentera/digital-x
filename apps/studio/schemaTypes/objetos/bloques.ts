import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugificar} from '@digitalx/sanity/reglas'

export const bloqueParrafo = defineType({
  name: 'bloqueParrafo',
  title: 'Párrafo',
  type: 'object',
  fields: [
    defineField({
      name: 'texto',
      title: 'Texto',
      type: 'textoConEnlaces',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {texto: 'texto'},
    prepare: ({texto}) => ({
      title: texto?.[0]?.children?.map((c: {text: string}) => c.text).join('') || 'Párrafo vacío',
      subtitle: 'Párrafo',
    }),
  },
})

export const bloqueLista = defineType({
  name: 'bloqueLista',
  title: 'Lista',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Elementos de la lista',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}) => ({
      title: `Lista de ${items?.length ?? 0} elementos`,
      subtitle: items?.[0],
    }),
  },
})

export const bloquePuntos = defineType({
  name: 'bloquePuntos',
  title: 'Puntos con título',
  type: 'object',
  description:
    'Una lista donde cada punto tiene un título corto y su explicación. Ejemplo: «Eventos» — conferencias y ceremonias.',
  fields: [
    defineField({
      name: 'items',
      title: 'Puntos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'punto',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título del punto',
              type: 'textoConEnlaces',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'texto',
              title: 'Explicación',
              type: 'textoConEnlaces',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {titulo: 'titulo'},
            prepare: ({titulo}) => ({
              title: titulo?.[0]?.children?.map((c: {text: string}) => c.text).join('') || 'Punto',
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}) => ({title: `${items?.length ?? 0} puntos con título`}),
  },
})

/** Una sección extra de la página de un servicio (por ejemplo, «Sonorización» o «De qué depende el precio»). */
export const seccion = defineType({
  name: 'seccion',
  title: 'Sección de la página',
  type: 'object',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título de la sección',
      type: 'string',
      description: 'El título grande de la sección. Ejemplo: De qué depende el precio',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'etiqueta',
      title: 'Nombre en el menú de la página',
      type: 'string',
      description: 'La palabra corta que aparece en el menú interno de la página. Ejemplo: Precio',
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: 'id',
      title: 'Ancla (dirección interna)',
      type: 'slug',
      options: {
        // La unicidad dentro de la lista se valida en el campo `secciones` del servicio.
        isUnique: () => true,
        source: (_doc, {parent}) => (parent as {titulo?: string})?.titulo ?? '',
        slugify: (t) => slugificar(t, 40),
      },
      description:
        'Se genera sola desde el título. Es la parte que sigue al # en la dirección de la sección. No la cambies si ya está publicada.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bloques',
      title: 'Contenido de la sección',
      type: 'array',
      description: 'Agrega párrafos, listas o puntos con título, en el orden en que deben verse.',
      of: [
        defineArrayMember({type: 'bloqueParrafo'}),
        defineArrayMember({type: 'bloqueLista'}),
        defineArrayMember({type: 'bloquePuntos'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {select: {title: 'titulo', subtitle: 'etiqueta'}},
})
