import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `VITE_BASE` lets one source tree build for multiple deploy paths:
//   - Vercel (default):  `/`
//   - GitHub Pages:      `/hex-toolbox/` (see `npm run build:ghpages`).
// The static PWA manifest already uses `start_url: "."` / `scope: "."`, so it
// resolves correctly under either base.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
