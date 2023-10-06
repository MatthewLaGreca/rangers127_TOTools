import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   exclude: ['agent-base'],
  //   // build: {
  //   //   rollupOptions: {
  //   //     plugins: [commonjs()],
  //   //   },
  //   // },
  //   // transform: {
  //   //   'agent-base': 'node_modules/agent-base/src/index.ts'
  //   // },
  // },
})
