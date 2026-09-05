import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const C = createRequire(import.meta.url)("../portfolio-core.js");
const context = { window: {} };
vm.runInNewContext(read("cases.js"), context);
const profile = context.window.PROFILE;
const projects = [...context.window.CASES, ...context.window.EXTRA_CLIPS];
const html = read("index.html");

test("public work retains original sources, unique identity and accurate relationships", () => {
  assert.equal(projects.length, 31);
  assert.equal(new Set(projects.map((p) => p.id)).size, 31);
  assert.equal(profile.clients.includes("VOTI Software"), false);
  for (const p of projects) {
    assert.match(p.permalink, /^https:\/\//);
    assert.ok(
      fs.existsSync(path.join(root, p.cardImage || p.thumb || p.poster)),
    );
    assert.ok(p.heroWidth > 0 && p.heroHeight > 0);
    assert.equal(
      p.orientation,
      p.heroWidth > p.heroHeight ? "landscape" : "portrait",
    );
    if (p.preview) assert.ok(fs.existsSync(path.join(root, p.preview)));
    if (p.client === "VOTI Software")
      assert.equal(C.relationship(p), "Experiência CLT");
    if (p.client === "Lumiar Parfum")
      assert.equal(C.relationship(p), "Histórico encerrado");
    if (p.client === "Negócio Sem Filtro") assert.equal(p.category, "edicao");
  }
});

test("contact drafts encode user text exactly without sending or accepting arbitrary recipients", () => {
  const message = C.messageDraft({
    need: "Direção de conteúdo",
    business: "Café & Cia",
    challenge: "Vídeo? Sim + direção\nSegunda linha.",
  });
  const url = new URL(C.whatsappUrl(message));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5518981196746");
  assert.equal(url.searchParams.get("text"), message);
  assert.ok(message.includes("Café & Cia"));
  assert.ok(message.includes("Segunda linha."));
  assert.ok(
    C.messageDraft({ need: "unknown", business: "B", challenge: "C" }).includes(
      "Ainda quero entender",
    ),
  );
  assert.equal(
    new URL(C.whatsappUrl("x".repeat(5000))).searchParams.get("text").length,
    2000,
  );
});

test("settings round-trip text, breaks and choices without interpreting markup or prototype keys", () => {
  const raw = {
    version: 1,
    tone: "night",
    accent: "orange",
    titleScale: 105,
    motion: false,
    texts: {
      promise: "Você tem assunto.\nVamos gravar.",
      firstName: "<b>Enzo</b>",
    },
  };
  assert.deepEqual(
    C.importSettings(JSON.parse(JSON.stringify(raw)), ["promise", "firstName"]),
    raw,
  );
  const malicious = JSON.parse(
    '{"version":1,"tone":"url(bad)","accent":"<script>","titleScale":999,"texts":{"__proto__":{"polluted":true},"promise":"<img src=x onerror=bad()>","unknown":"omit"}}',
  );
  const clean = C.importSettings(malicious, ["promise", "__proto__"]);
  assert.equal(clean.tone, "paper");
  assert.equal(clean.accent, "violet");
  assert.equal(clean.titleScale, 110);
  assert.deepEqual(Object.keys(clean.texts), ["promise"]);
  assert.equal({}.polluted, undefined);
  assert.equal(clean.texts.promise, "<img src=x onerror=bad()>");
  assert.throws(
    () => C.importSettings({ version: 2, texts: {} }, []),
    /compatível/,
  );
  assert.throws(
    () => C.importSettings({ version: 1, texts: [] }, []),
    /compatível/,
  );
});

test("orbit remains bounded and continuous, with no travel under reduced motion", () => {
  for (const width of [280, 350, 700, 1000, 1600])
    for (let i = 0; i < 3; i++) {
      const fixed = C.orbitPosition(i, 0, width, 600, true);
      assert.deepEqual(C.orbitPosition(i, 999, width, 600, true), fixed);
      for (let t = 0; t < 180; t += 0.7) {
        const a = C.orbitPosition(i, t, width, 600);
        const b = C.orbitPosition(i, t + 0.016, width, 600);
        assert.ok(Object.values(a).every(Number.isFinite));
        assert.ok(Math.abs(a.x) <= width * 0.34 + 0.001);
        assert.ok(Math.abs(a.y) <= 105);
        assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 2);
        assert.ok(a.scale >= 0.69 && a.scale <= 0.901);
      }
    }
});

test("new homepage has reachable content, contact and local assets before enhancement", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<html lang="pt-BR"/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/enzosmarinho\.github\.io\/"/,
  );
  assert.match(html, /mailto:enzosmarinho@hotmail\.com/);
  assert.match(html, /<noscript\s*>\s*<a[^>]+href="https:\/\/wa.me\/5518981196746"/);
  assert.doesNotMatch(html, /R\$\s*[\d.]+/);
  assert.doesNotMatch(read("cases.js"), /"(?:price|payment)"\s*:/);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.has(m[1]), "Broken anchor " + m[1]);
  for (const m of html.matchAll(
    /(?:href|src|poster|data-ambient)="((?:assets\/|portfolio)[^"?]+)(?:\?[^"]*)?"/g,
  ))
    assert.ok(fs.existsSync(path.join(root, m[1])), m[1]);
  assert.match(read("404.html"), /Voltar ao portfólio/);
});

test("delivery budget distinguishes full videos on demand from the small opening loop", () => {
  const loop = fs.statSync(
    path.join(root, "assets/identity/enzo-hero-loop.mp4"),
  ).size;
  assert.ok(loop < 1024 * 1024, "hero loop must remain below 1 MiB");
  let total = 0;
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const bytes = fs.statSync(p).size;
        total += bytes;
        assert.ok(bytes < 25 * 1024 * 1024, "single-file hosting cap: " + p);
      }
    }
  }
  walk(path.join(root, "assets"));
  // Includes the two original 720p personal videos (~13.4 MB), loaded on intent.
  assert.ok(total < 28 * 1024 * 1024, "public media archive exceeds 28 MiB");
  assert.ok(
    fs.existsSync(path.join(root, "assets/fonts/BarlowCondensed-OFL.txt")),
  );
});
