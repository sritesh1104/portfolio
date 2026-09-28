/*
  Explore version: a procedurally built 3D model of Sritesh's desk.
  Units are metres. Back wall sits at z = 0, the viewer looks toward -z.
  Every clickable object carries userData.section, which maps to a
  renderer in sections.js.
*/
(async function () {
  const S = window.SITE;
  const X = window.Sections;
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.renderChrome("explore");

  // Intro text
  document.querySelector(".intro .kicker").textContent = S.intro.kicker;
  document.querySelector(".intro-name").innerHTML = `${X.esc(S.first)} ${X.esc(S.last)}`;

  // ---------- Loader counter ----------
  let shown = 0, target = 0;
  const numEl = $("loader-num");
  const setProgress = (p) => (target = Math.max(target, p));
  (function count() {
    shown += (target - shown) * 0.12;
    if (target - shown < 0.5) shown = target;
    numEl.textContent = Math.round(shown);
    if (shown < 100) requestAnimationFrame(count);
  })();
  const finishLoader = () => { setProgress(100); setTimeout(() => $("loader").classList.add("done"), 450); };
  const fail = () => { $("loader").classList.add("done"); $("fallback").hidden = false; };

  // ---------- Load three.js ----------
  let THREE, RoomEnvironment;
  try {
    THREE = await import("three");
    setProgress(35);
    ({ RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js"));
    setProgress(50);
  } catch (e) { console.error(e); fail(); return; }

  try { await Promise.all([document.fonts.load("80px Anton"), document.fonts.load("60px 'Kaushan Script'"), document.fonts.load("600 30px Poppins")]); } catch (e) {}
  setProgress(60);

  // ---------- Renderer / scene / camera ----------
  const canvas = $("scene");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) { console.error(e); fail(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.02, 30);

  // ---------- Helpers ----------
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...o });
  const shadowed = (m, cast = true, recv = true) => { m.castShadow = cast; m.receiveShadow = recv; return m; };
  function box(w, h, d, material, x, y, z, parent = scene) {
    const m = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material));
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function cyl(rt, rb, h, material, x, y, z, parent = scene, seg = 32) {
    const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material));
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  const ORANGE = "#f28c18";

  // Clickable groups, keyed by section
  const hot = {};
  function hotGroup(section, label) {
    const g = new THREE.Group();
    g.userData.section = section;
    g.userData.label = label;
    scene.add(g);
    hot[section] = g;
    return g;
  }

  // ---------- Room shell ----------
  const ROOM_W = 2.6, ROOM_H = 2.5, ROOM_D = 3.2;
  const wallMat = mat("#ece6d9", { roughness: 0.95 });

  const floorTex = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = "#6b5140"; g.fillRect(0, 0, w, h);
    const plank = h / 8;
    for (let i = 0; i < 8; i++) {
      const shade = 90 + Math.random() * 25;
      g.fillStyle = `rgb(${shade + 20},${shade - 5},${shade - 30})`;
      g.fillRect(0, i * plank + 2, w, plank - 4);
      g.strokeStyle = "rgba(0,0,0,.08)";
      for (let k = 0; k < 14; k++) {
        g.beginPath();
        const y = i * plank + Math.random() * plank;
        g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 6, w * .6, y - 6, w, y + 3); g.stroke();
      }
      g.fillStyle = "rgba(0,0,0,.35)";
      g.fillRect(((i * 373) % w), i * plank, 3, plank);
    }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(2, 2);
  const floor = shadowed(new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), mat("#ffffff", { map: floorTex, roughness: 0.6 })), false, true);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, ROOM_D / 2);
  scene.add(floor);

  const back = shadowed(new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat), false, true);
  back.position.set(0, ROOM_H / 2, 0);
  scene.add(back);

  const left = shadowed(new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat), false, true);
  left.rotation.y = Math.PI / 2;
  left.position.set(-ROOM_W / 2, ROOM_H / 2, ROOM_D / 2);
  scene.add(left);

  const right = shadowed(new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat), false, true);
  right.rotation.y = -Math.PI / 2;
  right.position.set(ROOM_W / 2, ROOM_H / 2, ROOM_D / 2);
  scene.add(right);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), mat("#f4f1ea", { roughness: 1 }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, ROOM_H, ROOM_D / 2);
  scene.add(ceil);

  // Skirting
  box(ROOM_W, 0.07, 0.012, mat("#ffffff"), 0, 0.035, 0.006);

  // Ceiling light panels
  const ceilingPanelMat = mat("#ffffff", { emissive: "#fff6e6", emissiveIntensity: 2 });
  [[-0.4, 1.1], [0.55, 1.1]].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.01, 0.28), ceilingPanelMat);
    p.position.set(x, ROOM_H - 0.005, z);
    scene.add(p);
  });

  // Door on the left wall
  const doorMat = mat("#f3f0ea", { roughness: 0.6 });
  box(0.04, 2.05, 0.86, doorMat, -ROOM_W / 2 + 0.02, 1.025, 1.9);
  box(0.02, 2.12, 0.96, mat("#ffffff"), -ROOM_W / 2 + 0.01, 1.06, 1.9);
  [0.55, 1.1, 1.65].forEach((y) => box(0.005, 0.004, 0.8, mat("#d9d4ca"), -ROOM_W / 2 + 0.043, y, 1.9));
  const handle = mat("#b8b8b8", { metalness: 1, roughness: 0.3 });
  box(0.06, 0.02, 0.14, handle, -ROOM_W / 2 + 0.07, 1.0, 1.58);

  // Window + blind on the right wall
  const windowGlow = mat("#dfe9f5", { emissive: "#dfe9f5", emissiveIntensity: 0.6 });
  box(0.01, 1.1, 0.8, windowGlow, ROOM_W / 2 - 0.005, 1.55, 2.25);
  box(0.03, 1.18, 0.88, mat("#ffffff"), ROOM_W / 2 - 0.012, 1.55, 2.25).material.side = THREE.DoubleSide;
  const blindTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#d8c9a3"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(120,100,60,.35)"; g.lineWidth = 3;
    for (let y = 16; y < h; y += 32) for (let x = 16; x < w; x += 32) { g.beginPath(); g.roundRect(x - 10, y - 8, 20, 16, 6); g.stroke(); }
  });
  box(0.02, 0.9, 0.82, mat("#ffffff", { map: blindTex, roughness: 0.9 }), ROOM_W / 2 - 0.04, 1.68, 2.25);
  box(0.05, 0.05, 0.9, mat("#c9a646", { metalness: 0.6, roughness: 0.4 }), ROOM_W / 2 - 0.04, 2.15, 2.25);

  // Striped football scarf (plain stripes, no crest)
  const scarfTex = canvasTex(64, 512, (g, w, h) => {
    const cols = ["#1d3f8f", "#a8123e"];
    for (let i = 0; i < 16; i++) { g.fillStyle = cols[i % 2]; g.fillRect(0, i * (h / 16), w, h / 16); }
    g.fillStyle = "#e8b43a"; for (let i = 1; i < 16; i += 2) g.fillRect(0, i * (h / 16), w, 3);
  });
  box(0.012, 0.8, 0.14, mat("#ffffff", { map: scarfTex, roughness: 1 }), ROOM_W / 2 - 0.02, 1.45, 1.62);

  setProgress(68);

  // ---------- Desk ----------
  const DESK_Y = 0.75, DESK_X0 = -0.95, DESK_X1 = ROOM_W / 2, DESK_D = 0.72;
  const DESK_W = DESK_X1 - DESK_X0, DESK_CX = (DESK_X0 + DESK_X1) / 2;
  const white = mat("#fbfbf8", { roughness: 0.45 });
  box(DESK_W, 0.04, DESK_D, white, DESK_CX, DESK_Y - 0.02, DESK_D / 2);
  box(0.04, DESK_Y - 0.04, DESK_D - 0.04, white, DESK_X0 + 0.02, (DESK_Y - 0.04) / 2, DESK_D / 2);
  box(DESK_W - 0.1, 0.18, 0.02, white, DESK_CX, DESK_Y - 0.13, 0.08);

  // Desk mat with a subtle dotted world map feel
  const matTex = canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = "#1c1d1f"; g.fillRect(0, 0, w, h);
    const blobs = [[.18, .35, .12, .16], [.28, .68, .06, .14], [.5, .3, .08, .1], [.52, .6, .07, .16], [.7, .35, .16, .14], [.82, .72, .06, .06]];
    g.fillStyle = "rgba(255,255,255,.16)";
    for (let y = 8; y < h; y += 10) for (let x = 8; x < w; x += 10) {
      const inside = blobs.some(([bx, by, rx, ry]) => ((x / w - bx) / rx) ** 2 + ((y / h - by) / ry) ** 2 < 1);
      if (inside) { g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2); g.fill(); }
    }
    g.strokeStyle = "rgba(255,255,255,.05)";
    for (let x = 0; x < w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  });
  const deskMat = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.004, 0.5), mat("#ffffff", { map: matTex, roughness: 0.95 })), false, true);
  deskMat.position.set(0.05, DESK_Y + 0.002, 0.38);
  scene.add(deskMat);

  // ---------- Screens (textures) ----------
  function screenWork(g, w, h) {
    g.fillStyle = "#101114"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#1b1d22"; g.fillRect(0, 0, w, 44);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(26 + i * 24, 22, 7, 0, 7); g.fill(); });
    g.fillStyle = "#fff"; g.font = "118px Anton"; g.fillText("WORK HISTORY", 48, 186);
    g.save(); g.translate(560, 232); g.rotate(-0.08); g.fillStyle = ORANGE; g.font = "54px 'Kaushan Script'"; g.fillText("the journey", 0, 0); g.restore();
    S.work.forEach((wk, i) => {
      const y = 300 + i * 66;
      g.strokeStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.moveTo(48, y - 44); g.lineTo(w - 48, y - 44); g.stroke();
      g.fillStyle = "#fff"; g.font = "600 28px Poppins"; g.fillText(wk.org, 48, y);
      g.fillStyle = "#8d8d8d"; g.font = "22px Poppins"; g.fillText(wk.period, w - 48 - g.measureText(wk.period).width, y);
    });
  }
  function screenProjects(g, w, h) {
    // Same layout language as the monitor: big title, orange script, bold readable list
    g.fillStyle = "#101114"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#fff"; g.font = "132px Anton"; g.fillText("PROJECTS", 44, 160);
    g.save(); g.translate(430, 208); g.rotate(-0.08); g.fillStyle = ORANGE; g.font = "58px 'Kaushan Script'"; g.fillText("things I built", 0, 0); g.restore();
    const rows = Math.ceil(S.projects.length / 2);
    S.projects.forEach((p, i) => {
      const col = Math.floor(i / rows), row = i % rows;
      const x = 44 + col * (w / 2), y = 300 + row * 68;
      g.fillStyle = ORANGE; g.font = "600 26px Poppins"; g.fillText(String(i + 1).padStart(2, "0"), x, y);
      g.fillStyle = "#fff"; g.font = "600 32px Poppins"; g.fillText(p.title, x + 50, y);
    });
  }
  function screenPhone(g, w, h) {
    const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, "#1a1a1a"); grd.addColorStop(1, "#2a1606");
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    g.fillStyle = "#fff"; g.font = "600 22px Poppins"; g.fillText(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: S.timezone }).format(new Date()), w / 2 - 30, 60);
    g.font = "92px Anton"; g.fillText("LET'S", 40, 260); g.fillText("TALK", 40, 350);
    [["#27c93f", "Call"], ["#f28c18", "Email"], ["#0a66c2", "LinkedIn"], ["#ffffff", "GitHub"]].forEach(([c, t], i) => {
      const x = 44 + (i % 2) * 120, y = 500 + Math.floor(i / 2) * 120;
      g.fillStyle = c; g.beginPath(); g.roundRect(x, y, 80, 80, 20); g.fill();
      g.fillStyle = "#ddd"; g.font = "18px Poppins"; g.fillText(t, x, y + 104);
    });
  }

  // Screens are unlit (they glow on their own), so no glare from room lights
  const screenMat = (tex) => new THREE.MeshBasicMaterial({ map: tex });
  const darkPlastic = mat("#17181a", { roughness: 0.4 });
  const greyMetal = mat("#9ea3a8", { metalness: 0.8, roughness: 0.35 });

  // Monitor -> Work History
  const monitor = hotGroup("work", "Work History");
  box(0.64, 0.38, 0.025, darkPlastic, 0, 1.08, 0.16, monitor);
  const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.61, 0.345), screenMat(canvasTex(1280, 724, screenWork)));
  monScreen.position.set(0, 1.085, 0.1731);
  monitor.add(monScreen);
  box(0.05, 0.22, 0.03, darkPlastic, 0, 0.87, 0.13, monitor);
  box(0.24, 0.012, 0.16, darkPlastic, 0, DESK_Y + 0.006, 0.15, monitor);

  // Laptop on a stand -> Projects
  const laptop = hotGroup("projects", "Projects");
  laptop.position.set(0.66, DESK_Y, 0.26);
  const stand = box(0.28, 0.008, 0.24, greyMetal, 0, 0.07, 0, laptop); stand.rotation.x = 0.28;
  box(0.02, 0.1, 0.02, greyMetal, -0.1, 0.04, -0.07, laptop);
  box(0.02, 0.1, 0.02, greyMetal, 0.1, 0.04, -0.07, laptop);
  const base = box(0.34, 0.016, 0.24, mat("#2b2d31", { roughness: 0.5 }), 0, 0.085, 0.005, laptop); base.rotation.x = 0.28;
  const kbTex = canvasTex(512, 360, (g, w, h) => {
    g.fillStyle = "#2b2d31"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#1a1b1e";
    for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) g.fillRect(24 + c * 33, 24 + r * 33, 28, 28);
    g.fillStyle = "#222428"; g.fillRect(170, 240, 170, 100);
  });
  const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.23), mat("#ffffff", { map: kbTex, roughness: 0.6 }));
  kb.rotation.x = -Math.PI / 2 + 0.28; kb.position.set(0, 0.094, 0.006); laptop.add(kb);
  const lid = new THREE.Group(); lid.position.set(0, 0.12, -0.107); lid.rotation.x = -0.18; laptop.add(lid);
  box(0.34, 0.23, 0.012, mat("#2b2d31", { roughness: 0.5 }), 0, 0.115, 0, lid);
  const lapScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.2), screenMat(canvasTex(1024, 640, screenProjects)));
  lapScreen.position.set(0, 0.118, 0.0065); lid.add(lapScreen);

  // Mechanical keyboard (decor)
  const kbd = new THREE.Group(); kbd.position.set(-0.02, DESK_Y + 0.006, 0.45); kbd.rotation.x = 0.04; scene.add(kbd);
  box(0.36, 0.025, 0.12, mat("#3a3d42", { roughness: 0.5 }), 0, 0.012, 0, kbd);
  const capGeo = new THREE.BoxGeometry(0.019, 0.012, 0.019);
  const caps = new THREE.InstancedMesh(capGeo, mat("#ffffff", { roughness: 0.55 }), 15 * 5);
  const cream = new THREE.Color("#efe6d2"), orangeC = new THREE.Color("#e8672b"), greyC = new THREE.Color("#7c8087");
  const m4 = new THREE.Matrix4(); let ci = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) {
    m4.makeTranslation(-0.154 + c * 0.022, 0.03, -0.045 + r * 0.0225);
    caps.setMatrixAt(ci, m4);
    const edge = c === 0 || c === 14 || r === 4;
    caps.setColorAt(ci, (r === 4 && c > 4 && c < 10) || (c === 14 && r === 0) || (c === 0 && r === 2) ? orangeC : edge ? greyC : cream);
    ci++;
  }
  caps.castShadow = true; kbd.add(caps);

  // Mouse
  const mouseM = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.035, 24, 16), mat("#1b1c1e", { roughness: 0.35 })));
  mouseM.scale.set(0.9, 0.45, 1.4); mouseM.position.set(0.3, DESK_Y + 0.012, 0.46); scene.add(mouseM);
  const mouseGlow = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.002, 0.03), mat("#22ff88", { emissive: "#22ff88", emissiveIntensity: 1.5 }));
  mouseGlow.position.set(0.3, DESK_Y + 0.029, 0.44); scene.add(mouseGlow);


  // Phone on a stand -> Contact
  const phone = hotGroup("contact", "Contact");
  phone.position.set(-0.46, DESK_Y + 0.004, 0.32);
  box(0.09, 0.008, 0.08, greyMetal, 0, 0.004, 0, phone);
  const arm = box(0.03, 0.12, 0.008, greyMetal, 0, 0.06, -0.02, phone); arm.rotation.x = -0.25;
  const phoneBody = new THREE.Group(); phoneBody.position.set(0, 0.125, 0.0); phoneBody.rotation.x = -0.25; phone.add(phoneBody);
  box(0.078, 0.16, 0.009, mat("#c9a27a", { metalness: 0.6, roughness: 0.35 }), 0, 0, 0, phoneBody);
  const phScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.15), screenMat(canvasTex(360, 780, screenPhone)));
  phScreen.position.set(0, 0, 0.0047); phoneBody.add(phScreen);


  // Galaxy ball on a stand (decor)
  const ballTex = canvasTex(512, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, "#2a1b4a"); grd.addColorStop(.5, "#7a3a6e"); grd.addColorStop(1, "#1b2350");
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .8})`; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
    g.strokeStyle = "rgba(0,0,0,.55)"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    g.beginPath(); g.moveTo(w / 4, 0); g.lineTo(w / 4, h); g.moveTo(w * .75, 0); g.lineTo(w * .75, h); g.stroke();
  });
  cyl(0.05, 0.06, 0.04, mat("#b88a5a"), 1.08, DESK_Y + 0.02, 0.24);
  const ball = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.115, 40, 28), mat("#ffffff", { map: ballTex, roughness: 0.45 })));
  ball.position.set(1.08, DESK_Y + 0.155, 0.24); ball.rotation.set(0.3, 0.6, 0.2); scene.add(ball);

  // Notebooks + pens (decor)
  box(0.16, 0.02, 0.22, mat("#1f4fa8"), 1.02, DESK_Y + 0.01, 0.55).rotation.y = 0.1;
  box(0.15, 0.018, 0.21, mat("#e9e3d3"), 1.03, DESK_Y + 0.029, 0.55).rotation.y = 0.05;
  box(0.14, 0.012, 0.012, mat(ORANGE), 1.0, DESK_Y + 0.044, 0.5).rotation.y = 0.6;

  setProgress(78);

  // ---------- Shelf ----------
  const SHELF_Y = 1.3, SHELF_D = 0.22;
  box(DESK_W - 0.1, 0.035, SHELF_D, white, DESK_CX + 0.05, SHELF_Y, SHELF_D / 2);
  // Warm LED strip under the shelf (glows in dark mode)
  const ledMat = mat("#ffb35c", { emissive: "#ffb35c", emissiveIntensity: 0 });
  box(DESK_W - 0.2, 0.006, 0.01, ledMat, DESK_CX + 0.05, SHELF_Y - 0.021, 0.2);

  const gold = mat("#d4a531", { metalness: 1, roughness: 0.28 });
  const silver = mat("#c9ced4", { metalness: 1, roughness: 0.25 });
  const bronze = mat("#b8733a", { metalness: 1, roughness: 0.3 });
  const TOP = SHELF_Y + 0.0175;

  // Trophies (part of Sports)
  const sports = hotGroup("sports", "Sports & Achievements");
  const awardsG = hotGroup("awards", "Awards");
  const cupProfile = [[0, 0], [0.018, 0], [0.012, 0.02], [0.01, 0.05], [0.03, 0.07], [0.042, 0.11], [0.044, 0.14], [0.04, 0.14], [0.036, 0.11], [0.026, 0.08], [0, 0.075]].map(([x, y]) => new THREE.Vector2(x, y));
  const cupGeo = new THREE.LatheGeometry(cupProfile, 32);
  [[-0.8, 1.0], [-0.68, 1.25], [-0.56, 0.9], [-0.44, 1.15]].forEach(([x, s], i) => {
    const t = new THREE.Group(); t.position.set(x, TOP, 0.1 + (i % 2) * 0.03); t.scale.setScalar(s); sports.add(t);
    box(0.07, 0.05, 0.07, mat(i % 2 ? "#1d1d1d" : "#e9e4da", { roughness: 0.3 }), 0, 0.025, 0, t);
    cyl(0.008, 0.008, 0.08, gold, 0, 0.09, 0, t, 12);
    const cup = shadowed(new THREE.Mesh(cupGeo, gold)); cup.position.y = 0.12; t.add(cup);
    if (i === 1) { const star = shadowed(new THREE.Mesh(new THREE.OctahedronGeometry(0.025), gold)); star.position.y = 0.3; t.add(star); }
  });

  // Blue sports car built from toy bricks (decor), right end of the shelf, clear of the Awards frame (x 0.52 to 0.88).
  // Front of the car points toward +x. Low and wide, sloped screen, rear wing, white racing stripes.
  const car = new THREE.Group(); car.position.set(1.07, TOP, 0.11); car.rotation.y = -0.45; scene.add(car);
  const brickBlue = mat("#1f5fd1", { roughness: 0.3 });
  const brickDark = mat("#123a8c", { roughness: 0.35 });
  const brickWhite = mat("#f4f4f2", { roughness: 0.35 });
  const tyre = mat("#161616", { roughness: 0.7 });
  const rim = mat("#c9ced4", { metalness: 0.7, roughness: 0.3 });
  const glassM = mat("#1c2a3a", { roughness: 0.08, metalness: 0.4 });
  box(0.2, 0.01, 0.084, brickDark, 0, 0.016, 0, car);                 // chassis plate
  box(0.2, 0.024, 0.084, brickBlue, 0, 0.033, 0, car);                // main body, low and wide
  box(0.05, 0.012, 0.084, brickBlue, 0.075, 0.051, 0, car);           // front hood
  const nose = box(0.03, 0.02, 0.084, brickBlue, 0.1, 0.032, 0, car); nose.rotation.z = -0.35; // wedge nose
  box(0.06, 0.02, 0.07, brickBlue, -0.02, 0.055, 0, car);             // low cabin
  const screen = box(0.004, 0.028, 0.066, glassM, 0.016, 0.058, 0, car); screen.rotation.z = -1.0; // raked windscreen
  box(0.004, 0.018, 0.066, glassM, -0.05, 0.057, 0, car).rotation.z = 0.6; // rear glass
  box(0.004, 0.014, 0.001, glassM, -0.02, 0.058, 0.0355, car);         // side windows
  box(0.004, 0.014, 0.001, glassM, -0.02, 0.058, -0.0355, car);
  // Racing stripes over hood, roof and tail
  [-0.009, 0.009].forEach((z) => {
    box(0.05, 0.0015, 0.008, brickWhite, 0.075, 0.058, z, car);
    box(0.06, 0.0015, 0.008, brickWhite, -0.02, 0.0655, z, car);
    box(0.045, 0.0015, 0.008, brickWhite, -0.078, 0.0458, z, car);
  });
  // Rear wing on two posts
  box(0.006, 0.02, 0.006, brickDark, -0.088, 0.055, -0.026, car);
  box(0.006, 0.02, 0.006, brickDark, -0.088, 0.055, 0.026, car);
  box(0.022, 0.005, 0.09, brickBlue, -0.09, 0.067, 0, car);
  box(0.022, 0.0015, 0.018, brickWhite, -0.09, 0.0703, 0, car);
  // Lights and side intakes
  box(0.004, 0.006, 0.02, mat("#ffe9a8", { emissive: "#ffe9a8", emissiveIntensity: 0.4 }), 0.112, 0.036, -0.028, car);
  box(0.004, 0.006, 0.02, mat("#ffe9a8", { emissive: "#ffe9a8", emissiveIntensity: 0.4 }), 0.112, 0.036, 0.028, car);
  box(0.003, 0.008, 0.07, mat("#c8342b", { emissive: "#c8342b", emissiveIntensity: 0.2 }), -0.1005, 0.036, 0, car);
  box(0.03, 0.01, 0.002, mat("#0d1b33"), 0.02, 0.033, 0.0425, car);
  box(0.03, 0.01, 0.002, mat("#0d1b33"), 0.02, 0.033, -0.0425, car);
  // A pair of studs on the hood so it still reads as a brick build
  const stud = new THREE.CylinderGeometry(0.006, 0.006, 0.005, 16);
  [[0.075, -0.024], [0.075, 0.024]].forEach(([x, z]) => {
    const s = shadowed(new THREE.Mesh(stud, brickBlue)); s.position.set(x, 0.0595, z); car.add(s);
  });
  // Wide wheels, bigger at the back
  [[0.065, 0.017, 0.016], [-0.06, 0.02, 0.019]].forEach(([x, r, y]) => {
    [-0.045, 0.045].forEach((z) => {
      const wh = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.018, 24), tyre));
      wh.rotation.x = Math.PI / 2; wh.position.set(x, y, z); car.add(wh);
      const rm = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.02, 6), rim);
      rm.rotation.x = Math.PI / 2; rm.position.set(x, y, z); car.add(rm);
    });
  });

  // Shadow boxes of medals
  const ribbonCols = ["#c8342b", "#1f4fa8", "#e8b43a", "#2f6b4f"];
  const medalMats = [gold, silver, bronze];
  const medalGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.006, 28);
  // Three white shadow boxes on the back wall: medals (left), Education (middle), Awards (right)
  const FW = 0.36, FH = 0.42, FD = 0.08;
  function shadowBox(x, parent) {
    const g = new THREE.Group(); g.position.set(x, 1.73, 0); parent.add(g);
    const t = 0.025, frame = mat("#ffffff", { roughness: 0.4 });
    box(FW, t, FD, frame, 0, FH / 2 - t / 2, FD / 2, g);
    box(FW, t, FD, frame, 0, -FH / 2 + t / 2, FD / 2, g);
    box(t, FH, FD, frame, -FW / 2 + t / 2, 0, FD / 2, g);
    box(t, FH, FD, frame, FW / 2 - t / 2, 0, FD / 2, g);
    const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(FW - 0.04, FH - 0.04), new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.02, transmission: 1, transparent: true, opacity: 0.12 }));
    glassPane.position.set(0, 0, FD - 0.002); g.add(glassPane);
    return g;
  }

  // Left: medals -> Sports
  const medalBox = shadowBox(-0.5, sports);
  box(FW - 0.01, FH - 0.01, 0.005, mat("#121212", { roughness: 0.9 }), 0, 0, 0.004, medalBox);
  // "MEDALS" label across the top, same style as the Awards frame
  const medalsLabelTex = canvasTex(420, 80, (g, w, h) => {
    g.fillStyle = "#121212"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#fff"; g.textAlign = "center"; g.font = "64px Anton"; g.fillText("MEDALS", w / 2, 66);
  });
  const medalsLabel = new THREE.Mesh(new THREE.PlaneGeometry(FW - 0.05, (FW - 0.05) * 80 / 420), mat("#ffffff", { map: medalsLabelTex, roughness: 0.9 }));
  medalsLabel.position.set(0, 0.15, 0.0075); medalBox.add(medalsLabel);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const mx = -0.095 + c * 0.095, my = 0.055 - r * 0.093;
    box(0.018, 0.045, 0.003, mat(ribbonCols[(r + c) % 4], { roughness: 0.8 }), mx, my + 0.035, 0.01, medalBox);
    const md = shadowed(new THREE.Mesh(medalGeo, medalMats[(r * 3 + c) % 3 === 0 ? 0 : c % 3]));
    md.rotation.x = Math.PI / 2; md.position.set(mx, my, 0.014); medalBox.add(md);
  }

  // Middle: degree certificate -> Education
  const edu = hotGroup("education", "Education");
  const eduTex = canvasTex(420, 490, (g, w, h) => {
    g.fillStyle = "#fbf7ec"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#c9a646"; g.lineWidth = 6; g.strokeRect(18, 18, w - 36, h - 36);
    g.lineWidth = 1.5; g.strokeRect(30, 30, w - 60, h - 60);
    g.fillStyle = "#1b1b1b"; g.textAlign = "center";
    g.font = "26px Anton"; g.fillText(S.education[0].school.toUpperCase(), w / 2, 92);
    g.font = "58px Anton"; g.fillText("FIRST CLASS", w / 2, 190); g.fillText("HONOURS", w / 2, 252);
    g.fillStyle = ORANGE; g.font = "34px 'Kaushan Script'"; g.fillText("Actuarial Studies", w / 2, 320);
    g.fillStyle = "#c8342b"; g.beginPath(); g.arc(w / 2, 400, 30, 0, 7); g.fill();
  });
  const eduBox = shadowBox(0.1, edu);
  eduBox.add(new THREE.Mesh(new THREE.PlaneGeometry(FW - 0.05, FH - 0.05), mat("#ffffff", { map: eduTex, roughness: 0.7 })));
  eduBox.children[eduBox.children.length - 1].position.z = 0.006;

  // Right: awards -> Awards
  const awardsTex = canvasTex(420, 490, (g, w, h) => {
    g.fillStyle = "#151515"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#fff"; g.textAlign = "center"; g.font = "64px Anton"; g.fillText("AWARDS", w / 2, 96);
    // One star medal on a red ribbon per award, up to 3 per row
    const n = S.awards.length, cols = 3, rows = Math.ceil(n / cols);
    const star = (cx, cy, R, r) => {
      g.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5, rad = k % 2 ? r : R;
        g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      }
      g.closePath();
    };
    S.awards.forEach((a, i) => {
      const row = Math.floor(i / cols), inRow = Math.min(cols, n - row * cols), c = i % cols;
      const x = w / 2 + (c - (inRow - 1) / 2) * 110, y = 190 + row * (285 / Math.max(rows, 1));
      g.fillStyle = "#a51d2d";
      g.beginPath(); g.moveTo(x - 16, y - 58); g.lineTo(x + 16, y - 58); g.lineTo(x + 16, y - 14); g.lineTo(x, y - 4); g.lineTo(x - 16, y - 14); g.closePath(); g.fill();
      g.fillStyle = "#d23a48"; g.fillRect(x - 9, y - 58, 5, 44); g.fillRect(x + 4, y - 58, 5, 44);
      g.fillStyle = "#f5a623"; star(x, y + 10, 26, 11); g.fill();
      g.fillStyle = "#ffd84a"; star(x, y + 10, 13, 6); g.fill();
    });
  });
  const awardBox = shadowBox(0.7, awardsG);
  awardBox.add(new THREE.Mesh(new THREE.PlaneGeometry(FW - 0.05, FH - 0.05), mat("#ffffff", { map: awardsTex, roughness: 0.7 })));
  awardBox.children[awardBox.children.length - 1].position.z = 0.006;

  // Name sign -> About
  const about = hotGroup("about", "About Me");
  const signTex = canvasTex(640, 160, (g, w, h) => {
    g.fillStyle = "#e9d9c4"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#8a5a34"; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = "#3b2414"; g.font = "104px Anton"; g.textAlign = "center"; g.fillText(S.first.toUpperCase(), w / 2, 124);
  });
  box(0.38, 0.095, 0.015, mat("#ffffff", { map: signTex, roughness: 0.6 }), 0.1, 2.06, 0.008, about);

  setProgress(86);

  // ---------- Right wall: stage wall -> On Stage ----------
  // Group sits on the wall; local x runs along the wall (world +z), local z points into the room.
  const stageG = hotGroup("stage", "On Stage");
  const wall = new THREE.Group(); wall.position.set(ROOM_W / 2, 0, 0); wall.rotation.y = -Math.PI / 2; stageG.add(wall);

  // Framed "ON STAGE" poster with a microphone
  const posterTex = canvasTex(420, 580, (g, w, h) => {
    g.fillStyle = "#151515"; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(242,140,24,.18)"; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w * 0.1, h); g.lineTo(w * 0.9, h); g.closePath(); g.fill(); // spotlight
    // microphone
    g.fillStyle = "#d9d9d9"; g.beginPath(); g.ellipse(w / 2, 150, 46, 58, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#8f8f8f"; g.lineWidth = 3;
    for (let k = -40; k <= 40; k += 13) { g.beginPath(); g.moveTo(w / 2 + k, 100); g.lineTo(w / 2 + k, 200); g.stroke(); }
    g.fillStyle = "#2b2b2b"; g.fillRect(w / 2 - 20, 200, 40, 26);
    g.fillStyle = "#1c1c1c"; g.beginPath(); g.moveTo(w / 2 - 16, 226); g.lineTo(w / 2 + 16, 226); g.lineTo(w / 2 + 10, 330); g.lineTo(w / 2 - 10, 330); g.closePath(); g.fill();
    g.fillStyle = "#fff"; g.textAlign = "center"; g.font = "96px Anton"; g.fillText("ON", w / 2, 440); g.fillText("STAGE", w / 2, 530);
    g.save(); g.translate(w / 2 + 40, 560); g.rotate(-0.08); g.fillStyle = ORANGE; g.font = "36px 'Kaushan Script'"; g.fillText("behind the mic", 0, 0); g.restore();
  });
  box(0.34, 0.46, 0.02, mat("#1b1b1b", { roughness: 0.5 }), 0.4, 1.58, 0.01, wall);
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.42), mat("#ffffff", { map: posterTex, roughness: 0.8 }));
  poster.position.set(0.4, 1.58, 0.021); wall.add(poster);

  // Lanyard rail with event badges
  box(0.56, 0.02, 0.03, mat("#6b4a2d", { roughness: 0.6 }), 0.9, 2.0, 0.015, wall);
  const badgeTex = (role, col) => canvasTex(256, 360, (g, w, h) => {
    g.fillStyle = "#fbfbf8"; g.fillRect(0, 0, w, h);
    g.fillStyle = col; g.fillRect(0, 0, w, 96);
    g.fillStyle = "#fbfbf8"; g.beginPath(); g.roundRect(w / 2 - 34, 22, 68, 16, 8); g.fill(); // slot
    g.fillStyle = "#111"; g.textAlign = "center"; g.font = role.length > 6 ? "58px Anton" : "72px Anton"; g.fillText(role, w / 2, 200);
    g.fillStyle = "#777"; g.font = "600 22px Poppins"; g.fillText("ALL ACCESS", w / 2, 250);
    g.fillStyle = "#111"; g.font = "600 24px Poppins"; g.fillText(S.first.toUpperCase(), w / 2, 320);
  });
  [["EMCEE", ORANGE, "#f28c18"], ["PANEL", "#111111", "#2b2b2b"], ["BUSINESS", "#1f5fd1", "#1f5fd1"]].forEach(([role, band, strap], i) => {
    const x = 0.72 + i * 0.18, sway = [-0.04, 0.03, -0.02][i];
    const L = new THREE.Group(); L.position.set(x, 1.99, 0.03); L.rotation.z = sway; wall.add(L);
    const strapM = mat(strap, { roughness: 0.8 });
    const s1 = box(0.012, 0.26, 0.003, strapM, -0.028, -0.13, 0, L); s1.rotation.z = -0.1;
    const s2 = box(0.012, 0.26, 0.003, strapM, 0.028, -0.13, 0, L); s2.rotation.z = 0.1;
    box(0.02, 0.02, 0.006, greyMetal, 0, -0.27, 0.001, L); // clip
    const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.14), mat("#ffffff", { map: badgeTex(role, band), roughness: 0.4 }));
    badge.position.set(0, -0.35, 0.004); L.add(badge);
    const back = box(0.104, 0.144, 0.003, mat("#dcdcdc"), 0, -0.35, 0.001, L); back.castShadow = true;
  });

  // Row of polaroids from the photo wall (falls back to a plain card if a photo can't load)
  const texLoader = new THREE.TextureLoader(); texLoader.setCrossOrigin("anonymous");
  const photos = (S.stage.gallery || []).slice(0, 3);
  [0, 1, 2].forEach((i) => {
    const x = 0.72 + i * 0.18, y = 1.32 + (i % 2) * 0.02, rot = [0.06, -0.04, 0.05][i];
    const P = new THREE.Group(); P.position.set(x, y, 0.004); P.rotation.z = rot; wall.add(P);
    box(0.15, 0.175, 0.004, mat("#fffdf6", { roughness: 0.8 }), 0, 0, 0, P);
    const phMat = mat("#3a3a3a", { roughness: 0.8 });
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.13), phMat);
    ph.position.set(0, 0.012, 0.0025); P.add(ph);
    if (photos[i]) texLoader.load(photos[i], (t) => { t.colorSpace = THREE.SRGBColorSpace; phMat.map = t; phMat.color.set("#ffffff"); phMat.needsUpdate = true; }, undefined, () => {});
  });

  // ---------- Left wall: pinboard -> Community ----------
  const community = hotGroup("community", "Community Projects");
  const corkTex = canvasTex(900, 600, (g, w, h) => {
    g.fillStyle = "#b9875a"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? "70,40,15" : "240,210,170"},${Math.random() * .35})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    const notes = [
      { x: 60, y: 60, c: "#fffdf6", r: -0.05, t: "COACH", s: "basketball" },
      { x: 330, y: 50, c: "#ffe58a", r: 0.04, t: "MATHS", s: "gift of tomorrow" },
      { x: 600, y: 80, c: "#ffc58a", r: -0.03, t: "GIVE BACK", s: "2 homes" }
    ];
    notes.forEach((n) => {
      g.save(); g.translate(n.x + 110, n.y + 110); g.rotate(n.r);
      g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-106, -100, 230, 230);
      g.fillStyle = n.c; g.fillRect(-115, -110, 230, 230);
      g.fillStyle = "#1a1a1a"; g.font = "50px Anton"; g.textAlign = "center"; g.fillText(n.t, 0, 0);
      g.fillStyle = "#d8430b"; g.font = "30px 'Kaushan Script'"; g.fillText(n.s, 0, 56);
      g.fillStyle = "#d8430b"; g.beginPath(); g.arc(0, -92, 12, 0, 7); g.fill();
      g.restore();
    });
    // polaroids
    [[120, 360, 0.06], [420, 380, -0.05], [700, 370, 0.03]].forEach(([x, y, r], i) => {
      g.save(); g.translate(x + 70, y + 80); g.rotate(r);
      g.fillStyle = "#fafafa"; g.fillRect(-80, -90, 160, 190);
      const grd = g.createLinearGradient(-70, -80, 70, 60);
      grd.addColorStop(0, ["#f28c18", "#1f4fa8", "#2f6b4f"][i]); grd.addColorStop(1, "#222");
      g.fillStyle = grd; g.fillRect(-68, -78, 136, 136);
      g.fillStyle = "#333"; g.font = "22px 'Kaushan Script'"; g.textAlign = "center"; g.fillText(["team day", "class of '23", "thank you!"][i], 0, 90);
      g.restore();
    });
  });
  const pb = new THREE.Group(); pb.position.set(-ROOM_W / 2, 1.38, 0.62); pb.rotation.y = Math.PI / 2; community.add(pb);
  box(0.86, 0.6, 0.03, mat("#6b4a2d", { roughness: 0.7 }), 0, 0, 0.015, pb);
  const cork = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.54), mat("#ffffff", { map: corkTex, roughness: 0.95 }));
  cork.position.z = 0.031; pb.add(cork);
  // Mini basketball clipped to the corner of the board (for the coaching note)
  const bballTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = "#e0661f"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * .12})`; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
    g.strokeStyle = "#2a1408"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    [w / 4, w * 3 / 4].forEach((x) => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); });
    [0, w / 2].forEach((x) => { g.beginPath(); g.ellipse(x + w / 4, h / 2, w / 7, h / 2, 0, 0, Math.PI * 2); g.stroke(); });
  });
  const bball = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.035, 28, 20), mat("#ffffff", { map: bballTex, roughness: 0.8 })));
  bball.position.set(0.37, -0.23, 0.065); bball.rotation.set(0.4, 0.8, 0.2); pb.add(bball);

  setProgress(92);

  // ---------- Lights ----------
  const hemi = new THREE.HemisphereLight("#fffaf0", "#8a7a68", 1.4);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#fff4e0", 2.2);
  sun.position.set(0.6, 2.4, 2.6);
  sun.target.position.set(0.1, 0.9, 0.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.2, near: 0.5, far: 6 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  // Warm night light, hidden under the shelf (no visible lamp on the desk)
  const lampLight = new THREE.PointLight("#ffb866", 0.2, 3.2, 2); lampLight.position.set(-0.45, SHELF_Y - 0.1, 0.25);
  const monLight = new THREE.PointLight("#cfe0ff", 0.1, 1.6, 2); monLight.position.set(0, 1.08, 0.4);
  const lapLight = new THREE.PointLight("#cfe0ff", 0.05, 1.2, 2); lapLight.position.set(0.66, 0.98, 0.45);
  const shelfLight = new THREE.PointLight("#ffac55", 0, 1.8, 2); shelfLight.position.set(0.1, SHELF_Y - 0.08, 0.3);
  scene.add(lampLight, monLight, lapLight, shelfLight);

  const THEMES = {
    light: { bg: "#e8e1d3", hemi: 0.75, sun: 1.9, lamp: 0.15, mon: 0.1, lap: 0.05, shelf: 0, ceilEm: 2, lampEm: 0.1, led: 0, env: 0.35, screen: 1.0, window: 0.6, exposure: 0.85 },
    dark: { bg: "#0b0b0c", hemi: 0.04, sun: 0, lamp: 1.1, mon: 0.9, lap: 0.45, shelf: 0.9, ceilEm: 0, lampEm: 1.4, led: 2.2, env: 0.06, screen: 0.8, window: 0.05, exposure: 1.15 }
  };
  const L = { ...THEMES[document.documentElement.dataset.theme === "dark" ? "dark" : "light"] };
  const bgColor = new THREE.Color(L.bg);
  const screens = [monScreen, lapScreen, phScreen];
  function applyLights() {
    hemi.intensity = L.hemi; sun.intensity = L.sun; lampLight.intensity = L.lamp; monLight.intensity = L.mon; lapLight.intensity = L.lap; shelfLight.intensity = L.shelf;
    ceilingPanelMat.emissiveIntensity = L.ceilEm; ledMat.emissiveIntensity = L.led;
    scene.environmentIntensity = L.env; windowGlow.emissiveIntensity = L.window;
    screens.forEach((s) => s.material.color.setScalar(L.screen));
    renderer.toneMappingExposure = L.exposure;
    scene.background = bgColor;
  }
  applyLights();
  window.addEventListener("themechange", (e) => {
    const to = THEMES[e.detail === "dark" ? "dark" : "light"];
    const { bg, ...nums } = to;
    const c = new THREE.Color(bg);
    if (window.gsap && !reduceMotion) {
      gsap.to(L, { ...nums, duration: 1.1, ease: "power2.inOut", onUpdate: applyLights });
      gsap.to(bgColor, { r: c.r, g: c.g, b: c.b, duration: 1.1, ease: "power2.inOut" });
    } else { Object.assign(L, nums); bgColor.copy(c); applyLights(); }
  });

  // ---------- Camera presets ----------
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function homeView() {
    const a = window.innerWidth / window.innerHeight;
    if (a < 0.8) return { pos: V(0.1, 1.45, 3.7), tgt: V(0.05, 1.25, 0.3), fov: 64 };
    if (a < 1.25) return { pos: V(0.1, 1.5, 3.2), tgt: V(0.08, 1.2, 0.2), fov: 56 };
    return { pos: V(0.15, 1.5, 2.75), tgt: V(0.1, 1.2, 0.2), fov: 50 };
  }
  const FOCUS = {
    about: { pos: V(0.1, 1.85, 1.45), tgt: V(0.1, 1.8, 0) },
    work: { pos: V(0, 1.12, 1.22), tgt: V(0, 1.05, 0.16) },
    projects: { pos: V(0.58, 1.14, 1.05), tgt: V(0.66, 0.96, 0.18) },
    sports: { pos: V(-0.55, 1.58, 1.25), tgt: V(-0.58, 1.52, 0) },
    education: { pos: V(0.1, 1.74, 0.95), tgt: V(0.1, 1.72, 0) },
    awards: { pos: V(0.7, 1.74, 0.95), tgt: V(0.7, 1.72, 0) },
    community: { pos: V(0.2, 1.4, 0.62), tgt: V(-1.3, 1.38, 0.62) },
    stage: { pos: V(-0.25, 1.62, 0.78), tgt: V(1.3, 1.6, 0.78) },
    contact: { pos: V(-0.44, 1.04, 0.84), tgt: V(-0.46, 0.88, 0.3) }
  };
  const ORDER = ["about", "work", "projects", "education", "awards", "community", "stage", "sports", "contact"];
  const ANCHORS = {
    about: V(0.1, 2.12, 0.02),
    work: V(0.25, 1.22, 0.18),
    projects: V(0.66, 1.1, 0.2),
    sports: V(-0.33, 1.95, 0.06),
    education: V(0.27, 1.95, 0.06),
    awards: V(0.87, 1.95, 0.06),
    community: V(-1.28, 1.62, 0.4),
    stage: V(1.28, 1.86, 0.4), // top of the ON STAGE poster
    contact: V(-0.46, 0.98, 0.33)
  };

  const home = homeView();
  const cam = { pos: home.pos.clone(), tgt: home.tgt.clone(), fov: home.fov, shift: 0, shiftTarget: 0 };
  camera.position.copy(cam.pos);
  camera.fov = cam.fov;
  camera.updateProjectionMatrix();

  // ---------- Hotspots + section index ----------
  const hsWrap = $("hotspots");
  const idx = $("section-index");
  const hsEls = {};
  ORDER.forEach((key, i) => {
    const label = hot[key].userData.label;
    const b = document.createElement("button");
    b.className = "hotspot"; b.type = "button";
    b.innerHTML = `<span class="ring"></span><span class="lbl">${label}</span>`;
    b.setAttribute("aria-label", `Open ${label}`);
    b.addEventListener("click", () => focusOn(key));
    b.addEventListener("mouseenter", () => setHover(key));
    b.addEventListener("mouseleave", () => setHover(null));
    hsWrap.appendChild(b);
    hsEls[key] = b;

    const li = document.createElement("button");
    li.type = "button";
    li.dataset.key = key;
    li.innerHTML = `<span class="n">${String(i + 1).padStart(2, "0")}</span>${label}`;
    li.addEventListener("click", () => focusOn(key));
    li.addEventListener("mouseenter", () => setHover(key));
    li.addEventListener("mouseleave", () => setHover(null));
    idx.appendChild(li);
  });

  // ---------- Hover highlight ----------
  const accent = new THREE.Color(ORANGE);
  const hoverState = {};
  ORDER.forEach((k) => {
    hoverState[k] = { v: 0 };
    hot[k].traverse((o) => {
      if (o.isMesh && o.material && !screens.includes(o)) {
        o.material = o.material.clone();
        o.userData.baseEmissive = o.material.emissive ? o.material.emissive.clone() : null;
        o.userData.baseEmissiveI = o.material.emissiveIntensity ?? 1;
      }
    });
  });
  let hovered = null;
  function setHover(key) {
    if (hovered === key) return;
    hovered = key;
    document.body.style.cursor = key && !focused ? "pointer" : "";
    ORDER.forEach((k) => {
      const on = k === key && !focused;
      hsEls[k].classList.toggle("hover", on);
      idx.querySelector(`[data-key="${k}"]`).classList.toggle("hover", on);
      if (window.gsap) gsap.to(hoverState[k], { v: on ? 1 : 0, duration: 0.3, onUpdate: () => paintHover(k) });
      else { hoverState[k].v = on ? 1 : 0; paintHover(k); }
    });
  }
  function paintHover(k) {
    const v = hoverState[k].v;
    hot[k].traverse((o) => {
      if (!o.isMesh || !o.userData.baseEmissive) return;
      o.material.emissive.copy(o.userData.baseEmissive).lerp(accent, v);
      o.material.emissiveIntensity = o.userData.baseEmissiveI + v * 0.35;
    });
  }

  // ---------- Raycasting ----------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(2, 2);
  const pointer = { x: 0, y: 0 };
  const hotList = ORDER.map((k) => hot[k]);
  function pick() {
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(scene.children, true)[0];
    if (!hit) return null;
    let o = hit.object;
    while (o && !o.userData.section) o = o.parent;
    return o && hotList.includes(o) ? o.userData.section : null;
  }
  canvas.addEventListener("pointermove", (e) => {
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    pointer.x = ndc.x; pointer.y = ndc.y;
    if (!focused && e.pointerType === "mouse") setHover(pick());
  });
  canvas.addEventListener("pointerleave", () => setHover(null));
  canvas.addEventListener("click", (e) => {
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    if (focused) { closePanel(); return; }
    const k = pick();
    if (k) focusOn(k);
  });

  // ---------- Focus / panel ----------
  const panel = $("panel"), panelBody = $("panel-body");
  let focused = null;
  const panelShift = () => (window.innerWidth > 760 ? Math.min(680, window.innerWidth) : 0);

  function tweenCam(pos, tgt, shift, dur) {
    if (window.gsap && !reduceMotion) {
      gsap.to(cam.pos, { x: pos.x, y: pos.y, z: pos.z, duration: dur, ease: "power3.inOut" });
      gsap.to(cam.tgt, { x: tgt.x, y: tgt.y, z: tgt.z, duration: dur, ease: "power3.inOut" });
    } else { cam.pos.copy(pos); cam.tgt.copy(tgt); cam.shift = shift; }
    cam.shiftTarget = shift;
  }

  function focusOn(key) {
    if (!FOCUS[key]) return;
    focused = key;
    setHover(null);
    document.body.classList.add("focused");
    const f = FOCUS[key];
    tweenCam(f.pos, f.tgt, panelShift(), 1.3);
    panelBody.innerHTML = X[key](true);
    panel.scrollTop = 0;
    setTimeout(() => {
      panel.classList.add("open");
      panel.setAttribute("aria-hidden", "false");
      panel.focus({ preventScroll: true });
      window.observeReveals(panelBody);
    }, reduceMotion ? 0 : 450);
    try { history.replaceState(null, "", "#" + key); } catch (e) {}
  }
  function closePanel() {
    if (!focused) return;
    const last = focused;
    focused = null;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("focused");
    const h = homeView();
    tweenCam(h.pos, h.tgt, 0, 1.2);
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    const btn = idx.querySelector(`[data-key="${last}"]`);
    if (btn) btn.focus({ preventScroll: true });
  }
  $("panel-close").addEventListener("click", closePanel);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });

  // ---------- Resize ----------
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    const hv = homeView();
    cam.fov = hv.fov;
    if (!focused) { cam.pos.copy(hv.pos); cam.tgt.copy(hv.tgt); }
    else cam.shiftTarget = panelShift();
  }
  window.addEventListener("resize", resize);

  // ---------- Loop ----------
  const look = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const par = { x: 0, y: 0 };
  function frame(t) {
    // Gentle parallax on the home view
    const k = focused ? 0.25 : 1;
    par.x += (pointer.x * 0.12 * k - par.x) * 0.05;
    par.y += (pointer.y * 0.06 * k - par.y) * 0.05;
    camera.position.set(cam.pos.x + par.x, cam.pos.y + par.y, cam.pos.z);
    look.copy(cam.tgt);
    camera.lookAt(look);
    if (camera.fov !== cam.fov) camera.fov = cam.fov;
    const w = window.innerWidth, h = window.innerHeight;
    cam.shift += (cam.shiftTarget - cam.shift) * (reduceMotion ? 1 : 0.07);
    // When the panel is open, render a wider virtual frame and show its right part,
    // so the focused object sits in the middle of the space left of the panel.
    camera.aspect = (w + cam.shift) / h;
    if (cam.shift > 0.5) camera.setViewOffset(w + cam.shift, h, cam.shift, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();

    ball.rotation.y = t * 0.00015;

    renderer.render(scene, camera);

    // Position hotspot markers
    if (!focused) {
      ORDER.forEach((key) => {
        tmp.copy(ANCHORS[key]).project(camera);
        const el = hsEls[key];
        const visible = tmp.z < 1 && Math.abs(tmp.x) < 1.02 && Math.abs(tmp.y) < 1.02;
        el.classList.toggle("hidden", !visible);
        el.style.transform = `translate(${((tmp.x + 1) / 2) * w - 9}px, ${((1 - tmp.y) / 2) * h - 9}px)`;
      });
    }
    requestAnimationFrame(frame);
  }

  setProgress(98);
  renderer.compile(scene, camera);
  requestAnimationFrame(frame);
  finishLoader();

  // Deep link: index.html#projects opens that section
  const deep = location.hash.slice(1);
  if (FOCUS[deep]) setTimeout(() => focusOn(deep), 900);
})();
