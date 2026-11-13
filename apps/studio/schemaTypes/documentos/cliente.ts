import {defineField, defineType} from 'sanity'
import {problemaDePermiso} from '@digitalx/sanity/reglas'
import {campoFoto} from '../campos'

export const cliente = defineType({
  name: 'cliente',
  title: 'Cliente',
  type: 'document',
  description:
    'Una empresa o persona con la que Digital X ha trabajado y que dio permiso de publicar su nombre y logo. Nunca se inventan clientes.',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      description: 'Ejemplo: Impact Hub',
      validation: (Rule) => Rule.required().max(80),
    }),
    campoFoto({
      name: 'logo',
      title: 'Logo',
      obligatoria: false,
      description: 'Opcional. Con su texto alternativo. Ejemplo: Logo de Impact Hub',
    }),
    defineField({
      name: 'permiso',
      title: 'El cliente me dio permiso para publicar su nombre y logo',
      type: 'boolean',
      initialValue: false,
      description:
        'Obligatorio para publicar. Lo publicado aquí lo puede leer cualquiera. El comprobante del permiso no se guarda en Sanity: guárdalo aparte.',
      validation: (Rule) =>
        Rule.custom(
          (permiso, {document}) =>
            problemaDePermiso({...(document as object), permiso, _type: 'cliente'}) ?? true,
        ),
    }),
  ],
  preview: {
    select: {title: 'nombre', media: 'logo', permiso: 'permiso'},
    prepare: ({title, media, permiso}) => ({
      title,
      media,
      subtitle: permiso ? 'Con permiso' : 'Sin permiso (borrador)',
    }),
  },
})
