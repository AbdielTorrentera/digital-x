import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  MAX_RESENA,
  MIN_RESENA,
  problemaDePermiso,
  slugificar,
  urlDeRedValida,
} from '@digitalx/sanity/reglas'
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
    'Solo reseñas REALES de clientes y solo con su permiso. No hay reseñas de ejemplo ni de relleno, ni calificaciones con estrellas. Las de Google o Facebook se capturan a mano, con permiso. Si no hay ninguna publicada, la sección no aparece en el sitio.',
  groups: [
    {name: 'resena', title: 'La reseña', default: true},
    {name: 'donde', title: 'Dónde se muestra'},
    {name: 'permiso', title: 'Permiso'},
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
      description: `Las palabras del cliente, tal como las escribió o dijo. Entre ${MIN_RESENA} y ${MAX_RESENA} caracteres. No la corrijas ni la mejores: si es muy larga, elige un fragmento fiel.`,
      validation: (Rule) => Rule.required().min(MIN_RESENA).max(MAX_RESENA),
    }),
    defineField({
      name: 'nombre',
      title: 'Nombre de quien la da',
      type: 'string',
      group: 'resena',
      description: 'Como la persona autorizó que se publique. Ejemplo: María López',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'cargo',
      title: 'Cargo',
      type: 'string',
      group: 'resena',
      description: 'Opcional. Ejemplo: Coordinadora de eventos',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'empresa',
      title: 'Empresa o institución',
      type: 'string',
      group: 'resena',
      description: 'Opcional. Ejemplo: Casa de la Cultura de Atlixco',
      validation: (Rule) => Rule.max(80),
    }),
    campoFoto({
      name: 'foto',
      title: 'Foto o logo',
      group: 'resena',
      obligatoria: false,
      description:
        'Opcional, y solo con permiso. Con su texto alternativo. Ejemplo: Foto de María López / Logo de Casa de la Cultura',
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
        Rule.uri({scheme: ['https']}).custom((url, {parent}) => {
          const origen = (parent as {origen?: string} | undefined)?.origen
          if (!url) return true
          if (origen !== 'google' && origen !== 'facebook')
            return 'Solo las reseñas de Google o Facebook llevan enlace al original.'
          return (
            urlDeRedValida(origen, url) ||
            `Este enlace no es de ${origen === 'google' ? 'Google' : 'Facebook'}.`
          )
        }),
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
    defineField({
      name: 'permiso',
      title: 'La persona me dio permiso para publicar su reseña',
      type: 'boolean',
      group: 'permiso',
      initialValue: false,
      description:
        'Obligatorio para publicar: sin permiso la reseña se queda en borrador. Lo publicado aquí lo puede leer cualquiera. El comprobante del permiso (el mensaje o correo) no se guarda en Sanity: guárdalo aparte.',
      validation: (Rule) =>
        Rule.custom(
          (permiso, {document}) =>
            problemaDePermiso({...(document as object), permiso, _type: 'resena'}) ?? true,
        ),
    }),
  ],
  preview: {
    select: {title: 'nombre', subtitle: 'texto', media: 'foto', permiso: 'permiso'},
    prepare: ({title, subtitle, media, permiso}) => ({
      title: `${title ?? 'Sin nombre'}${permiso ? '' : ' (sin permiso)'}`,
      subtitle: subtitle?.slice(0, 80),
      media,
    }),
  },
})
