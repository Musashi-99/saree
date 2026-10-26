# AARADHYA — Diwali Silk Sarees

A Diwali saree storefront built with Next.js, React, TypeScript, GSAP ScrollTrigger and a small WebGL renderer. It opens with an aarti rite in which Maa Lakshmi appears in a ring of fire, moves through Diwali, Lakshmi Puja and craft chapters, and changes chapters with sheets of real saree silk that float across the screen carrying Diwali verses. Shoppers can filter and sort 20 real Amazon.in products (silk sarees, cotton sarees and kurta sets), open a product page, keep a wishlist, fill a bag and check out.

It is a Next.js app with one server route, `/api/orders`, which emails each order. **`data/products.json` stands in for a database**: products, categories, prices, Amazon links, shipping rules and coupons all live there. The bag, wishlist and placed orders are kept in the browser's `localStorage`, and checkout takes no payment.

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
    <name>-640.webp  <name>-1000.webp  <name>-1600.webp   (40 photographs × 3 widths)
    serif-regular.woff  serif-italic.woff  sans-regular.woff  sans-medium.woff
    generated/   (9 transparent or full-frame figures, .webp)
    saree/       (3 fabric textures, .webp)
```

The quickest way to get everything is:

```bash
node scripts/fetch-media.mjs            # photos (editorial, Diwali and every product image), fonts, favicon
node scripts/make-saree-textures.mjs    # silk textures for the transitions
pip install "rembg[cpu]" pillow && python scripts/make-diwali-figures.py   # Lakshmi and the festive figures
```

`fetch-media.mjs` reads `data/products.json`, so a product added there with a Pexels photo ID is downloaded on the next run. If a Pexels JPEG is already saved as `reference-research/pexels/<id>.jpg`, it is used instead of downloading it again.

### Photographs (40 × 3 widths)

Editorial photographs from [Pexels](https://www.pexels.com/license/). Each is saved at 640, 1000 and 1600 px wide as `public/assets/<name>-<width>.webp`. The source links are also on `public/credits.html`.

| Name | Used for | Pexels photo ID |
|---|---|---|
| `portrait` | Padwa card; source of the tissue-silk texture | 27776002 |
| `bridal` | The Banarasi Edit | 9418783 |
| `gold` | The Lakshmi Puja Edit; Dhanteras card; source of the golden-silk texture | 12089493 |
| `festive` | Tissue & Organza edit | 15181109 |
| `modern` | Handloom & Soft Silk edit | 31450187 |
| `green` | Not currently shown | 35212994 |
| `jewels` | Not currently shown | 5814563 |
| `garden` | Not currently shown | 30458510 |
| `loom` | Craft chapter inset | 14695808 |
| `detail` | Craft and Her Story fabric detail; source of the red zari texture | 9419032 |
| `divine` | Not currently shown | 19284703 |
| `celebration` | Lakshmi Puja card | 34538958 |
| `diya-girl`, `sparkler`, `aarti`, `lamps-together` | Diwali diaries gallery | 8819773, 8229660, 8887381, 27155549 |
| `diya-plate`, `sparkler-dusk` | Chhoti Diwali and Bhai Dooj cards | 8819122, 8229656 |
| `a-<asin>-<n>` | Product photos: the Amazon listing photos, listed in `data/products.json` | — |

`components/assets.json` holds each photo's real pixel size and its three variant paths. Update it if you swap a photo for one with a different aspect ratio.

To rebuild the photos and fonts from originals, put the Pexels JPEGs (named by ID, e.g. `27776002.jpg`), `15889856.jpg` and the four TTF fonts in a `reference-research/` folder, then run `python scripts/prepare-assets.py`.

### Figures (`public/assets/generated/`)

Built by `scripts/make-diwali-figures.py`, which downloads the sources (cached in `reference-research/diwali/`) and cuts the figures out with [rembg](https://github.com/danielgatis/rembg). Figures marked "transparent" have a real alpha channel, because they rise over coloured backgrounds.

| File | What it shows | Source | Where |
|---|---|---|---|
| `lakshmi-face.webp` | Maa Lakshmi, crown to waist, holding lotuses, transparent | Raja Ravi Varma, *Goddess Lakshmi*, 1896 (public domain) | Opening rite ring, hero |
| `lakshmi.webp` | Lakshmi standing on her lotus, transparent | Same painting | Jai Maa Lakshmi chapter, closing blessing |
| `festive-left.webp`, `festive-right.webp` | Women in marigold and vermilion silk, transparent | Pexels 9419023, 9419032 | Diwali celebration scene |
| `festival-night.webp` | Diwali night with rangoli and diyas | Pexels 18376975 | Celebration background |
| `editorial-bride.webp` | Woman in gold Kanjivaram, transparent | Pexels 12089493 | Woven in Light |
| `woman-vermilion.webp`, `woman-emerald.webp` | Women in vermilion and emerald silk, transparent | Pexels 9418783, 35108774 | Craft, Celebrate and Deepavali chapters |
| `diya-monochrome.webp` | Black-and-white portrait among diyas | Pexels 27155551 | Her Story |

Sizes the markup expects: the women are 1024 × 1536, `lakshmi-face` 1199 × 1312, `lakshmi` 1254 × 1254, and `festival-night` and `diya-monochrome` 1672 × 941.

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

This builds the site to `.next/`. Pages are prerendered; `/api/orders` runs as a server function. Run it with `npm start` (http://localhost:3000). See [Deploying to Vercel](#deploying-to-vercel) for hosting, since the order emails need a Node server; a static host cannot run them.

- `npm run typecheck` runs TypeScript without building.

## The store

The catalogue is made of **real Amazon.in products**. Each one sells at its Amazon price **plus ₹10 commission**, and keeps its Amazon ASIN and link, so every order shows exactly which listing to buy it from.

- **Catalogue:** `data/products.json`. 20 products in three categories: silk sarees (7), cotton sarees (7) and kurtis & kurta sets (6). Each has a SKU (`AAR-<ASIN>`), `slug`, `brand`, `colour`, `price` (Amazon price + commission), `mrp`, `rating`, `reviews`, `sizes` (kurtis), `images`, `description`, `details`, `care`, and `source` with `asin`, `link` (`https://www.amazon.in/dp/<ASIN>`), the original Amazon `title`, `amazonPrice`, `amazonMrp` and `commission`. `store` holds shipping (free) and coupons (none: any discount would cost more than the ₹10 commission).
- **Scraping and rebuilding it:**
  ```bash
  pip install playwright pillow
  python scripts/scrape-amazon.py                       # search Amazon.in, pick 20 products → data/amazon-scrape.json
  python scripts/scrape-amazon.py --refresh             # re-read the same products (current prices, photos, sizes)
  python scripts/scrape-amazon.py --refresh --missing   # retry only products Amazon refused last time
  python scripts/build-catalogue.py                     # scrape → data/products.json (price = Amazon + COMMISSION)
  node scripts/fetch-media.mjs                          # product photos → public/assets/
  ```
  The search terms and counts per category are `CATEGORIES` in `scrape-amazon.py`; the commission is `COMMISSION` in `build-catalogue.py`. Amazon throttles fast page loads, so the scraper waits between pages and retries. Prices on Amazon change: refresh and rebuild before you take orders.
- **Data layer:** `lib/shop.ts` is the only code that reads the JSON: typed products and categories, lookups, INR formatting and `totals()` (subtotal, shipping, total and commission).
- **Homepage shop:** `components/Shop.tsx`, with category filters, sorting, wishlist and quick add. Kurtis show "Choose size" and go to their product page.
- **Product pages:** `/products/<slug>/`, one per product, with a size picker for kurtis.
- **Bag and wishlist:** `components/Cart.tsx`, kept in `localStorage`. The same kurti in two sizes is two lines.
- **Checkout:** `/checkout/` (`components/Checkout.tsx`). Payment is **cash on delivery**. The form posts the address and `{id, qty, size}` per item to **`/api/orders/`** (`app/api/orders/route.ts`), which validates them, prices every item from the catalogue (prices in the request are ignored) and sends two emails (`lib/order-mail.ts`):
  - **to the admin** (`admin` in the mail config): the order number, COD amount to collect, commission, customer's address and phone, and for every item its size, quantity, ASIN, Amazon price and **original Amazon link**;
  - **to the customer**: a confirmation with the items, total, COD note and delivery address.

  The admin email is sent first. If it fails, the order is refused and the shopper is asked to try again, so no order is lost without you hearing about it. If only the customer email fails, the order still goes through. The returned order is also kept in the browser for `/orders/`.
- **Orders (store owner):** `/orders/` (`components/Orders.tsx`, not linked from the site) lists the orders with the customer's address and an "Open listing" link per item, to place the order on Amazon. Orders are stored in the browser they were placed in, so until a backend is connected you only see orders placed on that same browser.

## Order emails (Brevo SMTP)

The SMTP settings live in a config file, not environment variables: **`config/mail.config.ts`** (host, port, login, SMTP key, sender, admin address).

- It is **git-ignored**, so the key never enters git. Copy `config/mail.config.example.ts` to create it on another machine.
- It starts with `import 'server-only'`, so the build fails if any browser code imports it. Only the `/api/orders` server function reads it; the key is never sent to visitors. After a build, `grep -r xsmtpsib .next/static` should print nothing.
- The `from` address must be a **verified sender in Brevo** (Brevo → Senders, domains & dedicated IPs), or Brevo will reject or spam-folder the mail.

## Deploying to Vercel

The site is a server build (`next build`), not a static export, because `/api/orders` sends email. Vercel detects Next.js with no extra settings.

- **Deploy with the Vercel CLI from this folder** (`npx vercel --prod`). The CLI uploads local files except those in `.vercelignore` (there is none), so the git-ignored `config/mail.config.ts` goes up with it. After deploying, place a test order to confirm both emails arrive.
- **Deploying from GitHub** (Vercel's Git integration) builds from the repository, which does not contain the git-ignored config, so `/api/orders` will fail. Use the CLI, or commit the config only if the repository is private.

## How the site works

Scroll order, with the files behind each part:

1. **Opening rite** (`components/OpeningRite.tsx`, `components/Diya.tsx`)
   - On a dark ground the diya is lit, and a spark circles it, drawing an aarti ring of fire.
   - Maa Lakshmi appears inside the ring while the diya settles at her feet, with "AARADHYA · शुभ दीपावली" beneath.
   - The ring then opens like a doorway onto the site.
   - A click, tap, Escape or Enter skips it, and "Replay opening" plays it again.
   - Scrolling is locked while it plays. The hero entrance waits for the `aaradhya:reveal` event the rite sends.
2. **Hero, Maa Lakshmi** (`components/DevotionalIntro.tsx`, `app/intro.css`, `app/live.css`)
   - Textured cream background with two counter-rotating rangoli and a turning prabhavali halo. All of them spin faster while you scroll.
   - The layers shift with the cursor, and a soft lamplight follows it.
   - Clicking or tapping offers marigold and rose petals.
3. **Diwali celebration**
   - The section holds in place while two women in festive silk rise on cream.
   - A diya is lit between them, and the night courtyard spreads out from its flame.
   - The diya flares on hover; clicking it ("Light the diya") sends up sparks.
4. **Saree transition 1, golden silk:** "तमसो मा ज्योतिर्गमय" (Lead me from darkness to light).
5. **Woven in Light**
   - The title words slide in from opposite sides, and each letter lifts on hover.
   - The bride rises inside a turning golden halo and turns gently toward the cursor.
6. **Her Story**
   - A warm diya light follows the cursor across the black-and-white portrait.
   - Five cards, one for each day of Diwali, rise one after another and tilt on hover.
7. **The art of the saree:** a gold zari thread, twisted with a crimson one, trails the cursor.
8. **Saree transition 2, red zari silk:** "ॐ श्री महालक्ष्म्यै नमः".
9. **Jai Maa Lakshmi:** a held scene. Lakshmi rises on her lotus before a turning mandala, the words slide in from either side, and the colour wipes across.
10. **Diwali edits:** the CELEBRATE chapter, then four edit cards (one per weave) that slide in from their own side and unveil upward. Each card opens a dialog with a button that shops that weave.
11. **Shop:** the product grid, with filters, sorting, wishlist and add to bag.
12. **Ribbon:** two marquee rows moving in opposite directions. Scrolling up reverses them.
13. **Diwali diaries:** DEEPAVALI slides in from the left while its sage field grows out from behind two women, followed by a gallery with a lightbox.
14. **Saree transition 3, rose-gold tissue silk:** "शुभं करोति कल्याणमारोग्यं धनसम्पदा".
15. **Manifesto:** Lakshmi rises within her frame, and "Not just a saree. / A blessing." meets from both sides.
16. **Footer:** a blessing line, a slow mandala, a circular "Back to top · Shubh Diwali" button, customer-care links, and a large gold AARADHYA wordmark whose letters rise in.

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
  layout.tsx        document shell, metadata, stylesheet order, bag provider
  products/[slug]/  one static page per product
  checkout/         checkout page
  orders/           store owner's order list with Amazon links
  api/orders/       POST: validates and prices an order, emails customer and admin
config/
  mail.config.ts          SMTP key, sender and admin address (git-ignored, server only)
  mail.config.example.ts  template for the above
  page.tsx          renders <Experience/>
  globals.css       base design system, sections, breakpoints
  intro.css         opening hero and celebration layout
  live.css          cream hero, halos, cursor, cards, ribbon, footer
  devotion.css      opening rite, diya, saree layer, zari thread
  shop.css          bag drawer, product grid, product page, checkout
data/
  products.json     the catalogue: products, categories, shipping and coupons
  amazon-scrape.json  raw output of scripts/scrape-amazon.py
lib/
  shop.ts           reads the catalogue; lookups, prices, cart totals
  orders.ts         the order record and its localStorage store
  order-mail.ts     the two order emails (server only)
components/
  Experience.tsx    the page: sections, navigation, dialogs
  OpeningRite.tsx   diya → ring of fire → Lakshmi → opening
  Shop.tsx          homepage product grid and product card
  ProductView.tsx   product page
  Cart.tsx          bag and wishlist state, bag drawer, header bag button
  Checkout.tsx      checkout form, coupons, order confirmation
  ShopShell.tsx     header and footer for the product and checkout pages
  Orders.tsx        store owner's order list
  DevotionalIntro.tsx  hero and Diwali celebration
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
  content.ts        Diwali edits and gallery copy
public/
  credits.html      photography and font credits
scripts/
  prepare-assets.py       photos → WebP variants, fonts → subset WOFF
  scrape-amazon.py        Amazon.in search and product pages → data/amazon-scrape.json
  build-catalogue.py      scrape → data/products.json (Amazon price + commission)
  fetch-media.mjs         Pexels and product photos → WebP variants; fonts
  make-diwali-figures.py  Lakshmi painting and photos → transparent figures
  make-saree-textures.mjs photos → saree fabric textures
  check-output.py         checks the built homepage
```

## Customising

| To change | Edit |
|---|---|
| Verses, transliterations, meanings, or which fabric each transition uses | The three `<SareeVeil …/>` elements in `components/Experience.tsx` |
| Fabric crops | `scripts/make-saree-textures.mjs`, then re-run it |
| Fabric brightness | `GAIN` in `components/SilkVeil.tsx` |
| How long the silk rests, or how fast it floats | In `SilkVeil.tsx`: `start`/`end` in the `ScrollTrigger.create` call; `.44` / `.56` in the shader; the `3.2` easing rate in `tick` |
| Opening rite timing | Label positions in the timeline in `components/OpeningRite.tsx` (`'open'` is at 4.75 s) |
| Remove the opening rite | Delete `<OpeningRite …/>` in `Experience.tsx`. The hero then plays as soon as Lakshmi's image loads. |
| Mandala and halo speed | The `spin` props (seconds per turn) in `DevotionalIntro.tsx` and `Experience.tsx` |
| Colours and fonts | CSS variables at the top of `app/globals.css` (`--wine`, `--gold`, `--ivory`, `--cream`, …) |
| Products, prices, stock, coupons, shipping | `data/products.json`, then `node scripts/fetch-media.mjs` for any new photos |
| Diwali edits and gallery text | `components/content.ts` |
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
| `npm run build` | Production build to `.next/` |
| `npm start` | Runs the production build at http://localhost:3000 (order emails work here too) |
| `npm run typecheck` | TypeScript check |
| `node scripts/make-saree-textures.mjs` | Builds `public/assets/saree/*.webp` from the photos |
| `python scripts/prepare-assets.py` | Builds photo variants and subset fonts from `reference-research/` |
| `node scripts/fetch-media.mjs` | Downloads the photos (including every product image in `data/products.json`) and fonts, and records their sizes in `components/assets.json` |
| `python scripts/make-diwali-figures.py` | Builds the Lakshmi and festive figures in `public/assets/generated/` (needs `rembg`) |
| `python scripts/check-output.py` | After a build, checks the homepage: local references, anchors, alt text, section count |

## Credits and content notes

- Products, prices, ratings and product photos come from Amazon.in listings; the photos belong to the brands that listed them. Checkout saves orders in the browser and takes no payment, and the contact and social entries are placeholders.
- Editorial photography is from Pexels under the Pexels licence; links are on `public/credits.html`. The people pictured do not endorse the store.
- Maa Lakshmi is cut out from Raja Ravi Varma's *Goddess Lakshmi* (1896), which is in the public domain.
- The verses are from the Brihadaranyaka Upanishad, the Lakshmi mantra and the Deepa Jyoti stotra.
- Fonts: Cormorant Garamond and Inter, SIL Open Font License.
