# Turns data/amazon-scrape.json (from scripts/scrape-amazon.py) into the store catalogue, data/products.json.
#   python scripts/build-catalogue.py
# Then run: node scripts/fetch-media.mjs   (converts the product photos for the site)
#
# Each product sells at the Amazon price plus COMMISSION rupees, and keeps its Amazon ASIN and link in
# `source`, so every order can be matched to the Amazon listing it should be placed against.
import json, os, re, urllib.request
from PIL import Image

COMMISSION = 10
PHOTOS = 4  # photos kept per product
CACHE = 'reference-research/amazon'
SCRAPE, OUT = 'data/amazon-scrape.json', 'data/products.json'

STORE = {
    'name': 'AARADHYA', 'currency': 'INR', 'commission': COMMISSION,
    # Order limits: at most 4 of any one item, and at most 5 different items (a kurti in two sizes is two).
    'maxQtyPerItem': 4, 'maxItemsPerOrder': 5,
    # Free shipping, and no coupons: a discount would cost more than the commission on each order.
    'freeShippingAbove': 0, 'shippingFee': 0, 'diwaliDispatchBy': '2026-11-05', 'coupons': [],
}
CATEGORIES = [
    {'id': 'silk-sarees', 'name': 'Silk Sarees', 'origin': 'Banarasi and Kanjivaram weaves', 'blurb': 'Zari-woven silk sarees with blouse pieces, for Lakshmi Puja and Diwali night.'},
    {'id': 'cotton-sarees', 'name': 'Cotton Sarees', 'origin': 'Handloom and cotton-silk', 'blurb': 'Breathable cotton and cotton-silk sarees for Dhanteras mornings and Diwali visits.'},
    {'id': 'kurtis', 'name': 'Kurtis & Kurta Sets', 'origin': 'Kurta, pant and dupatta sets', 'blurb': 'Embroidered kurta sets with dupattas, easy to wear through all five days of Diwali.'},
]
OCCASIONS = {'silk-sarees': ['Lakshmi Puja', 'Diwali night'], 'cotton-sarees': ['Dhanteras', 'Diwali visits'], 'kurtis': ['Diwali parties', 'Bhai Dooj']}
# Amazon's colour labels, tidied; and colours for listings that only say "Multicolor".
COLOUR_FIX = {'coffe': 'Coffee', 'morepeach': 'Peach', 'onion': 'Onion Pink'}
COLOUR_BY_ASIN = {'B0DTKNCYVF': 'Pink Floral', 'B0HCYPKYPC': 'Rust Orange'}
CARE = {'silk-sarees': 'Dry clean only. Store folded in a muslin cloth.', 'cotton-sarees': 'Dry clean or gentle hand wash in cold water. Dry in shade.', 'kurtis': 'Gentle hand wash in cold water. Dry in shade; iron on low heat.'}

def download(url, path):
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f: f.write(r.read())
    return path

def palette(path, n=3):
    # The garment's main colours: quantize the centre of the photo and skip the white studio background.
    im = Image.open(path).convert('RGB'); w, h = im.size
    im = im.crop((w * .2, h * .15, w * .8, h * .9)).resize((80, 100))
    q = im.quantize(8, method=Image.Quantize.MEDIANCUT); pal = q.getpalette()
    colours = []
    for count, i in sorted(q.getcolors(), reverse=True):
        r, g, b = pal[i * 3:i * 3 + 3]
        if min(r, g, b) > 225 or max(r, g, b) - min(r, g, b) < 12 and r > 190: continue
        colours.append(f'#{r:02x}{g:02x}{b:02x}')
    return colours[:n]

def name(title, brand):
    # Amazon titles are long keyword strings; keep the product phrase before "for/with/|".
    t = re.split(r'\s*[|,(]\s*|\s+(?:for|For|FOR|with|With|WITH|wd)\s+', title)[0]
    t = re.sub(r"\b(Women'?s?|Womens|Ladies|Girls)\b\s*", '', t)
    if brand and t.lower().startswith(brand.lower()): t = t[len(brand):]
    t = re.sub(r'\s+', ' ', t).strip(' -–“”"\'')
    return t[:60].rsplit(' ', 1)[0] if len(t) > 60 else t

def slug(text): return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def brand_of(raw):
    return re.sub(r'^(Visit the |Brand: )|( Store)$', '', raw or '').strip()

def build():
    os.makedirs(CACHE, exist_ok=True)
    scrape = json.load(open(SCRAPE))
    products = []
    for cat in CATEGORIES:
        for p in scrape[cat['id']]:
            brand = brand_of(p['brand'])
            images = []
            for i, url in enumerate(p['images'][:PHOTOS], 1):
                asset = f"a-{p['asin'].lower()}-{i}"
                download(url, f'{CACHE}/{asset}.jpg')
                images.append({'name': asset, 'url': url})
            title = name(p['title'], brand)
            colour = COLOUR_BY_ASIN.get(p['asin']) or (p.get('colour') or '').strip()
            if not colour or colour.lower() == 'none' or re.search(r'\d', colour): colour = ''
            colour = COLOUR_FIX.get(colour.lower(), colour.title())
            if colour and colour.lower() not in title.lower(): title = f'{colour} {title}'
            price = round(p['price']) + COMMISSION
            bullets = [re.sub(r'\s+', ' ', b).strip() for b in p['bullets'] if len(b) > 12]
            narrative = [b for b in bullets if not re.match(r'^(Fabric|Saree|Kurta|Style|Size|Length|Package|Other|Ocassion|Occasion|Care|Wash)\b', b, re.I)]
            products.append({
                'id': f"AAR-{p['asin']}",
                'slug': slug(f'{title} {colour} {p["asin"][-4:]}'),
                'name': title,
                'brand': brand,
                'category': cat['id'],
                'colour': colour or 'As pictured',
                'palette': palette(f"{CACHE}/{images[0]['name']}.jpg"),
                'price': price,
                'mrp': max(round(p['mrp'] or 0), price),
                'rating': p['rating'] or 0,
                'reviews': p['reviews'],
                'stock': 10,
                'badge': None,
                'featured': False,
                'occasion': OCCASIONS[cat['id']],
                'sizes': p.get('sizes') or [],
                'images': images,
                'description': (narrative or bullets or [p['title']])[0][:320],
                'details': [b[:160] for b in bullets[:4]],
                'care': next((b[:200] for b in bullets if re.search(r'\b(wash|dry clean)\b', b, re.I)), CARE[cat['id']]),
                'source': {'asin': p['asin'], 'link': p['link'], 'title': p['title'], 'amazonPrice': round(p['price']), 'amazonMrp': round(p['mrp'] or 0), 'commission': COMMISSION},
            })
    # Badges and the homepage order come from Amazon's own signals: rating, review count and price.
    for p in products:
        if p['rating'] >= 4 and p['reviews'] >= 900: p['badge'] = 'Bestseller'
        elif p['price'] < 500: p['badge'] = 'Under ₹500'
        elif p['mrp'] and p['price'] <= p['mrp'] * .25: p['badge'] = f"{round((1 - p['price'] / p['mrp']) * 100)}% off"
    for cat in CATEGORIES:
        top = sorted((p for p in products if p['category'] == cat['id']), key=lambda p: p['rating'] * min(p['reviews'], 1000), reverse=True)
        for p in top[:3]: p['featured'] = True
    json.dump({'store': STORE, 'categories': CATEGORIES, 'products': products}, open(OUT, 'w'), indent=2, ensure_ascii=False)
    print('wrote', OUT, len(products), 'products')
    for p in products: print(f"{p['id']:16} ₹{p['source']['amazonPrice']:>5} → ₹{p['price']:>5}  {p['name']}  [{p['colour']}]")

build()
