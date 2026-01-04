# Built-in Animations

The library comes with a set of carefully crafted, GPU-accelerated presets.

<script setup>
const presets = [
  'fade', 'blur-in',
  'fade-up', 'fade-down', 'fade-left', 'fade-right',
  'slide-up', 'slide-down', 'slide-left', 'slide-right',
  'scale-up', 'scale-down'
]
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
  <div 
    v-for="preset in presets" 
    :key="preset"
    class="p-6 bg-(--vp-c-bg-soft) rounded-xl border border-(--vp-c-divider) flex flex-col items-center justify-center min-h-[160px]"
  >
    <VViewport 
      :preset="preset" 
      class="text-center"
      :delay="200"
    >
      <div class="text-3xl mb-2">✨</div>
      <code class="text-sm font-bold">{{ preset }}</code>
    </VViewport>
  </div>
</div>

## Directional Variants

Most presets support `-up` and `-down` modifiers. These allow you to apply an animation **only** when the user is scrolling in a specific direction.

- **`{preset}-down`**: Triggers only when scrolling **down** (entering from the bottom of the screen).
- **`{preset}-up`**: Triggers only when scrolling **up** (entering from the top of the screen).

```html
<!-- Only animate when scrolling down -->
<div v-viewport="'fade-up-down'">...</div>

<!-- Only animate when scrolling up -->
<div v-viewport="'fade-down-up'">...</div>
```

> [!TIP]
> This is particularly useful for complex layouts where you want elements to behave differently depending on how the user reaches them.

## Smart Directional Presets

These presets automatically adapt the animation direction based on the user's scroll direction.

- **`fade-y`**: Fades up when scrolling down, fades down when scrolling up.
- **`slide-y`**: Slides up when scrolling down, slides down when scrolling up.

## List of Presets

| Preset                     | Description                              |
| :------------------------- | :--------------------------------------- |
| `fade`                     | Simple opacity transition                |
| `blur-in`                  | Opacity + Blur effect                    |
| `fade-up/down/left/right`  | Opacity + Slide from direction           |
| `slide-up/down/left/right` | Slide from direction (no opacity change) |
| `scale-up`                 | Scales from 0.95 to 1                    |
| `scale-down`               | Scales from 1.05 to 1                    |
