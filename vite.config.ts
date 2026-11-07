import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' + HashRouter = works on GitHub Pages under any repo name, no extra config.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});
