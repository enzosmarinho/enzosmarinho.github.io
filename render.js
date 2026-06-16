const profile = window.PROFILE;
const cases = window.CASES;
const extraClips = window.EXTRA_CLIPS || [];
const portfolioItems = [...cases, ...extraClips];
const byId = id => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const playIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5.5v13l10-6.5z"></path>
  </svg>`;

const layoutClass = {
  wide: "project--wide",
  tall: "project--tall",
  standard: "project--standard",
};

const mediaImage = item => item.cardImage || item.thumb || item.poster;

const filterLabel = {
  todos: "Todos",
  direcao: "Direção",
  conteudo: "Conteúdo",
  anuncios: "Anúncios",
  "long-form": "Long-form",
};

const isKaykyItem = item => /kayky|kaique|pitondo/i.test(`${item.client} ${item.title}`);

byId("tagline-a").textContent = profile.tagline_a;
byId("tagline-b").textContent = profile.tagline_b;
byId("hero-title").textContent = profile.hero_title;
byId("hero-sub").textContent = profile.hero_sub;
byId("contact-note").textContent = profile.about;

const contactLinks = [
  byId("nav-contact"),
  byId("hero-contact"),
  byId("contact-whatsapp"),
];
contactLinks.forEach(link => {
  link.href = profile.contact.whatsapp;
});
byId("contact-instagram").href = profile.contact.instagram;

const showreelIndex = Math.max(0, cases.findIndex(item => item.featured));
const showreel = cases[showreelIndex];
byId("hero-feature").innerHTML = `
  <a class="hero-media-link magnetic" href="${showreel.permalink}" target="_blank" rel="noopener" data-preview="${showreel.preview}" data-case-index="${showreelIndex}" aria-haspopup="dialog">
    <img src="${mediaImage(showreel)}" alt="${showreel.title}" fetchpriority="high">
    <video muted loop playsinline preload="${reduceMotion ? "none" : "auto"}" ${reduceMotion ? "" : `src="${showreel.preview}"`} aria-hidden="true"></video>
    <div class="hero-media-shade"></div>
    <div class="hero-media-copy">
      <span>Destaque / ${showreel.categoryLabel}</span>
      <h2>${showreel.title}</h2>
      <p>${showreel.direction}</p>
    </div>
    <span class="hero-play">${playIcon}</span>
  </a>
`;

const stripCases = cases.filter(item => item.id !== showreel.id).slice(0, 3);
byId("hero-strip").innerHTML = stripCases.map((item, index) => `
  <a class="mini-case reveal" href="${item.permalink}" target="_blank" rel="noopener" data-preview="${item.preview}" data-case-index="${cases.indexOf(item)}" aria-haspopup="dialog">
    <span>${String(index + 1).padStart(2, "0")}</span>
    <img src="${mediaImage(item)}" alt="" loading="eager">
    <strong>${item.title}</strong>
  </a>
`).join("");

byId("project-grid").innerHTML = cases.map((item, index) => `
  <a
    class="project ${layoutClass[item.layout]} project--${item.orientation || "portrait"} reveal"
    href="${item.permalink}"
    target="_blank"
    rel="noopener"
    data-category="${item.category}"
    data-preview="${item.preview}"
    data-case-index="${index}"
    data-orientation="${item.orientation || "portrait"}"
    aria-haspopup="dialog"
    aria-label="${item.title}, ${item.client}"
  >
    <div class="project-media">
      <img src="${mediaImage(item)}" alt="" loading="${index < 3 ? "eager" : "lazy"}">
      <video muted loop playsinline preload="none" aria-hidden="true"></video>
      <span class="project-play">${playIcon}</span>
    </div>
    <div class="project-body">
      <div class="project-top">
        <span>${String(index + 1).padStart(2, "0")} / ${String(cases.length).padStart(2, "0")}</span>
        ${item.featured ? "<strong>Destaque</strong>" : `<span>${item.format}</span>`}
      </div>
      <p class="project-meta">${item.categoryLabel} · ${item.client} · ${item.year}</p>
      <h3>${item.title}</h3>
      <p class="project-role">${item.role}</p>
      <div class="project-brief" aria-label="Resumo do case">
        <div>
          <span>Problema</span>
          <p>${item.problem}</p>
        </div>
        <div>
          <span>Direção</span>
          <p>${item.direction}</p>
        </div>
        <div>
          <span>Entrega</span>
          <p>${item.deliverable}</p>
        </div>
      </div>
    </div>
  </a>
`).join("");

const kaykyCase = cases.find(isKaykyItem);
const kaykyClips = extraClips.filter(isKaykyItem);
const otherClips = extraClips.filter(item => !isKaykyItem(item));

byId("kayky-suite").innerHTML = kaykyCase ? `
  <a
    class="kayky-main reveal"
    href="${kaykyCase.permalink}"
    target="_blank"
    rel="noopener"
    data-preview="${kaykyCase.preview}"
    data-case-index="${cases.indexOf(kaykyCase)}"
    aria-haspopup="dialog"
    aria-label="${kaykyCase.title}, ${kaykyCase.client}"
  >
    <div class="kayky-main__media">
      <img src="${mediaImage(kaykyCase)}" alt="" loading="lazy">
      <video muted loop playsinline preload="none" aria-hidden="true"></video>
      <span class="project-play">${playIcon}</span>
    </div>
    <div class="kayky-main__copy">
      <p>Long-form · ${kaykyCase.client}</p>
      <h3>${kaykyCase.title}</h3>
      <span>${kaykyCase.direction}</span>
    </div>
  </a>
  <div class="kayky-cuts" aria-label="Cortes derivados do long-form">
    ${kaykyClips.map(item => {
      const itemIndex = cases.length + extraClips.indexOf(item);
      return `
        <a
          class="kayky-cut reveal"
          href="${item.permalink}"
          target="_blank"
          rel="noopener"
          data-preview="${item.preview}"
          data-case-index="${itemIndex}"
          aria-haspopup="dialog"
          aria-label="${item.title}, ${item.client}"
        >
          <div class="kayky-cut__media">
            <img src="${mediaImage(item)}" alt="" loading="lazy">
            <video muted loop playsinline preload="none" aria-hidden="true"></video>
            <span>${playIcon}</span>
          </div>
          <div class="kayky-cut__copy">
            <p>${item.format} · ${item.categoryLabel}</p>
            <h3>${item.title}</h3>
          </div>
        </a>
      `;
    }).join("")}
  </div>
` : "";

byId("extra-rail").innerHTML = otherClips.map(item => {
  const itemIndex = cases.length + extraClips.indexOf(item);
  return `
    <a
      class="extra-card extra-card--${item.orientation || "portrait"} reveal"
      href="${item.permalink}"
      target="_blank"
      rel="noopener"
      data-preview="${item.preview}"
      data-case-index="${itemIndex}"
      data-orientation="${item.orientation || "portrait"}"
      aria-haspopup="dialog"
      aria-label="${item.title}, ${item.client}"
    >
      <div class="extra-card__media">
        <img src="${mediaImage(item)}" alt="" loading="lazy">
        <video muted loop playsinline preload="none" aria-hidden="true"></video>
        <span>${playIcon}</span>
      </div>
      <div class="extra-card__copy">
        <p>${item.categoryLabel} · ${item.format}</p>
        <h3>${item.title}</h3>
      </div>
    </a>
  `;
}).join("");

byId("method-grid").innerHTML = profile.methods.map((item, index) => `
  <article class="method-card reveal">
    <span>${String(index + 1).padStart(2, "0")}</span>
    <h3>${item.title}</h3>
    <p>${item.text}</p>
  </article>
`).join("");

byId("client-strip").innerHTML = profile.clients
  .map(client => `<span>${client}</span>`)
  .join("");

byId("services").innerHTML = profile.services.map(service => `
  <a class="service reveal" href="${profile.contact.whatsapp}" target="_blank" rel="noopener">
    <span class="service-number">${service.number}</span>
    <div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
    <span class="service-detail">${service.detail}</span>
    <span class="service-arrow" aria-hidden="true">→</span>
  </a>
`).join("");

byId("contact-reel").innerHTML = cases.slice(4, 8).map(item => `
  <img src="${mediaImage(item)}" alt="">
`).join("");

const footerItems = [
  ["Instagram", profile.contact.instagram],
  ["YouTube", profile.contact.youtube],
  ["LinkedIn", profile.contact.linkedin],
  ["E-mail", `mailto:${profile.contact.email}`],
];
byId("footer-links").innerHTML = footerItems
  .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`)
  .join("");

const filters = [...document.querySelectorAll(".filter")];
const projects = [...document.querySelectorAll(".project")];
const workStatus = byId("work-status");

filters.forEach(button => {
  const filter = button.dataset.filter;
  const count = filter === "todos"
    ? cases.length
    : cases.filter(item => item.category === filter).length;
  const label = button.textContent.trim();
  button.innerHTML = `<span>${label}</span><small>${count}</small>`;
  button.setAttribute("aria-label", `${label}: ${count} trabalhos`);
});

const updateWorkStatus = filter => {
  const count = filter === "todos"
    ? cases.length
    : cases.filter(item => item.category === filter).length;
  const label = filterLabel[filter] || filter;
  workStatus.textContent = `${count} ${count === 1 ? "trabalho" : "trabalhos"} em ${label}. Clique em um case para abrir o estudo sem sair da página.`;
};

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;

    projects.forEach(project => {
      const visible = filter === "todos" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !visible);
    });
    updateWorkStatus(filter);
  });
});
updateWorkStatus("todos");

const attachVideoPreview = element => {
  const video = element.querySelector("video");
  const source = element.dataset.preview;
  let loaded = Boolean(video && video.getAttribute("src"));
  if (!video || !source) return;

  const play = () => {
    if (reduceMotion) return;
    if (!loaded) {
      video.src = source;
      loaded = true;
    }
    video.play()
      .then(() => element.classList.add("is-playing"))
      .catch(() => {});
  };

  const pause = () => {
    video.pause();
    element.classList.remove("is-playing");
  };

  element.addEventListener("mouseenter", play);
  element.addEventListener("mouseleave", pause);
  element.addEventListener("focus", play);
  element.addEventListener("blur", pause);
};

[...document.querySelectorAll(".project, .hero-media-link, .mini-case, .kayky-main, .kayky-cut, .extra-card")].forEach(attachVideoPreview);

const caseModal = byId("case-modal");
const modalPanel = caseModal.querySelector(".case-modal__panel");
const modalVideo = byId("case-modal-video");
const modalPoster = byId("case-modal-poster");
const modalEyebrow = byId("case-modal-eyebrow");
const modalTitle = byId("case-modal-title");
const modalSummary = byId("case-modal-summary");
const modalBrief = byId("case-modal-brief");
const modalOpen = byId("case-modal-open");
const modalPrev = byId("case-prev");
const modalNext = byId("case-next");
const closeButtons = [...document.querySelectorAll("[data-close-case]")];
let activeCaseIndex = 0;
let lastFocusedElement = null;
let closeTimer = null;

const renderCaseModal = index => {
  activeCaseIndex = (index + portfolioItems.length) % portfolioItems.length;
  const item = portfolioItems[activeCaseIndex];
  const poster = mediaImage(item);

  modalPanel.classList.toggle("is-portrait", item.orientation !== "landscape");
  modalPanel.classList.toggle("is-landscape", item.orientation === "landscape");
  modalPoster.src = poster;
  modalPoster.alt = "";
  modalVideo.poster = poster;
  modalVideo.src = item.preview;
  modalEyebrow.textContent = `${item.categoryLabel} · ${item.client} · ${item.year}`;
  modalTitle.textContent = item.title;
  modalSummary.textContent = item.role;
  modalOpen.href = item.permalink;
  modalBrief.innerHTML = [
    ["Problema", item.problem],
    ["Direção", item.direction],
    ["Entrega", item.deliverable],
  ].map(([label, text]) => `
    <div>
      <span>${label}</span>
      <p>${text}</p>
    </div>
  `).join("");

  if (!reduceMotion) {
    modalVideo.play().catch(() => {});
  }
};

const openCase = index => {
  clearTimeout(closeTimer);
  lastFocusedElement = document.activeElement;
  caseModal.hidden = false;
  renderCaseModal(index);
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    caseModal.classList.add("is-open");
    modalPanel.focus();
  });
};

const closeCase = () => {
  caseModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  closeTimer = window.setTimeout(() => {
    caseModal.hidden = true;
  }, reduceMotion ? 0 : 180);
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus({ preventScroll: true });
  }
};

const goToCase = direction => {
  renderCaseModal(activeCaseIndex + direction);
};

[...document.querySelectorAll("[data-case-index]")].forEach(trigger => {
  trigger.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    openCase(Number(trigger.dataset.caseIndex));
  });
});

closeButtons.forEach(button => button.addEventListener("click", closeCase));
modalPrev.addEventListener("click", () => goToCase(-1));
modalNext.addEventListener("click", () => goToCase(1));

document.addEventListener("keydown", event => {
  if (caseModal.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeCase();
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToCase(1);
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToCase(-1);
    return;
  }
  if (event.key === "Tab") {
    const focusable = [...caseModal.querySelectorAll("a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex='-1'])")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const reveals = [...document.querySelectorAll(".reveal")];
if (reduceMotion) {
  reveals.forEach(item => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(item => observer.observe(item));
}

const progress = document.querySelector(".scroll-progress span");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateScrollState = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;

  let current = "";
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= window.innerHeight * .38) {
      current = `#${section.id}`;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle("is-active", link.getAttribute("href") === current);
  });
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const cursor = document.querySelector(".cursor");
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });

  [...document.querySelectorAll(".project, .hero-media-link, .kayky-main, .kayky-cut, .extra-card")].forEach(item => {
    item.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

const magneticItems = [...document.querySelectorAll(".magnetic")];
if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
  magneticItems.forEach(item => {
    item.addEventListener("pointermove", event => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .08;
      const y = (event.clientY - rect.top - rect.height / 2) * .08;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });
    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}
