# LOOM — Brand Guide

A digital craft studio. We treat code, AI and design like a craft — woven by
hand, finished with care.

---

## Name & tagline

- **Name:** LOOM — always set as an uppercase wordmark: `LOOM`.
- **Tagline:** *We weave technology.*
- **Sub-line:** *Websites, apps & AI — woven by hand.*
- **Positioning line:** *Crafted, not generated.*

## Positioning — digital craftsmanship

LOOM is a master's workshop, not a SaaS landing page. The founder's story —
a maker who moved from working wood to working in code and AI — runs through
everything. We are warm, human, premium and calm. We build *with* AI agent
teams (our "weavers"), so we ship faster without losing the handmade feel.

The whole brand idea is **digital craftsmanship**: technology that is
considered, tactile and made to last — *crafted, not generated*.

## Voice

Confident, warm, plain-spoken, a little poetic. Short sentences. No corporate
fluff, no buzzword soup. We speak like a skilled maker who respects the client.
English-first, with a few tasteful Arabic touches (e.g. بُستان الرُّوح) where
they belong — never forced, never RTL on the main site.

## Signature motif — the weave

Thin threads that cross **over and under**, like a loom's **warp** (vertical)
and **weft** (horizontal). The warp is terracotta, the weft is teal, knots are
gold. The motif appears in the hero canvas animation, section dividers
(`.thread-rule`), the logo, and as a faint paper-grain texture.

## Color tokens

| Token          | Hex       | Role                                   |
|----------------|-----------|----------------------------------------|
| `--paper`      | `#F7F2E9` | Warm parchment background              |
| `--paper-2`    | `#EFE7D8` | Slightly deeper panel                  |
| `--ink`        | `#1C1814` | Near-black warm text                   |
| `--ink-soft`   | `#4A423A` | Secondary text                         |
| `--thread`     | `#C75B39` | Terracotta — primary accent (warp)     |
| `--thread-2`   | `#1F4E4A` | Deep teal — secondary accent (weft)    |
| `--gold`       | `#B8884B` | Woven gold — small highlights / knots  |
| `--line`       | `#D8CDB9` | Hairline borders on paper              |
| `--paper-card` | `#FCF9F2` | Raised card surface                    |

Dark bands invert: background `--ink`, text `--paper`, accents stay
`--thread` / `--gold`. Maintain AA contrast everywhere.

## Typography — Fraunces + Inter

- **Display / headings:** **Fraunces** (variable serif), weight 400–600,
  optical sizing on, slight `letter-spacing: -0.01em` at large sizes.
  `font-family: 'Fraunces', Georgia, serif;`
- **Body / UI:** **Inter**, weight 400–600.
  `font-family: 'Inter', system-ui, sans-serif;`
- **Fluid scale:** h1 `clamp(2.6rem, 6vw, 5rem)`, h2 `clamp(1.9rem, 3.5vw, 3rem)`,
  h3 `clamp(1.2rem, 2vw, 1.6rem)`, body `1.0625rem / 1.7`.
- Fraunces serves warmth and craft; Inter keeps the UI clean and legible.

## Logo usage

- The mark is an abstract woven **'L'**: a terracotta warp crossed by a teal
  weft, with gold knots at the interlocks. Files: `assets/img/logo.svg`
  (34×34) and `assets/img/favicon.svg` (simplified, reads at 16px).
- In the nav, pair the mark with the `LOOM` wordmark in Fraunces.
- Keep clear space around the mark of at least its own width. Don't recolor,
  rotate (beyond the gentle nav hover), stretch, or add effects.
- On dark backgrounds the mark's terracotta/teal/gold stay as-is; only the
  wordmark switches to `--paper`.

## Spacing & shape

- Max content width **1180px**, side padding `clamp(1.25rem, 5vw, 4rem)`.
- Section vertical padding `clamp(4rem, 9vw, 8rem)`.
- Radii: cards **14px**, buttons **10px**, pills **999px**.
- Hairlines use `--line`. Generous whitespace. Editorial and calm.

## Motion

Slow, mesmerizing, low-CPU. The hero loom canvas drifts gently; reveals fade
and rise on scroll; buttons and cards lift slightly on hover. Everything
honors `prefers-reduced-motion: reduce` (animation and reveals are disabled).
