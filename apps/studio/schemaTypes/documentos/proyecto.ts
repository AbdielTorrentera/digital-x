import {defineArrayMember, defineField, defineType} from 'sanity'
import {problemaDePermiso, slugificar} from '@digitalx/sanity/reglas'
import {campoSeo} from '../campos'
import {vocabulario} from '../../validaciones'

export const proyecto = defineType({
  name: 'proyecto',
  title: 'Proyecto',
  type: 'document',
  description:
    'Un trabajo real de Digital X, con su reto, solución y resultado. Solo se publica con el permiso del cliente. Los proyectos de ejemplo (ficticios) bloquean la publicación del sitio.',
  groups: [
    {name: 'caso', title: 'El caso', default: true},
    {name: 'fotos', title: 'Fotos'},
    {name: 'permiso', title: 'Permiso y estado'},
    {name: 'seo', title: 'Google'},
  ],
  validation: vocabulario,
  orderings: [
    {title: 'Más recientes primero', name: 'fecha', by: [{field: 'fecha', direction: 'desc'}]},
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      group: 'caso',
      description:
        'Servicio + tipo de trabajo + lugar. Ejemplo: Audio para evento cultural en Atlixco',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección (slug)',
      type: 'slug',
      group: 'caso',
      description:
        'La dirección del proyecto: /proyectos/{slug}/. Ejemplo: audio-evento-cultural-atlixco. Si ya está publicado, no la cambies.',
      options: {source: 'titulo', slugify: (t) => slugificar(t, 80)},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen para la tarjeta',
      type: 'text',
      rows: 2,
      group: 'caso',
      description:
        'Una o dos frases que se ven en la tarjeta y en el listado. Ejemplo: Sonido y pantallas para una conferencia con más de un salón.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'reto',
      title: 'Reto: qué necesitaba el cliente',
      type: 'text',
      rows: 4,
      group: 'caso',
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: 'solucion',
      title: 'Solución: qué se hizo y con qué enfoque',
      type: 'text',
      rows: 4,
      group: 'caso',
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: 'resultado',
      title: 'Resultado: qué se logró',
      type: 'text',
      rows: 4,
      group: 'caso',
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: 'servicios',
      title: 'Servicios que se usaron',
      type: 'array',
      group: 'caso',
      of: [defineArrayMember({type: 'reference', to: [{type: 'servicio'}]})],
      description: 'Elige uno o más. El proyecto aparece en la página de cada uno y enlaza a ella.',
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'municipio',
      title: 'Municipio',
      type: 'string',
      group: 'caso',
      description: 'Solo si el trabajo se hizo ahí. Ejemplo: Atlixco',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha del trabajo',
      type: 'date',
      group: 'caso',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cliente',
      title: 'Cliente',
      type: 'reference',
      to: [{type: 'cliente'}],
      weak: true,
      group: 'caso',
      description:
        'Opcional. Solo si el cliente ya está en «Clientes» con permiso. Los casos de software pueden ir anónimos.',
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      group: 'fotos',
      of: [defineArrayMember({type: 'foto'})],
      description:
        'La primera es la portada del proyecto. Todas con su texto alternativo. Solo fotos reales del trabajo y con permiso.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'permiso',
      title: 'El cliente me dio permiso para publicarlo',
      type: 'boolean',
      group: 'permiso',
      initialValue: false,
      description:
        'Obligatorio para publicar un proyecto real. Lo publicado aquí lo puede leer cualquiera. El comprobante del permiso no se guarda en Sanity: guárdalo aparte.',
      validation: (Rule) =>
        Rule.custom(
          (permiso, {document}) =>
            problemaDePermiso({...(document as object), permiso, _type: 'proyecto'}) ?? true,
        ),
    }),
    defineField({
      name: 'esEjemplo',
      title: 'Es un proyecto de ejemplo (ficticio)',
      type: 'boolean',
      group: 'permiso',
      initialValue: false,
      description:
        'Márcalo si el proyecto es inventado, solo para mostrar cómo se vería. Se muestra con la etiqueta EJEMPLO, no necesita permiso y bloquea la publicación del sitio: reemplázalo por uno real.',
      validation: (Rule) =>
        Rule.custom((valor) =>
          valor
            ? 'Proyecto de ejemplo: bloquea la publicación del sitio hasta que lo reemplaces por uno real.'
            : true,
        ).warning(),
    }),
    campoSeo({
      obligatorio: false,
      metaObligatoria: true,
      ejemploTitle: 'Audio para evento cultural en Atlixco | Digital X',
      ejemploMeta:
        'Sonido y pantallas para un evento cultural en Atlixco: el reto, lo que hicimos y cómo quedó. Cotiza por WhatsApp.',
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      municipio: 'municipio',
      media: 'fotos.0',
      ejemplo: 'esEjemplo',
      permiso: 'permiso',
    },
    prepare: ({title, municipio, media, ejemplo, permiso}) => ({
      title,
      subtitle: `${municipio ?? ''} · ${ejemplo ? 'EJEMPLO' : permiso ? 'Con permiso' : 'Sin permiso (borrador)'}`,
      media,
    }),
  },
})
