import {defineField, defineType} from 'sanity'

export const foto = defineType({
  name: 'foto',
  title: 'Foto',
  type: 'image',
  options: {
    hotspot: true,
    // Seguridad §4.5: sin `exif` ni `location` (traen fecha de captura y GPS).
    metadata: ['lqip'],
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo (qué se ve en la foto)',
      type: 'string',
      description:
        'Opcional, pero recomendado: describe lo que se ve, con el servicio y el lugar si aplica. Lo leen los lectores de pantalla y Google. Si lo dejas vacío, el sitio trata la foto como decorativa y la oculta a los lectores de pantalla. Ejemplo: Pantalla de circuito cerrado en una conferencia en Atlixco',
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt'},
    prepare: ({media, title}) => ({media, title: title || 'Sin texto alternativo'}),
  },
})
