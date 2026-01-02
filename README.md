# @vikeriait/vue-viewport

A lightweight, high-performance Vue 3 directive and composable to detect when elements enter the viewport, featuring "Smart Presets", automatic margin compensation for smooth reveals, and seamless Tailwind CSS integration.

## Features

- 👁 **Viewport Detection**: Track when elements enter or leave with precision.
- 🎨 **Tailwind Presets**: Ready-to-use animations like `fade-up`, `scale-up`, `slide-left`.
- 🧠 **Smart Presets**: `fade-y` and `slide-y` automatically adapt direction based on scroll.
- 📐 **Auto RootMargin**: Intelligently calculates the optimal `rootMargin` based on your applied styles (e.g., `translate-y-20` or `--viewport-distance`) to ensure animations start exactly when the element enters, preventing "late" triggers or blank spaces.
- 🧩 **Modular**: Use presets via the directive and control timing (delay, duration) via standard Tailwind classes.
- 🔀 **Conditional Logic**: Apply animations only when scrolling `down` or `up`.
- 🛠 **Customizable**: Works with custom CSS, inline styles (`style="transform:..."`), and Tailwind classes.
- 📦 **Composable**: `useInViewport` for programmatic control.
- 🦾 **TypeScript**: Fully typed.

## Installation

```bash
pnpm add @vikeriait/vue-viewport
# or
npm install @vikeriait/vue-viewport
```

## Setup

### 1. Global Plugin Registration

```ts
import { createApp } from 'vue'
import ViewportPlugin from '@vikeriait/vue-viewport'

const app = createApp(App)

app.use(ViewportPlugin)
app.mount('#app')
```

### 2. Import Styles

**For Tailwind CSS (v4) users:**
Import the library's Tailwind configuration to enable the presets and custom variants (like `inviewport:`).

```css
@import "tailwindcss";

@import "@vikeriait/vue-viewport"; 
/* or explicitly: @import "@vikeriait/vue-viewport/tailwind"; */
```

**For Standard CSS users:**
If you don't use Tailwind, import the CSS bundle to enable the built-in presets.

```ts
import '@vikeriait/vue-viewport/css'
```

## Usage

### Directive `v-viewport`

#### 1. Basic Presets
Simply pass the preset name string.

```html
<div v-viewport="'fade-up'">
  I will fade up when scrolled into view!
</div>
```

#### 2. Utility Classes
If you want to add Tailwind (or custom) utility classes like delays or durations, apply them directly to the `class` attribute. The directive handles the preset logic separately.

```html
<!-- ✅ CORRECT: Separate preset and utility classes -->
<div v-viewport="'fade-up'" class="delay-200 duration-1000">
  I appear slowly with a delay.
</div>
```

#### 3. Smart Presets (`-y`)
These presets automatically detect the scroll direction and animate accordingly (e.g., slide up when scrolling down, slide down when scrolling up).

```html
<div v-viewport="'fade-y'">
  I enter naturally from whichever side you scroll from.
</div>
```

#### 4. Directional Modifiers
Restrict animations to a specific scroll direction by appending `-down` (scrolling down / enter from bottom) or `-up` (scrolling up / enter from top).

```html
<!-- Animates only when you scroll DOWN to it -->
<div v-viewport="'fade-up-down'">
  I appear only on normal scroll.
</div>
```

#### 5. Staggering
Delay animations for elements entering at the same time. The library guarantees DOM order execution.

You can pass:
- `number`: Delay in milliseconds (e.g. `100`).
- `string`: CSS time value (e.g. `'200ms'`, `'0.1s'`).
- `true`: Uses the global default `--viewport-stagger` (default: 100ms).

*Note: The stagger delay is **additive** to any existing CSS delay.*

```html
<!-- Explicit value -->
<div v-for="i in 6" v-viewport="{ animation: 'fade-up', stagger: 100 }"></div>

<!-- Use default from CSS variable -->
<div v-for="i in 6" v-viewport="{ animation: 'fade-up', stagger: true }"></div>
```

### Advanced: Tailwind & Custom Styles

The library is **smart**. If you use custom transforms (via Tailwind classes or inline styles), it detects them and automatically adjusts the IntersectionObserver's `rootMargin` to ensure the animation triggers precisely when the *visual* element enters the screen.

**Example with Tailwind:**
The library sees `translate-y-20` (80px), calculates the offset, and triggers the animation 80px earlier to prevent any "blank space" or jump.

```html
<div 
  v-viewport 
  class="opacity-0 translate-y-20 transition-all duration-700 
         inviewport:opacity-100 inviewport:translate-y-0"
>
  I am a fully custom Tailwind animation handled perfectly.
</div>
```

**Example with Inline Style:**

```html
<div 
  v-viewport
  style="opacity: 0; transform: translateY(100px); transition: 1s"
  class="inviewport:opacity-100 inviewport:translate-y-0"
>
  I work too!
</div>
```

### Composable `useInViewport`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useInViewport } from '@vikeriait/vue-viewport'

const target = ref(null)
const { isInView, entry } = useInViewport(target)
</script>

<template>
  <div ref="target">
    {{ isInView ? 'Visible' : 'Hidden' }}
  </div>
</template>
```

## Built-in Presets

| Preset             | Description     |
|:-------------------|:----------------|
| `fade`             | Simple fade     |
| `fade-up/down`     | Fade + Slide Y  |
| `fade-left/right`  | Fade + Slide X  |
| `slide-up/down`    | Slide Y         |
| `slide-left/right` | Slide X         |
| `scale-up/down`    | Scale Transform |
| `blur-in`          | Blur Reveal     |

*Note: All presets support `-down` (on scroll down) and `-up` (on scroll up) suffixes.*

## CSS Variables

You can customize the global defaults in your CSS:

```css
:root {
    --viewport-duration: 0.6s;
    --viewport-ease: ease-out;
    --viewport-distance: 2rem;
    --viewport-stagger: 100ms;
    --viewport-scale-in: 0.95;
    --viewport-scale-out: 1.05;
    --viewport-blur: 12px;
}
```

## API Reference

### Plugin Options

Options passed to `app.use(ViewportPlugin, options)`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `presets` | `Record<string, string>` | `DEFAULT_PRESETS` | Custom presets map. |

### Directive Options

Options object passed as `v-viewport="{ ... }"`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `animation` | `string` | `undefined` | The animation class or preset name(s). |
| `stagger` | `number \| string \| boolean` | `undefined` | Delay (ms/string) or `true` for global default. |
| `once` | `boolean` | `false` | Disconnect after first entry. |
| `threshold` | `number \| number[]` | `0.2` | IntersectionObserver threshold. |
| `rootMargin` | `string` | `auto` | Manually override the calculated margin. |
| `onEnter` | `function` | `-` | Callback when entering viewport. |
| `onLeave` | `function` | `-` | Callback when leaving viewport. |

### Directive Modifiers

| Modifier | Description |
| :--- | :--- |
| `.once` | Disconnect after first entry. |

### Directive Events

| Event | Type | Description |
| :--- | :--- | :--- |
| `@view-enter` | `ViewportEvent` | Dispatched when entering viewport. |
| `@view-leave` | `ViewportEvent` | Dispatched when leaving viewport. |

## License

MIT
