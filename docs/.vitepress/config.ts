import { defineConfig } from 'vitepress'
import { resolve } from 'path'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  title: 'Vue Viewport',
  description: 'Performance-focused viewport detection & animations for Vue 3',

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },

  head: [['link', { rel: 'icon', href: '/logo.svg' }]],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
    ],

    sidebar: [
      {
        text: 'Guide',
        collapsed: false,
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Tailwind Variants', link: '/guide/tailwind' },
        ],
      },
      {
        text: 'Presets',
        collapsed: false,
        items: [{ text: 'Animations', link: '/guide/animations' }],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Directive & Component', link: '/api/directive' },
          { text: 'Composable', link: '/api/composable' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vikeriait/vue-viewport' }],
  },

  vite: {
    plugins: [groupIconVitePlugin(), tailwindcss()],

    resolve: {
      alias: {
        // Alias to use the source directly in examples
        '@': resolve(__dirname, '../../src'),
        'vue-viewport': resolve(__dirname, '../../src/index.ts'),
      },
    },
  },

  sitemap: {
    hostname: 'https://vue-viewport.vikeria.it',
  },

  lastUpdated: true,
})
