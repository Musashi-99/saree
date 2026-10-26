# Scrapes real Amazon.in products for the Diwali catalogue and writes data/amazon-scrape.json.
#   pip install playwright      (uses an installed Chromium; set CHROMIUM=/path/to/chromium if needed)
#   python scripts/scrape-amazon.py
#   python scripts/scrape-amazon.py --refresh   (re-reads the same products, e.g. to update prices)
#   python scripts/scrape-amazon.py --refresh --missing   (only products that still have one photo)
# Then run: python scripts/build-catalogue.py   (turns the scrape into data/products.json)
#
# For each category it runs a search, keeps organic (non-sponsored) results with a price and a rating,
# then opens each product page for the title, price, MRP, rating, photos and feature bullets.
import asyncio, json, os, re, random, sys
from playwright.async_api import async_playwright

CATEGORIES = [
    {'id': 'silk-sarees', 'count': 7, 'queries': ['silk saree for women diwali', 'banarasi silk saree with blouse piece']},
    {'id': 'cotton-sarees', 'count': 7, 'queries': ['cotton saree for women festive', 'handloom cotton saree women']},
    {'id': 'kurtis', 'count': 6, 'queries': ['kurti for women diwali festive', 'kurta set for women festive wear']},
]
OUT = 'data/amazon-scrape.json'
CHROMIUM = os.environ.get('CHROMIUM', '/usr/bin/chromium-browser')
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'

def number(text):
    m = re.search(r'[\d,]+(?:\.\d+)?', text or '')
    return float(m.group().replace(',', '')) if m else None

async def search(page, query):
    await page.goto(f'https://www.amazon.in/s?k={query.replace(" ", "+")}', timeout=60000)
    await page.wait_for_selector('div[data-component-type="s-search-result"]', timeout=30000)
    return await page.eval_on_selector_all('div[data-component-type="s-search-result"]', '''els => els.map(el => ({
        asin: el.dataset.asin,
        sponsored: !!el.querySelector('.puis-sponsored-label-text, .s-sponsored-label-info-icon') || /Sponsored/.test(el.innerText.slice(0, 200)),
        price: el.querySelector('.a-price:not(.a-text-price) .a-offscreen')?.textContent,
        rating: el.querySelector('[aria-label*="out of 5 stars"]')?.getAttribute('aria-label'),
        reviews: el.querySelector('[aria-label*="ratings"], a[href*="customerReviews"] span')?.textContent,
    }))''')

async def product(page, asin):
    await page.goto(f'https://www.amazon.in/dp/{asin}', timeout=60000)
    await page.wait_for_selector('#productTitle', timeout=30000)
    data = await page.evaluate(r'''() => {
        const text = s => document.querySelector(s)?.textContent.trim().replace(/\s+/g, ' ') || null;
        const html = document.documentElement.innerHTML;
        // Only the selected colour's photos: the 'initial' list in colorImages, not every variant's.
        const start = html.indexOf("'initial': A.$.parseJSON('");
        let photos = [];
        try { photos = JSON.parse(html.slice(start + 26, html.indexOf("')", start))).map(i => i.hiRes || i.large).filter(Boolean); } catch {}
        if (!photos.length) photos = [document.querySelector('#landingImage')?.dataset.oldHires].filter(Boolean);
        const sizes = [...document.querySelectorAll('#native_dropdown_selected_size_name option, #inline-twister-row-size_name li, #variation_size_name li')]
            .map(o => (o.dataset.aText || o.getAttribute('title') || o.textContent).replace(/^Click to select /, '').trim())
            .filter(t => t && !/^select$/i.test(t) && t.length < 12);
        const details = {};
        document.querySelectorAll('#productOverview_feature_div tr, #detailBullets_feature_div li, #productDetails_techSpec_section_1 tr').forEach(row => {
            const cells = row.innerText.split(/\n|\t|:/).map(s => s.replace(/[‎‏]/g, '').trim()).filter(Boolean);
            if (cells.length >= 2 && cells[0].length < 40) details[cells[0]] = cells.slice(1).join(' ').slice(0, 120);
        });
        return {
            title: text('#productTitle'),
            brand: text('#bylineInfo'),
            price: text('#corePriceDisplay_desktop_feature_div .priceToPay .a-offscreen') || text('#corePrice_feature_div .a-offscreen') || text('.priceToPay .a-offscreen'),
            mrp: text('#corePriceDisplay_desktop_feature_div .basisPrice .a-offscreen') || text('.basisPrice .a-offscreen'),
            rating: text('#acrPopover .a-icon-alt'),
            reviews: text('#acrCustomerReviewText'),
            bullets: [...document.querySelectorAll('#feature-bullets li span.a-list-item, #productFactsDesktopExpander li span.a-list-item')].map(li => li.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean),
            images: [...new Set(photos)],
            sizes: [...new Set(sizes)],
            colour: text('#variation_color_name .selection') || text('#inline-twister-expanded-dimension-text-color_name'),
            details,
            available: !/Currently unavailable/i.test(text('#availability') || ''),
        };
    }''')
    data['asin'] = asin
    data['link'] = f'https://www.amazon.in/dp/{asin}'
    data['price'], data['mrp'] = number(data['price']), number(data['mrp'])
    data['rating'], data['reviews'] = number(data['rating']), int(number(data['reviews']) or 0)
    return data

async def refresh(page):
    results = json.load(open(OUT))
    for cat, items in results.items():
        for i, old in enumerate(items):
            if '--missing' in sys.argv and len(old['images']) > 1: continue
            for attempt in range(3):
                try:
                    d = await product(page, old['asin']); d['category'] = cat; items[i] = d
                    print('refreshed', d['asin'], d['price'], len(d['images']), 'photos', d['sizes']); break
                except Exception as e:
                    # Amazon throttles bursts of page loads; wait longer before each retry.
                    print('retry' if attempt < 2 else 'kept old', old['asin'], type(e).__name__)
                    await page.wait_for_timeout(15000 * (attempt + 1))
            await page.wait_for_timeout(random.randint(4000, 8000))
    return results

async def main():
    results = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROMIUM, args=['--no-sandbox'])
        ctx = await browser.new_context(locale='en-IN', user_agent=UA, viewport={'width': 1366, 'height': 900})
        page = await ctx.new_page()
        seen = set()
        for cat in ([] if '--refresh' in sys.argv else CATEGORIES):
            candidates = []
            for q in cat['queries']:
                for r in await search(page, q):
                    if r['asin'] and not r['sponsored'] and r['price'] and r['rating'] and r['asin'] not in seen:
                        seen.add(r['asin']); candidates.append(r)
                await page.wait_for_timeout(random.randint(1500, 3000))
            picked = []
            for c in candidates:
                if len(picked) == cat['count']: break
                try:
                    d = await product(page, c['asin'])
                except Exception as e:
                    print('skip', c['asin'], type(e).__name__); continue
                if d['price'] and d['images'] and d['available'] and (d['rating'] or 0) >= 3.6:
                    d['category'] = cat['id']; picked.append(d)
                    print(cat['id'], d['asin'], d['price'], d['rating'], d['title'][:70])
                await page.wait_for_timeout(random.randint(1500, 3500))
            results[cat['id']] = picked
        if '--refresh' in sys.argv: results = await refresh(page)
        await browser.close()
    with open(OUT, 'w') as f: json.dump(results, f, indent=1, ensure_ascii=False)
    print('wrote', OUT, sum(len(v) for v in results.values()), 'products')

asyncio.run(main())
