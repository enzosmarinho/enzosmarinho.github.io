/* ==========================================================================
   SALA DE CORTE — comportamento
   Nada aqui pede clique. O monitor troca de peça sozinho, o playhead segue a
   leitura e os clipes reagem ao ponteiro. Sem botão de play em lugar nenhum.
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
  const clipe = (p) => p?.preview || p?.video || "";

  /* -------------------------------------------------- código de categoria
     A cor não é enfeite: é a legenda que atravessa a página inteira.     */

  const CATEGORIAS = {
    conteudo:  { rotulo: "Conteúdo",  cor: "var(--c-conteudo)" },
    anuncios:  { rotulo: "Anúncios",  cor: "var(--c-anuncios)" },
    direcao:   { rotulo: "Direção",   cor: "var(--c-direcao)" },
    "long-form": { rotulo: "Long-form", cor: "var(--c-longform)" },
    automacao: { rotulo: "Automação", cor: "var(--c-automacao)" },
  };
  const cor = (cat) => CATEGORIAS[cat]?.cor || "var(--c-default)";

  /* ------------------------------------------------------- timecode real
     Deriva de posição e duração aparente. Não é decoração: dá ao visitante
     a mesma leitura que Enzo tem na mesa dele.                            */
  const tc = (i, total) => {
    const seg = Math.round((i / Math.max(1, total)) * 90);
    const mm = String(Math.floor(seg / 60)).padStart(2, "0");
    const ss = String(seg % 60).padStart(2, "0");
    const ff = String((i * 7) % 24).padStart(2, "0");
    return `00:${mm}:${ss}:${ff}`;
  };

  /* ---------------------------------------------- agrupamento por cliente */

  function porCliente() {
    const mapa = new Map();
    pecas.forEach((p) => {
      const c = p.client || "Projetos próprios";
      if (!mapa.has(c)) mapa.set(c, []);
      mapa.get(c).push(p);
    });
    return [...mapa.entries()].sort((a, b) => b[1].length - a[1].length);
  }

  /* ------------------------------------------------------------ monitor */

  function montarMonitor() {
    const alvo = document.querySelector("[data-monitor]");
    if (!alvo) return;
    const fila = pecas.filter((p) => imagem(p) && clipe(p)).slice(0, 10);
    if (!fila.length) return;

    alvo.innerHTML = `
      <div class="monitor__bar mono">
        <span class="nav__rec"></span><b>PROGRAMA</b>
        <span class="sep"></span>
        <span data-mon-res>1080×1920 · 9:16</span>
      </div>
      <div class="monitor__frame" data-mon-frame>
        <img src="${prefixo}${esc(imagem(fila[0]))}" alt="" width="720" height="1280" fetchpriority="high" decoding="async">
      </div>
      <div class="monitor__tc mono tc">
        <span class="now" data-mon-tc>00:00:00:00</span>
        <span data-mon-title>${esc(fila[0].title)}</span>
        <span class="cat" data-mon-cat>${esc(CATEGORIAS[fila[0].category]?.rotulo || "")}</span>
      </div>`;

    const frame = alvo.querySelector("[data-mon-frame]");
    const img = frame.querySelector("img");
    const elTc = alvo.querySelector("[data-mon-tc]");
    const elTitulo = alvo.querySelector("[data-mon-title]");
    const elCat = alvo.querySelector("[data-mon-cat]");

    let i = 0;
    let video = null;

    const trocar = (n) => {
      i = n % fila.length;
      const p = fila[i];
      img.src = prefixo + imagem(p);
      elTitulo.textContent = p.title;
      elCat.textContent = CATEGORIAS[p.category]?.rotulo || "";
      elTc.textContent = tc(i, fila.length);
      alvo.style.setProperty("--cat", cor(p.category));

      if (video) { video.pause(); video.remove(); video = null; }
      frame.classList.remove("is-playing");
      if (semMovimento.matches) return;

      video = document.createElement("video");
      video.muted = true; video.loop = true; video.playsInline = true;
      video.preload = "auto"; video.setAttribute("aria-hidden", "true");
      video.src = prefixo + clipe(p);
      frame.appendChild(video);
      video.play().then(() => frame.classList.add("is-playing")).catch(() => {});
    };

    trocar(0);
    if (semMovimento.matches) return;

    let timer = setInterval(() => trocar(i + 1), 5200);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(timer);
        if (video) video.pause();
      } else {
        if (video) video.play().catch(() => {});
        timer = setInterval(() => trocar(i + 1), 5200);
      }
    });
  }

  /* ------------------------------------------------------------ legenda */

  function montarLegenda() {
    const alvo = document.querySelector("[data-legend]");
    if (!alvo) return;
    const usadas = [...new Set(pecas.map((p) => p.category))].filter((c) => CATEGORIAS[c]);
    alvo.innerHTML = usadas.map((c) => {
      const n = pecas.filter((p) => p.category === c).length;
      return `<span class="legend__item mono" style="--cat:${cor(c)}">
        <i class="legend__swatch"></i>${esc(CATEGORIAS[c].rotulo)} <b class="tc">${String(n).padStart(2, "0")}</b>
      </span>`;
    }).join("");
  }

  /* ----------------------------------------------------------- timeline */

  function montarTimeline() {
    const alvo = document.querySelector("[data-timeline]");
    if (!alvo) return;
    const trilhas = porCliente();

    const anos = [...new Set(pecas.map((p) => String(p.year)).filter(Boolean))].sort();
    const regua = `
      <div class="tl__ruler mono" style="--head: clamp(9rem, 15vw, 15rem)">
        <span style="padding:.45rem .6rem">Trilhas</span>
        <span class="tl__ruler-years">${anos.map((a) => `<b>${esc(a)}</b>`).join("")}</span>
      </div>`;

    const corpo = trilhas.map(([cliente, lista], t) => {
      const ordenada = [...lista].sort((a, b) => String(a.year).localeCompare(String(b.year)));
      const clipes = ordenada.map((p, i) => `
        <a class="clip" style="--cat:${cor(p.category)}" href="${esc(destino(p))}"
           target="_blank" rel="noopener"
           aria-label="${esc(p.title)} — ${esc(cliente)}, ${esc(p.categoryLabel || p.category || "")}, ${esc(p.year || "")}">
          <img src="${prefixo}${esc(imagem(p))}" alt="" width="720" height="1280" loading="lazy" decoding="async">
          <span class="clip__tip">${esc(p.title)}</span>
        </a>`).join("");
      return `
        <div class="track">
          <div class="track__head">
            <span class="track__id mono tc">V${t + 1}</span>
            <h3 class="track__name">${esc(cliente)}</h3>
            <span class="track__n mono tc">${String(lista.length).padStart(2, "0")} peças</span>
          </div>
          <div class="track__lane">${clipes}</div>
        </div>`;
    }).join("");

    alvo.innerHTML = `${regua}<div class="tl" style="position:relative">${corpo}
      <div class="tl__playhead" aria-hidden="true"></div></div>`;
  }

  /* ------------------------------------------------- seções comerciais */

  function montarObjetivos() {
    const alvo = document.querySelector("[data-goals]");
    if (!alvo) return;
    const trilhas = [
      { cat: "conteudo", titulo: "Manter o conteúdo em movimento",
        texto: "Transformo gravações, ideias e rotina em peças prontas para publicar com consistência." },
      { cat: "anuncios", titulo: "Explicar melhor e vender com clareza",
        texto: "Organizo oferta, mensagem e página para conduzir a conversa até o próximo passo." },
      { cat: "automacao", titulo: "Tirar o operacional do caminho",
        texto: "Construo uma automação a partir do gargalo real, com limite claro e sem promessa mágica." },
    ];
    alvo.innerHTML = trilhas.map((t, i) => `
      <a class="goal reveal" style="--i:${i}; --cat:${cor(t.cat)}" href="#servicos">
        <strong>${esc(t.titulo)}</strong>
        <p>${esc(t.texto)}</p>
        <i aria-hidden="true">↘</i>
      </a>`).join("");
  }

  function montarPropostas() {
    const alvo = document.querySelector("[data-offers]");
    if (!alvo) return;
    alvo.innerHTML = (profile.services || []).map((s, i) => `
      <article class="offer reveal" style="--i:${i}; --cat:${cor(s.category)}">
        <header class="offer__top mono">
          <span class="offer__cat">${esc(s.categoryLabel || "")}</span>
          <span class="tc">${esc(s.timeline || "")}</span>
        </header>
        <h3 class="offer__title">${esc(s.title)}</h3>
        <p class="offer__desc">${esc(s.description)}</p>
        <ul class="offer__list">${(s.includes || []).map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
        <footer class="offer__foot">
          <strong class="offer__price">${esc(s.price)}</strong>
          <span class="mono">${esc(s.revisions || "")}</span>
        </footer>
      </article>`).join("");
  }

  function montarContinuidade() {
    const alvo = document.querySelector("[data-continuity]");
    if (!alvo) return;
    alvo.innerHTML = (profile.continuity || []).map((p, i) => `
      <div class="plan reveal" style="--i:${i}">
        <h4>${esc(p.title)}</h4>
        <p>${esc(p.description)}</p>
        <strong class="mono">${esc(p.price)}</strong>
      </div>`).join("");
  }

  function montarMetodo() {
    const alvo = document.querySelector("[data-method]");
    if (!alvo) return;
    alvo.innerHTML = (profile.methods || []).map((m, i) => `
      <div class="step reveal" style="--i:${i}">
        <span class="step__n mono tc">${String(i + 1).padStart(2, "0")} / 04</span>
        <h4>${esc(m.title)}</h4>
        <p>${esc(m.text)}</p>
      </div>`).join("");
  }

  /* -------------------------------------------------------- playhead */

  function playhead() {
    const el = document.querySelector(".tl__playhead");
    const tl = document.querySelector(".tl");
    if (!el || !tl || semMovimento.matches) return;
    let travado = false;
    const atualizar = () => {
      const r = tl.getBoundingClientRect();
      const total = r.height + window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / total));
      el.style.setProperty("--play", p.toFixed(4));
      travado = false;
    };
    addEventListener("scroll", () => {
      if (travado) return;
      travado = true;
      requestAnimationFrame(atualizar);
    }, { passive: true });
    atualizar();
  }

  function revelar() {
    if (semMovimento.matches) {
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in"));
      return;
    }
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach((e) => obs.observe(e));
  }

  function preencherPerfil() {
    const set = (sel, v) => { const e = document.querySelector(sel); if (e && v) e.textContent = v; };
    set("[data-role]", profile.role);
    set("[data-location]", profile.location);
    const total = document.querySelector("[data-total]");
    if (total) total.textContent = String(pecas.length).padStart(2, "0");
    const cl = document.querySelector("[data-clientes]");
    if (cl) cl.textContent = String(porCliente().length).padStart(2, "0");
  }

  function iniciar() {
    preencherPerfil();
    montarMonitor();
    montarLegenda();
    montarObjetivos();
    montarTimeline();
    montarPropostas();
    montarContinuidade();
    montarMetodo();
    revelar();
    playhead();
    document.documentElement.classList.add("pronto");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
