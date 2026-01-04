import './css/main.css'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { ViewportPlugin } from '../../../src'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ViewportPlugin)
  },
} satisfies Theme
