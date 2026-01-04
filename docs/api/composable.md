# useInViewport

A reactive composable that exposes the IntersectionObserver API with a Vue-friendly interface.

## Usage

```typescript
import { ref } from 'vue'
import { useInViewport } from '@vikeriait/vue-viewport'

const target = ref(null)
const { isInView, entry } = useInViewport(target, {
  threshold: 0.5,
})
```

```html
<template>
  <div ref="target">Am I visible? {{ isInView }}</div>
</template>
```

## Type Definition

```typescript
function useInViewport(
  target: Ref<HTMLElement | null>,
  options?: IntersectionObserverInit,
): {
  isInView: Ref<boolean>
  entry: Ref<IntersectionObserverEntry | null>
}
```

### Parameters

- **`target`**: A Vue `ref` pointing to the DOM element to observe.
- **`options`**: Standard `IntersectionObserverInit` object.
  - `root`: The element that is used as the viewport for checking visibility of the target.
  - `rootMargin`: Margin around the root.
  - `threshold`: Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed.
