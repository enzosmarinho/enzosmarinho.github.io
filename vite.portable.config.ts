import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  css: { postcss: { plugins: [tailwindcss()] } },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  base: './',
  build: {
    outDir: 'portable-dist', emptyOutDir: false,
    lib: { entry: 'portable.tsx', name: 'EnzoPortfolio', formats: ['iife'], fileName: () => 'portfolio.js', cssFileName: 'portfolio' },
  },
});
