/* Collection pages (Projects, Skills).
   - No hash  -> overview grid of tiles.
   - #slug    -> one item: title, video, description, facts, gallery, next/previous.
   A chip rail under the menu bar switches between items at every screen size.
   Gallery items can be photos or clips; both open in the full-screen viewer. */
(() => {
  const { esc, tick, icon } = window.JW;
  const root = document.querySelector("[data-collection]");
  if (!root) return;
  const kind = root.dataset.collection;
  const isProjects = kind === "projects";
  const items = isProjects ? window.PROJECTS : window.SKILLS;
  const bySlug = Object.fromEntries((window.PROJECTS || []).map((p) => [p.slug, p]));
  const rail = document.querySelector(".rail-list");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TONES = ["sky", "oat", "olive", "fig", "clay"];
  let cur = null; // index, or -1 for the overview

  /* ---------- rail ---------- */
  rail.innerHTML =
    `<li><a class="chip" href="#" data-i="-1">All</a></li>` +
    items.map((it, i) => `<li><a class="chip" href="#${it.slug}" data-i="${i}">${esc(it.title)}</a></li>`).join("");
  // a vertical mouse wheel scrolls the rail sideways
  rail.parentElement.addEventListener("wheel", (e) => {
    const r = e.currentTarget;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || r.scrollWidth <= r.clientWidth) return;
    e.preventDefault(); r.scrollLeft += e.deltaY;
  }, { passive: false });
  function syncRail() {
    rail.querySelectorAll(".chip").forEach((c) => {
      const on = +c.dataset.i === cur;
      if (on) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current");
      if (on) { // centre the active chip without scrolling the page
        const r = rail.parentElement;
        r.scrollTo({ left: c.offsetLeft - (r.clientWidth - c.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
      }
    });
  }

  /* ---------- pieces ---------- */
  const coverOf = (it) => it.cover || (it.video && it.video.poster) || (it.gallery || []).map((g) => g.poster || g.src).find(Boolean) || null;
  const ratio = (m) => (m && m.w && m.h ? m.w / m.h : 16 / 9);
  const tagsH = (it) => [it.year, ...(it.tags || [])].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("");

  function tileH(it, i) {
    const cover = coverOf(it);
    const big = i === 0 || (isProjects && it.featured);
    return `<a class="tile${big ? " tile--wide" : ""}${cover ? " tile--media" : ` tile--${TONES[i % TONES.length]}`}" href="#${it.slug}" data-press data-i="${i}">
      ${cover ? `<img src="${esc(cover)}" alt="" loading="${i < 4 ? "eager" : "lazy"}">` : ""}
      ${it.video && cover ? `<video muted loop playsinline preload="none" data-src="${esc(it.video.src)}" aria-hidden="true"></video>` : ""}
      <span class="tile-body"><span class="tile-meta">${tagsH(it)}</span><span class="tile-title">${esc(it.title)}</span></span>
      <span class="tile-go" aria-hidden="true">${icon.arrow}</span>
    </a>`;
  }

  function videoH(v, cls = "") {
    if (!v) return "";
    if (v.type === "youtube") {
      return `<div class="media ${cls}" style="aspect-ratio:16/9"><button class="yt" data-yt="${esc(v.id)}" aria-label="Play video" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/maxresdefault.jpg')"><span class="playbadge">${icon.play}</span></button></div>`;
    }
    return `<div class="media ${cls}" style="aspect-ratio:${v.w || 16}/${v.h || 9}">
      <video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ""} muted loop playsinline ${reduce ? "" : "autoplay"} preload="metadata"></video>
      <button class="media-toggle" aria-label="${reduce ? "Play" : "Pause"} video" data-toggle>${reduce ? icon.play : icon.pause}</button></div>`;
  }
  function descH(it) {
    if (!it.description || !it.description.length) return "";
    return `<div class="prose">${it.description.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
  }
  function factsH(it) {
    const rows = [["Role", it.role], ["Tools", it.tools], ["Team", it.team]].filter(([, v]) => v);
    return rows.length ? `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : "";
  }
  function relatedH(it) {
    const links = (it.related || []).filter((s) => bySlug[s]).map((s) => `<a class="btn btn--quiet" data-press href="projects.html#${s}">${esc(bySlug[s].title)}${icon.chev}</a>`).join("");
    return links ? `<div class="related">${links}</div>` : "";
  }
  function galleryH(g) {
    if (!g.length) return "";
    return `<section class="gallery" aria-label="Gallery">
      <div class="rail-x">${g.map((m, n) => `<button class="shot" data-n="${n}" data-press style="--ar:${((m.w || 4) / (m.h || 3)).toFixed(4)};aspect-ratio:${m.w || 4}/${m.h || 3}" aria-label="Open ${m.video ? "clip" : "photo"} ${n + 1} of ${g.length}">
          <img src="${esc(m.poster || m.src)}" alt="${esc(m.caption || "")}" loading="lazy" decoding="async">${m.video ? `<span class="playbadge playbadge--sm">${icon.play}</span>` : ""}</button>`).join("")}</div>
      <div class="paddles"><button class="paddle" data-g="-1" data-press aria-label="Previous">${icon.left}</button><button class="paddle" data-g="1" data-press aria-label="Next">${icon.right}</button></div>
    </section>`;
  }
  function pagerH(i) {
    const prev = items[(i - 1 + items.length) % items.length], next = items[(i + 1) % items.length];
    return `<nav class="pager" aria-label="More">
      <a class="pager-link" data-press href="#${prev.slug}">${icon.left}<span>${esc(prev.title)}</span></a>
      <a class="pager-link pager-link--next" data-press href="#${next.slug}"><span>${esc(next.title)}</span>${icon.right}</a></nav>`;
  }

  /* ---------- views ---------- */
  function overview() {
    document.title = `${isProjects ? "Projects" : "Skills"} — ${window.SITE.name}`;
    root.innerHTML = `<div class="tiles tiles--${kind}">${items.map(tileH).join("")}</div>`;
  }
  function detail(it, i) {
    document.title = `${it.title} — ${window.SITE.name}`;
    const g = it.gallery || [];
    const portrait = it.video && ratio(it.video) < 0.95;
    const head = `<header class="item-head"><div class="eyebrow">${tagsH(it)}</div><h1 class="display" tabindex="-1">${esc(it.title)}</h1></header>`;
    const body = `${descH(it)}${factsH(it)}${relatedH(it)}`;
    const live = it.live && window.JW_LIVE ? `<section class="live" aria-label="Live from the bot"></section>` : "";
    const empty = !it.video && !g.length && !body && !live;
    root.innerHTML = `<article class="item${portrait ? " item--portrait" : ""}${it.video ? "" : " item--novideo"}" style="--ar:${ratio(it.video).toFixed(4)}">
        ${portrait
          ? `<div class="item-split"><div class="item-media">${videoH(it.video)}</div><div class="item-text">${head}${body}</div></div>`
          : `${head}${videoH(it.video, ratio(it.video) > 1.3 ? "media--hero media--wide" : "media--hero")}${live}${body ? `<div class="item-text item-text--cols">${body}</div>` : ""}`}
        ${empty ? `<p class="soon">Coming soon</p>` : ""}
        ${galleryH(g)}
        ${pagerH(i)}
      </article>`;
    root._gallery = g;
    const lv = root.querySelector(".live");
    if (lv) window.JW_LIVE.mount(lv);
    root.querySelectorAll(".rail-x").forEach(wireRail);
    const v = root.querySelector(".media video");
    if (v) {
      v.addEventListener("play", () => syncToggle(v)); v.addEventListener("pause", () => syncToggle(v));
      if (!reduce) v.play().catch(() => syncToggle(v));
      watch(v);
    }
  }

  // the main clip rests while it is off screen, and resumes only if the visitor had not paused it
  let io = null;
  function watch(v) {
    if (io) io.disconnect();
    if (!("IntersectionObserver" in window)) return;
    io = new IntersectionObserver(([en]) => {
      if (!v.isConnected) return io.disconnect();
      if (!en.isIntersecting) { if (!v.paused) { v._auto = true; v.pause(); } }
      else if (v._auto) { v._auto = false; v.play().catch(() => {}); }
    }, { threshold: 0.2 });
    io.observe(v);
  }

  function show(i, instant) {
    if (i === cur) return;
    const forward = cur === null || i > cur, from = cur;
    // keep keyboard focus inside the view that is about to be replaced
    const keep = !instant && (root.contains(document.activeElement) || document.activeElement === document.body);
    cur = i;
    syncRail();
    const paint = () => {
      i < 0 ? overview() : detail(items[i], i);
      scrollTo({ top: 0, behavior: "auto" });
      if (keep) {
        const t = i < 0 ? (root.querySelector(`.tile[data-i="${from}"]`) || root.querySelector(".tile")) : root.querySelector(".item-head h1");
        if (t) t.focus({ preventScroll: true });
      }
    };
    if (instant || reduce) { paint(); return; }
    root.classList.add("is-leaving");
    setTimeout(() => {
      paint();
      root.classList.remove("is-leaving");
      root.style.setProperty("--enter", forward ? "14px" : "-14px");
      root.classList.remove("is-entering"); void root.offsetWidth; root.classList.add("is-entering");
    }, 120);
  }
  const fromHash = () => {
    let slug = location.hash.slice(1);
    try { slug = decodeURIComponent(slug); } catch { /* a malformed hash matches nothing and shows the overview */ }
    return items.findIndex((it) => it.slug === slug);
  };
  addEventListener("hashchange", () => { if (lightbox.isOpen()) lightbox.close(); show(fromHash()); });

  /* ---------- events ---------- */
  function syncToggle(v) {
    const b = v.parentElement.querySelector("[data-toggle]"); if (!b) return;
    b.innerHTML = v.paused ? icon.play : icon.pause;
    b.setAttribute("aria-label", v.paused ? "Play video" : "Pause video");
  }
  root.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle]") || e.target.closest(".media video");
    if (t) {
      const v = t.closest(".media").querySelector("video");
      v._auto = false;
      v.paused ? v.play().catch(() => {}) : v.pause();
      return;
    }
    const yt = e.target.closest("[data-yt]");
    if (yt) { yt.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`; return; }
    const pd = e.target.closest("[data-g]");
    if (pd) { const r = pd.closest(".gallery").querySelector(".rail-x"); r.scrollBy({ left: +pd.dataset.g * r.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" }); return; }
    const shot = e.target.closest(".shot");
    if (shot && !shot.closest(".rail-x").dataset.moved) lightbox.open(root._gallery, +shot.dataset.n);
  });
  // tiles: preview the clip on hover (pointer devices only)
  root.addEventListener("pointerover", (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const v = e.target.closest(".tile")?.querySelector("video"); if (!v || v._on) return;
    v._on = true; if (!v.src) v.src = v.dataset.src;
    v.play().then(() => v.classList.add("on")).catch(() => {});
  });
  root.addEventListener("pointerout", (e) => {
    const tile = e.target.closest(".tile"); if (!tile || tile.contains(e.relatedTarget)) return;
    const v = tile.querySelector("video"); if (!v) return;
    v._on = false; v.classList.remove("on"); v.pause();
  });

  /* gallery rail: mouse drag to scroll, paddles enable/disable at the ends */
  function wireRail(r) {
    const [prev, next] = r.parentElement.querySelectorAll(".paddle");
    const sync = () => {
      const max = r.scrollWidth - r.clientWidth;
      const atStart = r.scrollLeft <= 2, atEnd = r.scrollLeft >= max - 2;
      // a button about to be disabled hands focus to its neighbour, so the keyboard never lands nowhere
      if (atEnd && !atStart && document.activeElement === next) prev.focus({ preventScroll: true });
      if (atStart && !atEnd && document.activeElement === prev) next.focus({ preventScroll: true });
      prev.disabled = atStart; next.disabled = atEnd;
      r.parentElement.classList.toggle("no-scroll", max <= 2);
    };
    r.addEventListener("scroll", sync, { passive: true });
    new ResizeObserver(sync).observe(r);
    r.querySelectorAll("img").forEach((im) => im.addEventListener("load", sync, { once: true }));
    let down = false, sx = 0, sl = 0;
    r.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = r.scrollLeft; delete r.dataset.moved; });
    r.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5 && !r.dataset.moved) { r.dataset.moved = "1"; r.classList.add("dragging"); r.setPointerCapture(e.pointerId); }
      if (r.dataset.moved) r.scrollLeft = sl - dx;
    });
    const end = () => { if (!down) return; down = false; if (r.dataset.moved) { r.classList.remove("dragging"); setTimeout(() => delete r.dataset.moved, 0); } };
    r.addEventListener("pointerup", end); r.addEventListener("pointercancel", end);
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox.isOpen() || cur === null || cur < 0 || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest("input, textarea, .rail-x, .rail")) return;
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault(); tick(0.6);
    location.hash = items[(cur + step + items.length) % items.length].slug;
  });

  /* ---------- full-screen viewer ---------- */
  const lightbox = (() => {
    const el = document.createElement("div");
    el.className = "lb"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Viewer");
    el.innerHTML = `<div class="lb-viewport"><div class="lb-track"></div></div>
      <button class="lb-btn lb-close" data-press aria-label="Close">${icon.close}</button>
      <button class="lb-btn lb-prev" data-press aria-label="Previous">${icon.left}</button>
      <button class="lb-btn lb-next" data-press aria-label="Next">${icon.right}</button>
      <div class="lb-foot"><div class="lb-cap"></div><div class="lb-dots"></div></div>`;
    document.body.appendChild(el);
    const track = el.querySelector(".lb-track"), vp = el.querySelector(".lb-viewport");
    let g = [], idx = 0, open = false, lastFocus = null;

    function set(n, animate = true) {
      idx = Math.max(0, Math.min(g.length - 1, n));
      track.style.transition = animate && !reduce ? "transform 420ms cubic-bezier(.32,.72,0,1)" : "none";
      track.style.transform = `translate3d(${-idx * 100}%,0,0)`;
      track.querySelectorAll(".lb-slide").forEach((s, k) => {
        s.classList.toggle("cur", k === idx);
        const m = s.firstElementChild;
        if (Math.abs(k - idx) <= 1 && m.dataset.src) { m.src = m.dataset.src; delete m.dataset.src; }
        if (m.tagName === "VIDEO") { if (k === idx) m.play().catch(() => {}); else m.pause(); }
      });
      el.querySelector(".lb-cap").textContent = g[idx].caption || "";
      el.querySelectorAll(".lb-dots i").forEach((d, k) => d.classList.toggle("on", k === idx));
      el.querySelector(".lb-prev").disabled = idx === 0;
      el.querySelector(".lb-next").disabled = idx === g.length - 1;
    }
    function go(d) { const n = idx + d; if (n < 0 || n >= g.length) return set(idx); tick(0.7); set(n); }
    function openLb(list, n) {
      g = list; lastFocus = document.activeElement;
      track.innerHTML = g.map((m) => `<div class="lb-slide">${m.video
        ? `<video data-src="${esc(m.video)}" ${m.poster ? `poster="${esc(m.poster)}"` : ""} controls loop playsinline muted></video>`
        : `<img data-src="${esc(m.src)}" alt="${esc(m.caption || "")}" draggable="false">`}</div>`).join("");
      el.querySelector(".lb-dots").innerHTML = g.length > 1 ? g.map(() => "<i></i>").join("") : "";
      el.hidden = false; open = true; pointers = 0;
      document.documentElement.classList.add("lb-open");
      set(n, false);
      el.querySelector(".lb-close").focus({ preventScroll: true });
    }
    function close() {
      track.querySelectorAll("video").forEach((v) => v.pause());
      el.hidden = true; open = false;
      document.documentElement.classList.remove("lb-open");
      if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
    }
    el.querySelector(".lb-close").addEventListener("click", close);
    el.querySelector(".lb-prev").addEventListener("click", () => go(-1));
    el.querySelector(".lb-next").addEventListener("click", () => go(1));
    document.addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const f = [...el.querySelectorAll("button:not([disabled])")];
        e.preventDefault(); f[(f.indexOf(document.activeElement) + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    /* swipe: the strip follows the finger then snaps; swipe down closes */
    let sx = 0, sy = 0, dx = 0, drag = false, axis = null, t0 = 0, onMedia = false, pointers = 0;
    vp.addEventListener("pointerdown", (e) => {
      pointers++;
      if (pointers > 1) { drag = false; set(idx, false); return; } // second finger: leave it to pinch-zoom
      const v = e.target.closest("video");
      if (v && e.clientY > v.getBoundingClientRect().bottom - 64) return; // the clip's own control bar
      onMedia = !!e.target.closest("img, video"); // remembered here: once captured, pointerup reports the viewport
      drag = true; axis = null; sx = e.clientX; sy = e.clientY; dx = 0; t0 = performance.now();
      track.style.transition = "none";
      if (!v) vp.setPointerCapture(e.pointerId); // on a clip, capture only once it is clearly a swipe, so a tap still plays/pauses
    });
    vp.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const mx = e.clientX - sx, my = e.clientY - sy;
      if (!axis && Math.hypot(mx, my) > 6) {
        axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
        if (!vp.hasPointerCapture(e.pointerId)) vp.setPointerCapture(e.pointerId);
      }
      if (axis === "x") {
        dx = mx;
        const edge = (idx === 0 && dx > 0) || (idx === g.length - 1 && dx < 0);
        track.style.transform = `translate3d(calc(${-idx * 100}% + ${edge ? dx * 0.3 : dx}px),0,0)`;
      } else if (axis === "y") {
        const d = Math.max(0, my);
        track.style.transform = `translate3d(${-idx * 100}%,${d}px,0)`;
        el.style.setProperty("--dim", String(Math.max(0.35, 1 - d / 500)));
      }
    });
    const end = (e) => {
      pointers = Math.max(0, pointers - 1);
      if (!drag) return; drag = false;
      const my = e.clientY - sy, dt = Math.max(1, performance.now() - t0);
      el.style.removeProperty("--dim");
      if (axis === "y" && my > 110) return close();
      if (axis === "x") {
        const fast = Math.abs(dx) / dt > 0.45;
        if (dx < -60 || (fast && dx < -20)) return go(1);
        if (dx > 60 || (fast && dx > 20)) return go(-1);
      }
      if (!axis && e.type === "pointerup" && !onMedia) return close(); // tap the backdrop
      set(idx);
    };
    vp.addEventListener("pointerup", end); vp.addEventListener("pointercancel", end);
    return { open: openLb, close, isOpen: () => open };
  })();

  show(fromHash(), true);
})();
