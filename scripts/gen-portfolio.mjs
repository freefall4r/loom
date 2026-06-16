// Generates portfolio.html from the credited manifest below.
// Run: ~/.local/node/bin/node scripts/gen-portfolio.mjs
import { writeFileSync } from 'node:fs';

// slug = thumbnail filename (assets/img/portfolio/<slug>.jpg)
// Each site credits the studio/maker who built it (the partners LOOM works with).
const SITES = [
  // ——— Peach Worlds (real-time 3D builder partner) ———
  ['anima-peachworlds-com','Anima','https://anima.peachworlds.com/','Peach Worlds','Real-time 3D · Showcase'],
  ['atom-peachworlds-com','Atom','https://atom.peachworlds.com/','Peach Worlds','Real-time 3D · Showcase'],
  ['bmw-peachworlds-com','BMW','https://bmw.peachworlds.com/','Peach Worlds','Automotive · 3D'],
  ['chaumet-peachworlds-com','Chaumet','https://chaumet.peachworlds.com/','Peach Worlds','Luxury · 3D'],
  ['concept-peachworlds-com','Concept','https://concept.peachworlds.com/','Peach Worlds','Real-time 3D · Showcase'],
  ['drop-peachworlds-com','Drop','https://drop.peachworlds.com/','Peach Worlds','Product · 3D'],
  ['godzilla-peachworlds-com','Godzilla','https://godzilla.peachworlds.com/','Peach Worlds','Entertainment · 3D'],
  ['horizon-peachworlds-com','Horizon','https://horizon.peachworlds.com/','Peach Worlds','Real-time 3D · Showcase'],
  ['jordans-peachworlds-com','Air Jordans','https://jordans.peachworlds.com/','Peach Worlds','Footwear · 3D'],
  ['joyful-84thiv6s-peachworlds-com','Joyful','https://joyful-84thiv6s.peachworlds.com/','Peach Worlds','Brand · 3D'],
  ['missionmars-peachworlds-com','Mission Mars','https://missionmars.peachworlds.com/','Peach Worlds','Space · 3D'],
  ['mongols-peachworlds-com','Mongols','https://mongols.peachworlds.com/','Peach Worlds','Story · 3D'],
  ['nisa-peachworlds-com','Nisa','https://nisa.peachworlds.com/','Peach Worlds','AI · 3D'],
  ['noble-jmdbmzelm-peachworlds-com','Noble','https://noble-jmdbmzelm.peachworlds.com/','Peach Worlds','Brand · 3D'],
  ['nova-peachworlds-com','Nova','https://nova.peachworlds.com/','Peach Worlds','Real-time 3D · Showcase'],
  ['porsche911-peachworlds-com','Porsche 911','https://porsche911.peachworlds.com/','Peach Worlds','Automotive · 3D'],
  ['rapid-whsj6gcz2-staging-peachworlds-com','Rapid','https://rapid-whsj6gcz2.staging.peachworlds.com/','Peach Worlds','Brand · 3D'],
  ['real-pr6mb6t5j4-peachworlds-com','Real','https://real-pr6mb6t5j4.peachworlds.com/','Peach Worlds','Real estate · 3D'],
  ['surge-peachworlds-com','Surge','https://surge.peachworlds.com/','Peach Worlds','Brand · 3D'],
  ['tough-xvzmixkdx-peachworlds-com','Tough','https://tough-xvzmixkdx.peachworlds.com/','Peach Worlds','Brand · 3D'],
  ['peachweb-io-gallery','PeachWeb Gallery','https://peachweb.io/gallery','Peach Worlds','Platform · Gallery'],
  ['ascendmarketing-xyz','Ascend Marketing','https://ascendmarketing.xyz/','Peach Worlds','Marketing · 3D'],
  ['garrizmudze-com','Garriz Mudze','http://garrizmudze.com/','Peach Worlds','Portfolio · 3D'],
  ['kokomo-games','Kokomo','https://kokomo.games/','Peach Worlds','Gaming · 3D'],

  // ——— Fiddle.Digital ———
  ['fiddle-digital','Fiddle.Digital','https://fiddle.digital/','Fiddle.Digital','Studio · WebGL'],
  ['fiddle-digital-work','Fiddle.Digital — Work','https://fiddle.digital/work','Fiddle.Digital','Studio · Showreel'],
  ['string-tune-fiddle-digital','String Tune','https://string-tune.fiddle.digital/','Fiddle.Digital','Web effects · WebGL'],
  ['eyewearjunkie-com','Eyewear Junkie','https://eyewearjunkie.com/','Fiddle.Digital','E-commerce · 3D'],
  ['obsidianassembly-com','Obsidian Assembly','https://obsidianassembly.com/','Fiddle.Digital','Brand · WebGL'],
  ['dispatch-bike','Dispatch','https://www.dispatch.bike/','Fiddle.Digital','E-bike · Product'],
  ['wearekaleida-com','Kaleida','https://wearekaleida.com/','Fiddle.Digital','Agency · WebGL'],
  ['xe-works','Xe','https://xe.works/','Fiddle.Digital','Studio · WebGL'],

  // ——— 60fps ———
  ['60fps-fr','60fps','https://60fps.fr/','60fps','Studio · WebGL'],
  ['configurator-endurosat-com','EnduroSat Configurator','https://configurator.endurosat.com/','60fps','Space · Configurator'],

  // ——— Individual award studios ———
  ['activetheory-net','Active Theory','https://activetheory.net/','Active Theory','Studio · WebGL'],
  ['animejs-com','Anime.js','https://animejs.com/','Julian Garnier','Open source · Motion'],
  ['oryzo-ai','Oryzo','https://oryzo.ai/','Lusion','AI · 3D'],
  ['cornrevolution-resn-global','Corn Revolution','https://cornrevolution.resn.global/','Resn','Campaign · WebGL'],
  ['artprize-shadows-com','Richard Mille Art Prize','https://artprize-shadows.com/','Hervé Studio','Art & culture · 3D'],
  ['cartier-com-en-fr-watchesandwonders','Cartier — Watches & Wonders','https://www.cartier.com/en-fr/watchesandwonders','Immersive Garden','Luxury watches · 3D'],
  ['collabcapitolium-fr','TFC × Capitolium','https://www.collabcapitolium.fr/','Supercolor','Sport & fashion · 3D'],
  ['elvalabs-ai','Elva Labs','https://elvalabs.ai/','Lazarev Agency','AI · Product'],
  ['emons-de','Emons','https://www.emons.de/','BWS','Logistics · 3D'],
  ['farmminerals-com','Farm Minerals','https://www.farmminerals.com/','Adelt','Skincare · Brand'],
  ['forged-build','Forged','https://forged.build/','Forged','Studio · 3D'],
  ['ibex-masters-com','Ibex Masters','https://ibex-masters.com/','Altermind','Corporate · 3D'],
  ['igloo-inc','Igloo Inc','https://www.igloo.inc/','abeto & Bureaux','Web3 brand · 3D'],
  ['magische-spiegelungen-de','Magische Spiegelungen','https://www.magische-spiegelungen.de/','Makemepulse','Museum WebXR · 3D'],
  ['mina-massoud-com','Mina Massoud','https://mina-massoud.com/','Mina Massoud','Portfolio · WebGL'],
  ['persepolis-getty-edu','Persepolis Reimagined','https://persepolis.getty.edu/','Media.Monks','Cultural · 3D'],
  ['poly-app','Poly','https://poly.app/','Unseen Studio','AI SaaS · WebGL'],
  ['shopify-com-editions-winter2026','Shopify Editions — Winter 2026','https://www.shopify.com/editions/winter2026','Shopify Design','Product launch · Scroll'],
  ['springs-estate','Springs Estate','https://springs.estate/','Vide Infra','Real estate · 3D'],
  ['terminal-industries-com','Terminal Industries','https://terminal-industries.com/','Rejouice','Logistics tech · 3D'],
  ['tidescape-framer-ai','Tidescape','https://tidescape.framer.ai/','Ryze Design Studio','Hospitality · Framer'],
  ['toptier-relats-com','Relats TopTier','https://toptier.relats.com/','Firma','Industrial · 3D'],
  ['vertex3d-asia','Vertex3D','https://www.vertex3d.asia/','Vertex3D','Studio · WebGL'],
  ['wacusglobal-com-en','Wacus Global','https://wacusglobal.com/en','Wacus Global','Agency · Web design'],
  ['jdco-website','JDCO','https://www.jdco.website/','LOOM','Industrial B2B · 3D'],
];

const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// unique studios in first-appearance order, for the filter bar
const studios = [...new Set(SITES.map(s => s[3]))];
const studioId = (s) => 'st-' + s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const filterBtns = ['All', ...studios].map((s,i) =>
  `<button class="pf-filter${i===0?' is-active':''}" data-filter="${i===0?'all':studioId(s)}">${esc(s)}${i===0?'':` <span>${SITES.filter(x=>x[3]===s).length}</span>`}</button>`
).join('\n      ');

const cards = SITES.map(([slug,name,url,studio,cat]) => {
  const host = url.replace(/^https?:\/\//,'').replace(/\/$/,'').replace(/\/.*$/,'');
  return `        <a class="pf-card reveal" href="${url}" target="_blank" rel="noopener" data-studio="${studioId(studio)}">
          <div class="pf-card__shot">
            <img src="assets/img/portfolio/${slug}.jpg" loading="lazy" width="1000" height="625" alt="${esc(name)} — site crafted by ${esc(studio)}">
            <span class="pf-card__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </div>
          <div class="pf-card__meta">
            <div class="pf-card__top"><span class="pf-card__name">${esc(name)}</span><span class="pf-card__host">${esc(host)}</span></div>
            <span class="pf-card__cat">${esc(cat)}</span>
            <span class="pf-card__by">Crafted by <strong>${esc(studio)}</strong></span>
          </div>
        </a>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio — LOOM</title>
  <meta name="description" content="A living portfolio of ${SITES.length} sites woven with our partner studios — Peach Worlds, Fiddle.Digital, Active Theory, Lusion and more. The same hands that built these can build yours.">
  <meta name="theme-color" content="#F7F2E9">
  <meta property="og:title" content="LOOM — Portfolio">
  <meta property="og:description" content="${SITES.length} sites woven with our partner studios. Every thread credited.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/img/og.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/loom.css">
  <style>
    .pf-head { text-align: center; }
    .pf-head .lede { margin-inline: auto; max-width: 64ch; }
    .pf-credit-note {
      margin-inline: auto; margin-top: 1.25rem; max-width: 60ch;
      font-size: .92rem; color: var(--ink-soft);
      border-top: 1px solid var(--line); padding-top: 1.1rem;
    }

    /* filter bar */
    .pf-filters {
      display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center;
      margin-top: clamp(1.75rem, 4vw, 2.75rem);
    }
    .pf-filter {
      font: inherit; font-size: .82rem; font-weight: 500; cursor: pointer;
      color: var(--ink-soft); background: var(--paper-card);
      border: 1px solid var(--line); border-radius: 999px;
      padding: .5em 1em; transition: all .25s ease;
    }
    .pf-filter span { opacity: .55; font-variant-numeric: tabular-nums; }
    .pf-filter:hover { color: var(--ink); border-color: var(--ink-soft); }
    .pf-filter.is-active { background: var(--thread); color: var(--paper); border-color: var(--thread); }
    .pf-filter.is-active span { opacity: .8; }

    /* grid */
    .pf-grid {
      margin-top: clamp(1.75rem, 4vw, 2.75rem);
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: clamp(1rem, 2vw, 1.6rem);
    }
    @media (max-width: 900px) { .pf-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 580px) { .pf-grid { grid-template-columns: 1fr; } }

    .pf-card {
      display: flex; flex-direction: column; text-decoration: none; color: inherit;
      border-radius: 14px; overflow: hidden; background: var(--paper-card);
      border: 1px solid rgba(28,24,20,.07); box-shadow: var(--shadow);
      transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease;
    }
    .pf-card:hover { transform: translateY(-5px); box-shadow: 0 22px 48px -20px rgba(28,24,20,.34); }
    .pf-card.is-hidden { display: none; }

    .pf-card__shot { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: #1c1814; }
    .pf-card__shot img {
      width: 100%; height: 100%; object-fit: cover; object-position: top center;
      transition: transform .9s cubic-bezier(.22,1,.36,1);
    }
    .pf-card:hover .pf-card__shot img { transform: scale(1.05); }
    .pf-card__go {
      position: absolute; top: .7rem; inset-inline-end: .7rem; z-index: 2;
      width: 30px; height: 30px; display: grid; place-items: center;
      border-radius: 50%; background: rgba(247,242,233,.92); color: var(--ink);
      opacity: 0; transform: translateY(-4px); transition: all .35s ease;
    }
    .pf-card__go svg { width: 15px; height: 15px; }
    .pf-card:hover .pf-card__go { opacity: 1; transform: translateY(0); }

    .pf-card__meta { padding: .95rem 1.05rem 1.1rem; display: flex; flex-direction: column; gap: .3rem; }
    .pf-card__top { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
    .pf-card__name { font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-size: 1.12rem; line-height: 1.15; }
    .pf-card__host { font-size: .68rem; color: var(--ink-soft); opacity: .7; white-space: nowrap; }
    .pf-card__cat { font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); }
    .pf-card__by { margin-top: .35rem; padding-top: .6rem; border-top: 1px solid var(--line); font-size: .82rem; color: var(--ink-soft); }
    .pf-card__by strong { color: var(--thread); font-weight: 600; }

    .pf-empty { text-align: center; color: var(--ink-soft); margin-top: 2rem; display: none; }
  </style>
</head>
<body>
<header class="nav">
  <div class="nav__inner wrap">
    <a class="nav__logo" href="index.html" aria-label="LOOM home">
      <img src="assets/img/logo.svg" alt="" width="34" height="34">
      <span>LOOM</span>
    </a>
    <button class="nav__toggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <nav class="nav__links" aria-label="Primary">
      <a href="index.html">Home</a>
      <a href="services.html">Capabilities</a>
      <a href="work.html">Work</a>
      <a href="portfolio.html" aria-current="page">Portfolio</a>
      <a href="about.html">Studio</a>
      <a class="btn btn--thread nav__cta" href="about.html#contact">Start a project</a>
    </nav>
  </div>
</header>

<main>
  <section class="section">
    <div class="wrap pf-head reveal">
      <p class="eyebrow">The portfolio</p>
      <h1 class="display">Woven with the best hands on the web</h1>
      <p class="lede">${SITES.length} live sites — award-winning, 3D, immersive — built together with the
        studios and makers we weave alongside. Each one is credited to its creators. These are the
        same hands we put on your project.</p>
      <p class="pf-credit-note">Every site below belongs to and was crafted by the studio named on its card.
        We collaborate with these makers on client work — so the calibre you see here is the calibre
        we can weave for you. Full credit, always.</p>
      <div class="pf-filters reveal">
      ${filterBtns}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0;">
    <div class="wrap">
      <div class="pf-grid" id="pfGrid">
${cards}
      </div>
      <p class="pf-empty" id="pfEmpty">No projects in this collection yet.</p>
    </div>
  </section>

  <section class="section section--ink">
    <div class="wrap cta-close reveal" style="text-align:center;">
      <p class="eyebrow">Your project next</p>
      <h2>Want one of these for your brand?</h2>
      <p class="lede" style="margin-inline:auto;max-width:48ch;">Point at any site above. We&rsquo;ll weave
        you something in that league — with the very studio that made it.</p>
      <div class="cta-close__btns" style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;margin-top:1.75rem;">
        <a class="btn btn--thread" href="about.html#contact">Start a project</a>
        <a class="btn btn--ghost" href="work.html">See our own work</a>
      </div>
    </div>
  </section>
</main>

<footer class="footer section--ink">
  <div class="footer__inner wrap">
    <div class="footer__brand">
      <span class="footer__logo">LOOM</span>
      <p class="muted">We weave technology — websites, apps &amp; AI, woven by hand.</p>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <a href="index.html">Home</a>
      <a href="services.html">Capabilities</a>
      <a href="work.html">Work</a>
      <a href="portfolio.html">Portfolio</a>
      <a href="about.html">Studio</a>
      <a href="about.html#contact">Contact</a>
    </nav>
    <div class="footer__contact">
      <a href="mailto:mofakhori@gmail.com">mofakhori@gmail.com</a>
      <p class="muted">© <span data-year>2026</span> LOOM. Crafted, not generated.</p>
    </div>
  </div>
</footer>

<script src="assets/js/loom.js" defer></script>
<script>
  // Portfolio studio filter
  (function () {
    var grid = document.getElementById('pfGrid');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.pf-card'));
    var empty = document.getElementById('pfEmpty');
    document.querySelectorAll('.pf-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pf-filter').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var f = btn.getAttribute('data-filter');
        var shown = 0;
        cards.forEach(function (c) {
          var match = f === 'all' || c.getAttribute('data-studio') === f;
          c.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (empty) empty.style.display = shown ? 'none' : 'block';
      });
    });
  })();
</script>
</body>
</html>
`;

writeFileSync(new URL('../portfolio.html', import.meta.url), html);
console.log('Wrote portfolio.html with ' + SITES.length + ' sites across ' + studios.length + ' studios.');
