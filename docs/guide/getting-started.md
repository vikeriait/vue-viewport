# Getting Started

## Installation

::: code-group

```sh [npm]
$ npm add -D @vikeriait/vue-viewport
```

```sh [pnpm]
$ pnpm add -D @vikeriait/vue-viewport
```

```sh [yarn]
$ yarn add -D @vikeriait/vue-viewport
```

```sh [bun]
$ bun add -D @vikeriait/vue-viewport
```

:::

## Quick Start

Register the plugin globally in your Vue app. Choose the setup that matches your styling preference:

::: code-group

```typescript [Tailwind CSS ~vscode-icons:file-type-tailwind~]
import { createApp } from 'vue'
import App from './App.vue'
import ViewportPlugin from '@vikeriait/vue-viewport'

// Import Tailwind-optimized CSS (adds utilities layer)
import '@vikeriait/vue-viewport/tailwind'

const app = createApp(App)
app.use(ViewportPlugin)
app.mount('#app')
```

```typescript [Standard (CSS) ~vscode-icons:file-type-css~]
import { createApp } from 'vue'
import App from './App.vue'
import ViewportPlugin from '@vikeriait/vue-viewport'

// Import pre-built CSS (includes all presets)
import '@vikeriait/vue-viewport/css'

const app = createApp(App)
app.use(ViewportPlugin)
app.mount('#app')
```

:::

## Basic Usage

Simply add the `v-viewport` directive to any element:

::: code-group

```html [Component]
<VViewport preset="fade-up"> Hello Viewport! </VViewport>
```

```html [Directive]
<div v-viewport="'fade-up'">Hello Viewport!</div>
<!-- OR -->
<div v-viewport:fade-up">Hello Viewport!</div>
```

:::
