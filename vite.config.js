import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import commonjs from 'vite-plugin-commonjs'
export default defineConfig({
  plugins: [
    tailwindcss(),
    commonjs(),
  ],
  optimizeDeps: {
    include: ['fabric']
  }
})