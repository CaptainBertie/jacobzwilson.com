/* Shared: icons, press feedback, click sound, haptics, menu, nav state. */
(() => {
  // iOS only applies :active when a touch listener exists.
  document.addEventListener("touchstart", () => {}, { passive: true });

  const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const icon = {
    left: svg(`<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>`),
    right: svg(`<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>`),
    chev: svg(`<path d="m9.5 6 6 6-6 6"/>`, `class="chev"`),
    arrow: svg(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
    out: svg(`<path d="M8 16 16 8M9 8h7v7"/>`),
    close: svg(`<path d="M6 6l12 12M18 6 6 18"/>`),
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8a.8.8 0 0 0-1.2.7z" fill="currentColor"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/></svg>`,
    copy: svg(`<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>`),
    check: svg(`<path d="m5 12.5 4.5 4.5L19 7.5"/>`),
  };

  /* ---- click sound (synthesised, no file) ---- */
  const SOUND_KEY = "jw-sound";
  let soundOn = true;
  try { soundOn = localStorage.getItem(SOUND_KEY) !== "0"; } catch {}
  let ctx, buf;
  function tick(strength = 1) {
    if (!soundOn) return;
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      if (!buf) {
        const len = Math.floor(ctx.sampleRate * 0.018);
        buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 8);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = 0.95 + Math.random() * 0.1;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass"; bp.frequency.value = 3200; bp.Q.value = 1.1;
      const g = ctx.createGain();
      g.gain.value = 0.35 * strength;
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start();
    } catch {}
  }
  function buzz() { try { navigator.vibrate && navigator.vibrate(6); } catch {} }

  /* ---- press feedback ---- */
  const PRESSABLE = "[data-press], .btn, .chip, .nav-link, .icon-btn, .brand";
  let pressed = null, pressedAt = 0, touch = false, sx = 0, sy = 0;
  function release(e) {
    if (!pressed) return;
    const el = pressed; pressed = null;
    // on touch the click sound belongs to a completed tap; a scroll or a cancelled touch stays silent
    if (touch && e && e.type === "pointerup" && Math.hypot(e.clientX - sx, e.clientY - sy) < 12) { tick(); buzz(); }
    setTimeout(() => el.classList.remove("is-pressed"), Math.max(0, 90 - (performance.now() - pressedAt))); // visible even on a fast tap
  }
  document.addEventListener("pointerdown", (e) => {
    if (e.button && e.button !== 0) return;
    const el = e.target.closest(PRESSABLE);
    if (!el || el.disabled) return;
    pressed = el; pressedAt = performance.now();
    touch = e.pointerType === "touch"; sx = e.clientX; sy = e.clientY;
    el.classList.add("is-pressed");
    if (!touch) { tick(); buzz(); }
  });
  ["pointerup", "pointercancel", "dragstart", "blur"].forEach((t) => addEventListener(t, release, true));
  addEventListener("scroll", () => { if (pressed && touch) { pressed.classList.remove("is-pressed"); pressed = null; } }, { passive: true, capture: true });
  addEventListener("pageshow", () => document.querySelectorAll(".is-pressed").forEach((n) => n.classList.remove("is-pressed")));
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.(PRESSABLE) && !e.repeat) {
      const el = e.target; el.classList.add("is-pressed"); tick();
      setTimeout(() => el.classList.remove("is-pressed"), 120);
    }
  });

  /* ---- nav state, sound toggle, phone menu ---- */
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav [data-page]").forEach((a) => { if (a.dataset.page === page) a.setAttribute("aria-current", "page"); });

  document.querySelectorAll(".sound").forEach((b) => {
    b.setAttribute("aria-pressed", String(soundOn));
    b.addEventListener("click", () => {
      soundOn = !soundOn;
      document.querySelectorAll(".sound").forEach((x) => x.setAttribute("aria-pressed", String(soundOn)));
      try { localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0"); } catch {}
      if (soundOn) tick();
    });
  });

  const menuBtn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  if (menuBtn && menu) {
    const setMenu = (open) => {
      document.documentElement.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Menu");
      menu.inert = !open;
    };
    setMenu(false);
    menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    matchMedia("(min-width: 760px)").addEventListener("change", () => setMenu(false));
  }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  window.JW = { tick, buzz, esc, icon };
})();
