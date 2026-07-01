import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    react: 'src/react/index.ts',
    'theme-emotion': 'src/themes/emotion/index.ts',
    'theme-tailwind': 'src/themes/tailwind/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  copy: {
    from: 'src/style.d.ts',
    to: 'dist',
  },
  treeshake: true,
  target: 'es2022',
  deps: {
    neverBundle: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'lexical',
      '@lexical/react',
      '@lexical/extension',
      '@lexical/link',
      '@lexical/table',
      '@lexical/code',
      '@lexical/list',
      '@lexical/rich-text',
      '@lexical/selection',
      '@lexical/utils',
      '@lexical/overflow',
      '@emotion/react',
      '@emotion/css',
      '@emotion/styled',
      '@twreporter/core'
    ],
  },
  css: {
    minify: true,
    transformer: 'postcss',
  }
})
