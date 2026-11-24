/* Shared: press feedback, click sound, haptics, nav state, helpers. */
(() => {
  // iOS only applies :active when a touch listener exists.
  document.addEventListener("touchstart", () => {}, { passive: true });

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
        const len = Math.floor(ctx.sampleRate * 0.02);
        buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 8);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = 0.95 + Math.random() * 0.1;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass"; bp.frequency.value = 3400; bp.Q.value = 1.1;
      const g = ctx.createGain();
      g.gain.value = 0.4 * strength;
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start();
    } catch {}
  }
  function buzz() { try { navigator.vibrate && navigator.vibrate(6); } catch {} }

  /* ---- press feedback on anything tappable ---- */
  const PRESSABLE = ".key, .nav-link, .nav-icon, .drawer-item, .shot, .seg button, .row-link, [data-press]";
  let pressed = null, pressedAt = 0;
  function release() {
    if (!pressed) return;
    const el = pressed; pressed = null;
    const wait = Math.max(0, 80 - (performance.now() - pressedAt)); // keep the press visible on fast taps
    setTimeout(() => el.classList.remove("is-pressed"), wait);
  }
  document.addEventListener("pointerdown", (e) => {
    if (e.button && e.button !== 0) return;
    const el = e.target.closest(PRESSABLE);
    if (!el || el.disabled) return;
    pressed = el; pressedAt = performance.now();
    el.classList.add("is-pressed");
    tick(); buzz();
  });
  ["pointerup", "pointercancel", "dragstart"].forEach((t) => document.addEventListener(t, release));
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.(PRESSABLE) && !e.repeat) {
      e.target.classList.add("is-pressed"); tick();
      setTimeout(() => e.target.classList.remove("is-pressed"), 110);
    }
  });

  /* ---- nav ---- */
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-page]").forEach((a) => {
    if (a !== document.body && a.dataset.page === page) a.setAttribute("aria-current", "page");
  });
  const sbtn = document.querySelector(".sound");
  if (sbtn) {
    sbtn.setAttribute("aria-pressed", String(soundOn));
    sbtn.addEventListener("click", () => {
      soundOn = !soundOn;
      sbtn.setAttribute("aria-pressed", String(soundOn));
      try { localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0"); } catch {}
      if (soundOn) tick();
    });
  }

  /* ---- placeholder image: a soft gradient with a photo glyph, no words ---- */
  const HUES = [[214, 236], [250, 276], [196, 222], [286, 320], [168, 200]];
  function placeholder(n = 0, w = 800, h = 600) {
    const [a, b] = HUES[n % HUES.length];
    const cx = w / 2, cy = h / 2;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${a} 70% 94%)'/><stop offset='1' stop-color='hsl(${b} 60% 88%)'/></linearGradient></defs>
<rect width='${w}' height='${h}' fill='url(#g)'/>
<g fill='none' stroke='hsl(${a} 25% 62%)' stroke-width='5' stroke-linejoin='round' opacity='.75'>
<rect x='${cx - 46}' y='${cy - 36}' width='92' height='72' rx='14'/><circle cx='${cx - 16}' cy='${cy - 10}' r='9'/><path d='M${cx - 46} ${cy + 24} l28 -26 22 20 14 -12 28 24'/></g></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pad = (n) => String(n).padStart(2, "0");

  window.JW = { tick, buzz, placeholder, esc, pad };
})();
