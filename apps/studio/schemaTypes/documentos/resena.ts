import {defineArrayMember, defineField, defineType} from 'sanity'
import {esHttps, slugificar} from '@digitalx/sanity/reglas'
import {campoFoto} from '../campos'

const ORIGENES = [
  {title: 'WhatsApp', value: 'whatsapp'},
  {title: 'Correo', value: 'correo'},
  {title: 'Google', value: 'google'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'En persona', value: 'persona'},
]

export const resena = defineType({
  name: 'resena',
  title: 'Reseña de un cliente',
  type: 'document',
  description:
    'Solo reseñas REALES de clientes. No hay reseñas de ejemplo ni de relleno, ni calificaciones con estrellas. Las de Google o Facebook se capturan a mano. Todo lo publicado aquí se muestra; si no hay ninguna, la sección no aparece en el sitio.',
  groups: [
    {name: 'resena', title: 'La reseña', default: true},
    {name: 'donde', title: 'Dónde se muestra'},
  ],
  validation: (Rule) =>
    Rule.custom((doc) => {
      const r = doc as {servicios?: unknown[]; proyecto?: unknown; destacada?: boolean} | undefined
      return !r || r.servicios?.length || r.proyecto || r.destacada
        ? true
        : 'Esta reseña no se mostrará en ningún lado: elígele un servicio, un proyecto o márcala como destacada.'
    }).warning(),
  orderings: [
    {title: 'Más recientes primero', name: 'fecha', by: [{field: 'fecha', direction: 'desc'}]},
  ],
  fields: [
    defineField({
      name: 'texto',
      title: 'Texto de la reseña',
      type: 'text',
      rows: 5,
      group: 'resena',
      description:
        'Las palabras del cliente, tal como las escribió o dijo. No la corrijas ni la mejores: si es muy larga, elige un fragmento fiel.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nombre',
      title: 'Nombre de quien la da',
      type: 'string',
      group: 'resena',
      description: 'Como la persona autorizó que se publique. Ejemplo: María López',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cargo',
      title: 'Cargo',
      type: 'string',
      group: 'resena',
      description: 'Opcional. Ejemplo: Coordinadora de eventos',
    }),
    defineField({
      name: 'empresa',
      title: 'Empresa o institución',
      type: 'string',
      group: 'resena',
      description: 'Opcional. Ejemplo: Casa de la Cultura de Atlixco',
    }),
    campoFoto({
      name: 'foto',
      title: 'Foto o logo',
      group: 'resena',
      obligatoria: false,
      description:
        'Opcional. Con su texto alternativo. Ejemplo: Foto de María López / Logo de Casa de la Cultura',
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de la reseña',
      type: 'date',
      group: 'resena',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección interna (slug)',
      type: 'slug',
      group: 'resena',
      description:
        'Se genera sola con el nombre y el año. Es la parte final del enlace para compartirla: /resenas/#resena-{slug}',
      options: {
        source: (doc) =>
          `${(doc as {nombre?: string}).nombre ?? ''} ${((doc as {fecha?: string}).fecha ?? '').slice(0, 4)}`,
        slugify: (t) => slugificar(t, 60),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'origen',
      title: 'De dónde viene',
      type: 'string',
      group: 'resena',
      options: {list: ORIGENES, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enlaceOriginal',
      title: 'Enlace a la reseña original',
      type: 'url',
      group: 'resena',
      description:
        'Opcional. Solo si la reseña es pública (Google o Facebook). Debe empezar con https://',
      validation: (Rule) =>
        Rule.uri({scheme: ['https']}).custom(
          (url?: string) => !url || esHttps(url) || 'Debe empezar con https://',
        ),
    }),
    defineField({
      name: 'servicios',
      title: 'Servicios de los que habla',
      type: 'array',
      group: 'donde',
      of: [defineArrayMember({type: 'reference', to: [{type: 'servicio'}]})],
      description:
        'Opcional. La reseña aparece en la página de cada servicio que elijas y en la de su categoría.',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'proyecto',
      title: 'Proyecto relacionado',
      type: 'reference',
      to: [{type: 'proyecto'}],
      weak: true,
      group: 'donde',
      description: 'Opcional. La reseña aparece en la página de ese proyecto.',
    }),
    defineField({
      name: 'destacada',
      title: 'Destacada (mostrar en el Inicio)',
      type: 'boolean',
      group: 'donde',
      initialValue: false,
      description: 'Las destacadas son las que salen en el Inicio. Elige pocas y las mejores.',
    }),
  ],
  preview: {
    select: {title: 'nombre', subtitle: 'texto', media: 'foto'},
    prepare: ({title, subtitle, media}) => ({
      title: title ?? 'Sin nombre',
      subtitle: subtitle?.slice(0, 80),
      media,
    }),
  },
})
