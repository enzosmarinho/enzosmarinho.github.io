const profile = window.PROFILE;
const cases = window.CASES || [];
const extraClips = window.EXTRA_CLIPS || [];
const byId = id => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const mediaImage = item => item.cardImage || item.thumb || item.poster;
const isVoti = item => item.client === "VOTI Software";
const isSeries = item => item.featured || item.category === "long-form";
const scopeFor = item => {
  if (isSeries(item)) return "sistemas";
  if (isVoti(item)) return "voti";
  return "independentes";
};
const contextFor = item => {
  if (isVoti(item)) return "Trabalho CLT · VOTI";
  if (item.featured) return "Sistema de conteúdo";
  return "Projeto independente";
};

byId("hero-title").textContent = profile.hero_title;
byId("hero-sub").textContent = profile.hero_sub;
byId("about-copy").textContent = profile.about;

[byId("nav-contact"), byId("hero-contact"), byId("contact-whatsapp")].forEach(link => {
  link.href = profile.contact.whatsapp;
});

byId("capabilities").innerHTML = [
  "Edição de vídeo longo",
  "Cortes e teasers",
  "Roteiro e captação",
  "Anúncios verticais",
  "Automação com IA",
].map((item, index) => `
  <div>
    <span>${String(index + 1).padStart(2, "0")}</span>
    <strong>${item}</strong>
  </div>
`).join("");

const proof = profile.automation.proof;
byId("flagship-case").innerHTML = `
  <a class="flagship-media reveal" href="${proof.permalink}" target="_blank" rel="noopener" aria-label="Abrir o corte Marketing é gasto ou retorno no Instagram">
    <img src="${proof.poster}" alt="Corte editado por Enzo para o Negócio Sem Filtro" loading="eager">
    <div class="flagship-media__label">
      <span>Assistir original</span>
      <b aria-hidden="true">↗</b>
    </div>
  </a>
  <div class="flagship-copy reveal">
    <p class="flagship-role">Meu trabalho no projeto</p>
    <h3>${proof.title}</h3>
    <p>${proof.text}</p>
    <div class="proof-signals">
      ${proof.signals.map(signal => `<span>${signal}</span>`).join("")}
    </div>
    <div class="original-links">
      ${proof.links.map((item, index) => `
        <a href="${item.url}" target="_blank" rel="noopener">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${item.title}</strong>
          <b aria-hidden="true">↗</b>
        </a>
      `).join("")}
      <a class="original-links__profile" href="${proof.profile}" target="_blank" rel="noopener">
        <span>Perfil</span>
        <strong>Ver todo o Negócio Sem Filtro</strong>
        <b aria-hidden="true">↗</b>
      </a>
    </div>
  </div>
`;

const projectCard = (item, index) => `
  <a
    class="project-card reveal ${item.orientation === "landscape" ? "project-card--landscape" : ""} ${item.layout === "wide" ? "project-card--wide" : ""}"
    href="${item.permalink}"
    target="_blank"
    rel="noopener"
    data-scope="${scopeFor(item)}"
    data-preview="${item.preview || ""}"
    aria-label="Abrir ${item.title} na publicação original"
  >
    <div class="project-card__media">
      <img src="${mediaImage(item)}" alt="" loading="${index < 4 ? "eager" : "lazy"}">
      ${item.preview ? '<video muted loop playsinline preload="none" aria-hidden="true"></video>' : ""}
      <span class="play-mark" aria-hidden="true">▶</span>
    </div>
    <div class="project-card__info">
      <div class="project-card__meta">
        <span>${contextFor(item)}</span>
        <span>${item.format} · ${item.year}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.direction}</p>
      <div class="project-card__footer">
        <span>${item.role}</span>
        <b aria-hidden="true">↗</b>
      </div>
    </div>
  </a>
`;

byId("project-grid").innerHTML = cases.map(projectCard).join("");

byId("clip-rail").innerHTML = extraClips.map((item, index) => `
  <a
    class="clip-card"
    href="${item.permalink}"
    target="_blank"
    rel="noopener"
    data-preview="${item.preview || ""}"
    aria-label="Abrir ${item.title} na publicação original"
  >
    <div class="clip-card__media">
      <img src="${mediaImage(item)}" alt="" loading="lazy">
      ${item.preview ? '<video muted loop playsinline preload="none" aria-hidden="true"></video>' : ""}
      <span>${String(index + 1).padStart(2, "0")}</span>
    </div>
    <div>
      <p>${contextFor(item)}</p>
      <h3>${item.title}</h3>
      <span>${item.format} ↗</span>
    </div>
  </a>
`).join("");

byId("process-steps").innerHTML = profile.automation.stages.map((stage, index) => `
  <article class="process-step reveal">
    <button type="button" aria-expanded="${index === 0 ? "true" : "false"}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${stage.title}</strong>
      <i aria-hidden="true">+</i>
    </button>
    <div class="process-step__body">
      <p>${stage.text}</p>
    </div>
  </article>
`).join("");

const employment = profile.experience.employment;
byId("experience-grid").innerHTML = `
  <article class="experience-block experience-block--employment reveal">
    <span>${employment.label}</span>
    <h3>${employment.name}</h3>
    <p>${employment.text}</p>
    <div class="experience-tags">
      <span>Conteúdo de produto</span>
      <span>Roteiro</span>
      <span>Captação em campo</span>
      <span>Edição</span>
    </div>
  </article>
  <article class="experience-block reveal">
    <span>Projetos independentes</span>
    <h3>Trabalhos fora da VOTI</h3>
    <p>Projetos em que entrei para editar, captar, organizar cortes ou construir uma peça específica de comunicação.</p>
    <div class="independent-list">
      ${profile.experience.independent.map((name, index) => `
        <div><span>${String(index + 1).padStart(2, "0")}</span><strong>${name}</strong></div>
      `).join("")}
    </div>
  </article>
`;

byId("service-list").innerHTML = profile.services.map(service => `
  <a class="service-row reveal" href="${profile.contact.whatsapp}" target="_blank" rel="noopener">
    <span>${service.number}</span>
    <div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
    <small>${service.detail}</small>
    <b aria-hidden="true">↗</b>
  </a>
`).join("");

const contactItems = [
  ["Instagram", profile.contact.instagram],
  ["LinkedIn", profile.contact.linkedin],
  ["E-mail", `mailto:${profile.contact.email}`],
];
byId("contact-links").innerHTML = contactItems.map(([label, href]) => `
  <a href="${href}" target="_blank" rel="noopener">${label}<span aria-hidden="true">↗</span></a>
`).join("");

const filters = [...document.querySelectorAll(".filter")];
const projects = [...document.querySelectorAll(".project-card")];
const workStatus = byId("work-status");
const filterNames = {
  todos: "todos os trabalhos",
  sistemas: "cortes e séries",
  voti: "trabalhos feitos na VOTI",
  independentes: "projetos independentes",
};

const updateProjects = filter => {
  let visibleCount = 0;
  projects.forEach(project => {
    const visible = filter === "todos" || project.dataset.scope === filter;
    project.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  workStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "trabalho" : "trabalhos"} em ${filterNames[filter]}. Todos abrem na publicação original.`;
};

filters.forEach(button => {
  const filter = button.dataset.filter;
  const count = filter === "todos" ? cases.length : cases.filter(item => scopeFor(item) === filter).length;
  button.innerHTML = `<span>${button.textContent}</span><small>${count}</small>`;
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.toggle("is-active", item === button));
    updateProjects(filter);
  });
});
updateProjects("todos");

const attachPreview = element => {
  const video = element.querySelector("video");
  const source = element.dataset.preview;
  if (!video || !source) return;
  let loaded = false;
  const play = () => {
    if (reduceMotion) return;
    if (!loaded) {
      video.src = source;
      loaded = true;
    }
    video.play().then(() => element.classList.add("is-playing")).catch(() => {});
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

[...document.querySelectorAll("[data-preview]")].forEach(attachPreview);

document.querySelectorAll(".process-step button").forEach(button => {
  button.addEventListener("click", () => {
    const step = button.closest(".process-step");
    const expanded = button.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".process-step").forEach(item => {
      item.classList.remove("is-open");
      item.querySelector("button").setAttribute("aria-expanded", "false");
    });
    if (!expanded) {
      step.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});
document.querySelector(".process-step")?.classList.add("is-open");

const revealItems = [...document.querySelectorAll(".reveal")];
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
}

const progress = document.querySelector(".scroll-progress span");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  let current = "";
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.42) current = link.getAttribute("href");
  });
  navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === current));
};
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();
