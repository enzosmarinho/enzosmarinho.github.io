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
  };

  const HERO_IDS = [
    "DXiIx4_kQ-0",
    "DQfTWkhiK4k",
    "qBTk1irwDc4",
    "DaBe_RIhl06",
    "ADKpionmFiw",
    "DZUo3jokhkP",
    "DYC7byPyEnW",
    "DGLMxcXRRJ4",
    "DZGeYPdBiet",
    "DUf-ODMDWqA",
    "DSldztZCA9P",
    "DWpa8TQCKvX",
    "DUQ8YNYEc4z",
    "DW4c4OjkdA5",
    "DHtF3CvxAlF",
    "DOzGHz2iLGz",
    "DUJfuJsCPir",
    "DYBL_r1jP3A",
  ];

  const HERO_PROXIES = {
    qBTk1irwDc4: "assets/hero-wall/voti-visita.mp4",
    DaBe_RIhl06: "assets/hero-wall/negocio-sem-filtro.mp4",
    ADKpionmFiw: "assets/hero-wall/kayky-long-form.mp4",
  };

  const SECTION_WORK_IDS = Object.freeze({
    voti: [
      "DXiIx4_kQ-0",
      "DQfTWkhiK4k",
      "qBTk1irwDc4",
      "DSldztZCA9P",
      "DWpa8TQCKvX",
      "DKkdTYyItAy",
      "DGLMxcXRRJ4",
      "DUJfuJsCPir",
    ],
    kayky: ["ADKpionmFiw", "DZUo3jokhkP", "DZGeYPdBiet"],
    nsf: ["DaBe_RIhl06", "DaNgCEIFkJB", "DaFxmK1DjRc"],
  });

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
    { x: -36, y: -28, z: -90, r: -6, scale: 0.86 },
    { x: -21, y: -31, z: 92, r: 4, scale: 0.94 },
    { x: -4, y: -32, z: 150, r: -3, scale: 1 },
    { x: 14, y: -30, z: -46, r: 6, scale: 0.88 },
    { x: 31, y: -24, z: 68, r: -4, scale: 0.92 },
    { x: 40, y: -8, z: 136, r: 5, scale: 0.98 },
    { x: 37, y: 10, z: -56, r: -6, scale: 0.86 },
    { x: 28, y: 25, z: 104, r: 4, scale: 0.95 },
    { x: 11, y: 31, z: -82, r: 6, scale: 0.84 },
    { x: -7, y: 31, z: 84, r: -4, scale: 0.94 },
    { x: -25, y: 27, z: -118, r: 5, scale: 0.82 },
    { x: -39, y: 14, z: 164, r: -3, scale: 1.01 },
    { x: -41, y: -5, z: -70, r: 5, scale: 0.85 },
    { x: -32, y: -18, z: 118, r: -4, scale: 0.96 },
    { x: -15, y: -9, z: -130, r: 6, scale: 0.8 },
    { x: 4, y: -11, z: 90, r: -5, scale: 0.9 },
    { x: 20, y: 2, z: -100, r: 4, scale: 0.82 },
    { x: -9, y: 11, z: 130, r: -3, scale: 0.95 },
  ];

  const SERVICES = Array.isArray(profile.services) ? profile.services : [];

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
  // Medida real do arquivo, gravada em cases.js a partir do proprio ffprobe. O
  // fallback existe so para nao quebrar se entrar peca nova sem medir - ele nao
  // deve ser usado, porque chutar a proporcao e o que fazia a midia entrar torta.
  const mediaSize = (item) => [
    Number(item?.heroWidth) || (item?.orientation === "landscape" ? 1280 : 720),
    Number(item?.heroHeight) || (item?.orientation === "landscape" ? 720 : 1280),
  ];
  /*
    Duas qualidades por peca, escolhidas pelo tamanho em que a peca aparece.

    O proxy existe porque o hero toca dezoito videos ao mesmo tempo em quadros de
    100 a 200px - ali 270x480 e mais do que suficiente e mantem a pagina leve.
    O erro era usar esse mesmo proxy em TODA parte: a peca longa do Kayky ocupa
    cerca de 700px e recebia um arquivo de 480x270, e o cartao da VOTI ocupa 460px
    e recebia 270x480. Esticado quase o dobro, ficava mole. Os arquivos HD ja
    estavam no repositorio, parados.

    Agora: superficie pequena e repetida usa o proxy, superficie grande e unica
    usa o HD. Qualidade maxima onde se ve, peso baixo onde nao muda nada.
  */
  const previewLeve = (item) => HERO_PROXIES[item?.id] || item?.preview || item?.video || "";
  const previewAlto = (item) => item?.preview || item?.video || previewLeve(item);
  const itemById = (id) => works.find((item) => item.id === id);
  const categoryLabel = (item) => CATEGORIES[item?.category] || cleanText(item?.categoryLabel || "Projeto");
  const featuredHeroItems = () => {
    const limit = compactViewport.matches ? 12 : 18;
    return HERO_IDS.map(itemById).filter(Boolean).slice(0, limit);
  };

  function relationshipFor(item) {
    if (item?.client === "VOTI Software") return { label: "Experiência CLT", type: "employment" };
    if (item?.client === "Lumiar Parfum") return { label: "Histórico encerrado", type: "historical" };
    return { label: "Projeto independente", type: "independent" };
  }

  function mediaLink(item, className = "", ambient = false, revealIndex = null) {
    const image = imageFor(item);
    const preview = previewAlto(item);
    const [largura, altura] = mediaSize(item);
    return `
      <a class="media-link ${escapeHtml(className)}"
         data-orientation="${escapeHtml(item?.orientation || "portrait")}"
         style="--media-ratio:${largura} / ${altura}${Number.isInteger(revealIndex) ? `;--index:${revealIndex}` : ""}"
         href="${escapeHtml(item?.permalink || "#arquivo")}"
         target="_blank"
         rel="noopener"
         aria-label="Abrir ${safe(item?.title || "trabalho")} na publicação original">
        <img src="${escapeHtml(asset(image))}"
             alt=""
             width="${largura}"
             height="${altura}"
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
      const preview = asset(previewLeve(item));
      const landscape = item.orientation === "landscape";
      const slot = HERO_SLOTS[index] || HERO_SLOTS[index % HERO_SLOTS.length];
      const depth = Math.max(0.48, Math.min(1, (slot.z + 180) / 350));
      const gravityX = ((((index * 37) % 9) - 4) * 0.34).toFixed(2);
      const gravityY = ((((index * 29) % 11) - 5) * 0.27).toFixed(2);
      const gravityTilt = ((((index * 17) % 9) - 4) * 0.62).toFixed(2);
      const gravityDuration = (8.6 + (index % 7) * 0.82).toFixed(2);
      return `
        <figure class="hero-tile"
                style="
                  --index:${index};
                  --layer:${Math.round(slot.z + 180)};
                  --depth:${depth.toFixed(3)};
                  --sphere-transform:translate3d(calc(-50% + ${slot.x}vw),calc(-50% + ${slot.y}vh),${slot.z}px) rotateZ(${slot.r}deg) scale(${slot.scale});
                  --gravity-a:translate3d(${(-gravityX * 0.55).toFixed(2)}vw,${(gravityY * 0.25).toFixed(2)}vh,0) rotateZ(${(-gravityTilt * 0.55).toFixed(2)}deg);
                  --gravity-b:translate3d(${gravityX}vw,${(-gravityY).toFixed(2)}vh,18px) rotateZ(${gravityTilt}deg);
                  --gravity-c:translate3d(${(-gravityX * 0.25).toFixed(2)}vw,${gravityY}vh,-10px) rotateZ(${(-gravityTilt * 0.2).toFixed(2)}deg);
                  --gravity-duration:${gravityDuration}s;
                  --gravity-delay:${(-index * 0.47).toFixed(2)}s;
                "
                data-hero-id="${escapeHtml(item.id)}"
                data-orientation="${landscape ? "landscape" : "portrait"}"
                data-depth="${depth.toFixed(2)}">
          <div class="hero-tile__body">
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
            </div>
          </div>
        </figure>`;
    }).join("");
  }

  function setupHeroLifecycle() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const setActive = (active) => {
      hero.classList.toggle("is-inactive", !active);
      document.dispatchEvent(new Event("heroactivitychange"));
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0);
      }, { threshold: [0, 0.001], rootMargin: "-1px 0px 0px 0px" });
      observer.observe(hero);
    } else {
      setActive(true);
    }
  }

  function setupPointerField() {
    const sticky = document.querySelector(".hero__sticky");
    const orbit = document.querySelector("[data-hero-orbit]");
    const tiles = [...document.querySelectorAll(".hero-tile")];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    // A inclinacao responde ao ponteiro do proprio visitante, alguns graus: nao
    // e movimento que acontece sozinho com ele parado.
    if (
      !sticky
      || !orbit
      || !tiles.length
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
    const videos = [...document.querySelectorAll("[data-ambient-video]")];
    const visibilityRatios = new Map();
    let activeVideos = new Set();
    const playheads = new Map();

    // Sem isto, uma parede de hero que falhasse ao renderizar deixaria a classe
    // motion-paused presa no html e congelaria a pagina inteira em silencio.
    if (!videos.length) {
      document.documentElement.classList.remove("motion-paused");
      return;
    }

    // O video E o portfolio, nao enfeite: ele toca independente de
    // prefers-reduced-motion (decisao do Enzo em 11/08/2026). Economia de dados
    // continua respeitada, porque ali o custo e a conta do visitante e nao uma
    // preferencia de movimento.
    const playbackAllowed = () => !saveData;

    const rememberPlayhead = (video) => {
      const id = video.dataset.workId;
      if (!id || !Number.isFinite(video.currentTime)) return;
      playheads.set(id, video.currentTime);
    };

    /*
      O teto vale so para a grade do arquivo. La sao 25 cartoes e uma tela larga
      pode mostrar uma duzia de uma vez - isso sim e peso a toa, porque ninguem
      assiste doze videos ao mesmo tempo. O hero e os casos sao a vitrine e tocam
      inteiros: e o que o visitante veio ver.
    */
    const LIMITE_DA_GRADE = compactViewport.matches ? 3 : 6;
    let apontado = null;

    const chooseActiveVideos = () => {
      const byWork = new Map();
      videos.forEach((video) => {
        const ratio = visibilityRatios.get(video) || 0;
        if (ratio <= 0) return;
        const id = video.dataset.workId || `anonymous-${videos.indexOf(video)}`;
        const current = byWork.get(id);
        const score = ratio + (video.hasAttribute("data-section-video") ? 2 : 0);
        if (!current || score > current.score) byWork.set(id, { video, score });
      });

      const candidatos = [...byWork.values()];
      const vitrine = candidatos.filter((e) => !e.video.hasAttribute("data-grid-video"));
      const grade = candidatos
        .filter((e) => e.video.hasAttribute("data-grid-video"))
        .sort((a, b) => b.score - a.score)
        .slice(0, LIMITE_DA_GRADE);

      const escolhidos = new Set([...vitrine, ...grade].map((e) => e.video));
      // Apontar com o ponteiro sempre vence o teto: e um pedido explicito.
      if (apontado && (visibilityRatios.get(apontado) || 0) > 0) escolhidos.add(apontado);
      return escolhidos;
    };

    const seguirPonteiro = () => {
      document.querySelectorAll("[data-grid-video]").forEach((video) => {
        const card = video.closest(".work-card");
        if (!card || card.dataset.pointerBound === "true") return;
        card.dataset.pointerBound = "true";
        const entrar = () => { apontado = video; refreshActiveVideos(); sync(); };
        const sair = () => { if (apontado === video) apontado = null; refreshActiveVideos(); sync(); };
        card.addEventListener("pointerenter", entrar);
        card.addEventListener("pointerleave", sair);
        card.addEventListener("focusin", entrar);
        card.addEventListener("focusout", sair);
      });
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
      if (video.dataset.hydrated === "true" || !playbackAllowed()) return;
      video.dataset.hydrated = "true";
      video.src = video.dataset.src || "";
      video.addEventListener("loadedmetadata", () => {
        restorePlayhead(video);
        delete video.dataset.needsPlayheadSync;
      }, { once: true });
      // .work-card faltava aqui: o video da grade tocava de verdade e ficava em
      // opacity 0, porque quem revela e a classe is-playing no cartao. Seis
      // videos rodando invisiveis - o pior dos dois mundos, gasto sem imagem.
      const moldura = () => video.closest(".hero-tile, .media-link, .work-card");
      video.addEventListener("playing", () => moldura()?.classList.add("is-playing"));
      /*
        Sem isto a peca que perde a vaga do teto continua exibindo o ultimo
        quadro congelado - um frame qualquer, talvez de piscada ou borrado pelo
        movimento - no lugar do poster, que e frame escolhido. Na grade sao
        sempre duas peças nessa situacao. Achado do Codex em 11/08/2026.

        A troca de volta nao pisca porque so acontece durante a rolagem, quando
        a vaga muda de dono, e o cruzamento leva 180ms.
      */
      video.addEventListener("pause", () => moldura()?.classList.remove("is-playing"));
      video.load();
    };

    const syncVideo = (video) => {
      const heroIsActive = !video.hasAttribute("data-hero-video")
        || !video.closest(".hero")?.classList.contains("is-inactive");
      const shouldPlay = playbackAllowed()
        && !document.hidden
        && heroIsActive
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
      const globallyPaused = !playbackAllowed() || document.hidden;
      document.documentElement.classList.toggle("motion-paused", globallyPaused);
      videos.forEach(syncVideo);
    };

    document.addEventListener("visibilitychange", sync);
    document.addEventListener("heroactivitychange", sync);
    reducedMotion.addEventListener?.("change", () => {
      if (!reducedMotion.matches) setupPointerField();
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
      /*
        Sem margem: toca o que esta na tela, para o que saiu. A margem de 18%
        deixava peca a 86px abaixo da dobra rodando sem ninguem olhando. Colar na
        borda so e possivel porque o download acontece antes, no observador de
        aquecimento logo abaixo - sem ele isso viraria engasgo.
      */
      }, { threshold: [0, 0.03, 0.25, 0.5, 0.75, 1], rootMargin: "0px" });
      videos.forEach((video) => observer.observe(video));

      // Sem esta observacao adiantada o arquivo so comeca a baixar quando a peca
      // JA esta visivel: o visitante ve o poster parado e so depois o movimento
      // comeca. Buffer a 75% de viewport de distancia elimina esse engasgo.
      //
      // A grade fica FORA do adiantamento de proposito: sao 25 pecas e so seis
      // tocam ao mesmo tempo, entao baixar as 25 seria pagar por movimento que
      // ninguem vai ver. La o arquivo desce quando a peca e escolhida.
      const aquecer = (margem, alvos) => {
        if (!alvos.length) return;
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            hydrateVideo(entry.target);
            obs.unobserve(entry.target);
          });
        }, { rootMargin: margem });
        alvos.forEach((video) => obs.observe(video));
      };
      // Vitrine com folga larga: e o que o visitante ve primeiro e nao pode falhar.
      aquecer("75% 0px 75%", videos.filter((v) => !v.hasAttribute("data-grid-video")));
      // Grade com folga curta: sao 25 pecas, entao so desce o que esta chegando.
      aquecer("20% 0px 20%", videos.filter((v) => v.hasAttribute("data-grid-video")));
    } else {
      videos.forEach((video) => visibilityRatios.set(video, 1));
      refreshActiveVideos();
    }

    if (!playbackAllowed()) return;
    seguirPonteiro();
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
    const items = SECTION_WORK_IDS.voti.map(itemById).filter(Boolean);
    host.innerHTML = items.map((item, index) => mediaLink(item, "voti-card", true, index)).join("");
  }

  function renderKayky() {
    const host = document.querySelector("[data-kayky-case]");
    const [longFormId, ...cutIds] = SECTION_WORK_IDS.kayky;
    const longForm = itemById(longFormId);
    const cuts = cutIds.map(itemById).filter(Boolean);
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
      <div class="kayky__media">
        ${mediaLink(longForm, "kayky__long", true)}
        <div class="kayky__cuts" aria-label="Cortes derivados do vídeo longo">
          ${cuts.map((item) => mediaLink(item, "", true)).join("")}
        </div>
      </div>`;
  }

  function renderNsf() {
    const host = document.querySelector("[data-nsf-case]");
    const [mainId, ...supportingIds] = SECTION_WORK_IDS.nsf;
    const main = itemById(mainId);
    const supporting = supportingIds.map(itemById).filter(Boolean);
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
        ${[main, ...supporting].map((item) => mediaLink(item, "", Boolean(previewAlto(item)))).join("")}
      </div>`;
  }

  function renderServices() {
    const host = document.querySelector("[data-services]");
    if (!host) return;
    host.innerHTML = SERVICES.map((service) => `
      <article class="service">
        <h3>${safe(service.title)}</h3>
        <div class="service__body">
          <p>${safe(service.description)}</p>
          <p class="service__proof">${safe(service.proof)}</p>
        </div>
        <a class="button button--ghost button--small" href="${escapeHtml(service.href)}">${safe(service.cta)}</a>
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
      const preview = previewLeve(item);
      const [largura, altura] = mediaSize(item);
      return `
        <a class="work-card"
           data-work-category="${escapeHtml(item.category || "")}"
           data-orientation="${escapeHtml(item.orientation || "portrait")}"
           style="--media-ratio:${largura} / ${altura}"
           href="${escapeHtml(item.permalink || "#analise")}"
           target="_blank"
           rel="noopener">
          <div class="work-card__media">
            <img src="${escapeHtml(asset(image))}"
                 alt=""
                 width="${largura}"
                 height="${altura}"
                 loading="lazy"
                 decoding="async">
            ${preview ? `
              <video data-ambient-video
                     data-grid-video
                     data-work-id="${escapeHtml(item.id || "")}"
                     data-src="${escapeHtml(asset(preview))}"
                     muted
                     loop
                     playsinline
                     preload="none"
                     poster="${escapeHtml(asset(image))}"
                     aria-hidden="true"></video>` : ""}
          </div>
          <div class="work-card__body">
            <span class="work-card__relation" data-relation="${relationship.type}">${safe(relationship.label)}</span>
            <h3>${safe(item.title)}</h3>
            <p class="work-card__role">${safe(item.role || "Papel não informado")}</p>
            <p class="work-card__meta">${safe(item.client)} / ${safe(categoryLabel(item))} / ${safe(item.year || "")}</p>
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
        if (document.startViewTransition) {
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
        "Roteirizar e publicar": "Escolher o assunto e transformar a ideia em um roteiro gravável",
        "Direção de conteúdo": "Revisar mensagem, presença, gravação e corte para chegar na pessoa certa",
        "Revisão de performance": "Ler o que já foi publicado e priorizar os ajustes com maior impacto",
        "Produção completa": "Planejar direção, captação e edição do material até a entrega",
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
      if (values.get("reference")) lines.push(`Perfil ou canal: ${values.get("reference")}`);
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
    });

    form.addEventListener("change", () => {
      if (draftWrap?.hidden) return;
      syncDraft();
      if (status) status.textContent = "Rascunho atualizado.";
    });
  }

  function setupReveal() {
    const selector = [
      ".voti__intro",
      ".voti-card",
      ".voti__scope span",
      ".opening",
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
      ".method__chain li",
      ".method-item",
      ".analysis__head",
      ".factor",
      ".diagnostic",
      ".contact h2",
      ".contact > .shell > p",
      ".contact__actions",
    ].join(",");
    const elements = [...document.querySelectorAll(selector)];
    // A revelacao segue a mesma regra do resto: quem decide o quanto ela se
    // desloca e o bloco reduce do CSS, que zera o transform e deixa so o fade.
    // Barrar aqui matava a animacao da pagina inteira abaixo do hero.
    if (!("IntersectionObserver" in window)) return;

    /*
      A ordem da cascata e contada DENTRO de cada grupo, nao no indice global.
      Com indice global (index % 6) o atraso caia no meio de uma fileira e a
      cascata parecia sorteada: a terceira etapa do metodo podia entrar antes da
      primeira. Contando por pai, cada fileira conta a partir do proprio inicio.
    */
    const ordemPorGrupo = new Map();
    elements.forEach((element) => {
      element.classList.add("reveal-pending");
      const grupo = element.parentElement || document.body;
      const ordem = ordemPorGrupo.get(grupo) || 0;
      ordemPorGrupo.set(grupo, ordem + 1);
      // Modulo, nao teto: com teto os 23 cartoes seguintes do arquivo dividiam o
      // mesmo atraso e entravam em bloco. Girando de 0 a 7 a grade sempre cai em
      // diagonal, qualquer que seja o numero de colunas do momento.
      element.style.setProperty("--reveal-order", String(ordem % 8));
    });
    let observadorRespondeu = false;
    const observer = new IntersectionObserver((entries) => {
      // Responder ja prova que o observador funciona, mesmo que a entrada diga
      // "nao esta visivel". Esse e o sinal certo para a rede de seguranca.
      observadorRespondeu = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    elements.forEach((element) => observer.observe(element));

    // Passagem inicial sincrona: o que ja esta na tela aparece sem esperar
    // observador nenhum. Importante em recarga com rolagem restaurada.
    elements.forEach((element) => {
      const caixa = element.getBoundingClientRect();
      if (caixa.top < window.innerHeight * 0.96 && caixa.bottom > 0) {
        element.classList.add("is-visible");
        observer.unobserve(element);
      }
    });

    /*
      Rede de seguranca: reveal-pending zera a opacidade, entao um observador que
      nunca dispare deixaria a pagina inteira invisivel abaixo do hero.

      O gatilho ANTERIOR era "nada foi revelado em 3s" - e isso era um autogol.
      No carregamento o hero ocupa a tela inteira e nao existe nada revelavel
      visivel, entao bastava o visitante levar tres segundos para comecar a rolar
      e a pagina INTEIRA se revelava de uma vez. A coreografia morria sem nenhum
      erro aparecer, que e exatamente o sintoma de "as animacoes nao pegaram".

      O gatilho correto e "o observador nunca respondeu": se ele responde, mesmo
      dizendo que nada esta visivel, esta vivo e a cascata pode esperar a rolagem.

      E o prazo era curto demais: medido neste site, o Chrome so entrega a
      primeira intersecao por volta de 3.2s. Em 3s a rede vencia a corrida por
      180ms e desligava a coreografia toda vez. Oito segundos e folga real.

      Aba oculta nao conta: o navegador nao calcula intersecao em segundo plano,
      entao julgar ali condenaria o observador por algo que nao e culpa dele.
    */
    let redeArmada = false;
    const armarRede = () => {
      if (redeArmada) return;
      redeArmada = true;
      window.setTimeout(() => {
        if (observadorRespondeu) return;
        observer.disconnect();
        elements.forEach((element) => element.classList.add("is-visible"));
      }, 8000);
    };
    if (document.hidden) {
      document.addEventListener("visibilitychange", function aoAparecer() {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", aoAparecer);
        armarRede();
      });
    } else {
      armarRede();
    }
  }

  function init() {
    renderHeroWall();
    renderVoti();
    renderKayky();
    renderNsf();
    renderServices();
    renderArchive();
    renderMethod();
    renderDiagnostic();
    setupHeroLifecycle();
    setupPointerField();
    setupAmbientMotion();
    setupReveal();
    document.documentElement.classList.add("ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
