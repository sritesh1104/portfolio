/* Content creation page: same paper explainer style as Classic. All text comes from SITE.creator in content.js. */
(function () {
  const S = window.SITE;
  const X = window.Sections;
  const C = S.creator;
  const esc = X.esc;
  const root = document.getElementById("creator-root");
  const pad = (n) => String(n).padStart(2, "0");
  const tilt = (i) => [-2.2, 1.6, -1, 2.4, -1.8, 1.1, -2.6, 1.9, -0.8][i % 9] + "deg";
  const isSoon = (v) => v == null || v === "";
  const soon = '<span class="soon-v">Soon</span>';
  const ext = (href) => (/^http/.test(href) ? 'target="_blank" rel="noopener"' : "");

  // Jagged paper edge (same as Classic)
  function tear(seed) {
    let r = seed * 9301 + 49297;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    const edge = (lift) => {
      let d = "M0 44";
      for (let x = 0; x <= 1000; x += 12 + rnd() * 22) d += `L${x.toFixed(0)} ${(8 + lift + rnd() * 20).toFixed(1)}`;
      return d + "L1000 20L1000 44Z";
    };
    return `<svg class="tear" viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true"><path class="fibre" d="${edge(-5)}"/><path class="sheet" d="${edge(0)}"/></svg>`;
  }
  const chapter = (cls, id, title, sub, n, body) => `
    <section class="chap ${cls} sec" id="${id}">
      <div class="chap-card">
        <span class="eyebrow chap-num">Chapter ${pad(n)}</span>
        <h2 class="chap-title wobble">${esc(title)}</h2>
        <span class="eyebrow chap-sub">${esc(sub)}</span>
      </div>
      <div class="chap-body">${tear(n + 20)}<div class="wrap">${body}</div></div>
    </section>`;

  // Platform icons as CSS masks (take the theme colour). Unknown platforms show their first letter.
  const brandIcon = (slug) => `url('https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${slug}.svg')`;
  const platIcons = { Instagram: brandIcon("instagram"), TikTok: brandIcon("tiktok"), YouTube: brandIcon("youtube"), Threads: brandIcon("threads"), X: brandIcon("x") };
  const icon = (name) => platIcons[name] ? `<i style="--icon:${platIcons[name]}" aria-hidden="true"></i>` : `<b aria-hidden="true">${esc(String(name)[0] || "?")}</b>`;

  const plats = C.platforms.filter((p) => p.name);
  const mainPlat = plats.find((p) => p.url);

  // ---------- Hero: headline + camera viewfinder ----------
  const hero = `
    <section class="hero cr-hero" aria-label="Intro">
      <div class="hero-copy">
        <span class="label">${esc(C.label)}</span>
        <h1>${C.headline.map(esc).join("<br>")}<br><mark class="hl">${esc(C.headlineMark)}</mark></h1>
        <p class="line">${esc(C.line)}</p>
        <div class="ctas">
          <a class="pill accent" href="#hits">See the hits &rarr;</a>
          ${mainPlat ? `<a class="pill" href="${esc(mainPlat.url)}" ${ext(mainPlat.url)}>Follow on ${esc(mainPlat.name)}</a>` : `<a class="pill" href="index.html">Explore my desk</a>`}
        </div>
      </div>
      <div class="viewfinder">
        <span class="tape" aria-hidden="true"></span>
        <div class="vf-screen">
          ${X.portrait()}
          <i class="vf-grid" aria-hidden="true"></i>
          <i class="vf-corner tl" aria-hidden="true"></i><i class="vf-corner tr" aria-hidden="true"></i>
          <i class="vf-corner bl" aria-hidden="true"></i><i class="vf-corner br" aria-hidden="true"></i>
          <i class="vf-focus" aria-hidden="true"></i>
          <div class="vf-top" aria-hidden="true"><span class="rec"><i></i>REC</span><span data-timecode>00:00:00:00</span></div>
          <div class="vf-bottom" aria-hidden="true"><span>4K 30</span><span>ISO 400</span><span>F1.8</span><span class="batt"><i></i></span></div>
        </div>
      </div>
      <i class="strip" aria-hidden="true"></i>
    </section>`;

  // ---------- Chapter 01: Day One ----------
  const first = C.firstVideo;
  const slateCells = [
    ["Started", isSoon(C.startedOn) ? soon : esc(C.startedOn)],
    ["Platform", plats.length ? plats.map((p) => esc(p.name)).join(", ") : soon],
    ["First video", first && first.title ? (first.link ? `<a href="${esc(first.link)}" ${ext(first.link)}>${esc(first.title)}</a>` : esc(first.title)) : soon],
    ["Take", "01"]
  ];
  const dayOne = `
    <p class="lead">Every channel starts with one nervous upload. Here is where mine began, and where it stands now.</p>
    <article class="slate reveal" style="--r:-1deg">
      <div class="slate-top" aria-hidden="true"><i class="slate-clap"></i><i class="slate-bar"></i></div>
      <div class="slate-body">
        <div class="slate-title">${esc(S.first)} <span>on camera</span></div>
        ${slateCells.map(([k, v]) => `<div class="slate-cell"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
      </div>
    </article>
    <h3 class="sub">By the Numbers</h3>
    <div class="stats-row cr-stats">
      ${C.stats.map((s) => `<div class="reveal"><div class="stat-v">${isSoon(s.value) ? soon : `<mark class="hl">${esc(s.value)}</mark>`}</div><div class="eyebrow stat-l">${esc(s.label)}</div></div>`).join("")}
    </div>
    <h3 class="sub">Find Me On</h3>
    <div class="plats">
      ${plats.map((p, i) => `
        <article class="plat slip reveal" style="--r:${tilt(i + 1)}">
          <span class="tape" aria-hidden="true"></span>
          <div class="plat-head"><div class="tool-icon plat-icon">${icon(p.name)}</div><h4>${esc(p.name)}</h4></div>
          <div class="plat-handle">${isSoon(p.handle) ? "Handle coming soon" : "@" + esc(String(p.handle).replace(/^@/, ""))}</div>
          <div class="plat-count"><span class="n">${isSoon(p.followers) ? soon : esc(p.followers)}</span><span class="eyebrow">followers</span></div>
          ${p.url ? `<a class="pill accent" href="${esc(p.url)}" ${ext(p.url)}>Follow &nearr;</a>` : ""}
        </article>`).join("")}
    </div>`;

  // ---------- Chapter 02: The Hits ----------
  const vids = C.bestVideos;
  const playIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>`;
  const slidesIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M4 7v12a2 2 0 0 0 2 2h12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  const reel = (v, i) => {
    const carousel = v.type === "carousel";
    const inner = `
      <div class="reel-media">
        ${v.thumb ? `<img src="${esc(v.thumb)}" alt="" loading="lazy" decoding="async">` : `<i class="reel-fill k${i % 3}" aria-hidden="true"></i>`}
        <i class="reel-shade" aria-hidden="true"></i>
        <span class="reel-rank">No. ${pad(i + 1)}</span>
        ${carousel ? `<span class="reel-slides" title="Carousel">${slidesIcon}</span>` : `<span class="reel-play">${playIcon}</span>`}
      </div>
      <div class="reel-meta">
        ${v.platform ? `<span class="eyebrow">${esc(v.platform)}${v.date ? ` / ${esc(v.date)}` : ""}</span>` : ""}
        <h4>${esc(v.title)}</h4>
        <div class="reel-nums">
          ${v.views ? `<span><b>${esc(v.views)}</b> views</span>` : ""}
          ${v.likes ? `<span><b>${esc(v.likes)}</b> likes</span>` : ""}
        </div>
      </div>`;
    return v.link
      ? `<a class="reel reveal" style="--r:${tilt(i)}" href="${esc(v.link)}" ${ext(v.link)} aria-label="Watch ${esc(v.title)}">${inner}</a>`
      : `<article class="reel reveal" style="--r:${tilt(i)}">${inner}</article>`;
  };
  const emptyReel = (i) => `
    <article class="reel empty reveal" style="--r:${tilt(i)}">
      <div class="reel-media"><span class="reel-rank">No. ${pad(i + 1)}</span><span class="reel-soon">Coming soon</span></div>
    </article>`;
  const hits = `
    <p class="lead">${esc(C.hitsLead)}</p>
    <div class="reels">${vids.length ? vids.map(reel).join("") : [0, 1, 2].map(emptyReel).join("")}</div>
    <div class="sec sub-sec" id="topics">
      <h3 class="section-title">What I Post</h3>
      <div class="slips">
        ${C.topics.map((t, i) => `
          <article class="slip reveal" style="--r:${tilt(i + 2)}">
            <span class="tape" aria-hidden="true"></span>
            <h4>${esc(t.title)}</h4>
            <span class="scrawl">${esc(t.script)}</span>
            <p>${esc(t.text)}</p>
          </article>`).join("")}
      </div>
    </div>`;

  // ---------- Chapter 03: The Climb ----------
  const steps = [...C.milestones];
  if (!steps.length && !isSoon(C.startedOn)) steps.push({ date: C.startedOn, title: "First video posted", note: plats[0] ? plats[0].name : "" });
  const climb = `
    <p class="lead">The milestones along the way, newest first.</p>
    <div class="ledger">
      ${steps.map((m) => `<div class="led reveal"><span class="eyebrow">${esc(m.date || "")}</span><strong>${esc(m.title)}</strong><span class="eyebrow led-org">${esc(m.note || "")}</span></div>`).join("")}
      ${steps.length ? "" : `<div class="led reveal"><span class="eyebrow">Next</span><strong class="soon">Milestones coming soon</strong><span></span></div>`}
    </div>`;

  // ---------- Chapter 04: Collab ----------
  const c = S.contact;
  const links = [
    { k: "Email", v: c.email, href: `mailto:${c.email}`, copy: c.email },
    ...plats.filter((p) => p.url).map((p) => ({ k: p.name, v: isSoon(p.handle) ? p.url.replace(/^https?:\/\/(www\.)?/, "") : "@" + String(p.handle).replace(/^@/, ""), href: p.url })),
    ...(c.linkedin ? [{ k: "LinkedIn", v: c.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: c.linkedin }] : [])
  ];
  const collab = `
    <p class="lead">${esc(C.collabLine)}</p>
    <ul class="contact-list">
      ${links.map((it) => `<li><a href="${esc(it.href)}" ${ext(it.href)} ${it.copy ? `data-copy="${esc(it.copy)}"` : ""}><span class="k">${esc(it.k)}</span><span class="v">${esc(it.v)}</span><span class="arrow">&nearr;</span></a></li>`).join("")}
    </ul>`;

  root.innerHTML = `
    <nav class="subnav" aria-label="Sections">
      <a href="#start">Day One</a><a href="#hits">The Hits</a><a href="#topics">What I Post</a><a href="#climb">The Climb</a><a href="#collab">Collab</a>
    </nav>
    ${hero}
    ${chapter("c-accent", "start", "Day One", "Where it started", 1, dayOne)}
    ${chapter("c-invert", "hits", "The Hits", "Best performing videos", 2, hits)}
    ${chapter("c-accent", "climb", "The Climb", "Milestones", 3, climb)}
    ${chapter("c-invert", "collab", "Let's Collab", "Work with me", 4, collab)}
    <footer class="foot">
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          ${Array.from({ length: 4 }, () => `<span class="giant">${esc(S.first)} ${esc(S.last)}</span><span class="giant star">&#9679;</span><span class="giant">Rolling</span><span class="giant star">&#10038;</span>`).join("")}
        </div>
      </div>
      <div class="meta">
        <span>${esc(S.location)}</span>
        <span data-clock></span>
        <span>Last updated ${esc(S.lastUpdated)}</span>
        <span>&copy; ${new Date().getFullYear()} ${esc(S.name)}</span>
      </div>
    </footer>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      ${[3, 8, 14].map((seed, i) => `<filter id="ink${i}"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="2.5"/></filter>`).join("")}
    </svg>`;

  window.renderChrome("creator");
  window.observeReveals();

  // Highlighter swipes draw once on screen; the hero one swipes in on load
  const drawIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("on"); drawIO.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -15% 0px", threshold: 0.6 });
  document.querySelectorAll(".hl:not(.hero .hl)").forEach((el) => drawIO.observe(el));
  const heroMark = () => document.querySelector(".hero .hl").classList.add("on");
  if (document.readyState === "complete") heroMark(); else addEventListener("load", heroMark);

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Viewfinder timecode (hh:mm:ss:frames since the page opened)
  const tc = document.querySelector("[data-timecode]");
  const t0 = performance.now();
  function tick(now) {
    const f = Math.floor(((now - t0) / 1000) * 30);
    const s = Math.floor(f / 30);
    tc.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, f % 30].map(pad).join(":");
    requestAnimationFrame(tick);
  }
  if (!still) requestAnimationFrame(tick);

  // Scroll effects at 12 frames a second, same as Classic
  const links2 = [...document.querySelectorAll(".subnav a")];
  const secs = [...document.querySelectorAll("main .sec[id]")];
  const cards = [...document.querySelectorAll(".chap")];
  let last = 0, queued = false;
  function frame(now) {
    queued = false;
    if (now - last < 83) { queue(); return; }
    last = now;
    const h = innerHeight;
    const current = secs.filter((s) => s.getBoundingClientRect().top <= h * 0.5).pop();
    links2.forEach((l) => l.classList.toggle("on", !!current && l.getAttribute("href") === "#" + current.id));
    if (still) return;
    cards.forEach((chap) => {
      const p = -chap.getBoundingClientRect().top / h;
      if (p > -1 && p < 1.2) chap.style.setProperty("--cam", (1 + Math.max(0, p) * 0.22).toFixed(3));
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  queue();

  if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 50);
})();
