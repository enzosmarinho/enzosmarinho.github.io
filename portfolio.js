(() => {
  "use strict";
  const C = window.PortfolioCore;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (text = "") =>
    String(text).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const projects = [...window.CASES, ...window.EXTRA_CLIPS];
  const byId = new Map(projects.map((p) => [p.id, p]));
  const STORE = "enzo-portfolio-personal-v1";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compact = matchMedia("(max-width: 760px)");
  const saveData = navigator.connection?.saveData === true;
  const editable = $$("[data-edit]");
  const originalHtml = new Map(
    editable.map((el) => [el.dataset.edit, el.innerHTML]),
  );
  const originalTexts = new Map(
    editable.map((el) => {
      const copy = el.cloneNode(true);
      $$("br", copy).forEach((br) => br.replaceWith("\uE000"));
      return [
        el.dataset.edit,
        copy.textContent.replace(/\s+/g, " ").trim().replaceAll("\uE000", "\n"),
      ];
    }),
  );
  const keys = [...originalTexts.keys()];
  let settings = C.sanitizeSettings({}, keys);
  let storageAvailable = true;
  try {
    settings = C.sanitizeSettings(
      JSON.parse(localStorage.getItem(STORE) || "{}"),
      keys,
    );
  } catch {
    storageAvailable = false;
  }
  document.documentElement.classList.add("js");
  const film = $("#film-dialog");
  const filmVideo = $("video", film);
  const demo = $("#demo-video");
  let heroVisible = true;
  let explicitPlaying = false;
  let raf = 0,
    last = 0,
    seconds = 0;
  let stageWidth = 0,
    stageHeight = 0;
  const ratios = new Map();
  const pendingPlay = new WeakSet();
  let mediaReady = false;
  let selectedMedia = new Set();

  function media(item, ambient = true) {
    const image = item.cardImage || item.thumb || item.poster;
    const ratio = `${item.heroWidth}/${item.heroHeight}`;
    const content = item.preview
      ? `<video ${ambient ? `data-ambient="${esc(item.preview)}"` : ""} data-poster="${esc(image)}" width="${item.heroWidth}" height="${item.heroHeight}" muted loop playsinline preload="none" aria-label="Prévia sem áudio: ${esc(item.title)}"></video>`
      : `<img src="${esc(image)}" width="${item.heroWidth}" height="${item.heroHeight}" loading="lazy" alt="">`;
    return `<button class="feature-media" type="button" data-work="${esc(item.id)}" style="--ratio:${ratio}" aria-label="Ver ${esc(item.title)} e a participação de Enzo">${content}<span class="media-open" aria-hidden="true">↗</span></button>`;
  }
  const features = {
    ADKpionmFiw: {
      heading: "Um treino inteiro.\nUma história que continua.",
      description:
        "Do vídeo longo aos cortes verticais: produção completa para acompanhar o treino de Kayky Pitondo com clareza e ritmo.",
    },
    "DXiIx4_kQ-0": {
      heading: "Tema técnico,\nconversa clara.",
      description:
        "Uma dor de gestão vira uma abertura direta, com demonstração na tela para acompanhar o raciocínio.",
    },
    DaBe_RIhl06: {
      heading: "A conversa rende\nmais histórias.",
      description:
        "Curadoria de trechos, edição de cortes e teasers para levar as conversas do podcast a outros formatos.",
    },
  };
  $$("[data-feature]").forEach((el) => {
    const item = byId.get(el.dataset.feature),
      copy = features[item.id];
    el.innerHTML = `${media(item)}<div class="feature-content"><p class="feature-meta"><span>${esc(item.client)}</span><span>${C.relationship(item)}</span></p><h3 class="feature-title">${esc(copy.heading).replaceAll("\n", "<br>")}</h3><p class="feature-description">${esc(copy.description)}</p><p class="role-line">${esc(item.role)}</p><button class="underlined" type="button" data-work="${esc(item.id)}">Por dentro do projeto <span aria-hidden="true">↗</span></button></div>`;
  });
  const satelliteIds = ["DXiIx4_kQ-0", "ADKpionmFiw", "DaBe_RIhl06"];
  $("[data-satellites]").innerHTML = satelliteIds
    .map((id) => {
      const item = byId.get(id);
      // Small, existing derivatives are appropriate at this display size.
      const source =
        id === "ADKpionmFiw"
          ? "assets/hero-wall/kayky-long-form.mp4"
          : id === "DaBe_RIhl06"
            ? "assets/hero-wall/negocio-sem-filtro.mp4"
            : item.preview;
      return `<button type="button" class="satellite" data-work="${id}" data-orientation="${item.orientation}" aria-label="Ver trabalho: ${esc(item.client)}"><video data-ambient="${source}" poster="assets/hero-wall/${id}.webp" muted loop playsinline preload="none" aria-hidden="true"></video><span class="satellite-label">${esc(item.client)}</span></button>`;
    })
    .join("");
  const satellites = $$(".satellite");

  function positionSatellites() {
    satellites.forEach((el, i) => {
      const p = C.orbitPosition(
        i,
        seconds,
        stageWidth,
        stageHeight,
        reduced.matches,
      );
      el.style.transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`;
      el.style.zIndex = String(p.z);
    });
  }
  function tick(time) {
    raf = 0;
    if (last) seconds += Math.min((time - last) / 1000, 0.1);
    last = time;
    positionSatellites();
    if (
      settings.motion &&
      heroVisible &&
      !document.hidden &&
      !film.open &&
      !$("#settings-dialog").open &&
      !reduced.matches
    )
      raf = requestAnimationFrame(tick);
  }
  function syncOrbit() {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    positionSatellites();
    if (
      settings.motion &&
      heroVisible &&
      !document.hidden &&
      !film.open &&
      !$("#settings-dialog").open &&
      !reduced.matches
    )
      raf = requestAnimationFrame(tick);
  }
  function ambientAllowed(video) {
    return (
      mediaReady &&
      settings.motion &&
      !saveData &&
      !document.hidden &&
      !film.open &&
      !$("#settings-dialog").open &&
      !explicitPlaying &&
      (ratios.get(video) || 0) > 0 &&
      (!video.closest("#arquivo") || $("#arquivo").open)
    );
  }
  function syncMedia() {
    const cap = compact.matches ? 3 : 4;
    const active = [...ratios.keys()]
      .filter((v) => v.isConnected && ambientAllowed(v))
      .sort(
        (a, b) =>
          Number(b.classList.contains("hero-portrait")) -
            Number(a.classList.contains("hero-portrait")) ||
          ratios.get(b) - ratios.get(a),
      )
      .slice(0, cap);
    const selected = new Set(active);
    selectedMedia = selected;
    for (const video of ratios.keys()) {
      if (!selected.has(video)) {
        video.pause();
        continue;
      }
      const source =
        compact.matches && video.classList.contains("hero-portrait")
          ? "assets/identity/enzo-hero-mobile.mp4"
          : video.dataset.ambient;
      if (video.getAttribute("src") !== source) {
        video.src = source;
        video.muted = true;
      }
      if (video.paused && !pendingPlay.has(video)) {
        pendingPlay.add(video);
        video
          .play()
          .then(() => {
            if (!ambientAllowed(video) || !selectedMedia.has(video))
              video.pause();
          })
          .catch(() => {})
          .finally(() => pendingPlay.delete(video));
      }
    }
  }
  const mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        ratios.set(entry.target, entry.intersectionRatio),
      );
      syncMedia();
    },
    { threshold: [0, 0.15, 0.5] },
  );
  const posterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.poster = entry.target.dataset.poster;
        posterObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "400px" },
  );
  function observeMedia(parent = document) {
    $$("[data-poster]", parent).forEach((video) =>
      posterObserver.observe(video),
    );
    $$("[data-ambient]", parent).forEach((video) => {
      ratios.set(video, 0);
      mediaObserver.observe(video);
    });
  }
  new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      syncOrbit();
    },
    { threshold: 0 },
  ).observe($("#inicio"));
  new ResizeObserver(([entry]) => {
    stageWidth = entry.contentRect.width;
    stageHeight = entry.contentRect.height;
    positionSatellites();
  }).observe($(".hero-visual"));
  observeMedia();
  const startMedia = () => {
    mediaReady = true;
    syncMedia();
  };
  if ("requestIdleCallback" in window)
    requestIdleCallback(startMedia, { timeout: 1200 });
  else setTimeout(startMedia, 250);

  let archiveFilter = "Todos";
  const clients = ["Todos", ...new Set(projects.map((p) => p.client))];
  $("[data-total]").textContent = `${projects.length} peças`;
  $("[data-filters]").innerHTML = clients
    .map(
      (client) =>
        `<button type="button" data-filter="${esc(client)}" aria-pressed="${client === archiveFilter}">${esc(client)}</button>`,
    )
    .join("");
  function renderArchive() {
    const grid = $("[data-archive-grid]");
    $$("[data-ambient]", grid).forEach((v) => {
      v.pause();
      mediaObserver.unobserve(v);
      posterObserver.unobserve(v);
      ratios.delete(v);
    });
    const visible = projects.filter(
      (item) => archiveFilter === "Todos" || item.client === archiveFilter,
    );
    grid.innerHTML = visible
      .map(
        (item) =>
          `<article class="archive-card" data-orientation="${item.orientation}" data-id="${esc(item.id)}">${media(item)}<h3>${esc(item.title)}</h3><p>${esc(item.client)} · ${C.relationship(item)}</p><p>${esc(item.role || item.categoryLabel)}</p><a href="${esc(item.permalink)}" target="_blank" rel="noopener noreferrer">Publicação original ↗</a></article>`,
      )
      .join("");
    $("[data-archive-status]").textContent =
      `${visible.length} trabalhos. Filtro: ${archiveFilter}.`;
    observeMedia(grid);
  }
  $("#arquivo").addEventListener("toggle", () => {
    if ($("#arquivo").open && !$("[data-archive-grid]").children.length)
      renderArchive();
    syncMedia();
  });
  $("[data-filters]").addEventListener("click", (e) => {
    const button = e.target.closest("[data-filter]");
    if (!button) return;
    archiveFilter = button.dataset.filter;
    $$("[data-filter]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b === button)),
    );
    renderArchive();
  });

  function openFilm(item, own = false) {
    demo.pause();
    $("#film-title").textContent = own ? "Prazer, Enzo Marinho." : item.client;
    $("[data-film-label]").textContent = own
      ? "Conteúdo do meu perfil · Apresentação"
      : C.relationship(item);
    $("[data-film-heading]").textContent = own
      ? "O que eu faço. E como posso ajudar."
      : item.title;
    $("[data-film-description]").innerHTML = own
      ? "<p>Roteiro e direção para quem quer começar ou produzir melhor. Eu ajudo a escolher o que falar, para quem e como transformar a ideia em um vídeo gravável.</p><p>Quando você já tem uma equipe, eu entro na direção. Quando precisa de produção, também gravo e edito.</p>"
      : `<p><strong>O ponto de partida</strong>${esc(item.problem || item.categoryLabel)}</p><p><strong>Minha participação</strong>${esc(item.direction || item.role)}</p><p><strong>Entrega</strong>${esc(item.deliverable || item.format)}</p>`;
    $("[data-film-original]").href = own
      ? "https://www.instagram.com/enzosmarinho/reel/DcCcaQGRHhd/"
      : item.permalink;
    $("[data-film-status]").textContent = own
      ? "Vídeo completo da apresentação. Áudio nos controles do player."
      : item.preview
        ? "Este player mostra um trecho de prévia sem áudio. A peça completa está na publicação original."
        : "Esta peça tem imagem de referência. Assista na publicação original.";
    filmVideo.poster = own
      ? "assets/identity/enzo-apresentacao-cover.jpg"
      : item.cardImage || item.thumb || item.poster;
    filmVideo.loop = !own;
    filmVideo.muted = !own;
    if (own || item.preview)
      filmVideo.src = own
        ? "assets/identity/enzo-apresentacao.mp4"
        : item.preview;
    else {
      filmVideo.removeAttribute("src");
      filmVideo.load();
    }
    film.showModal();
    syncMedia();
    syncOrbit();
    if (filmVideo.hasAttribute("src"))
      filmVideo.play().catch(() => {
        $("[data-film-status]").textContent +=
          " Use o botão de reprodução do player.";
      });
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-work]");
    if (button) openFilm(byId.get(button.dataset.work));
  });
  $("[data-presentation]").addEventListener("click", () =>
    openFilm(null, true),
  );
  $("[data-film-close]").addEventListener("click", () => film.close());
  film.addEventListener("close", () => {
    filmVideo.pause();
    filmVideo.removeAttribute("src");
    filmVideo.load();
    syncMedia();
    syncOrbit();
  });
  filmVideo.addEventListener("error", () => {
    if (filmVideo.hasAttribute("src"))
      $("[data-film-status]").textContent =
        "Não foi possível abrir o vídeo aqui. A publicação original continua disponível no link acima.";
  });
  async function playDemo(at) {
    $("[data-demo-play]").hidden = true;
    $("[data-demo-status]").textContent = "";
    if (!demo.hasAttribute("src")) demo.src = "assets/identity/enzo-hohem.mp4";
    const seek = () => {
      demo.currentTime = at;
    };
    if (demo.readyState >= 1) seek();
    else demo.addEventListener("loadedmetadata", seek, { once: true });
    demo.muted = false;
    try {
      await demo.play();
    } catch {
      $("[data-demo-status]").textContent =
        "Use o botão de reprodução no player para continuar.";
    }
  }
  $("[data-demo-play]").addEventListener("click", () => playDemo(0));
  $$("[data-chapter]").forEach((button) =>
    button.addEventListener("click", () => {
      playDemo(Number(button.dataset.chapter));
      if (compact.matches)
        $(".demo-media").scrollIntoView({
          behavior: reduced.matches ? "instant" : "smooth",
          block: "center",
        });
    }),
  );
  demo.addEventListener("timeupdate", () => {
    const t = demo.currentTime;
    $$("[data-chapter]").forEach((b) => {
      const start = Number(b.dataset.chapter);
      b.setAttribute(
        "aria-pressed",
        String(t >= start && t < (start === 24 ? 36 : start === 36 ? 55 : 75)),
      );
    });
  });
  demo.addEventListener("play", () => {
    explicitPlaying = true;
    syncMedia();
  });
  for (const event of ["pause", "ended"])
    demo.addEventListener(event, () => {
      explicitPlaying = false;
      syncMedia();
    });
  demo.addEventListener("error", () => {
    if (demo.hasAttribute("src"))
      $("[data-demo-status]").textContent =
        "O vídeo não carregou. Você pode assistir pela publicação original.";
  });
  new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) demo.pause();
    },
    { threshold: 0 },
  ).observe(demo);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      demo.pause();
      filmVideo.pause();
    }
    syncMedia();
    syncOrbit();
  });
  reduced.addEventListener("change", syncOrbit);
  compact.addEventListener("change", syncMedia);

  const form = $("#contact-form");
  const draft = $("#message-draft");
  function syncDraft() {
    $("[data-whatsapp]").href = C.whatsappUrl(draft.value);
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    draft.value = C.messageDraft(Object.fromEntries(new FormData(form)));
    $(".message-draft").hidden = false;
    syncDraft();
    $("[data-contact-status]").textContent =
      "Mensagem preparada. Revise e abra no WhatsApp quando quiser.";
    draft.focus();
  });
  draft.addEventListener("input", syncDraft);
  form.addEventListener("input", (event) => {
    if (event.target !== draft && !$(".message-draft").hidden) {
      $(".message-draft").hidden = true;
      $("[data-whatsapp]").removeAttribute("href");
      $("[data-contact-status]").textContent =
        "O pedido mudou. Prepare novamente para atualizar a mensagem.";
    }
  });
  $$("[data-need]").forEach((link) =>
    link.addEventListener("click", () => {
      $$("input[name=need]").forEach((r) => {
        r.checked = r.value === link.dataset.need;
      });
      $(".message-draft").hidden = true;
    }),
  );

  const settingsDialog = $("#settings-dialog");
  const settingsForm = $("#settings-form");
  const names = {
    firstName: "Nome",
    lastName: "Sobrenome",
    role: "Atuação",
    promise: "Frase principal",
    intro: "Apresentação curta",
    workTitle: "Título dos trabalhos",
    directionTitle: "Título dos serviços",
    directionIntro: "Descrição da direção",
    demoTitle: "Título da demonstração",
    aboutStatement: "Sua história",
    aboutText: "Sobre você",
    contactTitle: "Convite para conversar",
  };
  $("[data-text-fields]").innerHTML = keys
    .map(
      (key) =>
        `<label class="field-label" for="text-${key}">${names[key] || key}</label><textarea id="text-${key}" data-text-key="${key}" maxlength="${/Name$/.test(key) ? 24 : 1200}" rows="2"></textarea>`,
    )
    .join("");
  function fitName() {
    const heading = $("#hero-name");
    heading.style.fontSize = "";
    const width = (compact.matches ? $(".hero") : $(".hero-copy")).clientWidth;
    const widest = Math.max(
      ...$$(".name-line", heading).map((line) =>
        [...line.children].reduce(
          (n, el) => n + el.getBoundingClientRect().width,
          0,
        ),
      ),
    );
    if (widest > width)
      heading.style.fontSize = `${(parseFloat(getComputedStyle(heading).fontSize) * width) / widest}px`;
  }
  function applySettings() {
    document.documentElement.dataset.tone = settings.tone;
    document.documentElement.dataset.accent = settings.accent;
    document.documentElement.style.setProperty(
      "--title-scale",
      settings.titleScale / 100,
    );
    editable.forEach((el) => {
      const key = el.dataset.edit;
      if (Object.hasOwn(settings.texts, key) && settings.texts[key].trim()) {
        el.textContent = settings.texts[key];
        el.setAttribute("data-edited", "");
      } else {
        el.innerHTML = originalHtml.get(key);
        el.removeAttribute("data-edited");
      }
    });
    $$("[name=tone]", settingsForm).forEach(
      (i) => (i.checked = i.value === settings.tone),
    );
    $$("[name=accent]", settingsForm).forEach(
      (i) => (i.checked = i.value === settings.accent),
    );
    $("[name=titleScale]", settingsForm).value = settings.titleScale;
    $("[data-title-size]").textContent = `${settings.titleScale}%`;
    $("[name=motion]", settingsForm).checked = settings.motion;
    $$("[data-text-key]").forEach((t) => {
      if (document.activeElement !== t)
        t.value =
          settings.texts[t.dataset.textKey] ??
          originalTexts.get(t.dataset.textKey);
    });
    $("[data-motion]").setAttribute("aria-pressed", String(!settings.motion));
    $("[data-motion]").innerHTML = settings.motion
      ? 'Pausar movimento <span aria-hidden="true">Ⅱ</span>'
      : 'Retomar movimento <span aria-hidden="true">▶</span>';
    fitName();
    syncMedia();
    syncOrbit();
  }
  function saveSettings() {
    try {
      localStorage.setItem(STORE, JSON.stringify(settings));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }
    $("[data-settings-status]").textContent = storageAvailable
      ? "Ajustes salvos neste navegador."
      : "O navegador bloqueou o armazenamento. Exporte os ajustes para não perdê-los.";
  }
  settingsForm.addEventListener("submit", (e) => e.preventDefault());
  settingsForm.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.textKey) settings.texts[t.dataset.textKey] = t.value;
    else if (["tone", "accent", "titleScale", "motion"].includes(t.name))
      settings[t.name] = t.name === "motion" ? t.checked : t.value;
    else return;
    settings = C.sanitizeSettings(settings, keys);
    applySettings();
    saveSettings();
  });
  $("[data-settings-open]").addEventListener("click", () => {
    settingsDialog.showModal();
    syncMedia();
    syncOrbit();
  });
  $("[data-settings-close]").addEventListener("click", () =>
    settingsDialog.close(),
  );
  settingsDialog.addEventListener("close", () => {
    syncMedia();
    syncOrbit();
  });
  $("[data-motion]").addEventListener("click", () => {
    settings.motion = !settings.motion;
    applySettings();
    saveSettings();
  });
  $("[data-reset]").addEventListener("click", () => {
    settings = C.sanitizeSettings({}, keys);
    applySettings();
    saveSettings();
  });
  $("[data-export]").addEventListener("click", () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(settings, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "enzo-portfolio-ajustes.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("[data-settings-status]").textContent =
      "Arquivo de ajustes preparado para download.";
  });
  $("[data-import]").addEventListener("click", () => {
    try {
      settings = C.importSettings(
        JSON.parse($("#import-settings").value),
        keys,
      );
      applySettings();
      saveSettings();
    } catch (err) {
      $("[data-settings-status]").textContent =
        err instanceof SyntaxError
          ? "O conteúdo não é um JSON válido. Cole o arquivo exportado inteiro."
          : err.message;
    }
  });
  new ResizeObserver(fitName).observe($(".hero"));
  document.fonts.ready.then(fitName);
  applySettings();
})();
