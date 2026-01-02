import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import type { UseInViewportReturn } from '../types'

/**
 * A composable that tracks whether an element is within the viewport.
 * 
 * @param target - The ref of the HTML element to observe.
 * @param options - IntersectionObserver options.
 * @returns Object containing `isInView` boolean ref and the `entry` object.
 * 
 * @example
 * ```ts
 * const target = ref(null)
 * const { isInView } = useInViewport(target)
 * ```
 */
export function useInViewport(target: Ref<HTMLElement | null>, options: IntersectionObserverInit = {}): UseInViewportReturn {
  const isInView = ref(false)
  const entry = ref<IntersectionObserverEntry | null>(null)
  
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (target.value) {
      observer = new IntersectionObserver(([e]) => {
        isInView.value = e.isIntersecting
        entry.value = e
      }, options)
      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { isInView, entry }
}
