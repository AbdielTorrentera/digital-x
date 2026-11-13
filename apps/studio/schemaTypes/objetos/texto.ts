import {defineArrayMember, defineField, defineType} from 'sanity'
import {RUTAS_FIJAS} from '@digitalx/sanity/reglas'

/**
 * Un párrafo en el que se pueden enlazar palabras a un servicio o a una página del sitio. Es Portable Text
 * restringido: sin estilos, listas ni negritas. Si el servicio enlazado no tiene su página publicada, el sitio
 * muestra el texto sin enlace.
 */
export const textoConEnlaces = defineType({
  name: 'textoConEnlaces',
  title: 'Texto con enlaces',
  type: 'array',
  description:
    'Un solo párrafo. Para enlazar, selecciona las palabras y pulsa el botón de enlace: elige «Enlace a un servicio» o «Enlace a una página».',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [],
        annotations: [
          defineArrayMember({
            name: 'enlaceServicio',
            title: 'Enlace a un servicio',
            type: 'object',
            fields: [
              defineField({
                name: 'servicio',
                title: 'Servicio',
                type: 'reference',
                to: [{type: 'servicio'}],
                validation: (Rule) =>
                  Rule.required().error('Elige el servicio al que lleva el enlace.'),
              }),
            ],
          }),
          defineArrayMember({
            name: 'enlacePagina',
            title: 'Enlace a una página',
            type: 'object',
            fields: [
              defineField({
                name: 'ruta',
                title: 'Página',
                type: 'string',
                options: {list: RUTAS_FIJAS, layout: 'radio'},
                validation: (Rule) =>
                  Rule.required().error('Elige la página a la que lleva el enlace.'),
              }),
            ],
          }),
        ],
      },
    }),
  ],
  validation: (Rule) =>
    Rule.max(1).error('Escribe un solo párrafo (sin pulsar Enter para empezar otro).'),
})
