import {defineConfig, buildLegacyTheme} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'

// ---- Brand theme (Purple by Harry: black + magenta) ----
const theme = buildLegacyTheme({
  '--black': '#050505',
  '--white': '#f5f3f4',
  '--gray': '#8c868a',
  '--gray-base': '#8c868a',
  '--component-bg': '#0d0d0d',
  '--component-text-color': '#f5f3f4',
  '--brand-primary': '#ff009d',
  '--default-button-color': '#2a2430',
  '--default-button-primary-color': '#ff009d',
  '--default-button-success-color': '#23e07a',
  '--default-button-warning-color': '#ffb020',
  '--default-button-danger-color': '#ff3b4e',
  '--state-info-color': '#7a2bff',
  '--state-success-color': '#23e07a',
  '--state-warning-color': '#ffb020',
  '--state-danger-color': '#ff3b4e',
  '--main-navigation-color': '#0a0a0a',
  '--main-navigation-color--inverted': '#f5f3f4',
  '--focus-color': '#ff009d',
})

// Singletons open straight into ONE editable form
const SINGLETONS = [
  {id: 'siteImages', type: 'siteImages', title: '🏠  Home & Brand images'},
  {id: 'social', type: 'social', title: '📣  Social — follower counts'},
  {id: 'vault', type: 'vault', title: '🖼  The Vault (gallery)'},
  {id: 'guide', type: 'guide', title: "🌱  Grower's Guide"},
]
const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type))

const single = (S, id) => {
  const s = SINGLETONS.find((x) => x.id === id)
  return S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.type).documentId(s.id).title(s.title))
}

const structure = (S) =>
  S.list()
    .title('Purple by Harry')
    .items([
      single(S, 'siteImages'),
      single(S, 'social'),
      single(S, 'vault'),
      S.divider(),
      S.documentTypeListItem('product').title('🛒  Shop — Products'),
      S.divider(),
      single(S, 'guide'),
      S.documentTypeListItem('post').title('✍️  Journal — Posts'),
    ])

export default defineConfig({
  name: 'default',
  title: 'Purple by Harry',
  projectId: 'g3ju6n9y',
  dataset: 'production',
  theme,
  plugins: [structureTool({structure})],
  schema: {types: schemaTypes},
  document: {
    newDocumentOptions: (prev) => prev.filter((t) => !SINGLETON_TYPES.has(t.templateId)),
    actions: (prev, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action))
        : prev,
  },
})
