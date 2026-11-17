import {defineCliConfig} from 'sanity/cli'
import {datasetProduccion, projectId} from '@digitalx/sanity/config'

export default defineCliConfig({
  api: {projectId, dataset: datasetProduccion},
  // Nombre público del Studio publicado: https://admin-digitalx.sanity.studio (no es un secreto).
  studioHost: 'admin-digitalx',
  deployment: {
    // ID público del Studio publicado (admin-digitalx.sanity.studio); no es un secreto.
    appId: 'ijegqmg2wce6nwihcwjfzgzg',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
