/* Home hero: a live pegboard. Holes light blue near the pointer; a tap sends a ripple.
   When idle, a slow sweep wanders the board. Optional background video from SITE.heroVideo. */
(() => {
  const hero = document.querySelector(".hero");
  const cv = hero && hero.querySelector(".hero-canvas");
  if (!cv) return;

  const v = window.SITE.heroVideo;
  if (v && v.src) {
    const vid = Object.assign(document.createElement("video"), { src: v.src, muted: true, loop: true, autoplay: true, playsInline: true, className: "hero-video" });
    if (v.poster) vid.poster = v.poster;
    vid.setAttribute("aria-hidden", "true");
    hero.prepend(vid);
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = 28, R0 = 1.8, REACH = 190;
  const c = cv.getContext("2d");
  const base = document.createElement("canvas");
  let W = 0, H = 0, dpr = 1, holes = [];
  const ptr = { x: -999, y: -999, tx: -999, ty: -999, last: 0 };
  const ripples = [];
  let running = false, raf = 0;

  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = hero.clientWidth; H = hero.clientHeight;
    for (const k of [cv, base]) { k.width = W * dpr; k.height = H * dpr; }
    cv.style.width = W + "px"; cv.style.height = H + "px";
    holes = [];
    const ox = (W % G) / 2 + G / 2, oy = (H % G) / 2 + G / 2;
    for (let y = oy; y < H; y += G) for (let x = ox; x < W; x += G) holes.push(x, y);
    const b = base.getContext("2d");
    b.setTransform(dpr, 0, 0, dpr, 0, 0);
    b.clearRect(0, 0, W, H);
    for (let i = 0; i < holes.length; i += 2) {
      b.fillStyle = "rgba(11,11,12,.14)"; b.beginPath(); b.arc(holes[i], holes[i + 1], R0, 0, 6.2832); b.fill();
    }
    draw(performance.now());
  }

  function draw(now) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    c.drawImage(base, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // idle sweep after 2.5 s without the pointer
    if (now - ptr.last > 2500) {
      const t = now / 1000;
      ptr.tx = W * (0.5 + 0.38 * Math.sin(t * 0.37)); ptr.ty = H * (0.5 + 0.34 * Math.sin(t * 0.53 + 1.3));
    }
    ptr.x += (ptr.tx - ptr.x) * 0.22; ptr.y += (ptr.ty - ptr.y) * 0.22;

    for (let k = ripples.length - 1; k >= 0; k--) if (now - ripples[k].t > 1300) ripples.splice(k, 1);

    c.fillStyle = "#1d4cff";
    for (let i = 0; i < holes.length; i += 2) {
      const x = holes[i], y = holes[i + 1];
      let a = 0;
      const d = Math.hypot(x - ptr.x, y - ptr.y);
      if (d < REACH) a = 1 - d / REACH;
      for (const r of ripples) {
        const age = now - r.t, rad = age * 0.75, band = Math.abs(Math.hypot(x - r.x, y - r.y) - rad);
        if (band < 26) a = Math.max(a, (1 - band / 26) * (1 - age / 1300));
      }
      if (a > 0.02) {
        c.globalAlpha = Math.min(1, a * 1.15);
        c.beginPath(); c.arc(x, y, R0 + a * 3.6, 0, 6.2832); c.fill();
      }
    }
    c.globalAlpha = 1;
  }

  function loop(now) { draw(now); raf = running ? requestAnimationFrame(loop) : 0; }
  function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function local(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  hero.addEventListener("pointermove", (e) => {
    const p = local(e); ptr.tx = p.x; ptr.ty = p.y; ptr.last = performance.now();
    if (ptr.x < -500) { ptr.x = p.x; ptr.y = p.y; }
  });
  hero.addEventListener("pointerleave", () => { ptr.last = 0; });
  hero.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    const p = local(e);
    ripples.push({ x: p.x, y: p.y, t: performance.now() });
    ptr.tx = p.x; ptr.ty = p.y; ptr.last = performance.now();
    window.JW.tick(0.8); window.JW.buzz();
    if (reduce) draw(performance.now());
  });

  new ResizeObserver(size).observe(hero);
  new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
})();
