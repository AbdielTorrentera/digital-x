import {defineArrayMember, defineField, defineType} from 'sanity'
import {esHttps} from '@digitalx/sanity/reglas'
import {campoFoto} from '../campos'
import {vocabulario} from '../../validaciones'

export const configuracion = defineType({
  name: 'configuracion',
  title: 'Configuración del sitio',
  type: 'document',
  description:
    'Los datos del negocio que se usan en todo el sitio: botones, enlaces, pie de página y datos para Google.',
  groups: [
    {name: 'contacto', title: 'Contacto', default: true},
    {name: 'whatsapp', title: 'Mensajes de WhatsApp'},
    {name: 'redes', title: 'Redes y reseñas'},
    {name: 'cobertura', title: 'Cobertura'},
    {name: 'fotos', title: 'Fotos generales'},
  ],
  validation: vocabulario,
  fields: [
    defineField({
      name: 'telefono',
      title: 'Teléfono',
      type: 'string',
      group: 'contacto',
      description:
        'En formato internacional, sin espacios. De aquí salen el botón de llamada, el pie y los datos para Google. Ejemplo: +522441244913',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\+52\d{10}$/, {name: 'teléfono', invert: false})
          .error('Escribe el teléfono como +52 y 10 dígitos, sin espacios. Ejemplo: +522441244913'),
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      group: 'contacto',
      description:
        'Con código de país, solo dígitos. De aquí salen todos los botones de WhatsApp. Ejemplo: 522441244913',
      validation: (Rule) =>
        Rule.required()
          .regex(/^52\d{10}$/)
          .error(
            'Escribe el número con 52 y 10 dígitos, sin signos ni espacios. Ejemplo: 522441244913',
          ),
    }),
    defineField({
      name: 'correo',
      title: 'Correo de contacto',
      type: 'string',
      group: 'contacto',
      description:
        'Opcional. Solo si ya tienes el correo definitivo en digitalx.mx. Si lo dejas vacío no se muestra en ningún lado.',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'fundacion',
      title: 'Año en que nació la idea',
      type: 'string',
      group: 'contacto',
      description: 'Se usa en los datos para Google. Ejemplo: 2018',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{4}$/)
          .error('Escribe un año de 4 dígitos.'),
    }),
    defineField({
      name: 'mensajeWhatsAppGeneral',
      title: 'Mensaje general de WhatsApp',
      type: 'text',
      rows: 3,
      group: 'whatsapp',
      description:
        'El texto que ya viene escrito cuando alguien abre el chat desde el Inicio, las categorías y los botones sin servicio. Deja huecos con __ para que el cliente los llene. Ejemplo: Hola, estoy interesado en una cotización. Servicio: __ Fecha: __ Lugar: __',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'redes',
      title: 'Redes sociales',
      type: 'array',
      group: 'redes',
      of: [defineArrayMember({type: 'red'})],
      description:
        'Agrega una por red. Solo se muestran las que estén activas y tengan su dirección. Nunca se muestran enlaces vacíos.',
      validation: (Rule) =>
        Rule.custom((redes?: {red?: string}[]) => {
          const nombres = (redes ?? []).map((r) => r.red)
          return (
            new Set(nombres).size === nombres.length ||
            'Hay una red repetida: deja solo una por red.'
          )
        }),
    }),
    defineField({
      name: 'enlaceResena',
      title: 'Enlace para dejar una reseña',
      type: 'url',
      group: 'redes',
      description:
        'Opcional. Por ejemplo, el enlace de reseñas de tu perfil de Google. Si lo capturas, el sitio muestra el botón «Déjanos tu reseña»; si no, el botón no aparece.',
      validation: (Rule) =>
        Rule.uri({scheme: ['https']}).custom(
          (url?: string) => !url || esHttps(url) || 'Debe empezar con https://',
        ),
    }),
    defineField({
      name: 'zonas',
      title: 'Lugares donde damos servicio',
      type: 'array',
      group: 'cobertura',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Una por línea, en el orden en que quieres que se lean. Se usan en los textos, el pie y los datos para Google. Escribe solo los lugares confirmados (máximo 6); «y alrededores» se agrega solo. Ejemplo: Atlixco',
      validation: (Rule) => Rule.required().min(1).max(6).unique(),
    }),
    campoFoto({
      name: 'fotoCierre',
      title: 'Foto de fondo del cierre de las páginas',
      group: 'fotos',
      description:
        'La foto con velo oscuro detrás del llamado «Cotiza tu evento o proyecto» que cierra casi todas las páginas. Mejor horizontal y con poco detalle en el centro.',
    }),
    campoFoto({
      name: 'imagenCompartir',
      title: 'Imagen al compartir el sitio',
      group: 'fotos',
      obligatoria: false,
      description:
        'Opcional. La imagen que se ve al compartir cualquier página que no tenga la suya (1200 × 630 px). Si la dejas vacía se usa el logo de Digital X.',
    }),
  ],
  preview: {prepare: () => ({title: 'Configuración del sitio'})},
})
