import type { Ref } from 'vue'

/**
 * Direction of the scroll movement relative to the viewport.
 */
export type ViewportDirection = 'down' | 'up'

/**
 * Options for the v-viewport directive.
 * Extends IntersectionObserverInit to allow custom observer configuration.
 */
export interface ViewportOptions extends IntersectionObserverInit {
  /**
   * The preset name(s) to apply (e.g. 'fade-up').
   * Custom utility classes should be applied via the standard 'class' attribute.
   */
  animation?: string
  /**
   * Stagger delay for elements entering together.
   * - `number`: milliseconds
   * - `string`: CSS time (e.g. '100ms', '0.1s')
   * - `true`: uses global `--viewport-stagger` variable
   */
  stagger?: number | string | boolean
  /**
   * If true, the observer will disconnect after the first entry.
   */
  once?: boolean
  /**
   * Callback triggered when the element enters the viewport.
   */
  onEnter?: (entry: IntersectionObserverEntry, direction: ViewportDirection) => void
  /**
   * Callback triggered when the element leaves the viewport.
   */
  onLeave?: (entry: IntersectionObserverEntry, direction: ViewportDirection) => void
}

/**
 * Options for the ViewportPlugin installation.
 */
export interface ViewportPluginOptions {
  /**
   * Custom presets to merge with or override the default presets.
   * Key is the preset name, value is the CSS class(es).
   */
  presets?: Record<string, string>
}

/**
 * Detail object for Viewport custom events.
 */
export interface ViewportEventDetail {
  entry: IntersectionObserverEntry
  direction: ViewportDirection
}

/**
 * Custom event emitted by the directive on enter/leave.
 */
export type ViewportEvent = CustomEvent<ViewportEventDetail>

/**
 * Return value of the useInViewport composable.
 */
export interface UseInViewportReturn {
  /**
   * Boolean ref indicating if the element is currently in the viewport.
   */
  isInView: Ref<boolean>
  /**
   * The current IntersectionObserverEntry, or null if not yet observed.
   */
  entry: Ref<IntersectionObserverEntry | null>
}

/**
 * Interface for the resolved configuration used internally by the directive.
 */
export interface ResolvedConfig {
  options: ViewportOptions
  animationName: string | undefined
  once: boolean
}

declare module 'vue' {
  interface HTMLAttributes {
    onViewEnter?: (event: ViewportEvent) => void
    onViewLeave?: (event: ViewportEvent) => void
  }

  export interface GlobalDirectives {
    vViewport: ViewportOptions | string
  }
}
