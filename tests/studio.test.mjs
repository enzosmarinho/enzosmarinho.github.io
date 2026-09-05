import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const {
  baseProfile,
  sanitizeProfile,
  importState,
  position,
  THEMES,
  contrast,
} = createRequire(import.meta.url)("../studio.js");
const ids = ["real-a", "real-b", "real-c"];
const keys = ["headline1", "intro"];

test("editor import rejects incompatible files and limits external input to known controls", () => {
  assert.throws(() => importState({ version: 1 }, ids, keys), /incompatível/);
  const p = sanitizeProfile(
    {
      background: "url(https://example.test/x)",
      accent: "#123456",
      font: "unknown",
      speed: 9999,
      bodySize: 1,
      titleScale: -20,
      count: 500,
      phone: "javascript:alert(1)",
      mediaIds: ["not-a-work"],
      texts: { headline1: "Olá", unknown: "ignored" },
    },
    "direction",
    ids,
    keys,
  );
  assert.equal(p.background, THEMES.ocean.background);
  assert.equal(p.accent, "#123456");
  assert.equal(p.font, "sans");
  assert.equal(p.speed, 160);
  assert.equal(p.bodySize, 16);
  assert.equal(p.titleScale, 80);
  assert.equal(p.count, 12);
  assert.deepEqual(p.mediaIds, ids);
  assert.equal(p.phone, "5518981196746");
  assert.deepEqual(p.texts, { headline1: "Olá" });
});
test("export and import preserve independent versions, chosen media and plain text edits", () => {
  const state = {
    version: 2,
    active: "gallery",
    variants: Object.fromEntries(
      ["direction", "gallery", "orbit"].map((l) => [l, baseProfile(l, ids)]),
    ),
  };
  state.variants.gallery.name = "Enzo — direção";
  state.variants.gallery.mediaIds = ["real-c", "real-a"];
  state.variants.gallery.texts = {
    headline1: "Conteúdo com intenção.",
    intro: "Linha um\nLinha dois",
  };
  state.variants.orbit.font = "sans";
  assert.deepEqual(
    importState(JSON.parse(JSON.stringify(state)), ids, keys),
    state,
  );
  assert.equal(state.variants.direction.name, "Enzo Marinho");
});
test("prototype keys in imported JSON do not become editor state or affect global objects", () => {
  const raw = JSON.parse(
    '{"version":2,"active":"direction","variants":{"direction":{"__proto__":{"polluted":true},"texts":{"__proto__":"bad","headline1":"<script>literal text</script>"},"mediaIds":["real-a","real-a"]}}}',
  );
  const result = importState(raw, ids, keys);
  assert.equal({}.polluted, undefined);
  assert.equal(Object.hasOwn(result.variants.direction, "__proto__"), false);
  assert.equal(
    Object.hasOwn(result.variants.direction.texts, "__proto__"),
    false,
  );
  assert.equal(
    result.variants.direction.texts.headline1,
    "<script>literal text</script>",
  );
  assert.deepEqual(result.variants.direction.mediaIds, ["real-a"]);
});
test("motion layouts produce finite, upright transforms from mobile through 4K", () => {
  for (const width of [320, 390, 800, 1440, 2560, 3840])
    for (const layout of ["direction", "gallery", "orbit"])
      for (const count of [6, 9, 12, 18])
        for (let t = 0; t < 90; t += 3)
          for (let i = 0; i < count; i++) {
            const p = position(layout, i, count, t, width, 600);
            assert.ok(Object.values(p).every(Number.isFinite));
            assert.ok(p.scale > 0.4 && p.scale < 1.1);
            assert.ok(Math.abs(p.rotate) <= 10);
          }
  assert.notDeepEqual(
    position("direction", 2, 12, 4, 1440, 800),
    position("orbit", 2, 12, 4, 1440, 800),
  );
});
test("default palette accents remain readable on their backgrounds", () => {
  for (const [name, theme] of Object.entries(THEMES))
    assert.ok(contrast(theme.background, theme.accent) >= 4.5, name);
});
