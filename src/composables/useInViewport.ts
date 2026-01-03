import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import type { UseInViewportReturn } from '../types'
import { observerManager, type ObserverInstance } from '../utils/observer'

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
  
  let instance: ObserverInstance | null = null
  let el: HTMLElement | null = null

  onMounted(() => {
    if (target.value) {
      el = target.value
      instance = observerManager.observe(el, options, (e) => {
        isInView.value = e.isIntersecting
        entry.value = e
      })
    }
  })

  onUnmounted(() => {
    if (instance && el) {
      observerManager.unobserve(instance, el)
    }
  })

  return { isInView, entry }
}
