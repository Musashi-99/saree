# AARADHYA — Woven in Divinity

A devotional, interactive editorial website for Indian sarees, built with Next.js, React, TypeScript, GSAP ScrollTrigger and a small WebGL renderer. It opens with an aarti rite, moves through Navratri, bridal and craft chapters, and changes chapters with sheets of real saree silk that float across the screen carrying lines from the Devi Mahatmyam. It is a static site: no backend, accounts or API keys.

> **This repository holds the code and this guide only.** Photographs, AI-generated figures, saree fabric textures, fonts and the favicon are not committed. The site needs them in `public/assets/` to look as designed. See [Adding the media](#adding-the-media).

---

## Contents

1. [Requirements](#requirements)
2. [Quick start](#quick-start)
3. [Adding the media](#adding-the-media)
4. [Build and deploy](#build-and-deploy)
5. [How the site works](#how-the-site-works)
6. [Project structure](#project-structure)
7. [Customising](#customising)
8. [Accessibility and performance](#accessibility-and-performance)
9. [Scripts](#scripts)
10. [Credits and content notes](#credits-and-content-notes)

---

## Requirements

- Node.js 22.13 or newer, and npm
- A modern browser. The saree transitions use WebGL; browsers without it get a simpler sliding sheet.
- Optional: Python 3 with Pillow and fontTools, only if you rebuild the photos and fonts with `scripts/prepare-assets.py`.

## Quick start

```bash
git clone https://github.com/gireeshkumarreddy/durga.git
cd durga
npm ci
```

Put the media into `public/assets/` (next section), then:

```bash
npm run dev
```

Open http://localhost:3000. Without the media the site still runs, but images are missing and text falls back to Georgia and Arial.

## Adding the media

Create this layout inside `public/`:

```
public/
  favicon.svg
  assets/
    <name>-640.webp  <name>-1000.webp  <name>-1600.webp   (12 photographs × 3 widths)
    serif-regular.woff  serif-italic.woff  sans-regular.woff  sans-medium.woff
    generated/   (9 transparent or full-frame figures, .webp)
    saree/       (3 fabric textures, .webp)
```

### Photographs (12 × 3 widths)

Editorial photographs from [Pexels](https://www.pexels.com/license/). Each is saved at 640, 1000 and 1600 px wide as `public/assets/<name>-<width>.webp`. The source links are also on `public/credits.html`.

| Name | Used for | Pexels photo ID |
|---|---|---|
| `portrait` | Grace card; source of the tissue-silk texture | 27776002 |
| `bridal` | The Bridal Edit | 9418783 |
| `gold` | Heritage Silks; Devotion card; source of the golden-silk texture | 12089493 |
| `festive` | The Festive Edit | 15181109 |
| `modern` | The Modern Drape | 31450187 |
| `green` | Gallery: A softer rhythm | 35212994 |
| `jewels` | Strength card; gallery | 5814563 |
| `garden` | Wonder card; gallery | 30458510 |
| `loom` | Craft chapter inset | 14695808 |
| `detail` | Craft and Her Story fabric detail; source of the red zari texture | 9419032 |
| `divine` | Supporting portrait | 19284703 |
| `celebration` | Joy card; gallery | 34538958 |

`components/assets.json` holds each photo's real pixel size and its three variant paths. Update it if you swap a photo for one with a different aspect ratio.

To rebuild the photos and fonts from originals, put the Pexels JPEGs (named by ID, e.g. `27776002.jpg`), `15889856.jpg` and the four TTF fonts in a `reference-research/` folder, then run `python scripts/prepare-assets.py`.

### Generated figures (`public/assets/generated/`)

AI-generated concept artwork. Figures marked "transparent" need a real alpha channel, because they rise over coloured backgrounds.

| File | What it shows | Where |
|---|---|---|
| `durga-face.webp` | Maa Durga, crown to shoulders, transparent | Opening rite ring, hero |
| `durga-mata.webp` | Durga with her lion, transparent | Jai Maa Durga chapter, closing blessing |
| `garba-left.webp`, `garba-right.webp` | Two Garba dancers, transparent | Celebration scene |
| `festival-night.webp` | Night temple courtyard with rangoli and diyas | Celebration background |
| `editorial-bride.webp` | Bride with ornate gold headpiece, transparent | Woven in Divinity |
| `woman-ivory.webp`, `woman-vermilion.webp` | Women in ivory and vermilion sarees, dancing, transparent | Craft, Celebrate and Expression chapters |
| `bridal-monochrome.webp` | Black-and-white bridal side profile | Her Story |

Sizes the markup expects: the dancers and women are 1024 × 1536, `durga-face` 1199 × 1312, `durga-mata` 1254 × 1254, and `festival-night` and `bridal-monochrome` 1672 × 941. Other sizes work, but match the `width`/`height` attributes to avoid layout shift.

### Saree fabric textures (`public/assets/saree/`)

`red.webp`, `gold.webp` and `tissue.webp` are crops of real saree fabric taken from the `detail`, `gold` and `portrait` photographs. Once the photographs are in place, generate them with:

```bash
node scripts/make-saree-textures.mjs
```

### Fonts

`serif-*.woff` is Cormorant Garamond and `sans-*.woff` is Inter, both under the SIL Open Font License, subset by `scripts/prepare-assets.py`. You can also use any WOFF builds of those families with the same file names.

### Favicon

`public/favicon.svg`, referenced from `app/layout.tsx`. Any small SVG works.

## Build and deploy

```bash
npm run build
```

This writes a fully static export to `out/` (`next.config.ts` sets `output: 'export'`). Upload the contents of `out/` to any static host, such as Netlify, Vercel, Cloudflare Pages, GitHub Pages or S3.

- Serve it over HTTP. Opening `out/index.html` directly from disk breaks the absolute `/assets/...` paths.
- To preview the export locally, run `npm start` (http://localhost:3000) or `python -m http.server 8000 --directory out`.
- `npm run typecheck` runs TypeScript without building.

## How the site works

Scroll order, with the files behind each part:

1. **Opening rite** (`components/OpeningRite.tsx`, `components/Diya.tsx`)
   - On a dark ground the diya is lit, and a spark circles it, drawing an aarti ring of fire.
   - Maa Durga appears inside the ring while the diya settles at her feet, with "AARADHYA · जय माता दी" beneath.
   - The ring then opens like a doorway onto the site.
   - A click, tap, Escape or Enter skips it, and "Replay opening" plays it again.
   - Scrolling is locked while it plays. The hero entrance waits for the `aaradhya:reveal` event the rite sends.
2. **Hero, Maa Durga** (`components/DevotionalIntro.tsx`, `app/intro.css`, `app/live.css`)
   - Textured cream background with two counter-rotating rangoli and a turning prabhavali halo. All of them spin faster while you scroll.
   - The layers shift with the cursor, and a soft lamplight follows it.
   - Clicking or tapping offers marigold and rose petals.
3. **Garba celebration**
   - The section holds in place while two dancers rise on cream.
   - A diya is lit between them, and the night courtyard spreads out from its flame.
   - The diya flares on hover; clicking it ("Take aarti") sends up sparks.
4. **Saree transition 1, golden silk:** "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता".
5. **Woven in Divinity**
   - The title words slide in from opposite sides, and each letter lifts on hover.
   - The bride rises inside a turning golden halo and turns gently toward the cursor.
6. **Her Story**
   - A warm diya light follows the cursor across the black-and-white portrait.
   - Five expression cards rise one after another and tilt on hover.
7. **The art of the saree:** a gold zari thread, twisted with a crimson one, trails the cursor.
8. **Saree transition 2, red zari silk:** "नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः".
9. **Jai Maa Durga:** a held scene. Durga rises before a turning mandala, the words slide in from either side, and the colour wipes across.
10. **Curated edits:** the CELEBRATE chapter, then collection cards that slide in from their own side and unveil upward. Each card opens a detail dialog.
11. **Ribbon:** two marquee rows moving in opposite directions. Scrolling up reverses them.
12. **Visual Journal:** EXPRESSION slides in from the left while its sage field grows out from behind two women, followed by a gallery with a lightbox.
13. **Saree transition 3, rose-gold tissue silk:** "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके".
14. **Manifesto:** Durga rises within her frame, and "Not just a drape. / A legacy." meets from both sides.
15. **Footer:** a blessing line, a slow mandala, a circular "Back to top · Jai Mata Di" button, and a large gold AARADHYA wordmark whose letters rise in.

### The saree transitions

`components/SareeVeil.tsx` places an invisible marker at each chapter boundary, and carries the verse. `components/SilkVeil.tsx` draws one sheet of fabric over the whole screen with WebGL:

- The sheet is a 72 × 48 grid bent by layered waves, with the edges lifting as it falls.
- A light and highlight pass gives the silk sheen.
- A soft shadow pass sits beneath it.
- Each marker's scroll progress (0 to 1, from the boundary at 92% of the viewport to 8%) is eased toward every frame. The sheet floats in by 0.44, rests while the verse shows, and floats away from 0.56.
- The cloth keeps breathing on its own clock and dips softly under the cursor.
- Large scroll jumps, such as menu links, skip the transition rather than sweeping it over the destination.
- The renderer is prepared after the opening rite, when the browser is idle.

### Motion architecture

- `components/Motion.tsx` holds all scroll choreography, using GSAP timelines and ScrollTrigger inside `gsap.matchMedia`. Everything is reverted on unmount and on replay.
- `components/Interactive.tsx` holds the pointer, petal, spark, thread, spin, marquee and cursor behaviour. It reads `data-*` hooks from the markup:
  - `data-depth`: parallax strength
  - `data-spin`: seconds per turn
  - `data-tilt`
  - `data-magnetic`
  - `data-light`
  - `data-cursor`: the cursor label
  - `data-petals`
  - `data-flare`
  - `data-thread`
  - `data-marquee`
- Native scrolling is never intercepted.

## Project structure

```
app/
  layout.tsx        document shell, metadata, stylesheet order
  page.tsx          renders <Experience/>
  globals.css       base design system, sections, breakpoints
  intro.css         opening hero and celebration layout
  live.css          cream hero, halos, cursor, cards, ribbon, footer
  devotion.css      opening rite, diya, saree layer, zari thread
components/
  Experience.tsx    the page: sections, navigation, dialogs
  OpeningRite.tsx   diya → ring of fire → Durga → opening
  DevotionalIntro.tsx  hero and Garba celebration
  SareeVeil.tsx     transition marker and verse
  SilkVeil.tsx      WebGL silk renderer (with CSS fallback)
  Motion.tsx        scroll choreography
  Interactive.tsx   pointer and ambient behaviour
  Diya.tsx          the clay diya
  Sacred.tsx        rangoli and halo ornaments
  RisingFigure.tsx  rising figures and chapter scenes
  Modal.tsx         accessible native dialogs
  Photo.tsx         responsive local images
  assets.json       photo sizes and variants
  content.ts        collections and gallery copy
public/
  credits.html      photography and font credits
scripts/
  prepare-assets.py       photos → WebP variants, fonts → subset WOFF
  make-saree-textures.mjs photos → saree fabric textures
  check-output.py         checks the static export
  serve.mjs               serves out/ for `npm start`
```

## Customising

| To change | Edit |
|---|---|
| Verses, transliterations, meanings, or which fabric each transition uses | The three `<SareeVeil …/>` elements in `components/Experience.tsx` |
| Fabric crops | `scripts/make-saree-textures.mjs`, then re-run it |
| Fabric brightness | `GAIN` in `components/SilkVeil.tsx` |
| How long the silk rests, or how fast it floats | In `SilkVeil.tsx`: `start`/`end` in the `ScrollTrigger.create` call; `.44` / `.56` in the shader; the `3.2` easing rate in `tick` |
| Opening rite timing | Label positions in the timeline in `components/OpeningRite.tsx` (`'open'` is at 4.75 s) |
| Remove the opening rite | Delete `<OpeningRite …/>` in `Experience.tsx`. The hero then plays as soon as Durga's image loads. |
| Mandala and halo speed | The `spin` props (seconds per turn) in `DevotionalIntro.tsx` and `Experience.tsx` |
| Colours and fonts | CSS variables at the top of `app/globals.css` (`--wine`, `--gold`, `--ivory`, `--cream`, …) |
| Collections and gallery text | `components/content.ts` |
| Header, menu and footer links | The `nav` array and footer markup in `Experience.tsx` |

## Accessibility and performance

- With `prefers-reduced-motion`, the opening rite, saree layer, cursor effects and ambient motion are skipped, and every section shows in its finished state.
- "Pause effects" in the hero stops the turning mandalas, flicker, sway, sheen and ribbon.
- Dialogs use native `<dialog>`, close on Escape and return focus. The diya is a real `<button>`. Decorative layers are `aria-hidden`.
- Pointer-only effects (parallax, cursor ring, lamplight, tilt, zari thread) switch on only for `hover: hover` and `pointer: fine` devices. Touch devices keep the petals, the diya sparks and all scroll choreography.
- WebGL setup is deferred until after the opening, and textures load lazily. The page falls back to a CSS sheet if WebGL is unavailable.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Static export to `out/` |
| `npm start` | Serves `out/` at http://localhost:3000 |
| `npm run typecheck` | TypeScript check |
| `node scripts/make-saree-textures.mjs` | Builds `public/assets/saree/*.webp` from the photos |
| `python scripts/prepare-assets.py` | Builds photo variants and subset fonts from `reference-research/` |
| `python scripts/check-output.py` | Checks the export: local references, anchors, alt text, section count |

## Credits and content notes

- AARADHYA is a proposed concept identity, not an existing business. Collection names are editorial moods, not products. There is no checkout, account or contact submission, and the contact and social entries are placeholders.
- Editorial photography is from Pexels under the Pexels licence; links are on `public/credits.html`. The people pictured do not endorse the concept.
- The figures in `public/assets/generated/` are AI-generated concept artwork.
- The verses are from the Devi Mahatmyam.
- Fonts: Cormorant Garamond and Inter, SIL Open Font License.
