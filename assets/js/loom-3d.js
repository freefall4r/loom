/* ============================================================================
   LOOM — loom-3d.js
   Depth & motion layer: a real 3D woven-thread hero (Three.js via CDN),
   cursor-tilt cards, and scroll parallax. All progressive enhancement —
   if Three.js or WebGL is unavailable, the static art + CSS still look great.
   Honors prefers-reduced-motion everywhere.
   ========================================================================== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------------------------------------------------------------------
     1. Cursor-tilt — any [data-tilt] gets a subtle 3D parallax tilt.
        Optional [data-tilt-max] (deg, default 7). Children with
        [data-tilt-layer] float by their depth for a parallax-within feel.
     ------------------------------------------------------------------- */
  function initTilt() {
    if (reduceMotion || isTouch) return;
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.dataset.tiltMax || '7');
      const layers = el.querySelectorAll('[data-tilt-layer]');
      let raf = null, tx = 0, ty = 0;

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        tx = px; ty = py;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      const apply = () => {
        raf = null;
        el.style.transform =
          `perspective(1100px) rotateX(${(-ty * max).toFixed(2)}deg) rotateY(${(tx * max).toFixed(2)}deg)`;
        layers.forEach((l) => {
          const d = parseFloat(l.dataset.tiltLayer || '0');
          l.style.transform = `translate3d(${(tx * d * 22).toFixed(1)}px, ${(ty * d * 22).toFixed(1)}px, 0)`;
        });
      };
      const reset = () => {
        if (raf) cancelAnimationFrame(raf), (raf = null);
        el.style.transform = 'perspective(1100px) rotateX(0) rotateY(0)';
        layers.forEach((l) => (l.style.transform = 'translate3d(0,0,0)'));
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', reset);
    });
  }

  /* ---------------------------------------------------------------------
     2. Scroll parallax — [data-parallax="0.15"] drifts vertically with
        scroll (positive = slower/float up). rAF-throttled.
     ------------------------------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    const items = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
      el, speed: parseFloat(el.dataset.parallax || '0.12'),
    }));
    if (!items.length) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const off = (mid - vh / 2) * it.speed;       // distance from viewport center
        it.el.style.setProperty('--py', `${(-off).toFixed(1)}px`);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------------------------
     3. Three.js woven-thread hero — floating warp & weft threads in 3D,
        warm-lit, slowly drifting, gently following the cursor.
        Mounts into <canvas id="loom-three">. Lazy-loads Three from CDN.
     ------------------------------------------------------------------- */
  async function initThree() {
    const canvas = document.getElementById('loom-three');
    if (!canvas) return;

    // WebGL support check — if none, leave canvas hidden, art remains.
    try {
      const test = document.createElement('canvas');
      if (!(test.getContext('webgl') || test.getContext('experimental-webgl'))) return;
    } catch { return; }

    // Load three.js as a classic (non-module) script from a LOCAL file so the
    // 3D hero works even when the page is opened directly via file:// (double-click),
    // where ES-module imports and CDN fetches are blocked by the browser.
    let THREE = window.THREE;
    if (!THREE) {
      try {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'assets/js/three.min.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
        THREE = window.THREE;
      } catch (e) {
        return; // graceful: static hero stands on its own.
      }
    }
    if (!THREE) return;

    const wrap = canvas.parentElement;
    const palette = [0xC75B39, 0x1F4E4A, 0xB8884B, 0xD9743F, 0x2E6660];

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    const group = new THREE.Group();
    scene.add(group);

    // Lights — warm key + cool rim + soft fill, for that woven-gold glow.
    scene.add(new THREE.AmbientLight(0xfff3e0, 0.75));
    const key = new THREE.DirectionalLight(0xffd9a8, 1.5); key.position.set(4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd6cf, 0.7); rim.position.set(-6, -2, 4); scene.add(rim);

    // Build the weave: warp (vertical) + weft (horizontal) threads, slightly
    // offset in depth so they cross over/under like real fabric.
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const COLS = 9, ROWS = 6, GAP = 1.35;
    const threads = [];
    const mkMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.15 });

    for (let i = 0; i < COLS; i++) {
      const m = new THREE.Mesh(geo, mkMat(palette[i % palette.length]));
      m.scale.set(0.10, ROWS * GAP + 1.5, 0.10);
      m.position.set((i - (COLS - 1) / 2) * GAP, 0, (i % 2 ? 0.18 : -0.18));
      threads.push({ m, base: m.position.z, ph: i * 0.7 });
      group.add(m);
    }
    for (let j = 0; j < ROWS; j++) {
      const m = new THREE.Mesh(geo, mkMat(palette[(j + 2) % palette.length]));
      m.scale.set(COLS * GAP + 1.5, 0.10, 0.10);
      m.position.set(0, (j - (ROWS - 1) / 2) * GAP, (j % 2 ? -0.18 : 0.18));
      threads.push({ m, base: m.position.z, ph: j * 0.9 + 3 });
      group.add(m);
    }

    group.rotation.x = -0.18;
    group.scale.setScalar(0.92);

    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // Cursor follow (eased)
    let mx = 0, my = 0, cx = 0, cy = 0;
    if (!isTouch) {
      window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5);
        my = (e.clientY / window.innerHeight - 0.5);
      }, { passive: true });
    }

    let t = 0, running = true;
    const render = () => renderer.render(scene, camera);

    if (reduceMotion) { resize(); render(); return; } // single static frame

    const loop = () => {
      if (!running) return;
      requestAnimationFrame(loop);
      t += 0.006;
      cx += (mx - cx) * 0.04;
      cy += (my - cy) * 0.04;
      group.rotation.y = Math.sin(t * 0.5) * 0.25 + cx * 0.6;
      group.rotation.x = -0.18 + cy * 0.35 + Math.sin(t * 0.4) * 0.04;
      // gentle breathing of the weave depth
      for (const th of threads) th.m.position.z = th.base + Math.sin(t * 1.4 + th.ph) * 0.12;
      render();
    };
    loop();

    // Pause when the hero scrolls out of view (saves battery/CPU).
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting && !running) { running = true; loop(); }
          else if (!en.isIntersecting) running = false;
        });
      }, { threshold: 0.01 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) running = false;
      else if (!running) { running = true; loop(); }
    });
  }

  const start = () => { initTilt(); initParallax(); initThree(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
