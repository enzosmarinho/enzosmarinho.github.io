import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// Portable static export, published directly by GitHub Pages.
export default defineConfig({
  appType: 'custom',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
  server: process.env.CODEX_SANDBOX === 'seatbelt'
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
});
