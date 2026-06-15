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
byId("hero-sub").textContent = profile.hero_sub;
byId("about-text").textContent = profile.about;

const contactLinks = [
  byId("nav-contact"),
  byId("hero-contact"),
  byId("contact-whatsapp"),
];
contactLinks.forEach(link => {
  link.href = profile.contact.whatsapp;
});
byId("contact-instagram").href = profile.contact.instagram;

const showreel = cases[0];
byId("showreel-link").href = showreel.permalink;

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
      <img src="${item.thumb}" alt="" loading="${index < 2 ? "eager" : "lazy"}">
      <video muted loop playsinline preload="none" aria-hidden="true"></video>
    </div>
    <div class="project-shade"></div>
    <div class="project-top">
      <span>${String(index + 1).padStart(2, "0")} / ${String(cases.length).padStart(2, "0")}</span>
      ${item.featured ? "<strong>Destaque</strong>" : `<span>${item.format}</span>`}
    </div>
    <div class="project-info">
      <p class="project-meta">${item.categoryLabel} · ${item.client} · ${item.year}</p>
      <h3>${item.title}</h3>
      <p class="project-role">${item.role}</p>
    </div>
    <span class="project-play">${playIcon}</span>
  </a>
`).join("");

byId("process").innerHTML = profile.process.map((item, index) => `
  <div class="process-item">
    <span>${String(index + 1).padStart(2, "0")}</span>
    ${item}
  </div>
`).join("");

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

projects.forEach(project => {
  const video = project.querySelector("video");
  const source = project.dataset.preview;
  let loaded = false;

  const play = () => {
    if (reduceMotion || !source) return;
    if (!loaded) {
      video.src = source;
      loaded = true;
    }
    video.play()
      .then(() => project.classList.add("is-playing"))
      .catch(() => {});
  };

  const pause = () => {
    video.pause();
    project.classList.remove("is-playing");
  };

  project.addEventListener("mouseenter", play);
  project.addEventListener("mouseleave", pause);
  project.addEventListener("focus", play);
  project.addEventListener("blur", pause);
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

  projects.forEach(project => {
    project.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    project.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

const magnetic = document.querySelector(".magnetic");
if (magnetic && window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
  magnetic.addEventListener("pointermove", event => {
    const rect = magnetic.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * .16;
    const y = (event.clientY - rect.top - rect.height / 2) * .16;
    magnetic.style.transform = `translate(${x}px, ${y}px) scale(1.06)`;
  });
  magnetic.addEventListener("pointerleave", () => {
    magnetic.style.transform = "";
  });
}
