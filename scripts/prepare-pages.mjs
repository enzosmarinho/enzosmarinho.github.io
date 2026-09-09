import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const output = resolve('dist/client');
// Only optimized public previews are served. Source recordings stay in public/media.
for (const name of await readdir(join(output, 'media'))) {
  if (name.endsWith('.mp4') && !name.startsWith('preview-')) {
    await rm(join(output, 'media', name));
  }
}
const html = await readFile(join(output, 'index.html'), 'utf8');
if (/chatgpt\.site|http-equiv=["']refresh/i.test(html)) {
  throw new Error('Unexpected legacy hosting reference in the public page.');
}
await writeFile(join(output, '.nojekyll'), '');
await writeFile(join(output, '404.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página não encontrada · Enzo Marinho</title><style>body{margin:0;min-height:100vh;display:grid;place-content:center;background:#221037;color:#f7f4ff;font:20px system-ui;padding:24px}a{color:#c7a6ff}</style><h1>Vamos voltar aos trabalhos?</h1><p>Essa página não está por aqui.</p><a href="/">Conheça o portfólio de Enzo Marinho ↗</a></html>');
console.log('GitHub Pages: static portfolio ready.');
