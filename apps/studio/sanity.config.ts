import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {esESLocale} from '@sanity/locale-es-es'
import {datasetProduccion, projectId} from '@digitalx/sanity/config'
import {schemaTypes} from './schemaTypes'
import {DOCUMENTOS_UNICOS, estructura} from './estructura'

export default defineConfig({
  name: 'default',
  title: 'Digital X',

  projectId,
  // `pnpm dev` usa el dataset `pruebas` (ver .env.development) para no tocar lo publicado; el Studio publicado
  // y la CLI usan `production`. Son nombres públicos, no secretos.
  dataset: import.meta.env.SANITY_STUDIO_DATASET ?? datasetProduccion,

  plugins: [esESLocale(), structureTool({structure: estructura}), visionTool()],

  schema: {
    types: schemaTypes,
    // Los documentos únicos no se crean desde el botón «Nuevo documento».
    templates: (plantillas) =>
      plantillas.filter(({schemaType}) => !DOCUMENTOS_UNICOS.includes(schemaType)),
  },

  document: {
    // Ni se borran, ni se despublican, ni se duplican: sin ellos el sitio no tiene datos.
    actions: (acciones, {schemaType}) =>
      DOCUMENTOS_UNICOS.includes(schemaType)
        ? acciones.filter(
            ({action}) => !['unpublish', 'delete', 'duplicate'].includes(action ?? ''),
          )
        : acciones,
  },
})
