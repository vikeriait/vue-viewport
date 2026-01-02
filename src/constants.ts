/**
 * Base animation names defined in presets.css
 */
const BASE_ANIMATIONS = [
  'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right',
  'slide-up', 'slide-down', 'slide-left', 'slide-right',
  'scale-up', 'scale-down', 'blur-in',
  'fade-y', 'slide-y'
]

/**
 * Default animation presets mapping short names to Tailwind utility classes.
 * Includes automatically generated -up and -down variants for each base animation.
 */
export const DEFAULT_PRESETS: Record<string, string> = BASE_ANIMATIONS.reduce((acc, name) => {
  acc[name] = `animate-${name}`
  
  // Smart presets ending in -y already handle direction, no need for sub-modifiers
  if (!name.endsWith('-y')) {
    acc[`${name}-up`] = `animate-${name}-up`
    acc[`${name}-down`] = `animate-${name}-down`
  }
  
  return acc
}, {} as Record<string, string>)

/**
 * The currently active presets, initialized with defaults.
 * Can be modified via configurePresets.
 */
export const ACTIVE_PRESETS = { ...DEFAULT_PRESETS }

/**
 * Configures the active presets by merging custom presets.
 * @param customPresets - A record of preset names to CSS classes.
 */
export function configurePresets(customPresets: Record<string, string>) {
  Object.assign(ACTIVE_PRESETS, customPresets)
}
