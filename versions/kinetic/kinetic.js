(() => {
  "use strict";

  const profile = window.PROFILE || {};
  const source = [...(window.CASES || []), ...(window.EXTRA_CLIPS || [])];
  const works = [...new Map(source.map((item) => [item.id || item.permalink, item])).values()];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 48rem)");
  const saveData = Boolean(navigator.connection?.saveData);
  const assetPrefix = document.body.dataset.assetPrefix || "";

  const CATEGORIES = {
    conteudo: "Conteúdo",
    anuncios: "Campanha",
    direcao: "Direção",
    "long-form": "Long-form",
    edicao: "Edição",
    automacao: "Sistemas",
  };

  const HERO_IDS = [
    "qBTk1irwDc4",
    "ADKpionmFiw",
    "DaBe_RIhl06",
    "DQfTWkhiK4k",
    "DXiIx4_kQ-0",
    "DZUo3jokhkP",
    "DYC7byPyEnW",
    "DGLMxcXRRJ4",
    "DZGeYPdBiet",
    "DUf-ODMDWqA",
    "DSldztZCA9P",
    "DWpa8TQCKvX",
  ];

  const HERO_PROXIES = {
    qBTk1irwDc4: "assets/hero-wall/voti-visita.mp4",
    DaBe_RIhl06: "assets/hero-wall/negocio-sem-filtro.mp4",
    ADKpionmFiw: "assets/hero-wall/kayky-long-form.mp4",
  };

  const HERO_POSTERS = Object.fromEntries([
    "qBTk1irwDc4",
    "DaBe_RIhl06",
    "ADKpionmFiw",
    "DQfTWkhiK4k",
    "DYC7byPyEnW",
    "DUf-ODMDWqA",
    "DXiIx4_kQ-0",
  ].map((id) => [id, `assets/hero-wall/${id}.webp`]));

  const HERO_SLOTS = [
    { x: -34, y: -25, z: -90, r: -6, scale: 0.88 },
    { x: -16, y: -29, z: 92, r: 4, scale: 0.97 },
    { x: 5, y: -30, z: 150, r: -3, scale: 1.03 },
    { x: 27, y: -24, z: -46, r: 6, scale: 0.9 },
    { x: 38, y: -7, z: 68, r: -4, scale: 0.95 },
    { x: 31, y: 14, z: 136, r: 5, scale: 1 },
    { x: 18, y: 29, z: -56, r: -6, scale: 0.88 },
    { x: -3, y: 31, z: 104, r: 4, scale: 0.97 },
    { x: -24, y: 27, z: -82, r: 6, scale: 0.87 },
    { x: -38, y: 10, z: 84, r: -4, scale: 0.96 },
    { x: -40, y: -8, z: -118, r: 5, scale: 0.84 },
    { x: -24, y: -5, z: 164, r: -3, scale: 1.04 },
  ];

  const SERVICES = [
    {
      title: "Marketing de operação",
      text: "Pauta, roteiro, captação, edição e publicação conectados à rotina comercial e ao produto.",
      proof: "Prova: VOTI",
      href: "#provas",
    },
    {
      title: "Vídeo longo e desdobramentos",
      text: "Produção completa de uma conversa longa e transformação do material em cortes com função própria.",
      proof: "Prova: Kayky Pitondo",
      href: "#formatos",
    },
    {
      title: "Cortes, teasers e curadoria",
      text: "Seleção dos trechos mais fortes, hierarquia editorial, edição vertical, legendas e ritmo de publicação.",
      proof: "Prova: Negócio Sem Filtro",
      href: "#formatos",
    },
    {
      title: "Campanhas e presença digital",
      text: "Conceito, copy, peças e páginas pensadas para dar consistência à presença da marca em cada ponto de contato.",
      proof: "Provas: Magnos, Lumiar e 8848",
      href: "#arquivo",
    },
  ];

  const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const cleanText = (value = "") => String(value)
    .replace(/[—–]/g, " - ")
    .replace(/·/g, " / ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const safe = (value = "") => escapeHtml(cleanText(value));
  const asset = (path = "") => {
    if (!path || /^(?:https?:|data:|\/)/.test(path)) return path;
    return `${assetPrefix}${path}`;
  };
  const imageFor = (item) => item?.cardImage || item?.thumb || item?.poster || "";
  const previewFor = (item) => HERO_PROXIES[item?.id] || item?.preview || item?.video || "";
  const itemById = (id) => works.find((item) => item.id === id);
  const categoryLabel = (item) => CATEGORIES[item?.category] || cleanText(item?.categoryLabel || "Projeto");
  const destinationFor = (item) => {
    if (item?.client === "VOTI Software") return { key: "voti", label: "VOTI", href: "#provas" };
    if (item?.client === "Kayky Pitondo") return { key: "kayky", label: "Kayky", href: "#formatos" };
    if (item?.client === "Negócio Sem Filtro") return { key: "nsf", label: "Negócio Sem Filtro", href: "#formatos" };
    return { key: "fade", label: "Arquivo", href: "#arquivo" };
  };
  const featuredHeroItems = () => {
    const limit = compactViewport.matches ? 9 : 12;
    return HERO_IDS.map(itemById).filter(Boolean).slice(0, limit);
  };

  function relationshipFor(item) {
    if (item?.client === "VOTI Software") return { label: "Trabalho atual", type: "employment" };
    if (item?.client === "Lumiar Parfum") return { label: "Histórico encerrado", type: "historical" };
    return { label: "Projeto independente", type: "independent" };
  }

  function mediaLink(item, className = "", ambient = false) {
    const image = imageFor(item);
    const preview = previewFor(item);
    return `
      <a class="media-link ${escapeHtml(className)}"
         data-orientation="${escapeHtml(item?.orientation || "portrait")}"
         href="${escapeHtml(item?.permalink || "#arquivo")}"
         target="_blank"
         rel="noopener"
         aria-label="Abrir ${safe(item?.title || "trabalho")} na publicação original"
         ${preview && !ambient ? `data-preview-src="${escapeHtml(asset(preview))}"` : ""}>
        <img src="${escapeHtml(asset(image))}"
             alt=""
             width="${escapeHtml(item?.heroWidth || (item?.orientation === "landscape" ? 1280 : 720))}"
             height="${escapeHtml(item?.heroHeight || (item?.orientation === "landscape" ? 720 : 1280))}"
             loading="lazy"
             decoding="async">
        ${ambient && preview ? `
          <video data-ambient-video
                 data-section-video
                 data-work-id="${escapeHtml(item?.id || "")}"
                 data-src="${escapeHtml(asset(preview))}"
                 muted
                 loop
                 playsinline
                 preload="none"
                 poster="${escapeHtml(asset(image))}"
                 aria-hidden="true"></video>` : ""}
      </a>`;
  }

  function renderHeroWall() {
    const host = document.querySelector("[data-hero-wall]");
    if (!host) return;

    const featured = featuredHeroItems();
    host.innerHTML = featured.map((item, index) => {
      const poster = asset(HERO_POSTERS[item.id] || imageFor(item));
      const preview = asset(previewFor(item));
      const landscape = item.orientation === "landscape";
      const destination = destinationFor(item);
      const slot = HERO_SLOTS[index] || HERO_SLOTS[index % HERO_SLOTS.length];
      const depth = Math.max(0.48, Math.min(1, (slot.z + 180) / 350));
      const orbitX = slot.x * 1.06;
      const orbitY = slot.y * 0.92;
      const orbitZ = slot.z * 0.7;
      return `
        <figure class="hero-tile"
                style="
                  --index:${index};
                  --layer:${Math.round(slot.z + 180)};
                  --depth:${depth.toFixed(3)};
                  --sphere-transform:translate3d(calc(-50% + ${slot.x}vw),calc(-50% + ${slot.y}vh),${slot.z}px) rotateZ(${slot.r}deg) scale(${slot.scale});
                  --orbit-transform:translate3d(calc(-50% + ${orbitX.toFixed(2)}vw),calc(-50% + ${orbitY.toFixed(2)}vh),${orbitZ.toFixed(1)}px) rotateZ(${(-slot.r * 0.55).toFixed(2)}deg) scale(${(slot.scale * 0.96).toFixed(3)});
                "
                data-hero-id="${escapeHtml(item.id)}"
                data-destination="${destination.key}"
                data-orientation="${landscape ? "landscape" : "portrait"}"
                data-depth="${depth.toFixed(2)}">
          <div class="hero-tile__surface">
            <img src="${escapeHtml(poster)}"
                 alt=""
                 width="${landscape ? 1280 : 720}"
                 height="${landscape ? 720 : 1280}"
                 ${index === 0 ? 'fetchpriority="high"' : ""}
                 loading="${index < 8 ? "eager" : "lazy"}"
                 decoding="async">
            ${preview ? `
              <video data-ambient-video
                     data-hero-video
                     data-work-id="${escapeHtml(item.id)}"
                     data-src="${escapeHtml(preview)}"
                     muted
                     loop
                     playsinline
                     preload="none"
                     poster="${escapeHtml(poster)}"
                     aria-hidden="true"></video>` : ""}
            <figcaption>
              <span>${safe(item.client)}</span>
              <b>${safe(item.title)}</b>
            </figcaption>
          </div>
        </figure>`;
    }).join("");
  }

  function renderHeroDestinations() {
    const host = document.querySelector("[data-hero-destinations]");
    if (!host) return;

    const featured = featuredHeroItems();
    const groups = [
      { key: "voti", label: "VOTI", eyebrow: "Trabalho atual", href: "#provas" },
      { key: "kayky", label: "Kayky", eyebrow: "Long-form + cortes", href: "#formatos" },
      { key: "nsf", label: "Negócio Sem Filtro", eyebrow: "Curadoria + cortes", href: "#formatos" },
    ];

    host.innerHTML = groups.map((group) => {
      const count = featured.filter((item) => destinationFor(item).key === group.key).length;
      if (!count) return "";
      return `
      <a class="hero-destination"
         data-hero-destination="${group.key}"
         href="${group.href}"
         tabindex="-1"
         aria-label="Ir para ${escapeHtml(group.label)}, ${count} ${count === 1 ? "vídeo" : "vídeos"}">
        <span>${safe(group.eyebrow)}</span>
        <b>${safe(group.label)}</b>
        <small>${count} ${count === 1 ? "vídeo" : "vídeos"}</small>
      </a>`;
    }).join("");
  }

  function syncHeroDestinationGeometry() {
    const tiles = [...document.querySelectorAll("[data-hero-id]")];
    if (!tiles.length) return;

    const votiTargets = compactViewport.matches
      ? [[-23, 17], [3, 17], [-11, 38], [17, 38]]
      : [
        [-35, 18], [-22, 18], [-9, 18],
        [-35, 38], [-22, 38], [-9, 38],
      ];
    const destinationIndexes = new Map();

    tiles.forEach((tile, index) => {
      const destination = tile.dataset.destination || "fade";
      const localIndex = destinationIndexes.get(destination) || 0;
      destinationIndexes.set(destination, localIndex + 1);

      if (destination === "voti") {
        const [x, y] = votiTargets[localIndex] || votiTargets[votiTargets.length - 1];
        const landscape = tile.dataset.orientation === "landscape";
        tile.style.setProperty(
          "--settle-transform",
          `translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),0) rotateZ(0deg) scale(${compactViewport.matches ? (landscape ? 0.58 : 0.62) : (landscape ? 0.72 : 0.68)})`,
        );
        tile.style.setProperty("--destination-opacity", "1");
        tile.style.setProperty("--destination-filter", "brightness(0.9) saturate(0.95)");
        return;
      }

      if (destination === "kayky") {
        const x = compactViewport.matches ? -10 + localIndex * 16 : 3 + localIndex * 11;
        const y = compactViewport.matches ? 59 + localIndex * 5 : 62 + localIndex * 5;
        tile.style.setProperty(
          "--settle-transform",
          `translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),-90px) rotateZ(${localIndex % 2 ? -2 : 2}deg) scale(${compactViewport.matches ? 0.56 : 0.62})`,
        );
        tile.style.setProperty("--destination-opacity", compactViewport.matches ? "0.62" : "0.72");
        tile.style.setProperty("--destination-filter", "brightness(0.52) saturate(0.74)");
        return;
      }

      if (destination === "nsf") {
        const x = compactViewport.matches ? 19 : 32;
        const y = compactViewport.matches ? 62 + localIndex * 5 : 61 + localIndex * 5;
        tile.style.setProperty(
          "--settle-transform",
          `translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),-110px) rotateZ(-2deg) scale(${compactViewport.matches ? 0.54 : 0.6})`,
        );
        tile.style.setProperty("--destination-opacity", compactViewport.matches ? "0.5" : "0.64");
        tile.style.setProperty("--destination-filter", "brightness(0.5) saturate(0.72)");
        return;
      }

      const side = index % 2 ? 1 : -1;
      tile.style.setProperty(
        "--settle-transform",
        `translate3d(calc(-50% + ${side * (43 + localIndex * 3)}vw),calc(-50% + ${46 + localIndex * 5}vh),-180px) rotateZ(${side * 8}deg) scale(0.64)`,
      );
      tile.style.setProperty("--destination-opacity", "0");
      tile.style.setProperty("--destination-filter", "brightness(0.28) blur(3px)");
    });
  }

  function setupHeroChoreography(forceMotion = false) {
    const hero = document.querySelector(".hero");
    const sentinel = document.querySelector(".hero__settle-sentinel");
    const supportsScrollTimeline = Boolean(
      CSS.supports?.("animation-timeline", "scroll()")
      || CSS.supports?.("animation-timeline", "scroll(root)"),
    );
    const nativeTimeline = supportsScrollTimeline && !reducedMotion.matches;

    document.documentElement.classList.toggle("has-scroll-timeline", nativeTimeline);
    document.documentElement.classList.toggle("no-scroll-timeline", !nativeTimeline);
    if ((!forceMotion && reducedMotion.matches) || !hero || !sentinel) return;
    if (hero.dataset.choreographyReady === "true") return;
    hero.dataset.choreographyReady = "true";

    const setSettled = (settled) => {
      hero.classList.toggle("is-settled", settled);
      hero.querySelector("[data-hero-destinations]")?.setAttribute("aria-hidden", String(!settled));
      hero.querySelectorAll("[data-hero-destination]").forEach((destination) => {
        destination.tabIndex = settled ? 0 : -1;
      });
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        setSettled(entries.some((entry) => entry.isIntersecting));
      }, { rootMargin: "0px 0px 18% 0px" });
      observer.observe(sentinel);
    } else {
      setSettled(true);
    }
  }

  function setupPointerField(forceMotion = false) {
    const sticky = document.querySelector(".hero__sticky");
    const orbit = document.querySelector("[data-hero-orbit]");
    const tiles = [...document.querySelectorAll(".hero-tile")];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (
      !sticky
      || !orbit
      || !tiles.length
      || (!forceMotion && reducedMotion.matches)
      || !finePointer.matches
      || sticky.dataset.pointerReady === "true"
    ) return;
    sticky.dataset.pointerReady = "true";

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.11;
      currentY += (targetY - currentY) * 0.11;
      orbit.style.transform = `perspective(1500px) rotateX(${(-currentY * 2.2).toFixed(3)}deg) rotateY(${(currentX * 3.8).toFixed(3)}deg)`;
      sticky.style.setProperty("--pointer-x", `${((currentX + 1) * 50).toFixed(2)}%`);
      sticky.style.setProperty("--pointer-y", `${((currentY + 1) * 50).toFixed(2)}%`);

      const moving = Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002;
      if (moving) {
        frame = requestAnimationFrame(render);
        return;
      }

      frame = 0;
      if (targetX === 0 && targetY === 0) {
        orbit.style.transform = "";
        sticky.style.removeProperty("--pointer-x");
        sticky.style.removeProperty("--pointer-y");
        sticky.classList.remove("is-pointer-active");
      }
    };

    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    sticky.addEventListener("pointermove", (event) => {
      targetX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2));
      targetY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2));
      sticky.classList.add("is-pointer-active");
      requestRender();
    }, { passive: true });

    sticky.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      requestRender();
    });
  }

  function setupAmbientMotion() {
    const button = document.querySelector("[data-motion-toggle]");
    const status = document.querySelector("[data-motion-status]");
    const videos = [...document.querySelectorAll("[data-ambient-video]")];
    const visibilityRatios = new Map();
    let activeVideos = new Set();
    const playheads = new Map();
    let userPaused = reducedMotion.matches || saveData;
    let userOptIn = false;

    if (!button || !videos.length) {
      if (button) button.hidden = true;
      return;
    }

    const systemBlocksMotion = () => reducedMotion.matches || saveData;
    const motionAllowed = () => userOptIn || !systemBlocksMotion();

    const setControl = () => {
      const needsOptIn = systemBlocksMotion() && !userOptIn;
      button.hidden = false;
      button.setAttribute("aria-pressed", String(needsOptIn || userPaused));
      button.textContent = needsOptIn
        ? "Ativar movimento"
        : userPaused
          ? "Retomar vídeos"
          : "Pausar vídeos";
      if (status) {
        status.textContent = needsOptIn
          ? "Movimento desligado por preferência do sistema ou economia de dados. Você pode ativá-lo manualmente."
          : userPaused
            ? "Vídeos pausados."
            : "Vídeos em movimento.";
      }
    };

    const rememberPlayhead = (video) => {
      const id = video.dataset.workId;
      if (!id || !Number.isFinite(video.currentTime)) return;
      playheads.set(id, video.currentTime);
    };

    const chooseActiveVideos = () => {
      const byWork = new Map();
      videos.forEach((video) => {
        const ratio = visibilityRatios.get(video) || 0;
        if (ratio <= 0) return;
        const id = video.dataset.workId || `anonymous-${videos.indexOf(video)}`;
        const current = byWork.get(id);
        if (!current || ratio > current.ratio) byWork.set(id, { video, ratio });
      });
      return new Set([...byWork.values()].map((entry) => entry.video));
    };

    const refreshActiveVideos = () => {
      const previousActive = activeVideos;
      activeVideos.forEach((video) => rememberPlayhead(video));
      activeVideos = chooseActiveVideos();
      activeVideos.forEach((video) => {
        if (!previousActive.has(video)) video.dataset.needsPlayheadSync = "true";
      });
    };

    const restorePlayhead = (video) => {
      const saved = playheads.get(video.dataset.workId);
      if (!Number.isFinite(saved) || !video.duration || video.readyState < 1) return false;
      video.currentTime = Math.min(saved % video.duration, Math.max(0, video.duration - 0.05));
      return true;
    };

    const hydrateVideo = (video) => {
      if (video.dataset.hydrated === "true" || !motionAllowed()) return;
      video.dataset.hydrated = "true";
      video.src = video.dataset.src || "";
      video.addEventListener("loadedmetadata", () => {
        restorePlayhead(video);
        delete video.dataset.needsPlayheadSync;
      }, { once: true });
      video.addEventListener("playing", () => {
        video.closest(".hero-tile, .media-link")?.classList.add("is-playing");
      });
      video.load();
    };

    const syncVideo = (video) => {
      const shouldPlay = motionAllowed()
        && !userPaused
        && !document.hidden
        && activeVideos.has(video);

      if (!shouldPlay) {
        rememberPlayhead(video);
        video.pause();
        return;
      }
      hydrateVideo(video);
      if (video.dataset.needsPlayheadSync === "true" && restorePlayhead(video)) {
        delete video.dataset.needsPlayheadSync;
      }
      video.play().catch(() => {});
    };

    const sync = () => {
      const globallyPaused = !motionAllowed() || userPaused || document.hidden;
      document.documentElement.classList.toggle("motion-paused", globallyPaused);
      videos.forEach(syncVideo);
      setControl();
    };

    button.addEventListener("click", () => {
      if (systemBlocksMotion() && !userOptIn) {
        userOptIn = true;
        userPaused = false;
        document.documentElement.classList.add("motion-opt-in");
        setupHeroChoreography(true);
        setupPointerField(true);
        setupPreviewPlayback(true);
        syncHeroDestinationGeometry();
        sync();
        return;
      }
      userPaused = !userPaused;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener?.("change", () => {
      if (!systemBlocksMotion() && !userOptIn) {
        userPaused = false;
        setupHeroChoreography();
        setupPointerField();
        setupPreviewPlayback();
        syncHeroDestinationGeometry();
      }
      sync();
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          visibilityRatios.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        refreshActiveVideos();
        sync();
      }, { threshold: [0, 0.03, 0.25, 0.5, 0.75, 1], rootMargin: "18% 0px 18%" });
      videos.forEach((video) => observer.observe(video));
    } else {
      videos.forEach((video) => visibilityRatios.set(video, 1));
      refreshActiveVideos();
    }

    setControl();
    if (!motionAllowed()) return;
    const scheduleSync = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(sync, { timeout: 900 });
      } else {
        window.setTimeout(sync, 250);
      }
    };
    if (document.readyState === "complete") scheduleSync();
    else window.addEventListener("load", scheduleSync, { once: true });
  }

  function renderVoti() {
    const host = document.querySelector("[data-voti-wall]");
    if (!host) return;
    const priority = [
      "qBTk1irwDc4",
      "DQfTWkhiK4k",
      "DXiIx4_kQ-0",
      "DSldztZCA9P",
      "DWpa8TQCKvX",
      "DKkdTYyItAy",
      "DGLMxcXRRJ4",
      "DUJfuJsCPir",
    ];
    const items = priority.map(itemById).filter(Boolean);
    host.innerHTML = items.map((item) => mediaLink(item, "voti-card", true)).join("");
  }

  function renderKayky() {
    const host = document.querySelector("[data-kayky-case]");
    const longForm = itemById("ADKpionmFiw");
    const cuts = ["DZUo3jokhkP", "DZGeYPdBiet"].map(itemById).filter(Boolean);
    if (!host || !longForm) return;

    host.innerHTML = `
      <div class="kayky__copy">
        <p class="case-role">Produção completa / Long-form / Cortes</p>
        <h3 id="kayky-title">Kayky Pitondo</h3>
        <p>${safe(longForm.direction || longForm.deliverable || longForm.role)}</p>
        <a class="case-cta" href="${escapeHtml(longForm.permalink)}" target="_blank" rel="noopener">
          Ver vídeo longo
        </a>
      </div>
      ${mediaLink(longForm, "kayky__long", true)}
      <div class="kayky__cuts" aria-label="Cortes derivados do vídeo longo">
        ${cuts.map((item) => mediaLink(item, "", true)).join("")}
      </div>`;
  }

  function renderNsf() {
    const host = document.querySelector("[data-nsf-case]");
    const main = itemById("DaBe_RIhl06");
    const supporting = ["DaNgCEIFkJB", "DaFxmK1DjRc"].map(itemById).filter(Boolean);
    if (!host || !main) return;

    host.innerHTML = `
      <div class="nsf__copy">
        <p class="case-role">Curadoria / Cortes / Teasers</p>
        <h3 id="nsf-title">Negócio Sem Filtro</h3>
        <p>${safe(main.direction || main.deliverable || main.role)}</p>
        <a class="case-cta" href="${escapeHtml(main.permalink)}" target="_blank" rel="noopener">
          Ver publicação
        </a>
      </div>
      <div class="nsf__media">
        ${[main, ...supporting].map((item) => mediaLink(item, "", Boolean(previewFor(item)))).join("")}
      </div>`;
  }

  function renderServices() {
    const host = document.querySelector("[data-services]");
    if (!host) return;
    host.innerHTML = SERVICES.map((service) => `
      <article class="service">
        <h3>${safe(service.title)}</h3>
        <div class="service__body">
          <p>${safe(service.text)}</p>
          <p class="service__proof">${safe(service.proof)}</p>
        </div>
        <a class="button button--ghost button--small" href="${escapeHtml(service.href)}">Ver prova</a>
      </article>`).join("");
  }

  function renderArchive() {
    const filtersHost = document.querySelector("[data-filters]");
    const grid = document.querySelector("[data-work-grid]");
    const status = document.querySelector("[data-work-status]");
    if (!filtersHost || !grid) return;

    const categories = [...new Set(works.map((item) => item.category).filter((key) => CATEGORIES[key]))];
    const filters = [
      { key: "all", label: "Todos", count: works.length },
      ...categories.map((key) => ({
        key,
        label: CATEGORIES[key],
        count: works.filter((item) => item.category === key).length,
      })),
    ];

    filtersHost.innerHTML = filters.map((filter, index) => `
      <button type="button"
              data-filter="${escapeHtml(filter.key)}"
              aria-pressed="${index === 0 ? "true" : "false"}">
        ${safe(filter.label)} <span>${String(filter.count).padStart(2, "0")}</span>
      </button>`).join("");

    grid.innerHTML = works.map((item) => {
      const relationship = relationshipFor(item);
      const image = imageFor(item);
      const preview = previewFor(item);
      return `
        <a class="work-card"
           data-work-category="${escapeHtml(item.category || "")}"
           data-orientation="${escapeHtml(item.orientation || "portrait")}"
           ${preview ? `data-preview-src="${escapeHtml(asset(preview))}"` : ""}
           href="${escapeHtml(item.permalink || "#analise")}"
           target="_blank"
           rel="noopener">
          <div class="work-card__media">
            <img src="${escapeHtml(asset(image))}"
                 alt=""
                 width="${escapeHtml(item.heroWidth || (item.orientation === "landscape" ? 1280 : 720))}"
                 height="${escapeHtml(item.heroHeight || (item.orientation === "landscape" ? 720 : 1280))}"
                 loading="lazy"
                 decoding="async">
          </div>
          <div class="work-card__body">
            <span class="work-card__relation" data-relation="${relationship.type}">${safe(relationship.label)}</span>
            <h3>${safe(item.title)}</h3>
            <p>${safe(item.client)} / ${safe(categoryLabel(item))} / ${safe(item.year || "")}</p>
          </div>
        </a>`;
    }).join("");

    const buttons = [...filtersHost.querySelectorAll("[data-filter]")];
    const cards = [...grid.querySelectorAll("[data-work-category]")];

    const applyFilter = (key) => {
      let visible = 0;
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === key));
      });
      cards.forEach((card) => {
        const matches = key === "all" || card.dataset.workCategory === key;
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (status) status.textContent = `${visible} trabalhos exibidos.`;
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

  function renderMethod() {
    const host = document.querySelector("[data-method]");
    if (!host) return;
    host.innerHTML = (profile.methods || []).map((item, index) => `
      <article class="method-item">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>${safe(item.title)}</h3>
          <p>${safe(item.text)}</p>
        </div>
      </article>`).join("");
  }

  function renderDiagnostic() {
    const factorsHost = document.querySelector("[data-diagnostic-factors]");
    if (factorsHost) {
      factorsHost.innerHTML = (profile.diagnostic?.factors || []).map((factor, index) => `
        <article class="factor">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${safe(factor.title)}</h3>
          <p>${safe(factor.text)}</p>
        </article>`).join("");
    }

    const promise = document.querySelector("[data-diagnostic-promise]");
    if (promise) promise.textContent = cleanText(profile.diagnostic?.promise || "");

    const form = document.querySelector("[data-diagnostic]");
    const status = document.querySelector("[data-form-status]");
    const draftWrap = document.querySelector("[data-diagnostic-draft-wrap]");
    const draft = document.querySelector("[data-diagnostic-draft]");
    const draftLink = document.querySelector("[data-diagnostic-link]");
    const levelHost = document.querySelector("[data-diagnostic-level]");
    const prioritiesHost = document.querySelector("[data-diagnostic-priorities]");
    if (!form) return;

    const analyzeRequest = (values) => {
      const businessScores = {
        "Profissional solo": 0,
        "Pequena operação": 1,
        "Equipe em crescimento": 2,
        "Empresa estruturada": 3,
      };
      const timingScores = {
        "Sem data rígida": 0,
        "Quero avançar neste mês": 1,
        "Preciso em até duas semanas": 2,
        "Existe uma data fixa": 2,
      };
      const materialScores = {
        "Já existe e está organizado": 0,
        "Existe, mas precisa de curadoria": 1,
        "Ainda precisa ser produzido": 2,
        "Não sei avaliar": 1,
      };
      const approvalScores = {
        "Uma pessoa decide": 0,
        "Uma equipe pequena": 1,
        "Múltiplas áreas ou gestores": 2,
        "Ainda não está definido": 1,
      };
      const needPriorities = {
        "Conteúdo e presença": "Definir mensagem, formatos e cadência de publicação",
        "Oferta e site": "Clarificar oferta, provas e jornada da página",
        "Operação e automação": "Mapear o gargalo antes de escolher a ferramenta",
        "Ainda preciso descobrir": "Começar pelo diagnóstico e pela prioridade do negócio",
      };

      const business = String(values.get("business") || "");
      const timing = String(values.get("timing") || "");
      const material = String(values.get("material") || "");
      const approval = String(values.get("approval") || "");
      const score = (businessScores[business] || 0)
        + (timingScores[timing] || 0)
        + (materialScores[material] || 0)
        + (approvalScores[approval] || 0);
      const level = score <= 2
        ? "Projeto enxuto, com decisão direta"
        : score <= 5
          ? "Operação em crescimento, com escopo coordenado"
          : "Operação estruturada, com mais dependências";
      const priorities = [needPriorities[String(values.get("need") || "")]].filter(Boolean);

      if (material === "Ainda precisa ser produzido") {
        priorities.push("Planejar a produção do material de origem");
      } else if (material === "Existe, mas precisa de curadoria") {
        priorities.push("Organizar e selecionar o material já disponível");
      }
      if (approval === "Múltiplas áreas ou gestores") {
        priorities.push("Definir responsáveis e etapas de aprovação");
      }
      if (timing === "Preciso em até duas semanas" || timing === "Existe uma data fixa") {
        priorities.push("Travar marcos e riscos antes de assumir o prazo");
      }
      if (priorities.length === 1) {
        priorities.push("Confirmar objetivo, entregáveis e critério de sucesso");
      }

      return { level, priorities };
    };

    const buildDraft = (values) => {
      const analysis = analyzeRequest(values);
      const lines = [
        "Oi Enzo, vi seu portfólio e quero pedir uma análise.",
        "",
        `Leitura inicial: ${analysis.level}`,
        `Prioridades prováveis: ${analysis.priorities.join("; ")}`,
        "",
        `Necessidade: ${values.get("need")}`,
        `Contexto: ${values.get("business")}`,
        `Prazo: ${values.get("timing")}`,
        `Material: ${values.get("material")}`,
        `Aprovação: ${values.get("approval")}`,
      ];
      if (values.get("reference")) lines.push(`Site ou perfil: ${values.get("reference")}`);
      if (values.get("outcome")) lines.push(`Resultado esperado: ${values.get("outcome")}`);

      return {
        analysis,
        lines,
        text: lines.join("\n"),
        url: `https://wa.me/5518981196746?text=${encodeURIComponent(lines.join("\n"))}`,
      };
    };

    const syncDraft = () => {
      if (!draftWrap || !draft || !draftLink) return null;
      const payload = buildDraft(new FormData(form));
      draft.textContent = payload.text;
      draftLink.href = payload.url;
      if (levelHost) levelHost.textContent = payload.analysis.level;
      if (prioritiesHost) {
        prioritiesHost.innerHTML = payload.analysis.priorities
          .map((priority) => `<li>${safe(priority)}</li>`)
          .join("");
      }
      draftWrap.hidden = false;
      return payload;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      syncDraft();
      if (status) {
        status.textContent = "Pedido preparado. Revise a mensagem e abra no WhatsApp quando quiser.";
      }
      levelHost?.focus();
    });

    form.addEventListener("input", () => {
      if (draftWrap?.hidden) return;
      syncDraft();
      if (status) status.textContent = "Rascunho atualizado.";
    });

    form.addEventListener("change", () => {
      if (draftWrap?.hidden) return;
      syncDraft();
      if (status) status.textContent = "Rascunho atualizado.";
    });
  }

  function setupPreviewPlayback(forceMotion = false) {
    if (
      (!forceMotion && (reducedMotion.matches || saveData))
      || !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    const targets = [...document.querySelectorAll("[data-preview-src]")];
    targets.forEach((target) => {
      if (target.dataset.previewReady === "true") return;
      target.dataset.previewReady = "true";
      let video;
      const media = target.matches(".media-link")
        ? target
        : target.querySelector(".work-card__media");

      const play = () => {
        if (!media) return;
        if (!video) {
          video = document.createElement("video");
          video.src = target.dataset.previewSrc || "";
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = "metadata";
          video.setAttribute("aria-hidden", "true");
          media.append(video);
        }
        video.play().then(() => target.classList.add("is-playing")).catch(() => {});
      };

      const pause = () => {
        if (!video) return;
        video.pause();
        target.classList.remove("is-playing");
      };

      target.addEventListener("pointerenter", play);
      target.addEventListener("pointerleave", pause);
      target.addEventListener("focusin", play);
      target.addEventListener("focusout", pause);
    });
  }

  function setupReveal() {
    const selector = [
      ".voti__intro",
      ".voti-card",
      ".formats__head",
      ".kayky__copy",
      ".kayky__long",
      ".kayky__cuts .media-link",
      ".nsf__copy",
      ".nsf__media .media-link",
      ".services__head",
      ".service",
      ".archive__head",
      ".work-card",
      ".method__head",
      ".method-item",
      ".analysis__head",
      ".factor",
      ".diagnostic",
    ].join(",");
    const elements = [...document.querySelectorAll(selector)];
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    elements.forEach((element) => element.classList.add("reveal-pending"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    elements.forEach((element) => observer.observe(element));
  }

  function init() {
    renderHeroWall();
    renderHeroDestinations();
    renderVoti();
    renderKayky();
    renderNsf();
    renderServices();
    renderArchive();
    renderMethod();
    renderDiagnostic();
    requestAnimationFrame(() => {
      syncHeroDestinationGeometry();
      requestAnimationFrame(syncHeroDestinationGeometry);
    });
    window.addEventListener("resize", () => requestAnimationFrame(syncHeroDestinationGeometry), { passive: true });
    setupHeroChoreography();
    setupPointerField();
    setupAmbientMotion();
    setupPreviewPlayback();
    setupReveal();
    document.documentElement.classList.add("ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
