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
      name: 'decorativa',
      title: 'Foto decorativa',
      type: 'boolean',
      initialValue: false,
      description:
        'Márcala si la foto solo adorna, por ejemplo un fondo, y no aporta información. Las decorativas no llevan texto alternativo y el sitio las oculta a los lectores de pantalla.',
    }),
    defineField({
      name: 'alt',
      title: 'Texto alternativo (qué se ve en la foto)',
      type: 'string',
      description:
        'Describe lo que se ve, con el servicio y el lugar si aplica. Lo leen los lectores de pantalla y Google. Ejemplo: Pantalla de circuito cerrado en una conferencia en Atlixco',
      hidden: ({parent}) => (parent as {decorativa?: boolean} | undefined)?.decorativa === true,
      validation: (Rule) =>
        Rule.custom((alt, {parent}) => {
          const foto = parent as {asset?: unknown; decorativa?: boolean} | undefined
          // Sin foto, o si es decorativa, el texto alternativo no es obligatorio.
          if (!foto?.asset || foto.decorativa === true) return true
          const largo = alt?.trim().length ?? 0
          if (!largo)
            return 'Describe la foto (es obligatorio) o márcala como decorativa si solo adorna.'
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
    select: {media: 'asset', title: 'alt', temporal: 'temporal', decorativa: 'decorativa'},
    prepare: ({media, title, temporal, decorativa}) => ({
      media,
      title: decorativa ? 'Foto decorativa' : title || 'Sin texto alternativo',
      subtitle: temporal ? 'Temporal' : undefined,
    }),
  },
})
