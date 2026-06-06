# LOOM

**We weave technology.**
Websites, apps & AI — woven by hand.

LOOM is a digital craft studio. This repository is its website: a warm,
handcrafted, premium static site presenting the studio, its capabilities, and
its work.

---

## What this is (and isn't)

- A **pure static website** — plain HTML5, CSS, and a little vanilla JavaScript.
- **No build step. No frameworks. No npm.** Nothing to compile or install.
- It runs by simply opening a file in a browser, and it is designed to deploy
  to **GitHub Pages** with zero configuration.

---

## File structure

```
loom/
├── index.html          Home — hero, positioning, featured work, CTA
├── services.html       Capabilities — the 6 things the studio builds
├── work.html           Work — case studies / portfolio
├── about.html          Studio — story, process, contact (#contact)
├── 404.html            Branded "lost thread" not-found page
│
├── assets/
│   ├── css/loom.css    All site styling (brand tokens, layout, components)
│   ├── js/loom.js      Hero animation, scroll reveals, mobile nav, footer year
│   └── img/            Logo, favicon, social (og) image, etc.
│
├── robots.txt          Allows crawlers; points to the sitemap
├── sitemap.xml         Lists the four main pages for search engines
├── site.webmanifest    PWA / install metadata (name, colors, icon)
├── .nojekyll           Tells GitHub Pages to serve assets/ as-is (no Jekyll)
│
├── SPEC.md             The design contract / single source of truth
├── DEPLOY.md           Beginner-friendly GitHub Pages deploy guide
├── LICENSE             MIT
└── README.md           This file
```

---

## How to run it locally

You have two easy options. Either works.

**Option A — just open it.**
Double-click `index.html` (or drag it into your browser). Done.

**Option B — run a tiny local server** (nicer; behaves exactly like the live
site). In a terminal, from this folder:

```bash
python3 -m http.server
```

Then open <http://localhost:8000> in your browser. Press `Ctrl + C` in the
terminal to stop it.

---

## Putting it online (GitHub Pages)

This site is built to go live on **GitHub Pages** for free. A complete,
plain-English, step-by-step guide lives in **[DEPLOY.md](DEPLOY.md)** — start
there.

A few things already handled for you:

- **`.nojekyll`** is included, so the `assets/` folder serves correctly.
- Every internal link is **relative** (e.g. `services.html`), so the site works
  from a GitHub Pages sub-path.
- Once live, your URL will look like:
  `https://USERNAME.github.io/loom/`
  (replace `USERNAME` with your GitHub username, and `loom` with your repo name
  if you call it something else).

> **One small follow-up after going live:** in `sitemap.xml` and `robots.txt`,
> replace the placeholder `USERNAME` with your real GitHub username so search
> engines get the correct address.

---

## License

[MIT](LICENSE) © 2026 LOOM. Crafted, not generated.
