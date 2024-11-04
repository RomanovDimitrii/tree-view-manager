import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://romanovdimitrii.github.io/tree-view-manager/',
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: '../dist'
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
