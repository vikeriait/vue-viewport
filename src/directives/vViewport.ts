import type { Directive, DirectiveBinding } from 'vue'
import { ACTIVE_PRESETS } from '../constants'
import { computeDefaultRootMargin } from '../utils'
import type { ViewportOptions, ViewportDirection, ResolvedConfig } from '../types'

/**
 * Parses the directive binding to extract options, animation name, and 'once' state.
 * Handles both string values (animation name) and object values (options).
 */
function resolveConfig(binding: DirectiveBinding<ViewportOptions | string>): ResolvedConfig {
  const { value, modifiers, arg } = binding
  
  let options: ViewportOptions = {}
  let animationName: string | undefined = arg

  if (typeof value === 'string') {
    animationName = value
  } else if (typeof value === 'object' && value !== null) {
    options = value
    if (typeof options.animation === 'string') {
      animationName = options.animation
    }
  }

  const once = modifiers.once || options.once || false

  return { options, animationName, once }
}

/**
 * Handles the logic when the element enters the viewport.
 * Sets data attributes for entry direction and in-view state.
 */
function handleEnter(
  el: HTMLElement, 
  entry: IntersectionObserverEntry, 
  direction: ViewportDirection, 
  options: ViewportOptions
): void {
  // Set entry direction
  el.dataset.vpEntry = direction
  
  // Clear position attributes as it's now in view
  delete el.dataset.vpPos

  // Trigger callback
  options.onEnter?.(entry, direction)

  el.dispatchEvent(new CustomEvent('view-enter', {
    detail: { entry, direction }
  }))

  requestAnimationFrame(() => {
    el.dataset.vpInView = ''
  })
}

/**
 * Handles the logic when the element leaves the viewport.
 * Removes in-view attribute and sets position (above/below).
 */
function handleLeave(
  el: HTMLElement, 
  entry: IntersectionObserverEntry, 
  direction: ViewportDirection,
  options: ViewportOptions
): void {
  delete el.dataset.vpInView
  delete el.dataset.vpEntry
  
  const rect = entry.boundingClientRect
  if (rect.top < 0) {
    el.dataset.vpPos = 'above'
  } else if (rect.bottom > window.innerHeight) {
    el.dataset.vpPos = 'below'
  }
  
  options.onLeave?.(entry, direction)

  el.dispatchEvent(new CustomEvent('view-leave', {
    detail: { entry, direction }
  }))
}

const observers = new WeakMap<HTMLElement, IntersectionObserver>()

/**
 * Vue Directive: v-viewport
 * 
 * Detects when an element enters the viewport and applies animation states via data attributes.
 * Uses data-vp-* attributes to avoid conflicts with Vue's class binding.
 */
export const vViewport: Directive<HTMLElement, ViewportOptions | string> = {
  // Apply the preset attribute in beforeMount
  beforeMount(el, binding) {
    const { animationName } = resolveConfig(binding)
    
    if (animationName) {
      // Resolve preset name (handle custom aliases if any)
      // Strict mode: Only accept valid presets from ACTIVE_PRESETS
      const tokens = animationName.split(/\s+/)
      const validPresets = tokens
        .map(token => ACTIVE_PRESETS[token])
        .filter((preset): preset is string => !!preset)
        .join(' ')
      
      if (validPresets) {
        el.dataset.vpPreset = validPresets
      }

      // Set default direction to ensure initial state (e.g. opacity: 0)
      el.dataset.vpEntry = 'down'
    }
  },

  mounted(el, binding) {
    const { options, animationName, once } = resolveConfig(binding)
    
    const observerOptions: IntersectionObserverInit = {
      root: options.root || null,
      rootMargin: options.rootMargin || computeDefaultRootMargin(el, animationName),
      threshold: options.threshold ?? 0.2,
    }

    let lastScrollY = window.scrollY

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const isInView = entry.isIntersecting
        const scrollY = window.scrollY
        
        const direction = scrollY >= lastScrollY ? 'down' : 'up'
        lastScrollY = scrollY

        if (isInView) {
          handleEnter(el, entry, direction, options)
          if (once) observer.unobserve(el)
        } else {
          handleLeave(el, entry, direction, options)
        }
      })
    }, observerOptions)

    observer.observe(el)
    
    observers.set(el, observer)
  },

  unmounted(el) {
    const observer = observers.get(el)
    if (observer) {
      observer.disconnect()
      observers.delete(el)
    }
  }
}
