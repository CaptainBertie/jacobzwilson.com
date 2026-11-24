/* Contact: fill links from data.js, headshot fallback, copy-email button. */
(() => {
  const S = window.SITE, { icon } = window.JW;
  document.getElementById("gh").href = S.github;
  document.getElementById("li").href = S.linkedin;
  document.getElementById("em").href = "mailto:" + S.email;
  document.getElementById("em-t").textContent = S.email;
  document.querySelectorAll(".go--out").forEach((n) => (n.innerHTML = icon.out));

  const img = document.getElementById("headshot");
  img.onerror = () => { img.onerror = null; img.closest(".headshot").classList.add("is-empty"); img.remove(); };
  img.src = S.headshot;

  const btn = document.getElementById("copy");
  btn.innerHTML = icon.copy;
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(S.email); }
    catch { const t = Object.assign(document.createElement("textarea"), { value: S.email }); document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
    btn.innerHTML = icon.check; btn.classList.add("done"); btn.setAttribute("aria-label", "Copied");
    setTimeout(() => { btn.innerHTML = icon.copy; btn.classList.remove("done"); btn.setAttribute("aria-label", "Copy email"); }, 1600);
  });
})();
