/* Home: name from data.js, and the Projects tile cycles through real clips. */
(() => {
  const S = window.SITE, { esc, icon } = window.JW;
  document.getElementById("kicker").textContent = S.kicker;
  document.getElementById("name").innerHTML = S.name.split(" ").map((w) => `<span>${esc(w)}</span>`).join(" ");
  document.querySelectorAll(".go:empty").forEach((n) => (n.innerHTML = icon.arrow));

  const box = document.getElementById("feature-media");
  const clips = (S.heroClips || []).filter((c) => c && c.src);
  if (!box || !clips.length) return;
  // A still image is always underneath, so the tile is never empty; clips fade in over it.
  box.innerHTML = `<img src="${esc(clips[0].poster)}" alt="">`;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const HOLD = 7000; // ms per clip
  let i = 0, timer = 0, gen = 0, fails = 0, dead = false;
  const next = (ms) => { clearTimeout(timer); if (clips.length > 1 && !dead) timer = setTimeout(() => play(++i), ms); };
  const drop = (v) => { v.removeAttribute("src"); v.load(); v.remove(); };

  function play(n) {
    const my = ++gen; // a newer call, or a tab switch, cancels this one
    const c = clips[n % clips.length];
    const v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    if (c.poster) v.poster = c.poster;
    v.src = c.src;
    box.appendChild(v); // in the page before play(): iOS will not load a detached video
    v.addEventListener("playing", () => {
      if (my !== gen) return drop(v);
      fails = 0;
      void v.offsetWidth;        // commit the start state, then fade (no rAF: it never fires in a background tab)
      v.classList.add("on");
      setTimeout(() => [...box.querySelectorAll("video")].forEach((k) => { if (k !== v) drop(k); }), 1100);
      next(HOLD);
    }, { once: true });
    v.addEventListener("error", () => {
      drop(v);
      if (my !== gen) return;
      if (++fails >= clips.length) { dead = true; clearTimeout(timer); return; } // every clip failed: keep the still
      next(400);
    }, { once: true });
    v.play().catch(() => { if (my === gen && !v.classList.contains("on")) drop(v); }); // autoplay refused (e.g. Low Power Mode): the still stays
  }
  play(0);

  document.addEventListener("visibilitychange", () => {
    const v = box.querySelector("video.on");
    if (document.hidden) { clearTimeout(timer); gen++; if (v) v.pause(); }
    else if (!dead) { if (v) { v.play().catch(() => {}); next(HOLD); } else play(i); }
  });
})();
