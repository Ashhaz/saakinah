import * as THREE from 'three';

export interface SceneInput {
  canvas: HTMLCanvasElement;
  hue: number;
  isHome: boolean;
  reduce: boolean;
  getMouse: () => { x: number; y: number };
  getScroll: () => number; // 0..1
}
export interface SceneHandle { setHue(h: number): void; dispose(): void }

function glowTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, 'rgba(255,255,255,.55)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function starShape(R: number, ratio: number): THREE.Shape {
  const s = new THREE.Shape(), pts = 16, rr = R * ratio;
  for (let k = 0; k < pts; k++) {
    const a = (k / pts) * Math.PI * 2 - Math.PI / 2, rad = k % 2 === 0 ? R : rr;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    if (k === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath(); return s;
}

export function createScene(o: SceneInput): SceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch { return null; }
  const lowPower = window.innerWidth < 700;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.setClearColor(0x060914, 1);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060914, 0.012);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
  camera.position.set(0, 0, 34);

  const theme = new THREE.Color().setHSL(o.hue / 360, 0.78, 0.68);
  const targetTheme = theme.clone();
  const gold = new THREE.Color(0xecd28f);
  const dot = glowTex();

  const N = lowPower ? 900 : 2200;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 25 + Math.random() * 120, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7; pos[i * 3 + 2] = r * Math.cos(ph) - 20;
    const m = Math.random();
    const c = (m < 0.55 ? new THREE.Color(0xffffff) : m < 0.8 ? theme.clone() : gold.clone()).multiplyScalar(0.5 + Math.random() * 0.7);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const starMat = new THREE.PointsMaterial({ size: lowPower ? 1.3 : 1.05, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95 });
  const stars = new THREE.Points(sg, starMat);
  scene.add(stars);

  const emblem = new THREE.Group();
  const R = 9, ratio = 0.7654;
  const geo = new THREE.ExtrudeGeometry(starShape(R, ratio), { depth: 1.4, bevelEnabled: false });
  geo.translate(0, 0, -0.7);
  const edgeMat = new THREE.LineBasicMaterial({ color: theme, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
  const fillMat = new THREE.MeshBasicMaterial({ color: theme, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide });
  emblem.add(new THREE.Mesh(geo, fillMat), new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.ExtrudeGeometry(starShape(R * 0.62, ratio), { depth: 0.6, bevelEnabled: false })),
    new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }));
  inner.rotation.z = Math.PI / 8; emblem.add(inner);
  const coreMat = new THREE.SpriteMaterial({ map: dot, color: theme, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  const core = new THREE.Sprite(coreMat); core.scale.set(7, 7, 1); emblem.add(core);
  const RN = 160, rp = new Float32Array(RN * 3);
  for (let j = 0; j < RN; j++) { const a2 = (j / RN) * Math.PI * 2; rp[j * 3] = Math.cos(a2) * 15; rp[j * 3 + 1] = Math.sin(a2) * 15; rp[j * 3 + 2] = (Math.random() - 0.5) * 1.2; }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const ring = new THREE.Points(rg, new THREE.PointsMaterial({ size: 0.9, map: dot, color: gold, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 }));
  emblem.add(ring); scene.add(emblem);

  const auroraOffsets = [0, 40, -40];
  const auroras = ([[-30, 14, -60], [34, -16, -70], [0, 30, -90]] as number[][]).map((p, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: new THREE.Color().setHSL(((o.hue + auroraOffsets[i] + 360) % 360) / 360, 0.7, 0.45), transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.set(p[0], p[1], p[2]); s.scale.set(90, 90, 1); scene.add(s); return s;
  });

  const shootMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
  const shoot = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-6, 3, 0)]), shootMat);
  scene.add(shoot); let shootT = -1, nextShoot = 3;

  let isHome = o.isHome;
  const layout = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const wide = w > 980;
    emblem.position.set(wide ? 17 : 0, wide ? 3 : 9, wide ? -4 : -22);
    emblem.scale.setScalar(wide ? (isHome ? 1.15 : 0.95) : 0.8);
  };
  layout(); window.addEventListener('resize', layout);

  const t0 = performance.now(); let camX = 0, camY = 0, running = true, raf = 0, hueNow = o.hue;
  let hueTarget = o.hue;
  const frame = (now: number) => {
    const t = (now - t0) / 1000, m = o.getMouse(), sp = o.getScroll();
    // ease the theme colour towards the new page hue
    if (Math.abs(hueTarget - hueNow) > 0.3) {
      let d = ((hueTarget - hueNow + 540) % 360) - 180; hueNow = (hueNow + d * 0.06 + 360) % 360;
      targetTheme.setHSL(hueNow / 360, 0.78, 0.68);
      theme.copy(targetTheme);
      edgeMat.color.copy(theme); fillMat.color.copy(theme); coreMat.color.copy(theme);
      auroras.forEach((s, i) => (s.material as THREE.SpriteMaterial).color.setHSL(((hueNow + auroraOffsets[i] + 360) % 360) / 360, 0.7, 0.45));
    }
    camX += (m.x * 2.6 - camX) * 0.04; camY += (-m.y * 1.6 - camY) * 0.04;
    camera.position.x = camX; camera.position.y = camY - sp * 10; camera.lookAt(0, -sp * 10, 0);
    stars.rotation.y = t * 0.012 + sp * 0.5; stars.rotation.x = Math.sin(t * 0.05) * 0.05;
    emblem.rotation.z = t * 0.07 + sp * 1.6; emblem.rotation.y = Math.sin(t * 0.25) * 0.35 + m.x * 0.25; emblem.rotation.x = Math.cos(t * 0.2) * 0.2 - m.y * 0.2;
    inner.rotation.z = Math.PI / 8 - t * 0.14; ring.rotation.z = t * 0.12;
    coreMat.opacity = 0.65 + Math.sin(t * 1.4) * 0.2;
    auroras.forEach((s, q) => { s.position.x += Math.sin(t * 0.1 + q) * 0.01; (s.material as THREE.SpriteMaterial).opacity = 0.14 + Math.sin(t * 0.3 + q * 2) * 0.05; });
    starMat.opacity = 0.85 + Math.sin(t * 0.8) * 0.1;
    if (shootT < 0 && t > nextShoot) { shootT = 0; shoot.position.set(-30 + Math.random() * 40, 18 + Math.random() * 8, -20); }
    if (shootT >= 0) {
      shootT += 0.016; shoot.position.x += 1.1; shoot.position.y -= 0.55;
      shootMat.opacity = Math.max(0, Math.sin(Math.min(1, shootT / 0.9) * Math.PI)) * 0.9;
      if (shootT > 0.9) { shootT = -1; nextShoot = t + 5 + Math.random() * 7; shootMat.opacity = 0; }
    }
    renderer.render(scene, camera);
  };
  const onVis = () => { running = !document.hidden; };
  if (o.reduce) frame(performance.now());
  else {
    const loop = (now: number) => { if (running) frame(now); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVis);
  }
  return {
    setHue(h: number) { hueTarget = h; if (o.reduce) { hueNow = h; targetTheme.setHSL(h / 360, 0.78, 0.68); theme.copy(targetTheme); edgeMat.color.copy(theme); fillMat.color.copy(theme); coreMat.color.copy(theme); frame(performance.now()); } },
    dispose() {
      cancelAnimationFrame(raf); window.removeEventListener('resize', layout); document.removeEventListener('visibilitychange', onVis);
      renderer.dispose(); geo.dispose(); sg.dispose(); rg.dispose(); dot.dispose();
    },
  };
}
