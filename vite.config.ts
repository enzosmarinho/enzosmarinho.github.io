import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// This portfolio exports static files. Development uses Vinext directly;
// a Cloudflare asset worker would serve the GitHub redirect instead of the app.
export default defineConfig({
  appType: 'custom',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext(), sites()],
  server: process.env.CODEX_SANDBOX === 'seatbelt'
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
});
