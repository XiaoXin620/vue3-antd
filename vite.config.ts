import { resolve } from 'node:path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      dts: 'types/components.d.ts',
      resolvers: [
        AntDesignVueResolver({
          importStyle: false //css in js
        })
      ]
    }),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      dts: 'types/auto-import.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['lodash-es']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/zhongben-admin': {
        target: 'http://101.43.158.22:8006/zhongben-admin'
      }
    }
  }

})
