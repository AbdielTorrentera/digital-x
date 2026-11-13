// Campos que se repiten en varios documentos. Cada uno lleva su descripción con un ejemplo, pensada para el dueño.
import {defineField} from 'sanity'
import {problemasDeMeta, problemasDeTitle} from '@digitalx/sanity/reglas'
import {textoSeoUnico} from '../validaciones'

interface OpcionesDeFoto {
  name: string
  title: string
  description: string
  group?: string
  obligatoria?: boolean
}

/** Una foto con su texto alternativo (obligatorio) y su marca de «foto temporal». */
export const campoFoto = ({name, title, description, group, obligatoria = true}: OpcionesDeFoto) =>
  defineField({
    name,
    title,
    type: 'foto',
    description,
    group,
    validation: obligatoria ? (Rule) => Rule.required().error('Falta la foto.') : undefined,
  })

interface OpcionesDeSeo {
  /** `servicio`: la meta debe nombrar la zona e invitar a cotizar por WhatsApp (SEO §1). */
  servicio?: boolean
  /** Si es opcional (proyectos y artículos), se usa el título del documento cuando se deja vacío. */
  obligatorio?: boolean
  /** Por defecto igual que `obligatorio`. En proyectos y artículos el título es opcional pero la descripción no. */
  metaObligatoria?: boolean
  group?: string
  ejemploTitle?: string
  ejemploMeta?: string
}

/** Cómo aparece la página en Google y al compartirla: título, descripción e imagen. */
export const campoSeo = ({
  servicio = false,
  obligatorio = true,
  metaObligatoria = obligatorio,
  group = 'seo',
  ejemploTitle = 'Renta de audio para eventos en Puebla y Atlixco | Digital X',
  ejemploMeta = 'Renta de audio y sonido, y sonorización, con técnico durante todo tu evento en Puebla, Atlixco y alrededores. Cotiza por WhatsApp.',
}: OpcionesDeSeo = {}) =>
  defineField({
    name: 'seo',
    title: 'Cómo aparece en Google',
    type: 'object',
    group,
    options: {collapsible: false},
    validation: (Rule) =>
      obligatorio || metaObligatoria ? Rule.required().error('Falta el apartado de Google.') : Rule,
    fields: [
      defineField({
        name: 'title',
        title: 'Título para Google',
        type: 'string',
        description: `Es el título azul que se ve en Google. Máximo 60 caracteres y termina en « | Digital X». Cada página necesita el suyo. Ejemplo: ${ejemploTitle}${obligatorio ? '' : '. Si lo dejas vacío se usa el título de la página.'}`,
        validation: (Rule) =>
          Rule.custom(async (valor, contexto) => {
            if (!valor) return obligatorio ? 'Escribe el título para Google.' : true
            const problemas = problemasDeTitle(valor)
            if (problemas.length) return problemas.join(' ')
            return (
              (await textoSeoUnico('seo.title', valor, contexto)) ||
              'Otra página ya usa este título: cada página necesita el suyo.'
            )
          }),
      }),
      defineField({
        name: 'meta',
        title: 'Descripción para Google',
        type: 'text',
        rows: 3,
        description: `El texto gris bajo el título en Google. Máximo 155 caracteres${servicio ? ', con la zona (Puebla o Atlixco) y terminando en «Cotiza por WhatsApp.»' : ''}. Cada página necesita la suya. Ejemplo: ${ejemploMeta}`,
        validation: (Rule) =>
          Rule.custom(async (valor, contexto) => {
            if (!valor) return metaObligatoria ? 'Escribe la descripción para Google.' : true
            const problemas = problemasDeMeta(valor, servicio)
            if (problemas.length) return problemas.join(' ')
            return (
              (await textoSeoUnico('seo.meta', valor, contexto)) ||
              'Otra página ya usa esta descripción: cada página necesita la suya.'
            )
          }),
      }),
      defineField({
        name: 'imagen',
        title: 'Imagen al compartir',
        type: 'foto',
        description:
          'Opcional. La imagen que se ve al compartir la página por WhatsApp o redes (1200 × 630 px). Si la dejas vacía se usa la imagen de Digital X.',
      }),
    ],
  })
