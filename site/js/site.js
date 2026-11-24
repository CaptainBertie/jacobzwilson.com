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
        const len = Math.floor(ctx.sampleRate * 0.03);
        buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = 0.9 + Math.random() * 0.2;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass"; bp.frequency.value = 2600; bp.Q.value = 0.9;
      const g = ctx.createGain();
      g.gain.value = 0.55 * strength;
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start();
    } catch {}
  }
  function buzz() { try { navigator.vibrate && navigator.vibrate(8); } catch {} }

  /* ---- press feedback on anything clicky ---- */
  const PRESSABLE = ".key, .logo, .nav-link, .drawer-item, .shot, [data-press]";
  let pressed = null, pressedAt = 0;
  function release() {
    if (!pressed) return;
    const el = pressed; pressed = null;
    const wait = Math.max(0, 90 - (performance.now() - pressedAt)); // keep the press visible on fast taps
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
  document.addEventListener("pointerleave", release);
  // keyboard activation gets the same feel
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.(PRESSABLE) && !e.repeat) {
      e.target.classList.add("is-pressed"); tick();
      setTimeout(() => e.target.classList.remove("is-pressed"), 110);
    }
  });

  /* ---- nav ---- */
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-link").forEach((a) => {
    if (a.dataset.page === page) a.setAttribute("aria-current", "page");
  });
  const sbtn = document.querySelector(".sound");
  if (sbtn) {
    sbtn.setAttribute("aria-pressed", String(soundOn));
    sbtn.addEventListener("click", () => {
      soundOn = !soundOn;
      sbtn.setAttribute("aria-pressed", String(soundOn));
      try { localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0"); } catch {}
      if (soundOn) tick();
      toast(soundOn ? "Sound on" : "Sound off");
    });
  }

  /* ---- toast ---- */
  let toastEl, toastT;
  function toast(msg) {
    toastEl ||= Object.assign(document.body.appendChild(document.createElement("div")), { className: "toast", role: "status" });
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 1400);
  }

  /* ---- placeholder figure (drawing-style SVG) ---- */
  function placeholder(label, sub = "PHOTO PENDING", w = 800, h = 600) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
<defs><pattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'><path d='M40 0H0V40' fill='none' stroke='#e4e4de' stroke-width='1'/></pattern></defs>
<rect width='${w}' height='${h}' fill='#fff'/><rect width='${w}' height='${h}' fill='url(#g)'/>
<circle cx='${w / 2}' cy='${h / 2 - 20}' r='70' fill='none' stroke='#1d4cff' stroke-width='3'/>
<path d='M${w / 2 - 110} ${h / 2 - 20}H${w / 2 + 110}M${w / 2} ${h / 2 - 130}V${h / 2 + 90}' stroke='#1d4cff' stroke-width='2' stroke-dasharray='10 8'/>
<text x='${w / 2}' y='${h - 92}' text-anchor='middle' font-family='monospace' font-size='30' font-weight='bold' fill='#0b0b0c'>${label}</text>
<text x='${w / 2}' y='${h - 54}' text-anchor='middle' font-family='monospace' font-size='20' letter-spacing='4' fill='#5d5d63'>${sub}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pad = (n) => String(n).padStart(2, "0");

  window.JW = { tick, buzz, toast, placeholder, esc, pad };
})();
