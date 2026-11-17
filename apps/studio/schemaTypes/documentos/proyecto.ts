import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugificar} from '@digitalx/sanity/reglas'
import {campoSeo} from '../campos'
import {avisoDeProyectoSinPagina} from '../../validaciones'

export const proyecto = defineType({
  name: 'proyecto',
  title: 'Proyecto',
  type: 'document',
  description:
    'Un trabajo real de Digital X. Todo lo publicado aquí se muestra en el sitio, en /proyectos/ y en su propia página. Para que aparezcan, también debe estar publicada la «Página de proyectos» (en Páginas).',
  validation: (Rule) => Rule.custom(avisoDeProyectoSinPagina).warning(),
  groups: [
    {name: 'caso', title: 'El caso', default: true},
    {name: 'fotos', title: 'Fotos'},
    {name: 'seo', title: 'Google'},
  ],
  orderings: [
    {title: 'Orden', name: 'orden', by: [{field: 'orden', direction: 'asc'}]},
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección (slug)',
      type: 'slug',
      group: 'caso',
      description:
        'La dirección del proyecto: /proyectos/{slug}/. Ejemplo: audio-evento-cultural-atlixco. Si ya está publicado, no la cambies (la dirección vieja dejaría de funcionar).',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reto',
      title: 'Reto: qué necesitaba el cliente',
      type: 'text',
      rows: 4,
      group: 'caso',
      description: 'Opcional. Si lo dejas vacío, la página no muestra esta parte.',
    }),
    defineField({
      name: 'solucion',
      title: 'Solución: qué se hizo y con qué enfoque',
      type: 'text',
      rows: 4,
      group: 'caso',
      description: 'Opcional. Si lo dejas vacío, la página no muestra esta parte.',
    }),
    defineField({
      name: 'resultado',
      title: 'Resultado: qué se logró',
      type: 'text',
      rows: 4,
      group: 'caso',
      description: 'Opcional. Si lo dejas vacío, la página no muestra esta parte.',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha del trabajo',
      type: 'date',
      group: 'caso',
      description:
        'Opcional. Se muestra como mes y año (marzo de 2026). Si la dejas vacía, no se muestra.',
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      group: 'caso',
      description:
        'Opcional. El 1 va primero: define cuáles salen en el Inicio y en qué orden se ven. Los que no tienen número van después, del más reciente al más antiguo. Ejemplo: 1',
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: 'cliente',
      title: 'Cliente',
      type: 'reference',
      to: [{type: 'cliente'}],
      weak: true,
      group: 'caso',
      description:
        'Opcional. Solo si el cliente ya está en «Clientes». Los casos de software pueden ir anónimos.',
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      group: 'fotos',
      of: [defineArrayMember({type: 'foto'})],
      description: 'La primera es la portada del proyecto. Solo fotos reales del trabajo.',
      validation: (Rule) => Rule.required().min(1),
    }),
    campoSeo({
      // Opcional: si se dejan vacíos, el sitio arma el título y usa el resumen como descripción.
      obligatorio: false,
      metaObligatoria: false,
      siVacioTitle:
        'Si lo dejas vacío se arma solo: el título del proyecto, «en» el municipio y «| Digital X» (sin repetir el municipio si el título ya lo dice).',
      siVacioMeta: 'Si la dejas vacía se usa el resumen del proyecto.',
      siVacioImagen: 'Si la dejas vacía se usa la primera foto del proyecto.',
      ejemploTitle: 'Audio para evento cultural en Atlixco | Digital X',
      ejemploMeta:
        'Sonido y pantallas para un evento cultural en Atlixco: el reto, lo que hicimos y cómo quedó. Cotiza por WhatsApp.',
    }),
  ],
  preview: {
    select: {title: 'titulo', subtitle: 'municipio', media: 'fotos.0'},
  },
})
