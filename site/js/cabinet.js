/* Filing cabinet: sidebar of drawings + one sheet at a time, gallery + lightbox.
   Used by projects.html (data-cabinet="projects") and skills.html (data-cabinet="skills").
   Projects can use several page layouts (see LAYOUTS); a switcher above the sheet previews them. */
(() => {
  const { esc, pad, placeholder, tick } = window.JW;
  const root = document.querySelector("[data-cabinet]");
  if (!root) return;
  const kind = root.dataset.cabinet;
  const isProjects = kind === "projects";
  const items = isProjects ? window.PROJECTS : window.SKILLS;
  const projectsBySlug = Object.fromEntries((window.PROJECTS || []).map((p) => [p.slug, p]));
  const list = root.querySelector(".drawer-list");
  const sheet = root.querySelector(".sheet");
  const LAYOUTS = ["cinema", "split", "bento", "story", "classic"];
  let cur = -1;
  let forced = null; // layout chosen in the switcher; null = each project's own

  const ICON = {
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  };

  /* ---------- sidebar ---------- */
  list.innerHTML = items.map((it, i) => `
    <li role="presentation"><button class="drawer-item" role="tab" id="tab-${it.slug}" aria-selected="false" aria-controls="sheet" data-i="${i}">${esc(it.title)}</button></li>`).join("");
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".drawer-item");
    if (b) show(+b.dataset.i);
  });
  list.addEventListener("keydown", (e) => {
    const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in map) || !e.target.closest(".drawer-item")) return;
    e.preventDefault();
    const n = (cur + map[e.key] + items.length) % items.length;
    show(n); list.querySelectorAll(".drawer-item")[n].focus();
  });

  /* ---------- layout switcher (projects only) ---------- */
  let bar;
  if (isProjects) {
    bar = document.createElement("div");
    bar.className = "layout-bar";
    bar.innerHTML = `<div class="seg" role="radiogroup" aria-label="Page layout">
        <button role="radio" data-layout="">Auto</button>
        ${LAYOUTS.map((l) => `<button role="radio" data-layout="${l}">${l[0].toUpperCase() + l.slice(1)}</button>`).join("")}
      </div>`;
    sheet.before(bar);
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("[data-layout]"); if (!b) return;
      forced = b.dataset.layout || null;
      swap(() => render(items[cur], cur), "in-up");
    });
  }
  function syncBar() {
    if (!bar) return;
    bar.querySelectorAll("[data-layout]").forEach((b) => {
      b.setAttribute("aria-checked", String(forced ? b.dataset.layout === forced : b.dataset.layout === ""));
    });
  }

  /* ---------- pieces ---------- */
  function shotsOf(it) {
    if (it.gallery && it.gallery.length) return it.gallery.map((g) => ({ src: g.src, caption: g.caption || "" }));
    return [0, 1, 2, 3].map((n) => ({ src: placeholder(n), caption: "" }));
  }
  function mediaH(it, cls = "") {
    const v = it.video;
    if (!v) return isProjects ? `<div class="media pending ${cls}"><span class="play">${ICON.play}</span></div>` : "";
    if (v.type === "youtube") {
      return `<div class="media ${cls}"><button class="yt" data-yt="${esc(v.id)}" aria-label="Play video" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/maxresdefault.jpg')"><span class="play">${ICON.play}</span></button></div>`;
    }
    return `<div class="media ${cls}"><video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ""} controls playsinline preload="metadata"></video></div>`;
  }
  function metaH(it) {
    const bits = [it.year ? `<span>${esc(it.year)}</span>` : "", ...(it.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`)].join("");
    return bits ? `<div class="sheet-meta">${bits}</div>` : "";
  }
  const titleH = (it) => `<h1 class="sheet-title" id="sheet-title">${esc(it.title)}</h1>`;
  function descH(it, lead = false) {
    if (!it.description || !it.description.length) return `<div class="desc draft${lead ? " lead" : ""}"><p>Coming soon.</p></div>`;
    return `<div class="desc${lead ? " lead" : ""}">${it.description.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
  }
  function factsH(it) {
    const rows = [["Year", it.year], ["Type", (it.tags || []).join(", ")], ["Role", it.role], ["Tools", it.tools]].filter(([, v]) => v);
    return rows.length ? `<dl class="facts">${rows.map(([k, v]) => `<div class="row"><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : "";
  }
  const shotH = (s, n, eager) => `<button class="shot" data-n="${n}" aria-label="Open image ${n + 1}${s.caption ? ": " + esc(s.caption) : ""}"><img src="${s.src}" alt="${esc(s.caption)}" loading="${eager ? "eager" : "lazy"}" decoding="async"></button>`;
  function sliderH(shots, { wide = false } = {}) {
    return `<div class="gal-head"><button class="key key--icon" data-g="-1" aria-label="Scroll gallery left">${ICON.left}</button><button class="key key--icon" data-g="1" aria-label="Scroll gallery right">${ICON.right}</button></div>
      <div class="track${wide ? " wide" : ""}" tabindex="0" aria-label="Gallery">${shots.map((s, n) => shotH(s, n, n < 3)).join("")}</div>`;
  }
  function relatedH(it) {
    if (isProjects) return "";
    const links = (it.related || []).filter((s) => projectsBySlug[s]).map((s) =>
      `<a class="key" href="projects.html#${s}">${esc(projectsBySlug[s].title)}</a>`).join("");
    return links ? `<div class="related">${links}</div>` : "";
  }
  function pagerH(i) {
    const prev = items[(i - 1 + items.length) % items.length], next = items[(i + 1) % items.length];
    return `<nav class="pager" aria-label="More">
      <button class="row-link" data-step="-1">${ICON.left}${esc(prev.title)}</button>
      <button class="row-link next" data-step="1">${esc(next.title)}${ICON.right}</button></nav>`;
  }

  /* ---------- layouts ---------- */
  const L = {
    classic: (it, i, s) => `${metaH(it)}${titleH(it)}${mediaH(it)}${it.video || isProjects ? `<div style="height:26px"></div>` : ""}${descH(it)}${relatedH(it)}${sliderH(s)}${pagerH(i)}`,

    cinema: (it, i, s) => `${mediaH(it, "bleed")}
      <div class="cin-body"><div>${metaH(it)}${titleH(it)}${descH(it)}</div>${factsH(it)}</div>
      ${sliderH(s, { wide: true })}${pagerH(i)}`,

    split: (it, i, s) => `<div class="split">
      <div class="split-media">${mediaH(it)}<div class="thumbs">${s.slice(0, 4).map((x, n) => shotH(x, n, true)).join("")}</div></div>
      <div class="split-text">${metaH(it)}${titleH(it)}${descH(it)}${factsH(it)}${pagerH(i)}</div></div>`,

    bento: (it, i, s) => `<div class="bento-head"><div>${metaH(it)}${titleH(it)}</div>${descH(it)}</div>
        <div class="bento">${mediaH(it)}${s.map((x, n) => shotH(x, n, n < 4)).join("")}</div>${pagerH(i)}`,

    story: (it, i, s) => {
      const secs = it.sections && it.sections.length ? it.sections : [
        { heading: "The problem" }, { heading: "The build" }, { heading: "The result" }];
      const figsFor = (k) => (k % 2 === 1
        ? `<div class="figs one">${shotH(s[k % s.length], k % s.length)}</div>`
        : `<div class="figs">${shotH(s[(k * 2) % s.length], (k * 2) % s.length)}${shotH(s[(k * 2 + 1) % s.length], (k * 2 + 1) % s.length)}</div>`);
      return `<div class="story-head">${metaH(it)}${titleH(it)}${descH(it, true)}</div>
        ${mediaH(it, "wide")}
        ${secs.map((sec, k) => `<section class="chapter"><h2>${esc(sec.heading)}</h2>
          <div><div class="desc${sec.text ? "" : " draft"}"><p>${sec.text ? esc(sec.text) : "Coming soon."}</p></div>${figsFor(k)}</div></section>`).join("")}
        ${sliderH(s)}${pagerH(i)}`;
    },
  };

  function render(it, i) {
    const layout = isProjects ? (forced || it.layout || "cinema") : "classic";
    const shots = shotsOf(it);
    sheet.className = `sheet L-${layout}`;
    sheet.innerHTML = L[layout](it, i, shots);
    sheet._shots = shots;
    sheet.querySelectorAll(".track").forEach(wireTrack);
    syncBar();
  }

  let animT;
  function swap(doRender, dir) {
    clearTimeout(animT);
    sheet.classList.remove("out", "in-up", "in-down");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { doRender(); return; }
    sheet.classList.add("out");
    animT = setTimeout(() => {
      doRender();
      void sheet.offsetWidth;
      sheet.classList.add(dir);
      const top = (bar || sheet).getBoundingClientRect().top;
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) + (innerWidth <= 900 ? 66 : 20);
      if (top < offset - 4) scrollTo({ top: scrollY + top - offset, behavior: "smooth" });
    }, 110);
  }

  function show(i) {
    if (i === cur) return;
    const dir = i > cur ? "in-up" : "in-down";
    const first = cur === -1;
    cur = i;
    const it = items[i];
    const tabs = list.querySelectorAll(".drawer-item");
    tabs.forEach((b, n) => b.setAttribute("aria-selected", String(n === i)));
    if (innerWidth <= 900 || first) tabs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: first ? "auto" : "smooth" });
    sheet.setAttribute("aria-labelledby", tabs[i].id);
    history.replaceState(null, "", "#" + it.slug);
    document.title = `${it.title} — ${window.SITE.name}`;
    if (first) render(it, i); else swap(() => render(it, i), dir);
  }

  sheet.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) return show((cur + +step.dataset.step + items.length) % items.length);
    const g = e.target.closest("[data-g]");
    if (g) { const t = g.closest(".gal-head").nextElementSibling; t.scrollBy({ left: +g.dataset.g * t.clientWidth * 0.8, behavior: "smooth" }); return; }
    const yt = e.target.closest("[data-yt]");
    if (yt) {
      yt.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`;
      return;
    }
    const shot = e.target.closest(".shot");
    if (shot && !shot.closest(".track")?.dataset.moved) lightbox.open(sheet._shots, +shot.dataset.n);
  });

  /* mouse drag-to-scroll on a gallery track (touch scrolls natively) */
  function wireTrack(t) {
    let down = false, sx = 0, sl = 0;
    t.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; sx = e.clientX; sl = t.scrollLeft; delete t.dataset.moved;
    });
    t.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5 && !t.dataset.moved) { t.dataset.moved = "1"; t.classList.add("dragging"); t.setPointerCapture(e.pointerId); }
      if (t.dataset.moved) t.scrollLeft = sl - dx;
    });
    const end = () => {
      if (!down) return; down = false;
      if (t.dataset.moved) { t.classList.remove("dragging"); setTimeout(() => delete t.dataset.moved, 0); }
    };
    t.addEventListener("pointerup", end); t.addEventListener("pointercancel", end);
  }

  /* global keys: up/down (or j/k) flip drawings */
  document.addEventListener("keydown", (e) => {
    if (lightbox.isOpen() || e.target.closest("input, textarea, .drawer-list, .track, .seg")) return;
    if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); show((cur + 1) % items.length); tick(0.6); }
    if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); show((cur - 1 + items.length) % items.length); tick(0.6); }
  });

  /* ---------- lightbox ---------- */
  const lightbox = (() => {
    const el = document.createElement("div");
    el.className = "lb";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Image viewer");
    el.innerHTML = `
      <div class="lb-viewport"><div class="lb-track"></div></div>
      <button class="key key--icon lb-close" aria-label="Close">${ICON.close}</button>
      <button class="key key--icon lb-prev" aria-label="Previous image">${ICON.left}</button>
      <button class="key key--icon lb-next" aria-label="Next image">${ICON.right}</button>
      <div class="lb-cap"><div class="lb-text"></div><div class="lb-dots"></div></div>`;
    document.body.appendChild(el);
    const track = el.querySelector(".lb-track"), vp = el.querySelector(".lb-viewport");
    let shots = [], idx = 0, open = false, lastFocus = null;

    function set(n, animate = true) {
      idx = Math.max(0, Math.min(shots.length - 1, n));
      track.style.transition = animate ? "transform 320ms cubic-bezier(.2,.8,.2,1)" : "none";
      track.style.transform = `translateX(${-idx * 100}%)`;
      track.querySelectorAll(".lb-slide").forEach((s, k) => {
        s.classList.toggle("cur", k === idx);
        const img = s.querySelector("img");
        if (Math.abs(k - idx) <= 1 && !img.src) img.src = img.dataset.src; // preload neighbours
      });
      el.querySelector(".lb-text").textContent = shots[idx].caption || "";
      el.querySelectorAll(".lb-dots i").forEach((d, k) => d.classList.toggle("on", k === idx));
      el.querySelector(".lb-prev").disabled = idx === 0;
      el.querySelector(".lb-next").disabled = idx === shots.length - 1;
    }
    function go(d) {
      const n = idx + d;
      if (n < 0 || n >= shots.length) { set(idx); return; }
      tick(0.7); set(n);
    }
    function openLb(list, n) {
      shots = list; lastFocus = document.activeElement;
      track.innerHTML = shots.map((s) => `<div class="lb-slide"><img data-src="${s.src}" alt="${esc(s.caption)}" draggable="false"></div>`).join("");
      el.querySelector(".lb-dots").innerHTML = shots.map(() => "<i></i>").join("");
      el.classList.add("open"); open = true;
      document.documentElement.style.overflow = "hidden";
      set(n, false);
      el.querySelector(".lb-close").focus({ preventScroll: true });
    }
    function close() {
      el.classList.remove("open"); open = false;
      document.documentElement.style.overflow = "";
      lastFocus && lastFocus.focus({ preventScroll: true });
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
        const i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    /* swipe: the strip follows the finger, then snaps; swipe down closes */
    let sx = 0, sy = 0, dx = 0, dragging = false, axis = null, t0 = 0;
    vp.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true; axis = null; sx = e.clientX; sy = e.clientY; dx = 0; t0 = performance.now();
      vp.setPointerCapture(e.pointerId);
      track.style.transition = "none";
    });
    vp.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const mx = e.clientX - sx, my = e.clientY - sy;
      if (!axis && Math.hypot(mx, my) > 6) axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
      if (axis === "x") {
        dx = mx;
        const edge = (idx === 0 && dx > 0) || (idx === shots.length - 1 && dx < 0);
        track.style.transform = `translateX(calc(${-idx * 100}% + ${edge ? dx * 0.3 : dx}px))`;
      } else if (axis === "y") {
        const d = Math.max(0, my);
        track.style.transform = `translateX(${-idx * 100}%) translateY(${d}px)`;
        el.style.background = `rgba(8,9,12,${Math.max(0.4, 0.96 - d / 500)})`;
      }
    });
    const end = (e) => {
      if (!dragging) return; dragging = false;
      const my = e.clientY - sy, dt = performance.now() - t0;
      el.style.background = "";
      if (axis === "y" && my > 110) { close(); return; }
      if (axis === "x") {
        const fast = Math.abs(dx) / dt > 0.45;
        if (dx < -60 || (fast && dx < -20)) return go(1);
        if (dx > 60 || (fast && dx > 20)) return go(-1);
      }
      if (!axis && !e.target.closest("img") && e.type === "pointerup") { close(); return; }
      set(idx);
    };
    vp.addEventListener("pointerup", end);
    vp.addEventListener("pointercancel", end);

    return { open: openLb, isOpen: () => open };
  })();

  /* ---------- start ---------- */
  function fromHash() {
    const i = items.findIndex((it) => it.slug === decodeURIComponent(location.hash.slice(1)));
    return i < 0 ? 0 : i;
  }
  show(fromHash());
  addEventListener("hashchange", () => show(fromHash()));
})();
