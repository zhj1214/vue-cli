import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig, ConfigEnv } from 'vite'
import eruda from 'vite-plugin-eruda'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }: ConfigEnv) => {
  return {
    base: './',
    plugins: [
      uni(),
      eruda(),
      visualizer(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: [
          'es.symbol',
          'es.array.filter',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.for-each',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      })
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src'
        },
        {
          find: '@assets',
          replacement: '/src/assets'
        },
        {
          find: '@utils',
          replacement: '/src/utils'
        },
        {
          find: '@components',
          replacement: '/src/components'
        },
        {
          find: '@views',
          replacement: '/src/views'
        },
        {
          find: '@store',
          replacement: '/src/store'
        }
      ]
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将pinia的全局库实例打包进vendor，避免和页面一起打包造成资源重复引入
            if (id.includes(path.resolve(__dirname, '/src/store/index.ts'))) {
              return 'vendor'
            }
          }
        }
      }
    }
  }
})
