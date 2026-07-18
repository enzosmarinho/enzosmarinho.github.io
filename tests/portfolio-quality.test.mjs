import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const dataSource = read("cases.js");
const renderSource = read("render.js");

const context = { window: {} };
vm.runInNewContext(dataSource, context, { filename: "cases.js" });
const { PROFILE: profile, CASES: projects, EXTRA_CLIPS: extraClips } = context.window;

function collectAssetReferences(value, output = new Set()) {
  if (typeof value === "string" && value.startsWith("assets/")) output.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collectAssetReferences(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectAssetReferences(item, output));
  return output;
}

function numericPrice(price) {
  const match = String(price).match(/R\$\s*([\d.]+)/);
  return match ? Number(match[1].replaceAll(".", "")) : 0;
}

test("HTML preserves the essential accessibility and SEO contracts", () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, "the home page must have one h1");
  assert.match(html, /class="skip-link" href="#conteudo"/);
  assert.match(html, /<main id="conteudo">/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /rel="canonical" href="https:\/\/enzosmarinho\.github\.io\/"/);
  assert.match(html, /<noscript>[\s\S]*Ver soluções pelo WhatsApp[\s\S]*<\/noscript>/);
  assert.doesNotMatch(html, /id="(?:contact-button|email-link|instagram-link|linkedin-link)" href="#"/);
  assert.match(html, /id="service-status"[^>]+aria-live="polite"/);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML ids must be unique");
  const idSet = new Set(ids);
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]).filter(Boolean);
  for (const anchor of anchors) assert.ok(idSet.has(anchor), `internal anchor #${anchor} must exist`);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch, "JSON-LD must exist");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Person");
  assert.ok(jsonLd.knowsAbout.includes("Automação com inteligência artificial"));
  assert.ok(!jsonLd.sameAs.includes("https://youtube.com/@votigestao"), "corporate channel must not be a Person sameAs");
  assert.equal(jsonLd.email, "mailto:enzo.marinho@hotmail.com");
  assert.doesNotMatch(html, /id="youtube-link"/);
});

test("the client sees the commercial decision before the long portfolio", () => {
  assert.match(html, /Ideias que o cliente/);
  assert.match(html, /Vídeo curto e long-form/);
  assert.match(html, /Roteiro, captação e edição/);
  assert.match(html, /Conteúdo B2B e cortes de podcast/);
  assert.ok(html.indexOf('id="servicos"') < html.indexOf('id="case-principal"'));
  assert.match(html, /Seis ofertas · escopo fechado · preço visível/);
  assert.match(html, /Sem caixa-preta/);
  assert.match(html, /Chamar no WhatsApp/);
});

test("six productized offers have visible, accessible prices and balanced categories", () => {
  assert.equal(profile.services.length, 6);
  assert.deepEqual(
    Object.fromEntries(["conteudo", "presenca", "sistemas"].map((category) => [
      category,
      profile.services.filter((service) => service.category === category).length,
    ])),
    { conteudo: 2, presenca: 2, sistemas: 2 },
  );

  const titles = new Set();
  for (const service of profile.services) {
    assert.ok(service.title && !titles.has(service.title), `service title must be unique: ${service.title}`);
    titles.add(service.title);
    assert.ok(numericPrice(service.price) >= 890, `${service.title} must not undercut the new entry price`);
    assert.ok(service.includes.length >= 5, `${service.title} must show concrete deliverables`);
    assert.ok(service.timeline && service.revisions && service.payment);
  }

  assert.ok(profile.services.some((service) => service.title === "Diagnóstico com Direção" && service.price === "R$ 890"));
  assert.ok(profile.services.some((service) => service.title === "Automação Útil com IA"));
  assert.ok(profile.services.some((service) => service.title === "Landing Page Estratégica"));
  assert.doesNotMatch(dataSource, /"price": "R\$ (690|790|990|1\.290|1\.490|1\.690|2\.490|2\.690|2\.900|3\.500|3\.900)"/);
});

test("recurring and special work is priced above the previous plans", () => {
  const prices = Object.fromEntries(profile.continuity.map((item) => [item.title, numericPrice(item.price)]));
  assert.equal(prices["Operação de Conteúdo"], 2900);
  assert.equal(prices["Operação de Marketing + IA"], 4500);
  assert.equal(prices["Captação em Araçatuba"], 3290);
  assert.equal(prices["Filme de Marca"], 5490);
});

test("service navigation, WhatsApp prefill and resilient rendering stay aligned", () => {
  const tabCategories = [...html.matchAll(/data-service-filter="([^"]+)"/g)].map((match) => match[1]);
  const guideCategories = [...html.matchAll(/data-service-guide="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(tabCategories, ["conteudo", "presenca", "sistemas"]);
  assert.deepEqual(guideCategories, tabCategories);
  assert.match(renderSource, /Investimento anunciado: \$\{service\.price\}/);
  assert.match(renderSource, /encodeURIComponent\(message\)/);
  assert.match(renderSource, /data-clear-work-filter/);
  assert.match(renderSource, /if \(!\("IntersectionObserver" in window\)\)/);
  assert.match(renderSource, /function readMotionPreference\(\)/);
  assert.doesNotMatch(renderSource, /addEventListener\("focus", start\)/);
  assert.match(renderSource, /focus\(\{ preventScroll: true \}\)/);
  assert.match(profile.contact.whatsapp, /5518981196746/);
  assert.equal(profile.contact.email, "enzo.marinho@hotmail.com");
  assert.equal(profile.contact.youtube, undefined);
  assert.match(renderSource, /5518981196746/);
});

test("all referenced local assets exist and stay within the static payload budget", () => {
  const references = collectAssetReferences([profile, projects, extraClips]);
  const htmlReferences = [...html.matchAll(/(?:src|href)="(assets\/[^"?]+)(?:\?[^"]*)?"/g)].map((match) => match[1]);
  htmlReferences.forEach((reference) => references.add(reference));
  for (const reference of references) {
    assert.ok(fs.existsSync(path.join(root, reference)), `missing local asset: ${reference}`);
  }

  const assetRoot = path.join(root, "assets");
  const stack = [assetRoot];
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

test("responsive and motion-sensitive controls keep explicit quality guards", () => {
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.service-grid\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:where\(a, button, summary, \[tabindex\]\):focus-visible/);
  assert.match(css, /min-height: 2\.75rem/);
  assert.match(css, /scrollbar-width:\s*thin/);
  assert.match(css, /\.hero-trust/);
  assert.match(css, /\.service-safety/);
});

test("the approved editorial identity is encoded as a reusable system", () => {
  assert.match(html, /assets\/fonts\/anton-regular\.ttf/);
  assert.match(html, /styles\.css\?v=20260717-8/);
  assert.match(html, /Conteúdo <i aria-hidden="true">·<\/i> sites <i aria-hidden="true">·<\/i> automações úteis/);
  assert.match(css, /font-family:\s*"Anton"/);
  assert.match(css, /--ivory:\s*#f2eee6/);
  assert.match(css, /--coral:\s*#e45b4e/);
  assert.match(css, /--cobalt-deep:\s*#2946a8/);
  assert.match(css, /--aubergine:\s*#5a3a5d/);
  assert.match(css, /\.hero-collage\s*\{[\s\S]*grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.contact h2\s*\{[\s\S]*font-size:\s*clamp\(5rem,\s*8\.5vw,\s*10\.5rem\)/);
  assert.ok(css.lastIndexOf("--primary-bright: var(--coral)") > css.indexOf("--primary-bright: #d7ff45"));
});

test("the selected collage uses real work, restrained conversion colors and no normal resume", () => {
  assert.match(html, /class="hero hero--collage"/);
  assert.equal((html.match(/class="collage-card collage-card--/g) || []).length, 6);
  for (const asset of [
    "assets/hero/negocio-sem-filtro-hd.webp",
    "assets/hero/ADKpionmFiw-hd.webp",
    "assets/hero/qBTk1irwDc4-hd.webp",
    "assets/thumbs/ig_DUf-ODMDWqA.jpg",
    "assets/posters/DQfTWkhiK4k.webp",
    "assets/posters/blYFchVi4xg.webp",
  ]) {
    assert.match(html, new RegExp(asset.replaceAll(".", "\\.")));
  }
  assert.doesNotMatch(html, /Enzo-Marinho-Curriculo-ATS\.pdf|>Versão ATS</);
  assert.doesNotMatch(html.match(/<div class="nav-links">[\s\S]*?<\/div>/)?.[0] || "", /Currículo/);
  assert.match(html, /id="showcase-toggle"[^>]+aria-pressed="false"/);
  assert.match(renderSource, /function bindShowcaseToggle\(\)/);
  assert.match(renderSource, /viewport\.classList\.toggle\("is-paused"/);
  assert.match(renderSource, /function observeAmbientVideos\(root = document\)/);
  assert.match(renderSource, /dataset\.ambientVideo = "true"/);
  assert.match(renderSource, /document\.documentElement\.classList\.toggle\("showcase-paused"/);
  assert.match(css, /animation:\s*tape-scroll 44s linear infinite/);
  assert.match(css, /\.service-safety,\s*\n\.service-safety span\s*\{[\s\S]*color:\s*rgba\(10,\s*10,\s*12,\s*\.68\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*grid-auto-flow:\s*column/);
});

test("the proof rail contains ten motion-ready real projects behind one reliable pause control", () => {
  const proofBlock = renderSource.match(/function renderProofTape\(\)[\s\S]*?function renderFlagship\(\)/)?.[0] || "";
  const preferredSource = proofBlock.match(/const preferred = (\[[^;]+\]);/)?.[1];
  assert.ok(preferredSource, "proof rail preferred IDs must be explicit");

  const preferredIds = JSON.parse(preferredSource);
  assert.equal(preferredIds.length, 10);
  assert.equal(new Set(preferredIds).size, preferredIds.length, "proof rail IDs must be unique");

  const library = [...projects, ...extraClips];
  for (const id of preferredIds) {
    const item = library.find((candidate) => candidate.id === id);
    assert.ok(item, `proof rail item must exist: ${id}`);
    assert.ok(item.preview, `proof rail item must have a moving preview: ${id}`);
    assert.ok(fs.existsSync(path.join(root, item.preview)), `proof rail preview must exist: ${item.preview}`);
  }

  assert.match(html, /id="showcase-toggle"[^>]+aria-label="Pausar faixa e vídeos"/);
  assert.match(renderSource, /ambientVideoObserver = new IntersectionObserver/);
  assert.match(renderSource, /if \(paused\) ambientVisibleMedia\.forEach\(pauseAmbientVideo\)/);
  assert.match(renderSource, /else syncAmbientVideos\(\)/);
  assert.match(css, /html\.showcase-paused \.proof-tape__track/);
});

test("the work taxonomy keeps locations, clients and ranked public examples truthful", () => {
  const library = [...projects, ...extraClips];
  assert.equal(library.filter((item) => item.client === "8848 Jiu-Jitsu").length, 1);
  assert.equal(library.find((item) => item.id === "qBTk1irwDc4")?.client, "VOTI Software");
  assert.match(library.find((item) => item.id === "qBTk1irwDc4")?.direction || "", /Catvi foi o local da gravação, não minha contratante/);
  assert.match(library.find((item) => item.id === "DKkdTYyItAy")?.direction || "", /Catvi foi o local da gravação, não minha contratante/);
  assert.doesNotMatch(html, /VOTI × Catvi|collage-card--price|<strong>R\$ 890<\/strong>/);
  assert.equal(library.filter((item) => item.client === "Negócio Sem Filtro").length, 7);
  assert.match(renderSource, /const PROJECT_RANKING = \[[\s\S]*"ADKpionmFiw"[\s\S]*"DQfTWkhiK4k"[\s\S]*"blYFchVi4xg"/);
});
