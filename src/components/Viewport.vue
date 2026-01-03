<script setup lang="ts">
import { type PropType } from 'vue'
import { vViewport } from '../directives/vViewport'
import type { ViewportOptions, ViewportDirection } from '../types'

defineOptions({
  name: 'Viewport'
})

const props = defineProps({
  /** The HTML tag to render. Defaults to 'div'. */
  as: {
    type: String,
    default: 'div'
  },
  /** The animation preset name (e.g., 'fade-up'). */
  preset: {
    type: String,
    default: undefined
  },
  /** Delay in ms or CSS string (e.g. '100ms'). Set to true to use global variable. */
  stagger: {
    type: [Number, String, Boolean] as PropType<ViewportOptions['stagger']>,
    default: undefined
  },
  /** Intersection threshold (0.0 - 1.0). */
  threshold: {
    type: [Number, Array] as PropType<ViewportOptions['threshold']>,
    default: undefined
  },
  /** Custom rootMargin string. */
  rootMargin: {
    type: String as PropType<ViewportOptions['rootMargin']>,
    default: undefined
  },
  /** If true, disconnects the observer after the first entry. */
  once: {
    type: Boolean,
    default: false
  },
  /** Custom root element (defaults to viewport). */
  root: {
    type: Object as PropType<ViewportOptions['root']>,
    default: undefined
  }
})

const emit = defineEmits<{
  (e: 'enter', payload: { entry: IntersectionObserverEntry, direction: ViewportDirection }): void
  (e: 'leave', payload: { entry: IntersectionObserverEntry, direction: ViewportDirection }): void
}>()

// Construct options object for the directive
const viewportOptions = {
  animation: props.preset,
  stagger: props.stagger,
  threshold: props.threshold,
  rootMargin: props.rootMargin,
  once: props.once,
  root: props.root,
  onEnter: (entry: IntersectionObserverEntry, direction: ViewportDirection) => {
    emit('enter', { entry, direction })
  },
  onLeave: (entry: IntersectionObserverEntry, direction: ViewportDirection) => {
    emit('leave', { entry, direction })
  }
}
</script>

<template>
  <component 
    :is="props.as"
    v-viewport="viewportOptions"
  >
    <slot />
  </component>
</template>
