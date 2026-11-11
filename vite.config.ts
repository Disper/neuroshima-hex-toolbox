import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `DISP_PORT` pins the dev/preview server port (parallel worktrees each get
// their own). Unset → Vite's default port.
const port = process.env.DISP_PORT ? Number(process.env.DISP_PORT) : undefined

// `VITE_BASE` lets one source tree build for multiple deploy paths:
//   - Vercel (default):  `/`
//   - GitHub Pages:      `/hex-toolbox/` (see `npm run build:ghpages`).
// The static PWA manifest already uses `start_url: "."` / `scope: "."`, so it
// resolves correctly under either base.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: { port, strictPort: port !== undefined },
  preview: { port, strictPort: port !== undefined },
})
