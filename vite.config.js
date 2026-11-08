import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `vite build --mode demo` -> static build for /demos/tic-tac-toe/ (see demo/inject-banner.mjs)
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'demo' ? '/demos/tic-tac-toe/' : '/',
  build: { outDir: mode === 'demo' ? 'dist-demo' : 'dist' },
}))
