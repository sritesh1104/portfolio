/*
  Section renderers shared by both versions.
  Each returns an HTML string built from window.SITE (content.js).
*/
(function () {
  const S = window.SITE;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Words that must keep their exact casing inside ALL CAPS headings (e.g. "GoT")
  const KEEP_CASE = ["GoT", "MyAO"];
  const keepCase = (s) => KEEP_CASE.reduce((out, w) => out.split(w).join(`<span class="keep-case">${w}</span>`), esc(s));
  // Awards sorted latest first: by end year, then by start year ("2015 to 2019" ends 2019)
  const years = (y) => (String(y).match(/\d{4}/g) || ["0"]).map(Number);
  const sortedAwards = () =>
    [...S.awards].sort((a, b) => {
      const ya = years(a.year), yb = years(b.year);
      return (yb[yb.length - 1] - ya[ya.length - 1]) || (yb[0] - ya[0]);
    });
  window.sortedAwards = sortedAwards;

  // Star medal on a striped ribbon (used on Awards, distinct from the round sports medals)
  const starMedal = `
    <svg class="star-medal" viewBox="0 0 60 80" aria-hidden="true">
      <path d="M14 0h32v34L30 48 14 34z" fill="#a51d2d"/>
      <path d="M21 0h6v41l-6-4.5zM33 0h6v36.5L33 41z" fill="#d23a48"/>
      <path d="M30 34l7.1 14.4 15.9 2.3-11.5 11.2 2.7 15.8L30 70.2l-14.2 7.5 2.7-15.8L7 50.7l15.9-2.3z" fill="#f5a623"/>
      <path d="M30 34v25l7.1-10.6zM53 50.7L30 59l11.5 3.9zM44.2 77.7L30 59v11.2zM15.8 77.7L30 59l-11.5 2.9zM7 50.7L30 59l-7.1-10.6z" fill="#ffd84a"/>
    </svg>`;

  const tilt = (i) => [-2.2, 1.6, -1, 2.4, -1.8, 1.1, -2.6, 1.9, -0.8][i % 9] + "deg";

  const squiggle = (style) =>
    `<svg class="squiggle" style="${style}" viewBox="0 0 90 40" fill="none" aria-hidden="true">
      <path d="M4 26c8-18 16-18 20 0s12 18 18 0 14-18 20 0 12 16 24-4" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>`;

  const titleStack = (big, script, cls = "") =>
    `<div class="title-stack ${cls}"><h2 class="display">${esc(big)}</h2><span class="script">${esc(script)}</span></div>`;

  // Sticker cutout portrait (white outline is baked into the PNG)
  const portrait = (cls = "") =>
    `<img class="portrait-sticker ${cls}" src="assets/img/portrait.png" alt="${esc(S.name)}" width="420" height="528" decoding="async">`;

  const sections = {
    // withPortrait: the Explore panel shows the sticker here; Classic already has it in the hero
    about(withPortrait) {
      return `
      <section class="sec" id="about">
        ${withPortrait ? `<div class="about-portrait">${portrait("sm")}</div>` : ""}
        <div class="sec-head">
          ${titleStack("How I work", "builder mindset", "sm")}
          <p class="sec-lead">${esc(S.intro.line)}</p>
        </div>
        <div class="pillars">
          ${S.pillars.map((p) => `
            <article class="pillar reveal">
              ${titleStack(p.title, p.script, "sm")}
              <p>${esc(p.text)}</p>
              <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            </article>`).join("")}
        </div>
        <h3 class="sub-head">Toolkit</h3>
        <div class="chips">${S.tools.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        <h3 class="sub-head">I speak</h3>
        <div class="chips">${S.languages.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      </section>`;
    },

    work() {
      return `
      <section class="sec" id="work">
        <div class="sec-head">
          ${titleStack("Work History", "the journey")}
          <p class="sec-lead">${esc(S.workIntro.lead)}</p>
          ${squiggle("right:0;top:10px")}
        </div>
        <div class="edge reveal">
          <p class="edge-label">${esc(S.workIntro.edge)}</p>
          <div class="formula">
            ${S.workIntro.formula.map((f) => `<span class="term">${esc(f)}</span>`).join('<span class="plus" aria-hidden="true">+</span>')}
          </div>
        </div>
        <div class="rows">
          ${S.work.map((w) => `
            <article class="row reveal">
              <div class="when">${esc(w.period)}</div>
              <div>
                <h3>${esc(w.role)}</h3>
                <div class="org">${esc(w.org)}</div>
                <ul>${w.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
              </div>
            </article>`).join("")}
        </div>
      </section>`;
    },

    projects() {
      return `
      <section class="sec" id="projects">
        <div class="sec-head">
          ${titleStack("Projects", "things I built")}
          <p class="sec-lead">Shipped tools, not slide decks. Each one started with a real problem and a number to move.</p>
        </div>
        <div class="cards">
          ${S.projects.map((p, i) => `
            <article class="card reveal" style="--r:${tilt(i)}">
              <span class="tape" aria-hidden="true"></span>
              <div class="num">${String(i + 1).padStart(2, "0")}</div>
              <h3>${esc(p.title)}</h3>
              <div class="tagline">${esc(p.tagline)}</div>
              ${p.stat
                ? `<div class="stat"><span class="stat-v">${esc(p.stat.value)}</span><span class="stat-l">${esc(p.stat.label)}</span></div>`
                : `<div class="impact">${esc(p.impact)}</div>`}
              <p>${esc(p.text)}</p>
              ${p.link ? `<a class="go" href="${esc(p.link)}" target="_blank" rel="noopener">Try it &rarr;</a>` : ""}
            </article>`).join("")}
        </div>
      </section>`;
    },

    education() {
      return `
      <section class="sec" id="education">
        <div class="sec-head">
          ${titleStack("Education", "the foundation")}
        </div>
        <div class="edu-list">
          ${S.education.map((e, i) => `
            <article class="certificate ${i === 0 ? "main" : "small"} reveal">
              <div class="eyebrow">${esc(e.school)}</div>
              ${e.period ? `<div class="edu-period">${esc(e.period)}</div>` : ""}
              <h3>${esc(e.qualification)}</h3>
              ${e.honours ? `<span class="honours">${esc(e.honours)}</span>` : ""}
              ${e.note ? `<div class="edu-note">${esc(e.note)}</div>` : ""}
              ${e.highlights.length ? `<ul>${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
              ${e.link ? `<a class="go" href="${esc(e.link.href)}" target="_blank" rel="noopener">${esc(e.link.label)} &rarr;</a>` : ""}
            </article>`).join("")}
        </div>
        <h3 class="sub-head">Beyond the classroom</h3>
        <div class="rows mini-rows">
          ${S.extracurriculars.map((x) => `
            <article class="row reveal">
              <div class="when">${esc(x.period)}</div>
              <div><h3>${keepCase(x.role)}</h3><div class="org">${esc(x.org)}</div></div>
            </article>`).join("")}
        </div>
      </section>`;
    },

    awards() {
      return `
      <section class="sec" id="awards">
        <div class="sec-head">
          ${titleStack("Awards", "recognition")}
        </div>
        <div class="award-cards">
          ${sortedAwards().map((a, i) => `
            <article class="award-card reveal" style="--r:${tilt(i + 1)}">
              ${starMedal}
              <div class="num">${String(i + 1).padStart(2, "0")}</div>
              ${a.year ? `<div class="award-year">${esc(a.year)}</div>` : ""}
              <h3>${keepCase(a.title)}</h3>
              ${a.org ? `<div class="award-org">${esc(a.org)}</div>` : ""}
            </article>`).join("")}
        </div>
      </section>`;
    },

    community() {
      const colors = ["", "yellow", "orange"];
      return `
      <section class="sec" id="community">
        <div class="sec-head">
          ${titleStack("Community", "giving back")}
          <p class="sec-lead">Teaching, coaching and showing up. The work that taught me how to explain things simply.</p>
        </div>
        <div class="pinboard">
          ${S.community.map((c, i) => `
            <article class="note ${colors[i % 3]} reveal" style="--r:${tilt(i + 3)}">
              <span class="pin" aria-hidden="true"></span>
              <h3>${esc(c.title)}</h3>
              <div class="org">${esc(c.org)}</div>
              <p>${esc(c.text)}</p>
              <span class="scrawl">${esc(c.note)}</span>
            </article>`).join("")}
        </div>
      </section>`;
    },

    stage() {
      const st = S.stage;
      const roles = ["Emcee & Hosting", "Panel", "Business Events"];
      const roleClass = (r) => "role-" + String(r).toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      const events = [...st.events].sort((a, b) => {
        const ya = years(a.date), yb = years(b.date);
        return yb[yb.length - 1] - ya[ya.length - 1];
      });
      const ticket = (e, i) => `
        <article class="ticket reveal" data-role="${esc(e.role)}" style="--r:${tilt(i)}">
          ${e.photo ? `<img class="ticket-photo" src="${esc(e.photo)}" alt="${esc(e.event)}" loading="lazy">` : ""}
          <div class="ticket-main">
            <span class="role-tag ${roleClass(e.role)}">${esc(e.role)}</span>
            <h3>${esc(e.event)}</h3>
            <div class="ticket-org">${esc(e.organiser || "")}</div>
          </div>
          <div class="ticket-stub">
            <span class="stub-k">Date</span><span class="stub-v">${esc(e.date || "")}</span>
            ${e.audience ? `<span class="stub-k">Audience</span><span class="stub-v">${esc(e.audience)}</span>` : ""}
            ${e.link ? `<a class="go" href="${esc(e.link)}" target="_blank" rel="noopener">Watch &rarr;</a>` : ""}
          </div>
        </article>`;
      return `
      <section class="sec" id="stage">
        <div class="sec-head">
          ${titleStack("On Stage", "behind the mic")}
          <p class="sec-lead">${esc(st.intro)}</p>
        </div>
        ${st.stats.length ? `<div class="stage-stats">${st.stats.map((s) => `<div class="stat"><span class="stat-v">${esc(s.value)}</span><span class="stat-l">${esc(s.label)}</span></div>`).join("")}</div>` : ""}
        ${(st.gallery || []).length ? `
          <div class="photo-wall">
            ${st.gallery.map((src, i) => `
              <figure class="polaroid reveal" style="--r:${tilt(i + 2)}">
                <span class="tape" aria-hidden="true"></span>
                <img src="${esc(src)}" alt="Sritesh on stage, photo ${i + 1}" loading="lazy" decoding="async">
              </figure>`).join("")}
          </div>` : ""}
        ${events.length
          ? `<h3 class="sub-head">Events</h3>
             <div class="stage-filters" role="group" aria-label="Filter by role">
               ${["All", ...roles].map((r, i) => `<button type="button" class="chip-btn${i === 0 ? " on" : ""}" data-filter="${r}">${r}</button>`).join("")}
             </div>
             <div class="tickets">${events.map(ticket).join("")}</div>`
          : ""}
      </section>`;
    },

    sports() {
      return `
      <section class="sec" id="sports">
        <div class="sec-head">
          ${titleStack("Sports", "& achievements")}
          <p class="sec-lead">${esc(S.sports.intro)}</p>
        </div>
        ${S.sports.groups.map((grp, gi) => `
          <div class="sport-group">
            <h3 class="sub-head"><span class="grp-num">${String(gi + 1).padStart(2, "0")}</span>${esc(grp.name)}</h3>
            <div class="medals">
              ${grp.items.length
                ? grp.items.map((s) => `
                  <article class="medal-box reveal">
                    <div class="disc" aria-hidden="true"></div>
                    <h3>${esc(s.sport)}</h3>
                    ${s.event ? `<p>${esc(s.event)}</p>` : ""}
                    <p>${[s.result, s.year].filter(Boolean).map(esc).join(" &middot; ")}</p>
                  </article>`).join("")
                : `<article class="medal-box empty reveal"><div class="disc" aria-hidden="true"></div><span class="tbc">DETAILS COMING SOON</span></article>`}
            </div>
          </div>`).join("")}
      </section>`;
    },

    contact() {
      const c = S.contact;
      const items = [
        { k: "Email", v: c.email, href: `mailto:${c.email}`, copy: c.email },
        { k: "Phone", v: c.phone, href: `tel:${c.phoneRaw}`, copy: c.phone },
        { k: "LinkedIn", v: c.linkedin ? c.linkedin.replace(/^https?:\/\/(www\.)?/, "") : "Link coming soon", href: c.linkedin || null },
        { k: "GitHub", v: c.github.replace(/^https?:\/\//, ""), href: c.github }
      ];
      return `
      <section class="sec" id="contact">
        <p class="eyebrow">Contact</p>
        <div class="title-stack">
          <h2 class="contact-big">Let's get</h2>
          <span class="script" style="font-size:clamp(30px,4.6vw,64px)">in touch</span>
        </div>
        <ul class="contact-list">
          ${items.map((it) => `<li>${
            it.href
              ? `<a href="${esc(it.href)}" ${/^http/.test(it.href) ? 'target="_blank" rel="noopener"' : ""} ${it.copy ? `data-copy="${esc(it.copy)}"` : ""}><span class="k">${it.k}</span><span class="v">${esc(it.v)}</span><span class="arrow">&nearr;</span></a>`
              : `<button type="button" disabled style="opacity:.55;cursor:default"><span class="k">${it.k}</span><span class="v">${esc(it.v)}</span><span class="arrow"></span></button>`
          }</li>`).join("")}
        </ul>
      </section>`;
    }
  };

  window.Sections = { ...sections, esc, keepCase, squiggle, titleStack, portrait };
})();
