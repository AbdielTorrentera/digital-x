import {defineConfig, defineLocaleResourceBundle, type SingleWorkspace} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {esESLocale} from '@sanity/locale-es-es'
import {datasetProduccion, datasetPruebas, projectId} from '@digitalx/sanity/config'
import {schemaTypes} from './schemaTypes'
import {acciones} from './acciones'
import {AvisoDeDataset} from './componentes/AvisoDeDataset'
import {DOCUMENTOS_UNICOS, estructura} from './estructura'

// Todo lo que comparten los dos espacios de trabajo: esquemas, menú, acciones y textos. Solo cambia el dataset.
function comun(dataset: string, titulo: string): SingleWorkspace {
  return {
    title: titulo,
    subtitle: `dataset: ${dataset}`,
    projectId,
    dataset,

    plugins: [esESLocale(), structureTool({structure: estructura}), visionTool()],

    // Franja fija con el nombre del dataset, para no editar en pruebas creyendo que es el sitio.
    studio: {components: {navbar: AvisoDeDataset}},

    i18n: {
      bundles: [
        // «Nuevo {{schemaType}}» no concuerda con todos los títulos («Nuevo Reseña de un cliente»): se usa un
        // texto neutro que funciona con cualquier título.
        defineLocaleResourceBundle({
          locale: 'es-ES',
          namespace: 'structure',
          resources: {
            'panes.document-header-title.new.text': 'Documento nuevo: {{schemaType}}',
            'browser-document-title.new-document': 'Documento nuevo: {{schemaType}}',
          },
        }),
      ],
    },

    schema: {
      types: schemaTypes,
      // Los documentos únicos no se crean desde el botón «Nuevo documento».
      templates: (plantillas) =>
        plantillas.filter(({schemaType}) => !DOCUMENTOS_UNICOS.includes(schemaType)),
    },

    document: {
      // Los documentos únicos no se borran ni se despublican; los servicios y categorías no se quitan si el Inicio los nombra.
      actions: (previas, contexto) => acciones(previas, contexto, DOCUMENTOS_UNICOS),
    },
  }
}

const pruebas = () => ({
  ...comun(datasetPruebas, 'Pruebas'),
  name: 'pruebas',
  basePath: '/pruebas',
})
const produccion = () => ({...comun(datasetProduccion, 'Producción'), name: 'produccion'})

// El Studio publicado (`sanity build` / `sanity deploy`) solo conoce `production`: no existe ninguna ruta para editar
// pruebas desde ahí. `SANITY_STUDIO_ESPACIOS=local` solo la fija el script `dev` de package.json; no vive en ningún
// `.env`, porque la CLI (`sanity deploy`, `schema`) lee esos archivos y registraría también «Pruebas» en el Dashboard
// (pasó en la primera publicación). Sin esa variable no se publica `pruebas`. Con los dos espacios, el primero (Pruebas) es el que abre.
// Son nombres públicos, no secretos.
export default import.meta.env.SANITY_STUDIO_ESPACIOS === 'local'
  ? defineConfig([pruebas(), {...produccion(), basePath: '/produccion'}])
  : defineConfig([{...produccion(), basePath: '/'}])
