/*
  Shared UI: theme switch, live clock, copy-to-clipboard, scroll reveals.
*/
(function () {
  const S = window.SITE;
  const root = document.documentElement;

  // ---------- Theme ----------
  // Explore and Classic both open in dark mode. Each page remembers the visitor's own choice.
  const PAGE = document.body.classList.contains("classic") ? "classic" : "explore";
  const DEFAULT_THEME = "dark";
  const THEME_KEY = "sn-theme-" + PAGE;
  function getSavedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function setTheme(t, save) {
    root.setAttribute("data-theme", t);
    if (save) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
    document.querySelectorAll(".theme-switch").forEach((b) => {
      b.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
      b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }
  const saved = getSavedTheme();
  setTheme(saved === "dark" || saved === "light" ? saved : DEFAULT_THEME, false);

  const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>`;

  // ---------- Top bar + mode toggle markup ----------
  window.renderChrome = function (mode) {
    const bar = document.createElement("header");
    bar.className = "topbar";
    bar.innerHTML = `
      <a class="brand" href="${mode === "explore" ? "index.html" : "classic.html"}">${S.first}<span>.</span></a>
      <div class="topbar-right">
        <span class="clock" data-clock></span>
        <button class="theme-switch" type="button"><span class="knob"></span></button>
      </div>`;
    document.body.prepend(bar);

    const mt = document.createElement("nav");
    mt.className = "mode-toggle";
    mt.setAttribute("aria-label", "Choose version");
    mt.innerHTML = `
      <a href="index.html" class="${mode === "explore" ? "active" : ""}" ${mode === "explore" ? 'aria-current="page"' : ""}>EXPLORE</a>
      <a href="classic.html" class="${mode === "classic" ? "active" : ""}" ${mode === "classic" ? 'aria-current="page"' : ""}>CLASSIC</a>`;
    document.body.appendChild(mt);

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);

    const sw = bar.querySelector(".theme-switch");
    const paintKnob = () => { sw.querySelector(".knob").innerHTML = root.dataset.theme === "dark" ? moonIcon : sunIcon; };
    paintKnob();
    sw.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
      paintKnob();
    });
    setTheme(root.dataset.theme, false);

    startClock();
  };

  function startClock() {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: S.timezone });
    const tick = () => document.querySelectorAll("[data-clock]").forEach((el) => (el.textContent = `KL ${fmt.format(new Date())}`));
    tick();
    setInterval(tick, 15000);
  }

  window.toast = function (msg) {
    const t = document.querySelector(".toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 1800);
  };

  // Click email/phone: copy it as well as opening the app
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-copy]");
    if (!a) return;
    const val = a.getAttribute("data-copy");
    if (navigator.clipboard) navigator.clipboard.writeText(val).then(() => window.toast("Copied " + val)).catch(() => {});
  });

  // On Stage role filter (works in the Classic page and in the Explore panel)
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".stage-filters [data-filter]");
    if (!b) return;
    const sec = b.closest(".sec");
    const f = b.dataset.filter;
    sec.querySelectorAll(".stage-filters .chip-btn").forEach((x) => x.classList.toggle("on", x === b));
    sec.querySelectorAll(".ticket[data-role]").forEach((t) => { t.hidden = f !== "All" && t.dataset.role !== f; });
  });

  // ---------- Scroll reveals ----------
  window.observeReveals = function (scope) {
    const els = (scope || document).querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { root: scope && scope.closest ? scope.closest("[data-scroll-root]") : null, threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  };
})();
