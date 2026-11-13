import {defineArrayMember, defineField, defineType} from 'sanity'
import {faltantesDePagina, problemasDeSlug, slugificar} from '@digitalx/sanity/reglas'
import {campoFoto, campoSeo} from '../campos'
import {validacionDePagina} from '../../validaciones'

// Con la página construida la dirección ya es pública: no se cambia (estructura §2.7).
const construida = ({document}: {document?: {[campo: string]: unknown}}) =>
  document?.paginaConstruida === true

export const servicio = defineType({
  name: 'servicio',
  title: 'Servicio',
  type: 'document',
  description:
    'Un servicio y toda su página. Su dirección sale sola de su categoría: /{categoría}/{servicio}/. Para publicar la página, completa todo y marca «Página construida».',
  groups: [
    {name: 'basico', title: 'Datos básicos', default: true},
    {name: 'pagina', title: 'Contenido de la página'},
    {name: 'fotos', title: 'Fotos'},
    {name: 'seo', title: 'Google'},
  ],
  validation: validacionDePagina,
  orderings: [
    {title: 'Orden en su categoría', name: 'orden', by: [{field: 'orden', direction: 'asc'}]},
  ],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre del servicio',
      type: 'string',
      group: 'basico',
      description:
        'El nombre oficial. Es el texto de todos los enlaces al servicio. Ejemplo: Video con drone',
      validation: (Rule) =>
        Rule.required()
          .max(70)
          .custom(
            (nombre) =>
              !nombre ||
              !/a la medida/i.test(nombre) ||
              '«A la medida» nunca va en el nombre de un servicio: el servicio se llama «Desarrollo de software».',
          ),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'reference',
      to: [{type: 'categoria'}],
      group: 'basico',
      description:
        'Define la dirección del servicio y su lugar en el menú. Si la página ya está construida no se puede cambiar (cambiaría su dirección).',
      readOnly: construida,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección (slug)',
      type: 'slug',
      group: 'basico',
      description:
        'Lo que la gente busca, sin la ciudad. Ejemplo: video-con-drone. Una dirección publicada no se cambia: si hace falta, hay que pedir una redirección 301.',
      options: {source: 'nombre', slugify: (t) => slugificar(t, 60)},
      readOnly: construida,
      validation: (Rule) =>
        Rule.required().custom((slug) => problemasDeSlug(slug?.current).join(' ') || true),
    }),
    defineField({
      name: 'orden',
      title: 'Orden en su categoría',
      type: 'number',
      group: 'basico',
      description:
        'El 1 va primero. Define el número [01] de la tarjeta y el orden de las listas. Ejemplo: 3',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'paginaConstruida',
      title: 'Página construida (publicar su página)',
      type: 'boolean',
      group: 'basico',
      initialValue: false,
      description:
        'Márcala solo cuando el contenido esté completo y las fotos aprobadas. Hasta entonces el servicio no tiene página: su nombre se muestra sin enlace.',
      validation: (Rule) =>
        Rule.custom((valor, contexto) => {
          if (!valor) return true
          const faltan = faltantesDePagina((contexto.document ?? {}) as never)
          return faltan.length ? `Todavía falta: ${faltan.join(', ')}.` : true
        }),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción corta',
      type: 'text',
      rows: 3,
      group: 'basico',
      description:
        'Una o dos frases. Se usa en las tarjetas y en los datos para Google. Ejemplo: Video y fotografía aérea con drone para eventos, empresas y espacios, en exteriores e interiores.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'h1',
      title: 'Título principal (H1)',
      type: 'string',
      group: 'basico',
      description:
        'Servicio + ciudad + a quién le hablas. Ejemplo: Video y fotografía aérea con drone en Puebla',
      validation: (Rule) =>
        Rule.required()
          .max(90)
          .custom((h1) => !h1 || /Puebla/.test(h1) || 'El título principal debe mencionar Puebla.'),
    }),
    defineField({
      name: 'serviceType',
      title: 'Tipo de servicio para Google',
      type: 'string',
      group: 'basico',
      description:
        'Opcional. Cómo se describe el servicio en los datos para Google. Si lo dejas vacío se usa el nombre de la categoría. Ejemplo: Video y fotografía aérea con drone',
    }),
    defineField({
      name: 'mensajeWhatsApp',
      title: 'Mensaje de WhatsApp de este servicio',
      type: 'text',
      rows: 3,
      group: 'basico',
      description:
        'El texto que ya viene escrito cuando alguien abre el chat desde esta página. Deja huecos con __ para que el cliente los llene. Ejemplo: Hola, quiero cotizar video o fotografía aérea con drone. Fecha: __ Lugar: __ Tipo de evento o proyecto: __',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'pagina',
      title: 'Contenido de la página',
      type: 'object',
      group: 'pagina',
      description: 'Todo lo que se ve en la página del servicio, de arriba hacia abajo.',
      fields: [
        defineField({
          name: 'ficha',
          title: 'Ficha de 3 datos',
          type: 'array',
          of: [defineArrayMember({type: 'filaFicha'})],
          description:
            'Los tres datos que se ven junto al título. Exactamente 3. Ejemplo: Tomas — Video y fotografía aérea con drone / Entrega — Video editado, tomas sin editar o ambos / Para — Eventos, empresas y espacios',
          validation: (Rule) => Rule.length(3).error('La ficha lleva exactamente 3 datos.'),
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'object',
          description: 'El texto principal bajo el encabezado.',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título',
              type: 'string',
              description: 'Ejemplo: Tomas aéreas para tu evento, tu negocio o tu espacio',
              validation: (Rule) => Rule.max(90),
            }),
            defineField({
              name: 'parrafos',
              title: 'Párrafos',
              type: 'array',
              of: [defineArrayMember({type: 'text', rows: 4})],
              description: 'Cada uno es un párrafo. Menciona las zonas con naturalidad.',
            }),
          ],
        }),
        defineField({
          name: 'incluye',
          title: 'Qué incluye',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description:
            'Una línea por cosa incluida. Solo lo que el dueño confirmó. Ejemplo: Planeación de las tomas contigo',
        }),
        defineField({
          name: 'incluyeNota',
          title: 'Nota bajo «Qué incluye»',
          type: 'textoConEnlaces',
          description:
            'Opcional. Un párrafo, por ejemplo para decir qué servicios son aparte y enlazarlos: selecciona las palabras y pulsa el botón de enlace.',
        }),
        defineField({
          name: 'secciones',
          title: 'Secciones extra',
          type: 'array',
          of: [defineArrayMember({type: 'seccion'})],
          description:
            'Secciones con título (por ejemplo «Para qué sirve» o «De qué depende el precio»), en el orden en que se ven. Cada una aparece también en el menú interno de la página.',
          validation: (Rule) =>
            Rule.custom((secciones?: {id?: {current?: string}}[]) => {
              const ids = (secciones ?? []).map((s) => s.id?.current).filter(Boolean)
              return (
                new Set(ids).size === ids.length ||
                'Dos secciones tienen la misma ancla: cambia el título de una.'
              )
            }),
        }),
        defineField({
          name: 'tambien',
          title: '«También te puede servir»',
          type: 'tambien',
          description:
            'Servicios complementarios y páginas útiles. Un servicio sin página publicada no se enlaza: se omite solo.',
        }),
        defineField({name: 'cotizacion', title: 'Tarjeta de cotización', type: 'cotizacion'}),
        defineField({name: 'cierre', title: 'Cierre de la página', type: 'cierre'}),
        defineField({
          name: 'faq',
          title: 'Preguntas frecuentes',
          type: 'array',
          of: [defineArrayMember({type: 'pregunta'})],
          description: 'Sin repetir lo que dicen las secciones. Vacío = no se muestra la sección.',
        }),
      ],
    }),
    campoFoto({
      name: 'foto',
      title: 'Foto del encabezado',
      group: 'fotos',
      description:
        'La foto grande junto al título del servicio y en su tarjeta. Una foto real, horizontal o vertical. Solo con aprobación del dueño.',
    }),
    defineField({
      name: 'galeria',
      title: 'Galería',
      type: 'array',
      group: 'fotos',
      of: [defineArrayMember({type: 'seccionGaleria'})],
      description:
        'Grupos de fotos reales del servicio. Si queda vacía, la galería y su botón no se muestran.',
    }),
    campoSeo({servicio: true}),
  ],
  preview: {
    select: {
      title: 'nombre',
      categoria: 'categoria.etiqueta',
      slug: 'slug.current',
      media: 'foto',
      construida: 'paginaConstruida',
    },
    prepare: ({title, categoria, slug, media, construida: lista}) => ({
      title,
      subtitle: `${lista ? 'Con página' : 'Sin página'} · ${categoria ?? 'sin categoría'} · /${slug ?? ''}/`,
      media,
    }),
  },
})
