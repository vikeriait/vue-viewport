# Directive & Component

The core functionality is available both as a directive (`v-viewport`) and a wrapper component (`<VViewport>`). They share the same underlying options.

## `<VViewport>` Component

The recommended way to wrap sections of content.

### Props

| Prop         | Type                          | Default | Description                                                       |
| :----------- | :---------------------------- | :------ | :---------------------------------------------------------------- |
| `preset`     | `string`                      | -       | The animation preset name (e.g. `'fade-up'`).                     |
| `once`       | `boolean`                     | `false` | If `true`, disconnects observer after first entry.                |
| `stagger`    | `number \| string \| boolean` | -       | Delays entry relative to siblings. See [Staggering](#staggering). |
| `threshold`  | `number \| number[]`          | `0.1`   | Percentage of visibility required to trigger.                     |
| `rootMargin` | `string`                      | auto    | Margin around the root. Defaults to intelligent auto-calculation. |
| `duration`   | `number \| string`            | -       | Override animation duration (e.g. `500`, `'0.5s'`).               |
| `delay`      | `number \| string`            | -       | Override animation delay.                                         |
| `easing`     | `string`                      | -       | Override CSS easing function.                                     |
| `as`         | `string`                      | `'div'` | The HTML tag to render.                                           |

### Events

| Event    | Payload                | Description                             |
| :------- | :--------------------- | :-------------------------------------- |
| `@enter` | `{ entry, direction }` | Triggered when element enters viewport. |
| `@leave` | `{ entry, direction }` | Triggered when element leaves viewport. |

---

## `v-viewport` Directive

Useful for attaching behavior to existing elements without adding a wrapper.

### Syntax

```html
<!-- Simple preset -->
<div v-viewport="'fade-up'"></div>

<!-- Full Options Object -->
<div v-viewport="{ animation: 'fade-up', delay: 200, once: true }"></div>

<!-- Argument Syntax (Preset only) -->
<div v-viewport:fade-up></div>
```

### Modifiers

| Modifier | Description                             |
| :------- | :-------------------------------------- |
| `.once`  | Disconnects observer after first entry. |

### Options Object

When passing an object, the properties map directly to the Component Props above:

```typescript
interface ViewportOptions {
  animation?: string
  stagger?: number | string | boolean
  duration?: number | string
  delay?: number | string
  easing?: string
  once?: boolean
  threshold?: number | number[]
  rootMargin?: string
  onEnter?: (entry, direction) => void
  onLeave?: (entry, direction) => void
}
```

### Native Events

When using the directive, you can listen to native DOM events. These are useful if you want to trigger logic without using the wrapper component.

| Event        | Detail                 | Description                                   |
| :----------- | :--------------------- | :-------------------------------------------- |
| `view-enter` | `{ entry, direction }` | Emitted when the element enters the viewport. |
| `view-leave` | `{ entry, direction }` | Emitted when the element leaves the viewport. |

```html
<div v-viewport="'fade-up'" @view-enter="(e) => console.log('Entered!', e.detail.direction)">
  Observe me!
</div>
```

## Staggering

The `stagger` option allows you to orchestrate the entry of multiple elements so they appear one after another.

- **Number**: Fixed delay in ms relative to the previous element in the group.
- **`true`**: Uses the global CSS variable `--viewport-stagger`.

```html
<div class="grid">
  <div v-for="i in 5" v-viewport="{ animation: 'fade-up', stagger: 100 }">Item {{ i }}</div>
</div>
```

<div class="mt-4 p-8 bg-(--vp-c-bg-soft) rounded-lg border border-(--vp-c-divider)">
  <div class="grid grid-cols-5 gap-4">
    <div 
      v-for="i in 5" 
      :key="i"
      v-viewport="{ animation: 'fade-up', stagger: 200 }"
      class="h-16 bg-purple-500 rounded flex items-center justify-center text-white font-bold shadow-md"
    >
      {{ i }}
    </div>
  </div>
</div>
