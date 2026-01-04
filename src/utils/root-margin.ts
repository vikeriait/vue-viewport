/**
 * Parses Tailwind classes to determine intelligent margins.
 * Handles prefixes like 'below:' and 'above:' for asymmetric margins.
 */
function parseTailwindMargins(className: string): { top: number; bottom: number } {
  let top = 0
  let bottom = 0
  const regex =
    /(?:(?<prefix>[a-z0-9:-]+):)?(?<neg>-)?translate-y-(?:\[(?<arb>[^\]]+)\]|(?<num>\d+))/gi

  let match
  while ((match = regex.exec(className)) !== null) {
    const { prefix, arb, num } = match.groups || {}

    let px = 0
    if (arb) {
      if (arb.endsWith('px')) px = parseFloat(arb)
      else if (arb.endsWith('rem')) px = parseFloat(arb) * 16
    } else if (num) {
      px = parseInt(num, 10) * 4
    }

    if (px > 0) {
      const margin = Math.ceil(px + 10)
      const isBelow = prefix && prefix.includes('below')
      const isAbove = prefix && prefix.includes('above')

      if (isBelow) bottom = Math.max(bottom, margin)
      else if (isAbove) top = Math.max(top, margin)
      else {
        top = Math.max(top, margin)
        bottom = Math.max(bottom, margin)
      }
    }
  }
  return { top, bottom }
}

/**
 * Checks if the animation name implies movement and reads the global CSS variable.
 */
function checkPresetHeuristics(
  el: HTMLElement,
  animationName?: string,
): { top: number; bottom: number } {
  const nameHasMovement =
    animationName &&
    (animationName.includes('slide') ||
      (animationName.includes('fade-') && !animationName.includes('fade-in')) ||
      animationName.includes('scale'))

  if (nameHasMovement) {
    try {
      const style = getComputedStyle(el)
      const value = style.getPropertyValue('--viewport-distance').trim()

      if (value) {
        let presetPx = 0
        if (value.endsWith('px')) presetPx = parseFloat(value)
        else if (value.endsWith('rem')) presetPx = parseFloat(value) * 16

        const margin = Math.ceil(presetPx)
        return { top: margin, bottom: margin }
      }
    } catch {}
  }
  return { top: 0, bottom: 0 }
}

/**
 * Checks the computed style matrix for any active transforms (inline or custom CSS).
 */
function checkComputedMatrix(el: HTMLElement): { top: number; bottom: number } {
  try {
    const style = getComputedStyle(el)
    const transform = style.transform

    if (transform && transform !== 'none') {
      const matrix = transform.match(/^matrix\((.+)\)$/)
      if (matrix) {
        const values = matrix[1].split(',').map(parseFloat)
        if (values.length === 6) {
          const ty = Math.abs(values[5])
          const tx = Math.abs(values[4])
          const maxShift = Math.max(tx, ty)

          if (maxShift > 0) {
            const margin = Math.ceil(maxShift)
            return { top: margin, bottom: margin }
          }
        }
      }
    }
  } catch {}
  return { top: 0, bottom: 0 }
}

/**
 * Computes the optimal rootMargin for the IntersectionObserver.
 * Combines Tailwind parsing, Preset heuristics, and Computed Styles to detect
 * transforms and compensate for them, preventing "blank space" or early/late triggers.
 */
export function computeDefaultRootMargin(el: HTMLElement, animationName?: string): string {
  // 1. Tailwind Classes (Highest priority for precision & asymmetry)
  const tw = parseTailwindMargins(el.className)
  if (tw.top > 0 || tw.bottom > 0) {
    return `${tw.top}px 0px ${tw.bottom}px 0px`
  }

  // 2. Preset Heuristics (Standard presets)
  const preset = checkPresetHeuristics(el, animationName)
  if (preset.top > 0 || preset.bottom > 0) {
    return `${preset.top}px 0px ${preset.bottom}px 0px` // Typically symmetric
  }

  // 3. Computed Matrix (Fallback for inline styles/custom CSS)
  const matrix = checkComputedMatrix(el)
  if (matrix.top > 0 || matrix.bottom > 0) {
    return `${matrix.top}px 0px ${matrix.bottom}px 0px`
  }

  return '0px'
}
