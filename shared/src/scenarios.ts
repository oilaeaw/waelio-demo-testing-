import type { DemoScenario } from './types.js'

export const WAELIO_PACKAGES = {
  ustore: '@waelio/ustore',
  utils: '@waelio/utils',
  data: '@waelio/data',
  messaging: '@waelio/messaging',
  sync: '@waelio/sync',
  realdb: '@waelio/realdb',
  builder: '@waelio/builder',
  cli: '@waelio/cli',
} as const

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'ustore',
    title: 'Reactive Store',
    description: 'Universal reactive storage — counters, todos, and persisted state that survives page reloads.',
    packages: ['@waelio/ustore'],
    route: '/demo/ustore',
  },
  {
    id: 'utils',
    title: 'Storage Utilities',
    description: 'Read and write localStorage, sessionStorage, cookies, and in-memory storage with a unified API.',
    packages: ['@waelio/utils'],
    route: '/demo/utils',
  },
  {
    id: 'data',
    title: 'Local Database',
    description: 'Local secure reactive database — create, read, update, delete records with reactive queries.',
    packages: ['@waelio/data'],
    route: '/demo/data',
  },
  {
    id: 'realdb',
    title: 'RealDB Collections',
    description: 'Local-first collection database — define schemas, query with filters, sort and paginate results.',
    packages: ['@waelio/realdb'],
    route: '/demo/realdb',
  },
  {
    id: 'messaging',
    title: 'Pub/Sub Messaging',
    description: 'Real-time publish/subscribe messaging — broadcast events between components or tabs.',
    packages: ['@waelio/messaging'],
    route: '/demo/messaging',
  },
  {
    id: 'sync',
    title: 'Edge Sync',
    description: 'Edge-first data synchronisation via Cloudflare Workers — SDK client demo.',
    packages: ['@waelio/sync'],
    route: '/demo/sync',
  },
]

export const FRAMEWORK_COLORS: Record<string, string> = {
  nuxt: '#00DC82',
  'vite-vue': '#42B883',
  quasar: '#1976D2',
  'vite-react': '#61DAFB',
  next: '#000000',
  vanilla: '#F7DF1E',
  angular: '#DD0031',
  sveltekit: '#FF3E00',
  solid: '#4F88C6',
  remix: '#121212',
  astro: '#FF5D01',
  qwik: '#AC7EF4',
  analog: '#DD0031',
  lit: '#324FFF',
  ember: '#E04E39',
}
