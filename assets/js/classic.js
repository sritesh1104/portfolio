/* Classic version: one scrolling page in a paper explainer style. All text comes from content.js. */
(function () {
  const S = window.SITE;
  const X = window.Sections;
  const V = S.vox;
  const esc = X.esc;
  const root = document.getElementById("classic-root");
  const pad = (n) => String(n).padStart(2, "0");
  const tilt = (i) => [-2.2, 1.6, -1, 2.4, -1.8, 1.1, -2.6, 1.9, -0.8][i % 9] + "deg";

  // Jagged paper edge, same shape every load for a given seed
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

  const circle = `<svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M92 7C60-1 12 6 6 24c-5 16 34 23 62 21 26-2 49-12 46-26C111 7 84 3 62 6"/></svg>`;
  // ==text== is highlighter, {{text}} is the marker circle
  const marked = (s) => esc(s)
    .replace(/==(.+?)==/g, '<mark class="hl">$1</mark>')
    .replace(/\{\{(.+?)\}\}/g, `<span class="circled">$1${circle}</span>`);

  const chapter = (cls, id, ch, n, body) => `
    <section class="chap ${cls} sec" id="${id}">
      <div class="chap-card">
        <span class="eyebrow chap-num">Chapter ${pad(n)}</span>
        <h2 class="chap-title wobble">${esc(ch.title)}</h2>
        <span class="eyebrow chap-sub">${esc(ch.sub)}</span>
      </div>
      <div class="chap-body">${tear(n)}<div class="wrap">${body}</div></div>
    </section>`;

  const labels = (items) => `<div class="labels">${items.map((t) => `<span class="label">${esc(t)}</span>`).join("")}</div>`;

  // Toolkit icons, used as CSS masks so they take the theme's colours. A tool with no entry shows its first letter.
  const brandIcon = (slug) => `url('https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${slug}.svg')`;
  const drawnIcon = (inner) => `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`)}')`;
  const toolIcons = {
    Excel: drawnIcon('<path fill="#000" stroke="none" fill-rule="evenodd" d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM8.2 6.5 12 10.6l3.8-4.1h2.8L13.5 12l5.1 5.5h-2.8L12 13.4l-3.8 4.1H5.4l5.1-5.5-5.1-5.5z"/>'),
    VBA: drawnIcon('<path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/>'),
    SQL: drawnIcon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
    R: brandIcon("r"),
    Claude: brandIcon("claude"),
    ChatGPT: brandIcon("openai"),
    Gemini: brandIcon("googlegemini"),
    "Google Apps Script": brandIcon("googleappsscript"),
    Word: drawnIcon('<path fill="#000" stroke="none" fill-rule="evenodd" d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM5.5 7h2.3l1.4 7 1.8-7h2l1.8 7 1.4-7h2.3l-2.5 10.5h-2.2L12 10.6l-1.8 6.9H8z"/>'),
    PowerPoint: drawnIcon('<path fill="#000" stroke="none" fill-rule="evenodd" d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM8 6.5h5a4 4 0 0 1 0 8h-2.6v3H8zM10.4 8.7v3.6H13a1.8 1.8 0 0 0 0-3.6z"/>'),
    Notion: brandIcon("notion"),
    Figma: brandIcon("figma"),
    Miro: brandIcon("miro"),
    GitHub: brandIcon("github"),
    Lovable: drawnIcon('<path fill="#000" stroke="none" d="M12 21s-8.5-5.2-8.5-11.3A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 8.5 3.1C20.5 15.8 12 21 12 21z"/>')
  };

  // ---------- Chapter 01 ----------
  const record = `
    <article class="doc push reveal" style="--r:-.6deg">
      <header class="eyebrow doc-head"><span>Professional record</span><span>${esc(S.location)}</span></header>
      <h3 class="doc-title">${esc(V.recordTitle)}</h3>
      ${V.record.map((p) => `<p>${marked(p)}</p>`).join("")}
    </article>
    <h3 class="sub">How I Work</h3>
    <div class="slips">
      ${S.pillars.map((p, i) => `
        <article class="slip reveal" style="--r:${tilt(i)}">
          <span class="tape" aria-hidden="true"></span>
          <h4>${esc(p.title)}</h4>
          <span class="scrawl">${esc(p.script)}</span>
          <p>${esc(p.text)}</p>
          <span class="eyebrow slip-tags">${p.tags.map(esc).join(" / ")}</span>
        </article>`).join("")}
    </div>
    <h3 class="sub">Toolkit</h3>
    <div class="tool-groups">
      ${S.toolGroups.map((g) => `
        <div class="tool-group">
          <h4 class="scrawl">${esc(g.name)}</h4>
          <div class="tools">
            ${g.items.map((t, i) => `
              <div class="tool reveal" style="--r:${tilt(i)}">
                <div class="tool-icon">${toolIcons[t] ? `<i style="--icon:${toolIcons[t]}" aria-hidden="true"></i>` : `<b aria-hidden="true">${esc(t[0])}</b>`}</div>
                <div class="tool-name">${esc(t)}</div>
              </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>
    <h3 class="sub">I Speak</h3>${labels(S.languages)}`;

  // ---------- Chapter 02 ----------
  const journey = `
    <p class="lead">${esc(S.workIntro.lead)}</p>
    <div class="formula-v reveal">
      <span class="eyebrow">${esc(S.workIntro.edge)}</span>
      <div>${S.workIntro.formula.map((f, i) => `<span class="term" style="--r:${tilt(i)}">${esc(f)}</span>`).join('<span class="plus" aria-hidden="true">+</span>')}</div>
    </div>
    ${S.work.map((w, i) => `
      <article class="era">
        <div class="era-when reveal"><span>${esc(w.period)}</span><i class="tape" aria-hidden="true"></i></div>
        <div class="era-row">
          <div class="era-card k${i % 3} reveal" style="--r:${tilt(i)}">
            <span class="eyebrow">${esc(w.org)}</span>
            <h3>${esc(w.role)}</h3>
            <i class="pin" aria-hidden="true"></i>
          </div>
          <div class="slip era-note reveal" style="--r:${tilt(i + 1)}">
            <ul>${w.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          </div>
        </div>
      </article>`).join("")}`;

  // ---------- Chapter 03 ----------
  const build = `
    <p class="lead">Shipped tools, not slide decks. Each one started with a real problem and a number to move.</p>
    <div class="clips">
      ${S.projects.map((p, i) => `
        <article class="clip reveal" style="--r:${tilt(i)}">
          <span class="tape" aria-hidden="true"></span>
          <div class="eyebrow clip-head"><span>No. ${pad(i + 1)}</span><span>Project file</span></div>
          <h3>${esc(p.title)}</h3>
          <div class="scrawl">${esc(p.tagline)}</div>
          ${p.stat
            ? `<div class="stat-v"><mark class="hl">${esc(p.stat.value)}</mark></div><div class="eyebrow stat-l">${esc(p.stat.label)}</div>`
            : `<div class="impact"><mark class="hl">${esc(p.impact)}</mark></div>`}
          <p>${esc(p.text)}</p>
          ${p.link ? `<a class="pill accent" href="${esc(p.link)}" target="_blank" rel="noopener">Try it &rarr;</a>` : ""}
        </article>`).join("")}
    </div>`;

  // ---------- Chapter 04 ----------
  const [mainEdu, ...otherEdu] = S.education;
  const foundation = `
    <article class="doc push reveal" style="--r:.5deg">
      <header class="eyebrow doc-head"><span>${esc(mainEdu.school)}</span><span>${esc(mainEdu.period)}</span></header>
      <h3 class="doc-title">${esc(mainEdu.qualification)}</h3>
      <p><mark class="hl">${esc(mainEdu.honours)}</mark></p>
      ${mainEdu.highlights.map((h) => `<p>${esc(h)}</p>`).join("")}
      <a class="pill accent" href="${esc(mainEdu.link.href)}" target="_blank" rel="noopener">${esc(mainEdu.link.label)} &rarr;</a>
    </article>
    <div class="slips">
      ${otherEdu.map((e, i) => `
        <article class="slip reveal" style="--r:${tilt(i + 2)}">
          <span class="tape" aria-hidden="true"></span>
          <span class="eyebrow">${esc(e.period)}</span>
          <h4>${esc(e.school)}</h4>
          <p>${esc(e.qualification)} ${e.note ? esc(e.note) : ""}</p>
          <span class="scrawl">${esc(e.honours)}</span>
        </article>`).join("")}
    </div>
    <h3 class="sub">Beyond the Classroom</h3>
    <div class="ledger">
      ${S.extracurriculars.map((x) => `
        <div class="led reveal"><span class="eyebrow">${esc(x.period)}</span><strong>${X.keepCase(x.role)}</strong><span class="eyebrow led-org">${esc(x.org)}</span></div>`).join("")}
    </div>
    <div class="sec sub-sec" id="awards">
      <h3 class="section-title">Awards</h3>
      <div class="ledger">
        ${window.sortedAwards().map((a) => `
          <div class="led reveal"><span class="eyebrow">${esc(a.year)}</span><strong>${X.keepCase(a.title)}</strong><span class="eyebrow led-org">${esc(a.org)}</span></div>`).join("")}
      </div>
    </div>`;

  // ---------- Chapter 05 ----------
  const st = S.stage;
  const people = `
    <p class="lead">Teaching, coaching and showing up. The work that taught me how to explain things simply.</p>
    <div class="slips">
      ${S.community.map((c, i) => `
        <article class="slip reveal" style="--r:${tilt(i + 3)}">
          <i class="pin" aria-hidden="true"></i>
          <h4>${esc(c.title)}</h4>
          <span class="eyebrow">${esc(c.org)}</span>
          <p>${esc(c.text)}</p>
          <span class="scrawl">${esc(c.note)}</span>
        </article>`).join("")}
    </div>
    <div class="sec sub-sec" id="stage">
      <h3 class="section-title">On Stage</h3>
      <p class="lead">${esc(st.intro)}</p>
      ${st.stats.length ? `<div class="stats-row">${st.stats.map((s) => `<div><div class="stat-v"><mark class="hl">${esc(s.value)}</mark></div><div class="eyebrow stat-l">${esc(s.label)}</div></div>`).join("")}</div>` : ""}
      <div class="cuts">
        ${st.gallery.map((src, i) => `
          <figure class="cut reveal" style="--r:${tilt(i + 2)}">
            <img src="${esc(src)}" alt="Sritesh on stage, photo ${i + 1}" loading="lazy" decoding="async">
            ${i % 3 === 0 ? '<span class="tape" aria-hidden="true"></span>' : ""}
          </figure>`).join("")}
      </div>
      ${st.events.length ? `<div class="ledger">${st.events.map((e) => `
        <div class="led reveal"><span class="eyebrow">${esc(e.date || "")}</span><strong>${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(e.event)}</a>` : esc(e.event)}</strong><span class="eyebrow led-org">${esc(e.role)}</span></div>`).join("")}</div>` : ""}
    </div>
    <div class="sec sub-sec" id="sports">
      <h3 class="section-title">Sports &amp; Achievements</h3>
      <p class="lead">${esc(S.sports.intro)}</p>
      <div class="ledger">
        ${S.sports.groups.map((g) => g.items.length
          ? g.items.map((s) => `<div class="led reveal"><span class="eyebrow">${esc(g.name)}</span><strong>${esc(s.sport)}${s.event ? `, ${esc(s.event)}` : ""}</strong><span class="eyebrow led-org">${[s.result, s.year].filter(Boolean).map(esc).join(" / ")}</span></div>`).join("")
          : `<div class="led reveal"><span class="eyebrow">${esc(g.name)}</span><strong class="soon">Details coming soon</strong><span></span></div>`).join("")}
      </div>
    </div>`;

  // ---------- Chapter 06 ----------
  const c = S.contact;
  const contactItems = [
    { k: "Email", v: c.email, href: `mailto:${c.email}`, copy: c.email },
    { k: "Phone", v: c.phone, href: `tel:${c.phoneRaw}`, copy: c.phone },
    { k: "LinkedIn", v: c.linkedin ? c.linkedin.replace(/^https?:\/\/(www\.)?/, "") : "Link coming soon", href: c.linkedin || null },
    { k: "GitHub", v: c.github.replace(/^https?:\/\//, ""), href: c.github }
  ];
  const contact = `
    <ul class="contact-list">
      ${contactItems.map((it) => `<li>${it.href
        ? `<a href="${esc(it.href)}" ${/^http/.test(it.href) ? 'target="_blank" rel="noopener"' : ""} ${it.copy ? `data-copy="${esc(it.copy)}"` : ""}><span class="k">${it.k}</span><span class="v">${esc(it.v)}</span><span class="arrow">&nearr;</span></a>`
        : `<button type="button" disabled><span class="k">${it.k}</span><span class="v">${esc(it.v)}</span><span class="arrow"></span></button>`}</li>`).join("")}
    </ul>`;

  root.innerHTML = `
    <nav class="subnav" aria-label="Sections">
      <a href="#about">About</a><a href="#work">Work</a><a href="#projects">Projects</a>
      <a href="#education">Education</a><a href="#awards">Awards</a><a href="#community">Community</a><a href="#stage">On Stage</a><a href="#sports">Sports</a><a href="#contact">Contact</a>
    </nav>

    <section class="hero" aria-label="Intro">
      <div class="hero-copy">
        <span class="label">${esc(V.label)}</span>
        <h1>${V.headline.map(esc).join("<br>")}<br><mark class="hl">${esc(V.headlineMark)}</mark></h1>
        <p class="line">${esc(S.intro.line)}</p>
        <div class="ctas">
          <a class="pill accent" href="#projects">See projects &rarr;</a>
          <a class="pill" href="index.html">Explore my desk</a>
        </div>
      </div>
      <div class="cutout">
        <span class="tape" aria-hidden="true"></span>
        ${X.portrait()}
      </div>
      <i class="strip" aria-hidden="true"></i>
    </section>

    ${chapter("c-accent", "about", V.chapters.numbers, 1, record)}
    ${chapter("c-invert", "work", V.chapters.journey, 2, journey)}
    ${chapter("c-accent", "projects", V.chapters.build, 3, build)}
    ${chapter("c-invert", "education", V.chapters.foundation, 4, foundation)}
    ${chapter("c-accent", "community", V.chapters.people, 5, people)}
    ${chapter("c-invert", "contact", V.chapters.contact, 6, contact)}

    <footer class="foot">
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          ${Array.from({ length: 4 }, () => `<span class="giant">${esc(S.first)} ${esc(S.last)}</span><span class="giant star">&#10038;</span>`).join("")}
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

  window.renderChrome("classic");
  window.observeReveals();

  // Highlighter swipes and marker circles draw once they are on screen
  const drawIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("on"); drawIO.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -15% 0px", threshold: 0.6 });
  document.querySelectorAll(".hl:not(.hero .hl), .circled").forEach((el) => drawIO.observe(el));

  // The hero highlight doesn't wait for scrolling: it swipes in as soon as the page has loaded
  const heroMark = () => document.querySelector(".hero .hl").classList.add("on");
  if (document.readyState === "complete") heroMark();
  else addEventListener("load", heroMark);

  // Scroll effects run at 12 frames a second so they feel handmade
  const links = [...document.querySelectorAll(".subnav a")];
  const secs = [...document.querySelectorAll("main .sec[id]")];
  const cards = [...document.querySelectorAll(".chap")];
  const pushes = [...document.querySelectorAll(".push")];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = 0;
  let queued = false;
  function frame(now) {
    queued = false;
    if (now - last < 83) { queue(); return; }
    last = now;
    const h = innerHeight;
    const current = secs.filter((s) => s.getBoundingClientRect().top <= h * 0.5).pop();
    links.forEach((l) => l.classList.toggle("on", !!current && l.getAttribute("href") === "#" + current.id));
    if (still) return;
    // Camera slowly pushes in on the chapter title and on documents
    cards.forEach((chap) => {
      const p = -chap.getBoundingClientRect().top / h;
      if (p > -1 && p < 1.2) chap.style.setProperty("--cam", (1 + Math.max(0, p) * 0.22).toFixed(3));
    });
    pushes.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / h;
      if (p > -0.2 && p < 1.2) el.style.setProperty("--push", (0.985 + Math.min(1, Math.max(0, p)) * 0.04).toFixed(3));
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  queue();

  // Deep link from Explore (classic.html#projects)
  if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 50);
})();
