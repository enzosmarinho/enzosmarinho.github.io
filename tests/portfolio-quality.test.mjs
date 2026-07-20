import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const notFoundHtml = read("404.html");
const sharedCss = read("versions/shared.css");
const fableCss = read("versions/fable/fable.css");
const sharedJs = read("versions/shared.js");
const fableJs = read("versions/fable/fable.js");
const dataSource = read("cases.js");
const context = { window: {} };

vm.runInNewContext(dataSource, context, { filename: "cases.js" });

const projectLibrary = [...context.window.CASES, ...context.window.EXTRA_CLIPS];
const projectIds = new Set(projectLibrary.map((item) => item.id));
const serviceTitles = new Set(context.window.PROFILE.services.map((service) => service.title));

function visibleWords(source) {
  return source
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

test("the public root is the selected Fable portfolio", () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<body data-version="fable" data-asset-prefix="">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<meta name="robots" content="index,follow">/);
  assert.doesNotMatch(html, /noindex|version-switch|Comparar versões/);
  assert.match(html, /rel="canonical" href="https:\/\/enzosmarinho\.github\.io\/"/);
  assert.match(html, /versions\/shared\.css\?v=20260720-5/);
  assert.match(html, /versions\/fable\/fable\.css\?v=20260720-5/);
  assert.match(html, /versions\/shared\.js\?v=20260720-5/);
  assert.match(html, /versions\/fable\/fable\.js\?v=20260720-5/);
});

test("the public narrative is concise, authored and commercially intentional", () => {
  assert.ok(visibleWords(html).length < 500);
  assert.doesNotMatch(
    `${html}\n${fableJs}`,
    /\b(?:o cliente|a cliente|você|vocês|seu|sua|seus|suas|o Enzo|Enzo fez|eu fiz)\b/i,
  );
  for (const verb of ["Transformo", "Organizo", "Construo", "Entrego", "Leio"]) {
    assert.match(`${html}\n${fableJs}`, new RegExp(`\\b${verb}\\b`, "i"));
  }
  assert.doesNotMatch(html, /R\$\s*[\d.]+/);
  assert.match(html, /Deixo os valores para depois/);
  assert.match(html, /sem criar dependência/);
  assert.match(html, /reduzo o escopo antes de começar/);
});

test("the public information architecture stays complete and ordered", () => {
  for (const id of ["top", "objetivos", "trabalhos", "servicos", "processo", "contato"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.ok(html.indexOf('id="objetivos"') < html.indexOf('id="trabalhos"'));
  assert.ok(html.indexOf('id="trabalhos"') < html.indexOf('id="servicos"'));
  assert.ok(html.indexOf('id="servicos"') < html.indexOf('id="processo"'));
  assert.ok(html.indexOf('id="processo"') < html.indexOf('id="contato"'));
  assert.match(html, /data-motion-toggle/);
  assert.match(html, /class="reel-track js-reel-track"/);
  assert.match(html, /class="proposal-routes js-proposal-routes"/);
});

test("decorative numbering stays out of the selected Fable experience", () => {
  assert.doesNotMatch(html, /fable-heading__count|goal-row__number/);
  assert.doesNotMatch(fableJs, /work-index__number|route\.number|padStart/);
  assert.doesNotMatch(fableCss, /\.fable-heading__count|\.goal-row__number|\.work-index__number/);
});

test("root-relative media resolution works without affecting prototypes", () => {
  assert.match(sharedJs, /dataset\.assetPrefix \?\? "\.\.\/\.\.\/"/);
  assert.match(fableJs, /dataset\.assetPrefix \?\? "\.\.\/\.\.\/"/);
  assert.match(sharedJs, /\$\{assetPrefix\}\$\{escapeHtml\(image\)\}/);
  assert.match(fableJs, /\$\{assetPrefix\}\$\{escapeHtml\(image\)\}/);

  const idLists = [...html.matchAll(/data-items="([^"]+)"/g)];
  for (const [, list] of idLists) {
    for (const id of list.split(",")) {
      assert.ok(projectIds.has(id), `public root references missing project ${id}`);
    }
  }

  for (const title of [...fableJs.matchAll(/services:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]))) {
    assert.ok(serviceTitles.has(title), `public root references missing service ${title}`);
  }
});

test("typography and motion keep the approved safety contracts", () => {
  const css = `${sharedCss}\n${fableCss}`;
  assert.match(sharedCss, /--heading-track:\s*-.03em/);
  assert.match(sharedCss, /--heading-leading:\s*1.04/);
  assert.doesNotMatch(css, /letter-spacing:\s*-\.(?:04|045|05)em/);
  assert.doesNotMatch(css, /transition[^;]*(?:font-size|line-height|letter-spacing)/);
  assert.match(sharedJs, /prefers-reduced-motion: reduce/);
  assert.match(sharedJs, /IntersectionObserver/);
  assert.match(sharedCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(fableCss, /\.method-flow li\s*\{[\s\S]*justify-content:\s*center/);
});

test("all public media and fonts exist within the static payload budget", () => {
  const references = new Set([
    ...[...html.matchAll(/(?:src|href)="(assets\/[^"?]+)(?:\?[^"]*)?"/g)].map((match) => match[1]),
    ...projectLibrary.flatMap((item) => [item.cardImage, item.thumb, item.poster, item.preview]).filter(Boolean),
  ]);

  for (const reference of references) {
    assert.ok(fs.existsSync(path.join(root, reference)), `missing public asset: ${reference}`);
  }

  const stack = [path.join(root, "assets")];
  let totalBytes = 0;
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else totalBytes += fs.statSync(fullPath).size;
    }
  }
  assert.ok(totalBytes < 12 * 1024 * 1024, `assets exceed 12 MB: ${totalBytes} bytes`);
});

test("the custom 404 remains connected to the public portfolio", () => {
  assert.match(notFoundHtml, /<meta name="robots" content="noindex">/);
  assert.match(notFoundHtml, /assets\/fonts\/anton-latin\.woff2/);
  assert.match(notFoundHtml, /href="\/">Voltar ao portfólio/);
});
