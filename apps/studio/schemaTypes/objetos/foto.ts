import {defineField, defineType} from 'sanity'
import {MAX_ALT, MIN_ALT} from '@digitalx/sanity/reglas'

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
        'Describe lo que se ve, con el servicio y el lugar si aplica. Lo leen los lectores de pantalla y Google. Ejemplo: Pantalla de circuito cerrado en una conferencia en Atlixco',
      validation: (Rule) =>
        Rule.custom((alt, {parent}) => {
          if (!(parent as {asset?: unknown} | undefined)?.asset) return true
          const largo = alt?.trim().length ?? 0
          if (!largo) return 'Describe la foto: es obligatorio.'
          if (largo < MIN_ALT) return `Escribe al menos ${MIN_ALT} caracteres.`
          if (largo > MAX_ALT) return `Máximo ${MAX_ALT} caracteres (llevas ${largo}).`
          return true
        }),
    }),
    defineField({
      name: 'temporal',
      title: 'Es una foto temporal',
      type: 'boolean',
      initialValue: false,
      description:
        'Márcalo si es una foto provisional (de ejemplo o de relleno). El sitio publicado al público no se puede construir mientras haya fotos temporales: cámbiala por la real y desmarca esta casilla.',
      validation: (Rule) =>
        Rule.custom((temporal) =>
          temporal
            ? 'Foto temporal: bloquea la publicación del sitio hasta que la cambies por la real.'
            : true,
        ).warning(),
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt', temporal: 'temporal'},
    prepare: ({media, title, temporal}) => ({
      media,
      title: title || 'Sin texto alternativo',
      subtitle: temporal ? 'Temporal' : undefined,
    }),
  },
})
