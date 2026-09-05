/* One clock drives the footage orbit and its typography. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PortfolioVortex = api;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const TAU = Math.PI * 2;
  function sample(index, count, seconds, width, height, reduced = false) {
    seconds *= reduced ? 0.2 : 1;
    const mobile = width <= 768;
    const ring = index % 3;
    const position = Math.floor(index / 3);
    const population = Math.ceil((count - ring) / 3);
    const speed = 0.115 + ring * 0.018;
    const angle = position / population * TAU + ring * 0.57 + seconds * speed;
    const radiusX = width * (mobile ? 0.345 + ring * 0.1 : 0.295 + ring * 0.075);
    const radiusY = height * (0.285 + ring * 0.045);
    const wave = Math.sin(seconds * 0.35 + index * 0.8);
    const depth = Math.sin(angle);
    return {
      x: Math.cos(angle) * (radiusX + wave * 4),
      y: Math.sin(angle) * radiusY + Math.cos(angle) * height * -0.055,
      z: depth * (mobile ? 42 : 95) - ring * 13,
      scale: 0.7 + (depth + 1) * 0.18 + ring * 0.035,
      rotate: Math.cos(angle) * -10 + wave * 1.8,
      turn: Math.cos(angle) * (mobile ? 9 : 15),
      layer: depth > 0.4 ? 260 + ring : 60 + ring,
      shade: 0.05 + (1 - depth) * 0.085,
    };
  }
  function start({ wall, hero, reducedMotion, saveData }) {
    if (!wall || !hero || wall.dataset.vortexReady) return;
    const tiles = Array.from(wall.querySelectorAll(".hero-tile"));
    if (!tiles.length) return;
    wall.dataset.vortexReady = "true";
    wall.removeAttribute("aria-hidden");
    tiles.forEach((tile) => tile.setAttribute("aria-hidden", "true"));
    const copy = hero.querySelector(".hero__copy");
    const signature = hero.querySelector(".hero__name");
    if (signature) wall.append(signature);
    if (copy) wall.append(copy);
    const lines = copy ? Array.from(copy.querySelectorAll(".vortex-line")) : [];
    const letters = lines.map((line) => {
      const text = line.textContent;
      line.replaceChildren(...Array.from(text, (letter) => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00a0" : letter;
        return span;
      }));
      return Array.from(line.children);
    });
    let width = wall.clientWidth, height = wall.clientHeight;
    let elapsed = 0, last = 0, frame = 0, visible = false;
    const draw = () => {
      const reduce = reducedMotion.matches;
      tiles.forEach((tile, index) => {
        const p = sample(index, tiles.length, saveData ? 0 : elapsed, width, height, reduce);
        tile.style.transform = `translate3d(calc(-50% + ${p.x.toFixed(2)}px),calc(-50% + ${p.y.toFixed(2)}px),${p.z.toFixed(2)}px) rotateY(${p.turn.toFixed(2)}deg) rotateZ(${p.rotate.toFixed(2)}deg) scale(${p.scale.toFixed(3)})`;
        tile.style.zIndex = p.layer;
        tile.style.setProperty("--vortex-shade", p.shade.toFixed(3));
      });
      letters.forEach((row, lineIndex) => row.forEach((letter, index) => {
        const phase = elapsed * 0.62 * (reduce ? 0.35 : 1) + index * 0.42 + lineIndex * 1.8;
        const amplitude = width <= 768 ? 2.5 : 6;
        const y = saveData ? 0 : Math.sin(phase) * amplitude * (reduce ? 0.28 : 1);
        const turn = saveData ? 0 : Math.sin(phase * 0.7) * (reduce ? 0.5 : 2);
        letter.style.transform = `translate3d(0,${y.toFixed(2)}px,0) rotate(${turn.toFixed(2)}deg)`;
      }));
    };
    const tick = (now) => {
      elapsed += Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible && !document.hidden && !saveData) frame = requestAnimationFrame(tick);
      else draw();
    };
    const measure = () => {
      width = wall.clientWidth;
      height = wall.clientHeight;
      draw();
    };
    new ResizeObserver(measure).observe(wall);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.001 }).observe(hero);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    draw();
  }
  return { sample, start };
});
