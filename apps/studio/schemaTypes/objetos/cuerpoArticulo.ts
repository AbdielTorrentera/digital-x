import {defineArrayMember, defineField, defineType} from 'sanity'
import {enlaceAceptable} from '@digitalx/sanity/reglas'

/**
 * El cuerpo de un artículo del blog: texto enriquecido (Portable Text). El H1 es el título del artículo, así que
 * el cuerpo empieza en subtítulos de nivel 2 (SEO §3: no saltar niveles).
 */
export const cuerpoArticulo = defineType({
  name: 'cuerpoArticulo',
  title: 'Cuerpo del artículo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Texto normal', value: 'normal'},
        {title: 'Subtítulo', value: 'h2'},
        {title: 'Subtítulo menor', value: 'h3'},
        {title: 'Cita', value: 'blockquote'},
      ],
      lists: [
        {title: 'Lista con viñetas', value: 'bullet'},
        {title: 'Lista numerada', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Negritas', value: 'strong'},
          {title: 'Cursiva', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'enlace',
            title: 'Enlace',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Dirección',
                type: 'string',
                description:
                  'Una página del sitio (por ejemplo /video/video-con-drone/) o una dirección que empiece con https://',
                validation: (Rule) =>
                  Rule.required().custom((href) =>
                    !href || enlaceAceptable(href)
                      ? true
                      : 'Solo se aceptan direcciones https://, mailto:, tel: o rutas del sitio que empiecen con /.',
                  ),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      name: 'imagenDeArticulo',
      title: 'Imagen',
      options: {hotspot: true, metadata: ['lqip']},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (qué se ve en la foto)',
          type: 'string',
          description:
            'Obligatorio. Ejemplo: Técnico de audio ajustando la consola en un evento en Atlixco',
          validation: (Rule) => Rule.required().min(5).max(125),
        }),
        defineField({
          name: 'pie',
          title: 'Pie de foto',
          type: 'string',
          description: 'Opcional. Se muestra debajo de la imagen.',
        }),
      ],
    }),
  ],
})
