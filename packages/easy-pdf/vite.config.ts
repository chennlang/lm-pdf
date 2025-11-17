import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.*', 'src/**/*.stories.*']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EasyPdf',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'recoil'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          recoil: 'Recoil'
        }
      }
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})