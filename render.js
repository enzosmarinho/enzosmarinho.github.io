const profile = window.PROFILE || {};
const projects = window.CASES || [];
const extraClips = window.EXTRA_CLIPS || [];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const ICON_SPRITE = "assets/icons.svg";
const icon = (name) => `<svg class="lucide lucide-${escapeHtml(name)}" aria-hidden="true" focusable="false"><use href="${ICON_SPRITE}#${escapeHtml(name)}"></use></svg>`;
const SHOWCASE_EXTRA_IDS = ["blYFchVi4xg", "DTgXN2FiDV6"];
const PROJECT_RANKING = [
  "ADKpionmFiw",
  "DQfTWkhiK4k",
  "blYFchVi4xg",
  "DaBe_RIhl06",
  "DaQEv0Blj2s",
  "DYDiclAOSod",
  "DX_2dJiO8WZ",
  "DSldztZCA9P",
  "DTgXN2FiDV6",
  "DWpa8TQCKvX",
  "qBTk1irwDc4",
  "DUf-ODMDWqA",
];

function rankProjects(items) {
  return [...items].sort((a, b) => {
    const aRank = PROJECT_RANKING.indexOf(a.id);
    const bRank = PROJECT_RANKING.indexOf(b.id);
    return (aRank < 0 ? PROJECT_RANKING.length : aRank)
      - (bRank < 0 ? PROJECT_RANKING.length : bRank);
  });
}

function serviceHref(service) {
  const message = [
    "Oi Enzo, vi seu portfólio e quero conversar sobre:",
    service.title,
    `Investimento anunciado: ${service.price}`,
    "Meu objetivo é:",
    "Meu prazo é:",
    "Material ou referências que já tenho:",
  ].join("\n");
  return `https://wa.me/5518981196746?text=${encodeURIComponent(message)}`;
}

function projectGroup(item) {
  if (item.client === "Lumiar Parfum") return "lumiar";
  if (item.client === "VOTI Software") return "voti";
  if (item.client === "Negócio Sem Filtro" || item.category === "long-form" || item.category === "automacao") return "sistemas";
  return "independentes";
}

function mediaDimensions(item) {
  return {
    width: Number(item.heroWidth || (item.orientation === "landscape" ? 1280 : 720)),
    height: Number(item.heroHeight || (item.orientation === "landscape" ? 720 : 1280)),
  };
}

function projectCard(item, index = 0) {
  const { width, height } = mediaDimensions(item);
  const classes = [
    "project-card",
    item.layout === "wide" ? "project-card--wide" : "",
    item.orientation === "landscape" ? "project-card--landscape" : "",
    "reveal",
  ].filter(Boolean).join(" ");

  return `
    <article class="${classes}" data-group="${projectGroup(item)}">
      <a class="project-card__link" href="${escapeHtml(item.permalink)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.title)} — abrir publicação original em nova aba">
        <div class="project-card__media" data-preview="${escapeHtml(item.preview || "")}" data-poster="${escapeHtml(item.cardImage)}">
          <img src="${escapeHtml(item.cardImage)}" width="${width}" height="${height}" alt="" loading="lazy" decoding="async">
          <span class="project-card__tag">${escapeHtml(item.categoryLabel)}</span>
          <span class="project-card__number">${String(index + 1).padStart(2, "0")}</span>
          <span class="project-card__cover">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.role)}</small>
          </span>
          <span class="media-play">${icon("arrow-up-right")}</span>
        </div>
        <div class="project-card__info">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.direction || item.deliverable)}</p>
          ${item.result ? `<p class="project-card__result">${icon("sparkles")} <span>${escapeHtml(item.result)}</span></p>` : ""}
          <div class="project-card__meta">
            <span>${escapeHtml(item.client)} · ${escapeHtml(item.status || item.year)}</span>
            <span>Publicação original</span>
          </div>
        </div>
      </a>
    </article>`;
}

function clipCard(item) {
  const { width, height } = mediaDimensions(item);
  return `
    <a class="clip-card" href="${escapeHtml(item.permalink)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.title)} — abrir publicação original em nova aba">
      <div class="clip-card__media" data-preview="${escapeHtml(item.preview || "")}" data-poster="${escapeHtml(item.cardImage)}">
        <img src="${escapeHtml(item.cardImage)}" width="${width}" height="${height}" alt="" loading="lazy" decoding="async">
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.client)} · ${escapeHtml(item.status || "publicação original")}</p>
    </a>`;
}

const systemReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactViewport = window.matchMedia("(max-width: 760px)");
const saveData = Boolean(navigator.connection?.saveData);
function readMotionPreference() {
  try {
    return window.localStorage.getItem("portfolio-motion");
  } catch {
    return null;
  }
}

function saveMotionPreference(value) {
  try {
    window.localStorage.setItem("portfolio-motion", value);
  } catch {
    // The visual control still works for the current session when storage is blocked.
  }
}

const savedMotionMode = readMotionPreference();
let motionReduced = systemReduceMotion.matches && savedMotionMode !== "full";
if (savedMotionMode === "full") document.documentElement.classList.add("motion-enabled");
if (savedMotionMode === "paused") document.documentElement.classList.add("motion-paused");
if (saveData) document.documentElement.classList.add("save-data");

let heroReelState;

function renderHeroShowreel() {
  const root = document.querySelector("#hero-showreel");
  if (!root) return;

  const preferred = ["DaBe_RIhl06", "ADKpionmFiw", "qBTk1irwDc4", "DUf-ODMDWqA", "DYC7byPyEnW", "DQfTWkhiK4k", "DXiIx4_kQ-0"];
  const library = [...projects, ...extraClips];
  const selected = preferred.map((id) => library.find((item) => item.id === id)).filter(Boolean);
  const reel = selected.length >= 6 ? selected : library.filter((item) => item.preview).slice(0, 7);
  root.querySelectorAll(".hero-scene:not([data-hero-static])").forEach((scene) => scene.remove());
  const hasStaticScene = Boolean(root.querySelector("[data-hero-static]"));
  const dynamicScenes = reel.slice(hasStaticScene ? 1 : 0).map((item, offset) => {
    const index = offset + (hasStaticScene ? 1 : 0);
    const width = Number(item.heroWidth || 480);
    const height = Number(item.heroHeight || (item.orientation === "landscape" ? 270 : 854));
    const orientation = item.orientation || "portrait";
    const format = orientation === "landscape" ? "16:9 · quadro horizontal" : "9:16 · quadro vertical";
    const poster = escapeHtml(item.cardImage);
    const posterSource = index === 0 ? `src="${poster}"` : `data-src="${poster}"`;
    return `
      <figure class="hero-scene ${index === 0 ? "is-active" : ""}" data-orientation="${escapeHtml(orientation)}" data-format="${format}">
        <div class="hero-scene__dock">
          <div class="hero-scene__stage">
            <div class="hero-scene__ambient" aria-hidden="true">
              <img ${posterSource} width="${width}" height="${height}" alt="" decoding="async">
            </div>
            <div class="hero-scene__screen">
              <img class="hero-scene__poster" ${posterSource} width="${width}" height="${height}" alt="" decoding="async">
              <video data-src="${escapeHtml(item.preview)}" data-poster="${poster}" muted loop playsinline preload="none" aria-hidden="true"></video>
            </div>
            <span class="hero-scene__format" aria-hidden="true">${format}</span>
          </div>
        </div>
      </figure>`;
  }).join("");
  root.insertAdjacentHTML("beforeend", dynamicScenes);

  const scenes = [...root.querySelectorAll(".hero-scene")];
  const playlist = document.querySelector("#hero-reel-playlist");
  if (playlist) {
    playlist.innerHTML = reel.map((item, index) => {
      const number = String(index + 1).padStart(2, "0");
      return `
        <button type="button" data-hero-scene="${index}" aria-label="${number}: ${escapeHtml(item.title)}" aria-pressed="${index === 0 ? "true" : "false"}">
          <span>${number}</span><i aria-hidden="true"></i>
        </button>`;
    }).join("");
  }

  heroReelState = {
    reel,
    scenes,
    index: -1,
    timer: 0,
    preloadTimer: 0,
    progressAnimation: null,
    userPaused: motionReduced || savedMotionMode === "paused",
    inView: true,
    autoRotate: !saveData && !compactViewport.matches,
  };

  const canPlayVideo = () => !saveData
    && !heroReelState.userPaused
    && !motionReduced
    && heroReelState.inView
    && !document.hidden;

  const loadPoster = (index) => {
    const normalized = (index + reel.length) % reel.length;
    scenes[normalized]?.querySelectorAll("img[data-src]").forEach((image) => {
      if (!image.dataset.src) return;
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
    });
  };

  const loadVideo = (index) => {
    if (!canPlayVideo()) return;
    const normalized = (index + reel.length) % reel.length;
    const video = scenes[normalized]?.querySelector("video");
    if (!video || video.dataset.loaded === "true" || !video.dataset.src) return;
    video.dataset.loaded = "true";
    video.addEventListener("loadeddata", () => {
      video.classList.add("is-ready");
      if (heroReelState.index === normalized && canPlayVideo()) {
        video.play().catch(() => {});
      }
    }, { once: true });
    video.src = video.dataset.src;
    video.load();
  };

  const releaseVideo = (video) => {
    if (!video || (video.dataset.loaded !== "true" && !video.currentSrc)) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.classList.remove("is-ready");
    delete video.dataset.loaded;
  };

  const queueVideo = (index, immediate = false) => {
    const task = () => {
      if (heroReelState.index === index && canPlayVideo()) loadVideo(index);
    };
    if (immediate) {
      task();
    } else if ("requestIdleCallback" in window) {
      window.requestIdleCallback(task, { timeout: 1800 });
    } else {
      window.setTimeout(task, 700);
    }
  };

  const schedule = () => {
    window.clearTimeout(heroReelState.timer);
    if (!heroReelState.autoRotate || heroReelState.userPaused || !heroReelState.inView || document.hidden || motionReduced) return;
    heroReelState.timer = window.setTimeout(() => activate((heroReelState.index + 1) % reel.length), 5600);
  };

  const updateToggle = () => {
    const toggle = document.querySelector("#hero-toggle");
    if (!toggle) return;
    const paused = heroReelState.userPaused || motionReduced;
    const label = paused ? "Ativar animações" : "Pausar animações";
    toggle.innerHTML = `${icon(paused ? "play" : "pause")}<span>${label}</span>`;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", paused ? "true" : "false");
    document.documentElement.classList.toggle("motion-paused", paused);
    if (paused) {
      stopAllPreviewVideos();
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    } else {
      attachPreview();
    }
  };

  const updateProgress = () => {
    const progress = document.querySelector("#hero-reel-progress");
    if (!progress) return;
    heroReelState.progressAnimation?.cancel();
    progress.style.transform = "scaleX(0)";
    if (!heroReelState.autoRotate || heroReelState.userPaused || motionReduced || !heroReelState.inView) return;
    heroReelState.progressAnimation = progress.animate([
      { transform: "scaleX(0)" },
      { transform: "scaleX(1)" },
    ], { duration: 5600, easing: "linear", fill: "forwards" });
  };

  const activate = (nextIndex, restart = true, announce = false) => {
    const normalized = (nextIndex + reel.length) % reel.length;
    const previousIndex = heroReelState.index;
    heroReelState.index = normalized;
    loadPoster(normalized);
    scenes.forEach((scene, index) => {
      scene.querySelector(".hero-scene__ambient img")?.style.removeProperty("transform");
      const video = scene.querySelector("video");
      const active = index === normalized;
      scene.classList.toggle("is-active", active);
      if (!video) return;
      window.clearTimeout(Number(video.dataset.releaseTimer || 0));
      delete video.dataset.releaseTimer;
      if (active && canPlayVideo()) {
        if (restart && video.readyState > 0) video.currentTime = 0;
        if (video.dataset.loaded === "true") video.play().catch(() => {});
      } else {
        video.pause();
        const releaseDelay = index === previousIndex ? 720 : 0;
        video.dataset.releaseTimer = String(window.setTimeout(() => {
          if (heroReelState.index !== index) releaseVideo(video);
          delete video.dataset.releaseTimer;
        }, releaseDelay));
      }
    });

    const item = reel[normalized];
    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };
    setText("#hero-reel-count", `${String(normalized + 1).padStart(2, "0")} / ${String(reel.length).padStart(2, "0")}`);
    setText("#hero-reel-client", `${item.client} · ${item.categoryLabel}`);
    setText("#hero-reel-title", item.title);
    setText("#hero-reel-role", item.role);
    if (previousIndex >= 0 && previousIndex !== normalized && !motionReduced && !heroReelState.userPaused) {
      document.querySelectorAll(".hero-reel-card__copy > *").forEach((node, index) => {
        node.getAnimations().forEach((animation) => animation.cancel());
        node.animate([
          { opacity: 0, transform: "translateY(8px)", filter: "blur(3px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
        ], {
          duration: 360,
          delay: index * 44,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "none",
        });
      });
    }
    if (announce) setText("#hero-reel-announcement", `Projeto ${normalized + 1} de ${reel.length}: ${item.title}. ${item.role}.`);
    document.querySelectorAll("[data-hero-scene]").forEach((button, index) => {
      button.classList.toggle("is-active", index === normalized);
      button.setAttribute("aria-pressed", index === normalized ? "true" : "false");
    });
    if (canPlayVideo()) queueVideo(normalized, announce || normalized !== 0);
    updateProgress();
    schedule();
    window.clearTimeout(heroReelState.preloadTimer);
    if (heroReelState.autoRotate && canPlayVideo()) {
      heroReelState.preloadTimer = window.setTimeout(() => loadPoster(normalized + 1), 3200);
    }
  };

  document.querySelector("#hero-prev")?.addEventListener("click", () => activate(heroReelState.index - 1, true, true));
  document.querySelector("#hero-next")?.addEventListener("click", () => activate(heroReelState.index + 1, true, true));
  document.querySelectorAll("[data-hero-scene]").forEach((button) => {
    button.addEventListener("click", () => activate(Number(button.dataset.heroScene), true, true));
  });
  document.querySelector("#hero-toggle")?.addEventListener("click", () => {
    if (motionReduced) {
      motionReduced = false;
      heroReelState.userPaused = false;
      document.documentElement.classList.add("motion-enabled");
    } else {
      heroReelState.userPaused = !heroReelState.userPaused;
    }
    saveMotionPreference(heroReelState.userPaused ? "paused" : "full");
    updateToggle();
    activate(heroReelState.index, false);
  });

  const finePointer = window.matchMedia("(pointer: fine)");
  const stageMotion = { frame: 0, x: 0, y: 0 };
  const paintStageMotion = () => {
    stageMotion.frame = 0;
    const ambient = scenes[heroReelState.index]?.querySelector(".hero-scene__ambient img");
    if (!ambient) return;
    ambient.style.transform = `translate3d(${stageMotion.x}px, ${stageMotion.y}px, 0) scale(1.12)`;
  };
  const heroMotionHost = document.querySelector(".hero") || root;
  heroMotionHost.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || motionReduced || heroReelState.userPaused) return;
    const stage = scenes[heroReelState.index]?.querySelector(".hero-scene__stage");
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    stageMotion.x = Math.max(-4, Math.min(4, ((event.clientX - bounds.left) / bounds.width - .5) * -8));
    stageMotion.y = Math.max(-3, Math.min(3, ((event.clientY - bounds.top) / bounds.height - .5) * -6));
    if (!stageMotion.frame) stageMotion.frame = window.requestAnimationFrame(paintStageMotion);
  });
  heroMotionHost.addEventListener("pointerleave", () => {
    stageMotion.x = 0;
    stageMotion.y = 0;
    if (!stageMotion.frame) stageMotion.frame = window.requestAnimationFrame(paintStageMotion);
  });

  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      heroReelState.inView = entry.isIntersecting;
      activate(heroReelState.index, false);
    }, { threshold: .18 });
    observer.observe(hero);
  }
  document.addEventListener("visibilitychange", () => activate(heroReelState.index, false));
  compactViewport.addEventListener?.("change", () => {
    heroReelState.autoRotate = !saveData && !compactViewport.matches;
    activate(heroReelState.index, false);
  });
  systemReduceMotion.addEventListener?.("change", (event) => {
    if (readMotionPreference() === "full") return;
    motionReduced = event.matches;
    heroReelState.userPaused = event.matches || readMotionPreference() === "paused";
    updateToggle();
    activate(heroReelState.index, false);
  });
  updateToggle();
  activate(0);
}

function tapeCard(item, index, duplicate = false) {
  const title = escapeHtml(item.title);
  const label = escapeHtml(item.categoryLabel);
  const number = String(index + 1).padStart(2, "0");
  const { width, height } = mediaDimensions(item);
  const attrs = duplicate
    ? 'aria-hidden="true" tabindex="-1"'
    : `aria-label="${title} — abrir publicação original em nova aba"`;
  return `
    <a class="tape-card" href="${escapeHtml(item.permalink)}" target="_blank" rel="noopener" ${attrs}>
      <div class="tape-card__media" data-preview="${escapeHtml(item.preview || "")}" data-poster="${escapeHtml(item.cardImage)}">
        <img data-src="${escapeHtml(item.cardImage)}" width="${width}" height="${height}" alt="" decoding="async">
        <span class="tape-card__index">${number}</span>
        <span class="tape-card__play">${icon("play")}</span>
        <span class="tape-card__copy"><small>${label}</small><strong>${title}</strong></span>
      </div>
    </a>`;
}

function renderProofTape() {
  const root = document.querySelector("#proof-tape");
  if (!root) return;
  const preferred = ["ADKpionmFiw", "blYFchVi4xg", "DQfTWkhiK4k", "DTgXN2FiDV6", "DaBe_RIhl06", "DaQEv0Blj2s", "DYDiclAOSod", "DX_2dJiO8WZ", "DUf-ODMDWqA", "qBTk1irwDc4"];
  const library = [...projects, ...extraClips];
  const selected = preferred
    .map((id) => library.find((item) => item.id === id))
    .filter(Boolean);
  const visible = selected.length >= 8 ? selected : rankProjects(library).slice(0, 10);
  const group = (duplicate = false) => `<div class="proof-tape__group" ${duplicate ? 'aria-hidden="true"' : ""}>${visible.map((item, index) => tapeCard(item, index, duplicate)).join("")}</div>`;
  root.innerHTML = `<div class="proof-tape__track">${group()}${group(true)}</div>`;
  observeDeferredImages(root);
  attachPreview(root);
}

function renderFlagship() {
  const root = document.querySelector("#flagship-case");
  const proof = profile.automation?.proof;
  if (!root || !proof) return;

  root.innerHTML = `
    <a class="flagship-media reveal" href="${escapeHtml(proof.permalink)}" target="_blank" rel="noopener" aria-label="Abrir um corte do Negócio Sem Filtro no Instagram em nova aba">
      <img src="${escapeHtml(proof.poster)}" width="1284" height="2283" alt="Corte editado para o perfil Negócio Sem Filtro" loading="lazy" decoding="async">
      <span class="media-play">${icon("play")}</span>
    </a>
    <div class="flagship-copy reveal">
      <p class="case-label">${escapeHtml(proof.client)} · edição dos cortes do perfil</p>
      <h3>${escapeHtml(proof.title)}</h3>
      <p>${escapeHtml(proof.text)}</p>
      <div class="proof-signals">${proof.signals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}</div>
      <a class="button button--primary" href="${escapeHtml(proof.profile)}" target="_blank" rel="noopener">Ver perfil completo <span class="sr-only">(abre em nova aba)</span> ${icon("instagram")}</a>
      <div class="original-links">
        ${proof.links.map((link, index) => `
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(link.title)} — abrir publicação original em nova aba">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(link.title)}</strong>
            ${icon("arrow-up-right")}
          </a>`).join("")}
      </div>
    </div>`;
}

function renderProjects(filter = "todos") {
  const root = document.querySelector("#project-grid");
  const status = document.querySelector("#work-status");
  if (!root) return;

  const selectedExtras = extraClips.filter((item) => SHOWCASE_EXTRA_IDS.includes(item.id));
  const pool = filter === "lumiar" ? [...projects, ...extraClips] : [...projects, ...selectedExtras];
  const visible = filter === "todos"
    ? rankProjects(pool)
    : rankProjects(pool.filter((item) => projectGroup(item) === filter));

  root.innerHTML = visible.map(projectCard).join("");
  if (!visible.length) {
    root.innerHTML = `
      <div class="empty-state" role="status">
        <strong>Nenhum trabalho neste filtro.</strong>
        <span>Veja a seleção de projetos ou converse comigo sobre o formato que você procura.</span>
        <button type="button" data-clear-work-filter>Ver seleção</button>
      </div>`;
    root.querySelector("[data-clear-work-filter]")?.addEventListener("click", () => {
      document.querySelector('.filter[data-filter="todos"]')?.click();
    });
  }
  if (status) {
    const label = document.querySelector(`.filter[data-filter="${filter}"]`)?.textContent?.trim() || "Seleção";
    status.textContent = `${visible.length} ${visible.length === 1 ? "projeto" : "projetos"} · ${label} · publicação original`;
  }
  attachPreview(root);
  observeReveals(root);
  refreshIcons();
}

function renderExtras() {
  const root = document.querySelector("#clip-rail");
  if (!root) return;
  root.innerHTML = extraClips.filter((item) => !SHOWCASE_EXTRA_IDS.includes(item.id)).map(clipCard).join("");
  attachPreview(root);
}

function serviceCard(service) {
  const badge = service.badge || (service.featured ? "Escolha recomendada" : service.categoryLabel);
  return `
    <article class="service-card ${service.featured ? "service-card--featured" : ""} reveal" data-category="${escapeHtml(service.category)}" data-scope="${escapeHtml(service.title)}">
      <div class="service-card__top">
        <span>${escapeHtml(service.number)}</span>
        <span class="service-card__badge">${escapeHtml(badge || service.categoryLabel)}</span>
      </div>
      <h3>${escapeHtml(service.title)}</h3>
      <p class="service-card__description">${escapeHtml(service.description)}</p>
      <p class="service-card__price">${escapeHtml(service.price)}</p>
      <p class="service-card__detail">${escapeHtml(service.detail)}</p>
      <ul>${service.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <div class="service-card__terms">
        <span>${escapeHtml(service.timeline)}</span>
        <span>${escapeHtml(service.revisions)}</span>
        <span>${escapeHtml(service.payment)}</span>
        <span>${escapeHtml(service.scopeNote || "Escopo fechado")}</span>
      </div>
      <a class="service-cta" href="${serviceHref(service)}" target="_blank" rel="noopener" aria-label="Conversar sobre ${escapeHtml(service.title)} em nova aba">Quero conversar ${icon("arrow-up-right")}</a>
    </article>`;
}

function renderServices(category = "conteudo") {
  const root = document.querySelector("#service-list");
  if (!root) return;
  const selected = (profile.services || []).filter((service) => service.category === category);
  root.dataset.count = String(selected.length);
  root.innerHTML = selected.length
    ? selected.map(serviceCard).join("")
    : `
      <div class="empty-state empty-state--dark" role="status">
        <strong>Esta solução está sendo atualizada.</strong>
        <span>Você ainda pode me contar o objetivo e receber uma orientação direta.</span>
        <a href="${escapeHtml(profile.contact?.whatsapp || "#contato")}">Chamar no WhatsApp</a>
      </div>`;
  root.dataset.activeCategory = category;
  const activeTab = document.querySelector(`[data-service-filter="${category}"]`);
  const status = document.querySelector("#service-status");
  if (status) {
    const label = activeTab?.textContent?.trim() || "Serviços";
    status.textContent = `${label}: ${selected.length} ${selected.length === 1 ? "opção exibida" : "opções exibidas"}.`;
  }
  observeReveals(root);
  refreshIcons();
}

function renderContinuity() {
  const root = document.querySelector("#continuity-list");
  if (!root) return;
  root.innerHTML = (profile.continuity || []).map((item) => `
    <div class="continuity-item">
      <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.description)}</span></div>
      <b>${escapeHtml(item.price)}</b>
      <a href="${serviceHref(item)}" target="_blank" rel="noopener" aria-label="Conversar sobre ${escapeHtml(item.title)} em nova aba">Conversar ${icon("arrow-up-right")}</a>
    </div>`).join("");
}

function renderProcess() {
  const root = document.querySelector("#process-list");
  if (!root) return;
  root.innerHTML = (profile.methods || []).map((item, index) => `
    <article class="process-card reveal">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`).join("");
  observeReveals(root);
}

function renderFaq() {
  const root = document.querySelector("#faq-list");
  if (!root) return;
  root.innerHTML = (profile.faq || []).map((item, index) => `
    <details class="faq-item" ${index === 0 ? "open" : ""}>
      <summary>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.question)}</strong>
        ${icon("plus")}
      </summary>
      <div class="faq-item__body"><p>${escapeHtml(item.answer)}</p></div>
    </details>`).join("");

  root.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      root.querySelectorAll(".faq-item[open]").forEach((other) => {
        if (other !== item) other.removeAttribute("open");
      });
    });
  });
}

let deferredImageObserver;
function observeDeferredImages(root = document) {
  const images = [...root.querySelectorAll("img[data-src]")];
  if (!images.length) return;
  const load = (image) => {
    if (!image.dataset.src) return;
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };
  if (!("IntersectionObserver" in window)) {
    images.forEach(load);
    return;
  }
  if (!deferredImageObserver) {
    deferredImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        load(entry.target);
        deferredImageObserver.unobserve(entry.target);
      });
    }, { rootMargin: compactViewport.matches ? "140px 180px" : "500px 600px", threshold: .01 });
  }
  images.forEach((image) => deferredImageObserver.observe(image));
}

function isMotionPaused() {
  return motionReduced || Boolean(heroReelState?.userPaused) || document.documentElement.classList.contains("motion-paused");
}

function stopAllPreviewVideos() {
  document.querySelectorAll("[data-preview] > video").forEach((video) => {
    video.classList.remove("is-playing");
    video.pause();
    video.currentTime = 0;
    video.remove();
  });
}

function attachPreview(root = document) {
  if (saveData || motionReduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  root.querySelectorAll("[data-preview]").forEach((media) => {
    const source = media.dataset.preview;
    if (!source || media.dataset.bound === "true") return;
    media.dataset.bound = "true";

    let video;
    const start = () => {
      if (isMotionPaused()) return;
      if (!video) {
        video = document.createElement("video");
        video.src = source;
        video.poster = media.dataset.poster || "";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-hidden", "true");
      }
      const image = media.querySelector("img");
      if (image && !video.isConnected) image.insertAdjacentElement("afterend", video);
      const show = () => video.classList.add("is-playing");
      video.addEventListener("playing", show, { once: true });
      video.play().catch(() => {});
    };
    const stop = () => {
      if (!video) return;
      video.classList.remove("is-playing");
      video.pause();
      video.currentTime = 0;
      video.remove();
    };
    media.addEventListener("mouseenter", start);
    media.addEventListener("mouseleave", stop);
  });
}

let revealObserver;
function observeReveals(root = document) {
  if (isMotionPaused()) {
    root.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    return;
  }
  if (!("IntersectionObserver" in window)) {
    root.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -40px" });
  }
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => revealObserver.observe(item));
}

function refreshIcons() {
  document.querySelectorAll("i[data-lucide]").forEach((node) => {
    const name = node.dataset.lucide;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.setAttribute("class", `lucide lucide-${name}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    use.setAttribute("href", `${ICON_SPRITE}#${name}`);
    svg.append(use);
    node.replaceWith(svg);
  });
}

async function swapCollection(root, render) {
  if (!root || isMotionPaused()) {
    render();
    return;
  }
  const version = Number(root.dataset.swapVersion || 0) + 1;
  root.dataset.swapVersion = String(version);
  root.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  await Promise.all([...root.children].slice(0, 8).map((item, index) => item.animate([
    { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
    { opacity: 0, transform: "translateY(-4px)", filter: "blur(2px)" },
  ], {
    duration: 120,
    delay: index * 10,
    easing: "cubic-bezier(.4,0,1,1)",
    fill: "forwards",
  }).finished.catch(() => {})));
  if (Number(root.dataset.swapVersion) !== version) return;
  render();
  [...root.children].forEach((item, index) => item.animate([
    { opacity: 0, transform: "translateY(10px)", filter: "blur(2px)" },
    { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
  ], {
    duration: 360,
    delay: Math.min(index, 7) * 24,
    easing: "cubic-bezier(.16,1,.3,1)",
    fill: "both",
  }));
}

function syncServiceTabs(category) {
  document.querySelectorAll(".service-tab").forEach((item) => {
    const active = item.dataset.serviceFilter === category;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
    item.setAttribute("tabindex", active ? "0" : "-1");
  });
  const panel = document.querySelector("#service-list");
  panel?.setAttribute("aria-labelledby", `service-tab-${category}`);
}

async function selectServiceCategory(category, scroll = false) {
  const list = document.querySelector("#service-list");
  if (!list) return;
  if (list.dataset.activeCategory !== category) {
    await swapCollection(list, () => {
      syncServiceTabs(category);
      renderServices(category);
    });
  } else {
    syncServiceTabs(category);
  }
  if (scroll) {
    list.scrollIntoView({ behavior: isMotionPaused() ? "auto" : "smooth", block: "start" });
    document.querySelector(`[data-service-filter="${category}"]`)?.focus({ preventScroll: true });
  }
}

function bindFilters() {
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", async () => {
      document.querySelectorAll(".filter").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      await swapCollection(document.querySelector("#project-grid"), () => renderProjects(button.dataset.filter));
    });
  });

  const serviceTabs = [...document.querySelectorAll(".service-tab")];
  serviceTabs.forEach((button) => {
    button.addEventListener("click", async () => {
      await selectServiceCategory(button.dataset.serviceFilter);
    });
    button.addEventListener("keydown", (event) => {
      const current = serviceTabs.indexOf(button);
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % serviceTabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + serviceTabs.length) % serviceTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = serviceTabs.length - 1;
      else return;
      event.preventDefault();
      serviceTabs[next].focus();
      serviceTabs[next].click();
    });
  });

  document.querySelectorAll("[data-service-guide]").forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.dataset.serviceGuide;
      document.querySelectorAll("[data-service-guide]").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      await selectServiceCategory(category, true);
    });
  });
}

function bindMoreWork() {
  const details = document.querySelector(".more-work");
  if (!details) return;
  const ensureRendered = () => {
    if (!details.open || details.dataset.rendered === "true") return;
    details.dataset.rendered = "true";
    renderExtras();
  };
  details.addEventListener("toggle", ensureRendered);
  ensureRendered();
}

function bindShowcaseToggle() {
  const toggle = document.querySelector("#showcase-toggle");
  const viewport = document.querySelector(".proof-tape__viewport");
  if (!toggle || !viewport) return;

  const renderState = (paused) => {
    viewport.classList.toggle("is-paused", paused);
    toggle.setAttribute("aria-pressed", paused ? "true" : "false");
    toggle.innerHTML = `${icon(paused ? "play" : "pause")}<span>${paused ? "Continuar faixa" : "Pausar faixa"}</span>`;
  };

  renderState(motionReduced || savedMotionMode === "paused");
  toggle.addEventListener("click", () => {
    const paused = !viewport.classList.contains("is-paused");
    renderState(paused);
    if (paused) stopAllPreviewVideos();
  });
}

function bindContact() {
  const contact = profile.contact || {};
  const setHref = (selector, href) => {
    const node = document.querySelector(selector);
    if (node && href) node.href = href;
  };
  setHref("#contact-button", contact.whatsapp);
  setHref("#nav-contact", contact.whatsapp);
  const emailBody = ["Objetivo:", "", "Prazo:", "", "Material ou referências:"].join("\n");
  setHref("#email-link", `mailto:${contact.email}?subject=${encodeURIComponent("Projeto com Enzo Marinho")}&body=${encodeURIComponent(emailBody)}`);
  setHref("#instagram-link", contact.instagram);
  setHref("#linkedin-link", contact.linkedin);
}

function bindScroll() {
  const bar = document.querySelector(".scroll-progress span");
  const nav = document.querySelector(".site-nav");
  const nativeProgress = Boolean(window.CSS?.supports?.("animation-timeline", "scroll()"));
  if (bar && nativeProgress) bar.classList.add("is-css-driven");
  let ticking = false;
  const update = () => {
    if (bar && !nativeProgress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
    ticking = false;
  };
  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };
  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function init() {
  refreshIcons();
  renderHeroShowreel();
  renderProofTape();
  renderFlagship();
  renderProjects();
  renderServices();
  renderContinuity();
  renderProcess();
  renderFaq();
  bindFilters();
  bindMoreWork();
  bindShowcaseToggle();
  bindContact();
  bindScroll();
  attachPreview();
  observeReveals();
  document.querySelector("#year").textContent = new Date().getFullYear();
}

init();
