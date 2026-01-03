import type { Directive, DirectiveBinding } from 'vue'
import { ACTIVE_PRESETS } from '../constants'
import { computeDefaultRootMargin } from '../utils'
import { observerManager, type ObserverInstance } from '../utils/observer'
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
 * Resolves the stagger option into a numeric delay in milliseconds.
 * - number: returns as is
 * - string: parses "100ms", "0.5s"
 * - true: reads --viewport-stagger CSS variable
 */
function resolveStaggerValue(value: number | string | boolean | undefined, el: HTMLElement): number {
  if (typeof value === 'number') return value
  
  if (typeof value === 'string') return parseDelay(value)
  
  if (value === true) {
    const style = getComputedStyle(el)
    const cssVar = style.getPropertyValue('--viewport-stagger').trim()
    return parseDelay(cssVar || '100ms')
  }
  
  return 0
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
  const task: StaggerTask = { el, entry, direction, options }
  const staggerValue = resolveStaggerValue(options.stagger, el)

  // Apply stagger if defined
  if (staggerValue > 0) {
    scheduleStagger(task, staggerValue)
  } else {
    performEnter(task, 0)
  }
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
  // Remove inline delay on leave so it doesn't affect re-entry or other transitions
  el.style.removeProperty('transition-delay')

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

const observers = new WeakMap<HTMLElement, ObserverInstance>()

// --- Stagger Logic ---

interface StaggerTask {
  el: HTMLElement
  entry: IntersectionObserverEntry
  direction: ViewportDirection
  options: ViewportOptions
}

interface StaggerState {
  queue: StaggerTask[]
  timeout: number
}

const staggerMap = new WeakMap<HTMLElement, StaggerState>()

/**
 * Parses a CSS time string (e.g. "0.5s", "300ms") into milliseconds.
 */
function parseDelay(value: string): number {
  if (!value) return 0
  // Handle multiple values (e.g. "0s, 0.5s"), take the max or first? 
  // Usually transition-delay matches transition-property count. 
  // We take the max value found to be safe, or just the first.
  // Let's split by comma and take the max to ensure we don't cut off a long delay.
  const delays = value.split(',').map(v => {
    const match = /([\d.]+)(m?s)/.exec(v.trim())
    if (!match) return 0
    const num = parseFloat(match[1])
    const unit = match[2]
    return unit === 's' ? num * 1000 : num
  })
  return Math.max(...delays)
}

/**
 * Applies the entry logic to a single element.
 */
function performEnter(task: StaggerTask, staggerDelay: number = 0) {
  const { el, entry, direction, options } = task

  // Calculate total delay: existing CSS delay + stagger delay
  let totalDelay = staggerDelay
  
  // Only read computed style if we have a stagger to apply, 
  // otherwise we just let the CSS delay work as is.
  // EXCEPT: if index > 0, we MUST apply inline style. 
  // If we don't add base delay, we overwrite it.
  if (staggerDelay > 0) {
    const style = getComputedStyle(el)
    const baseDelay = parseDelay(style.transitionDelay)
    totalDelay += baseDelay
  }

  if (totalDelay > 0) {
    el.style.transitionDelay = `${totalDelay}ms`
  }

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
 * Flushes the queue for a specific parent: sorts elements by DOM order,
 * calculates delays, and executes entry.
 */
function flushStaggerQueue(parent: HTMLElement, staggerValue: number) {
  const state = staggerMap.get(parent)
  if (!state || state.queue.length === 0) return

  const sortedQueue = state.queue.sort((a, b) => {
    // Sort by DOM order
    return (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1
  })

  sortedQueue.forEach((task, index) => {
    performEnter(task, index * staggerValue)
  })

  // Reset queue
  state.queue = []
}

/**
 * Schedules an element for staggered entry.
 */
function scheduleStagger(task: StaggerTask, staggerValue: number) {
  const parent = task.el.parentElement
  if (!parent) {
    performEnter(task, 0)
    return
  }

  let state = staggerMap.get(parent)
  if (!state) {
    state = { queue: [], timeout: 0 }
    staggerMap.set(parent, state)
  }

  state.queue.push(task)

  if (state.timeout) clearTimeout(state.timeout)

  // Debounce to collect all elements in the same frame/tick
  state.timeout = window.setTimeout(() => {
    flushStaggerQueue(parent, staggerValue)
  }, 10) // Small buffer to catch all IO callbacks
}

/**
 * Vue Directive: v-viewport
 * 
 * Detects when an element enters the viewport and applies animation states via data attributes.
 * Uses data-vp-* attributes to avoid conflicts with Vue's class binding.
 */
export const vViewport: Directive<HTMLElement, ViewportOptions | string> = {
  // Apply the preset attribute in beforeMount
  beforeMount(el, binding) {
    // Mark element as managed by vue-viewport for global CSS targeting (A11y)
    el.dataset.vpMounted = ''

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
      threshold: options.threshold ?? 0.1,
    }

    let lastScrollY = window.scrollY

    // Use ObserverManager instead of creating a new instance
    const instance = observerManager.observe(el, observerOptions, (entry) => {
      const isInView = entry.isIntersecting
      const scrollY = window.scrollY
      
      const direction = scrollY >= lastScrollY ? 'down' : 'up'
      lastScrollY = scrollY

      if (isInView) {
        handleEnter(el, entry, direction, options)
        if (once) observerManager.unobserve(instance, el)
      } else {
        handleLeave(el, entry, direction, options)
      }
    })
    
    observers.set(el, instance)
  },

  unmounted(el) {
    const instance = observers.get(el)
    if (instance) {
      observerManager.unobserve(instance, el)
      observers.delete(el)
    }
  }
}
