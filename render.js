// Render do portfolio (index.html). Conteudo vem de cases.js (window.PROFILE/CASES).
const P = window.PROFILE, C = window.CASES;
const $ = id => document.getElementById(id);
const esc = s => (s == null ? '' : String(s));

/* ---------- ICONES SVG AUTORAIS (monoline 24/1.5, currentColor) — 1 por modo ---------- */
const SVG = 'http://www.w3.org/2000/svg';
const ICON_WRAP = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICONS = [
  // 01 Educador — tela/demo com play + base
  ICON_WRAP('<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M10.2 8.4l4 2.6-4 2.6z" fill="currentColor" stroke="none"/><path d="M8.5 20h7M12 16.5V20"/>'),
  // 02 Storyteller comico — balao + sorriso
  ICON_WRAP('<path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9.5L5 20.5V16.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5z"/><path d="M8.5 10.7c1 1.1 2.1 1.6 3.5 1.6s2.5-.5 3.5-1.6"/>'),
  // 03 Storyteller cinematografico — claquete
  ICON_WRAP('<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3.3 9l3.4-3.2 3.8 .9-3.4 3.2zM10.5 6.7l3.8 .9-3.4 3.2M14.3 7.6l3.8 .9-3.4 3.2"/>'),
  // 04 Insider Vlog — camera handheld
  ICON_WRAP('<rect x="2.5" y="7.5" width="13.5" height="10.5" rx="2"/><circle cx="9.2" cy="12.7" r="2.9"/><path d="M16 11l5-2.3v8.6L16 15z"/>'),
  // 05 Diretor de Anuncio — megafone + ondas
  ICON_WRAP('<path d="M3 11v2.2a1.6 1.6 0 0 0 1.6 1.6H7l8.5 4.2V5L7 9.2H4.6A1.6 1.6 0 0 0 3 11z"/><path d="M18 9.4c1.7 1.1 1.7 5.1 0 6.2M7 15v3a1.4 1.4 0 0 0 1.4 1.4h1"/>'),
  // 06 Apresentador de Promocao — etiqueta de preco
  ICON_WRAP('<path d="M4 4.5h7.3a2 2 0 0 1 1.4.6l6.6 6.6a2 2 0 0 1 0 2.8l-5.8 5.8a2 2 0 0 1-2.8 0L4.1 13.7A2 2 0 0 1 3.5 12.3V5a.5.5 0 0 1 .5-.5z"/><circle cx="8" cy="8" r="1.3"/>'),
];
const PLAY = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6.5v11l9-5.5z" fill="currentColor"/></svg>`;
const ARR = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ---------- HERO ---------- */
const wa = P.contact.whatsapp;
$('navwa') && ($('navwa').href = wa);
$('wa2') && ($('wa2').href = wa);
$('ebrow') && ($('ebrow').textContent = 'videomaker que programa o próprio vídeo · ' + P.location.split('·')[0].trim());
if ($('h1')) {
  const l1 = P.tagline_a, l2 = P.tagline_b;
  $('h1').innerHTML = `<span class="line"><span class="li">${l1}</span></span><span class="line"><span class="li em">${l2}</span></span>`;
}
$('lead') && ($('lead').textContent = P.hero_sub || P.summary);
$('ptag') && ($('ptag').textContent = P.initials + ' · ' + P.location.split('·')[1].trim());
$('stats') && ($('stats').innerHTML = P.stats.map(s =>
  `<div class="stat"><div class="v ${s.accent ? 'hi' : ''}" data-n="${/^\d+$/.test(s.v) ? s.v : ''}">${s.v}<small>${s.suffix || ''}</small></div><div class="k">${s.k}</div><div class="ks">${s.sub || ''}</div></div>`).join(''));
if ($('ticker')) {
  const t = P.ticker || P.clients;
  $('ticker').innerHTML = t.concat(t).map(x => `<span>${x}</span>`).join('<i>✦</i>');
}

/* ---------- VALUE PROPS ---------- */
$('valueprops') && P.value_props && ($('valueprops').innerHTML = P.value_props.map((v, i) =>
  `<div class="vp rv"><div class="vp-n">0${i + 1}</div><h4>${v.t}</h4><p>${v.d}</p></div>`).join(''));

/* ---------- WORK (com video no hover) ---------- */
$('work-grid') && ($('work-grid').innerHTML = C.map((c, i) => `
  <a class="card rv" href="${c.permalink}" target="_blank" rel="noopener" data-preview="${esc(c.preview)}">
    <div class="thumb">
      ${c.thumb ? `<img src="${c.thumb}" alt="" loading="lazy">` : ''}
      ${c.preview ? `<video class="pv" muted loop playsinline preload="none"></video>` : ''}
      <span class="idx">${String(i + 1).padStart(2, '0')}</span>
      <span class="fmt">${c.format}</span>
      ${c.highlight ? `<span class="star">${c.note}</span>` : ''}
      <span class="play">${PLAY}</span>
    </div>
    <div class="info">
      <div class="arch">${c.archetype} · ${c.client}</div>
      <div class="ttl">${c.title}</div>
      <div class="proof">${c.proof || ''}</div>
    </div>
  </a>`).join(''));

/* ---------- MODOS (icones autorais) ---------- */
$('modos-grid') && ($('modos-grid').innerHTML = P.modos.map((m, i) => `
  <div class="modo rv">
    <div class="modo-top"><span class="modo-ic">${ICONS[i] || ''}</span><span class="modo-n">${m.n}</span></div>
    <h3>${m.t}</h3><p>${m.d}</p><div class="modo-m">${m.m}</div>
  </div>`).join(''));

/* ---------- PROVA SOCIAL (logo VOTI + wordmarks + outcomes) ---------- */
if ($('social-logos')) {
  const wordmarks = ['Lumiar Parfum', 'Magnos Steel', 'Kayky Pitondo', '8848 Jiu-Jitsu'];
  $('social-logos').innerHTML =
    `<span class="cl cl-voti"><img src="assets/logos/voti.png" alt="VOTI Software"></span>` +
    wordmarks.map(w => `<span class="cl cl-word">${w}</span>`).join('');
}
$('social-outcomes') && P.proof_outcomes && ($('social-outcomes').innerHTML = P.proof_outcomes.map(o =>
  `<div class="oc rv"><p>${o.text}</p><span class="oc-c">${o.client}</span></div>`).join(''));

/* ---------- DIFERENCIAL ---------- */
if ($('dif') && P.diferencial) {
  const d = P.diferencial;
  $('dif').innerHTML = `
    <div class="dif-l"><div class="kick">// diferencial</div><h2 class="s-title rv">${d.title}</h2></div>
    <div class="dif-r rv"><p>${d.body}</p><div class="dif-tags">${d.tags.map(t => `<span>${t}</span>`).join('')}</div></div>`;
}

/* ---------- SOBRE ---------- */
$('bio') && ($('bio').textContent = P.bio_narrative || P.summary);
$('skills') && ($('skills').innerHTML = P.skills.map(s =>
  `<div class="sk rv"><h4>${s.t}</h4><div class="chips">${s.items.map(i => `<span>${i}</span>`).join('')}</div></div>`).join(''));
$('pipe') && ($('pipe').innerHTML = P.process.map((s, i) =>
  `${i ? '<i class="parr">' + ARR + '</i>' : ''}<span class="pstep">${s}</span>`).join(''));

/* ---------- DNA ---------- */
$('dna-grid') && ($('dna-grid').innerHTML = P.dna.map((d, i) =>
  `<div class="dna-i rv"><span class="dna-n">${String(i + 1).padStart(2, '0')}</span><span class="dna-t">${d}</span></div>`).join(''));

/* ---------- PRICING (ancoragem + value stack) ---------- */
$('pricing-intro') && ($('pricing-intro').textContent = P.pricing_intro || '');
$('price-grid') && ($('price-grid').innerHTML = P.pricing.map(p => `
  <div class="pc rv ${p.featured ? 'feat' : ''}">
    ${p.featured ? '<div class="pc-badge">mais escolhido</div>' : ''}
    <div class="pc-tag">${p.tagline}</div>
    <h3>${p.h}</h3>
    <div class="pc-for">${p.for}</div>
    <ul>${p.items.map(i => `<li>${i}</li>`).join('')}</ul>
    <div class="pc-why">${p.why}</div>
    <div class="pc-price">
      <span class="anchor">avulso daria ${p.anchor}</span>
      <span class="month"><small>R$</small>${p.month}<small>/mês</small></span>
    </div>
    <a class="pc-cta" href="${wa}" target="_blank" rel="noopener">Quero esse ${ARR}</a>
  </div>`).join(''));
$('pricing-note') && ($('pricing-note').textContent = P.pricing_note || '');
$('addons-intro') && ($('addons-intro').textContent = P.addons_intro || '');
$('addons') && P.addons && ($('addons').innerHTML = P.addons.map(a =>
  `<div class="addon"><span>${a.t}</span><b>${a.p}</b></div>`).join(''));

/* ---------- MANIFESTO ---------- */
$('mani') && ($('mani').innerHTML = P.manifesto.map(p =>
  `<p>${p.replace('vídeo que vende', '<b>vídeo que vende</b>').replace('vida criativa fora do óbvio', '<em>vida criativa fora do óbvio</em>')}</p>`).join(''));

/* ---------- CONTATO ---------- */
const ct = P.contact;
$('guarantee') && ($('guarantee').textContent = P.guarantee || '');
$('contact') && ($('contact').innerHTML =
  `<a class="btn btn-1" href="${ct.whatsapp}" target="_blank" rel="noopener">Chamar no WhatsApp ${ARR}</a>
   <div class="contact-sec">
     <a href="${ct.instagram}" target="_blank" rel="noopener">Instagram</a>
     <a href="${ct.youtube}" target="_blank" rel="noopener">YouTube</a>
     <a href="${ct.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
     <a href="mailto:${ct.email}">E-mail</a>
   </div>`);
$('foot') && ($('foot').innerHTML = `${P.name.toLowerCase()} · ${P.role.toLowerCase()} · ${P.location.toLowerCase()} · 2026`);

/* ---------- VIDEO NO HOVER ---------- */
document.querySelectorAll('.card[data-preview]').forEach(card => {
  const src = card.getAttribute('data-preview');
  const vid = card.querySelector('video.pv');
  if (!src || !vid) return;
  let loaded = false;
  const enter = () => { if (!loaded) { vid.src = src; loaded = true; } vid.play().then(() => card.classList.add('playing')).catch(() => {}); };
  const leave = () => { vid.pause(); card.classList.remove('playing'); };
  card.addEventListener('mouseenter', enter);
  card.addEventListener('mouseleave', leave);
});

/* ---------- MOTION (GSAP se disponivel, senao IntersectionObserver) ---------- */
function countUp(el) {
  const n = parseInt(el.dataset.n, 10);
  if (!n) return;
  const small = el.querySelector('small') ? el.querySelector('small').outerHTML : '';
  let cur = 0, step = Math.max(1, Math.round(n / 28));
  const tick = () => { cur = Math.min(n, cur + step); el.innerHTML = cur + small; if (cur < n) requestAnimationFrame(tick); };
  tick();
}
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && !reduce) {
  const g = window.gsap; g.registerPlugin(window.ScrollTrigger);
  // hero: reveal por linha + resto
  g.set('.hero .li', { yPercent: 115 });
  g.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero .li', { yPercent: 0, duration: 1, stagger: 0.12, delay: 0.15 })
    .from('.hero .lead, .hero .stats, .hero .cta-row, .hero .eyebrow', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.6')
    .from('.hero .portrait', { opacity: 0, scale: 0.96, duration: 1 }, '-=0.9');
  // reveal em lote por scroll
  window.ScrollTrigger.batch('.rv', {
    start: 'top 88%',
    onEnter: els => g.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true }),
  });
  g.set('.rv', { y: 26, opacity: 0 });
  // parallax retrato/about
  document.querySelectorAll('[data-parallax]').forEach(el => {
    g.to(el, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });
  // count-up stats
  document.querySelectorAll('.stat .v[data-n]').forEach(el => {
    window.ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => countUp(el) });
  });
} else {
  document.querySelectorAll('.hero .li').forEach(el => el.style.transform = 'none');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
}
