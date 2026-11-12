import {defineArrayMember, defineField, defineType} from 'sanity'
import {MAX_EXTRACTO, slugificar} from '@digitalx/sanity/reglas'
import {campoFoto, campoSeo} from '../campos'
import {algunServicioConPagina, vocabulario} from '../../validaciones'

export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo del blog',
  type: 'document',
  description:
    'Un artículo útil y propio que responde UNA pregunta real. No se publican artículos de relleno, generados sin revisión ni copiados de otros sitios. No debe competir con la página de un servicio por la misma búsqueda.',
  groups: [
    {name: 'contenido', title: 'Artículo', default: true},
    {name: 'publicacion', title: 'Publicación'},
    {name: 'seo', title: 'Google'},
  ],
  validation: vocabulario,
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'fecha',
      by: [{field: 'fechaPublicacion', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título (H1)',
      type: 'string',
      group: 'contenido',
      description:
        'Una pregunta o intención de búsqueda concreta. Ejemplo: ¿Cuánto audio necesito para una fiesta?',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección (slug)',
      type: 'slug',
      group: 'contenido',
      description:
        'La dirección del artículo: /blog/{slug}/. Ejemplo: cuanto-audio-necesito-para-una-fiesta. Si ya está publicado, no la cambies.',
      options: {source: 'titulo', slugify: (t) => slugificar(t, 80)},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extracto',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      group: 'contenido',
      description: `Dos frases que resumen el artículo. Se ven en el listado. Máximo ${MAX_EXTRACTO} caracteres.`,
      validation: (Rule) => Rule.required().max(MAX_EXTRACTO),
    }),
    campoFoto({
      name: 'portada',
      title: 'Foto de portada',
      group: 'contenido',
      description: 'Horizontal. Con su texto alternativo. Foto propia siempre que se pueda.',
    }),
    defineField({
      name: 'cuerpo',
      title: 'Cuerpo del artículo',
      type: 'cuerpoArticulo',
      group: 'contenido',
      description:
        'Empieza con un párrafo y usa «Subtítulo» para dividirlo. Las imágenes llevan texto alternativo y, si quieres, pie de foto. Termina invitando a cotizar.',
      validation: (Rule) =>
        Rule.required().min(3).error('Un artículo necesita al menos 3 bloques de texto.'),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'reference',
      to: [{type: 'categoriaBlog'}],
      group: 'publicacion',
      description: 'Sirve para filtrar el listado del blog. No tiene página propia.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'autor',
      title: 'Autor',
      type: 'reference',
      to: [{type: 'autor'}],
      group: 'publicacion',
      description: 'Quién firma el artículo. Por ahora firma «Equipo Digital X».',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fechaPublicacion',
      title: 'Fecha de publicación',
      type: 'date',
      group: 'publicacion',
      description: 'Se muestra en el artículo y en Google.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fechaActualizacion',
      title: 'Fecha de actualización',
      type: 'date',
      group: 'publicacion',
      description:
        'Opcional. Llénala cuando cambies el contenido de verdad. No puede ser anterior a la de publicación.',
      validation: (Rule) =>
        Rule.custom((fecha, {document}) => {
          const publicada = (document as {fechaPublicacion?: string} | undefined)?.fechaPublicacion
          return (
            !fecha ||
            !publicada ||
            fecha >= publicada ||
            'La actualización no puede ser anterior a la publicación.'
          )
        }),
    }),
    defineField({
      name: 'serviciosRelacionados',
      title: 'Servicios relacionados',
      type: 'array',
      group: 'publicacion',
      of: [defineArrayMember({type: 'reference', to: [{type: 'servicio'}]})],
      description:
        'Elige al menos uno con su página construida: el artículo enlaza a él con texto descriptivo.',
      validation: (Rule) => Rule.required().min(1).unique().custom(algunServicioConPagina),
    }),
    campoSeo({
      obligatorio: false,
      metaObligatoria: true,
      ejemploTitle: '¿Cuánto audio necesito para una fiesta? | Digital X',
      ejemploMeta:
        'Cómo calcular el audio que necesita tu fiesta o evento en Puebla y Atlixco: personas, espacio y tipo de música. Cotiza por WhatsApp.',
    }),
  ],
  preview: {
    select: {title: 'titulo', fecha: 'fechaPublicacion', media: 'portada'},
    prepare: ({title, fecha, media}) => ({title, subtitle: fecha, media}),
  },
})

export const categoriaBlog = defineType({
  name: 'categoriaBlog',
  title: 'Categoría del blog',
  type: 'document',
  description: 'Sirve para filtrar los artículos dentro de /blog/. No tiene página propia.',
  orderings: [{title: 'Orden', name: 'orden', by: [{field: 'orden', direction: 'asc'}]}],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      description: 'Ejemplo: Consejos para eventos',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'nombre', slugify: (t) => slugificar(t, 40)},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'El 1 va primero en los filtros.',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  preview: {select: {title: 'nombre'}},
})

export const autor = defineType({
  name: 'autor',
  title: 'Autor',
  type: 'document',
  description:
    'Quién firma un artículo. Hoy solo existe «Equipo Digital X». No se publican datos personales de nadie sin su permiso.',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      description: 'Ejemplo: Equipo Digital X',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'esOrganizacion',
      title: 'Es el negocio, no una persona',
      type: 'boolean',
      initialValue: true,
      description: 'Márcalo para «Equipo Digital X»: en Google se declara como el negocio.',
    }),
  ],
  preview: {select: {title: 'nombre'}},
})
