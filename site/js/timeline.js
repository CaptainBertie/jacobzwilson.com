/* History: stops sit left and right; a winding dot-to-dot path joins them.
   As you scroll, a pen draws the path, each dot lights when the pen reaches it,
   and the sticky panel shows the stop you are on. */
(() => {
  const { esc } = window.JW;
  const tl = document.querySelector(".tl");
  if (!tl) return;
  const H = window.HISTORY;
  const titleOf = (h) => (h.kind === "move" && (h.from || h.to) ? `${h.from || "?"} → ${h.to || "?"}` : h.title);

  tl.querySelector(".tl-list").innerHTML = H.map((h, i) => `
    <li class="stop" data-side="${i % 2 ? "r" : "l"}">
      <span class="stop-dot" aria-hidden="true"></span>
      <article class="tl-card">
        <div class="tl-when">${esc(h.when)}</div>
        <h2 class="tl-title">${esc(titleOf(h))}</h2>
        ${h.place ? `<div class="tl-place">${esc(h.place)}</div>` : ""}
        ${h.note ? `<p class="tl-note">${esc(h.note)}</p>` : ""}
      </article>
    </li>`).join("");

  const svg = tl.querySelector(".tl-svg"), guide = tl.querySelector(".tl-guide"), ink = tl.querySelector(".tl-ink"), pen = tl.querySelector(".tl-pen");
  const stops = [...tl.querySelectorAll(".stop")];
  const nowWhen = document.querySelector(".now-when span"), nowTitle = document.querySelector(".now-title"), bar = document.querySelector(".now-bar");
  bar.innerHTML = H.map(() => "<i></i>").join("");
  const segs = [...bar.children];

  let L = 0, samples = [], dotY = [], current = -2, queued = false;

  function layout() {
    const box = tl.getBoundingClientRect();
    const W = box.width, Ht = box.height;
    const pts = stops.map((s) => {
      const r = s.querySelector(".stop-dot").getBoundingClientRect();
      return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
    });
    const end = tl.querySelector(".tl-end").getBoundingClientRect();
    const endPt = [end.left + end.width / 2 - box.left, end.top - box.top - 6];
    const all = [[pts[0][0], 0], ...pts, endPt];
    // vertical tangents at each point give smooth S-bends between stops
    let d = `M${all[0][0]},${all[0][1]}`;
    for (let k = 1; k < all.length; k++) {
      const [x1, y1] = all[k - 1], [x2, y2] = all[k], dy = (y2 - y1) * 0.55;
      d += ` C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
    }
    svg.setAttribute("width", W); svg.setAttribute("height", Ht); svg.setAttribute("viewBox", `0 0 ${W} ${Ht}`);
    guide.setAttribute("d", d); ink.setAttribute("d", d);
    L = ink.getTotalLength();
    ink.style.strokeDasharray = `${L} ${L}`;
    samples = [];
    for (let k = 0; k <= 400; k++) { const p = ink.getPointAtLength((L * k) / 400); samples.push([p.y, (L * k) / 400]); }
    dotY = pts.map((p) => p[1]);
    update();
  }

  function lengthAtY(y) {
    if (y <= samples[0][0]) return 0;
    for (let k = 1; k < samples.length; k++) {
      if (samples[k][0] >= y) {
        const [y0, l0] = samples[k - 1], [y1, l1] = samples[k];
        return l0 + ((y - y0) / Math.max(1e-6, y1 - y0)) * (l1 - l0);
      }
    }
    return L;
  }

  function update() {
    queued = false;
    if (!L) return;
    const y = innerHeight * 0.58 - tl.getBoundingClientRect().top; // the pen sits just below mid-screen
    const len = lengthAtY(y);
    ink.style.strokeDashoffset = String(L - len);
    const p = ink.getPointAtLength(len);
    pen.setAttribute("cx", p.x); pen.setAttribute("cy", p.y);
    let idx = -1;
    stops.forEach((s, k) => {
      const on = dotY[k] <= y;
      if (on) idx = k;
      if (on !== s.classList.contains("on")) s.classList.toggle("on", on);
    });
    segs.forEach((g, k) => g.classList.toggle("on", k <= idx));
    if (idx !== current) {
      if (idx > current && current !== -2) window.JW.tick(0.4);
      current = idx;
      const h = H[Math.max(0, idx)];
      nowWhen.textContent = h.when;
      nowWhen.classList.remove("flip"); void nowWhen.offsetWidth; nowWhen.classList.add("flip");
      nowTitle.textContent = titleOf(h);
    }
  }

  const req = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener("scroll", req, { passive: true });
  new ResizeObserver(layout).observe(tl);
  document.fonts && document.fonts.ready.then(layout);

  const io = new IntersectionObserver((ents) => ents.forEach((e) => e.isIntersecting && e.target.classList.add("seen")), { rootMargin: "0px 0px -10% 0px" });
  stops.forEach((s) => io.observe(s));
})();
