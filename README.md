# Treasure Valley Relocation Guide 2026–2027: digital flip book

This is a self-contained static site with no build step and no CDN calls. All 108 pages come from the GOLD v6 guide.

## Contents
- `index.html` – the flip book (open it directly, or serve the folder from any static host)
- `pages/p001.webp` … `pages/p108.webp` – page images, 1160×1500 px, lazy-loaded
- `assets/pages.json` / `assets/pages.js` – the page list plus link hotspots copied from the PDF's link annotations. `pages.js` lets the book run from `file://` with no server.
- `assets/flipbook.css`, `assets/flipbook.js`, `assets/logo-gold.png`, `assets/og-cover.jpg`
- `vendor/page-flip.browser.js` – StPageFlip 2.0.7 (MIT, see `vendor/page-flip-LICENSE.txt`)
- `Treasure-Valley-Relocation-Guide-2026-2027_DIGITAL-GOLD.pdf` – the file behind the "Download PDF" button

## Controls
Swipe or drag a page corner, use the arrow keys / PageUp / PageDown / Home / End, the ‹ › and |‹ ›| buttons, and full screen.
Desktop shows two-page spreads. Phones (narrower than about 580 px) show one page at a time. Front and back covers are hard single pages.
Deep link to a page: `index.html#page-12`.

## After hosting: fix the share preview
Facebook, LinkedIn, iMessage and others need absolute URLs. In `index.html`, change these:
```
<meta property="og:image" content="assets/og-cover.jpg">
<meta name="twitter:image" content="assets/og-cover.jpg">
<meta property="og:url" content="./">
```
to the real addresses, e.g. `https://YOUR-HOST/relocation-guide/assets/og-cover.jpg` and `https://YOUR-HOST/relocation-guide/`.

## Hosting
Upload the whole folder as-is, keeping the structure, so that `index.html` sits at the root of the site or sub-folder. No server-side code is needed.
The total size is about 34 MB. The largest single file is the 14.8 MB PDF.

## Third-party license
StPageFlip © Nodlik, MIT License. The full text is in `vendor/page-flip-LICENSE.txt`.
