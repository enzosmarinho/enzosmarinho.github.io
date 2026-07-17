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
  assert.match(html, /Projetos a partir de <strong>R\$ 890<\/strong>/);
  assert.match(html, /Escopo e prazo antes do sinal/);
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
