import {defineCliConfig} from 'sanity/cli'

// ⚠️ Dán Project ID giống trong sanity.config.js
export default defineCliConfig({
  api: {
    projectId: 'g3ju6n9y',
    dataset: 'production',
  },
  studioHost: 'purplebyharry',
})
