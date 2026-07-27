/* ==========================================================================
   KINETIC — comportamento
   Regra central: nada aqui pede clique. O que toca, toca porque está sendo
   olhado; o que entra, entra porque foi alcançado pelo scroll.
   ========================================================================== */
(() => {
  "use strict";

  const profile = window.PROFILE || {};
  const fonte = [...(window.CASES || []), ...(window.EXTRA_CLIPS || [])];
  const pecas = [...new Map(fonte.map((p) => [p.id ?? p.permalink ?? p.title, p])).values()];

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefixo = document.body.dataset.assetPrefix ?? "../../";

  const esc = (v = "") => String(v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const imagem = (p) => p?.cardImage || p?.thumb || p?.poster || "";
  const destino = (p) => p?.permalink || "#contato";
  // o campo do clipe curto no cases.js chama `preview` (mp4), nao `video`
  const clipe = (p) => p?.preview || p?.video || "";

  /* ---------------------------------------------------------------- peças */

  function tile(p, i, largura) {
    const img = imagem(p);
    if (!img) return "";
    const wide = largura === "wide" || p.orientation === "landscape" || p.layout === "wide";
    const w = wide ? 1280 : 720;
    const h = wide ? 720 : 1280;
    return `
      <a class="tile${wide ? " tile--wide" : ""} reveal" style="--i:${i}"
         href="${esc(destino(p))}" target="_blank" rel="noopener"
         data-video="${esc(clipe(p))}"
         aria-label="${esc(p.title)} — ${esc(p.client)}, ${esc(p.deliverable || p.format || "peça")}">
        <img src="${prefixo}${esc(img)}" width="${w}" height="${h}" alt=""
             loading="lazy" decoding="async">
        <span class="tile__label">
          <strong>${esc(p.title)}</strong>
          <span>${esc(p.categoryLabel || p.category || "")} · ${esc(p.year || "")}</span>
        </span>
      </a>`;
  }

  /* ------------------------------------------------- organização por cliente
     A ordem é por volume de trabalho: quem tem mais peças aparece primeiro.
     Isso mostra profundidade de relação em vez de uma grade solta.        */

  function porCliente() {
    const mapa = new Map();
    pecas.forEach((p) => {
      const c = p.client || "Projetos próprios";
      if (!mapa.has(c)) mapa.set(c, []);
      mapa.get(c).push(p);
    });
    return [...mapa.entries()].sort((a, b) => b[1].length - a[1].length);
  }

  function montarTrabalho() {
    const alvo = document.querySelector("[data-work]");
    if (!alvo) return;
    alvo.innerHTML = porCliente().map(([cliente, lista]) => {
      const rotulos = [...new Set(lista.map((p) => p.categoryLabel || p.category).filter(Boolean))];
      return `
        <article class="chapter">
          <div class="chapter__id">
            <span class="chapter__count">${String(lista.length).padStart(2, "0")}</span>
            <h3 class="chapter__name">${esc(cliente)}</h3>
            <p class="chapter__tags mono">${rotulos.map(esc).join(" · ")}</p>
          </div>
          <div class="chapter__pieces">
            ${lista.map((p, i) => tile(p, i)).join("")}
          </div>
        </article>`;
    }).join("");
  }

  function montarPalco() {
    const alvo = document.querySelector("[data-stage]");
    if (!alvo) return;
    const destaque = pecas
      .filter((p) => imagem(p))
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      .slice(0, 14);
    alvo.innerHTML = destaque.map((p, i) => tile(p, i)).join("");
  }

  function montarTicker() {
    const alvo = document.querySelector("[data-ticker]");
    if (!alvo) return;
    const linha = porCliente()
      .map(([c, l]) => `<span class="ticker__item">${esc(c)}<b>${String(l.length).padStart(2, "0")}</b></span>`)
      .join("");
    // duas cópias: a animação translada -100% da primeira, emendando sem salto
    alvo.innerHTML = `<div class="ticker__row">${linha}</div><div class="ticker__row" aria-hidden="true">${linha}</div>`;
  }

  /* ------------------------------------------------------ playback sozinho
     Sem botão. Um observer marca o que está visível; a cada quadro de scroll
     o mais próximo do centro vira o que toca. Os outros pausam e soltam o
     decodificador — 31 vídeos tocando junto derrubariam o celular.        */

  function playbackAutomatico() {
    if (semMovimento.matches) return;

    const tiles = [...document.querySelectorAll(".tile[data-video]")]
      .filter((t) => t.dataset.video);
    if (!tiles.length) return;

    const visiveis = new Set();
    let tocando = null;

    const parar = (t) => {
      const v = t.querySelector("video");
      if (!v) return;
      v.pause();
      v.removeAttribute("src");
      v.load();
      v.remove();
      t.classList.remove("is-playing");
    };

    const tocar = (t) => {
      if (t === tocando) return;
      if (tocando) parar(tocando);
      tocando = t;
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.setAttribute("aria-hidden", "true");
      v.src = prefixo + t.dataset.video;
      t.appendChild(v);
      v.play().then(() => t.classList.add("is-playing")).catch(() => {});
    };

    const escolher = () => {
      if (!visiveis.size) {
        if (tocando) { parar(tocando); tocando = null; }
        return;
      }
      const centro = window.innerHeight / 2;
      let melhor = null, menor = Infinity;
      visiveis.forEach((t) => {
        const r = t.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - centro);
        if (d < menor) { menor = d; melhor = t; }
      });
      if (melhor) tocar(melhor);
    };

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) visiveis.add(e.target);
        else visiveis.delete(e.target);
      });
      escolher();
    }, { threshold: 0.55 });

    tiles.forEach((t) => obs.observe(t));

    let travado = false;
    addEventListener("scroll", () => {
      if (travado) return;
      travado = true;
      requestAnimationFrame(() => { escolher(); travado = false; });
    }, { passive: true });

    // aba escondida não gasta bateria decodificando vídeo
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && tocando) { parar(tocando); tocando = null; }
      else escolher();
    });
  }

  /* --------------------------------------------------------- linhas vivas */

  function revelar() {
    if (semMovimento.matches) {
      document.querySelectorAll(".reveal, .rule").forEach((e) => e.classList.add("is-in"));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal, .rule, [data-reveal-group]")
      .forEach((e) => obs.observe(e));
  }

  function espinha() {
    const el = document.querySelector(".spine");
    if (!el || semMovimento.matches) return;
    let travado = false;
    const atualizar = () => {
      const alcance = document.documentElement.scrollHeight - window.innerHeight;
      const p = alcance > 0 ? Math.min(1, Math.max(0, scrollY / alcance)) : 0;
      el.style.setProperty("--progress", p.toFixed(4));
      travado = false;
    };
    addEventListener("scroll", () => {
      if (travado) return;
      travado = true;
      requestAnimationFrame(atualizar);
    }, { passive: true });
    atualizar();
  }

  /* ------------------------------------------------------------- perfil */

  function preencherPerfil() {
    const set = (sel, valor) => {
      const el = document.querySelector(sel);
      if (el && valor) el.textContent = valor;
    };
    set("[data-role]", profile.role);
    set("[data-location]", profile.location);
    set("[data-lead]", profile.hero_sub || profile.tagline_a);
    const total = document.querySelector("[data-total]");
    if (total) total.textContent = String(pecas.length).padStart(2, "0");
    const clientes = document.querySelector("[data-clientes]");
    if (clientes) clientes.textContent = String(porCliente().length).padStart(2, "0");
  }

  function iniciar() {
    preencherPerfil();
    montarTicker();
    montarPalco();
    montarTrabalho();
    revelar();
    espinha();
    playbackAutomatico();
    document.documentElement.classList.add("kinetic-pronto");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
