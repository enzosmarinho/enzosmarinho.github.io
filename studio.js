(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.PortfolioStudio = api;
    api.init();
  }
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const LAYOUTS = ["direction", "gallery", "orbit"];
  const THEMES = {
    ocean: { background: "#0c1822", accent: "#a8d8d2" },
    paper: { background: "#f3f4f2", accent: "#315caa" },
    graphite: { background: "#181a1c", accent: "#e7b78b" },
    plum: { background: "#211b2c", accent: "#d9bedb" },
    forest: { background: "#10231f", accent: "#bcd5a6" },
    cobalt: { background: "#162654", accent: "#c7d7ff" },
  };
  const FONTS = ["sans", "serif", "system"],
    MOTIONS = ["auto", "calm", "full", "off"];
  const STORAGE = "enzo-portfolio-studio:v2";
  const CATEGORIES = {
    direcao: "Direção",
    conteudo: "Conteúdo",
    edicao: "Edição",
    "long-form": "Long-form",
    anuncios: "Campanha",
  };
  const PRIORITY = [
    "DXiIx4_kQ-0",
    "ADKpionmFiw",
    "qBTk1irwDc4",
    "DaBe_RIhl06",
    "DYC7byPyEnW",
    "DQfTWkhiK4k",
    "DZUo3jokhkP",
    "DUf-ODMDWqA",
    "DGLMxcXRRJ4",
    "DWpa8TQCKvX",
    "DZGeYPdBiet",
    "DYBL_r1jP3A",
    "DSldztZCA9P",
    "DHtF3CvxAlF",
    "DOzGHz2iLGz",
    "DUJfuJsCPir",
    "DUQ8YNYEc4z",
    "DW4c4OjkdA5",
  ];
  const HD = {
    ADKpionmFiw: "assets/hero/ADKpionmFiw-hd.mp4",
    qBTk1irwDc4: "assets/hero/qBTk1irwDc4-hd.mp4",
    DaBe_RIhl06: "assets/hero/negocio-sem-filtro-hd.mp4",
  };
  const LIGHT = {
    ADKpionmFiw: "assets/hero-wall/kayky-long-form.mp4",
    qBTk1irwDc4: "assets/hero-wall/voti-visita.mp4",
    DaBe_RIhl06: "assets/hero-wall/negocio-sem-filtro.mp4",
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const text = (v, fallback, max = 100) =>
    typeof v === "string" ? v.slice(0, max) : fallback;
  const hex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
  function luminance(color) {
    const c = color
      .slice(1)
      .match(/../g)
      .map((h) => parseInt(h, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  }
  function contrast(a, b) {
    const x = luminance(a),
      y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function blend(a, b, mix) {
    return (
      "#" +
      [1, 3, 5]
        .map((i) =>
          Math.round(
            parseInt(a.slice(i, i + 2), 16) * (1 - mix) +
              parseInt(b.slice(i, i + 2), 16) * mix,
          )
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  }
  function baseProfile(layout, ids) {
    const theme =
      layout === "gallery"
        ? "paper"
        : layout === "orbit"
          ? "graphite"
          : "ocean";
    return {
      layout,
      theme,
      ...THEMES[theme],
      font: layout === "orbit" ? "serif" : "sans",
      bodyFont: "manrope",
      titleScale: 100,
      bodySize: 18,
      name: "Enzo Marinho",
      email: "enzosmarinho@hotmail.com",
      phone: "5518981196746",
      motion: "auto",
      speed: 100,
      count: 12,
      quality: "crisp",
      lines: true,
      mediaIds: ids.slice(),
      texts: {},
    };
  }
  function sanitizeProfile(raw, layout, ids, keys) {
    const d = baseProfile(layout, ids);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return d;
    const pick = (k, list) => (list.includes(raw[k]) ? raw[k] : d[k]);
    const number = (k, min, max) =>
      Number.isFinite(Number(raw[k])) ? clamp(Number(raw[k]), min, max) : d[k];
    const out = {
      layout,
      theme: pick("theme", Object.keys(THEMES)),
      background: hex(raw.background) ? raw.background : d.background,
      accent: hex(raw.accent) ? raw.accent : d.accent,
      font: pick("font", FONTS),
      bodyFont: pick("bodyFont", ["manrope", "system", "georgia"]),
      titleScale: number("titleScale", 80, 120),
      bodySize: number("bodySize", 16, 22),
      name: text(raw.name, d.name, 45),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.email || "")
        ? raw.email.slice(0, 100)
        : d.email,
      phone: /^\d{10,15}$/.test(raw.phone || "") ? raw.phone : d.phone,
      motion: pick("motion", MOTIONS),
      speed: number("speed", 20, 160),
      count: [6, 9, 12, 18].includes(Number(raw.count))
        ? Number(raw.count)
        : d.count,
      quality: pick("quality", ["crisp", "light"]),
      lines: typeof raw.lines === "boolean" ? raw.lines : d.lines,
      mediaIds: Array.isArray(raw.mediaIds)
        ? [...new Set(raw.mediaIds.filter((id) => ids.includes(id)))]
        : d.mediaIds,
      texts: {},
    };
    if (!out.mediaIds.length) out.mediaIds = d.mediaIds.slice();
    if (raw.texts && typeof raw.texts === "object")
      for (const key of keys)
        if (Object.hasOwn(raw.texts, key) && typeof raw.texts[key] === "string")
          out.texts[key] = raw.texts[key].slice(
            0,
            key.startsWith("headline") ? 100 : 900,
          );
    return out;
  }
  function importState(raw, ids, keys) {
    if (
      !raw ||
      raw.version !== 2 ||
      !LAYOUTS.includes(raw.active) ||
      !raw.variants ||
      typeof raw.variants !== "object"
    )
      throw Error(
        "Arquivo de ajustes incompatível. Use uma exportação deste editor.",
      );
    return {
      version: 2,
      active: raw.active,
      variants: Object.fromEntries(
        LAYOUTS.map((l) => [l, sanitizeProfile(raw.variants[l], l, ids, keys)]),
      ),
    };
  }
  function position(layout, i, count, time, w, h) {
    if (layout === "direction") {
      const cols = w < 460 ? 2 : 3,
        rows = Math.ceil(count / cols),
        col = i % cols,
        row = Math.floor(i / cols),
        step = Math.max(235, h * 0.43),
        cycle = rows * step,
        offset = time * 25 * (col % 2 ? 1 : -1);
      return {
        x: ((col + 0.5) * w) / cols,
        y: ((row * step + offset + cycle * 100) % cycle) - step * 0.32,
        scale: 0.91,
        rotate: col === 1 ? -3 : 3,
        depth: 0,
      };
    }
    if (layout === "gallery") {
      const spacing = clamp(w / 6, 155, 270),
        cycle = count * spacing;
      return {
        x: ((i * spacing - time * 35 + cycle * 100) % cycle) - spacing * 0.5,
        y: h * 0.5 + Math.sin(time * 0.18 + i * 0.8) * h * 0.055,
        scale: 0.96,
        rotate: Math.sin(i * 1.4) * 3,
        depth: 0,
      };
    }
    const ring = i % 2,
      angle =
        (Math.floor(i / 2) / Math.ceil((count - ring) / 2)) * Math.PI * 2 +
        ring * 0.65 +
        time * (0.15 + ring * 0.025),
      depth = Math.sin(angle);
    return {
      x: w * 0.5 + Math.cos(angle) * w * (0.3 + ring * 0.105),
      y: h * 0.5 + Math.sin(angle) * h * (0.28 + ring * 0.1),
      scale: 0.72 + (depth + 1) * 0.13,
      rotate: Math.cos(angle) * -8,
      depth: depth * 70,
    };
  }
  function init() {
    const $ = (s) => document.querySelector(s),
      $$ = (s) => Array.from(document.querySelectorAll(s));
    const works = [
      ...new Map(
        [...(window.CASES || []), ...(window.EXTRA_CLIPS || [])].map((w) => [
          w.id,
          w,
        ]),
      ).values(),
    ];
    const mediaWorks = works.filter((w) => w.preview || w.video);
    const ids = PRIORITY.filter((id) =>
      mediaWorks.some((w) => w.id === id),
    ).concat(
      mediaWorks.map((w) => w.id).filter((id) => !PRIORITY.includes(id)),
    );
    const defaultTexts = Object.fromEntries(
      $$("[data-edit]").map((e) => [e.dataset.edit, e.innerText]),
    );
    const keys = Object.keys(defaultTexts);
    let state = {
      version: 2,
      active: "direction",
      variants: Object.fromEntries(
        LAYOUTS.map((l) => [l, baseProfile(l, ids)]),
      ),
    };
    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved) state = importState(JSON.parse(saved), ids, keys);
    } catch {
      /* A corrupt local draft never prevents access to the portfolio. */
    }
    const url = new URL(location.href);
    if (LAYOUTS.includes(url.searchParams.get("layout")))
      state.active = url.searchParams.get("layout");
    let profile = state.variants[state.active],
      editMode = false,
      filter = "all",
      showAll = false,
      paused = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      compact = matchMedia("(max-width: 760px)"),
      saveData = !!navigator.connection?.saveData;
    const stage = $("[data-stage]"),
      canvas = $("[data-stage-canvas]"),
      ctx = canvas.getContext("2d"),
      field = $("[data-film-field]"),
      editor = $("[data-editor]");
    let films = [],
      frame = 0,
      last = 0,
      elapsed = 0,
      lastCanvas = 0,
      w = 0,
      h = 0,
      visible = true,
      accent = profile.accent;
    const playheads = new Map();
    let gridObserver,
      gridVideos = [];
    const gridVisible = new Map();
    const esc = (s) =>
      String(s ?? "").replace(
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
    const imageFor = (item) => item.cardImage || item.thumb || item.poster;
    const previewFor = (item) =>
      profile.quality === "crisp"
        ? HD[item.id] || item.preview || item.video
        : LIGHT[item.id] || item.preview || item.video;
    const relationship = (item) =>
      item.client === "VOTI Software"
        ? "Experiência CLT"
        : item.client === "Lumiar Parfum"
          ? "Histórico encerrado"
          : "Projeto independente";
    function notice(message) {
      $("[data-save-status]").textContent = message;
    }
    function save() {
      try {
        localStorage.setItem(STORAGE, JSON.stringify(state));
        notice("Salvo neste navegador.");
      } catch {
        notice(
          "Não foi possível salvar no navegador. Exporte seus ajustes para guardá-los.",
        );
      }
    }
    function apply() {
      document.body.dataset.layout = state.active;
      document.body.dataset.theme = profile.theme;
      document.body.dataset.font = profile.font;
      const ink = luminance(profile.background) > 0.35 ? "#172127" : "#f1f4f5",
        muted = blend(profile.background, ink, 0.67),
        surface = blend(profile.background, ink, 0.055),
        line = blend(profile.background, ink, 0.2);
      const accentInk =
        contrast(profile.accent, "#101719") >
        contrast(profile.accent, "#ffffff")
          ? "#101719"
          : "#ffffff";
      const vars = {
        "--bg": profile.background,
        "--ink": ink,
        "--muted": muted,
        "--surface": surface,
        "--line": line,
        "--accent": profile.accent,
        "--accent-ink": accentInk,
        "--body-size": profile.bodySize + "px",
        "--title-scale": profile.titleScale / 100,
        "--body":
          profile.bodyFont === "system"
            ? "Arial,Helvetica,sans-serif"
            : profile.bodyFont === "georgia"
              ? "Georgia,serif"
              : "Manrope,Arial,sans-serif",
      };
      for (const [key, value] of Object.entries(vars))
        document.documentElement.style.setProperty(key, String(value));
      accent = profile.accent;
      $$("[data-person]").forEach((e) => (e.textContent = profile.name));
      $(".brand").setAttribute("aria-label", profile.name + ", início");
      $$("[data-email-link]").forEach((e) => {
        e.textContent = profile.email;
        e.href = "mailto:" + profile.email;
      });
      for (const element of $$("[data-edit]"))
        if (element !== document.activeElement)
          element.textContent = Object.hasOwn(
            profile.texts,
            element.dataset.edit,
          )
            ? profile.texts[element.dataset.edit]
            : defaultTexts[element.dataset.edit];
      $$("[data-layout-choice]").forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.layoutChoice === state.active),
        ),
      );
      $$("[data-setting]").forEach((e) => {
        if (e === document.activeElement) return;
        const key = e.dataset.setting;
        if (e.type === "checkbox") e.checked = profile[key];
        else e.value = key === "layout" ? state.active : profile[key];
      });
      $$("[data-output]").forEach(
        (e) =>
          (e.textContent =
            profile[e.dataset.output] +
            (e.dataset.output === "bodySize" ? " px" : "%")),
      );
      const ratio = contrast(profile.background, profile.accent);
      $("[data-contrast]").textContent =
        ratio >= 4.5
          ? `Contraste do destaque: ${ratio.toFixed(1)}:1.`
          : `O destaque tem contraste ${ratio.toFixed(1)}:1. Escolha outra cor para manter os títulos legíveis.`;
      const stop = paused || profile.motion === "off";
      $("[data-pause]").textContent = stop
        ? "Retomar movimento"
        : "Pausar movimento";
      $("[data-pause]").setAttribute("aria-pressed", String(stop));
      syncClock();
      syncGrid();
    }
    function motionSpeed() {
      if (paused || profile.motion === "off" || saveData) return 0;
      const base =
        profile.motion === "calm"
          ? 0.35
          : profile.motion === "auto" && reduced.matches
            ? 0.25
            : 1;
      return (base * profile.speed) / 100;
    }
    function setPlaying(video, on) {
      if (!video) return;
      if (!on) {
        if (!video.paused) video.pause();
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = video.dataset.src;
        video.addEventListener(
          "loadedmetadata",
          () => {
            const saved = playheads.get(video.dataset.workId);
            if (Number.isFinite(saved) && video.duration)
              video.currentTime = saved % video.duration;
          },
          { once: true },
        );
      }
      if (video.paused && !video.dataset.playPending) {
        video.dataset.playPending = "true";
        video
          .play()
          .catch(() => {})
          .finally(() => delete video.dataset.playPending);
      }
    }
    function bindVideo(video, parent) {
      video.addEventListener("playing", () => parent.classList.add("playing"));
      video.addEventListener("error", () => parent.classList.remove("playing"));
    }
    function rebuildFilms() {
      const stageWrap = stage.parentElement;
      if (compact.matches)
        $(".hero-copy").insertBefore(stageWrap, $(".hero-description"));
      else $(".hero").append(stageWrap);
      for (const film of films) {
        if (film.video) {
          playheads.set(film.item.id, film.video.currentTime);
          film.video.pause();
          film.video.removeAttribute("src");
          film.video.load();
        }
      }
      field.replaceChildren();
      films = [];
      const selected = profile.mediaIds.slice(
        0,
        Math.min(profile.count, compact.matches ? 9 : 18),
      );
      for (const id of selected) {
        const item = mediaWorks.find((x) => x.id === id);
        if (!item) continue;
        const link = document.createElement("a");
        link.className = "film";
        link.href = item.permalink;
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute(
          "aria-label",
          `Ver ${item.title}, ${item.client}, na publicação original`,
        );
        const img = document.createElement("img");
        img.src = imageFor(item);
        img.alt = "";
        img.decoding = "async";
        link.append(img);
        const video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";
        video.dataset.src = previewFor(item);
        video.dataset.workId = item.id;
        video.poster = imageFor(item);
        video.setAttribute("aria-hidden", "true");
        link.append(video);
        bindVideo(video, link);
        field.append(link);
        films.push({ el: link, video, item, width: 0, height: 0 });
      }
      measure();
    }
    function measure() {
      w = stage.clientWidth;
      h = stage.clientHeight;
      if (ctx) {
        const dpr = Math.min(
          devicePixelRatio || 1,
          2,
          Math.sqrt(8000000 / Math.max(1, w * h)),
        );
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
      }
      films.forEach((f) => {
        const landscape = f.item.heroWidth > f.item.heroHeight;
        let size =
          state.active === "direction"
            ? clamp((w / (w < 460 ? 2 : 3)) * 0.71, 85, 175)
            : state.active === "gallery"
              ? clamp(w / 6.4, 130, 230)
              : clamp(w * 0.16, 70, 160);
        if (landscape) size *= 1.5;
        f.width = size;
        f.height = (size * f.item.heroHeight) / f.item.heroWidth;
        if (f.height > h * 0.79) {
          f.height = h * 0.79;
          f.width = (f.height * f.item.heroWidth) / f.item.heroHeight;
        }
        f.el.style.width = f.width + "px";
        f.el.style.height = f.height + "px";
      });
      paint();
      syncClock();
    }
    function drawCanvas() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (!profile.lines) return;
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 1;
      const t = elapsed;
      if (state.active === "orbit") {
        for (let ring = 0; ring < 4; ring++) {
          ctx.globalAlpha = 0.1 + ring * 0.015;
          ctx.beginPath();
          for (let j = 0; j <= 100; j++) {
            const a = (j / 100) * Math.PI * 2,
              rx = w * (0.21 + ring * 0.061),
              ry = h * (0.2 + ring * 0.048),
              x = w * 0.5 + Math.cos(a) * rx,
              y =
                h * 0.5 + Math.sin(a) * ry + Math.cos(a + t * 0.14) * h * 0.018;
            j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
          const angle = t * 0.15 + ring * 1.1;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(
            w * 0.5 + Math.cos(angle) * w * (0.21 + ring * 0.061),
            h * 0.5 + Math.sin(angle) * h * (0.2 + ring * 0.048),
            2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      } else {
        for (let line = 0; line < 5; line++) {
          ctx.globalAlpha = 0.11;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 16) {
            const y =
              h * (0.17 + line * 0.16) +
              Math.sin((x / w) * 4 + t * 0.13 + line * 0.8) * h * 0.045;
            x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
    function paint() {
      films.forEach((f, i) => {
        const p = position(state.active, i, films.length, elapsed, w, h);
        f.el.style.transform = `translate3d(${(p.x - f.width / 2).toFixed(2)}px,${(p.y - f.height / 2).toFixed(2)}px,${p.depth.toFixed(1)}px) rotate(${p.rotate.toFixed(2)}deg) scale(${p.scale.toFixed(3)})`;
        f.el.style.zIndex = String(Math.round(p.depth + 100));
        const inFrame =
          p.x + f.width * 0.6 > 0 &&
          p.x - f.width * 0.6 < w &&
          p.y + f.height * 0.6 > 0 &&
          p.y - f.height * 0.6 < h;
        setPlaying(
          f.video,
          visible && !document.hidden && motionSpeed() > 0 && inFrame,
        );
      });
    }
    function tick(now) {
      const delta = last ? Math.min((now - last) / 1000, 0.08) : 0;
      last = now;
      elapsed += delta * motionSpeed();
      paint();
      if (now - lastCanvas > 32) {
        drawCanvas();
        lastCanvas = now;
      }
      frame = requestAnimationFrame(tick);
    }
    function syncClock() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible && !document.hidden && motionSpeed() > 0)
        frame = requestAnimationFrame(tick);
      paint();
      drawCanvas();
    }
    function syncGrid() {
      const active = [...gridVisible.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, compact.matches ? 2 : 4)
        .map(([v]) => v);
      for (const video of gridVideos)
        setPlaying(
          video,
          !document.hidden &&
            !saveData &&
            motionSpeed() > 0 &&
            active.includes(video),
        );
    }
    function renderWorks() {
      gridObserver?.disconnect();
      gridVideos.forEach((v) => v.pause());
      gridVisible.clear();
      const relevant = works.filter(
        (x) => filter === "all" || x.category === filter,
      );
      const showing = showAll ? relevant : relevant.slice(0, 12);
      const host = $("[data-studio-works]");
      host.innerHTML = showing
        .map(
          (item) =>
            `<a class="work-card" href="${esc(item.permalink)}" target="_blank" rel="noopener"><div class="work-media"><img src="${esc(imageFor(item))}" loading="lazy" decoding="async" alt="${esc(item.title)}">${item.preview ? `<video muted loop playsinline preload="none" data-grid-video data-src="${esc(previewFor(item))}" data-work-id="${esc(item.id)}" poster="${esc(imageFor(item))}" aria-hidden="true"></video>` : ""}</div><div class="work-meta"><span>${esc(item.client)}</span><span>${esc(relationship(item))}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.role || item.roleShort || CATEGORIES[item.category] || "Vídeo")}</p></a>`,
        )
        .join("");
      gridVideos = Array.from(host.querySelectorAll("video"));
      gridVideos.forEach((v) => bindVideo(v, v.closest(".work-card")));
      gridObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            gridVisible.set(
              entry.target,
              entry.isIntersecting ? entry.intersectionRatio : 0,
            );
          syncGrid();
        },
        { threshold: [0, 0.1, 0.5, 1] },
      );
      gridVideos.forEach((v) => gridObserver.observe(v));
      $("[data-more]").hidden = showAll || relevant.length <= 12;
      $("[data-work-status]").textContent =
        `${showing.length} de ${relevant.length} trabalhos exibidos.`;
      $$("[data-filter]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
      );
    }
    function renderPicker() {
      const host = $("[data-media-picker]");
      host.innerHTML = ids
        .map((id) => {
          const item = mediaWorks.find((w) => w.id === id);
          return `<label><input type="checkbox" data-media-id="${esc(id)}" ${profile.mediaIds.includes(id) ? "checked" : ""}><span>${esc(item.title)}<br>${esc(item.client)}</span></label>`;
        })
        .join("");
    }
    function chooseLayout(layout) {
      if (!LAYOUTS.includes(layout)) return;
      finishEdit();
      state.active = layout;
      profile = state.variants[layout];
      paused = false;
      const next = new URL(location.href);
      next.searchParams.set("layout", layout);
      history.replaceState(null, "", next);
      apply();
      rebuildFilms();
      renderPicker();
      renderWorks();
      save();
    }
    function finishEdit() {
      if (!editMode) return;
      $$("[data-edit]").forEach((e) => {
        profile.texts[e.dataset.edit] = e.innerText.slice(
          0,
          e.dataset.edit.startsWith("headline") ? 100 : 900,
        );
        e.removeAttribute("contenteditable");
      });
      editMode = false;
      document.body.classList.remove("editing");
      $("[data-editing-banner]").hidden = true;
      save();
    }
    $$("[data-layout-choice]").forEach((b) =>
      b.addEventListener("click", () => chooseLayout(b.dataset.layoutChoice)),
    );
    $$("[data-open-editor]").forEach((b) =>
      b.addEventListener("click", () => editor.showModal()),
    );
    $("[data-close-editor]").addEventListener("click", () => editor.close());
    $$("[data-clean]").forEach((b) =>
      b.addEventListener("click", () => {
        const clean = document.body.classList.toggle("clean");
        $(".return-editor").hidden = !clean;
        measure();
      }),
    );
    $("[data-mobile-menu]").addEventListener("click", (e) => {
      const open = $(".site-header nav").classList.toggle("mobile-open");
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });
    $$(".site-header nav a").forEach((a) =>
      a.addEventListener("click", () => {
        $(".site-header nav").classList.remove("mobile-open");
        $("[data-mobile-menu]").setAttribute("aria-expanded", "false");
      }),
    );
    $$("[data-setting]").forEach((input) =>
      input.addEventListener(
        input.type === "range" ||
          input.type === "color" ||
          input.tagName === "INPUT"
          ? "input"
          : "change",
        () => {
          const key = input.dataset.setting;
          if (key === "layout") {
            chooseLayout(input.value);
            return;
          }
          const value =
            input.type === "checkbox"
              ? input.checked
              : input.type === "range" || key === "count"
                ? Number(input.value)
                : input.value;
          profile[key] = value;
          if (key === "theme") Object.assign(profile, THEMES[value]);
          const sanitized = sanitizeProfile(profile, state.active, ids, keys);
          Object.assign(profile, sanitized);
          apply();
          if (["count", "quality"].includes(key)) rebuildFilms();
          if (key === "quality") renderWorks();
          save();
        },
      ),
    );
    $("[data-media-picker]").addEventListener("change", (e) => {
      const id = e.target.dataset.mediaId;
      if (!id) return;
      if (e.target.checked) {
        if (!profile.mediaIds.includes(id)) profile.mediaIds.push(id);
      } else {
        if (profile.mediaIds.length === 1) {
          e.target.checked = true;
          notice("Mantenha pelo menos um vídeo na capa.");
          return;
        }
        profile.mediaIds = profile.mediaIds.filter((x) => x !== id);
      }
      rebuildFilms();
      save();
    });
    $("[data-pause]").addEventListener("click", () => {
      if (profile.motion === "off") profile.motion = "auto";
      else paused = !paused;
      apply();
    });
    $("[data-edit-texts]").addEventListener("click", () => {
      editor.close();
      editMode = true;
      document.body.classList.add("editing");
      $("[data-editing-banner]").hidden = false;
      $$("[data-edit]").forEach((e) =>
        e.setAttribute("contenteditable", "plaintext-only"),
      );
    });
    $$("[data-edit]").forEach((e) =>
      e.addEventListener("blur", () => {
        if (!editMode) return;
        profile.texts[e.dataset.edit] = e.innerText.slice(
          0,
          e.dataset.edit.startsWith("headline") ? 100 : 900,
        );
        e.textContent = profile.texts[e.dataset.edit];
        save();
      }),
    );
    $("[data-finish-edit]").addEventListener("click", () => {
      finishEdit();
      apply();
    });
    $("[data-reset]").addEventListener("click", () => {
      state.variants[state.active] = baseProfile(state.active, ids);
      profile = state.variants[state.active];
      paused = false;
      apply();
      rebuildFilms();
      renderPicker();
      renderWorks();
      save();
      notice("Esta versão foi restaurada. As outras continuam guardadas.");
    });
    $("[data-export]").addEventListener("click", () => {
      finishEdit();
      const blob = new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json",
        }),
        url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = "enzo-portfolio-ajustes.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notice("Ajustes exportados. Guarde o arquivo para a versão final.");
    });
    function applyImportedText(source) {
      if (source.length > 100000)
        throw Error("O conteúdo excede o limite de 100 KB.");
      const incoming = importState(JSON.parse(source), ids, keys);
      state = incoming;
      profile = state.variants[state.active];
      paused = false;
      apply();
      rebuildFilms();
      renderPicker();
      renderWorks();
      save();
      const next = new URL(location.href);
      next.searchParams.set("layout", state.active);
      history.replaceState(null, "", next);
      notice("Ajustes importados.");
    }
    function importError(error) {
      notice(
        error instanceof SyntaxError
          ? "O conteúdo não é um arquivo de ajustes válido. Use a exportação deste editor."
          : error.message || "Não foi possível importar os ajustes.",
      );
    }
    $("[data-import-paste]").addEventListener("click", () => {
      try {
        applyImportedText($("[data-import-text]").value);
      } catch (error) {
        importError(error);
      }
    });
    $("[data-import]").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (file.size > 100000)
          throw Error("O arquivo excede o limite de 100 KB.");
        applyImportedText(await file.text());
      } catch (error) {
        importError(error);
      }
      e.target.value = "";
    });
    $("[data-work-filters]").innerHTML = [
      ["all", "Todos"],
      ...Object.entries(CATEGORIES),
    ]
      .map(
        ([key, label]) =>
          `<button type="button" data-filter="${key}" aria-pressed="${key === "all"}">${label}</button>`,
      )
      .join("");
    $$("[data-filter]").forEach((b) =>
      b.addEventListener("click", () => {
        filter = b.dataset.filter;
        showAll = false;
        renderWorks();
      }),
    );
    $("[data-more]").addEventListener("click", () => {
      showAll = true;
      renderWorks();
    });
    $$("[data-need]").forEach((link) =>
      link.addEventListener("click", () => {
        $("[data-contact] select[name=service]").value = link.dataset.need;
      }),
    );
    $("[data-contact]").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const message = `Oi ${profile.name}, vi seu portfólio e quero conversar.\n\nInteresse: ${f.get("service")}\nComo produzo hoje: ${f.get("team")}\nO que quero melhorar: ${String(f.get("message")).trim()}`;
      $("[data-contact-draft]").textContent = message;
      $("[data-contact-link]").href =
        `https://wa.me/${profile.phone}?text=${encodeURIComponent(message)}`;
      $("[data-contact-result]").hidden = false;
      $("[data-contact-status]").textContent =
        "Conversa preparada. Revise a mensagem antes de abrir o WhatsApp.";
    });
    new ResizeObserver(measure).observe(stage);
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncClock();
      },
      { threshold: 0.01 },
    ).observe(stage);
    document.addEventListener("visibilitychange", () => {
      syncClock();
      syncGrid();
    });
    reduced.addEventListener("change", syncClock);
    compact.addEventListener("change", rebuildFilms);
    for (const [key, label] of Object.entries({
      titleScale: "Tamanho dos títulos",
      bodySize: "Tamanho do texto",
      speed: "Velocidade",
    }))
      $(`[data-setting="${key}"]`).setAttribute("aria-label", label);
    apply();
    rebuildFilms();
    renderPicker();
    renderWorks();
    if (url.searchParams.get("clean") === "1") {
      document.body.classList.add("clean");
      $(".return-editor").hidden = false;
    }
  }
  return {
    THEMES,
    LAYOUTS,
    baseProfile,
    sanitizeProfile,
    importState,
    position,
    contrast,
    init,
  };
});
