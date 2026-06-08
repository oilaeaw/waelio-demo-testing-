# Waelio Packages — Full-Coverage Demo Monorepo

> Cross-framework demo & integration testing for all `@waelio` npm packages.  
> Every app demonstrates the **same 6 scenarios** using its native framework patterns.

## 📦 Packages Tested

| Package | Version | Description |
|---------|---------|-------------|
| [`@waelio/ustore`](https://npmjs.com/package/@waelio/ustore) | 2.0.4 | Universal reactive storage |
| [`@waelio/utils`](https://npmjs.com/package/@waelio/utils) | 4.1.7 | Storage utilities (localStorage, cookies, signals) |
| [`@waelio/data`](https://npmjs.com/package/@waelio/data) | 1.0.8 | Local secure reactive database |
| [`@waelio/messaging`](https://npmjs.com/package/@waelio/messaging) | 2.3.7 | Real-time pub/sub messaging |
| [`@waelio/sync`](https://npmjs.com/package/@waelio/sync) | 2.0.1 | Edge-first data sync |
| [`@waelio/realdb`](https://npmjs.com/package/@waelio/realdb) | 0.1.0 | Local-first database |
| [`@waelio/builder`](https://npmjs.com/package/@waelio/builder) | 0.1.2 | Website builder utilities |
| [`@waelio/cli`](https://npmjs.com/package/@waelio/cli) | 0.1.16 | CLI tooling |
| [`quasar-app-extension-waelio`](https://npmjs.com/package/quasar-app-extension-waelio) | 0.2.1 | Quasar extension |

## 🚀 Frameworks

### Phase 1 — Core (available now)

| App | Framework | Port |
|-----|-----------|------|
| [`apps/nuxt`](./apps/nuxt) | Nuxt 3 (Vue SSR) | 3000 |
| [`apps/vite-vue`](./apps/vite-vue) | Vite + Vue 3 | 5173 |
| [`apps/quasar`](./apps/quasar) | Quasar 2 | 9000 |
| [`apps/vite-react`](./apps/vite-react) | Vite + React 18 | 5174 |
| [`apps/next`](./apps/next) | Next.js 14 | 3001 |
| [`apps/vanilla`](./apps/vanilla) | Vanilla HTML/JS | 4000 |

### Phase 2 — Extended

| App | Framework |
|-----|-----------|
| [`apps/angular`](./apps/angular) | Angular 17 |
| [`apps/sveltekit`](./apps/sveltekit) | SvelteKit |
| [`apps/solid`](./apps/solid) | SolidJS |
| [`apps/remix`](./apps/remix) | Remix |

### Phase 3 — Full Coverage

| App | Framework |
|-----|-----------|
| [`apps/astro`](./apps/astro) | Astro |
| [`apps/qwik`](./apps/qwik) | Qwik City |
| [`apps/analog`](./apps/analog) | AnalogJS |
| [`apps/lit`](./apps/lit) | Lit Web Components |
| [`apps/ember`](./apps/ember) | Ember.js |

## 🎯 Demo Scenarios (same across all apps)

1. **Reactive Counter** — `@waelio/ustore`
2. **Local Database CRUD** — `@waelio/realdb` + `@waelio/data`
3. **Storage Utilities** — `@waelio/utils`
4. **Pub/Sub Messaging** — `@waelio/messaging`
5. **Data Sync** — `@waelio/sync`
6. **Builder** — `@waelio/builder`

## 🛠 Getting Started

```bash
# Install all dependencies
npm install

# Run a specific app
npm run dev:nuxt
npm run dev:vite-vue
npm run dev:next
# etc...

# Build all apps
npm run build:all

# Test all apps
npm run test:all
```

## 🔗 Links

- [waelio.com](https://waelio.com) — Package stats & docs
- [github.com/waelio](https://github.com/waelio) — Source repos
- [npmjs.com/~waelio](https://www.npmjs.com/~waelio) — npm profile
