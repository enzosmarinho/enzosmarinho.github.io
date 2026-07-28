(() => {
  "use strict";

  const profile = window.PROFILE || {};
  const source = [...(window.CASES || []), ...(window.EXTRA_CLIPS || [])];
  const works = [...new Map(source.map((item) => [item.id || item.permalink, item])).values()];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const assetPrefix = document.body.dataset.assetPrefix ?? "../../";

  const FEATURED_IDS = ["DaBe_RIhl06", "ADKpionmFiw", "DUf-ODMDWqA", "DQfTWkhiK4k"];
  const CATEGORIES = {
    conteudo: { label: "Conteúdo" },
    anuncios: { label: "Campanha" },
    direcao: { label: "Direção" },
    "long-form": { label: "Long-form" },
    edicao: { label: "Edição" },
    automacao: { label: "Sistemas" },
  };

  const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const cleanText = (value = "") => String(value)
    .replace(/[—–]/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();

  const safe = (value = "") => escapeHtml(cleanText(value));
  const imageFor = (item) => item?.cardImage || item?.thumb || item?.poster || "";
  const videoFor = (item) => item?.preview || item?.video || "";
  const categoryLabel = (item) => CATEGORIES[item?.category]?.label || cleanText(item?.categoryLabel || "Projeto");

  function relationshipFor(item) {
    if (item.client === "VOTI Software") return { label: "Experiência CLT", type: "employment" };
    if (item.client === "Lumiar Parfum") return { label: "Histórico encerrado", type: "historical" };
    return { label: "Projeto independente", type: "independent" };
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value !== undefined && value !== null) element.textContent = String(value);
  }

  function renderHero() {
    const host = document.querySelector("[data-hero-media]");
    if (!host) return;
    const item = works.find((work) => work.id === FEATURED_IDS[0]) || works.find((work) => imageFor(work));
    if (!item) return;

    const poster = `${assetPrefix}${imageFor(item)}`;
    const video = videoFor(item);
    host.innerHTML = `
      <div class="proof-stage__media">
        <img src="${escapeHtml(poster)}" alt="" width="720" height="1280" fetchpriority="high" decoding="async">
        ${video ? `<video muted loop playsinline preload="metadata" poster="${escapeHtml(poster)}" aria-hidden="true">
          <source src="${escapeHtml(`${assetPrefix}${video}`)}" type="video/mp4">
        </video>` : ""}
      </div>
      <div class="proof-stage__chrome mono">
        <span>PROVA / 01</span>
        <span>${safe(item.year || "")}</span>
      </div>
      <div class="proof-stage__caption">
        <div>
          <p class="mono">${safe(relationshipFor(item).label)} / ${safe(categoryLabel(item))}</p>
          <h2>${safe(item.title)}</h2>
          <span>${safe(item.role || item.deliverable || "")}</span>
        </div>
        <a href="${escapeHtml(item.permalink || "#provas")}" target="_blank" rel="noopener">
          Abrir publicação <span aria-hidden="true">↗</span>
        </a>
      </div>`;

    const motionButton = document.querySelector("[data-motion-toggle]");
    const heroVideo = host.querySelector("video");
    if (!motionButton || !heroVideo) {
      if (motionButton) motionButton.hidden = true;
      return;
    }

    let userPaused = false;
    const syncMotion = () => {
      const shouldPause = userPaused || reducedMotion.matches || document.hidden;
      motionButton.hidden = reducedMotion.matches;
      motionButton.setAttribute("aria-pressed", String(userPaused));
      motionButton.textContent = userPaused ? "Retomar movimento" : "Pausar movimento";
      document.documentElement.classList.toggle("motion-paused", shouldPause);
      if (shouldPause) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(() => {
          userPaused = true;
          motionButton.setAttribute("aria-pressed", "true");
          motionButton.textContent = "Reproduzir vídeo";
        });
      }
    };

    motionButton.addEventListener("click", () => {
      userPaused = !userPaused;
      syncMotion();
    });
    reducedMotion.addEventListener?.("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible) heroVideo.pause();
        else syncMotion();
      }, { threshold: 0.25 });
      observer.observe(host);
    } else {
      syncMotion();
    }
  }

  function renderStats() {
    setText("[data-total]", String(works.length).padStart(2, "0"));
    const independent = new Set(
      works
        .filter((work) => relationshipFor(work).type !== "employment")
        .map((work) => work.client),
    );
    setText("[data-independent]", String(independent.size).padStart(2, "0"));
  }

  function renderCaseStories() {
    const host = document.querySelector("[data-case-stories]");
    if (!host) return;
    const featured = FEATURED_IDS
      .map((id) => works.find((work) => work.id === id))
      .filter(Boolean);

    host.innerHTML = featured.map((item, index) => {
      const relationship = relationshipFor(item);
      const result = item.result
        ? `<p class="case-story__result"><span>Resultado público</span>${safe(item.result)}</p>`
        : "";
      return `
        <article class="case-story reveal" data-category="${escapeHtml(item.category || "")}">
          <a class="case-story__media" href="${escapeHtml(item.permalink || "#arquivo")}" target="_blank" rel="noopener">
            <img src="${escapeHtml(`${assetPrefix}${imageFor(item)}`)}"
                 alt="${safe(item.title)}, trabalho para ${safe(item.client)}"
                 width="${escapeHtml(item.heroWidth || 720)}"
                 height="${escapeHtml(item.heroHeight || 1280)}"
                 ${index === 0 ? 'loading="eager"' : 'loading="lazy"'} decoding="async">
            <span class="case-story__index mono">${String(index + 1).padStart(2, "0")}</span>
            <span class="case-story__open mono">Ver original ↗</span>
          </a>
          <div class="case-story__body">
            <div class="case-story__meta mono">
              <span data-relation="${relationship.type}">${safe(relationship.label)}</span>
              <span>${safe(categoryLabel(item))}</span>
              <span>${safe(item.year || "")}</span>
            </div>
            <h3>${safe(item.title)}</h3>
            <p class="case-story__role">${safe(item.role || item.deliverable || "")}</p>
            ${item.problem ? `<div class="case-story__decision"><span>Problema</span><p>${safe(item.problem)}</p></div>` : ""}
            ${item.direction ? `<div class="case-story__decision"><span>Decisão</span><p>${safe(item.direction)}</p></div>` : ""}
            ${result}
          </div>
        </article>`;
    }).join("");
  }

  function renderDiagnostic() {
    const factorsHost = document.querySelector("[data-diagnostic-factors]");
    if (factorsHost) {
      factorsHost.innerHTML = (profile.diagnostic?.factors || []).map((factor, index) => `
        <article class="factor reveal">
          <span class="mono">${String(index + 1).padStart(2, "0")}</span>
          <h3>${safe(factor.title)}</h3>
          <p>${safe(factor.text)}</p>
        </article>`).join("");
    }
    setText("[data-diagnostic-promise]", cleanText(profile.diagnostic?.promise || ""));

    const form = document.querySelector("[data-diagnostic]");
    const status = document.querySelector("[data-form-status]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const values = new FormData(form);
      const lines = [
        "Oi Enzo, vi seu portfólio e quero pedir uma análise.",
        "",
        `Necessidade: ${values.get("need")}`,
        `Contexto: ${values.get("business")}`,
        `Prazo: ${values.get("timing")}`,
        `Material: ${values.get("material")}`,
        `Aprovação: ${values.get("approval")}`,
      ];
      if (values.get("reference")) lines.push(`Site ou perfil: ${values.get("reference")}`);
      if (values.get("outcome")) lines.push(`Resultado esperado: ${values.get("outcome")}`);

      const url = `https://wa.me/5518981196746?text=${encodeURIComponent(lines.join("\n"))}`;
      if (status) status.textContent = "Pedido montado. O WhatsApp será aberto para você revisar antes de enviar.";
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
    });
  }

  function renderCapabilities() {
    const host = document.querySelector("[data-capabilities]");
    if (!host) return;
    host.innerHTML = (profile.capabilities || []).map((capability, index) => `
      <article class="capability reveal" data-capability="${escapeHtml(capability.id || "")}">
        <div class="capability__top mono">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span>${safe(capability.label)}</span>
        </div>
        <h3>${safe(capability.title)}</h3>
        <p>${safe(capability.text)}</p>
        <a href="#analise">Analisar esta frente <span aria-hidden="true">↗</span></a>
      </article>`).join("");
  }

  function renderAiRoles() {
    const host = document.querySelector("[data-ai-roles]");
    if (host) {
      host.innerHTML = (profile.aiRoles || []).map((role) => `
        <article class="ai-role reveal">
          <p class="mono">${safe(role.role)}</p>
          <h3>${safe(role.owner)}</h3>
          <p>${safe(role.text)}</p>
        </article>`).join("");
    }

    const method = document.querySelector("[data-method]");
    if (method) {
      method.innerHTML = (profile.methods || []).map((item, index) => `
        <article class="method-item reveal">
          <span class="mono">${String(index + 1).padStart(2, "0")}</span>
          <div><h3>${safe(item.title)}</h3><p>${safe(item.text)}</p></div>
        </article>`).join("");
    }
  }

  function renderArchive() {
    const filtersHost = document.querySelector("[data-filters]");
    const grid = document.querySelector("[data-work-grid]");
    if (!filtersHost || !grid) return;

    const categories = [...new Set(works.map((work) => work.category).filter((key) => CATEGORIES[key]))];
    const filters = [
      { key: "all", label: "Todos", count: works.length },
      ...categories.map((key) => ({
        key,
        label: CATEGORIES[key].label,
        count: works.filter((work) => work.category === key).length,
      })),
    ];

    filtersHost.innerHTML = filters.map((filter, index) => `
      <button type="button" data-filter="${escapeHtml(filter.key)}"
        aria-pressed="${index === 0 ? "true" : "false"}">
        ${safe(filter.label)} <span>${String(filter.count).padStart(2, "0")}</span>
      </button>`).join("");

    grid.innerHTML = works.map((item) => {
      const relationship = relationshipFor(item);
      return `
        <a class="work-card reveal" data-work-category="${escapeHtml(item.category || "")}"
           href="${escapeHtml(item.permalink || "#contato")}" target="_blank" rel="noopener">
          <div class="work-card__image">
            <img src="${escapeHtml(`${assetPrefix}${imageFor(item)}`)}"
                 alt="" width="${escapeHtml(item.heroWidth || 720)}" height="${escapeHtml(item.heroHeight || 1280)}"
                 loading="lazy" decoding="async">
            <span class="work-card__arrow" aria-hidden="true">↗</span>
          </div>
          <div class="work-card__body">
            <div class="work-card__meta mono">
              <span data-relation="${relationship.type}">${safe(relationship.label)}</span>
              <span>${safe(item.year || "")}</span>
            </div>
            <h3>${safe(item.title)}</h3>
            <p>${safe(item.client)} / ${safe(categoryLabel(item))}</p>
          </div>
        </a>`;
    }).join("");

    const buttons = [...filtersHost.querySelectorAll("[data-filter]")];
    const cards = [...grid.querySelectorAll("[data-work-category]")];

    const applyFilter = (key) => {
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === key));
      });
      cards.forEach((card) => {
        card.hidden = key !== "all" && card.dataset.workCategory !== key;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const update = () => applyFilter(button.dataset.filter || "all");
        if (!reducedMotion.matches && document.startViewTransition) {
          document.startViewTransition(update);
        } else {
          update();
        }
      });
    });
  }

  function setupReveal() {
    const elements = [...document.querySelectorAll(".reveal")];
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    elements.forEach((element) => observer.observe(element));
  }

  function init() {
    renderStats();
    renderHero();
    renderCaseStories();
    renderDiagnostic();
    renderArchive();
    renderCapabilities();
    renderAiRoles();
    setupReveal();
    document.documentElement.classList.add("ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
