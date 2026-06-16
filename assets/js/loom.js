/* ============================================================================
   LOOM — loom.js   (vanilla, no dependencies)
   On DOMContentLoaded:
     (a) hero woven-thread canvas animation (#loom-canvas)
     (b) IntersectionObserver scroll-reveal for .reveal
     (c) mobile nav toggle (.nav__toggle  ->  .nav__links.open)
     (d) current year in [data-year]
   Motion is disabled under prefers-reduced-motion: reduce.
   ========================================================================== */

(function () {
  "use strict";

  // Honour the user's motion preference (read once; canvas + reveal respect it).
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    initNavToggle();
    initReveal();
    initLoomCanvas();
  });

  /* ------------------------------------------------------------------------
     (d) Current year — fills every <span data-year> / [data-year]
     ---------------------------------------------------------------------- */
  function setYear() {
    var year = String(new Date().getFullYear());
    var nodes = document.querySelectorAll("[data-year]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = year;
    }
  }

  /* ------------------------------------------------------------------------
     (c) Mobile nav toggle
     ---------------------------------------------------------------------- */
  function initNavToggle() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the menu after tapping a link (single-page-feel on mobile).
    links.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.tagName === "A" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close on Escape for keyboard users.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     (b) Scroll reveal — adds .is-in once, then stops observing
     ---------------------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    // No IO support, or reduced motion: just show everything.
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("is-in");
      return;
    }

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ------------------------------------------------------------------------
     (a) Hero woven-thread canvas animation
         Warp (vertical) + weft (horizontal) threads that drift gently and
         cross over/under, in the brand colours over the parchment.
         Low-CPU: few threads, requestAnimationFrame, paused off-screen.
     ---------------------------------------------------------------------- */
  function initLoomCanvas() {
    var canvas = document.getElementById("loom-canvas");
    if (!canvas) return; // skip gracefully when no hero canvas

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var COLORS = {
      thread: "#C75B39", // terracotta — warp
      thread2: "#1F4E4A", // teal — weft
      gold: "#B8884B", // gold highlight
      paper: "#F7F2E9"
    };

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;       // CSS pixel size
    var warps = [];         // vertical threads
    var wefts = [];         // horizontal threads
    var raf = null;
    var running = false;

    // ---- responsive sizing (devicePixelRatio aware) --------------------
    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(rect.width, 1);
      H = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
      buildThreads();
    }

    // ---- build the warp & weft sets, spaced across the canvas ----------
    function buildThreads() {
      warps = [];
      wefts = [];

      // Thread count scales gently with size; kept low for performance.
      var area = Math.sqrt(W * H);
      var nWarp = Math.max(5, Math.min(11, Math.round(W / 150)));
      var nWeft = Math.max(4, Math.min(9, Math.round(H / 150)));

      var palette = [COLORS.thread, COLORS.thread2, COLORS.gold];

      var i;
      for (i = 0; i < nWarp; i++) {
        var bx = ((i + 0.5) / nWarp) * W;
        warps.push({
          base: bx,
          color: palette[i % palette.length],
          amp: 14 + Math.random() * 26,       // sway amplitude (px)
          freq: 0.7 + Math.random() * 1.1,    // vertical wave frequency
          speed: 0.10 + Math.random() * 0.18, // drift speed
          phase: Math.random() * Math.PI * 2,
          width: 0.9 + Math.random() * 1.4,
          alpha: 0.30 + Math.random() * 0.35
        });
      }
      for (i = 0; i < nWeft; i++) {
        var by = ((i + 0.5) / nWeft) * H;
        wefts.push({
          base: by,
          color: palette[(i + 1) % palette.length],
          amp: 12 + Math.random() * 22,
          freq: 0.7 + Math.random() * 1.0,
          speed: 0.09 + Math.random() * 0.16,
          phase: Math.random() * Math.PI * 2,
          width: 0.9 + Math.random() * 1.4,
          alpha: 0.30 + Math.random() * 0.35
        });
      }
      // silence unused-var lint while keeping `area` available for tuning
      void area;
    }

    // x position of a warp thread at vertical coord y & time t
    function warpX(w, y, t) {
      var u = y / H;
      return (
        w.base +
        Math.sin(u * Math.PI * w.freq + w.phase + t * w.speed) * w.amp +
        Math.sin(u * Math.PI * 2.7 + w.phase * 1.5) * (w.amp * 0.18)
      );
    }
    // y position of a weft thread at horizontal coord x & time t
    function weftY(w, x, t) {
      var u = x / W;
      return (
        w.base +
        Math.sin(u * Math.PI * w.freq + w.phase + t * w.speed) * w.amp +
        Math.sin(u * Math.PI * 2.3 + w.phase * 1.5) * (w.amp * 0.18)
      );
    }

    // ---- draw one curved thread sampled along its length ----------------
    function drawThread(samples, color, width, alpha) {
      ctx.beginPath();
      ctx.moveTo(samples[0].x, samples[0].y);
      for (var i = 1; i < samples.length; i++) {
        // smooth with quadratic midpoints for a soft, fibrous curve
        var prev = samples[i - 1];
        var cur = samples[i];
        var mx = (prev.x + cur.x) / 2;
        var my = (prev.y + cur.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // ---- the over/under intersection dots (the "knot" of the weave) -----
    function drawKnots(t) {
      for (var i = 0; i < warps.length; i++) {
        for (var j = 0; j < wefts.length; j++) {
          var w = warps[i];
          var f = wefts[j];
          var y = f.base;
          var x = w.base;
          // approximate crossing point
          var px = warpX(w, y, t);
          var py = weftY(f, px, t);
          var ax = warpX(w, py, t);
          // over/under decides which colour sits on top
          var over = (i + j) % 2 === 0;
          ctx.beginPath();
          ctx.arc(ax, py, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = over ? COLORS.gold : COLORS.thread2;
          ctx.globalAlpha = 0.5;
          ctx.fill();
          ctx.globalAlpha = 1;
          void x;
        }
      }
    }

    // ---- main render ----------------------------------------------------
    var STEP = 18; // sample spacing in px (coarse = cheaper)
    function render(now) {
      var t = now * 0.001; // seconds
      ctx.clearRect(0, 0, W, H);

      var i, s, samples;

      // Weft (horizontal) threads drawn first — they sit "under".
      for (i = 0; i < wefts.length; i++) {
        samples = [];
        for (s = 0; s <= W; s += STEP) {
          samples.push({ x: s, y: weftY(wefts[i], s, t) });
        }
        samples.push({ x: W, y: weftY(wefts[i], W, t) });
        drawThread(samples, wefts[i].color, wefts[i].width, wefts[i].alpha);
      }

      // Warp (vertical) threads on top — they cross "over".
      for (i = 0; i < warps.length; i++) {
        samples = [];
        for (s = 0; s <= H; s += STEP) {
          samples.push({ x: warpX(warps[i], s, t), y: s });
        }
        samples.push({ x: warpX(warps[i], H, t), y: H });
        drawThread(samples, warps[i].color, warps[i].width, warps[i].alpha);
      }

      // Tiny knots where threads meet.
      drawKnots(t);

      if (running) raf = window.requestAnimationFrame(render);
    }

    // draw a single static frame (used for reduced motion)
    function renderStatic() {
      render(0);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      raf = window.requestAnimationFrame(render);
    }
    function stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = null;
    }

    // ---- lifecycle ------------------------------------------------------
    resize();

    if (reduceMotion) {
      // Respect the preference: one calm, static woven frame, no animation.
      renderStatic();
    } else {
      start();

      // Pause when the hero scrolls out of view (saves CPU/battery).
      if ("IntersectionObserver" in window) {
        var vis = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) start();
              else stop();
            });
          },
          { threshold: 0 }
        );
        vis.observe(canvas);
      }

      // Pause when the tab is hidden.
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else start();
      });
    }

    // Debounced resize keeps it responsive without thrashing.
    var rt = null;
    window.addEventListener("resize", function () {
      if (rt) window.clearTimeout(rt);
      rt = window.setTimeout(function () {
        resize();
        if (reduceMotion) renderStatic();
      }, 150);
    });
  }
})();

/* ============================================================================
   Floating WhatsApp contact — appears on every page (MENA-native lead channel).
   ========================================================================== */
(function () {
  if (document.querySelector(".wa-fab")) return;
  var a = document.createElement("a");
  a.className = "wa-fab";
  a.href = "https://wa.me/962791792129?text=" + encodeURIComponent("Hi LOOM, I'd like to start a project.");
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with LOOM on WhatsApp");
  a.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.516 5.26l-.999 3.648 3.972-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
  a.style.cssText =
    "position:fixed;bottom:20px;inset-inline-end:20px;z-index:60;width:54px;height:54px;border-radius:50%;" +
    "display:flex;align-items:center;justify-content:center;background:#25543B;color:#F7F2E9;" +
    "box-shadow:0 10px 26px -8px rgba(0,0,0,.42);transition:transform .25s ease, background .25s ease;";
  a.addEventListener("mouseenter", function () { a.style.transform = "translateY(-3px) scale(1.05)"; a.style.background = "#1f6b43"; });
  a.addEventListener("mouseleave", function () { a.style.transform = ""; a.style.background = "#25543B"; });
  var add = function () { if (document.body) document.body.appendChild(a); };
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
