# Configuration

When installing the plugin, you can provide an options object to customize its behavior globally.

## Global Options

### `presets`

Define custom presets or override existing ones. A preset is essentially a mapping to a string of CSS classes (standard or Tailwind).

```typescript
import { createApp } from 'vue'
import Viewport from '@vikeriait/vue-viewport'

const app = createApp(App)

app.use(Viewport, {
  presets: {
    // Override existing 'fade' with a slower, custom easing
    fade: 'opacity-0 transition-opacity duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] inviewport:opacity-100',

    // Add new custom preset 'rotate-in'
    // Starts rotated and transparent -> Becomes normal when in view
    'rotate-in':
      'rotate-180 opacity-0 transition-all duration-700 inviewport:rotate-0 inviewport:opacity-100',
  },
})
```

Once defined, you can use them immediately:

```html
<div v-viewport="'rotate-in'">Spinning Entry!</div>
```

## CSS Variables Reference

The library uses CSS variables to control the default behavior and timing of all animations. You can override these at the `:root` level for global changes, or within a specific selector for localized effects.

| Variable               | Default    | Description                                                     |
| :--------------------- | :--------- | :-------------------------------------------------------------- |
| `--viewport-duration`  | `0.6s`     | The duration of the entry/leave transition.                     |
| `--viewport-ease`      | `ease-out` | The timing function for the transition.                         |
| `--viewport-delay`     | `0s`       | The base delay before the animation starts.                     |
| `--viewport-stagger`   | `100ms`    | The default delay between siblings when `stagger` is enabled.   |
| `--viewport-distance`  | `2rem`     | The distance for movement-based presets (slide, fade-up, etc.). |
| `--viewport-scale-in`  | `0.95`     | The starting scale for the `scale-up` preset.                   |
| `--viewport-scale-out` | `1.05`     | The starting scale for the `scale-down` preset.                 |
| `--viewport-blur`      | `12px`     | The starting blur amount for the `blur-in` preset.              |

### Example Override

```css
/* Change default speed and movement globally */
:root {
  --viewport-duration: 0.4s;
  --viewport-distance: 40px;
}

/* Specific section with slower, custom animations */
.hero-section {
  --viewport-duration: 1.2s;
  --viewport-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```
