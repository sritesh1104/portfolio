/* Classic version: renders every section into one scrolling page. */
(function () {
  const S = window.SITE;
  const X = window.Sections;
  const root = document.getElementById("classic-root");

  const penDoodle = `<svg class="doodle" style="position:absolute;left:4%;top:8%;width:70px" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 6 L46 30 L38 52 H26 L18 30 Z"/><circle cx="32" cy="30" r="4"/><path d="M32 6v20M26 52h12v6H26z"/></svg>`;
  const arrowDoodle = `<svg class="doodle" style="position:absolute;right:2%;bottom:14%;width:90px" viewBox="0 0 90 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 7" aria-hidden="true"><path d="M84 8C60 10 30 22 12 50"/><path d="M12 50l2-14M12 50l13-5" stroke-dasharray="0"/></svg>`;
  const starDoodle = `<svg class="doodle" style="position:absolute;right:10%;top:6%;width:34px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>`;

  root.innerHTML = `
    <nav class="subnav" aria-label="Sections">
      <a href="#about">About</a><a href="#work">Work</a><a href="#projects">Projects</a>
      <a href="#education">Education</a><a href="#awards">Awards</a><a href="#community">Community</a><a href="#stage">On Stage</a><a href="#sports">Sports</a><a href="#contact">Contact</a>
    </nav>

    <section class="hero" aria-label="Intro">
      <div>
        <span class="kicker">${X.esc(S.intro.kicker)}</span>
        <div class="name-wrap">
          <h1 class="display name">${X.esc(S.first)}<br>${X.esc(S.last)}</h1>
        </div>
        <p class="line">${X.esc(S.intro.line)}</p>
        <div class="ctas">
          <a class="pill accent" href="#projects">See projects</a>
          <a class="pill" href="index.html">Explore my desk</a>
        </div>
      </div>
      <div class="art">
        ${X.squiggle("left:0;top:4%")}
        ${X.squiggle("right:4%;bottom:6%;transform:rotate(160deg)")}
        ${starDoodle}
        ${X.portrait()}
        ${arrowDoodle}
      </div>
      ${penDoodle}
    </section>

    ${X.about()}
    ${X.work()}
    ${X.projects()}
    ${X.education()}
    ${X.awards()}
    ${X.community()}
    ${X.stage()}
    ${X.sports()}
    ${X.contact()}

    <footer class="foot">
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          ${Array.from({ length: 4 }, () => `<span class="giant">${X.esc(S.first)} ${X.esc(S.last)}</span><span class="giant star">&#10038;</span>`).join("")}
        </div>
      </div>
      <div class="meta">
        <span>${X.esc(S.location)}</span>
        <span data-clock></span>
        <span>Last updated ${X.esc(S.lastUpdated)}</span>
        <span>&copy; ${new Date().getFullYear()} ${X.esc(S.name)}</span>
      </div>
    </footer>`;

  window.renderChrome("classic");
  window.observeReveals();

  // Highlight the current section in the sub nav
  const links = [...document.querySelectorAll(".subnav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main .sec[id]").forEach((s) => io.observe(s));

  // Deep link from Explore (classic.html#projects)
  if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 50);
})();
