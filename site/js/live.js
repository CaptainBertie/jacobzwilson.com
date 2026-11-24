/* Live panel for the Acacia Financial project.
   Reads the public feed (SITE.acaciaFeed) every few seconds while the panel is on screen:
     - the current Kalshi BTC 15-minute market, its YES price path and a dot where the bot bought
     - the last few closed windows as small charts
     - the bot's bankroll now, its bankroll curve, and its all-time window win rate
   The feed never carries side, size, prices paid or the bot's model; nor does this page. */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const POLL_MS = 3000;
  const fmtUsd = (v) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtStrike = (v) => "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtTime = (ms) => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const fmtDate = (ms) => new Date(ms).toLocaleDateString([], { day: "numeric", month: "short" });
  const el = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

  function mount(root) {
    const url = (window.SITE || {}).acaciaFeed;
    if (!url) { root.remove(); return; }
    root.innerHTML = `
      <div class="live-head"><span class="live-dot" aria-hidden="true"></span><span class="live-state">Connecting</span></div>
      <div class="live-stats">
        <div class="stat"><div class="stat-k">Bankroll</div><div class="stat-v" data-v="bank">—</div></div>
        <div class="stat"><div class="stat-k">Windows won</div><div class="stat-v" data-v="win">—</div></div>
      </div>
      <figure class="live-card live-market">
        <figcaption class="live-cap"><span data-v="q">Bitcoin, next 15 minutes</span><span class="live-left" data-v="left"></span></figcaption>
        <div class="live-price"><span data-v="price">—</span><span class="live-unit">chance of yes</span></div>
        <div class="plot"><svg class="chart chart--market" viewBox="0 0 640 240" preserveAspectRatio="none" role="img" aria-label="Price of yes over the current 15-minute window"></svg></div>
        <div class="chart-x"><span data-v="t0"></span><span class="legend"><i class="buy-key"></i>Bot bought</span><span data-v="t1"></span></div>
      </figure>
      <figure class="live-card live-bank">
        <figcaption class="live-cap"><span>Bankroll</span><span class="live-left" data-v="since"></span></figcaption>
        <div class="plot"><svg class="chart chart--bank" viewBox="0 0 640 200" preserveAspectRatio="none" role="img" aria-label="Bankroll over time"></svg></div>
        <div class="chart-x"><span data-v="b0"></span><span data-v="b1"></span></div>
      </figure>
      <div class="live-recent" aria-label="Recent windows"></div>`;
    const $ = (k) => root.querySelector(`[data-v="${k}"]`);
    let data = null, timer = null, clock = null, inView = true, busy = false;

    async function pull() {
      if (busy || !root.isConnected) return;
      busy = true;
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) throw new Error(r.status);
        data = await r.json();
        render();
      } catch {
        state(false, "Live data offline");
      } finally { busy = false; }
    }
    function state(on, text) {
      root.classList.toggle("is-on", !!on);
      root.querySelector(".live-state").textContent = text;
    }

    function render() {
      const b = data.bot || {};
      state(b.online, b.online ? "Live · trading now" : "Live data · bot paused");
      if (b.bankroll != null) $("bank").textContent = fmtUsd(b.bankroll);
      if (b.win_rate != null) $("win").textContent = (b.win_rate * 100).toFixed(1) + "%";
      const ws = (data.windows || []).filter((w) => w.open_ms && w.close_ms);
      const now = data.now_ms || Date.now();
      const cur = ws.find((w) => w.open_ms <= now && now < w.close_ms) || ws[ws.length - 1];
      if (cur) market(cur);
      recent(ws.filter((w) => w !== cur && w.close_ms <= now).slice(-4).reverse());
      bank(b.curve || [], b.since_ms);
    }

    /* ---- the open window ---- */
    function market(w) {
      const svg = root.querySelector(".chart--market");
      $("q").textContent = w.strike != null ? `Bitcoin above ${fmtStrike(w.strike)} at ${fmtTime(w.close_ms)}?` : `Bitcoin at ${fmtTime(w.close_ms)}`;
      $("t0").textContent = fmtTime(w.open_ms); $("t1").textContent = fmtTime(w.close_ms);
      const last = w.path[w.path.length - 1];
      $("price").textContent = last ? Math.round(last[1]) + "%" : "—";
      root._close = w.close_ms;
      draw(svg, w, { W: 640, H: 240, pad: 8, grid: true });
      tickClock();
    }
    function tickClock() {
      const left = Math.max(0, (root._close || 0) - Date.now());
      const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
      $("left").textContent = left > 0 ? `${m}:${String(s).padStart(2, "0")} left` : "Settling";
    }

    /* one window's YES path, 0 to 100 on y, open to close on x */
    function draw(svg, w, { W, H, pad, grid }) {
      svg.replaceChildren();
      svg.parentElement.querySelectorAll(".buy-dot").forEach((d) => d.remove());
      const x = (t) => ((t - w.open_ms) / (w.close_ms - w.open_ms)) * W;
      const y = (c) => pad + (1 - c / 100) * (H - 2 * pad);
      if (grid) for (const c of [0, 50, 100]) svg.append(el("line", { x1: 0, x2: W, y1: y(c), y2: y(c), class: c === 50 ? "g g--mid" : "g" }));
      else svg.append(el("line", { x1: 0, x2: W, y1: y(50), y2: y(50), class: "g g--mid" }));
      const pts = w.path.filter((p) => p[0] >= w.open_ms && p[0] <= w.close_ms);
      if (pts.length > 1) {
        const d = pts.map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join("");
        svg.append(el("path", { d: `${d}L${x(pts[pts.length - 1][0]).toFixed(1)},${H}L${x(pts[0][0]).toFixed(1)},${H}Z`, class: "area" }));
        svg.append(el("path", { d, class: "line", "vector-effect": "non-scaling-stroke" }));
      }
      if (w.bought_ms && w.bought_ms >= w.open_ms && w.bought_ms <= w.close_ms) {
        const near = pts.reduce((a, p) => (Math.abs(p[0] - w.bought_ms) < Math.abs(a[0] - w.bought_ms) ? p : a), pts[0] || [w.bought_ms, 50]);
        const bx = x(w.bought_ms);
        svg.append(el("line", { x1: bx, x2: bx, y1: 0, y2: H, class: "buy-rule", "vector-effect": "non-scaling-stroke" }));
        // the dot is drawn in HTML so preserveAspectRatio="none" cannot squash it
        dot(svg, bx / W, y(near[1]) / H);
      }
    }
    function dot(svg, fx, fy) {
      const d = document.createElement("span");
      d.className = "buy-dot";
      d.style.left = `${(fx * 100).toFixed(2)}%`;
      d.style.top = `${(fy * 100).toFixed(2)}%`;
      svg.after(d);
    }

    /* ---- closed windows ---- */
    function recent(list) {
      const box = root.querySelector(".live-recent");
      if (!list.length) { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = list.map(() => `<figure class="wmini"><div class="wmini-plot"><svg class="chart" viewBox="0 0 160 64" preserveAspectRatio="none" aria-hidden="true"></svg></div><figcaption><span></span><span></span></figcaption></figure>`).join("");
      box.querySelectorAll(".wmini").forEach((f, i) => {
        const w = list[i];
        draw(f.querySelector("svg"), w, { W: 160, H: 64, pad: 4, grid: false });
        const [a, b] = f.querySelectorAll("figcaption span");
        a.textContent = fmtTime(w.close_ms);
        b.textContent = w.result ? (w.result === "yes" ? "Yes" : "No") : "…";
        f.classList.toggle("wmini--bought", !!w.bought_ms);
      });
    }

    /* ---- bankroll ---- */
    function bank(curve, since) {
      const card = root.querySelector(".live-bank"), svg = card.querySelector("svg");
      if (curve.length < 2) { card.hidden = true; return; }
      card.hidden = false;
      const W = 640, H = 200, pad = 10;
      const t0 = curve[0][0], t1 = curve[curve.length - 1][0];
      let lo = Infinity, hi = -Infinity; for (const [, v] of curve) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      const span = hi - lo || 1; lo -= span * 0.06; hi += span * 0.06;
      const x = (t) => ((t - t0) / (t1 - t0 || 1)) * W, y = (v) => pad + (1 - (v - lo) / (hi - lo)) * (H - 2 * pad);
      svg.replaceChildren();
      for (const f of [0, 0.5, 1]) svg.append(el("line", { x1: 0, x2: W, y1: pad + f * (H - 2 * pad), y2: pad + f * (H - 2 * pad), class: "g" }));
      const d = curve.map(([t, v], i) => `${i ? "L" : "M"}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join("");
      svg.append(el("path", { d: `${d}L${W},${H}L0,${H}Z`, class: "area area--bank" }));
      svg.append(el("path", { d, class: "line line--bank", "vector-effect": "non-scaling-stroke" }));
      $("since").textContent = since ? `Since ${fmtDate(since)}` : "";
      $("b0").textContent = fmtDate(t0); $("b1").textContent = "Now";
    }

    // poll only while the panel is on screen and the tab is visible
    function schedule() {
      clearInterval(timer); clearInterval(clock);
      if (!root.isConnected) return;
      if (inView && document.visibilityState === "visible") {
        pull();
        timer = setInterval(() => { if (!root.isConnected) return stop(); pull(); }, POLL_MS);
        clock = setInterval(() => { if (!root.isConnected) return stop(); tickClock(); }, 1000);
      }
    }
    function stop() { clearInterval(timer); clearInterval(clock); document.removeEventListener("visibilitychange", schedule); if (io) io.disconnect(); }
    const io = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => { inView = e.isIntersecting; schedule(); }) : null;
    if (io) io.observe(root);
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }

  window.JW_LIVE = { mount };
})();
