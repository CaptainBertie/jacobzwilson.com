/* Live panel for the Acacia Financial project.
   Reads the public feed (SITE.acaciaFeed) once a second, only while the panel is on screen
   and the tab is visible; the feed itself goes idle when nobody is watching.
     - the open Kalshi BTC 15-minute window: Bitcoin's price against the strike, or the chance
       of yes, drawn as a smooth line that moves continuously, with a dot where the bot bought
     - the last four windows; tap one to look at it, "Live" to come back
     - bankroll and window win rate, and the bankroll over time with ranges and a readout
   The feed never carries side, size, prices paid or the bot's model; nor does this page. */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const POLL_MS = 1000, CURVE_MS = 60000;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const usd = (v, dp = 2) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const usdShort = (v) => "$" + Math.round(v).toLocaleString("en-US");
  const tm = (ms, sec) => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", ...(sec ? { second: "2-digit" } : {}) });
  const dt = (ms) => new Date(ms).toLocaleDateString([], { day: "numeric", month: "short" });
  const dtt = (ms) => `${dt(ms)}, ${tm(ms)}`;
  const mk = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (p) => 1 - Math.pow(1 - p, 3);
  const tick = (s) => window.JW && window.JW.tick && window.JW.tick(s);

  /* a smooth line through points that never overshoots (monotone cubic, Fritsch-Carlson) */
  function smooth(p) {
    const n = p.length;
    if (n < 2) return n ? `M${p[0][0]},${p[0][1]}` : "";
    if (n === 2) return `M${p[0][0]},${p[0][1]}L${p[1][0]},${p[1][1]}`;
    const dx = [], m = [], t = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0] || 1e-6; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += `C${(p[i][0] + h).toFixed(1)},${(p[i][1] + t[i] * h).toFixed(1)},${(p[i + 1][0] - h).toFixed(1)},${(p[i + 1][1] - t[i + 1] * h).toFixed(1)},${p[i + 1][0].toFixed(1)},${p[i + 1][1].toFixed(1)}`;
    }
    return d;
  }
  /* keep at most one point per `px` pixels of x, always keeping the last */
  function thin(pts, x, px) {
    const out = []; let lastX = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      const X = x(pts[i][0]);
      if (X - lastX >= px || i === pts.length - 1) { out.push(pts[i]); lastX = X; }
    }
    return out;
  }
  /* value of a sorted [[t, v]] path at time t (linear between points) */
  function at(path, t) {
    if (!path.length) return null;
    if (t <= path[0][0]) return path[0][1];
    if (t >= path[path.length - 1][0]) return path[path.length - 1][1];
    let lo = 0, hi = path.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (path[mid][0] <= t) lo = mid; else hi = mid; }
    const [t0, v0] = path[lo], [t1, v1] = path[hi];
    return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0 || 1);
  }
  function merge(into, pts) {
    if (!pts || !pts.length) return;
    if (!into.length || pts[0][0] > into[into.length - 1][0]) { into.push(...pts); return; }
    const m = new Map(into.map((p) => [p[0], p[1]])); for (const p of pts) m.set(p[0], p[1]);
    into.length = 0; into.push(...[...m].sort((a, b) => a[0] - b[0]));
  }
  function niceTicks(lo, hi, n) {
    const raw = (hi - lo) / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw) || raw;
    const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(Math.round(v * 100) / 100);
    return out;
  }
  function hover(plot, onMove, onLeave) {
    const move = (e) => { const r = plot.getBoundingClientRect(); onMove(e.clientX - r.left); };
    plot.addEventListener("pointermove", move);
    plot.addEventListener("pointerdown", move);
    plot.addEventListener("pointerleave", onLeave);
    plot.addEventListener("pointercancel", onLeave);
  }

  function mount(root) {
    const base = (window.SITE || {}).acaciaFeed;
    if (!base) { root.remove(); return; }
    root.innerHTML = `
      <div class="live-head"><span class="live-dot" aria-hidden="true"></span><span class="live-state">Connecting</span></div>
      <div class="live-stats">
        <div class="stat"><div class="stat-k">Bankroll</div><div class="stat-v" data-v="bank">—</div></div>
        <div class="stat"><div class="stat-k">Windows won</div><div class="stat-v" data-v="win">—</div></div>
      </div>
      <figure class="live-card live-market">
        <div class="card-top">
          <figcaption class="live-q" data-v="q">Bitcoin, next 15 minutes</figcaption>
          <div class="card-tools">
            <button class="chip-btn" data-live hidden data-press>Back to live</button>
            <div class="seg" role="group" aria-label="Chart shows"><button data-mode="price" aria-pressed="true" data-press>Price</button><button data-mode="chance" aria-pressed="false" data-press>Chance</button></div>
          </div>
        </div>
        <div class="readouts">
          <div class="ro"><div class="ro-k">Bitcoin</div><div class="ro-v" data-v="btc">—</div><div class="ro-d" data-v="gap"></div></div>
          <div class="ro"><div class="ro-k">Strike</div><div class="ro-v" data-v="strike">—</div><div class="ro-d" data-v="left"></div></div>
          <div class="ro"><div class="ro-k">Chance of yes</div><div class="ro-v" data-v="chance">—</div><div class="ro-d" data-v="when"></div></div>
        </div>
        <div class="plot plot--market"><svg class="chart" aria-hidden="true"></svg><div class="tip" hidden></div></div>
        <div class="chart-x"><span data-v="t0"></span><span class="legend"><i class="buy-key"></i>Bot bought</span><span data-v="t1"></span></div>
      </figure>
      <div class="live-recent" aria-label="Recent windows"></div>
      <figure class="live-card live-bank" hidden>
        <div class="card-top">
          <figcaption class="live-q">Bankroll over time</figcaption>
          <div class="seg" role="group" aria-label="Range"><button data-range="7" aria-pressed="false" data-press>1W</button><button data-range="30" aria-pressed="false" data-press>1M</button><button data-range="0" aria-pressed="true" data-press>All</button></div>
        </div>
        <div class="readouts readouts--bank">
          <div class="ro"><div class="ro-k" data-v="bk">Now</div><div class="ro-v" data-v="bv">—</div></div>
          <div class="ro"><div class="ro-k" data-v="ck">Change</div><div class="ro-v" data-v="cv">—</div></div>
        </div>
        <div class="plot plot--bank"><svg class="chart" aria-hidden="true"></svg><div class="tip" hidden></div></div>
        <div class="chart-x chart-x--ticks" data-v="bx"></div>
      </figure>`;
    const $ = (k) => root.querySelector(`[data-v="${k}"]`);
    const S = { windows: new Map(), bot: {}, since: 0, rev: null, curve: [], mode: "price", pinned: null, range: 0, skew: 0 };
    let busy = false, timer = null, ctimer = null, raf = 0, inView = true;
    const kick = () => { if (!raf && running()) raf = requestAnimationFrame(frame); };

    /* ---------------- data ---------------- */
    async function pull() {
      if (busy || !root.isConnected) return;
      busy = true;
      try {
        const r = await fetch(`${base}?since=${S.since}`, { cache: "no-store" });
        if (!r.ok) throw new Error(r.status);
        const d = await r.json();
        // the feed filled in older history since the last poll: start again from nothing
        if (S.rev !== null && d.rev !== S.rev && S.since) { S.rev = d.rev; S.since = 0; S.windows.clear(); return; }
        S.rev = d.rev;
        S.skew = d.now_ms - Date.now();
        const nowP = performance.now();
        for (const w of d.windows || []) {
          const cur = S.windows.get(w.ticker) || { yes: [], btc: [] };
          Object.assign(cur, { ticker: w.ticker, strike: w.strike, open_ms: w.open_ms, close_ms: w.close_ms, result: w.result, bought_ms: w.bought_ms });
          const yLast = cur.yes.length ? cur.yes[cur.yes.length - 1][1] : null, bLast = cur.shownBtc;
          merge(cur.yes, w.yes); merge(cur.btc, w.btc);
          if (yLast != null && w.yes && w.yes.length) cur.yesFrom = { v: cur.shownYes ?? yLast, at: nowP };
          if (bLast != null && w.btc && w.btc.length) cur.btcFrom = { v: bLast, at: nowP };
          S.windows.set(w.ticker, cur);
        }
        const keep = new Set((d.windows || []).map((w) => w.ticker));
        for (const t of [...S.windows.keys()]) if (!keep.has(t)) S.windows.delete(t);
        if (S.pinned && !S.windows.has(S.pinned)) pin(null);
        S.since = d.now_ms - 1;
        S.bot = d.bot || {};
        stats();
        recent();
        state(S.bot.online, S.bot.online ? "Live · trading now" : "Live data · bot paused");
        kick();
      } catch {
        state(false, "Live data offline");
      } finally { busy = false; }
    }
    async function pullCurve() {
      try {
        const r = await fetch(`${base}/bankroll`);
        if (!r.ok) return;
        const d = await r.json();
        S.curve = d.curve || [];
        bank.set();
      } catch { /* the number above still shows the bankroll */ }
    }
    function state(on, text) { root.classList.toggle("is-on", !!on); root.querySelector(".live-state").textContent = text; }

    /* ---------------- stats (numbers count to their new value) ---------------- */
    const shown = {};
    function count(key, to, fmt) {
      const el = $(key), from = shown[key];
      shown[key] = to;
      if (from == null || reduce || Math.abs(to - from) < 1e-9) { el.textContent = fmt(to); return; }
      const t0 = performance.now();
      const step = (n) => { const p = clamp((n - t0) / 700, 0, 1); el.textContent = fmt(from + (to - from) * ease(p)); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
    function stats() {
      if (S.bot.bankroll != null) count("bank", S.bot.bankroll, (v) => usd(v));
      if (S.bot.win_rate != null) count("win", S.bot.win_rate * 100, (v) => v.toFixed(1) + "%");
    }

    /* ---------------- which window ---------------- */
    const now = () => Date.now() + S.skew;
    const sorted = () => [...S.windows.values()].sort((a, b) => a.close_ms - b.close_ms);
    function current() {
      const t = now(), ws = sorted();
      if (S.pinned && S.windows.has(S.pinned)) return S.windows.get(S.pinned);
      return ws.find((w) => w.open_ms <= t && t < w.close_ms) || ws[ws.length - 1] || null;
    }

    /* ---------------- market chart ---------------- */
    const mPlot = root.querySelector(".plot--market"), mSvg = mPlot.querySelector("svg"), mTip = mPlot.querySelector(".tip");
    const dom = { lo: null, hi: null }; // the y-range eases toward its target so a rescale never jumps
    let hoverX = null, lastTick = -1;

    function frame() {
      raf = 0;
      if (!root.isConnected) return;
      const w = current();
      if (w) drawMarket(w);
      if (running()) raf = requestAnimationFrame(frame);
    }
    function head(path, from, live) {
      if (!path.length) return null;
      const last = path[path.length - 1][1];
      if (!live || !from || reduce) return last;
      const p = clamp((performance.now() - from.at) / 900, 0, 1);
      return from.v + (last - from.v) * ease(p);
    }

    function drawMarket(w) {
      const W = mPlot.clientWidth, H = mPlot.clientHeight;
      if (!W || !H) return;
      mSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const padR = 70, padT = 16, padB = 10, cw = W - padR;
      const t = now(), live = !S.pinned && t < w.close_ms;
      const tHead = live ? clamp(t - 1200, w.open_ms, w.close_ms) : w.close_ms; // a beat behind, so each new point eases in
      const price = S.mode === "price";
      const inWin = (p) => p[0] >= w.open_ms - 2000 && p[0] <= tHead;
      const bRaw = w.btc.filter(inWin), yRaw = w.yes.filter(inWin);
      const bHead = head(bRaw, w.btcFrom, live), yHead = head(yRaw, w.yesFrom, live);
      w.shownBtc = bHead; w.shownYes = yHead;
      const raw = price ? bRaw : yRaw, hv = price ? bHead : yHead;
      const path = raw.slice(); if (live && path.length) path.push([tHead, hv]);

      // y domain
      let lo, hi;
      if (price) {
        const vals = path.map((p) => p[1]); if (w.strike != null) vals.push(w.strike);
        lo = Math.min(...vals); hi = Math.max(...vals);
        const span = Math.max(hi - lo, 40), mid = (hi + lo) / 2;
        lo = mid - span * 0.62; hi = mid + span * 0.62;
      } else { lo = 0; hi = 100; }
      if (!isFinite(lo) || !isFinite(hi)) { mSvg.replaceChildren(); return; }
      if (dom.mode !== S.mode || dom.ticker !== w.ticker || dom.lo == null || reduce) Object.assign(dom, { lo, hi, mode: S.mode, ticker: w.ticker });
      else { dom.lo += (lo - dom.lo) * 0.1; dom.hi += (hi - dom.hi) * 0.1; }
      const x = (tt) => ((tt - w.open_ms) / (w.close_ms - w.open_ms)) * cw;
      const y = (v) => padT + (1 - (v - dom.lo) / (dom.hi - dom.lo)) * (H - padT - padB);
      const ref = price ? w.strike : 50;

      mSvg.replaceChildren();
      for (const v of price ? niceTicks(dom.lo, dom.hi, 4) : [0, 25, 50, 75, 100]) {
        const Y = y(v); if (Y < padT - 2 || Y > H - padB + 2) continue;
        mSvg.append(mk("line", { x1: 0, x2: cw, y1: Y, y2: Y, class: "g" }));
        const tx = mk("text", { x: cw + 10, y: Y + 4, class: "axis" }); tx.textContent = price ? usdShort(v) : v + "%"; mSvg.append(tx);
      }
      const pts = thin(path, x, 2).map((p) => [x(p[0]), y(p[1])]);
      const line = pts.length > 1 ? smooth(pts) : "";
      if (ref != null) {
        const R = y(ref);
        if (line) {
          const last = pts[pts.length - 1], first = pts[0];
          const defs = mk("defs");
          const up = mk("clipPath", { id: "acu" }); up.append(mk("rect", { x: 0, y: 0, width: cw, height: clamp(R, 0, H) }));
          const dn = mk("clipPath", { id: "acd" }); dn.append(mk("rect", { x: 0, y: clamp(R, 0, H), width: cw, height: H }));
          defs.append(up, dn); mSvg.append(defs);
          const area = `${line}L${last[0].toFixed(1)},${R.toFixed(1)}L${first[0].toFixed(1)},${R.toFixed(1)}Z`;
          mSvg.append(mk("path", { d: area, class: "fill-up", "clip-path": "url(#acu)" }));
          mSvg.append(mk("path", { d: area, class: "fill-dn", "clip-path": "url(#acd)" }));
        }
        mSvg.append(mk("line", { x1: 0, x2: cw, y1: R, y2: R, class: "strike" }));
        const lab = mk("text", { x: 4, y: R - 7, class: "strike-label" });
        lab.textContent = price ? "Strike" : "50%"; mSvg.append(lab);
      }
      if (line) mSvg.append(mk("path", { d: line, class: "line line--market" }));
      if (w.bought_ms && w.bought_ms >= w.open_ms && w.bought_ms <= tHead && path.length) {
        const bx = x(w.bought_ms), by = y(at(path, w.bought_ms)), left = bx > cw - 90;
        mSvg.append(mk("line", { x1: bx, x2: bx, y1: padT, y2: H - padB, class: "buy-rule" }));
        mSvg.append(mk("circle", { cx: bx, cy: by, r: 6, class: "buy-dot" }));
        const bt = mk("text", { x: bx + (left ? -9 : 9), y: padT + 10, class: "buy-label", "text-anchor": left ? "end" : "start" }); bt.textContent = "Bot bought"; mSvg.append(bt);
      }
      if (pts.length) {
        const [hx, hy] = pts[pts.length - 1];
        if (live) mSvg.append(mk("circle", { cx: hx, cy: hy, r: 9, class: "head-halo" }));
        mSvg.append(mk("circle", { cx: hx, cy: hy, r: 4, class: "head" }));
      }

      // readouts: the moment under the pointer, or the newest
      const hovering = hoverX != null;
      const tr = hovering ? Math.min(w.open_ms + (clamp(hoverX, 0, cw) / cw) * (w.close_ms - w.open_ms), tHead) : tHead;
      const b = hovering ? at(bRaw, tr) : bHead, c = hovering ? at(yRaw, tr) : yHead;
      $("btc").textContent = b != null ? usd(b) : "—";
      $("strike").textContent = w.strike != null ? usd(w.strike) : "—";
      $("chance").textContent = c == null ? "—" : c >= 99.5 ? ">99%" : c < 0.5 ? "<1%" : Math.round(c) + "%";
      const gap = b != null && w.strike != null ? b - w.strike : null, g = $("gap");
      g.textContent = gap != null ? `${gap >= 0 ? "▲" : "▼"} ${usd(Math.abs(gap))} ${gap >= 0 ? "above" : "below"}` : "";
      g.className = "ro-d " + (gap == null ? "" : gap >= 0 ? "is-up" : "is-dn");
      $("when").textContent = hovering ? tm(tr, true) : live ? "Now" : w.result ? `Settled ${w.result}` : "Settling";
      const sec = Math.floor(t / 1000);
      if (sec !== lastTick || hovering) {
        lastTick = sec;
        const left = w.close_ms - t;
        $("left").textContent = S.pinned ? `Closed ${tm(w.close_ms)}` : left > 0 ? `${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")} left` : "Settling";
        $("q").textContent = w.strike != null ? `Bitcoin above ${usd(w.strike)} at ${tm(w.close_ms)}?` : `Bitcoin at ${tm(w.close_ms)}`;
        $("t0").textContent = tm(w.open_ms); $("t1").textContent = tm(w.close_ms);
      }
      if (hovering && tr >= w.open_ms) {
        const cx = x(tr), v = at(path, tr);
        mSvg.append(mk("line", { x1: cx, x2: cx, y1: padT, y2: H - padB, class: "cross" }));
        if (v != null) mSvg.append(mk("circle", { cx, cy: y(v), r: 4.5, class: "cross-dot" }));
        mTip.hidden = false; mTip.textContent = tm(tr, true); mTip.style.left = `${clamp(cx, 34, cw - 34)}px`;
      } else mTip.hidden = true;
    }
    hover(mPlot, (X) => { hoverX = X; if (!raf) raf = requestAnimationFrame(frame); }, () => { hoverX = null; if (!raf) raf = requestAnimationFrame(frame); });

    root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
      S.mode = b.dataset.mode; tick(0.6);
      root.querySelectorAll("[data-mode]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      kick();
    }));
    root.querySelector("[data-live]").addEventListener("click", () => { tick(0.6); pin(null); });
    function pin(t) {
      S.pinned = t;
      root.querySelector("[data-live]").hidden = !t;
      root.querySelectorAll(".wmini").forEach((f) => f.setAttribute("aria-pressed", String(f.dataset.t === t)));
      if (!raf) raf = requestAnimationFrame(frame);
    }

    /* ---------------- recent windows ---------------- */
    function recent() {
      const box = root.querySelector(".live-recent"), t = now();
      const list = sorted().filter((w) => w.close_ms <= t).slice(-4).reverse();
      if (!list.length) { box.hidden = true; return; }
      box.hidden = false;
      const sig = list.map((w) => `${w.ticker}${w.result}${w.bought_ms}${w.btc.length}`).join("|");
      if (box.dataset.sig === sig) return;
      box.dataset.sig = sig;
      box.innerHTML = list.map((w) => `<button class="wmini" data-t="${w.ticker}" aria-pressed="${S.pinned === w.ticker}" data-press aria-label="Show the window that closed at ${tm(w.close_ms)}"><span class="wmini-plot"><svg class="chart" viewBox="0 0 160 56" preserveAspectRatio="none" aria-hidden="true"></svg></span><span class="wmini-cap"><span>${tm(w.close_ms)}</span><span class="${w.result === "yes" ? "is-up" : w.result === "no" ? "is-dn" : ""}">${w.result ? (w.result === "yes" ? "Yes" : "No") : "…"}</span></span></button>`).join("");
      box.querySelectorAll(".wmini").forEach((f, i) => mini(f.querySelector("svg"), list[i]));
    }
    root.querySelector(".live-recent").addEventListener("click", (e) => {
      const b = e.target.closest(".wmini"); if (!b) return;
      tick(0.6); pin(S.pinned === b.dataset.t ? null : b.dataset.t);
    });
    function mini(svg, w) {
      const W = 160, H = 56, pad = 5, path = w.btc.filter((p) => p[0] >= w.open_ms - 2000 && p[0] <= w.close_ms);
      if (path.length < 2) return;
      const vals = path.map((p) => p[1]).concat(w.strike != null ? [w.strike] : []);
      let lo = Math.min(...vals), hi = Math.max(...vals); const span = Math.max(hi - lo, 20), mid = (lo + hi) / 2; lo = mid - span * 0.6; hi = mid + span * 0.6;
      const x = (t) => ((t - w.open_ms) / (w.close_ms - w.open_ms)) * W, y = (v) => pad + (1 - (v - lo) / (hi - lo)) * (H - 2 * pad);
      if (w.strike != null) svg.append(mk("line", { x1: 0, x2: W, y1: y(w.strike), y2: y(w.strike), class: "strike" }));
      svg.append(mk("path", { d: smooth(thin(path, x, 2).map((p) => [x(p[0]), y(p[1])])), class: "line line--mini" }));
      if (w.bought_ms && w.bought_ms >= w.open_ms && w.bought_ms <= w.close_ms) {
        const d = document.createElement("i"); d.className = "mini-buy";
        d.style.left = `${(x(w.bought_ms) / W) * 100}%`; d.style.top = `${(y(at(path, w.bought_ms)) / H) * 100}%`;
        svg.after(d);
      }
    }

    /* ---------------- bankroll over time ---------------- */
    const bank = (() => {
      const card = root.querySelector(".live-bank"), plot = card.querySelector(".plot--bank"), svg = plot.querySelector("svg"), tip = plot.querySelector(".tip");
      let hx = null, anim = 0;
      const view = { lo: null, hi: null, t0: null, t1: null };
      function target() {
        const c = S.curve; if (c.length < 2) return null;
        const t1 = c[c.length - 1][0], t0 = S.range ? Math.max(c[0][0], t1 - S.range * 86400000) : c[0][0];
        let lo = at(c, t0), hi = lo;
        for (const [t, v] of c) if (t >= t0) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        const span = hi - lo || 1;
        return { lo: lo - span * 0.08, hi: hi + span * 0.08, t0, t1 };
      }
      function set() {
        const to = target(); card.hidden = !to; if (!to) return;
        if (view.lo == null || reduce) { Object.assign(view, to); draw(); return; }
        const from = { ...view }, s = performance.now();
        cancelAnimationFrame(anim);
        const step = (n) => { const p = ease(clamp((n - s) / 450, 0, 1)); for (const k in to) view[k] = from[k] + (to[k] - from[k]) * p; draw(); if (p < 1) anim = requestAnimationFrame(step); };
        anim = requestAnimationFrame(step);
      }
      function draw() {
        const W = plot.clientWidth, H = plot.clientHeight, c = S.curve;
        if (!W || !H || c.length < 2 || view.lo == null) return;
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        const padR = 70, padT = 12, padB = 8, cw = W - padR;
        const x = (t) => ((t - view.t0) / (view.t1 - view.t0 || 1)) * cw, y = (v) => padT + (1 - (v - view.lo) / (view.hi - view.lo)) * (H - padT - padB);
        svg.replaceChildren();
        const defs = mk("defs"), gr = mk("linearGradient", { id: "abk", x1: 0, x2: 0, y1: 0, y2: 1 });
        gr.append(mk("stop", { offset: "0", class: "bk-top" }), mk("stop", { offset: "1", class: "bk-bot" })); defs.append(gr); svg.append(defs);
        for (const v of niceTicks(view.lo, view.hi, 4)) {
          const Y = y(v); if (Y < padT - 2 || Y > H - padB + 2) continue;
          svg.append(mk("line", { x1: 0, x2: cw, y1: Y, y2: Y, class: "g" }));
          const tx = mk("text", { x: cw + 10, y: Y + 4, class: "axis" }); tx.textContent = usdShort(v); svg.append(tx);
        }
        const start = at(c, view.t0);
        const pts = thin([[view.t0, start], ...c.filter((p) => p[0] > view.t0)], x, 2).map((p) => [x(p[0]), y(p[1])]);
        const line = smooth(pts), last = pts[pts.length - 1];
        svg.append(mk("path", { d: `${line}L${last[0].toFixed(1)},${H}L${pts[0][0].toFixed(1)},${H}Z`, fill: "url(#abk)" }));
        svg.append(mk("path", { d: line, class: "line line--bank" }));
        svg.append(mk("circle", { cx: last[0], cy: last[1], r: 4, class: "head head--bank" }));
        const n = W < 480 ? 3 : 5;
        $("bx").innerHTML = Array.from({ length: n }, (_, i) => `<span>${dt(view.t0 + ((view.t1 - view.t0) * i) / (n - 1))}</span>`).join("");
        const end = c[c.length - 1];
        let tRead = end[0], vRead = end[1];
        if (hx != null) {
          tRead = view.t0 + (clamp(hx, 0, cw) / cw) * (view.t1 - view.t0); vRead = at(c, tRead);
          const X = x(tRead);
          svg.append(mk("line", { x1: X, x2: X, y1: padT, y2: H - padB, class: "cross" }));
          svg.append(mk("circle", { cx: X, cy: y(vRead), r: 4.5, class: "cross-dot" }));
          tip.hidden = false; tip.textContent = dtt(tRead); tip.style.left = `${clamp(X, 50, cw - 50)}px`;
        } else tip.hidden = true;
        const chg = vRead - start, pct = start ? (chg / start) * 100 : 0, sign = chg >= 0 ? "+" : "−";
        $("bk").textContent = hx != null ? dtt(tRead) : "Now";
        $("bv").textContent = usd(vRead);
        $("ck").textContent = `Change since ${dt(view.t0)}`;
        const cv = $("cv");
        cv.textContent = `${sign}${usd(Math.abs(chg))} (${sign}${Math.abs(pct).toFixed(1)}%)`;
        cv.className = "ro-v " + (chg >= 0 ? "is-up" : "is-dn");
      }
      hover(plot, (X) => { hx = X; draw(); }, () => { hx = null; draw(); });
      card.querySelectorAll("[data-range]").forEach((b) => b.addEventListener("click", () => {
        S.range = +b.dataset.range; tick(0.6);
        card.querySelectorAll("[data-range]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        set();
      }));
      new ResizeObserver(() => draw()).observe(plot);
      return { set };
    })();

    /* ---------------- lifecycle: work only while seen ---------------- */
    function running() { return root.isConnected && inView && document.visibilityState === "visible"; }
    function schedule() {
      clearInterval(timer); clearInterval(ctimer);
      if (!root.isConnected) return stop();
      if (!running()) return;
      pull(); timer = setInterval(pull, POLL_MS);
      if (!S.curve.length) pullCurve();
      ctimer = setInterval(pullCurve, CURVE_MS);
      kick();
    }
    function stop() { clearInterval(timer); clearInterval(ctimer); cancelAnimationFrame(raf); raf = 0; document.removeEventListener("visibilitychange", schedule); if (io) io.disconnect(); }
    const io = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => { inView = e.isIntersecting; schedule(); }) : null;
    if (io) io.observe(root);
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }

  window.JW_LIVE = { mount };
})();
