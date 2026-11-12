import {defineArrayMember, defineField, defineType} from 'sanity'
import {problemasDeSlug, slugificar} from '@digitalx/sanity/reglas'
import {campoFoto, campoSeo} from '../campos'
import {validacionDePagina} from '../../validaciones'

export const categoria = defineType({
  name: 'categoria',
  title: 'Categoría de servicios',
  type: 'document',
  description:
    'Un área de servicios (Audio, Video, Tecnología). Su página solo existe cuando tiene dos o más servicios publicados; con uno solo, los enlaces van directo a ese servicio. Esto sale solo, no hay que configurarlo.',
  groups: [
    {name: 'contenido', title: 'Textos', default: true},
    {name: 'fotos', title: 'Foto'},
    {name: 'preguntas', title: 'Preguntas y clientes'},
    {name: 'seo', title: 'Google'},
  ],
  validation: validacionDePagina,
  orderings: [{title: 'Orden en el menú', name: 'orden', by: [{field: 'orden', direction: 'asc'}]}],
  fields: [
    defineField({
      name: 'etiqueta',
      title: 'Nombre en el menú',
      type: 'string',
      group: 'contenido',
      description: 'Cómo se llama la categoría en el menú, el pie y las etiquetas. Ejemplo: Video',
      validation: (Rule) => Rule.required().max(24),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección (slug)',
      type: 'slug',
      group: 'contenido',
      description:
        'Es el primer nivel de la dirección de todos sus servicios: /{slug}/{servicio}/. Si ya está publicada, no la cambies (la dirección cambiaría y se perdería el posicionamiento).',
      options: {source: 'etiqueta', slugify: (t) => slugificar(t, 40)},
      validation: (Rule) =>
        Rule.required().custom(
          (slug) => problemasDeSlug(slug?.current, {reservados: true}).join(' ') || true,
        ),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      group: 'contenido',
      description:
        'El número 1 va primero en el menú, el pie y las tarjetas del Inicio. Ejemplo: 2',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'titulo',
      title: 'Nombre completo',
      type: 'string',
      group: 'contenido',
      description:
        'Se usa en el pie de página y en los datos para Google. Ejemplo: Servicios de video',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'para',
      title: 'Para quién es (tarjeta del Inicio)',
      type: 'text',
      rows: 2,
      group: 'contenido',
      description:
        'Una frase de para quién es. Ejemplo: Para quienes organizan fiestas, conferencias, eventos culturales y cultos, con personal técnico de principio a fin.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'sinPagina',
      title: 'Servicios sin página propia',
      type: 'array',
      group: 'contenido',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Servicios oficiales que se nombran en los textos pero no tienen página. Ejemplo: sonorización (en Audio)',
    }),
    defineField({
      name: 'h1',
      title: 'Título principal (H1)',
      type: 'string',
      group: 'contenido',
      description:
        'Menciona la categoría y Puebla. Ejemplo: Servicios de video para eventos y negocios en Puebla',
      validation: (Rule) =>
        Rule.required()
          .max(90)
          .custom((h1) => !h1 || /Puebla/.test(h1) || 'El título principal debe mencionar Puebla.'),
    }),
    defineField({
      name: 'intro',
      title: 'Introducción',
      type: 'text',
      rows: 4,
      group: 'contenido',
      description:
        'El párrafo bajo el título. Menciona las zonas y no repite oraciones de las páginas de sus servicios.',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({name: 'cierre', title: 'Cierre de la página', type: 'cierre', group: 'contenido'}),
    campoFoto({
      name: 'foto',
      title: 'Foto de la categoría',
      group: 'fotos',
      description:
        'Se usa en su tarjeta del Inicio y como portada de su página. Horizontal; el título se pone encima.',
    }),
    defineField({
      name: 'faq',
      title: 'Preguntas frecuentes',
      type: 'array',
      group: 'preguntas',
      of: [defineArrayMember({type: 'pregunta'})],
      description:
        'Solo orientación: qué servicio conviene y cómo se combinan. No repitas las preguntas de los servicios. Vacío = no se muestra la sección.',
    }),
    defineField({
      name: 'clientes',
      title: 'Con quiénes hemos trabajado',
      type: 'array',
      group: 'preguntas',
      of: [defineArrayMember({type: 'reference', to: [{type: 'cliente'}], weak: true})],
      description:
        'Elige clientes ya creados en «Clientes». Solo se muestran los que tienen permiso y están publicados.',
    }),
    campoSeo({
      servicio: true,
      ejemploTitle: 'Servicios de video en Puebla y Atlixco | Digital X',
      ejemploMeta:
        'Circuito cerrado para eventos, producción de videos, streaming, video con drone y recorridos 360 en Puebla y Atlixco. Cotiza por WhatsApp.',
    }),
  ],
  preview: {
    select: {title: 'etiqueta', subtitle: 'slug.current', orden: 'orden'},
    prepare: ({title, subtitle, orden}) => ({
      title: `${orden ?? '?'}. ${title}`,
      subtitle: `/${subtitle}/`,
    }),
  },
})
