import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Relative base so the build also works from a file:// or Android WebView asset origin.
export default defineConfig({
  base: './',
  plugins: [preact()],
  build: { target: 'es2020', chunkSizeWarningLimit: 3000 },
  server: { host: true },
});
