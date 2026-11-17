// Campos que se repiten en varios documentos. Cada uno lleva su descripción con un ejemplo, pensada para el dueño.
import {defineField} from 'sanity'
import {ContadorDeCaracteres} from '../componentes/ContadorDeCaracteres'

interface OpcionesDeFoto {
  name: string
  title: string
  description: string
  group?: string
  obligatoria?: boolean
}

/** Una foto con su texto alternativo (opcional). */
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
  /** Si es opcional (proyectos y artículos), se usa el título del documento cuando se deja vacío. */
  obligatorio?: boolean
  /** Por defecto igual que `obligatorio`. En proyectos y artículos el título es opcional pero la descripción no. */
  metaObligatoria?: boolean
  group?: string
  ejemploTitle?: string
  ejemploMeta?: string
}

/** Cómo aparece la página en Google y al compartirla: título, descripción e imagen. Solo se exige que existan. */
export const campoSeo = ({
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
      Rule.custom((valor) =>
        !valor && (obligatorio || metaObligatoria) ? 'Falta el apartado de Google.' : true,
      ),
    fields: [
      defineField({
        name: 'title',
        title: 'Título para Google',
        type: 'string',
        components: {input: ContadorDeCaracteres},
        description: `Es el título azul que se ve en Google. Guía: unos 60 caracteres. Ejemplo: ${ejemploTitle}${obligatorio ? '' : '. Si lo dejas vacío se usa el título de la página.'}`,
        validation: (Rule) =>
          Rule.custom((valor) => (!valor && obligatorio ? 'Escribe el título para Google.' : true)),
      }),
      defineField({
        name: 'meta',
        title: 'Descripción para Google',
        type: 'text',
        rows: 3,
        components: {input: ContadorDeCaracteres},
        description: `El texto gris bajo el título en Google. Guía: unos 155 caracteres. Ejemplo: ${ejemploMeta}`,
        validation: (Rule) =>
          Rule.custom((valor) =>
            !valor && metaObligatoria ? 'Escribe la descripción para Google.' : true,
          ),
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
