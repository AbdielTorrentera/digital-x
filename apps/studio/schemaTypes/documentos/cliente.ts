import {defineField, defineType} from 'sanity'
import {campoFoto} from '../campos'

export const cliente = defineType({
  name: 'cliente',
  title: 'Cliente',
  type: 'document',
  description:
    'Una empresa o persona con la que Digital X ha trabajado. Todo lo publicado aquí se muestra en el sitio. Nunca se inventan clientes.',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      description: 'Ejemplo: Impact Hub',
      validation: (Rule) => Rule.required(),
    }),
    campoFoto({
      name: 'logo',
      title: 'Logo',
      obligatoria: false,
      description: 'Opcional. Con su texto alternativo. Ejemplo: Logo de Impact Hub',
    }),
  ],
  preview: {
    select: {title: 'nombre', media: 'logo'},
  },
})
