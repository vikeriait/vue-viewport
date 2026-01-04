# Tailwind & Custom Variants

For developers who want full control over their animations without relying on standard presets, `@vikeriait/vue-viewport` exposes powerful **Tailwind CSS custom variants**.

These variants allow you to define the "before" and "after" states of your elements directly in your HTML classes.

## Available Variants

| Variant            | Condition                             | Usage Example                   |
| :----------------- | :------------------------------------ | :------------------------------ |
| `inviewport:`      | Element is visible in viewport        | `inviewport:opacity-100`        |
| `inviewport-down:` | Visible + scrolling down              | `inviewport-down:translate-y-0` |
| `inviewport-up:`   | Visible + scrolling up                | `inviewport-up:translate-y-0`   |
| `belowviewport:`   | Hidden below viewport (initial state) | `belowviewport:opacity-0`       |
| `aboveviewport:`   | Hidden above viewport                 | `aboveviewport:opacity-0`       |

## Usage Examples

### Directional Styling

Change the appearance based on the scroll direction. This is something standard CSS transitions can't easily do.

```html
<div
  v-viewport
  class="transition-colors duration-300 font-bold
         text-gray-400
         inviewport-down:text-blue-600 
         inviewport-up:text-red-600"
>
  Blue when going down, Red when going up!
</div>
```

<div class="mt-4 p-8 bg-(--vp-c-bg-soft) rounded-lg flex justify-center border border-(--vp-c-divider)">
  <div 
    v-viewport 
    class="transition-colors duration-300 font-bold text-xl
           text-gray-400
           inviewport-down:text-blue-500 
           inviewport-up:text-red-500"
  >
    Blue ↓ / Red ↑
  </div>
</div>

### Custom Slide-In

Create a custom animation from scratch. Define the initial state (hidden/translated) and use the `inviewport:` variant to reset it when visible.

```html
<div
  v-viewport
  class="transition-all duration-700 ease-out
         opacity-0 translate-y-10 
         inviewport:opacity-100 inviewport:translate-y-0"
>
  I'm fully custom!
</div>
```

<div class="mt-4 p-8 bg-(--vp-c-bg-soft) rounded-lg flex justify-center border border-(--vp-c-divider)">
  <div 
    v-viewport 
    class="transition-all duration-700 ease-out p-4 bg-blue-500 text-white rounded shadow-lg
           opacity-0 translate-y-10 
           inviewport:opacity-100 inviewport:translate-y-0"
  >
    I'm fully custom!
  </div>
</div>

### Staggering with Tailwind

You can combine `stagger` with Tailwind variants for complex lists.

```html
<div class="grid gap-4">
  <div
    v-for="i in 3"
    :key="i"
    v-viewport="{ stagger: 100 }"
    class="opacity-0 scale-90 transition-all duration-500
           inviewport:opacity-100 inviewport:scale-100"
  >
    Card {{ i }}
  </div>
</div>
```

<div class="mt-4 p-8 bg-(--vp-c-bg-soft) rounded-lg border border-(--vp-c-divider)">
  <div class="grid grid-cols-3 gap-4">
    <div 
      v-for="i in 3" 
      :key="i"
      v-viewport="{ stagger: 100 }"
      class="opacity-0 scale-90 transition-all duration-500
             inviewport:opacity-100 inviewport:scale-100
             h-24 bg-emerald-500 rounded flex items-center justify-center text-white shadow"
    >
      Card {{ i }}
    </div>
  </div>
</div>
