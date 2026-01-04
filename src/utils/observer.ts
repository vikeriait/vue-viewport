type ObserverCallback = (entry: IntersectionObserverEntry) => void

export interface ObserverInstance {
  observer: IntersectionObserver
  elements: Map<HTMLElement, ObserverCallback>
  root: Element | Document | null
  key: string
}

class ObserverManager {
  private roots = new Map<Element | Document | null, Map<string, ObserverInstance>>()

  /**
   * Generates a unique key for the observer options.
   */
  private getOptionsKey(rootMargin: string, threshold: number | number[]): string {
    const t = Array.isArray(threshold) ? [...threshold].sort().join(',') : threshold
    return `${rootMargin}|${t}`
  }

  /**
   * Starts observing an element.
   * Reuse an existing observer if one exists with the exact same options.
   */
  observe(
    el: HTMLElement,
    options: IntersectionObserverInit,
    callback: ObserverCallback,
  ): ObserverInstance {
    const root = options.root || null
    const rootMargin = options.rootMargin || '0px'
    const threshold = options.threshold ?? 0

    // 1. Get or Initialize the Map for this specific root
    if (!this.roots.has(root)) {
      this.roots.set(root, new Map())
    }
    const rootMap = this.roots.get(root)!

    // 2. Generate key for these specific options
    const key = this.getOptionsKey(rootMargin, threshold)

    // 3. Get or Create the Observer Instance
    let instance = rootMap.get(key)
    if (!instance) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement
            // Retrieve the callback specifically for this observer instance
            // This allows multiple observers to watch the same element with different callbacks
            const cb = instance?.elements.get(target)
            if (cb) cb(entry)
          })
        },
        {
          root,
          rootMargin,
          threshold,
        },
      )

      instance = {
        observer,
        elements: new Map(),
        root,
        key,
      }
      rootMap.set(key, instance)
    }

    // 4. Observe
    instance.observer.observe(el)
    instance.elements.set(el, callback)

    return instance
  }

  /**
   * Stops observing an element for a specific observer instance.
   */
  unobserve(instance: ObserverInstance, el: HTMLElement) {
    instance.observer.unobserve(el)
    instance.elements.delete(el)

    // Cleanup if empty
    if (instance.elements.size === 0) {
      instance.observer.disconnect()

      const rootMap = this.roots.get(instance.root)
      if (rootMap) {
        rootMap.delete(instance.key)
        if (rootMap.size === 0) {
          this.roots.delete(instance.root)
        }
      }
    }
  }
}

export const observerManager = new ObserverManager()
