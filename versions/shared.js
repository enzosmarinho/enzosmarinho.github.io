(() => {
  const profile = window.PROFILE || {};
  const source = [...(window.CASES || []), ...(window.EXTRA_CLIPS || [])];
  const uniqueProjects = [...new Map(source.map((item) => [item.id, item])).values()];
  const byId = new Map(uniqueProjects.map((item) => [item.id, item]));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const whatsapp = profile.contact?.whatsapp || "https://wa.me/5518981196746";
  const assetPrefix = document.body?.dataset.assetPrefix ?? "../../";
  let syncViewportVideos = () => {};
  const reelFeatureIds = new Set([
    "DQfTWkhiK4k",
    "qBTk1irwDc4",
    "blYFchVi4xg",
    "DGLMxcXRRJ4",
    "DUf-ODMDWqA",
    "ADKpionmFiw",
    "DaBe_RIhl06",
  ]);

  document.documentElement.classList.add("js-enabled");

  const escapeHtml = (value = "") => String(value)
    .replaceAll(/[—–]/g, " - ")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const splitIds = (value = "") => value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const projectImage = (item) => item?.cardImage || item?.thumb || item?.poster || "";
  const projectLink = (item) => item?.permalink || "#contato";

  function projectFromId(id) {
    return byId.get(id);
  }

  function mediaMarkup(item, {
    eager = false,
    video = true,
    autoplay = false,
    viewportPlayback = false,
  } = {}) {
    if (!item) return "";
    const image = projectImage(item);
    const preview = item.preview;
    const width = Number(item.heroWidth || (item.orientation === "landscape" ? 1280 : 720));
    const height = Number(item.heroHeight || (item.orientation === "landscape" ? 720 : 1280));
    const imageMarkup = image
      ? `<img src="${assetPrefix}${escapeHtml(image)}" width="${width}" height="${height}" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
      : "";
    const videoMarkup = video && preview
      ? `<video src="${assetPrefix}${escapeHtml(preview)}" ${image ? `poster="${assetPrefix}${escapeHtml(image)}"` : ""} muted loop playsinline ${autoplay && !reducedMotion.matches ? "autoplay" : ""} preload="${autoplay ? "metadata" : "none"}" ${viewportPlayback ? 'data-viewport-playback="true"' : ""} aria-hidden="true"></video>`
      : "";
    return `${imageMarkup}${videoMarkup}`;
  }

  function renderHeroCollages() {
    document.querySelectorAll(".js-hero-collage").forEach((root) => {
      const items = splitIds(root.dataset.items).map(projectFromId).filter(Boolean);
      root.innerHTML = items.map((item, index) => `
        <a class="hero-media hero-media--${index + 1}" href="${escapeHtml(projectLink(item))}" target="_blank" rel="noopener" aria-label="Abrir ${escapeHtml(item.title)}, trabalho para ${escapeHtml(item.client)}">
          ${mediaMarkup(item, { eager: index < 2, viewportPlayback: true })}
        </a>
      `).join("");
    });
  }

  function renderReels() {
    document.querySelectorAll(".js-reel-track").forEach((track) => {
      const items = splitIds(track.dataset.items).map(projectFromId).filter(Boolean);
      const repeated = [...items, ...items];
      track.innerHTML = repeated.map((item, index) => {
        const originalIndex = index % items.length;
        const modifiers = [
          item.orientation === "landscape" ? "reel-card--landscape" : "",
          reelFeatureIds.has(item.id) ? "reel-card--feature" : "",
          !reelFeatureIds.has(item.id) && originalIndex % 5 === 4 ? "reel-card--compact" : "",
        ].filter(Boolean).join(" ");
        return `
        <a class="reel-card ${modifiers}" href="${escapeHtml(projectLink(item))}" target="_blank" rel="noopener" aria-label="Abrir ${escapeHtml(item.title)}, trabalho para ${escapeHtml(item.client)}" ${index >= items.length ? 'aria-hidden="true" tabindex="-1"' : ""}>
          ${mediaMarkup(item, { video: true, viewportPlayback: true })}
        </a>
      `;
      }).join("");
    });
  }

  function renderWork() {
    document.querySelectorAll(".js-work-grid").forEach((grid) => {
      const items = splitIds(grid.dataset.items).map(projectFromId).filter(Boolean);
      grid.innerHTML = items.map((item, index) => `
        <article class="work-card reveal" style="--delay:${index * 45}ms">
          <a class="work-card__media" href="${escapeHtml(projectLink(item))}" target="_blank" rel="noopener" aria-label="Abrir ${escapeHtml(item.title)}">
            ${mediaMarkup(item, { video: true, viewportPlayback: true })}
            <span class="work-card__open" aria-hidden="true">↗</span>
          </a>
          <div class="work-card__copy${item.result ? " work-card__copy--has-result" : ""}">
            <p>${escapeHtml(item.client)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <span>${escapeHtml(item.role || item.categoryLabel || item.format || "Conteúdo")}</span>
            ${item.result ? `<strong><b>Resultado</b>${escapeHtml(item.result)}</strong>` : ""}
          </div>
        </article>
      `).join("");
    });
  }

  function serviceHref(service) {
    const message = [
      "Oi Enzo, vi seu portfólio e quero conversar sobre:",
      service.title,
      "Meu objetivo:",
      "Meu prazo:",
      "Material que já tenho:",
    ].join("\n");
    return `https://wa.me/5518981196746?text=${encodeURIComponent(message)}`;
  }

  function renderServices() {
    const services = profile.services || [];
    document.querySelectorAll(".js-services").forEach((root) => {
      const requested = splitIds(root.dataset.services);
      const items = requested
        .map((title) => services.find((service) => service.title === title))
        .filter(Boolean);
      root.innerHTML = items.map((service, index) => `
        <article class="service-card reveal" style="--delay:${index * 55}ms">
          <div class="service-card__top">
            <span>${escapeHtml(service.categoryLabel || "Entrega")}</span>
            <span>${escapeHtml(service.timeline)}</span>
          </div>
          <h3>${escapeHtml(service.title)}</h3>
          <p>${escapeHtml(service.description)}</p>
          <div class="service-card__detail">${escapeHtml(service.detail)}</div>
          <div class="service-card__footer">
            <strong>Escopo definido na conversa</strong>
            <a href="${escapeHtml(serviceHref(service))}" target="_blank" rel="noopener">Pedir esta entrega <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      `).join("");
    });
  }

  function bindContactLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.href = whatsapp;
    });
  }

  function bindViewportPlayback() {
    const videos = [...document.querySelectorAll("video[data-viewport-playback]")];
    if (!videos.length) return;
    const visibleVideos = new Set();
    let animationFrame = 0;

    videos.forEach((video) => {
      video.dataset.inView = "false";
      video.pause();
    });

    const sync = () => {
      animationFrame = 0;
      const paused = reducedMotion.matches || document.documentElement.classList.contains("motion-paused");
      const limit = window.matchMedia("(max-width: 760px)").matches ? 3 : 6;
      const viewportCenter = window.innerHeight / 2;
      const ranked = [...visibleVideos]
        .filter((video) => video.isConnected)
        .sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return Math.abs((aRect.top + aRect.bottom) / 2 - viewportCenter)
            - Math.abs((bRect.top + bRect.bottom) / 2 - viewportCenter);
        });

      videos.forEach((video) => {
        const shouldPlay = !paused && ranked.indexOf(video) > -1 && ranked.indexOf(video) < limit;
        if (shouldPlay) video.play().catch(() => {});
        else video.pause();
      });
    };

    const scheduleSync = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(sync);
    };

    syncViewportVideos = scheduleSync;
    if (reducedMotion.matches) return;
    if (!("IntersectionObserver" in window)) {
      videos.forEach((video) => {
        video.dataset.inView = "true";
        visibleVideos.add(video);
      });
      scheduleSync();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        video.dataset.inView = String(entry.isIntersecting);
        if (entry.isIntersecting) visibleVideos.add(video);
        else visibleVideos.delete(video);
      });
      scheduleSync();
    }, { rootMargin: "120px 0px", threshold: 0.04 });

    videos.forEach((video) => observer.observe(video));
  }

  function bindMotionControl() {
    const buttons = [...document.querySelectorAll("[data-motion-toggle]")];
    if (!buttons.length) return;

    const applyState = (paused) => {
      document.documentElement.classList.toggle("motion-paused", paused);
      document.querySelectorAll("video:not([data-viewport-playback])").forEach((video) => {
        if (video.dataset.manualPlayback === "true") return;
        if (paused) video.pause();
        else video.play().catch(() => {});
      });
      syncViewportVideos();
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(paused));
        const label = button.querySelector("[data-motion-label]");
        if (label) label.textContent = paused ? "Retomar faixa" : "Pausar faixa";
      });
    };

    let paused = reducedMotion.matches;
    applyState(paused);
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        paused = !paused;
        applyState(paused);
      });
    });
    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) {
        paused = true;
        applyState(true);
      }
    });
  }

  function prepareMotionGroups() {
    const selectors = [
      ".section-heading",
      ".process-copy",
      ".faq",
      ".contact > .shell",
      ".fable-heading",
      ".fable-work__heading",
      ".method-lead",
      ".work-stage",
      ".fable-contact__copy",
    ];

    document.querySelectorAll(selectors.join(",")).forEach((group) => {
      group.classList.add("motion-group");
      [...group.children].forEach((child, index) => {
        child.style.setProperty("--motion-order", String(index));
      });
    });
  }

  function bindReveals() {
    const nodes = [...document.querySelectorAll(".reveal, .motion-group")];
    if (!nodes.length || reducedMotion.matches || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach((node) => observer.observe(node));
  }

  function bindActiveNavigation() {
    if (!("IntersectionObserver" in window)) return;
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const entriesBySection = new Map();
    const pairs = links
      .map((link) => [link, document.querySelector(link.getAttribute("href"))])
      .filter(([, section]) => section);
    if (!pairs.length) return;

    const apply = () => {
      const active = [...entriesBySection.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      pairs.forEach(([link, section]) => {
        if (section === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entriesBySection.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      apply();
    }, { rootMargin: "-12% 0px -52% 0px", threshold: [0, .1, .25, .5, .75] });

    pairs.forEach(([, section]) => observer.observe(section));
  }

  function bindDetails() {
    document.querySelectorAll(".faq details").forEach((detail) => {
      const summary = detail.querySelector("summary");
      summary?.setAttribute("aria-expanded", String(detail.open));
      detail.addEventListener("toggle", () => {
        summary?.setAttribute("aria-expanded", String(detail.open));
        if (!detail.open) return;
        document.querySelectorAll(".faq details").forEach((other) => {
          if (other !== detail) other.open = false;
        });
      });
    });
  }

  function signalPageReady() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.documentElement.classList.add("page-ready"));
    });
  }

  renderHeroCollages();
  renderReels();
  renderWork();
  renderServices();
  bindContactLinks();
  bindViewportPlayback();
  bindMotionControl();
  prepareMotionGroups();
  bindReveals();
  bindActiveNavigation();
  bindDetails();
  signalPageReady();
})();
