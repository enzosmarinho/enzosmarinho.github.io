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
const kineticRouteHtml = read("versions/kinetic/index.html");
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

test("the public root is the selected, indexable ultimate portfolio", () => {
  assert.match(html, /<html lang="pt-BR" class="motion-paused">/);
  assert.match(html, /<body data-version="ultimate" data-asset-prefix="">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<span>ENZO MARINHO<\/span>/);
  assert.match(html, /data-hero-wall/);
  assert.match(html, /<meta name="robots" content="index,follow">/);
  assert.match(html, /rel="canonical" href="https:\/\/enzosmarinho\.github\.io\/"/);
  assert.match(html, /versions\/kinetic\/kinetic\.css\?v=/);
  assert.match(html, /versions\/kinetic\/kinetic\.js\?v=/);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /noindex|version-switch|Comparar versões/);
});

test("proof leads the narrative and the diagnostic closes it", () => {
  for (const id of ["provas", "formatos", "capacidades", "arquivo", "metodo", "analise", "contato"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.ok(html.indexOf('id="provas"') < html.indexOf("Não é uma coleção de peças soltas."));
  assert.ok(html.indexOf("Não é uma coleção de peças soltas.") < html.indexOf('id="formatos"'));
  assert.ok(html.indexOf('id="provas"') < html.indexOf('id="formatos"'));
  assert.ok(html.indexOf('id="formatos"') < html.indexOf('id="arquivo"'));
  assert.ok(html.indexOf('id="arquivo"') < html.indexOf('id="analise"'));
  assert.match(html, /Marketing de dentro da operação/);
  assert.match(html, /data-kayky-case/);
  assert.match(html, /data-nsf-case/);
  assert.match(js, /Prova: VOTI/);
  assert.match(js, /Prova: Kayky Pitondo/);
  assert.match(js, /Prova: Negócio Sem Filtro/);
});

test("the conversion path is proportional and never a fixed package ladder", () => {
  assert.match(html, /data-diagnostic/);
  assert.match(html, /data-diagnostic-draft-wrap/);
  assert.match(html, /data-diagnostic-link/);
  assert.match(html, /data-diagnostic-level/);
  assert.match(html, /data-diagnostic-priorities/);
  assert.match(html, /Abrir no WhatsApp/);
  for (const name of ["need", "business", "timing", "material", "approval", "reference", "outcome"]) {
    assert.match(html, new RegExp(`name="${name}"`));
  }
  assert.match(html, /Nada é enviado automaticamente/);
  assert.match(html, /Empresas diferentes não recebem a mesma proposta/);
  assert.match(html, /Investimento proporcional/);
  assert.match(js, /Pedido preparado/);
  assert.match(js, /Rascunho atualizado/);
  assert.match(js, /data-diagnostic-link/);
  assert.match(js, /analyzeRequest/);
  assert.match(js, /Projeto enxuto, com decisão direta/);
  assert.match(js, /Operação em crescimento, com escopo coordenado/);
  assert.match(js, /Operação estruturada, com mais dependências/);
  assert.match(css, /@supports selector\(\.diagnostic:has\(\*\)\)/);
  assert.match(css, /grid-template-areas:\s*"assessment label"/);
  assert.match(js, /encodeURIComponent/);
  assert.doesNotMatch(js, /window\.open/);
  assert.doesNotMatch(js, /bloqueou a nova aba/);
  assert.doesNotMatch(`${html}\n${js}`, /R\$\s*[\d.]+/);
  assert.doesNotMatch(dataSource, /"(?:price|payment)"\s*:/);
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
  assert.match(js, /Trabalho atual/);
  assert.match(js, /Projeto independente/);
  assert.match(js, /Histórico encerrado/);
  assert.doesNotMatch(`${html}\n${js}`, /data-ai-roles|renderAiRoles/);
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

test("the hero video wall is optimized, pausable and progressively enhanced", () => {
  const heroIdsBlock = js.match(/const HERO_IDS = \[([\s\S]*?)\];/)?.[1] || "";
  const heroIds = [...heroIdsBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const heroItems = heroIds.map((id) => projects.find((project) => project.id === id));
  assert.equal(heroIds.length, 12, "desktop hero must document twelve real works");
  assert.equal(new Set(heroIds).size, heroIds.length, "hero work IDs must be unique");
  assert.ok(heroItems.every(Boolean), "every hero ID must resolve to a real portfolio project");
  assert.ok(heroItems.every((item) => item.preview), "every selected hero work must have real motion footage");
  assert.equal(heroItems.filter((item) => item.client === "VOTI Software").length, 6);
  assert.equal(heroItems.filter((item) => item.client === "Kayky Pitondo").length, 3);
  assert.equal(heroItems.filter((item) => item.client === "Negócio Sem Filtro").length, 1);
  assert.equal(
    heroItems.filter((item) => !["VOTI Software", "Kayky Pitondo", "Negócio Sem Filtro"].includes(item.client)).length,
    2,
  );
  const mobileHeroItems = heroItems.slice(0, 9);
  assert.equal(mobileHeroItems.filter((item) => item.client === "VOTI Software").length, 4);
  assert.equal(mobileHeroItems.filter((item) => item.client === "Kayky Pitondo").length, 3);
  assert.equal(mobileHeroItems.filter((item) => item.client === "Negócio Sem Filtro").length, 1);
  assert.equal(
    mobileHeroItems.filter((item) => !["VOTI Software", "Kayky Pitondo", "Negócio Sem Filtro"].includes(item.client)).length,
    1,
  );
  const votiPriorityIds = [...(js.match(/const priority = \[([\s\S]*?)\];/)?.[1] || "").matchAll(/"([^"]+)"/g)]
    .map((match) => match[1]);
  assert.ok(
    heroItems.filter((item) => item.client === "VOTI Software").every((item) => votiPriorityIds.includes(item.id)),
    "every VOTI hero video must reappear in the VOTI proof section",
  );
  assert.deepEqual(
    heroItems.filter((item) => item.client === "Kayky Pitondo").map((item) => item.id).sort(),
    ["ADKpionmFiw", "DZGeYPdBiet", "DZUo3jokhkP"].sort(),
  );
  assert.deepEqual(
    heroItems.filter((item) => item.client === "Negócio Sem Filtro").map((item) => item.id),
    ["DaBe_RIhl06"],
  );

  const proxyNames = [
    "negocio-sem-filtro.mp4",
    "kayky-long-form.mp4",
    "voti-visita.mp4",
  ];
  const totalProxyBytes = proxyNames.reduce((total, name) => {
    const file = path.join(root, "assets", "hero-wall", name);
    assert.ok(fs.existsSync(file), `missing hero proxy: ${name}`);
    return total + fs.statSync(file).size;
  }, 0);
  const totalPosterBytes = [
    "qBTk1irwDc4",
    "DaBe_RIhl06",
    "ADKpionmFiw",
    "DQfTWkhiK4k",
    "DYC7byPyEnW",
    "DUf-ODMDWqA",
    "DXiIx4_kQ-0",
  ].reduce((total, id) => {
    const file = path.join(root, "assets", "hero-wall", `${id}.webp`);
    assert.ok(fs.existsSync(file), `missing hero poster: ${id}`);
    return total + fs.statSync(file).size;
  }, 0);
  const allHeroVideoBytes = [
    "assets/hero-wall/voti-visita.mp4",
    "assets/hero-wall/negocio-sem-filtro.mp4",
    "assets/hero-wall/kayky-long-form.mp4",
    "assets/previews/DQfTWkhiK4k.mp4",
    "assets/previews/DYC7byPyEnW.mp4",
    "assets/previews/DUf-ODMDWqA.mp4",
    "assets/previews/DXiIx4_kQ-0.mp4",
    "assets/previews/DGLMxcXRRJ4.mp4",
    "assets/previews/DSldztZCA9P.mp4",
    "assets/previews/DWpa8TQCKvX.mp4",
    "assets/previews/DZUo3jokhkP.mp4",
    "assets/previews/DZGeYPdBiet.mp4",
  ].reduce((total, file) => {
    const fullPath = path.join(root, file);
    assert.ok(fs.existsSync(fullPath), `missing hero video: ${file}`);
    return total + fs.statSync(fullPath).size;
  }, 0);

  assert.ok(totalProxyBytes < 256 * 1024, `hero proxies exceed 256 KB: ${totalProxyBytes}`);
  assert.ok(totalPosterBytes < 128 * 1024, `hero posters exceed 128 KB: ${totalPosterBytes}`);
  assert.ok(allHeroVideoBytes < 2 * 1024 * 1024, `hero videos exceed 2 MB: ${allHeroVideoBytes}`);
  assert.match(html, /preload" as="image" href="assets\/hero-wall\/qBTk1irwDc4\.webp"/);
  assert.match(html, /<img src="assets\/hero-wall\/qBTk1irwDc4\.webp"[\s\S]*fetchpriority="high"/);
  assert.match(html, /<button class="motion-control"[^>]+data-motion-toggle/);
  assert.match(html, /class="hero__orbit" data-hero-orbit/);
  assert.match(html, /class="hero__ambient"/);
  assert.doesNotMatch(html, /data-hero-orbit aria-hidden="true"/);
  assert.match(html, /class="hero__spin" data-hero-spin/);
  assert.match(html, /data-hero-destinations aria-hidden="true"/);
  assert.match(html, /data-hero-wall aria-hidden="true"/);
  assert.match(html, /class="hero__axis"/);
  assert.match(html, /class="hero__settle-sentinel"/);
  assert.match(js, /setupPointerField/);
  assert.match(js, /renderHeroDestinations/);
  assert.match(js, /syncHeroDestinationGeometry/);
  assert.match(js, /data-hero-id/);
  assert.match(js, /data-destination="\$\{destination\.key\}"/);
  assert.match(js, /data-hero-destination="\$\{group\.key\}"/);
  assert.match(js, /if \(item\?\.client === "VOTI Software"\) return \{ key: "voti", label: "VOTI", href: "#provas" \}/);
  assert.match(js, /if \(item\?\.client === "Kayky Pitondo"\) return \{ key: "kayky", label: "Kayky", href: "#formatos" \}/);
  assert.match(js, /if \(item\?\.client === "Negócio Sem Filtro"\) return \{ key: "nsf", label: "Negócio Sem Filtro", href: "#formatos" \}/);
  assert.match(js, /return \{ key: "fade", label: "Arquivo", href: "#arquivo" \}/);
  assert.match(js, /const limit = compactViewport\.matches \? 9 : 12/);
  assert.doesNotMatch(heroIdsBlock, /DTgXN2FiDV6/, "known mismatched footage must stay out of the hero");
  assert.doesNotMatch(
    votiPriorityIds.join(","),
    /DTgXN2FiDV6/,
    "known mismatched footage must stay out of the VOTI playback wall",
  );
  assert.match(js, /const HERO_SLOTS = \[/);
  assert.match(js, /--sphere-transform:/);
  assert.match(js, /--destination-opacity/);
  assert.match(js, /data-section-video/);
  assert.match(js, /const playheads = new Map\(\)/);
  assert.match(js, /playheads\.set\(id, video\.currentTime\)/);
  assert.match(js, /const saved = playheads\.get\(video\.dataset\.workId\)/);
  assert.match(js, /const chooseActiveVideos = \(\) =>/);
  assert.match(js, /activeVideos = chooseActiveVideos\(\)/);
  assert.match(js, /&& activeVideos\.has\(video\)/);
  assert.match(js, /video\.dataset\.needsPlayheadSync = "true"/);
  assert.match(js, /const restorePlayhead = \(video\) =>/);
  assert.match(js, /video\.dataset\.needsPlayheadSync === "true" && restorePlayhead\(video\)/);
  assert.match(js, /tabindex="-1"/);
  assert.match(js, /destination\.tabIndex = settled \? 0 : -1/);
  assert.match(js, /setAttribute\("aria-hidden", String\(!settled\)\)/);
  assert.match(js, /pointermove/);
  assert.match(js, /requestAnimationFrame/);
  assert.doesNotMatch(html, /<video[^>]+autoplay/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /navigator\.connection\?\.saveData/);
  assert.match(js, /Ativar movimento/);
  assert.match(js, /motion-opt-in/);
  assert.match(js, /requestIdleCallback/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /video\.pause\(\)/);
  assert.match(js, /video\.play\(\)/);
  assert.doesNotMatch(js, /addEventListener\(["']scroll/);
  assert.match(js, /document\.startViewTransition/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.match(css, /@keyframes tile-orbit-settle/);
  assert.match(css, /@keyframes hero-idle-orbit/);
  assert.match(css, /@keyframes ambient-drift/);
  assert.match(css, /\.motion-paused \.hero__spin/);
  assert.match(css, /\.motion-paused \.hero__ambient::before/);
  assert.match(css, /\.hero\.is-settled \.hero__spin\s*\{[^}]*animation-play-state:\s*paused/);
  assert.match(css, /\.hero\.is-settled \.hero__footer\s*\{[^}]*pointer-events:\s*none/);
  assert.match(css, /@media \(max-width: 48rem\)[\s\S]*data-hero-destination="kayky"[\s\S]*font-size:\s*1\.5rem/);
  assert.match(css, /\.hero\.is-settled \.hero__orbit\s*\{[^}]*pointer-events:\s*auto/);
  assert.match(css, /hero-destinations-scroll/);
  assert.match(css, /transform:\s*var\(--orbit-transform\)/);
  assert.match(css, /transform:\s*var\(--settle-transform\)/);
  assert.match(css, /\.hero-tile figcaption/);
  assert.match(css, /content-visibility:\s*auto/);
  const infiniteAnimations = [...css.matchAll(/animation:[^;]*infinite[^;]*/g)]
    .map((match) => match[0]);
  assert.ok(infiniteAnimations.length >= 2, "the controlled ambient orbit and background drift must exist");
  assert.ok(
    infiniteAnimations.every((animation) => (
      animation.includes("hero-idle-orbit")
      || animation.includes("ambient-drift")
    )),
    `unexpected infinite animation: ${infiniteAnimations.join(" | ")}`,
  );
  assert.match(css, /100%\s*\{\s*opacity:\s*0\.94/);
  assert.match(css, /@keyframes hero-footer-scroll[\s\S]*100%\s*\{\s*opacity:\s*0/);
});

test("keyboard, focus and form semantics have an explicit safety contract", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*(?:2\.75rem|44px)/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<fieldset>/);
  assert.match(html, /<legend>/);
  assert.match(html, /type="radio"/);
  assert.match(html, /type="submit"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /aria-describedby="motion-status"/);
  assert.match(css, /@media \(max-width: 30rem\)[\s\S]*\.filters\s*\{[\s\S]*grid-template-columns:\s*repeat\(2/);
});

test("the page is authored, concise and avoids loose punctuation", () => {
  assert.ok(visibleWords(html).length < 850);
  assert.doesNotMatch(html, /[—–]/);
  assert.doesNotMatch(html, /lorem ipsum|revolucionário|solução 360/i);
  assert.match(html, /Não é uma coleção de peças soltas/);
  assert.match(html, /Serviços construídos a partir do trabalho real/);
  assert.match(html, /Seu negócio merece uma leitura própria/);
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

test("the retired kinetic route cannot expose a broken duplicate", () => {
  assert.match(kineticRouteHtml, /<meta name="robots" content="noindex,nofollow">/);
  assert.match(kineticRouteHtml, /content="0; url=\.\.\/\.\.\/"/);
  assert.match(kineticRouteHtml, /href="\.\.\/\.\.\/">Abrir o portfólio atual/);
});

test("obsolete portfolio laboratories stay out of the published tree", () => {
  const retired = [
    "versions/index.html",
    "versions/chooser.css",
    "versions/shared.css",
    "versions/shared.js",
    "versions/direcao/index.html",
    "versions/editorial/index.html",
    "versions/fable/index.html",
    "versions/showreel/index.html",
    "render.js",
    "assets/icons.svg",
    "assets/portfolio-share.jpg",
    "design-qa.md",
  ];

  for (const file of retired) {
    assert.equal(fs.existsSync(path.join(root, file)), false, `obsolete file returned: ${file}`);
  }
});
