/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* Hero background: a night drive into the city, drawn with three.js. */
import * as THREE from "./assets/vendor/three.module.min.js";

const canvas = document.getElementById("scene");
const host = canvas && canvas.parentElement;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = matchMedia("(max-width: 859px)").matches;

function supported() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

if (canvas && supported()) start();

function windowsTexture(seed) {
  const c = document.createElement("canvas");
  c.width = 64; c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#050607";
  g.fillRect(0, 0, 64, 128);
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let y = 4; y < 124; y += 6) {
    for (let x = 4; x < 60; x += 6) {
      const r = rnd();
      if (r > 0.62) {
        g.fillStyle = r > 0.95 ? "#9ff5c4" : r > 0.8 ? "#ffd9a0" : "#e8eef5";
        g.globalAlpha = 0.35 + rnd() * 0.65;
        g.fillRect(x, y, 3, 3);
      }
    }
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  return t;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,.55)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020403, 0.0105);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
  camera.position.set(0, 3.2, 8);

  const LENGTH = 260;     // depth of the loop
  const SPEED = 22;       // metres per second

  // Road and ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, LENGTH * 2), new THREE.MeshBasicMaterial({ color: 0x030504 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -LENGTH / 2;
  scene.add(ground);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14, LENGTH * 2), new THREE.MeshBasicMaterial({ color: 0x0b0d0c }));
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.01, -LENGTH / 2);
  scene.add(road);

  // Mint edge lines
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x3ddc84 });
  [-7, 7].forEach((x) => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, LENGTH * 2), edgeMat);
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(x, 0.02, -LENGTH / 2);
    scene.add(edge);
  });

  // Lane dashes
  const dashCount = 60;
  const dashes = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.14, 2.4), new THREE.MeshBasicMaterial({ color: 0xbfbfbf }), dashCount * 2);
  const dashZ = [];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < dashCount; i++) dashZ.push(-i * (LENGTH / dashCount));
  scene.add(dashes);

  // Buildings: a few window textures, towers taller towards the centre like a city skyline.
  const textures = [1, 7, 13, 21, 34].map(windowsTexture);
  const box = new THREE.BoxGeometry(1, 1, 1);
  box.translate(0, 0.5, 0);
  const towers = [];
  const towerCount = small ? 70 : 120;
  for (let i = 0; i < towerCount; i++) {
    const side = i % 2 ? 1 : -1;
    const tall = Math.random() < 0.12;
    const w = 4 + Math.random() * 7;
    const d = 4 + Math.random() * 7;
    const h = tall ? 40 + Math.random() * 55 : 8 + Math.random() * 26;
    const tex = textures[i % textures.length].clone();
    tex.needsUpdate = true;
    tex.repeat.set(Math.max(1, Math.round(w / 4)), Math.max(1, Math.round(h / 8)));
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff });
    const mesh = new THREE.Mesh(box, mat);
    mesh.scale.set(w, h, d);
    mesh.position.set(side * (12 + Math.random() * 30), 0, -Math.random() * LENGTH);
    if (tall) {
      // A lit crown on the tall ones.
      const crown = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.012, 1.02), new THREE.MeshBasicMaterial({ color: i % 3 ? 0xffffff : 0x3ddc84 }));
      crown.position.y = 0.995;
      mesh.add(crown);
    }
    scene.add(mesh);
    towers.push(mesh);
  }

  // Far skyline silhouette on the horizon.
  for (let i = 0; i < 26; i++) {
    const h = 30 + Math.random() * 80;
    const sky = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ map: textures[i % 5], color: 0x7a8580 }));
    sky.scale.set(6 + Math.random() * 8, h, 6);
    sky.position.set(-90 + i * 7 + Math.random() * 4, 0, -LENGTH - 20 - Math.random() * 30);
    scene.add(sky);
  }

  // Cars: oncoming headlights on the left, tail lights ahead on the right, one mint car leading.
  const glow = glowTexture();
  const makeLights = (color, size) => {
    const mat = new THREE.SpriteMaterial({ map: glow, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    const group = new THREE.Group();
    [-0.75, 0.75].forEach((x) => {
      const s = new THREE.Sprite(mat);
      s.scale.set(size, size, 1);
      s.position.x = x;
      group.add(s);
    });
    group.position.y = 0.7;
    return group;
  };
  const cars = [];
  const carCount = small ? 10 : 18;
  for (let i = 0; i < carCount; i++) {
    const oncoming = i % 2 === 0;
    const g = makeLights(oncoming ? 0xfff4e0 : 0xff3a30, oncoming ? 1.6 : 0.9);
    g.position.set(oncoming ? -3.4 : 3.4, 0.7, -Math.random() * LENGTH);
    g.userData = { v: oncoming ? 30 + Math.random() * 12 : -(4 + Math.random() * 6) };
    scene.add(g);
    cars.push(g);
  }
  const lead = makeLights(0x3ddc84, 1.3);
  lead.position.set(1.8, 0.7, -16);
  scene.add(lead);

  // Street lamps
  const lampMat = new THREE.SpriteMaterial({ map: glow, color: 0xffe2b0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 });
  const lamps = [];
  for (let i = 0; i < 24; i++) {
    const s = new THREE.Sprite(lampMat);
    s.scale.set(2.4, 2.4, 1);
    s.position.set(i % 2 ? 8.6 : -8.6, 6.5, -i * (LENGTH / 24));
    scene.add(s);
    lamps.push(s);
  }

  let pointerX = 0, pointerY = 0, scrollFade = 0;
  window.addEventListener("pointermove", (e) => {
    pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener("scroll", () => {
    scrollFade = Math.min(window.scrollY / (host.clientHeight || 1), 1);
  }, { passive: true });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 70 : 58;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(host);

  // Everything drifts towards the camera; past it, it goes back to the far end.
  const wrap = (z) => (z > 12 ? z - LENGTH : z);
  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible && !still) loop(performance.now()); }).observe(host);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !still) loop(performance.now()); });

  let last = 0, running = false, time = 0;
  function frame(dt) {
    time += dt;
    const move = SPEED * dt;
    for (let i = 0; i < dashCount; i++) {
      dashZ[i] = wrap(dashZ[i] + move);
      m.compose(new THREE.Vector3(-2.2, 0.03, dashZ[i]), q, one);
      dashes.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(2.2, 0.03, dashZ[i]), q, one);
      dashes.setMatrixAt(i + dashCount, m);
    }
    dashes.instanceMatrix.needsUpdate = true;
    towers.forEach((t) => { t.position.z = wrap(t.position.z + move); });
    lamps.forEach((l) => { l.position.z = wrap(l.position.z + move); });
    cars.forEach((c) => { c.position.z = wrap(c.position.z + move + c.userData.v * dt); });
    lead.position.x = 1.8 + Math.sin(time * 0.35) * 0.25;

    camera.position.x += (pointerX * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (3.2 - pointerY * 0.6 + scrollFade * 5 - camera.position.y) * 0.05;
    camera.lookAt(camera.position.x * 0.3, 2.4 + scrollFade * 2, -40);
    renderer.render(scene, camera);
  }

  function loop(now) {
    if (running) return;
    running = true;
    last = now;
    const tick = (t) => {
      if (!visible || document.hidden) { running = false; return; }
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      frame(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  frame(0);
  if (!still) loop(performance.now());
  host.classList.add("ready");
}
