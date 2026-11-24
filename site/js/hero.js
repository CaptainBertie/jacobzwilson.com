/* Home: one colour cloud drifts toward the pointer (or a tap); optional background video. */
(() => {
  const hero = document.querySelector(".hero");
  const cloud = document.querySelector(".clouds .c5");
  if (!hero || !cloud) return;

  const v = window.SITE.heroVideo;
  if (v && v.src) {
    const vid = Object.assign(document.createElement("video"), { src: v.src, muted: true, loop: true, autoplay: true, playsInline: true, className: "hero-video" });
    if (v.poster) vid.poster = v.poster;
    vid.setAttribute("aria-hidden", "true");
    hero.prepend(vid);
  }

  const set = (x, y) => { cloud.style.setProperty("--mx", x + "px"); cloud.style.setProperty("--my", y + "px"); };
  set(innerWidth * 0.62, innerHeight * 0.42);
  let raf = 0;
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => set(e.clientX, e.clientY));
  }, { passive: true });
  addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") set(e.clientX, e.clientY); }, { passive: true });
})();
