import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const pageNames = ["editorial", "showreel", "direcao", "fable"];
const pages = Object.fromEntries(pageNames.map((name) => [
  name,
  read(`versions/${name}/index.html`),
]));
const chooser = read("versions/index.html");
const sharedCss = read("versions/shared.css");
const sharedJs = read("versions/shared.js");
const fableCss = read("versions/fable/fable.css");
const fableJs = read("versions/fable/fable.js");
const dataSource = read("cases.js");
const context = { window: {} };
vm.runInNewContext(dataSource, context, { filename: "cases.js" });
const projectIds = new Set([
  ...context.window.CASES.map((item) => item.id),
  ...context.window.EXTRA_CLIPS.map((item) => item.id),
]);
const projectLibrary = [...context.window.CASES, ...context.window.EXTRA_CLIPS];
const serviceTitles = new Set(context.window.PROFILE.services.map((service) => service.title));

function visibleWords(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

test("four complete portfolio versions and one comparison page exist", () => {
  for (const name of pageNames) {
    const html = pages[name];
    assert.match(html, /<html lang="pt-BR">/);
    assert.match(html, new RegExp(`<body data-version="${name}">`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${name} must have exactly one h1`);
    assert.match(html, /class="skip-link" href="#conteudo"/);
    assert.match(html, /<main id="conteudo">/);
    assert.match(html, /rel="icon" type="image\/jpeg"/);
    assert.match(
      html,
      name === "fable"
        ? /class="nav-cta"[^>]+aria-label="Conversar pelo WhatsApp"/
        : /class="nav-cta"[^>]+aria-label="Falar no WhatsApp"/,
    );
    assert.doesNotMatch(html, /class="version-switch"[^>]+aria-label=/);
    for (const id of ["objetivos", "trabalhos", "servicos", "processo", "contato"]) {
      assert.match(html, new RegExp(`id="${id}"`), `${name} must include #${id}`);
    }
    assert.match(html, /data-motion-toggle/);
    assert.match(html, /class="reel-track js-reel-track"/);
    assert.match(html, /class="version-switch"/);
    assert.match(html, /rel="preload" as="image"[^>]+fetchpriority="high"/);
  }

  assert.equal((chooser.match(/class="version-card(?:\s[^"]*)?"/g) || []).length, 4);
  for (const name of pageNames) assert.match(chooser, new RegExp(`href="${name}/"`));
});

test("versions are concise and avoid loose editorial typography", () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.ok(visibleWords(html).length < 650, `${name} must stay below 650 visible words`);
    assert.doesNotMatch(html, /[—–]/, `${name} must not use em or en dashes`);
    assert.doesNotMatch(html, /TRABALHO REAL, COLADO NO PORTFÓLIO/i);
    assert.doesNotMatch(html, /currículo/i);
  }

  const positiveSpacing = [...sharedCss.matchAll(/letter-spacing:\s*([.\d]+)em/g)]
    .map((match) => Number(match[1]));
  assert.ok(positiveSpacing.every((value) => value <= 0.055), "positive letter spacing must stay tightly bounded");
  assert.match(sharedCss, /\.hero h1[\s\S]*letter-spacing:\s*-.018em/);
  assert.match(sharedCss, /--accent:\s*#b13a33/);
});

test("the moving video strip has no visual title boxes", () => {
  const reelTemplate = sharedJs.match(/class="reel-card[\s\S]*?<\/a>/)?.[0] || "";
  assert.match(reelTemplate, /aria-label="Abrir/);
  assert.doesNotMatch(reelTemplate, /<strong|<h3|<p|class="[^"]*(?:title|copy|caption|label)/);
  assert.doesNotMatch(sharedCss, /\.reel-card__(?:title|copy|caption|label)/);
});

test("every version carries the complete VOTI reel plus varied flagship work", () => {
  const votiPreviewIds = projectLibrary
    .filter((item) => item.client === "VOTI Software" && item.preview)
    .map((item) => item.id);
  assert.equal(votiPreviewIds.length, 13);

  for (const [name, html] of Object.entries(pages)) {
    const list = html.match(/class="reel-track js-reel-track" data-items="([^"]+)"/)?.[1].split(",") || [];
    assert.equal(list.length, 18, `${name} reel must carry 18 projects`);
    assert.equal(new Set(list).size, 18, `${name} reel projects must be unique`);
    for (const id of votiPreviewIds) {
      assert.ok(list.includes(id), `${name} reel must include VOTI project ${id}`);
    }
    const selected = list.map((id) => projectLibrary.find((item) => item.id === id));
    assert.ok(selected.every((item) => item?.preview), `${name} reel items must all have moving previews`);
    assert.ok(selected.filter((item) => item.orientation === "landscape").length >= 2, `${name} reel must vary formats`);
    for (const item of selected) {
      assert.ok(fs.existsSync(path.join(root, item.preview)), `missing reel preview: ${item.preview}`);
    }
  }
});

test("typography and spatial contracts prevent the reported collisions", () => {
  const versionCss = `${sharedCss}\n${fableCss}\n${read("versions/chooser.css")}`;
  assert.doesNotMatch(versionCss, /font-size:\s*\.(?:[0-6]\d|7[0-4])rem/);
  assert.doesNotMatch(versionCss, /letter-spacing:\s*-\.(?:04|045|05)em/);
  assert.doesNotMatch(versionCss, /transition[^;]*(?:font-size|line-height|letter-spacing)/);
  assert.match(sharedCss, /ul,\s*\nol\s*\{[\s\S]*list-style:\s*none/);
  assert.match(sharedCss, /--heading-track:\s*-.03em/);
  assert.match(sharedCss, /--heading-leading:\s*1.04/);
  assert.match(sharedCss, /\.section-heading h2\s*\{[\s\S]*font-family:\s*var\(--body\)[\s\S]*line-height:\s*var\(--heading-leading\)/);
  assert.match(sharedCss, /\.faq\s*\{[\s\S]*width:\s*var\(--shell\)/);
  assert.match(fableCss, /\.method-lead h2\s*\{[\s\S]*font-family:\s*var\(--body\)[\s\S]*line-height:\s*var\(--heading-leading\)/);
  assert.match(fableCss, /\.fable-contact h2\s*\{[\s\S]*font-family:\s*var\(--body\)[\s\S]*line-height:\s*1.04/);
  assert.match(pages.showreel, /Mande a<\/span> <span class="contact-line contact-line--nowrap">matéria-prima\./);
  assert.match(chooser, /Quatro caminhos\.<\/span> <span>Uma assinatura\./);
  assert.match(sharedCss, /--shell:\s*min\(112rem/);
});

test("public versions keep commercial values for the conversation", () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.doesNotMatch(html, /R\$\s*[\d.]+/, `${name} must not expose a numeric price`);
  }
  assert.doesNotMatch(sharedJs, /service\.price|Investimento anunciado/);
  assert.doesNotMatch(fableJs, /service\.price|R\$\s*[\d.]+/);
  assert.ok(context.window.PROFILE.services.every((service) => /^R\$/.test(service.price)), "approved prices must remain stored in data");
});

test("the Fable cut removes decorative numbering and speaks with authored first-person verbs", () => {
  assert.doesNotMatch(pages.fable, /fable-heading__count|goal-row__number/);
  assert.doesNotMatch(fableJs, /work-index__number|route\.number|padStart/);
  assert.doesNotMatch(
    `${pages.fable}\n${fableJs}`,
    /\b(?:o cliente|a cliente|você|vocês|seu|sua|seus|suas|o Enzo|Enzo fez|eu fiz)\b/i,
  );
  for (const verb of ["Transformo", "Organizo", "Construo", "Entrego", "Leio"]) {
    assert.match(`${pages.fable}\n${fableJs}`, new RegExp(`\\b${verb}\\b`, "i"));
  }
  assert.match(fableCss, /\.method-flow\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(fableCss, /\.method-flow li\s*\{[\s\S]*justify-content:\s*center/);
  assert.match(fableCss, /\.fable-contact \.contact-meta\s*\{[\s\S]*margin-top:\s*clamp/);
});

test("motion is bounded, pausable and respects reduced motion", () => {
  assert.match(sharedJs, /prefers-reduced-motion: reduce/);
  assert.match(sharedJs, /video\.pause\(\)/);
  assert.match(sharedJs, /video\.play\(\)\.catch/);
  assert.match(sharedCss, /\.motion-paused \.reel-track/);
  assert.match(sharedCss, /\.reel-viewport:focus-within \.reel-track/);
  assert.match(sharedCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(sharedCss, /\.reel-track\s*\{[\s\S]*?will-change:/);
  assert.doesNotMatch(sharedJs, /addEventListener\(["']scroll/);
  assert.match(sharedJs, /IntersectionObserver/);
  assert.match(sharedJs, /\? 3 : 6/);
  assert.match(sharedJs, /function prepareMotionGroups\(\)/);
  assert.match(sharedJs, /function bindActiveNavigation\(\)/);
  assert.match(sharedJs, /function signalPageReady\(\)/);
  assert.match(sharedJs, /data-viewport-playback/);
  assert.match(sharedJs, /preload="\$\{autoplay \? "metadata" : "none"\}"/);
  assert.match(fableJs, /IntersectionObserver/);
  assert.doesNotMatch(fableJs, /addEventListener\(["']scroll/);
  assert.match(fableCss, /@media \(prefers-reduced-motion: reduce\)/);
});

test("all configured projects and services resolve against verified content", () => {
  for (const [name, html] of Object.entries(pages)) {
    const idLists = [...html.matchAll(/data-items="([^"]+)"/g)];
    for (const [, list] of idLists) {
      for (const id of list.split(",")) {
        assert.ok(projectIds.has(id), `${name} references missing project ${id}`);
      }
    }
    const serviceLists = [...html.matchAll(/data-services="([^"]+)"/g)];
    for (const [, list] of serviceLists) {
      for (const title of list.split(",")) {
        assert.ok(serviceTitles.has(title), `${name} references missing service ${title}`);
      }
    }
  }

  for (const title of [...fableJs.matchAll(/services:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]))) {
    assert.ok(serviceTitles.has(title), `fable references missing service ${title}`);
  }
});

test("comparison preview assets exist", () => {
  const references = [...chooser.matchAll(/src="\.\.\/(assets\/[^"]+)"/g)].map((match) => match[1]);
  assert.ok(references.length >= 8);
  for (const reference of references) {
    assert.ok(fs.existsSync(path.join(root, reference)), `missing comparison asset: ${reference}`);
  }
});
