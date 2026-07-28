import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("versions/kinetic/kinetic.css");
const js = read("versions/kinetic/kinetic.js");
const dataSource = read("cases.js");
const notFoundHtml = read("404.html");
const context = { window: {} };

vm.runInNewContext(dataSource, context, { filename: "cases.js" });

const profile = context.window.PROFILE;
const projects = [...context.window.CASES, ...context.window.EXTRA_CLIPS];

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

test("the public root is the selected, indexable portfolio", () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<body data-version="kinetic" data-asset-prefix="">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<meta name="robots" content="index,follow">/);
  assert.match(html, /rel="canonical" href="https:\/\/enzosmarinho\.github\.io\/"/);
  assert.match(html, /versions\/kinetic\/kinetic\.css\?v=/);
  assert.match(html, /versions\/kinetic\/kinetic\.js\?v=/);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /noindex|version-switch|Comparar versões/);
});

test("the conversion path is a diagnostic, not a fixed package ladder", () => {
  for (const id of ["provas", "analise", "arquivo", "capacidades", "metodo", "contato"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.ok(html.indexOf('id="provas"') < html.indexOf('id="analise"'));
  assert.ok(html.indexOf('id="analise"') < html.indexOf('id="arquivo"'));
  assert.match(html, /data-diagnostic/);
  assert.match(html, /name="need"/);
  assert.match(html, /name="business"/);
  assert.match(html, /name="timing"/);
  assert.match(html, /name="material"/);
  assert.match(html, /name="approval"/);
  assert.match(html, /Nada é enviado automaticamente/);
  assert.match(js, /Montar meu pedido|Pedido montado/);
  assert.match(js, /encodeURIComponent/);
});

test("public data contains no fixed commercial price", () => {
  assert.doesNotMatch(`${html}\n${js}`, /R\$\s*[\d.]+/);
  assert.doesNotMatch(dataSource, /"price"\s*:/);
  assert.doesNotMatch(dataSource, /"payment"\s*:/);
  assert.equal(profile.services.length, 3);
  assert.ok(profile.services.every((service) => /Sob Medida$/.test(service.title)));
  assert.equal(profile.diagnostic.factors.length, 5);
});

test("work relationships and authorship boundaries stay explicit", () => {
  assert.equal(projects.length, 31);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.ok(!profile.clients.includes("VOTI Software"), "VOTI must not be represented as an independent client");
  assert.equal(projects.filter((project) => project.client === "VOTI Software").length, 13);
  assert.equal(projects.filter((project) => project.client === "Lumiar Parfum").length, 5);
  assert.ok(
    projects
      .filter((project) => project.client === "Negócio Sem Filtro")
      .every((project) => project.category === "edicao"),
    "podcast cuts must be represented as editing and curation, not automation",
  );
  assert.match(js, /Experiência CLT/);
  assert.match(js, /Projeto independente/);
  assert.match(js, /Histórico encerrado/);
});

test("all public projects retain an original link and a real local image", () => {
  for (const project of projects) {
    assert.match(project.permalink, /^https:\/\//, `${project.id} needs an external proof link`);
    const image = project.cardImage || project.thumb || project.poster;
    assert.ok(image, `${project.id} needs an image`);
    assert.ok(fs.existsSync(path.join(root, image)), `missing public image: ${image}`);
    if (project.preview) {
      assert.ok(fs.existsSync(path.join(root, project.preview)), `missing preview: ${project.preview}`);
    }
  }
});

test("motion is purposeful, pausable and reduced-motion safe", () => {
  assert.match(html, /<button class="motion-control"[^>]+data-motion-toggle/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /heroVideo\.pause\(\)/);
  assert.match(js, /heroVideo\.play\(\)\.catch/);
  assert.doesNotMatch(js, /addEventListener\(["']scroll/);
  assert.match(js, /document\.startViewTransition/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\)/);
  assert.doesNotMatch(css, /animation:[^;]*infinite/);
});

test("keyboard, focus and form semantics have an explicit safety contract", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*2\.75rem/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<fieldset>/);
  assert.match(html, /<legend>/);
  assert.match(html, /type="radio"/);
  assert.match(html, /type="submit"/);
  assert.match(html, /aria-pressed="false"/);
});

test("the page is authored, concise and avoids loose punctuation", () => {
  assert.ok(visibleWords(html).length < 950);
  assert.doesNotMatch(html, /[—–]/);
  assert.doesNotMatch(html, /lorem ipsum|revolucionário|solução 360/i);
  assert.match(html, /Sem pacote genérico/);
  assert.match(html, /proposta proporcional|Investimento proporcional/i);
});

test("the static payload remains bounded and every declared root asset exists", () => {
  const references = new Set([
    ...[...html.matchAll(/(?:src|href)="(assets\/[^"?]+)(?:\?[^"]*)?"/g)].map((match) => match[1]),
    ...projects.flatMap((item) => [item.cardImage, item.thumb, item.poster, item.preview]).filter(Boolean),
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
  assert.ok(totalBytes < 12 * 1024 * 1024, `assets exceed 12 MB: ${totalBytes}`);
});

test("the custom 404 remains connected to the public portfolio", () => {
  assert.match(notFoundHtml, /<meta name="robots" content="noindex">/);
  assert.match(notFoundHtml, /assets\/fonts\/anton-latin\.woff2/);
  assert.match(notFoundHtml, /href="\/">Voltar ao portfólio/);
});
