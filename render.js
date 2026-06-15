const profile = window.PROFILE;
const cases = window.CASES;
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

const showreel = cases.find(item => item.id === "DXiIx4_kQ-0") || cases[0];
byId("hero-feature").innerHTML = `
  <a class="hero-media-link magnetic" href="${showreel.permalink}" target="_blank" rel="noopener" data-preview="${showreel.preview}">
    <img src="${showreel.thumb}" alt="${showreel.title}" fetchpriority="high">
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
  <a class="mini-case reveal" href="${item.permalink}" target="_blank" rel="noopener" data-preview="${item.preview}">
    <span>${String(index + 1).padStart(2, "0")}</span>
    <img src="${item.thumb}" alt="" loading="eager">
    <strong>${item.title}</strong>
  </a>
`).join("");

byId("project-grid").innerHTML = cases.map((item, index) => `
  <a
    class="project ${layoutClass[item.layout]} reveal"
    href="${item.permalink}"
    target="_blank"
    rel="noopener"
    data-category="${item.category}"
    data-preview="${item.preview}"
    aria-label="${item.title}, ${item.client}"
  >
    <div class="project-media">
      <img src="${item.thumb}" alt="" loading="${index < 3 ? "eager" : "lazy"}">
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
  <img src="${item.thumb}" alt="">
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

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;

    projects.forEach(project => {
      const visible = filter === "todos" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !visible);
    });
  });
});

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

[...document.querySelectorAll(".project, .hero-media-link, .mini-case")].forEach(attachVideoPreview);

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

  [...document.querySelectorAll(".project, .hero-media-link")].forEach(item => {
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
