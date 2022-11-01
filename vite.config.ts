import uni from "@dcloudio/vite-plugin-uni";
import { defineConfig, ConfigEnv } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }: ConfigEnv) => {
  return {
    base: './',
    plugins: [
      uni()
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src'
        },
        {
          find: '@assets',
          replacement: './src/assets/'
        },
        {
          find: '@utils',
          replacement: './src/utils/'
        },
        {
          find: '@components',
          replacement: './src/components/'
        },
        {
          find: '@views',
          replacement: './src/views/'
        },
        {
          find: '@store',
          replacement: './src/store/'
        }
      ]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将pinia的全局库实例打包进vendor，避免和页面一起打包造成资源重复引入
            if (id.includes(path.resolve(__dirname, '/src/store/index.ts'))) {
              return 'vendor';
            }
          }
        }
      }
    }
  };
});

