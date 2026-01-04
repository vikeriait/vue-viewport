---
layout: home

hero:
  name: 'Vue Viewport'
  text: 'Intersection Observer made easy'
  tagline: High-performance scroll interactions & Tailwind-ready animations
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/vikeriait/vue-viewport

features:
  - title: 🚀 High Performance
    details: Uses a single IntersectionObserver instance for optimal performance.
  - title: 🎨 Tailwind First
    details: Designed to work seamlessly with Tailwind CSS utility classes.
  - title: ✨ Built-in Presets
    details: Comes with ready-to-use animations like fade, slide, and zoom.
---

<h2
  v-viewport="'fade-up'"
  class="text-center"
>
  Scroll Down to see Magic ✨
</h2>

<div class="h-50"></div>

<div
  class="grid grid-cols-3 gap-3"
>
  <VViewport
    v-for="animation in ['slide-up', 'fade-up', 'fade']"
    :key="animation"
    :preset="animation"
    class="p-5 bg-(--vp-c-bg-soft) rounded-lg"
  >
    <h3 class="m-0!">
      I'm Animated!
    </h3>
    <p class="mb-0!">
      This element is using<br>
      <code>v-viewport="'{{ animation }}'"</code>
    </p>
  </VViewport>
</div>

<div class="h-25"></div>
