import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd();
const out=path.resolve(process.argv[2]||'../public-release');
// Explicit allowlist prevents repo notes, git metadata and private drafts from shipping.
const files=['index.html','404.html','cases.js','studio.html','studio.css','studio.js','_headers','_redirects',
  'versions/kinetic/kinetic.css','versions/kinetic/kinetic.js',
  'versions/kinetic/vortex.css','versions/kinetic/vortex.js','versions/kinetic/index.html'];
const assetExtensions=new Set(['.woff2','.svg','.png','.webp','.jpg','.jpeg','.mp4','.pdf','.docx']);
function walk(dir) {
  for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})) {
    const rel=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(rel);
    else if(assetExtensions.has(path.extname(entry.name).toLowerCase())) files.push(rel);
  }
}
walk('assets');
assert.ok(!fs.existsSync(out),'Output must be a new directory; no deletion or stale overlay.');
const receipt=[];
for(const rel of files) {
  const source=path.join(root,rel);
  const bytes=fs.statSync(source).size;
  assert.ok(bytes<25*1024*1024,`Pages file limit exceeded: ${rel}`);
  const dest=path.join(out,rel);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(source,dest);
  receipt.push({file:rel.replaceAll('\\','/'),bytes});
}
assert.ok(receipt.length<20000);
console.log(JSON.stringify({status:'PUBLIC_PACKAGE_VERIFIED',directory:out,files:receipt.length,
  bytes:receipt.reduce((a,b)=>a+b.bytes,0),largest:receipt.toSorted((a,b)=>b.bytes-a.bytes).slice(0,3)},null,2));
