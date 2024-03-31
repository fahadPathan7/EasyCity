import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],

//   // esbuild: {
//   //   jsxFactory: 'h',
//   //   jsxFragment: 'Fragment',
//   //   // Add the line below to enable CommonJS syntax
//   //   target: 'esnext'
//   // },
// })

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, // Port used by docker container
    strictPort: true,
     watch: {
       usePolling: true
     }
  }
 })