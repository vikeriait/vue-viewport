import fs from 'node:fs';
import path from 'node:path';

const OUT_PATH = path.resolve('src/styles/presets.css');

const VARS = `
:root {
  --viewport-duration: 0.6s;
  --viewport-ease: ease-out;
  --viewport-distance: 2rem;
  --viewport-scale-in: 0.95;
  --viewport-scale-out: 1.05;
  --viewport-blur: 12px;
}

/* Base transition for all animations */
[data-vp-preset*="animate-"] {
  transition-duration: var(--viewport-duration);
  transition-timing-function: var(--viewport-ease);
}
`;

// Base Animation Definitions
const ANIMATIONS = [
  // FADE
  {
    name: 'fade',
    initial: 'opacity: 0;',
    final: 'opacity: 1;',
    props: 'opacity'
  },
  {
    name: 'fade-up',
    initial: 'opacity: 0; transform: translateY(var(--viewport-distance));',
    final: 'opacity: 1; transform: translateY(0);',
    props: 'opacity, transform'
  },
  {
    name: 'fade-down',
    initial: 'opacity: 0; transform: translateY(calc(var(--viewport-distance) * -1));',
    final: 'opacity: 1; transform: translateY(0);',
    props: 'opacity, transform'
  },
  {
    name: 'fade-left',
    initial: 'opacity: 0; transform: translateX(var(--viewport-distance));',
    final: 'opacity: 1; transform: translateX(0);',
    props: 'opacity, transform'
  },
  {
    name: 'fade-right',
    initial: 'opacity: 0; transform: translateX(calc(var(--viewport-distance) * -1));',
    final: 'opacity: 1; transform: translateX(0);',
    props: 'opacity, transform'
  },
  // SLIDE (No Fade)
  {
    name: 'slide-up',
    initial: 'transform: translateY(var(--viewport-distance));',
    final: 'transform: translateY(0);',
    props: 'transform'
  },
  {
    name: 'slide-down',
    initial: 'transform: translateY(calc(var(--viewport-distance) * -1));',
    final: 'transform: translateY(0);',
    props: 'transform'
  },
  {
    name: 'slide-left',
    initial: 'transform: translateX(var(--viewport-distance));',
    final: 'transform: translateX(0);',
    props: 'transform'
  },
  {
    name: 'slide-right',
    initial: 'transform: translateX(calc(var(--viewport-distance) * -1));',
    final: 'transform: translateX(0);',
    props: 'transform'
  },
  // SCALE
  {
    name: 'scale-up', // (0.95 -> 1)
    initial: 'opacity: 0; transform: scale(var(--viewport-scale-in));',
    final: 'opacity: 1; transform: scale(1);',
    props: 'opacity, transform'
  },
  {
    name: 'scale-down', // (1.05 -> 1)
    initial: 'opacity: 0; transform: scale(var(--viewport-scale-out));',
    final: 'opacity: 1; transform: scale(1);',
    props: 'opacity, transform'
  },
  // BLUR
  {
    name: 'blur-in',
    initial: 'opacity: 0; filter: blur(var(--viewport-blur));',
    final: 'opacity: 1; filter: blur(0);',
    props: 'opacity, filter'
  }
];

let css = `/* AUTO-GENERATED FILE - DO NOT EDIT MANUALLY */\n${VARS}\n`;

ANIMATIONS.forEach(({ name, initial, final, props }) => {
  // Selectors for Initial State
  // Support ONLY Attribute-based (Directive) usage
  const initialSelectors = [
    `[data-vp-preset~="animate-${name}"]`,
    `[data-vp-preset~="animate-${name}-down"][data-vp-entry="down"]`,
    `[data-vp-preset~="animate-${name}-down"][data-vp-pos="below"]`,
    `[data-vp-preset~="animate-${name}-up"][data-vp-entry="up"]`,
    `[data-vp-preset~="animate-${name}-up"][data-vp-pos="above"]`
  ].join(',\n');

  // Selectors for Final State
  const finalSelectors = [
    `[data-vp-preset~="animate-${name}"][data-vp-in-view]`,
    `[data-vp-preset~="animate-${name}-down"][data-vp-entry="down"][data-vp-in-view]`,
    `[data-vp-preset~="animate-${name}-up"][data-vp-entry="up"][data-vp-in-view]`
  ].join(',\n');

  css += `
/* ${name} Group */
${initialSelectors} {
  ${initial}
  transition-property: ${props};
}

${finalSelectors} {
  ${final}
}
`;
});

// Add Smart Presets (Composite)
css += `
/* SMART PRESETS (Composite) */
/* fade-y */
[data-vp-preset~="animate-fade-y"][data-vp-entry="down"],
[data-vp-preset~="animate-fade-y"][data-vp-pos="below"],
[data-vp-preset~="animate-fade-y"][data-vp-entry="up"],
[data-vp-preset~="animate-fade-y"][data-vp-pos="above"] {
  opacity: 0;
  transition-property: opacity, transform;
}

[data-vp-preset~="animate-fade-y"][data-vp-entry="down"],
[data-vp-preset~="animate-fade-y"][data-vp-pos="below"] { transform: translateY(var(--viewport-distance)); }

[data-vp-preset~="animate-fade-y"][data-vp-entry="up"],
[data-vp-preset~="animate-fade-y"][data-vp-pos="above"] { transform: translateY(calc(var(--viewport-distance) * -1)); }

[data-vp-preset~="animate-fade-y"][data-vp-in-view] { opacity: 1; transform: translateY(0); }

/* slide-y */
[data-vp-preset~="animate-slide-y"][data-vp-entry="down"],
[data-vp-preset~="animate-slide-y"][data-vp-pos="below"],
[data-vp-preset~="animate-slide-y"][data-vp-entry="up"],
[data-vp-preset~="animate-slide-y"][data-vp-pos="above"] {
  transition-property: transform;
}

[data-vp-preset~="animate-slide-y"][data-vp-entry="down"],
[data-vp-preset~="animate-slide-y"][data-vp-pos="below"] { transform: translateY(var(--viewport-distance)); }

[data-vp-preset~="animate-slide-y"][data-vp-entry="up"],
[data-vp-preset~="animate-slide-y"][data-vp-pos="above"] { transform: translateY(calc(var(--viewport-distance) * -1)); }

[data-vp-preset~="animate-slide-y"][data-vp-in-view] { transform: translateY(0); }
`;

fs.writeFileSync(OUT_PATH, css);
console.log(`Presets generated at ${OUT_PATH}`);
