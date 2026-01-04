/**
 * @vikeriait/vue-viewport
 *
 * A Vue 3 directive and composable for handling element visibility in the viewport.
 * Features built-in Tailwind and CSS presets for scroll animations.
 *
 * @packageDocumentation
 */

import type { App, Plugin } from 'vue'
import { vViewport } from './directives/vViewport'
import VViewport from './components/VViewport.vue'
import { configurePresets } from './constants'
import type { ViewportPluginOptions } from './types'

export * from './types'
export * from './composables/useInViewport'
export { vViewport, VViewport }

/** @deprecated Use VViewport instead */
export const Viewport = VViewport

export const ViewportPlugin: Plugin = {
  install(app: App, options?: ViewportPluginOptions) {
    if (options?.presets) {
      configurePresets(options.presets)
    }
    app.directive('viewport', vViewport)
    app.component('VViewport', VViewport)
  },
}

export default ViewportPlugin
