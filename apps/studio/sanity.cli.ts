import {defineCliConfig} from 'sanity/cli'
import {datasetProduccion, projectId} from '@digitalx/sanity/config'

export default defineCliConfig({
  api: {projectId, dataset: datasetProduccion},
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
