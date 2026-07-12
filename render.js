const profile = window.PROFILE || {};
const projects = window.CASES || [];
const extraClips = window.EXTRA_CLIPS || [];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;

function serviceHref(service) {
  const message = [
    "Oi Enzo, vi seu portfólio e quero conversar sobre:",
    service.title,
    `Investimento anunciado: ${service.price}`,
    "Meu objetivo é:",
  ].join("\n");
  return `https://wa.me/5518981196746?text=${encodeURIComponent(message)}`;
}

function projectGroup(item) {
  if (item.client === "VOTI Software") return "voti";
  if (item.client === "Negócio Sem Filtro" || item.category === "long-form" || item.category === "automacao") return "sistemas";
  return "independentes";
}

function projectCard(item) {
  const classes = [
    "project-card",
    item.layout === "wide" ? "project-card--wide" : "",
    item.orientation === "landscape" ? "project-card--landscape" : "",
    "reveal",
  ].filter(Boolean).join(" ");

  return `
    <article class="${classes}" data-group="${projectGroup(item)}">
      <a class="project-card__link" href="${escapeHtml(item.permalink)}" target="_blank" rel="noopener" aria-label="Abrir ${escapeHtml(item.title)} na publicação original">
        <div class="project-card__media" data-preview="${escapeHtml(item.preview || "")}" data-poster="${escapeHtml(item.cardImage)}">
          <img src="${escapeHtml(item.cardImage)}" alt="Capa do projeto ${escapeHtml(item.title)}" loading="lazy">
          <span class="project-card__tag">${escapeHtml(item.categoryLabel)}</span>
          <span class="media-play">${icon("arrow-up-right")}</span>
        </div>
        <div class="project-card__info">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.direction || item.deliverable)}</p>
          <div class="project-card__meta">
            <span>${escapeHtml(item.client)} · ${escapeHtml(item.year)}</span>
            <span>Publicação original</span>
          </div>
        </div>
      </a>
    </article>`;
}

function clipCard(item) {
  return `
    <a class="clip-card" href="${escapeHtml(item.permalink)}" target="_blank" rel="noopener" aria-label="Abrir ${escapeHtml(item.title)} na publicação original">
      <div class="clip-card__media" data-preview="${escapeHtml(item.preview || "")}" data-poster="${escapeHtml(item.cardImage)}">
        <img src="${escapeHtml(item.cardImage)}" alt="Capa de ${escapeHtml(item.title)}" loading="lazy">
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.client)} · publicação original</p>
    </a>`;
}

function renderFlagship() {
  const root = document.querySelector("#flagship-case");
  const proof = profile.automation?.proof;
  if (!root || !proof) return;

  root.innerHTML = `
    <a class="flagship-media reveal" href="${escapeHtml(proof.permalink)}" target="_blank" rel="noopener" aria-label="Abrir um corte do Negócio Sem Filtro no Instagram">
      <img src="${escapeHtml(proof.poster)}" alt="Corte editado para o perfil Negócio Sem Filtro">
      <span class="media-play">${icon("play")}</span>
    </a>
    <div class="flagship-copy reveal">
      <p class="case-label">${escapeHtml(proof.client)} · edição completa do perfil</p>
      <h3>${escapeHtml(proof.title)}</h3>
      <p>${escapeHtml(proof.text)}</p>
      <div class="proof-signals">${proof.signals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}</div>
      <a class="button button--primary" href="${escapeHtml(proof.profile)}" target="_blank" rel="noopener">Ver perfil completo ${icon("instagram")}</a>
      <div class="original-links">
        ${proof.links.map((link, index) => `
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">
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

  const visible = filter === "todos"
    ? projects
    : projects.filter((item) => projectGroup(item) === filter);

  root.innerHTML = visible.map(projectCard).join("");
  if (status) {
    status.textContent = `${visible.length} ${visible.length === 1 ? "projeto" : "projetos"} · Todos abrem na publicação original`;
  }
  attachPreview(root);
  observeReveals(root);
  refreshIcons();
}

function renderExtras() {
  const root = document.querySelector("#clip-rail");
  if (!root) return;
  root.innerHTML = extraClips.map(clipCard).join("");
  attachPreview(root);
}

function serviceCard(service) {
  const badge = service.featured ? "Escolha mais completa" : service.badge;
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
      <a class="service-cta" href="${serviceHref(service)}" target="_blank" rel="noopener">Quero este serviço ${icon("arrow-up-right")}</a>
    </article>`;
}

function renderServices(category = "conteudo") {
  const root = document.querySelector("#service-list");
  if (!root) return;
  const selected = (profile.services || []).filter((service) => service.category === category);
  root.innerHTML = selected.map(serviceCard).join("");
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
    <article class="faq-item ${index === 0 ? "is-open" : ""}">
      <button type="button" aria-expanded="${index === 0 ? "true" : "false"}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.question)}</strong>
        ${icon("plus")}
      </button>
      <div class="faq-item__body"><p>${escapeHtml(item.answer)}</p></div>
    </article>`).join("");

  root.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const willOpen = !item.classList.contains("is-open");
      root.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector("button")?.setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
  refreshIcons();
}

function attachPreview(root = document) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  root.querySelectorAll("[data-preview]").forEach((media) => {
    const source = media.dataset.preview;
    if (!source || media.dataset.bound === "true") return;
    media.dataset.bound = "true";

    let video;
    const start = () => {
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
      video.play().catch(() => {});
    };
    const stop = () => {
      if (!video) return;
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
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function bindFilters() {
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderProjects(button.dataset.filter);
    });
  });

  document.querySelectorAll(".service-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".service-tab").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-selected", "true");
      renderServices(button.dataset.serviceFilter);
    });
  });
}

function bindContact() {
  const contact = profile.contact || {};
  const setHref = (selector, href) => {
    const node = document.querySelector(selector);
    if (node && href) node.href = href;
  };
  setHref("#contact-button", contact.whatsapp);
  setHref("#email-link", `mailto:${contact.email}?subject=${encodeURIComponent("Projeto com Enzo Marinho")}`);
  setHref("#instagram-link", contact.instagram);
  setHref("#linkedin-link", contact.linkedin);
  setHref("#youtube-link", contact.youtube);
}

function bindScroll() {
  const bar = document.querySelector(".scroll-progress span");
  const update = () => {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function init() {
  renderFlagship();
  renderProjects();
  renderExtras();
  renderServices();
  renderContinuity();
  renderProcess();
  renderFaq();
  bindFilters();
  bindContact();
  bindScroll();
  observeReveals();
  refreshIcons();
  document.querySelector("#year").textContent = new Date().getFullYear();
}

init();
