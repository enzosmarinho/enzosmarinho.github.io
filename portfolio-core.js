(function (root) {
  "use strict";
  const NEEDS = [
    "Roteiro",
    "Direção de conteúdo",
    "Produção completa",
    "Ainda quero entender",
  ];
  const defaults = Object.freeze({
    version: 1,
    tone: "paper",
    accent: "violet",
    titleScale: 100,
    motion: true,
    texts: {},
  });
  function cleanText(value, limit = 1200) {
    return typeof value === "string"
      ? value
          .replace(/\r\n?/g, "\n")
          .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
          .slice(0, limit)
      : "";
  }
  function sanitizeSettings(raw, keys = []) {
    const data = raw && typeof raw === "object" ? raw : {};
    const texts = {};
    for (const key of keys) {
      if (["__proto__", "constructor", "prototype"].includes(key)) continue;
      if (
        data.texts &&
        Object.hasOwn(data.texts, key) &&
        typeof data.texts[key] === "string"
      ) {
        texts[key] = cleanText(data.texts[key], /Name$/.test(key) ? 24 : 1200);
      }
    }
    return {
      version: 1,
      tone: ["paper", "night"].includes(data.tone) ? data.tone : "paper",
      accent: ["violet", "blue", "orange", "lime"].includes(data.accent)
        ? data.accent
        : "violet",
      titleScale: Number.isFinite(Number(data.titleScale))
        ? Math.max(85, Math.min(110, Number(data.titleScale)))
        : 100,
      motion: data.motion !== false,
      texts,
    };
  }
  function importSettings(raw, keys) {
    if (
      !raw ||
      raw.version !== 1 ||
      !raw.texts ||
      typeof raw.texts !== "object" ||
      Array.isArray(raw.texts)
    )
      throw new Error(
        "Este arquivo não é compatível com esta versão do portfólio.",
      );
    return sanitizeSettings(raw, keys);
  }
  function messageDraft({ need, business, challenge }) {
    const topic = NEEDS.includes(need) ? need : "Ainda quero entender";
    return `Oi, Enzo! Vi seu portfólio e quero conversar.\n\nProcuro: ${topic}\nMeu projeto: ${cleanText(business, 160).trim()}\nEm que preciso de ajuda: ${cleanText(challenge, 800).trim()}`;
  }
  function whatsappUrl(message) {
    return (
      "https://wa.me/5518981196746?text=" +
      encodeURIComponent(cleanText(message, 2000))
    );
  }
  function relationship(item) {
    if (item.client === "VOTI Software") return "Experiência CLT";
    if (item.client === "Lumiar Parfum" || item.status === "Projeto encerrado")
      return "Histórico encerrado";
    return "Projeto independente";
  }
  function orbitPosition(index, seconds, width, height, reduced = false) {
    const angle =
      (index * Math.PI * 2) / 3 + 0.3 + (reduced ? 0 : seconds * 0.065);
    const depth = Math.sin(angle);
    return {
      x: Math.cos(angle) * width * 0.34,
      y: depth * Math.min(height * 0.13, 105),
      scale: 0.69 + (depth + 1) * 0.105,
      rotation: -5 + index * 4 + depth * 2,
      z: depth < -0.15 ? 1 : 3,
    };
  }
  const api = {
    defaults,
    cleanText,
    sanitizeSettings,
    importSettings,
    messageDraft,
    whatsappUrl,
    relationship,
    orbitPosition,
    NEEDS,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PortfolioCore = api;
})(typeof window !== "undefined" ? window : globalThis);
