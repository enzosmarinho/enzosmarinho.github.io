(() => {
  const profile = window.PROFILE || {};
  const library = [...(window.CASES || []), ...(window.EXTRA_CLIPS || [])];
  const projects = new Map(library.map((item) => [item.id, item]));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const assetPrefix = document.body?.dataset.assetPrefix ?? "../../";
  const workIndex = document.querySelector(".js-work-index");
  const workPreview = document.querySelector(".js-work-preview");
  const proposalRoot = document.querySelector(".js-proposal-routes");

  const escapeHtml = (value = "") => String(value)
    .replaceAll(/[—–]/g, " - ")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const splitIds = (value = "") => value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const projectImage = (item) => item?.cardImage || item?.thumb || item?.poster || "";
  const projectLink = (item) => item?.permalink || "#contato";

  function previewMedia(item, index) {
    const image = projectImage(item);
    const preview = item.preview;
    const width = Number(item.heroWidth || (item.orientation === "landscape" ? 1280 : 720));
    const height = Number(item.heroHeight || (item.orientation === "landscape" ? 720 : 1280));
    return `
      <div class="work-preview__layer${index === 0 ? " is-active" : ""}" data-preview-id="${escapeHtml(item.id)}">
        <img src="${assetPrefix}${escapeHtml(image)}" width="${width}" height="${height}" alt="" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
        ${preview ? `<video src="${assetPrefix}${escapeHtml(preview)}" poster="${assetPrefix}${escapeHtml(image)}" muted loop playsinline preload="none" data-manual-playback="true" aria-hidden="true"></video>` : ""}
      </div>
    `;
  }

  function mobileMedia(item) {
    const image = projectImage(item);
    const width = Number(item.heroWidth || (item.orientation === "landscape" ? 1280 : 720));
    const height = Number(item.heroHeight || (item.orientation === "landscape" ? 720 : 1280));
    return `<span class="work-index__mobile-media"><img src="${assetPrefix}${escapeHtml(image)}" width="${width}" height="${height}" alt="" loading="lazy" decoding="async"></span>`;
  }

  function syncPreviewVideos() {
    if (!workPreview) return;
    const paused = reducedMotion.matches || document.documentElement.classList.contains("motion-paused");
    workPreview.querySelectorAll(".work-preview__layer").forEach((layer) => {
      const video = layer.querySelector("video");
      if (!video) return;
      if (paused || !layer.classList.contains("is-active")) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    });
  }

  function activateProject(id) {
    if (!workIndex || !workPreview) return;
    workIndex.querySelectorAll("[data-project-id]").forEach((row) => {
      const active = row.dataset.projectId === id;
      row.classList.toggle("is-active", active);
      row.querySelector("a")?.setAttribute("aria-current", active ? "true" : "false");
    });
    workPreview.querySelectorAll("[data-preview-id]").forEach((layer) => {
      layer.classList.toggle("is-active", layer.dataset.previewId === id);
    });
    syncPreviewVideos();
  }

  function renderWorkIndex() {
    if (!workIndex || !workPreview) return;
    const items = splitIds(workIndex.dataset.items).map((id) => projects.get(id)).filter(Boolean);
    workPreview.innerHTML = items.map(previewMedia).join("");
    workIndex.innerHTML = items.map((item, index) => `
      <li class="work-index__row${index === 0 ? " is-active" : ""}" data-project-id="${escapeHtml(item.id)}">
        <a href="${escapeHtml(projectLink(item))}" target="_blank" rel="noopener" aria-current="${index === 0 ? "true" : "false"}">
          ${mobileMedia(item)}
          <span class="work-index__title">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.client)}</small>
          </span>
          <span class="work-index__role">${escapeHtml(item.role || item.categoryLabel || "Conteúdo")}</span>
          <i aria-hidden="true">↗</i>
        </a>
      </li>
    `).join("");

    workIndex.querySelectorAll("[data-project-id]").forEach((row) => {
      const activate = () => activateProject(row.dataset.projectId);
      row.addEventListener("pointerenter", activate);
      row.addEventListener("focusin", activate);
    });

    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) activateProject(visible.target.dataset.projectId);
      }, { rootMargin: "-24% 0px -48% 0px", threshold: [0.2, 0.5, 0.8] });
      workIndex.querySelectorAll("[data-project-id]").forEach((row) => observer.observe(row));
    }

    activateProject(items[0]?.id);
  }

  const routeDefinitions = [
    {
      id: "conteudo",
      verb: "Publico",
      title: "Transformo pauta em presença constante",
      summary: "Roteirizo, edito e desdobro o material em peças coerentes, prontas para circular.",
      services: ["Conteúdo que Já Sai Pronto", "Episódio em Campanha"],
    },
    {
      id: "presenca",
      verb: "Explico",
      title: "Construo páginas que conduzem",
      summary: "Organizo a oferta, provo valor e desenho um caminho claro até o contato.",
      services: ["Landing Page Estratégica", "Site Profissional Enxuto"],
    },
    {
      id: "sistemas",
      verb: "Organizo",
      title: "Automatizo sem complicar",
      summary: "Localizo o gargalo e tiro a repetição do caminho com limite claro e documentação.",
      services: ["Diagnóstico com Direção", "Automação Útil com IA"],
    },
  ];

  const serviceDescriptions = {
    "Conteúdo que Já Sai Pronto": "Recebo o material, encontro a mensagem e devolvo uma pequena campanha pronta para publicar.",
    "Episódio em Campanha": "Transformo uma gravação longa em episódio principal, cortes e peças que continuam gerando atenção.",
    "Landing Page Estratégica": "Construo uma página enxuta para explicar a oferta, provar valor e conduzir até o contato.",
    "Site Profissional Enxuto": "Reúno serviços, trabalhos e caminhos de contato em um site pequeno, rápido e autoral.",
    "Diagnóstico com Direção": "Leio o negócio, organizo prioridades e indico o próximo passo antes de ampliar o investimento.",
    "Automação Útil com IA": "Automatizo uma tarefa repetitiva e bem definida sem prometer um robô que toca a empresa sozinho.",
  };

  function routeHref(route) {
    const message = [
      "Oi, Enzo. Encontrei o portfólio e quero conversar sobre:",
      route.title,
      "Meu objetivo:",
      "Meu prazo:",
      "Material que já tenho:",
    ].join("\n");
    return `https://wa.me/5518981196746?text=${encodeURIComponent(message)}`;
  }

  function renderProposals() {
    if (!proposalRoot) return;
    const services = profile.services || [];
    proposalRoot.innerHTML = routeDefinitions.map((route, routeIndex) => {
      const routeServices = route.services
        .map((title) => services.find((service) => service.title === title))
        .filter(Boolean);
      return `
        <details class="proposal-route" data-route="${route.id}" ${routeIndex === 0 ? "open" : ""}>
          <summary>
            <span>${escapeHtml(route.verb)}</span>
            <strong>${escapeHtml(route.title)}</strong>
            <p>${escapeHtml(route.summary)}</p>
            <i aria-hidden="true"></i>
          </summary>
          <div class="proposal-route__panel">
            <div class="proposal-route__modes">
              ${routeServices.map((service) => `
                <article>
                  <span>${escapeHtml(service.categoryLabel || "Entrega")} · ${escapeHtml(service.timeline)}</span>
                  <h3>${escapeHtml(service.title)}</h3>
                  <p>${escapeHtml(serviceDescriptions[service.title] || service.description)}</p>
                  <small>${escapeHtml(service.detail)}</small>
                </article>
              `).join("")}
            </div>
            <a href="${escapeHtml(routeHref(route))}" target="_blank" rel="noopener">Começar por aqui <span aria-hidden="true">↗</span></a>
          </div>
        </details>
      `;
    }).join("");

    const details = [...proposalRoot.querySelectorAll("details")];
    details.forEach((detail) => {
      detail.addEventListener("toggle", () => {
        if (!detail.open) return;
        details.forEach((other) => {
          if (other !== detail) other.open = false;
        });
      });
    });

    document.querySelectorAll("[data-route-link]").forEach((link) => {
      link.addEventListener("click", () => {
        const target = proposalRoot.querySelector(`[data-route="${link.dataset.routeLink}"]`);
        if (!target) return;
        details.forEach((detail) => {
          detail.open = detail === target;
        });
      });
    });
  }

  renderWorkIndex();
  renderProposals();
  document.querySelector("[data-motion-toggle]")?.addEventListener("click", syncPreviewVideos);
  reducedMotion.addEventListener?.("change", syncPreviewVideos);
})();
